'use client';

import React, { useState } from 'react';
import { FoundItem, UserProfile, Claim } from '../../lib/types';
import { ShieldCheck, Lock, Send } from 'lucide-react';

interface FileClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetItem: FoundItem | null;
  currentUser: UserProfile;
  onSubmitClaim: (claimData: Partial<Claim>) => void;
}

export default function FileClaimModal({
  isOpen,
  onClose,
  targetItem,
  currentUser,
  onSubmitClaim,
}: FileClaimModalProps) {
  const [proofDescription, setProofDescription] = useState('');
  const [identifyingMarks, setIdentifyingMarks] = useState('');
  const [agreementChecked, setAgreementChecked] = useState(false);

  if (!isOpen || !targetItem) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!proofDescription || !identifyingMarks || !agreementChecked) {
      alert('Please fill out all verification fields and confirm ownership.');
      return;
    }

    onSubmitClaim({
      foundItemId: targetItem.id,
      foundItemTitle: targetItem.title,
      foundItemCode: targetItem.itemCode,
      isHighValue: targetItem.isHighValue,
      claimantId: currentUser.id,
      claimantName: currentUser.name,
      claimantStudentId: currentUser.studentStaffId,
      claimantEmail: currentUser.email,
      proofDescription,
      identifyingMarksProvided: identifyingMarks,
      status: 'SUBMITTED',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white dark:bg-[#202020] rounded-xl max-w-lg w-full border border-[#D1D1D1] dark:border-[#383838] shadow-2xl overflow-hidden my-6 animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0F6CBD] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="font-semibold text-xs tracking-tight">Submit Claim</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-3.5 text-xs text-[#242424] dark:text-[#E0E0E0]">
          
          <div className="p-2.5 bg-gray-50 dark:bg-[#282828] rounded border border-gray-200 dark:border-[#383838] flex items-center justify-between">
            <div>
              <span className="font-mono text-[10px] text-[#0F6CBD] dark:text-[#479EF5] font-bold">{targetItem.itemCode}</span>
              <p className="font-semibold text-xs">{targetItem.title}</p>
            </div>
            {targetItem.isHighValue && (
              <span className="text-[9px] px-1.5 py-0.5 rounded font-bold font-mono bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300">
                VAULT
              </span>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
              1. Where and when did you lose this item? *
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Left on table in Hall 3B on Monday..."
              value={proofDescription}
              onChange={(e) => setProofDescription(e.target.value)}
              required
              className="w-full p-2 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#707070] dark:text-[#AAA] mb-1">
              2. Secret Proof (Serial #, Wallpaper, Engraving, Contents) *
            </label>
            <textarea
              rows={2}
              placeholder="Provide distinguishing features only the owner knows..."
              value={identifyingMarks}
              onChange={(e) => setIdentifyingMarks(e.target.value)}
              required
              className="w-full p-2 text-xs border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#242424] dark:text-white focus:border-[#0F6CBD] outline-none transition-colors"
            />
          </div>

          <div className="pt-1">
            <label className="flex items-start space-x-2 cursor-pointer text-[11px] text-[#616161] dark:text-[#AAA]">
              <input
                type="checkbox"
                checked={agreementChecked}
                onChange={(e) => setAgreementChecked(e.target.checked)}
                className="mt-0.5 rounded border-gray-300 text-[#0F6CBD] focus:ring-[#0F6CBD]"
              />
              <span>I confirm under institutional code that this property belongs to me.</span>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#EDEBE9] dark:border-[#2F2F2F]">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-[#D1D1D1] dark:border-[#383838] rounded text-xs text-[#424242] dark:text-[#CCC] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!agreementChecked}
              className={`px-3.5 py-1.5 text-white text-xs font-semibold rounded shadow-xs flex items-center space-x-1 transition-all duration-150 active:scale-95 ${
                agreementChecked ? 'bg-[#0F6CBD] hover:bg-[#115EA3]' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
