'use client';

import React, { useState } from 'react';
import { LostReport, FoundItem } from '../lib/types';
import { Plus, Search, Tag, Sparkles } from 'lucide-react';

interface LostReportsViewProps {
  reports: LostReport[];
  foundItems: FoundItem[];
  onOpenReportModal: () => void;
  onMatchFound: (reportId: string, item: FoundItem) => void;
}

export default function LostReportsView({
  reports,
  foundItems,
  onOpenReportModal,
  onMatchFound,
}: LostReportsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = reports.filter((rep) => {
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        rep.title.toLowerCase().includes(q) ||
        rep.reportCode.toLowerCase().includes(q) ||
        rep.reportedByName.toLowerCase().includes(q) ||
        (rep.brand || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Top Bar */}
      <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#E0E0E0] dark:border-[#333333] shadow-xs flex items-center justify-between gap-3 transition-colors">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#707070]" />
          <input
            type="text"
            placeholder="Search reports..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-8 pl-8 pr-2.5 text-xs bg-[#F5F5F5] dark:bg-[#2A2A2A] text-[#242424] dark:text-[#E0E0E0] border border-transparent rounded focus:bg-white dark:focus:bg-[#222] focus:border-[#0F6CBD] outline-none transition-all duration-150"
          />
        </div>

        <button
          onClick={onOpenReportModal}
          className="px-3 py-1.5 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 flex items-center space-x-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Report</span>
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredReports.map((rep) => {
          const potentialMatches = foundItems.filter(
            (fi) => fi.categoryId === rep.categoryId && (fi.status === 'STORED' || fi.status === 'CLAIM_PENDING')
          );

          return (
            <div key={rep.id} className="bg-white dark:bg-[#202020] rounded-lg border border-[#EDEBE9] dark:border-[#333333] p-4 shadow-xs space-y-2 hover:border-[#C7DCF8] dark:hover:border-[#2886DE] transition-all duration-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-[#0F6CBD] dark:text-[#479EF5]">{rep.reportCode}</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                    {rep.status}
                  </span>
                </div>
                <span className="text-[10px] text-[#707070] dark:text-[#888] font-mono">{rep.dateLost}</span>
              </div>

              <h3 className="text-xs font-semibold text-[#242424] dark:text-white">{rep.title}</h3>

              <p className="text-[11px] text-[#616161] dark:text-[#AAA] leading-relaxed line-clamp-2">
                {rep.description}
              </p>

              <div className="text-[11px] text-[#707070] dark:text-[#888] flex items-center justify-between border-t border-[#F0F0F0] dark:border-[#2D2D2D] pt-2">
                <span>By: <strong>{rep.reportedByName}</strong></span>
                <span>{rep.locationLost || 'Unknown'}</span>
              </div>

              {potentialMatches.length > 0 && (
                <div className="p-2 bg-amber-50/70 dark:bg-amber-950/30 rounded border border-amber-200 dark:border-amber-900/50 text-xs space-y-1">
                  <div className="flex items-center space-x-1 text-amber-900 dark:text-amber-400 font-semibold text-[11px]">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    <span>Vault Match ({potentialMatches.length}):</span>
                  </div>
                  {potentialMatches.slice(0, 1).map((m) => (
                    <div key={m.id} className="flex items-center justify-between bg-white dark:bg-[#282828] p-1 rounded border border-amber-100 dark:border-amber-900/40 text-[11px]">
                      <span className="font-mono text-[#0F6CBD] dark:text-[#479EF5]">{m.itemCode}: {m.title}</span>
                      <button
                        onClick={() => onMatchFound(rep.id, m)}
                        className="px-2 py-0.5 bg-[#0F6CBD] text-white text-[10px] rounded hover:bg-[#115EA3] active:scale-95 transition-all"
                      >
                        Link
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
