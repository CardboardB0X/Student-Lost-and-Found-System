'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Claim, FoundItem, UserProfile } from '../../lib/types';
import { HandCoins, CheckCircle2, PenTool, RotateCcw } from 'lucide-react';
import { PRESET_USERS } from '../../lib/rbac';

interface HandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: Claim | null;
  targetItem: FoundItem | null;
  currentUser: UserProfile;
  onCompleteHandover: (claimId: string, witnessId: string, signature: string) => void;
}

export default function HandoverModal({
  isOpen,
  onClose,
  claim,
  targetItem,
  currentUser,
  onCompleteHandover,
}: HandoverModalProps) {
  const [witnessId, setWitnessId] = useState('usr_04');
  const [typedSignature, setTypedSignature] = useState('');
  const [idVerified, setIdVerified] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Canvas drawing state
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = '#0F6CBD';
        ctx.lineWidth = 2.5;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
      }
    }
  }, [isOpen]);

  if (!isOpen || !claim || !targetItem) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.beginPath();
    ctx.moveTo(clientX - rect.left, clientY - rect.top);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    ctx.lineTo(clientX - rect.left, clientY - rect.top);
    ctx.stroke();
    setHasDrawn(true);
  };

  const stopDrawing = () => {
    isDrawing.current = false;
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  };

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!idVerified || (!hasDrawn && !typedSignature)) {
      alert('Physical ID inspection and signature are required.');
      return;
    }

    const finalSig = hasDrawn && canvasRef.current 
      ? canvasRef.current.toDataURL() 
      : typedSignature;

    onCompleteHandover(claim.id, witnessId, finalSig);
    onClose();
  };

  const witnessCandidates = PRESET_USERS.filter((u) => u.id !== currentUser.id && (u.role === 'CUSTODIAN' || u.role === 'SECURITY_OFFICER' || u.role === 'ADMIN'));

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#202020] rounded-xl max-w-md w-full border border-[#D1D1D1] dark:border-[#383838] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-emerald-700 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <HandCoins className="w-4 h-4" />
            <span className="font-semibold text-xs tracking-tight">Handover: {targetItem.itemCode}</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleFinish} className="p-5 space-y-3.5 text-xs text-[#242424] dark:text-[#E0E0E0]">
          
          <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded border border-emerald-200 dark:border-emerald-800 text-emerald-950 dark:text-emerald-300 flex items-center justify-between">
            <span className="font-semibold">{targetItem.title}</span>
            <span className="font-mono text-[11px]">{claim.claimantName}</span>
          </div>

          {/* ID Checkbox */}
          <div className="p-2.5 bg-slate-50 dark:bg-[#282828] rounded border border-slate-200 dark:border-[#383838]">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={idVerified}
                onChange={(e) => setIdVerified(e.target.checked)}
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-medium">Physical ID Inspected & Confirmed</span>
            </label>
          </div>

          {/* Witness */}
          <div>
            <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#A0A0A0] mb-1">
              Witness / Co-Signer
            </label>
            <select
              value={witnessId}
              onChange={(e) => setWitnessId(e.target.value)}
              className="w-full h-8 px-2 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded focus:border-emerald-600 outline-none bg-white dark:bg-[#262626] transition-colors"
            >
              {witnessCandidates.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name} ({w.role})
                </option>
              ))}
            </select>
          </div>

          {/* Interactive Signature Canvas Pad */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-[#707070] dark:text-[#A0A0A0] flex items-center space-x-1">
                <PenTool className="w-3 h-3" />
                <span>Draw Digital Signature</span>
              </label>
              {hasDrawn && (
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[10px] text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 active:scale-95 transition-all"
                >
                  <RotateCcw className="w-2.5 h-2.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            <div className="border border-dashed border-[#B0B0B0] dark:border-[#444] rounded-lg overflow-hidden bg-white dark:bg-[#181818] relative">
              <canvas
                ref={canvasRef}
                width={360}
                height={100}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full h-24 cursor-crosshair touch-none"
              />
              {!hasDrawn && (
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center text-[11px] text-gray-400 italic">
                  Sign with mouse or stylus here
                </div>
              )}
            </div>

            {/* Fallback Type Signature */}
            <div className="mt-2">
              <input
                type="text"
                placeholder="Or type full legal name..."
                value={typedSignature}
                onChange={(e) => setTypedSignature(e.target.value)}
                className="w-full h-8 px-2.5 text-xs font-serif italic border border-[#D1D1D1] dark:border-[#383838] rounded focus:border-emerald-600 outline-none bg-white dark:bg-[#262626] transition-colors"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#EDEBE9] dark:border-[#2F2F2F]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#D1D1D1] dark:border-[#383838] rounded text-xs text-[#424242] dark:text-[#AAA] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!idVerified || (!hasDrawn && !typedSignature)}
              className={`px-3.5 py-1.5 text-white text-xs font-semibold rounded shadow-xs flex items-center space-x-1 transition-all duration-150 active:scale-95 ${
                idVerified && (hasDrawn || typedSignature)
                  ? 'bg-emerald-600 hover:bg-emerald-700' 
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Release</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
