import { PrismaClient, Role, UserStatus, ItemStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting MySQL database seed...');

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Seed Users with various RBAC roles
  const usersData = [
    {
      id: 'usr_student_01',
      studentStaffId: 'STU-2024-8841',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane.doe@university.edu',
      passwordHash,
      role: Role.STUDENT,
      department: 'Computer Science',
      phoneNumber: '+1 (555) 234-5678',
    },
    {
      id: 'usr_staff_01',
      studentStaffId: 'STF-2019-3321',
      firstName: 'Robert',
      lastName: 'Hayes',
      email: 'r.hayes@university.edu',
      passwordHash,
      role: Role.STAFF,
      department: 'Physics & Astronomy',
      phoneNumber: '+1 (555) 345-6789',
    },
    {
      id: 'usr_officer_01',
      studentStaffId: 'SEC-2021-0092',
      firstName: 'Marcus',
      lastName: 'Davis',
      email: 'm.davis@campus-security.edu',
      passwordHash,
      role: Role.SECURITY_OFFICER,
      department: 'Campus Safety & Police',
      phoneNumber: '+1 (555) 911-0042',
    },
    {
      id: 'usr_custodian_01',
      studentStaffId: 'CUS-2018-0014',
      firstName: 'Sarah',
      lastName: 'Miller',
      email: 's.miller@facilities.edu',
      passwordHash,
      role: Role.CUSTODIAN,
      department: 'Central Property & Vault',
      phoneNumber: '+1 (555) 789-0123',
    },
    {
      id: 'usr_admin_01',
      studentStaffId: 'ADM-2015-0001',
      firstName: 'Alexander',
      lastName: 'Vance',
      email: 'a.vance@admin.edu',
      passwordHash,
      role: Role.ADMIN,
      department: 'Information Technology Services',
      phoneNumber: '+1 (555) 800-4321',
    },
    {
      id: 'usr_auditor_01',
      studentStaffId: 'AUD-2020-0055',
      firstName: 'Elena',
      lastName: 'Rostova',
      email: 'e.rostova@compliance.edu',
      passwordHash,
      role: Role.AUDITOR,
      department: 'Office of Internal Audit & Compliance',
      phoneNumber: '+1 (555) 990-1122',
    },
  ];

  for (const u of usersData) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: u,
    });
  }
  console.log(`✅ Seeded ${usersData.length} RBAC Users.`);

  // 2. Categories
  const categories = [
    { id: 1, name: 'Electronics & Gadgets', description: 'Laptops, tablets, smartphones', isHighValue: true, retentionPeriodDays: 90 },
    { id: 2, name: 'Wallets & Identification', description: 'Student cards, national IDs, wallets', isHighValue: true, retentionPeriodDays: 30 },
    { id: 3, name: 'Keys & Campus Badges', description: 'Car key fobs, dorm room keys', isHighValue: false, retentionPeriodDays: 60 },
    { id: 4, name: 'Apparel & Accessories', description: 'Jackets, sweaters, sunglasses, jewelry', isHighValue: false, retentionPeriodDays: 90 },
    { id: 5, name: 'Academic & Books', description: 'Textbooks, lab manuals, calculators', isHighValue: false, retentionPeriodDays: 90 },
    { id: 6, name: 'Water Bottles & Tumblers', description: 'Hydro Flasks, Yeti tumblers', isHighValue: false, retentionPeriodDays: 30 },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { id: c.id },
      update: {},
      create: c,
    });
  }
  console.log(`✅ Seeded ${categories.length} Categories.`);

  // 3. Storage Locations
  const locations = [
    { id: 1, campusBuilding: 'Campus Security Center', roomOrLocker: 'Room 102 - Counter Storage', binNumber: 'Bin A-04', isSecureVault: false },
    { id: 2, campusBuilding: 'Central Facilities Depot', roomOrLocker: 'Secure Vault Locker Room', binNumber: 'Vault-B2', isSecureVault: true },
    { id: 3, campusBuilding: 'Student Union Building', roomOrLocker: 'Info Desk Lockbox', binNumber: 'SUB-Box-1', isSecureVault: false },
    { id: 4, campusBuilding: 'Main University Library', roomOrLocker: 'Circulation Desk Holding', binNumber: 'LIB-Bin-09', isSecureVault: false },
  ];

  for (const l of locations) {
    await prisma.storageLocation.upsert({
      where: { id: l.id },
      update: {},
      create: l,
    });
  }
  console.log(`✅ Seeded ${locations.length} Storage Locations.`);

  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
