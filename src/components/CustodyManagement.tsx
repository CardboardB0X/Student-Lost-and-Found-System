'use client';

import React, { useState } from 'react';
import { FoundItem, StorageLocation } from '../lib/types';
import { 
  Plus, 
  Download, 
  QrCode, 
  Lock, 
  Eye, 
  EyeOff, 
  Printer, 
  Archive, 
  Search,
  CheckSquare,
  Square,
  Trash2,
  Gift,
  Gavel
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface CustodyManagementProps {
  items: FoundItem[];
  locations: StorageLocation[];
  onOpenLogModal: () => void;
  onUpdateStatus: (itemId: string, newStatus: any) => void;
  onBatchUpdateStatus?: (itemIds: string[], newStatus: any) => void;
}

export default function CustodyManagement({
  items,
  locations,
  onOpenLogModal,
  onUpdateStatus,
  onBatchUpdateStatus,
}: CustodyManagementProps) {
  const [filterVaultOnly, setFilterVaultOnly] = useState(false);
  const [showSecretMap, setShowSecretMap] = useState<Record<string, boolean>>({});
  const [activeQrItem, setActiveQrItem] = useState<FoundItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

  const toggleSecret = (id: string) => {
    setShowSecretMap((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredItems = items.filter((item) => {
    if (filterVaultOnly && !item.isSecureVault) return false;
    if (searchTerm.trim() !== '') {
      const q = searchTerm.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.itemCode.toLowerCase().includes(q) ||
        (item.storageLocationName || '').toLowerCase().includes(q) ||
        (item.brand || '').toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Batch Selection Handlers
  const isAllSelected = filteredItems.length > 0 && selectedItemIds.length === filteredItems.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedItemIds([]);
    } else {
      setSelectedItemIds(filteredItems.map(i => i.id));
    }
  };

  const handleToggleRow = (id: string) => {
    setSelectedItemIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleBatchStatus = (newStatus: string) => {
    if (onBatchUpdateStatus) {
      onBatchUpdateStatus(selectedItemIds, newStatus);
    } else {
      selectedItemIds.forEach(id => onUpdateStatus(id, newStatus));
    }
    setSelectedItemIds([]);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Command Bar */}
      <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#E0E0E0] dark:border-[#333333] shadow-xs flex flex-wrap items-center justify-between gap-3 transition-colors">
        
        <div className="flex items-center space-x-2 flex-1 min-w-[240px] max-w-sm">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#707070]" />
            <input
              type="text"
              placeholder="Filter..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-8 pl-8 pr-2.5 text-xs bg-[#F5F5F5] dark:bg-[#2A2A2A] text-[#242424] dark:text-[#E0E0E0] border border-transparent rounded focus:bg-white dark:focus:bg-[#222] focus:border-[#0F6CBD] outline-none transition-all duration-150"
            />
          </div>

          <button
            onClick={() => setFilterVaultOnly(!filterVaultOnly)}
            title="Vault items only"
            className={`p-1.5 text-xs rounded border transition-all duration-150 active:scale-95 flex items-center space-x-1 ${
              filterVaultOnly 
                ? 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 font-semibold' 
                : 'border-[#D1D1D1] dark:border-[#383838] bg-white dark:bg-[#282828] text-[#242424] dark:text-[#E0E0E0] hover:bg-[#F5F5F5] dark:hover:bg-[#303030]'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenLogModal}
            className="px-3 py-1.5 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>

          <button 
            onClick={() => alert('Exported.')}
            title="Export CSV"
            className="p-1.5 border border-[#D1D1D1] dark:border-[#383838] rounded bg-white dark:bg-[#282828] text-[#424242] dark:text-[#E0E0E0] hover:bg-[#F5F5F5] dark:hover:bg-[#303030] transition-all duration-150 active:scale-95"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Floating Batch Actions Bar (When items selected) */}
      {selectedItemIds.length > 0 && (
        <div className="p-2.5 bg-[#0F6CBD] text-white rounded-lg shadow-md flex items-center justify-between animate-in slide-in-from-top-2 duration-150 text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-semibold px-2 py-0.5 bg-white/20 rounded-md font-mono">
              {selectedItemIds.length} Selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-white/80">Batch Status:</span>
            <button
              onClick={() => handleBatchStatus('DONATED')}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded font-medium flex items-center space-x-1 active:scale-95 transition-all"
            >
              <Gift className="w-3 h-3" />
              <span>Donate</span>
            </button>
            <button
              onClick={() => handleBatchStatus('AUCTIONED')}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded font-medium flex items-center space-x-1 active:scale-95 transition-all"
            >
              <Gavel className="w-3 h-3" />
              <span>Auction</span>
            </button>
            <button
              onClick={() => handleBatchStatus('DISPOSED')}
              className="px-2 py-1 bg-white/10 hover:bg-white/20 rounded font-medium flex items-center space-x-1 active:scale-95 transition-all"
            >
              <Trash2 className="w-3 h-3" />
              <span>Dispose</span>
            </button>
            <button
              onClick={() => setSelectedItemIds([])}
              className="text-white/80 hover:text-white px-2 py-1 ml-2 text-[11px] font-bold"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Data Grid */}
      <div className="bg-white dark:bg-[#202020] rounded-lg border border-[#EDEBE9] dark:border-[#333333] overflow-hidden shadow-xs transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#242424] dark:text-[#E0E0E0]">
            <thead className="bg-[#F8F8F8] dark:bg-[#262626] border-b border-[#E0E0E0] dark:border-[#333333] text-[11px] font-semibold text-[#616161] dark:text-[#888]">
              <tr>
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleToggleSelectAll}
                    className="rounded border-gray-300 text-[#0F6CBD] focus:ring-[#0F6CBD] cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-3">Code</th>
                <th className="py-2.5 px-3">Item</th>
                <th className="py-2.5 px-3">Bin</th>
                <th className="py-2.5 px-3">Verification Key (Secret)</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBE9] dark:divide-[#2D2D2D]">
              {filteredItems.map((item) => {
                const isSecretShown = showSecretMap[item.id] || false;
                const isSelected = selectedItemIds.includes(item.id);
                return (
                  <tr 
                    key={item.id} 
                    className={`transition-colors duration-150 ${
                      isSelected 
                        ? 'bg-blue-50/50 dark:bg-blue-950/20' 
                        : 'hover:bg-[#F9FAFB] dark:hover:bg-[#2A2A2A]'
                    }`}
                  >
                    
                    {/* Row Select Checkbox */}
                    <td className="py-2.5 px-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleRow(item.id)}
                        className="rounded border-gray-300 text-[#0F6CBD] focus:ring-[#0F6CBD] cursor-pointer"
                      />
                    </td>

                    {/* Item Code */}
                    <td className="py-2.5 px-3 font-mono font-medium text-[#0F6CBD] dark:text-[#479EF5]">
                      <div className="flex items-center space-x-1.5">
                        <span>{item.itemCode}</span>
                        {item.isSecureVault && <Lock className="w-3 h-3 text-red-600" />}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-2.5 px-3 font-medium">
                      <div>{item.title}</div>
                      <div className="text-[10px] text-[#707070] dark:text-[#888]">{item.dateFound}</div>
                    </td>

                    {/* Storage Location */}
                    <td className="py-2.5 px-3 text-[#616161] dark:text-[#AAA]">
                      <div className="flex items-center space-x-1">
                        <Archive className="w-3 h-3 text-[#0F6CBD]" />
                        <span>{item.storageLocationName}</span>
                      </div>
                    </td>

                    {/* Secret Verification */}
                    <td className="py-2.5 px-3 max-w-xs">
                      <div className="flex items-center justify-between p-1.5 bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 rounded text-[11px] transition-colors">
                        <span className="font-mono text-amber-950 dark:text-amber-200 truncate select-text pr-2">
                          {isSecretShown ? item.privateVerificationDetails : '••••••••••••'}
                        </span>
                        <button
                          onClick={() => toggleSecret(item.id)}
                          className="text-amber-800 dark:text-amber-400 hover:text-amber-950 p-0.5 rounded transition-transform active:scale-90"
                        >
                          {isSecretShown ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-2.5 px-3">
                      <select
                        value={item.status}
                        onChange={(e) => onUpdateStatus(item.id, e.target.value)}
                        className="text-[11px] bg-[#F5F5F5] dark:bg-[#2B2B2B] text-[#242424] dark:text-[#E0E0E0] border border-[#D1D1D1] dark:border-[#383838] rounded px-1.5 py-0.5 font-semibold focus:outline-none focus:border-[#0F6CBD] transition-colors"
                      >
                        <option value="STORED">STORED</option>
                        <option value="CLAIM_PENDING">CLAIM_PENDING</option>
                        <option value="RETURNED">RETURNED</option>
                        <option value="AUCTIONED">AUCTIONED</option>
                        <option value="DONATED">DONATED</option>
                        <option value="DISPOSED">DISPOSED</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => setActiveQrItem(item)}
                        title="Print QR"
                        className="p-1 border border-[#D1D1D1] dark:border-[#383838] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] rounded text-[#424242] dark:text-[#E0E0E0] transition-all duration-150 active:scale-90"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Modal */}
      {activeQrItem && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-[#242424] rounded-lg p-5 max-w-xs w-full border border-[#D1D1D1] dark:border-[#383838] shadow-xl space-y-3 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#EDEBE9] dark:border-[#333]">
              <span className="font-mono text-xs font-bold text-[#0F6CBD] dark:text-[#479EF5]">{activeQrItem.itemCode}</span>
              <button 
                onClick={() => setActiveQrItem(null)}
                className="text-[#707070] dark:text-[#AAA] hover:text-[#242424] dark:hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-[#FAFAFA] dark:bg-[#1E1E1E] rounded border border-dashed border-[#C8C6C4] dark:border-[#444] text-center space-y-2">
              <div className="bg-white p-1 inline-block rounded">
                <QRCodeSVG 
                  value={`SYS:${activeQrItem.itemCode}`} 
                  size={120}
                  className="mx-auto"
                />
              </div>
              <p className="font-semibold text-xs text-[#242424] dark:text-white truncate">{activeQrItem.title}</p>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <button
                onClick={() => window.print()}
                className="flex-1 py-1.5 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded shadow-xs transition-all duration-150 flex items-center justify-center space-x-1"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={() => setActiveQrItem(null)}
                className="px-3 py-1.5 border border-[#D1D1D1] dark:border-[#383838] rounded text-xs text-[#424242] dark:text-[#CCC] hover:bg-[#F5F5F5] dark:hover:bg-[#333] transition-colors"
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
