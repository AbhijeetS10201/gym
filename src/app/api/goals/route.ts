import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const createGoalSchema = z.object({
  type: z.string().min(1, 'Type is required'),
  title: z.string().min(1, 'Title is required'),
  target: z.number().positive('Target must be positive'),
  current: z.number().nonnegative('Current progress must be at least 0'),
  unit: z.string().min(1, 'Unit is required'),
  deadline: z.string().transform((val) => new Date(val)),
});

const updateGoalSchema = z.object({
  id: z.string().min(1),
  current: z.number().optional(),
  status: z.enum(['IN_PROGRESS', 'COMPLETED', 'ARCHIVED']).optional(),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const goals = await db.fitnessGoal.findMany({
      where: {
        userId,
        status: { not: 'ARCHIVED' }
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(goals);
  } catch (error: any) {
    console.error('Error fetching goals:', error);
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
    const result = createGoalSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const newGoal = await db.fitnessGoal.create({
      data: {
        userId,
        type: result.data.type,
        title: result.data.title,
        target: result.data.target,
        current: result.data.current,
        unit: result.data.unit,
        deadline: result.data.deadline,
        status: 'IN_PROGRESS',
      },
    });

    return NextResponse.json(newGoal, { status: 201 });
  } catch (error: any) {
    console.error('Error creating goal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const result = updateGoalSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: result.error.issues[0].message }, { status: 400 });
    }

    const { id, current, status } = result.data;

    // Verify ownership
    const existingGoal = await db.fitnessGoal.findFirst({
      where: { id, userId },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 44 });
    }

    const updatedGoal = await db.fitnessGoal.update({
      where: { id },
      data: {
        ...(current !== undefined ? { current } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });

    return NextResponse.json(updatedGoal);
  } catch (error: any) {
    console.error('Error updating goal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Goal ID is required' }, { status: 400 });
    }

    const existingGoal = await db.fitnessGoal.findFirst({
      where: { id, userId },
    });

    if (!existingGoal) {
      return NextResponse.json({ error: 'Goal not found' }, { status: 404 });
    }

    // Perform logical delete by archiving the goal
    const archivedGoal = await db.fitnessGoal.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
      },
    });

    return NextResponse.json(archivedGoal);
  } catch (error: any) {
    console.error('Error deleting goal:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
