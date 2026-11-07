import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { Role } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const role = (req.headers.get('x-user-role') as Role) || 'STUDENT';
    const userId = req.headers.get('x-user-id');

    let claims: any[] = [];
    try {
      if (role === 'STUDENT' || role === 'STAFF') {
        claims = await prisma.claim.findMany({
          where: { claimantId: userId || undefined },
          include: { foundItem: true, claimant: true },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        claims = await prisma.claim.findMany({
          include: { foundItem: true, claimant: true },
          orderBy: { createdAt: 'desc' },
        });
      }
    } catch {
      return NextResponse.json({ success: true, claims: [] });
    }

    return NextResponse.json({ success: true, claims });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const claimCode = `CLM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const created = await prisma.claim.create({
      data: {
        claimCode,
        foundItemId: body.foundItemId,
        claimantId: body.claimantId,
        proofDescription: body.proofDescription,
        identifyingMarksProvided: body.identifyingMarksProvided,
      },
    });

    return NextResponse.json({ success: true, claim: created });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
