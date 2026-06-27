import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { razorpay, isMockPayments } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json();
    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    const plan = await db.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    let orderId = '';
    let isMock = false;

    if (isMockPayments) {
      isMock = true;
      orderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
    } else if (razorpay) {
      const order = await razorpay.orders.create({
        amount: plan.price * 100, // Amount in paise
        currency: 'INR',
        receipt: `rcpt_${Date.now()}`,
      });
      orderId = order.id;
    } else {
      // Bypasses if configuration fails but isMockPayments is false
      isMock = true;
      orderId = `order_mock_${Math.random().toString(36).substring(2, 11)}`;
    }

    // Insert PENDING payment record
    await db.payment.create({
      data: {
        userId: (session.user as any).id,
        amount: plan.price,
        currency: 'INR',
        status: 'PENDING',
        razorpayOrderId: orderId,
        description: `Purchase of ${plan.name}`,
      }
    });

    return NextResponse.json({
      success: true,
      isMock,
      orderId,
      amount: plan.price,
      currency: 'INR',
      planId: plan.id,
      planName: plan.name,
    });

  } catch (error) {
    console.error('Create order API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
