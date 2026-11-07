'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  PackageSearch, 
  Archive, 
  ClipboardCheck, 
  FileQuestion, 
  ShieldAlert, 
  CalendarClock, 
  Plus, 
  User, 
  ArrowRight,
  Sparkles,
  Command
} from 'lucide-react';
import { FoundItem, UserProfile } from '../lib/types';
import { PRESET_USERS } from '../lib/rbac';
import { NavTab } from './Sidebar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab: (tab: NavTab) => void;
  onSelectUser: (user: UserProfile) => void;
  onOpenLogModal: () => void;
  onOpenReportModal: () => void;
  onSelectItem: (item: FoundItem) => void;
  foundItems: FoundItem[];
}

export default function CommandPalette({
  isOpen,
  onClose,
  onSelectTab,
  onSelectUser,
  onOpenLogModal,
  onOpenReportModal,
  onSelectItem,
  foundItems,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Build searchable commands list
  const tabCommands = [
    { id: 'tab_catalog', label: 'Catalog', icon: PackageSearch, action: () => onSelectTab('catalog'), section: 'Navigation' },
    { id: 'tab_custody', label: 'Custody', icon: Archive, action: () => onSelectTab('custody'), section: 'Navigation' },
    { id: 'tab_claims', label: 'Claims', icon: ClipboardCheck, action: () => onSelectTab('claims'), section: 'Navigation' },
    { id: 'tab_reports', label: 'Reports', icon: FileQuestion, action: () => onSelectTab('lostReports'), section: 'Navigation' },
    { id: 'tab_audit', label: 'Audit', icon: ShieldAlert, action: () => onSelectTab('audit'), section: 'Navigation' },
    { id: 'tab_retention', label: 'Disposal', icon: CalendarClock, action: () => onSelectTab('retention'), section: 'Navigation' },
  ];

  const actionCommands = [
    { id: 'act_log', label: 'Log Item (Vault)', icon: Plus, action: onOpenLogModal, section: 'Actions' },
    { id: 'act_report', label: 'Report Lost', icon: Sparkles, action: onOpenReportModal, section: 'Actions' },
  ];

  const userCommands = PRESET_USERS.map((u) => ({
    id: `user_${u.id}`,
    label: `${u.name} (${u.role})`,
    icon: User,
    action: () => onSelectUser(u),
    section: 'Roles',
  }));

  const itemCommands = foundItems.map((i) => ({
    id: `item_${i.id}`,
    label: `${i.itemCode}: ${i.title}`,
    icon: PackageSearch,
    action: () => onSelectItem(i),
    section: 'Items',
  }));

  const allItems = [...tabCommands, ...actionCommands, ...userCommands, ...itemCommands];

  const filtered = query.trim() === ''
    ? allItems.slice(0, 10)
    : allItems.filter((cmd) => cmd.label.toLowerCase().includes(query.toLowerCase())).slice(0, 10);

  const handleSelect = (cmd: typeof allItems[0]) => {
    cmd.action();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-start justify-center z-50 pt-20 p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white dark:bg-[#202020] rounded-xl max-w-lg w-full border border-[#D1D1D1] dark:border-[#383838] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-3.5 py-3 border-b border-[#EDEBE9] dark:border-[#2F2F2F]">
          <Search className="w-4 h-4 text-[#707070] mr-2.5 flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Type command, item, or role..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full text-xs bg-transparent text-[#242424] dark:text-[#F3F3F3] outline-none placeholder-[#8A8A8A]"
          />
          <kbd className="text-[10px] font-mono bg-gray-100 dark:bg-[#333] px-1.5 py-0.5 rounded text-gray-500 dark:text-gray-400">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-72 overflow-y-auto p-1.5 space-y-0.5">
          {filtered.length === 0 ? (
            <div className="p-4 text-center text-xs text-[#707070]">
              No matches found.
            </div>
          ) : (
            filtered.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={() => handleSelect(cmd)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between text-xs transition-colors duration-100 ${
                    isSelected 
                      ? 'bg-[#0F6CBD] text-white' 
                      : 'text-[#242424] dark:text-[#E0E0E0] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{cmd.label}</span>
                  </div>
                  <span className={`text-[9px] uppercase font-mono px-1 rounded ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-gray-100 dark:bg-[#333] text-gray-500'
                  }`}>
                    {cmd.section}
                  </span>
                </button>
              );
            })
          )}
        </div>

        {/* Footer info */}
        <div className="px-3 py-1.5 bg-[#F9F9F9] dark:bg-[#1E1E1E] border-t border-[#F0F0F0] dark:border-[#2F2F2F] text-[10px] text-[#707070] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span>Command Palette</span>
        </div>
      </div>
    </div>
  );
}
