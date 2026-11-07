'use client';

import React, { useState } from 'react';
import { UserProfile } from '../lib/types';
import { PRESET_USERS } from '../lib/rbac';
import { 
  Shield, 
  Search, 
  Bell, 
  ChevronDown, 
  Lock,
  Sun,
  Moon,
  Check,
  Clock,
  CheckCheck
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  read: boolean;
  type: 'claim' | 'return' | 'intake';
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  { id: 'notif_1', title: 'Claim filed for LF-26-0042', time: '10m ago', read: false, type: 'claim' },
  { id: 'notif_2', title: 'Intake recorded: LF-26-0041', time: '1h ago', read: false, type: 'intake' },
  { id: 'notif_3', title: 'Item LF-26-0030 returned', time: '2h ago', read: true, type: 'return' },
];

interface HeaderProps {
  currentUser: UserProfile;
  onSelectUser: (user: UserProfile) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pendingClaimsCount: number;
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenCommandPalette: () => void;
}

export default function Header({
  currentUser,
  onSelectUser,
  searchQuery,
  onSearchChange,
  pendingClaimsCount,
  darkMode,
  onToggleDarkMode,
  onOpenCommandPalette,
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getRoleBadgeStyle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
      case 'SECURITY_OFFICER':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
      case 'CUSTODIAN':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
      case 'AUDITOR':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
      case 'STAFF':
        return 'bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-[#202020]/90 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#333333] shadow-xs transition-all duration-200">
      <div className="flex items-center justify-between h-14 px-4 sm:px-6">
        
        {/* Blanked Emblem Symbol */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-md bg-[#0F6CBD] flex items-center justify-center text-white shadow-xs transition-transform duration-200 hover:scale-105 active:scale-95">
            <Shield className="w-4 h-4" />
          </div>
          <div className="hidden sm:flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0F6CBD] animate-pulse" />
            <span className="text-xs text-[#707070] dark:text-[#888] font-mono tracking-widest uppercase">••••••••</span>
          </div>
        </div>

        {/* Global Search with Command Palette Trigger */}
        <div className="flex-1 max-w-sm mx-4">
          <div 
            onClick={onOpenCommandPalette}
            className="relative group cursor-pointer"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#707070] group-hover:text-[#0F6CBD] transition-colors" />
            <input
              type="text"
              readOnly
              placeholder="Search or press Ctrl+K..."
              value={searchQuery}
              className="w-full h-8 pl-9 pr-14 text-xs bg-[#F5F5F5] dark:bg-[#2A2A2A] text-[#242424] dark:text-[#E0E0E0] border border-transparent rounded-md cursor-pointer group-hover:border-[#0F6CBD] transition-all duration-200 outline-none"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center space-x-0.5">
              <kbd className="text-[10px] font-mono bg-gray-200 dark:bg-[#383838] text-gray-500 dark:text-gray-300 px-1 py-0.5 rounded">
                Ctrl
              </kbd>
              <kbd className="text-[10px] font-mono bg-gray-200 dark:bg-[#383838] text-gray-500 dark:text-gray-300 px-1 py-0.5 rounded">
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2">
          
          {/* Dark / Light Mode Toggle Button */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            className="p-2 rounded-md hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] text-[#616161] dark:text-[#A0A0A0] transition-all duration-200 active:scale-90"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 rotate-0 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700 -rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Notifications Center Popover */}
          <div className="relative">
            <button
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setDropdownOpen(false);
              }}
              title="Notifications"
              className="relative p-2 rounded-md hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] text-[#616161] dark:text-[#A0A0A0] transition-transform duration-150 active:scale-90"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 text-[9px] font-bold text-white bg-[#C4314B] rounded-full animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Popover Drawer */}
            {notificationsOpen && (
              <div 
                className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#242424] rounded-xl shadow-xl border border-[#EDEBE9] dark:border-[#383838] overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150"
              >
                <div className="px-3 py-2 border-b border-[#F0F0F0] dark:border-[#303030] flex items-center justify-between">
                  <span className="text-[11px] font-bold text-[#242424] dark:text-white">Notifications</span>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] text-[#0F6CBD] dark:text-[#479EF5] hover:underline flex items-center space-x-1"
                    >
                      <CheckCheck className="w-3 h-3" />
                      <span>Mark read</span>
                    </button>
                  )}
                </div>

                <div className="max-h-60 overflow-y-auto divide-y divide-[#F5F5F5] dark:divide-[#2C2C2C]">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`p-2.5 text-xs transition-colors hover:bg-gray-50 dark:hover:bg-[#2A2A2A] flex items-start space-x-2 ${
                        !n.read ? 'bg-blue-50/40 dark:bg-blue-950/20' : ''
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full mt-1 flex-shrink-0 ${!n.read ? 'bg-[#0F6CBD]' : 'bg-transparent'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-[#242424] dark:text-[#E0E0E0] truncate leading-tight">{n.title}</p>
                        <span className="text-[10px] text-[#707070] dark:text-[#888] font-mono mt-0.5 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="h-4 w-[1px] bg-[#E0E0E0] dark:bg-[#383838]" />

          {/* Persona Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setDropdownOpen(!dropdownOpen);
                setNotificationsOpen(false);
              }}
              className="flex items-center space-x-2 p-1.5 rounded-md hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] transition-all duration-200 border border-transparent hover:border-[#E0E0E0] dark:hover:border-[#383838] active:scale-98"
            >
              <div className="w-7 h-7 rounded-full bg-[#0F6CBD] text-white flex items-center justify-center text-xs font-semibold shadow-xs">
                {currentUser.name.replace('User ', 'U')}
              </div>
              <div className="text-left text-xs hidden sm:block">
                <div className="font-semibold text-[#242424] dark:text-[#E0E0E0] flex items-center space-x-1.5">
                  <span>{currentUser.name}</span>
                  <span className={`text-[9px] px-1 py-0.2 rounded border font-mono font-bold ${getRoleBadgeStyle(currentUser.role)}`}>
                    {currentUser.role}
                  </span>
                </div>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-[#707070] transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Menu */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-2 w-60 bg-white dark:bg-[#242424] rounded-lg shadow-xl border border-[#EDEBE9] dark:border-[#383838] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                onClick={() => setDropdownOpen(false)}
              >
                <div className="px-3 py-1 border-b border-[#F0F0F0] dark:border-[#303030] mb-1 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[#707070] dark:text-[#888] uppercase tracking-wider font-mono">
                    RBAC
                  </span>
                  <Lock className="w-3 h-3 text-[#707070]" />
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {PRESET_USERS.map((user) => {
                    const isSelected = user.id === currentUser.id;
                    return (
                      <button
                        key={user.id}
                        onClick={() => onSelectUser(user)}
                        className={`w-full text-left px-3 py-2 flex items-center justify-between text-xs transition-colors duration-150 ${
                          isSelected 
                            ? 'bg-[#EBF3FC] dark:bg-[#1B2A3D] text-[#0F6CBD] dark:text-[#479EF5]' 
                            : 'text-[#242424] dark:text-[#D0D0D0] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]'
                        }`}
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSelected ? 'bg-[#0F6CBD] text-white' : 'bg-gray-200 dark:bg-[#383838] text-gray-700 dark:text-gray-300'
                          }`}>
                            {user.name.replace('User ', '')}
                          </div>
                          <span className="font-medium">{user.name}</span>
                        </div>
                        <span className={`text-[9px] px-1 py-0.5 rounded font-mono font-semibold ${getRoleBadgeStyle(user.role)}`}>
                          {user.role}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </div>

      </div>
    </header>
  );
}
