import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createEntrySchema = z.object({
  weight: z.number().positive('Weight must be positive').optional().nullable(),
  bodyFat: z.number().positive('Body fat must be positive').optional().nullable(),
  notes: z.string().max(500).optional().nullable(),
  date: z.string().transform((val) => new Date(val)).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const progress = await db.progressEntry.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'asc', // Ascending order so charts draw left-to-right Chronologically!
      },
    });

    return NextResponse.json(progress);
  } catch (error: any) {
    console.error('Error fetching progress entries:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const result = createEntrySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const newEntry = await db.progressEntry.create({
      data: {
        userId,
        weight: result.data.weight,
        bodyFat: result.data.bodyFat,
        notes: result.data.notes || '',
        date: result.data.date || new Date(),
      },
    });

    return NextResponse.json(newEntry, { status: 201 });
  } catch (error: any) {
    console.error('Error creating progress entry:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
