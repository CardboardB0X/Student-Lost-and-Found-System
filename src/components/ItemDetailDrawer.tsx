'use client';

import React from 'react';
import { FoundItem } from '../lib/types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Archive, 
  Lock, 
  ShieldCheck, 
  Layers, 
  Printer, 
  CheckCircle2, 
  Clock,
  ArrowRight
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ItemDetailDrawerProps {
  item: FoundItem | null;
  isOpen: boolean;
  onClose: () => void;
  onClaimItem: (item: FoundItem) => void;
  canViewSecret: boolean;
}

export default function ItemDetailDrawer({
  item,
  isOpen,
  onClose,
  onClaimItem,
  canViewSecret,
}: ItemDetailDrawerProps) {
  if (!isOpen || !item) return null;

  // Visual chain-of-custody stepper
  const steps = [
    { label: 'Intake', date: item.dateFound, done: true },
    { label: 'Holding', date: item.storageLocationName, done: true },
    { label: 'Claim', date: item.status === 'CLAIM_PENDING' ? 'Active' : undefined, done: item.status === 'CLAIM_PENDING' || item.status === 'RETURNED' },
    { label: 'Release', date: item.status === 'RETURNED' ? 'Returned' : undefined, done: item.status === 'RETURNED' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-200">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-[#202020] shadow-2xl flex flex-col justify-between border-l border-[#E0E0E0] dark:border-[#383838] transform transition-transform duration-300 ease-in-out">
        
        {/* Top Header */}
        <div className="p-4 border-b border-[#EDEBE9] dark:border-[#2F2F2F] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="font-mono text-xs font-bold text-[#0F6CBD] dark:text-[#479EF5]">{item.itemCode}</span>
            {item.isHighValue && <Lock className="w-3.5 h-3.5 text-red-600" />}
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-[#707070] hover:text-[#242424] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2E2E2E] transition-all duration-150 active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs text-[#242424] dark:text-[#E0E0E0]">
          
          {/* Image */}
          <div className="w-full h-48 bg-gray-100 dark:bg-[#1A1A1A] rounded-lg overflow-hidden flex items-center justify-center relative shadow-xs">
            {item.imageUrl ? (
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <Layers className="w-12 h-12 text-gray-300" />
            )}
            <span className="absolute bottom-2 left-2 text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-black/75 text-white">
              {item.status}
            </span>
          </div>

          {/* Title & Category */}
          <div>
            <span className="text-[10px] font-mono text-[#0F6CBD] dark:text-[#479EF5] uppercase font-bold">
              {item.categoryName}
            </span>
            <h2 className="text-base font-bold text-[#242424] dark:text-white mt-0.5">
              {item.title}
            </h2>
            <p className="text-[#616161] dark:text-[#A0A0A0] mt-1.5 leading-relaxed">
              {item.publicDescription}
            </p>
          </div>

          {/* Metadata Cards */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-gray-50 dark:bg-[#282828] rounded border border-gray-200 dark:border-[#383838]">
              <span className="text-[#707070] dark:text-[#888] block text-[10px] uppercase font-mono">Location</span>
              <span className="font-semibold">{item.locationFound}</span>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-[#282828] rounded border border-gray-200 dark:border-[#383838]">
              <span className="text-[#707070] dark:text-[#888] block text-[10px] uppercase font-mono">Date</span>
              <span className="font-semibold">{item.dateFound}</span>
            </div>
            <div className="p-2.5 bg-gray-50 dark:bg-[#282828] rounded border border-gray-200 dark:border-[#383838] col-span-2">
              <span className="text-[#707070] dark:text-[#888] block text-[10px] uppercase font-mono">Storage Bin</span>
              <span className="font-semibold flex items-center space-x-1">
                <Archive className="w-3.5 h-3.5 text-[#0F6CBD]" />
                <span>{item.storageLocationName}</span>
              </span>
            </div>
          </div>

          {/* Confidential Clues (If authorized) */}
          {canViewSecret && (
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded border border-amber-300 dark:border-amber-800 space-y-1">
              <span className="text-[10px] font-bold text-amber-900 dark:text-amber-400 font-mono uppercase flex items-center space-x-1">
                <Lock className="w-3 h-3" />
                <span>Confidential Secret Key</span>
              </span>
              <p className="font-mono text-amber-950 dark:text-amber-200 text-[11px] select-text">
                {item.privateVerificationDetails}
              </p>
            </div>
          )}

          {/* Visual Chain-of-Custody Stepper */}
          <div className="pt-2">
            <span className="text-[10px] font-bold text-[#707070] uppercase font-mono tracking-wider block mb-2">
              Chain of Custody Status
            </span>
            <div className="flex items-center justify-between text-[11px]">
              {steps.map((st, idx) => (
                <div key={idx} className="flex-1 text-center relative">
                  <div className={`w-6 h-6 mx-auto rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-200 ${
                    st.done ? 'bg-[#0F6CBD] text-white shadow-xs' : 'bg-gray-200 dark:bg-[#333] text-gray-500'
                  }`}>
                    {st.done ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>
                  <span className="block mt-1 font-semibold text-[10px] text-[#242424] dark:text-[#E0E0E0]">{st.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Storage QR Code */}
          <div className="p-3 bg-gray-50 dark:bg-[#282828] rounded border border-gray-200 dark:border-[#383838] flex items-center space-x-3">
            <div className="bg-white p-1 rounded">
              <QRCodeSVG value={`SYS:${item.itemCode}`} size={56} />
            </div>
            <div>
              <span className="text-[10px] font-mono text-[#707070] dark:text-[#888] block">Bin Label Barcode</span>
              <span className="font-mono font-bold text-[#0F6CBD] dark:text-[#479EF5] text-xs">{item.itemCode}</span>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-[#EDEBE9] dark:border-[#2F2F2F] flex items-center space-x-2">
          <button
            onClick={() => {
              onClaimItem(item);
              onClose();
            }}
            className="flex-1 py-2 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 flex items-center justify-center space-x-1.5"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Submit Claim</span>
          </button>
          <button
            onClick={() => window.print()}
            title="Print Label"
            className="p-2 border border-[#D1D1D1] dark:border-[#383838] rounded hover:bg-gray-100 dark:hover:bg-[#2C2C2C] text-[#424242] dark:text-[#E0E0E0] active:scale-90 transition-all"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
