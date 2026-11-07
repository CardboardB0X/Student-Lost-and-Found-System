'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar, { NavTab } from '../components/Sidebar';
import PublicCatalog from '../components/PublicCatalog';
import CustodyManagement from '../components/CustodyManagement';
import ClaimInbox from '../components/ClaimInbox';
import LostReportsView from '../components/LostReportsView';
import AuditTrailView from '../components/AuditTrailView';
import DisposalSchedule from '../components/DisposalSchedule';
import CommandPalette from '../components/CommandPalette';
import ItemDetailDrawer from '../components/ItemDetailDrawer';

// Modals
import LogItemModal from '../components/Modals/LogItemModal';
import ReportLostModal from '../components/Modals/ReportLostModal';
import FileClaimModal from '../components/Modals/FileClaimModal';
import ReviewClaimModal from '../components/Modals/ReviewClaimModal';
import HandoverModal from '../components/Modals/HandoverModal';
import HandoverReceiptModal from '../components/Modals/HandoverReceiptModal';

import confetti from 'canvas-confetti';

import { 
  UserProfile, 
  FoundItem, 
  Claim, 
  LostReport, 
  AuditLog, 
  Category, 
  StorageLocation,
  ItemStatus 
} from '../lib/types';
import { PRESET_USERS, sanitizeItemForRole, hasPermission } from '../lib/rbac';
import { 
  INITIAL_CATEGORIES, 
  INITIAL_LOCATIONS, 
  INITIAL_FOUND_ITEMS, 
  INITIAL_CLAIMS, 
  INITIAL_LOST_REPORTS, 
  INITIAL_AUDIT_LOGS 
} from '../lib/mockData';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  Lock
} from 'lucide-react';

