'use client';

import React, { useState } from 'react';
import { Claim, FoundItem, UserProfile } from '../lib/types';
import { 
  ClipboardCheck, 
  Search, 
  User, 
  Lock, 
  HandCoins
} from 'lucide-react';

interface ClaimInboxProps {
  claims: Claim[];
  foundItems: FoundItem[];
  currentUser: UserProfile;
  onReviewClaim: (claim: Claim) => void;
  onInitiateHandover: (claim: Claim) => void;
}

export default function ClaimInbox({
  claims,
  foundItems,
  currentUser,
  onReviewClaim,
  onInitiateHandover,
}: ClaimInboxProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClaims = claims.filter((claim) => {
    if (filterStatus !== 'ALL' && claim.status !== filterStatus) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        claim.claimCode.toLowerCase().includes(q) ||
        claim.claimantName.toLowerCase().includes(q) ||
        claim.claimantStudentId.toLowerCase().includes(q) ||
        (claim.foundItemTitle || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SUBMITTED':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/60 dark:text-blue-300 dark:border-blue-800';
      case 'UNDER_REVIEW':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-800';
      case 'APPROVED':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-800';
      case 'COMPLETED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-950/60 dark:text-red-300 dark:border-red-800';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#E0E0E0] dark:border-[#333333] shadow-xs flex flex-wrap items-center justify-between gap-3 transition-colors">
        <div className="flex items-center space-x-1.5 flex-wrap">
          {['ALL', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'COMPLETED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-2.5 py-1 text-xs rounded-full font-medium transition-all duration-150 active:scale-95 ${
                filterStatus === st 
                  ? 'bg-[#0F6CBD] text-white shadow-xs' 
                  : 'bg-[#F5F5F5] dark:bg-[#2B2B2B] text-[#424242] dark:text-[#CCC] hover:bg-[#EBEBEB] dark:hover:bg-[#333]'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#707070]" />
          <input
            type="text"
            placeholder="Search claims..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-8 pr-2.5 text-xs bg-[#F5F5F5] dark:bg-[#2A2A2A] text-[#242424] dark:text-[#E0E0E0] border border-transparent rounded focus:bg-white dark:focus:bg-[#222] focus:border-[#0F6CBD] outline-none transition-all duration-150"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#202020] rounded-lg border border-[#EDEBE9] dark:border-[#333333] overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#242424] dark:text-[#E0E0E0]">
            <thead className="bg-[#F8F8F8] dark:bg-[#262626] border-b border-[#E0E0E0] dark:border-[#333333] text-[11px] font-semibold text-[#616161] dark:text-[#888]">
              <tr>
                <th className="py-2.5 px-3">Claim</th>
                <th className="py-2.5 px-3">Claimant</th>
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">Proof Provided</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBE9] dark:divide-[#2D2D2D]">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-xs text-[#707070]">
                    No claims.
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => {
                  const targetItem = foundItems.find((i) => i.id === claim.foundItemId);
                  const isHighVal = targetItem?.isHighValue || claim.isHighValue;

                  return (
                    <tr key={claim.id} className="hover:bg-[#F9FAFB] dark:hover:bg-[#2A2A2A] transition-colors duration-150">
                      
                      {/* Claim Code */}
                      <td className="py-2.5 px-3 font-mono font-medium text-[#0F6CBD] dark:text-[#479EF5]">
                        {claim.claimCode}
                      </td>

                      {/* Claimant */}
                      <td className="py-2.5 px-3">
                        <div className="font-semibold flex items-center space-x-1">
                          <User className="w-3.5 h-3.5 text-[#707070]" />
                          <span>{claim.claimantName}</span>
                        </div>
                      </td>

                      {/* Target Item */}
                      <td className="py-2.5 px-3">
                        <div className="font-medium flex items-center space-x-1">
                          <span>{claim.foundItemTitle}</span>
                          {isHighVal && <Lock className="w-3 h-3 text-red-600" />}
                        </div>
                        <div className="text-[10px] text-[#707070] dark:text-[#888] font-mono">{claim.foundItemCode}</div>
                      </td>

                      {/* Submitted Proof */}
                      <td className="py-2.5 px-3 max-w-xs truncate text-[#424242] dark:text-[#CCC]">
                        {claim.identifyingMarksProvided}
                      </td>

                      {/* Status */}
                      <td className="py-2.5 px-3">
                        <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold font-mono border ${getStatusBadge(claim.status)}`}>
                          {claim.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-2.5 px-3 text-right">
                        {claim.status === 'APPROVED' ? (
                          <button
                            onClick={() => onInitiateHandover(claim)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 inline-flex items-center space-x-1"
                          >
                            <HandCoins className="w-3.5 h-3.5" />
                            <span>Handover</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => onReviewClaim(claim)}
                            className="px-2.5 py-1 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 inline-flex items-center space-x-1"
                          >
                            <ClipboardCheck className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        )}
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
