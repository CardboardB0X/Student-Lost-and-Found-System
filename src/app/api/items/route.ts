import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sanitizeItemForRole } from '@/lib/rbac';
import { Role } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const role = (req.headers.get('x-user-role') as Role) || 'STUDENT';
    
    // In production, queries Prisma if MySQL connection is active
    let items: any[] = [];
    try {
      items = await prisma.foundItem.findMany({
        include: {
          category: true,
          storageLocation: true,
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      // Return empty if database not booted yet
      return NextResponse.json({ success: true, items: [], message: 'Running in simulated state' });
    }

    const sanitized = items.map((i) =>
      sanitizeItemForRole(
        {
          ...i,
          categoryName: i.category.name,
          storageLocationName: `${i.storageLocation.campusBuilding} (${i.storageLocation.binNumber || i.storageLocation.roomOrLocker})`,
        },
        role
      )
    );

    return NextResponse.json({ success: true, items: sanitized });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const role = (req.headers.get('x-user-role') as Role) || 'STUDENT';
    if (role !== 'SECURITY_OFFICER' && role !== 'CUSTODIAN' && role !== 'ADMIN') {
      return NextResponse.json({ success: false, error: 'Access Denied: Only officers and custodians can log property.' }, { status: 403 });
    }

    const body = await req.json();
    const itemCode = `LF-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const created = await prisma.foundItem.create({
      data: {
        itemCode,
        title: body.title,
        categoryId: Number(body.categoryId),
        publicDescription: body.publicDescription,
        privateVerificationDetails: body.privateVerificationDetails,
        brand: body.brand,
        primaryColor: body.primaryColor,
        locationFound: body.locationFound,
        dateFound: new Date(body.dateFound),
        storageLocationId: Number(body.storageLocationId),
        loggedByUserId: body.loggedByUserId,
      },
    });

    return NextResponse.json({ success: true, item: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
