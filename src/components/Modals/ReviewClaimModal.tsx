'use client';

import React, { useState } from 'react';
import { Claim, FoundItem, UserProfile } from '../../lib/types';
import { ClipboardCheck, CheckCircle2, XCircle, Lock, User, Shield } from 'lucide-react';

interface ReviewClaimModalProps {
  isOpen: boolean;
  onClose: () => void;
  claim: Claim | null;
  targetItem: FoundItem | null;
  currentUser: UserProfile;
  onDecision: (claimId: string, approved: boolean, notes: string) => void;
}

export default function ReviewClaimModal({
  isOpen,
  onClose,
  claim,
  targetItem,
  currentUser,
  onDecision,
}: ReviewClaimModalProps) {
  const [reviewNotes, setReviewNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  if (!isOpen || !claim || !targetItem) return null;

  const isHighValue = targetItem.isHighValue || claim.isHighValue;

  const handleApprove = () => {
    onDecision(
      claim.id,
      true,
      reviewNotes || `Approved by ${currentUser.name}`
    );
    onClose();
  };

  const handleReject = () => {
    if (!rejectionReason) {
      alert('Enter rejection reason.');
      return;
    }
    onDecision(claim.id, false, rejectionReason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-lg max-w-2xl w-full border border-[#D1D1D1] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#0F6CBD] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="w-4 h-4" />
            <span className="font-semibold text-xs tracking-tight">Verification: {claim.claimCode}</span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-xs font-bold">
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          
          {isHighValue && (
            <div className="p-2.5 bg-red-50 rounded border border-red-200 flex items-center space-x-2 text-xs text-red-900">
              <Lock className="w-3.5 h-3.5 text-red-600 flex-shrink-0" />
              <span>High-Value Vault Item (Dual Sign-Off Mandatory)</span>
            </div>
          )}

          {/* Comparison */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            
            {/* Claimant Submission */}
            <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-slate-200 font-bold text-slate-700">
                <span className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{claim.claimantName}</span>
                </span>
                <span className="font-mono text-[10px]">{claim.claimantStudentId}</span>
              </div>
              <p className="text-[11px] text-[#616161]">
                <strong>Lost:</strong> {claim.proofDescription}
              </p>
              <div className="p-2 bg-white rounded border border-slate-200">
                <span className="text-[10px] text-[#707070] block font-semibold mb-0.5">Submitted Proof:</span>
                <p className="text-[11px] font-medium text-blue-900">{claim.identifyingMarksProvided}</p>
              </div>
            </div>

            {/* Vault Truth */}
            <div className="p-3 bg-amber-50 rounded border border-amber-300 text-xs space-y-2">
              <div className="flex items-center justify-between pb-1 border-b border-amber-200 font-bold text-amber-900">
                <span className="flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-amber-700" />
                  <span>Vault Record</span>
                </span>
                <span className="font-mono text-[10px]">{targetItem.itemCode}</span>
              </div>
              <p className="text-[11px] text-amber-800">
                <strong>Item:</strong> {targetItem.title}
              </p>
              <div className="p-2 bg-white rounded border border-amber-200">
                <span className="text-[10px] text-amber-900 block font-semibold mb-0.5">Secret Key:</span>
                <p className="text-[11px] font-mono text-amber-950 font-semibold">{targetItem.privateVerificationDetails}</p>
              </div>
            </div>

          </div>

          {/* Notes */}
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Review notes..."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              className="w-full h-8 px-2.5 text-xs border border-[#D1D1D1] rounded focus:border-[#0F6CBD] outline-none"
            />
            <input
              type="text"
              placeholder="Reason if rejecting..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-8 px-2.5 text-xs border border-red-200 bg-red-50/50 rounded focus:border-red-500 outline-none text-red-900"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-[#EDEBE9]">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-[#D1D1D1] rounded text-xs text-[#424242] hover:bg-[#F5F5F5] transition-colors"
            >
              Cancel
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleReject}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 flex items-center space-x-1"
              >
                <XCircle className="w-3.5 h-3.5" />
                <span>Reject</span>
              </button>

              <button
                onClick={handleApprove}
                className="px-3.5 py-1.5 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 flex items-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
