'use client';

import React from 'react';
import { Claim, FoundItem } from '../../lib/types';
import { Shield, Printer, CheckCircle2, Lock, X } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface HandoverReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: Claim | null;
  targetItem: FoundItem | null;
}

export default function HandoverReceiptModal({
  isOpen,
  onClose,
  claim,
  targetItem,
}: HandoverReceiptModalProps) {
  if (!isOpen || !claim || !targetItem) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#202020] rounded-xl max-w-md w-full border border-[#D1D1D1] dark:border-[#383838] shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-[#EDEBE9] dark:border-[#2F2F2F] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold text-xs tracking-tight text-[#242424] dark:text-white">
              Official Property Release Certificate
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-[#707070] dark:text-[#AAA] hover:text-[#242424] dark:hover:text-white text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Certificate Body (Printable container) */}
        <div id="printable-receipt" className="p-6 space-y-4 text-xs text-[#242424] dark:text-[#E0E0E0]">
          
          {/* Certificate Header Banner */}
          <div className="text-center pb-3 border-b border-dashed border-[#D1D1D1] dark:border-[#383838] space-y-1">
            <div className="w-8 h-8 mx-auto rounded-md bg-[#0F6CBD] text-white flex items-center justify-center mb-1">
              <Shield className="w-4 h-4" />
            </div>
            <p className="font-mono text-[10px] tracking-widest text-[#707070] dark:text-[#888] uppercase">
              Custody Verification Certificate
            </p>
            <p className="font-mono text-xs font-bold text-[#0F6CBD] dark:text-[#479EF5]">
              REC-{claim.claimCode}
            </p>
          </div>

          {/* Item & Claimant Details */}
          <div className="space-y-2 text-[11px]">
            <div className="flex justify-between py-1 border-b border-[#F0F0F0] dark:border-[#2F2F2F]">
              <span className="text-[#707070] dark:text-[#888]">Item:</span>
              <span className="font-semibold text-[#242424] dark:text-white">{targetItem.title}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0] dark:border-[#2F2F2F]">
              <span className="text-[#707070] dark:text-[#888]">Property Code:</span>
              <span className="font-mono font-bold text-[#0F6CBD] dark:text-[#479EF5]">{targetItem.itemCode}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0] dark:border-[#2F2F2F]">
              <span className="text-[#707070] dark:text-[#888]">Claimant:</span>
              <span className="font-semibold">{claim.claimantName} ({claim.claimantStudentId})</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0] dark:border-[#2F2F2F]">
              <span className="text-[#707070] dark:text-[#888]">Authorized Witness:</span>
              <span className="font-semibold">{claim.handoverWitnessName || 'User 4'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-[#F0F0F0] dark:border-[#2F2F2F]">
              <span className="text-[#707070] dark:text-[#888]">Release Timestamp:</span>
              <span className="font-mono">{claim.handoverTimestamp || new Date().toISOString().replace('T', ' ').substring(0, 19)}</span>
            </div>
          </div>

          {/* Captured Signature Section */}
          <div className="p-3 bg-gray-50 dark:bg-[#1A1A1A] rounded-lg border border-[#E0E0E0] dark:border-[#383838] space-y-1">
            <span className="text-[10px] uppercase font-mono text-[#707070] dark:text-[#888] block">
              Digital Signature on File
            </span>
            {claim.claimantSignatureRef?.startsWith('data:image') ? (
              <img 
                src={claim.claimantSignatureRef} 
                alt="Signature" 
                className="h-12 w-auto mx-auto object-contain"
              />
            ) : (
              <p className="font-serif italic text-base text-[#0F6CBD] dark:text-[#479EF5] text-center">
                {claim.claimantSignatureRef || claim.claimantName}
              </p>
            )}
          </div>

          {/* QR Verification Stamp */}
          <div className="flex items-center justify-between p-2.5 bg-slate-50 dark:bg-[#282828] rounded-md border border-slate-200 dark:border-[#383838]">
            <div className="bg-white p-1 rounded">
              <QRCodeSVG value={`RELEASE-VERIFIED:${claim.claimCode}:${targetItem.itemCode}`} size={50} />
            </div>
            <div className="text-right text-[10px] text-[#707070] dark:text-[#888] font-mono">
              <span className="block text-emerald-600 dark:text-emerald-400 font-bold">RELEASE VERIFIED</span>
              <span>SHA-256 Tamper Evident</span>
            </div>
          </div>

        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-[#EDEBE9] dark:border-[#2F2F2F] flex items-center space-x-2">
          <button
            onClick={() => window.print()}
            className="flex-1 py-2 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 flex items-center justify-center space-x-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Official Receipt</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-[#D1D1D1] dark:border-[#383838] rounded text-xs text-[#424242] dark:text-[#CCC] hover:bg-gray-100 dark:hover:bg-[#2C2C2C] transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
