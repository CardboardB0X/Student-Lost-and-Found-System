'use client';

import React from 'react';
import { FoundItem } from '../lib/types';
import { Trash2, Gift, Gavel } from 'lucide-react';

interface DisposalScheduleProps {
  items: FoundItem[];
  onUpdateStatus: (itemId: string, status: any) => void;
}

export default function DisposalSchedule({ items, onUpdateStatus }: DisposalScheduleProps) {
  const storedItems = items.filter(
    (i) => i.status === 'STORED' || i.status === 'AUCTIONED' || i.status === 'DONATED' || i.status === 'DISPOSED'
  );

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Category Actions Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#EDEBE9] dark:border-[#333333] shadow-xs flex items-center space-x-2 text-blue-700 dark:text-blue-400">
          <Gift className="w-4 h-4" />
          <span className="text-xs font-semibold">Donation</span>
        </div>
        <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#EDEBE9] dark:border-[#333333] shadow-xs flex items-center space-x-2 text-purple-700 dark:text-purple-400">
          <Gavel className="w-4 h-4" />
          <span className="text-xs font-semibold">Auction</span>
        </div>
        <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#EDEBE9] dark:border-[#333333] shadow-xs flex items-center space-x-2 text-red-700 dark:text-red-400">
          <Trash2 className="w-4 h-4" />
          <span className="text-xs font-semibold">Disposal</span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#202020] rounded-lg border border-[#EDEBE9] dark:border-[#333333] overflow-hidden shadow-xs transition-colors">
        <table className="w-full text-left text-xs text-[#242424] dark:text-[#E0E0E0]">
          <thead className="bg-[#F8F8F8] dark:bg-[#262626] border-b border-[#E0E0E0] dark:border-[#333333] text-[11px] font-semibold text-[#616161] dark:text-[#888]">
            <tr>
              <th className="py-2.5 px-3">Code</th>
              <th className="py-2.5 px-3">Item</th>
              <th className="py-2.5 px-3">Category</th>
              <th className="py-2.5 px-3">Date</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEBE9] dark:divide-[#2D2D2D]">
            {storedItems.map((item) => (
              <tr key={item.id} className="hover:bg-[#F9FAFB] dark:hover:bg-[#2A2A2A] transition-colors duration-150">
                <td className="py-2.5 px-3 font-mono font-medium text-[#0F6CBD] dark:text-[#479EF5]">{item.itemCode}</td>
                <td className="py-2.5 px-3 font-semibold">{item.title}</td>
                <td className="py-2.5 px-3 text-[#616161] dark:text-[#AAA]">{item.categoryName}</td>
                <td className="py-2.5 px-3 text-[#616161] dark:text-[#AAA] font-mono">{item.dateFound}</td>
                <td className="py-2.5 px-3">
                  <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#333] text-gray-800 dark:text-gray-200">
                    {item.status}
                  </span>
                </td>
                <td className="py-2.5 px-3 text-right space-x-1">
                  {item.status === 'STORED' ? (
                    <>
                      <button
                        onClick={() => onUpdateStatus(item.id, 'DONATED')}
                        title="Donate"
                        className="p-1 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded transition-all duration-150 active:scale-90"
                      >
                        <Gift className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(item.id, 'AUCTIONED')}
                        title="Auction"
                        className="p-1 text-purple-700 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded transition-all duration-150 active:scale-90"
                      >
                        <Gavel className="w-3.5 h-3.5 inline" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(item.id, 'DISPOSED')}
                        title="Dispose"
                        className="p-1 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded transition-all duration-150 active:scale-90"
                      >
                        <Trash2 className="w-3.5 h-3.5 inline" />
                      </button>
                    </>
                  ) : (
                    <span className="text-[10px] text-gray-400">Archived</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
