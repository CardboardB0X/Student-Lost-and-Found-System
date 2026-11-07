import { Role, FoundItem, Claim } from './types';

export const PERMISSIONS = {
  // Public vs Privileged Item Visibility
  VIEW_PUBLIC_ITEMS: ['STUDENT', 'STAFF', 'SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN', 'AUDITOR'] as Role[],
  VIEW_PRIVATE_VERIFICATION_DETAILS: ['SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN'] as Role[],
  
  // Item Operations
  LOG_FOUND_ITEM: ['SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN'] as Role[],
  EDIT_FOUND_ITEM: ['SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN'] as Role[],
  DISPOSE_ITEM: ['CUSTODIAN', 'ADMIN'] as Role[],
  
  // Lost Item Reports
  REPORT_LOST_ITEM: ['STUDENT', 'STAFF', 'SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN'] as Role[],
  
  // Claims
  SUBMIT_CLAIM: ['STUDENT', 'STAFF'] as Role[],
  REVIEW_CLAIMS: ['SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN'] as Role[],
  APPROVE_CLAIM: ['SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN'] as Role[],
  SIGN_OFF_HANDOVER: ['SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN'] as Role[],
  
  // Audit & Governance
  VIEW_AUDIT_LOGS: ['SECURITY_OFFICER', 'CUSTODIAN', 'ADMIN', 'AUDITOR'] as Role[],
  MANAGE_USERS: ['ADMIN'] as Role[],
};

export function hasPermission(role: Role, permission: keyof typeof PERMISSIONS): boolean {
  return PERMISSIONS[permission].includes(role);
}

/**
 * Strips secret blind-proof verification details for unauthorized roles (e.g. Students/Public)
 */
export function sanitizeItemForRole(item: FoundItem, role: Role): FoundItem {
  if (hasPermission(role, 'VIEW_PRIVATE_VERIFICATION_DETAILS')) {
    return item;
  }
  
  // For students and general public, mask the confidential verification clues
  return {
    ...item,
    privateVerificationDetails: '•••••• [PROTECTED] ••••••',
  };
}

export const PRESET_USERS = [
  {
    id: 'usr_01',
    studentStaffId: 'ID-001',
    name: 'User 1',
    email: 'user1@system.local',
    role: 'STUDENT' as Role,
    department: 'Dept A',
  },
  {
    id: 'usr_02',
    studentStaffId: 'ID-002',
    name: 'User 2',
    email: 'user2@system.local',
    role: 'STAFF' as Role,
    department: 'Dept B',
  },
  {
    id: 'usr_03',
    studentStaffId: 'ID-003',
    name: 'User 3',
    email: 'user3@system.local',
    role: 'SECURITY_OFFICER' as Role,
    department: 'Security Unit',
  },
  {
    id: 'usr_04',
    studentStaffId: 'ID-004',
    name: 'User 4',
    email: 'user4@system.local',
    role: 'CUSTODIAN' as Role,
    department: 'Custody Vault',
  },
  {
    id: 'usr_05',
    studentStaffId: 'ID-005',
    name: 'User 5',
    email: 'user5@system.local',
    role: 'ADMIN' as Role,
    department: 'IT Admin',
  },
  {
    id: 'usr_06',
    studentStaffId: 'ID-006',
    name: 'User 6',
    email: 'user6@system.local',
    role: 'AUDITOR' as Role,
    department: 'Compliance',
  },
];
