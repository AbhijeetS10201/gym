import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createLogSchema = z.object({
  exerciseId: z.string().min(1, 'Exercise is required'),
  sets: z.number().int().positive('Sets must be at least 1'),
  reps: z.number().int().positive('Reps must be at least 1'),
  weight: z.number().nonnegative('Weight must be at least 0'),
  duration: z.number().int().nonnegative('Duration must be at least 0'),
  notes: z.string().max(500, 'Notes cannot exceed 500 characters').optional().nullable(),
  date: z.string().transform((val) => new Date(val)).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const logs = await db.workoutLog.findMany({
      where: {
        userId,
      },
      orderBy: {
        date: 'desc',
      },
    });

    return NextResponse.json(logs);
  } catch (error: any) {
    console.error('Error fetching workout logs:', error);
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
    const result = createLogSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const newLog = await db.workoutLog.create({
      data: {
        userId,
        exerciseId: result.data.exerciseId,
        sets: result.data.sets,
        reps: result.data.reps,
        weight: result.data.weight,
        duration: result.data.duration,
        notes: result.data.notes || '',
        date: result.data.date || new Date(),
      },
    });

    return NextResponse.json(newLog, { status: 201 });
  } catch (error: any) {
    console.error('Error creating workout log:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
