export type Role = 'STUDENT' | 'STAFF' | 'SECURITY_OFFICER' | 'CUSTODIAN' | 'ADMIN' | 'AUDITOR';

export type ItemStatus = 
  | 'REGISTERED' 
  | 'STORED' 
  | 'CLAIM_PENDING' 
  | 'RETURNED' 
  | 'AUCTIONED' 
  | 'DONATED' 
  | 'DISPOSED';

export type ClaimStatus = 
  | 'SUBMITTED' 
  | 'UNDER_REVIEW' 
  | 'APPROVED' 
  | 'REJECTED' 
  | 'COMPLETED' 
  | 'CANCELLED';

export type LostReportStatus = 'OPEN' | 'POTENTIAL_MATCH' | 'RESOLVED' | 'CANCELLED';

export interface UserProfile {
  id: string;
  studentStaffId: string;
  name: string;
  email: string;
  role: Role;
  department?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  isHighValue: boolean;
  retentionPeriodDays: number;
}

export interface StorageLocation {
  id: number;
  campusBuilding: string;
  roomOrLocker: string;
  binNumber?: string;
  isSecureVault: boolean;
  notes?: string;
}

export interface FoundItem {
  id: string;
  itemCode: string;
  title: string;
  categoryId: number;
  categoryName?: string;
  isHighValue?: boolean;
  publicDescription: string;
  // SENSITIVE: ONLY visible to Staff, Security, Custodians & Admins
  privateVerificationDetails: string;
  primaryColor?: string;
  brand?: string;
  locationFound: string;
  dateFound: string;
  storageLocationId: number;
  storageLocationName?: string;
  isSecureVault?: boolean;
  status: ItemStatus;
  loggedByUserId: string;
  loggedByName?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Claim {
  id: string;
  claimCode: string;
  foundItemId: string;
  foundItemTitle?: string;
  foundItemCode?: string;
  isHighValue?: boolean;
  claimantId: string;
  claimantName: string;
  claimantStudentId: string;
  claimantEmail: string;
  proofDescription: string;
  identifyingMarksProvided: string;
  status: ClaimStatus;
  reviewedByUserId?: string;
  reviewedByName?: string;
  rejectionReason?: string;
  reviewNotes?: string;
  handoverTimestamp?: string;
  handoverWitnessId?: string;
  handoverWitnessName?: string;
  claimantSignatureRef?: string;
  createdAt: string;
}

export interface LostReport {
  id: string;
  reportCode: string;
  title: string;
  categoryId: number;
  categoryName?: string;
  description: string;
  identifyingMark?: string;
  brand?: string;
  primaryColor?: string;
  locationLost?: string;
  dateLost: string;
  status: LostReportStatus;
  reportedByUserId: string;
  reportedByName: string;
  createdAt: string;
}

export interface AuditLog {
  id: number;
  entityType: 'FOUND_ITEM' | 'CLAIM' | 'USER' | 'STORAGE';
  entityId: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: Role;
  actorIp: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  notes?: string;
  createdAt: string;
}