export default function LostAndFoundPortal() {
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_USERS[2]);
  const [activeTab, setActiveTab] = useState<NavTab>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Dark Mode State
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme-mode', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme-mode', 'light');
      }
      return next;
    });
  };

  // Data Collections
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [locations, setLocations] = useState<StorageLocation[]>(INITIAL_LOCATIONS);
  const [foundItems, setFoundItems] = useState<FoundItem[]>(INITIAL_FOUND_ITEMS);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);
  const [lostReports, setLostReports] = useState<LostReport[]>(INITIAL_LOST_REPORTS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Command Palette & Item Flyout
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [selectedItemDetail, setSelectedItemDetail] = useState<FoundItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Modals
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [selectedClaimTarget, setSelectedClaimTarget] = useState<FoundItem | null>(null);

  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedReviewClaim, setSelectedReviewClaim] = useState<Claim | null>(null);

  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [selectedHandoverClaim, setSelectedHandoverClaim] = useState<Claim | null>(null);

  // Handover Receipt Certificate Modal
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [receiptClaim, setReceiptClaim] = useState<Claim | null>(null);
  const [receiptItem, setReceiptItem] = useState<FoundItem | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const recordAuditLog = (
    entityType: 'FOUND_ITEM' | 'CLAIM' | 'USER' | 'STORAGE',
    entityId: string,
    action: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    notes?: string
  ) => {
    const newLog: AuditLog = {
      id: Date.now(),
      entityType,
      entityId,
      action,
      actorId: currentUser.id,
      actorName: currentUser.name,
      actorRole: currentUser.role,
      actorIp: '127.0.0.1',
      oldValues,
      newValues,
      notes,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // 1. Log Found Item
  const handleLogItem = (itemData: Partial<FoundItem>) => {
    const itemCode = `LF-26-00${foundItems.length + 43}`;
    const newItem: FoundItem = {
      id: `fi_${Date.now()}`,
      itemCode,
      title: itemData.title!,
      categoryId: itemData.categoryId!,
      categoryName: itemData.categoryName,
      isHighValue: itemData.isHighValue || false,
      publicDescription: itemData.publicDescription!,
      privateVerificationDetails: itemData.privateVerificationDetails!,
      primaryColor: itemData.primaryColor,
      brand: itemData.brand,
      locationFound: itemData.locationFound!,
      dateFound: itemData.dateFound!,
      storageLocationId: itemData.storageLocationId!,
      storageLocationName: itemData.storageLocationName,
      isSecureVault: itemData.isSecureVault,
      status: 'STORED',
      loggedByUserId: currentUser.id,
      loggedByName: currentUser.name,
      imageUrl: itemData.imageUrl || 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
      createdAt: new Date().toISOString(),
    };

    setFoundItems((prev) => [newItem, ...prev]);
    recordAuditLog('FOUND_ITEM', newItem.id, 'INTAKE', undefined, {
      code: itemCode,
      title: newItem.title,
    });
    showToast(`Logged: ${itemCode}`);
  };

  // 2. Report Lost
  const handleReportLost = (reportData: Partial<LostReport>) => {
    const reportCode = `LR-26-00${lostReports.length + 89}`;
    const newReport: LostReport = {
      id: `lr_${Date.now()}`,
      reportCode,
      title: reportData.title!,
      categoryId: reportData.categoryId!,
      categoryName: reportData.categoryName,
      description: reportData.description!,
      identifyingMark: reportData.identifyingMark,
      brand: reportData.brand,
      primaryColor: reportData.primaryColor,
      locationLost: reportData.locationLost,
      dateLost: reportData.dateLost!,
      status: 'OPEN',
      reportedByUserId: currentUser.id,
      reportedByName: currentUser.name,
      createdAt: new Date().toISOString(),
    };

    setLostReports((prev) => [newReport, ...prev]);
    recordAuditLog('FOUND_ITEM', newReport.id, 'LOST_REPORT', undefined, {
      code: reportCode,
    });
    showToast(`Report filed: ${reportCode}`);
  };

  // 3. Submit Claim
  const handleInitiateClaim = (item: FoundItem) => {
    setSelectedClaimTarget(item);
    setIsClaimModalOpen(true);
  };

  const handleSubmitClaim = (claimData: Partial<Claim>) => {
    const claimCode = `CLM-26-00${claims.length + 20}`;
    const newClaim: Claim = {
      id: `clm_${Date.now()}`,
      claimCode,
      foundItemId: claimData.foundItemId!,
      foundItemTitle: claimData.foundItemTitle,
      foundItemCode: claimData.foundItemCode,
      isHighValue: claimData.isHighValue,
      claimantId: currentUser.id,
      claimantName: currentUser.name,
      claimantStudentId: currentUser.studentStaffId,
      claimantEmail: currentUser.email,
      proofDescription: claimData.proofDescription!,
      identifyingMarksProvided: claimData.identifyingMarksProvided!,
      status: 'SUBMITTED',
      createdAt: new Date().toISOString(),
    };

    setClaims((prev) => [newClaim, ...prev]);
    setFoundItems((prev) =>
      prev.map((i) => (i.id === claimData.foundItemId ? { ...i, status: 'CLAIM_PENDING' } : i))
    );

    recordAuditLog('CLAIM', newClaim.id, 'SUBMIT_CLAIM', undefined, {
      claimCode,
      item: claimData.foundItemCode,
    });

    showToast(`Claim submitted: ${claimCode}`);
  };

  // 4. Review Claim
  const handleOpenReview = (claim: Claim) => {
    const item = foundItems.find((i) => i.id === claim.foundItemId) || null;
    setSelectedReviewClaim(claim);
    setSelectedClaimTarget(item);
    setIsReviewModalOpen(true);
  };

  const handleReviewDecision = (claimId: string, approved: boolean, notes: string) => {
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          return {
            ...c,
            status: approved ? 'APPROVED' : 'REJECTED',
            reviewedByUserId: currentUser.id,
            reviewedByName: currentUser.name,
            reviewNotes: notes,
          };
        }
        return c;
      })
    );

    recordAuditLog(
      'CLAIM',
      claimId,
      approved ? 'APPROVED' : 'REJECTED',
      { status: 'SUBMITTED' },
      { status: approved ? 'APPROVED' : 'REJECTED', reviewer: currentUser.name }
    );

    showToast(approved ? 'Claim Approved' : 'Claim Rejected');
  };

  // 5. Handover with Celebration & Receipt
  const handleOpenHandover = (claim: Claim) => {
    const item = foundItems.find((i) => i.id === claim.foundItemId) || null;
    setSelectedHandoverClaim(claim);
    setSelectedClaimTarget(item);
    setIsHandoverModalOpen(true);
  };

  const handleCompleteHandover = (claimId: string, witnessId: string, signature: string) => {
    const witness = PRESET_USERS.find((u) => u.id === witnessId);
    let updatedClaimObj: Claim | null = null;
    
    setClaims((prev) =>
      prev.map((c) => {
        if (c.id === claimId) {
          updatedClaimObj = {
            ...c,
            status: 'COMPLETED',
            handoverTimestamp: new Date().toISOString(),
            handoverWitnessId: witnessId,
            handoverWitnessName: witness?.name,
            claimantSignatureRef: signature,
          };
          return updatedClaimObj;
        }
        return c;
      })
    );

    if (selectedHandoverClaim) {
      const targetItem = foundItems.find(i => i.id === selectedHandoverClaim.foundItemId);
      setFoundItems((prev) =>
        prev.map((i) => (i.id === selectedHandoverClaim.foundItemId ? { ...i, status: 'RETURNED' } : i))
      );

      recordAuditLog(
        'FOUND_ITEM',
        selectedHandoverClaim.foundItemId,
        'HANDOVER_COMPLETED',
        { status: 'CLAIM_PENDING' },
        { status: 'RETURNED', to: selectedHandoverClaim.claimantName }
      );

      // Micro-confetti celebration!
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#0F6CBD', '#2886DE', '#107C41', '#FFB900'],
      });

      // Open official release receipt certificate
      if (targetItem && updatedClaimObj) {
        setReceiptClaim(updatedClaimObj);
        setReceiptItem(targetItem);
        setIsReceiptModalOpen(true);
      }
    }

    showToast('Handover Completed');
  };

  // 6. Status change
  const handleUpdateItemStatus = (itemId: string, newStatus: ItemStatus) => {
    const item = foundItems.find((i) => i.id === itemId);
    if (!item) return;

    setFoundItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, status: newStatus } : i))
    );

    recordAuditLog(
      'FOUND_ITEM',
      itemId,
      'STATUS_CHANGED',
      { status: item.status },
      { status: newStatus }
    );

    showToast(`Status: ${newStatus}`);
  };

  // 7. Batch status change
  const handleBatchUpdateStatus = (itemIds: string[], newStatus: ItemStatus) => {
    setFoundItems(prev =>
      prev.map(i => itemIds.includes(i.id) ? { ...i, status: newStatus } : i)
    );

    itemIds.forEach(id => {
      recordAuditLog('FOUND_ITEM', id, 'BATCH_STATUS_UPDATE', undefined, { status: newStatus });
    });

    showToast(`Updated ${itemIds.length} items to ${newStatus}`);
  };

  const handleInspectItem = (item: FoundItem) => {
    setSelectedItemDetail(item);
    setIsDetailDrawerOpen(true);
  };

  const roleSafeItems = foundItems.map((item) => sanitizeItemForRole(item, currentUser.role));
  const pendingClaimsCount = claims.filter(
    (c) => c.status === 'SUBMITTED' || c.status === 'UNDER_REVIEW'
  ).length;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#F5F5F5] dark:bg-[#181818] transition-colors duration-250">
      
      {/* Top Header */}
      <Header
        currentUser={currentUser}
        onSelectUser={setCurrentUser}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        pendingClaimsCount={pendingClaimsCount}
        darkMode={darkMode}
        onToggleDarkMode={toggleDarkMode}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Collapsible Sidebar */}
        <Sidebar
          currentRole={currentUser.role}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onOpenLogModal={() => setIsLogModalOpen(true)}
          onOpenReportModal={() => setIsReportModalOpen(true)}
          pendingClaimsCount={pendingClaimsCount}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 transition-all duration-300">
          
          {/* Toast */}
          {toastMessage && (
            <div className="p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs rounded-md shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                <span className="font-medium">{toastMessage}</span>
              </div>
              <button onClick={() => setToastMessage(null)} className="text-emerald-700 dark:text-emerald-400 font-bold ml-3 text-xs">
                ✕
              </button>
            </div>
          )}

          {/* Metrics Symbols Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#EDEBE9] dark:border-[#333333] shadow-xs flex items-center space-x-3 transition-all duration-150 hover:border-[#C7DCF8] dark:hover:border-[#2886DE]">
              <div className="w-8 h-8 rounded-md bg-blue-50 dark:bg-blue-950/40 text-[#0F6CBD] dark:text-[#479EF5] flex items-center justify-center">
                <Package className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-[#707070] dark:text-[#888] font-medium uppercase">Active</p>
                <p className="text-sm font-bold text-[#242424] dark:text-white">
                  {foundItems.filter(i => i.status === 'STORED' || i.status === 'CLAIM_PENDING').length}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#EDEBE9] dark:border-[#333333] shadow-xs flex items-center space-x-3 transition-all duration-150 hover:border-[#C7DCF8] dark:hover:border-[#2886DE]">
              <div className="w-8 h-8 rounded-md bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-[#707070] dark:text-[#888] font-medium uppercase">Claims</p>
                <p className="text-sm font-bold text-[#242424] dark:text-white">
                  {pendingClaimsCount}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#EDEBE9] dark:border-[#333333] shadow-xs flex items-center space-x-3 transition-all duration-150 hover:border-[#C7DCF8] dark:hover:border-[#2886DE]">
              <div className="w-8 h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-[#707070] dark:text-[#888] font-medium uppercase">Returned</p>
                <p className="text-sm font-bold text-[#242424] dark:text-white">
                  {foundItems.filter(i => i.status === 'RETURNED').length}
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-[#202020] p-3 rounded-lg border border-[#EDEBE9] dark:border-[#333333] shadow-xs flex items-center space-x-3 transition-all duration-150 hover:border-[#C7DCF8] dark:hover:border-[#2886DE]">
              <div className="w-8 h-8 rounded-md bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[10px] text-[#707070] dark:text-[#888] font-medium uppercase">Vault</p>
                <p className="text-sm font-bold text-[#242424] dark:text-white">
                  {foundItems.filter(i => i.isSecureVault).length}
                </p>
              </div>
            </div>

          </div>

          {/* Active View */}
          <div className="transition-all duration-200">
            {activeTab === 'catalog' && (
              <PublicCatalog
                items={roleSafeItems}
                categories={categories}
                searchQuery={searchQuery}
                onClaimItem={handleInitiateClaim}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onSelectItem={handleInspectItem}
              />
            )}

            {activeTab === 'custody' && (
              hasPermission(currentUser.role, 'VIEW_PRIVATE_VERIFICATION_DETAILS') ? (
                <CustodyManagement
                  items={foundItems}
                  locations={locations}
                  onOpenLogModal={() => setIsLogModalOpen(true)}
                  onUpdateStatus={handleUpdateItemStatus}
                  onBatchUpdateStatus={handleBatchUpdateStatus}
                />
              ) : (
                <div className="p-8 text-center bg-white dark:bg-[#202020] rounded-lg border border-red-200 dark:border-red-900 text-red-700 dark:text-red-400 space-y-2 animate-in fade-in duration-150">
                  <Lock className="w-8 h-8 mx-auto text-red-500" />
                  <p className="text-xs font-semibold">Access Restricted ({currentUser.role})</p>
                </div>
              )
            )}

            {activeTab === 'claims' && (
              <ClaimInbox
                claims={claims}
                foundItems={foundItems}
                currentUser={currentUser}
                onReviewClaim={handleOpenReview}
                onInitiateHandover={handleOpenHandover}
              />
            )}

            {activeTab === 'lostReports' && (
              <LostReportsView
                reports={lostReports}
                foundItems={foundItems}
                onOpenReportModal={() => setIsReportModalOpen(true)}
                onMatchFound={(repId, item) => {
                  showToast(`Matched: ${item.itemCode}`);
                }}
              />
            )}

            {activeTab === 'audit' && (
              <AuditTrailView logs={auditLogs} />
            )}

            {activeTab === 'retention' && (
              <DisposalSchedule
                items={foundItems}
                onUpdateStatus={handleUpdateItemStatus}
              />
            )}
          </div>

        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onSelectUser={(u) => {
          setCurrentUser(u);
          setIsCommandPaletteOpen(false);
        }}
        onOpenLogModal={() => {
          setIsLogModalOpen(true);
          setIsCommandPaletteOpen(false);
        }}
        onOpenReportModal={() => {
          setIsReportModalOpen(true);
          setIsCommandPaletteOpen(false);
        }}
        onSelectItem={(item) => {
          handleInspectItem(item);
          setIsCommandPaletteOpen(false);
        }}
        foundItems={foundItems}
      />

      {/* Item Detail Flyout Drawer */}
      <ItemDetailDrawer
        item={selectedItemDetail}
        isOpen={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        onClaimItem={handleInitiateClaim}
        canViewSecret={hasPermission(currentUser.role, 'VIEW_PRIVATE_VERIFICATION_DETAILS')}
      />

      {/* Official Handover Receipt Modal */}
      <HandoverReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        claim={receiptClaim}
        targetItem={receiptItem}
      />

      {/* Modals */}
      <LogItemModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        categories={categories}
        locations={locations}
        onSave={handleLogItem}
      />

      <ReportLostModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        categories={categories}
        currentUser={currentUser}
        onSave={handleReportLost}
      />

      <FileClaimModal
        isOpen={isClaimModalOpen}
        onClose={() => setIsClaimModalOpen(false)}
        targetItem={selectedClaimTarget}
        currentUser={currentUser}
        onSubmitClaim={handleSubmitClaim}
      />

      <ReviewClaimModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        claim={selectedReviewClaim}
        targetItem={selectedClaimTarget}
        currentUser={currentUser}
        onDecision={handleReviewDecision}
      />

      <HandoverModal
        isOpen={isHandoverModalOpen}
        onClose={() => setIsHandoverModalOpen(false)}
        claim={selectedHandoverClaim}
        targetItem={selectedClaimTarget}
        currentUser={currentUser}
        onCompleteHandover={handleCompleteHandover}
      />

    </div>
  );
}
