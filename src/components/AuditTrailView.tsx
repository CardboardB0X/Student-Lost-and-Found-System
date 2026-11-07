'use client';

import React, { useState } from 'react';
import { AuditLog } from '../lib/types';
import { FileCode } from 'lucide-react';

interface AuditTrailViewProps {
  logs: AuditLog[];
}

export default function AuditTrailView({ logs }: AuditTrailViewProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredLogs = logs.filter((log) => {
    if (filterType !== 'ALL' && log.entityType !== filterType) return false;
    return true;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Filter Tabs */}
      <div className="flex items-center space-x-1.5 bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#E0E0E0] dark:border-[#333333] shadow-xs transition-colors">
        {['ALL', 'FOUND_ITEM', 'CLAIM'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-150 active:scale-95 ${
              filterType === t 
                ? 'bg-[#0F6CBD] text-white shadow-xs' 
                : 'bg-[#F5F5F5] dark:bg-[#2B2B2B] text-[#424242] dark:text-[#CCC] hover:bg-[#EBEBEB] dark:hover:bg-[#333]'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-[#202020] rounded-lg border border-[#EDEBE9] dark:border-[#333333] overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#242424] dark:text-[#E0E0E0]">
            <thead className="bg-[#F8F8F8] dark:bg-[#262626] border-b border-[#E0E0E0] dark:border-[#333333] text-[11px] font-semibold text-[#616161] dark:text-[#888]">
              <tr>
                <th className="py-2.5 px-3">Event</th>
                <th className="py-2.5 px-3">Timestamp</th>
                <th className="py-2.5 px-3">Actor</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Entity</th>
                <th className="py-2.5 px-3">IP</th>
                <th className="py-2.5 px-3 text-right">Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBE9] dark:divide-[#2D2D2D]">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#F9FAFB] dark:hover:bg-[#2A2A2A] transition-colors duration-150">
                  <td className="py-2.5 px-3 font-mono font-bold text-[#0F6CBD] dark:text-[#479EF5]">
                    #{log.id}
                  </td>
                  <td className="py-2.5 px-3 text-[#616161] dark:text-[#AAA] font-mono text-[11px]">
                    {log.createdAt}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold">{log.actorName}</span>
                    <span className="ml-1 text-[9px] px-1 py-0.2 rounded font-mono bg-gray-100 dark:bg-[#333] text-gray-700 dark:text-gray-300">
                      {log.actorRole}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-xs text-[#424242] dark:text-[#CCC]">
                    {log.entityType}
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-[#707070] dark:text-[#888]">
                    {log.actorIp}
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <button
                      onClick={() => setSelectedLog(log)}
                      title="Inspect JSON"
                      className="p-1 hover:bg-slate-100 dark:hover:bg-[#333] rounded text-slate-600 dark:text-[#AAA] hover:text-black dark:hover:text-white transition-all duration-150 active:scale-90"
                    >
                      <FileCode className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* JSON Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#202020] rounded-xl p-5 max-w-lg w-full border border-[#D1D1D1] dark:border-[#383838] shadow-2xl space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEBE9] dark:border-[#303030]">
              <span className="font-mono text-xs font-bold text-[#0F6CBD] dark:text-[#479EF5]">
                #{selectedLog.id} • {selectedLog.action}
              </span>
              <button 
                onClick={() => setSelectedLog(null)}
                className="text-[#707070] dark:text-[#AAA] hover:text-[#242424] dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <pre className="p-3 bg-[#1E1E1E] text-[#D4D4D4] rounded-md text-[11px] font-mono overflow-x-auto max-h-56">
              {JSON.stringify(selectedLog, null, 2)}
            </pre>

            <div className="flex justify-end pt-1">
              <button
                onClick={() => setSelectedLog(null)}
                className="px-3 py-1 bg-[#0F6CBD] text-white text-xs font-medium rounded hover:bg-[#115EA3] active:scale-95 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
