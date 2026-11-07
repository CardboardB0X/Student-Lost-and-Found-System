'use client';

import React from 'react';
import { Role } from '../lib/types';
import { hasPermission } from '../lib/rbac';
import { 
  PackageSearch, 
  Archive, 
  ClipboardCheck, 
  FileQuestion, 
  ShieldAlert, 
  CalendarClock, 
  Plus, 
  Database, 
  Lock, 
  ChevronLeft, 
  ChevronRight 
} from 'lucide-react';

export type NavTab = 
  | 'catalog' 
  | 'custody' 
  | 'claims' 
  | 'lostReports' 
  | 'audit' 
  | 'retention';

interface SidebarProps {
  currentRole: Role;
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  onOpenLogModal: () => void;
  onOpenReportModal: () => void;
  pendingClaimsCount: number;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export default function Sidebar({
  currentRole,
  activeTab,
  onTabChange,
  onOpenLogModal,
  onOpenReportModal,
  pendingClaimsCount,
  isCollapsed,
  onToggleCollapse,
}: SidebarProps) {
  const canLogItem = hasPermission(currentRole, 'LOG_FOUND_ITEM');
  const canViewCustody = hasPermission(currentRole, 'VIEW_PRIVATE_VERIFICATION_DETAILS');
  const canReviewClaims = hasPermission(currentRole, 'REVIEW_CLAIMS');
  const canViewAudit = hasPermission(currentRole, 'VIEW_AUDIT_LOGS');
  const canDispose = hasPermission(currentRole, 'DISPOSE_ITEM');

  return (
    <aside 
      className={`bg-white dark:bg-[#202020] border-r border-[#E0E0E0] dark:border-[#333333] flex flex-col justify-between h-[calc(100vh-3.5rem)] select-none transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-60'
      }`}
    >
      {/* Top Part */}
      <div className="p-2 space-y-3">
        
        {/* Toggle Collapse Button */}
        <div className="flex items-center justify-end px-1 pb-1">
          <button
            onClick={onToggleCollapse}
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="p-1.5 rounded-md hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A] text-[#707070] dark:text-[#A0A0A0] hover:text-[#242424] dark:hover:text-white transition-all duration-200 active:scale-90"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-1.5 pb-2 border-b border-[#F0F0F0] dark:border-[#2F2F2F]">
          {canLogItem && (
            <button
              onClick={onOpenLogModal}
              title="Log Item (Vault)"
              className={`w-full flex items-center justify-center space-x-2 py-2 bg-[#0F6CBD] hover:bg-[#115EA3] active:scale-95 text-white text-xs font-semibold rounded-md shadow-xs transition-all duration-150 ${
                isCollapsed ? 'px-0' : 'px-3'
              }`}
            >
              <Plus className="w-4 h-4 flex-shrink-0" />
              {!isCollapsed && <span className="truncate">Log Item</span>}
            </button>
          )}

          <button
            onClick={onOpenReportModal}
            title="Report Lost"
            className={`w-full flex items-center justify-center space-x-2 py-1.5 text-xs font-medium rounded-md border transition-all duration-150 active:scale-95 ${
              isCollapsed ? 'px-0' : 'px-3'
            } ${
              canLogItem 
                ? 'border-[#D1D1D1] dark:border-[#383838] bg-white dark:bg-[#282828] text-[#242424] dark:text-[#E0E0E0] hover:bg-[#F5F5F5] dark:hover:bg-[#303030]' 
                : 'bg-[#0F6CBD] text-white hover:bg-[#115EA3] font-semibold'
            }`}
          >
            <FileQuestion className="w-4 h-4 flex-shrink-0" />
            {!isCollapsed && <span className="truncate">Report Lost</span>}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          
          {/* Public Catalog */}
          <button
            onClick={() => onTabChange('catalog')}
            title="Catalog"
            className={`w-full flex items-center rounded-md text-xs font-medium transition-all duration-150 active:scale-98 ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
            } ${
              activeTab === 'catalog'
                ? 'bg-[#EBF3FC] dark:bg-[#1B2A3D] text-[#0F6CBD] dark:text-[#479EF5] font-semibold shadow-xs'
                : 'text-[#424242] dark:text-[#CCCCCC] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <PackageSearch className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                activeTab === 'catalog' ? 'text-[#0F6CBD] dark:text-[#479EF5] scale-110' : 'text-[#616161] dark:text-[#888888]'
              }`} />
              {!isCollapsed && <span>Catalog</span>}
            </div>
          </button>

          {/* Lost Reports */}
          <button
            onClick={() => onTabChange('lostReports')}
            title="Reports"
            className={`w-full flex items-center rounded-md text-xs font-medium transition-all duration-150 active:scale-98 ${
              isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
            } ${
              activeTab === 'lostReports'
                ? 'bg-[#EBF3FC] dark:bg-[#1B2A3D] text-[#0F6CBD] dark:text-[#479EF5] font-semibold shadow-xs'
                : 'text-[#424242] dark:text-[#CCCCCC] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <FileQuestion className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                activeTab === 'lostReports' ? 'text-[#0F6CBD] dark:text-[#479EF5] scale-110' : 'text-[#616161] dark:text-[#888888]'
              }`} />
              {!isCollapsed && <span>Reports</span>}
            </div>
          </button>

          {/* In Custody (Privileged) */}
          {canViewCustody ? (
            <button
              onClick={() => onTabChange('custody')}
              title="Custody Ledger"
              className={`w-full flex items-center rounded-md text-xs font-medium transition-all duration-150 active:scale-98 ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } ${
                activeTab === 'custody'
                  ? 'bg-[#EBF3FC] dark:bg-[#1B2A3D] text-[#0F6CBD] dark:text-[#479EF5] font-semibold shadow-xs'
                  : 'text-[#424242] dark:text-[#CCCCCC] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <Archive className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  activeTab === 'custody' ? 'text-[#0F6CBD] dark:text-[#479EF5] scale-110' : 'text-[#616161] dark:text-[#888888]'
                }`} />
                {!isCollapsed && <span>Custody</span>}
              </div>
              {!isCollapsed && (
                <Lock className="w-3 h-3 text-[#0F6CBD] dark:text-[#479EF5]" />
              )}
            </button>
          ) : null}

          {/* Claims */}
          {canReviewClaims ? (
            <button
              onClick={() => onTabChange('claims')}
              title="Verification Queue"
              className={`w-full flex items-center rounded-md text-xs font-medium transition-all duration-150 active:scale-98 ${
                isCollapsed ? 'justify-center p-2.5 relative' : 'justify-between px-3 py-2'
              } ${
                activeTab === 'claims'
                  ? 'bg-[#EBF3FC] dark:bg-[#1B2A3D] text-[#0F6CBD] dark:text-[#479EF5] font-semibold shadow-xs'
                  : 'text-[#424242] dark:text-[#CCCCCC] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ClipboardCheck className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  activeTab === 'claims' ? 'text-[#0F6CBD] dark:text-[#479EF5] scale-110' : 'text-[#616161] dark:text-[#888888]'
                }`} />
                {!isCollapsed && <span>Claims</span>}
              </div>
              {pendingClaimsCount > 0 && (
                <span className={`text-[10px] bg-[#C4314B] text-white px-1.5 py-0.2 rounded-full font-bold animate-pulse ${
                  isCollapsed ? 'absolute top-1 right-1 w-2.5 h-2.5 p-0' : ''
                }`}>
                  {!isCollapsed && pendingClaimsCount}
                </span>
              )}
            </button>
          ) : null}

          {/* Audit Logs */}
          {canViewAudit ? (
            <button
              onClick={() => onTabChange('audit')}
              title="Audit Logs"
              className={`w-full flex items-center rounded-md text-xs font-medium transition-all duration-150 active:scale-98 ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } ${
                activeTab === 'audit'
                  ? 'bg-[#EBF3FC] dark:bg-[#1B2A3D] text-[#0F6CBD] dark:text-[#479EF5] font-semibold shadow-xs'
                  : 'text-[#424242] dark:text-[#CCCCCC] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <ShieldAlert className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  activeTab === 'audit' ? 'text-[#0F6CBD] dark:text-[#479EF5] scale-110' : 'text-[#616161] dark:text-[#888888]'
                }`} />
                {!isCollapsed && <span>Audit</span>}
              </div>
            </button>
          ) : null}

          {/* Retention */}
          {canDispose ? (
            <button
              onClick={() => onTabChange('retention')}
              title="Disposal / Retention"
              className={`w-full flex items-center rounded-md text-xs font-medium transition-all duration-150 active:scale-98 ${
                isCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
              } ${
                activeTab === 'retention'
                  ? 'bg-[#EBF3FC] dark:bg-[#1B2A3D] text-[#0F6CBD] dark:text-[#479EF5] font-semibold shadow-xs'
                  : 'text-[#424242] dark:text-[#CCCCCC] hover:bg-[#F5F5F5] dark:hover:bg-[#2A2A2A]'
              }`}
            >
              <div className="flex items-center space-x-2.5">
                <CalendarClock className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${
                  activeTab === 'retention' ? 'text-[#0F6CBD] dark:text-[#479EF5] scale-110' : 'text-[#616161] dark:text-[#888888]'
                }`} />
                {!isCollapsed && <span>Disposal</span>}
              </div>
            </button>
          ) : null}

        </nav>

      </div>

      {/* Footer Symbol */}
      <div className="p-3 bg-[#FAFAFA] dark:bg-[#1A1A1A] border-t border-[#F0F0F0] dark:border-[#2F2F2F] flex items-center justify-center transition-colors">
        <span title="MySQL 8.0">
          <Database className="w-4 h-4 text-[#0F6CBD] dark:text-[#479EF5]" />
        </span>
      </div>

    </aside>
  );
}
