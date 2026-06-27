import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { generateCardNumber } from '@/lib/razorpay';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { orderId, paymentId, signature, planId } = await req.json();
    if (!orderId || !planId) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const userId = (session.user as any).id;
    let isValid = false;

    if (orderId.startsWith('order_mock_')) {
      isValid = signature === 'mock_signature';
    } else {
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        return NextResponse.json({ error: 'Gateway configuration secret is missing' }, { status: 500 });
      }
      
      const generatedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(`${orderId}|${paymentId}`)
        .digest('hex');

      isValid = generatedSignature === signature;
    }

    if (!isValid) {
      // Find the pending payment and mark it as FAILED
      await db.payment.updateMany({
        where: { razorpayOrderId: orderId, userId },
        data: { status: 'FAILED' }
      });
      return NextResponse.json({ error: 'Invalid signature. Payment verification failed.' }, { status: 400 });
    }

    // Retrieve the plan to calculate duration
    const plan = await db.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return NextResponse.json({ error: 'Associated subscription plan not found' }, { status: 404 });
    }

    // Update payment record to SUCCESS
    const paymentRecord = await db.payment.findFirst({
      where: { razorpayOrderId: orderId, userId }
    });

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(startDate.getMonth() + plan.duration);

    const cardNumber = generateCardNumber();

    // Create the active membership
    const membership = await db.membership.create({
      data: {
        userId,
        planId: plan.id,
        status: 'ACTIVE',
        cardNumber,
        startDate,
        endDate,
        autoRenew: true
      }
    });

    // Update payment with success details and link membership
    if (paymentRecord) {
      await db.payment.update({
        where: { id: paymentRecord.id },
        data: {
          status: 'SUCCESS',
          razorpayPaymentId: paymentId || 'mock_payment_id',
          razorpaySignature: signature || 'mock_signature',
          membershipId: membership.id
        }
      });
    } else {
      // Create success log if not found
      await db.payment.create({
        data: {
          userId,
          amount: plan.price,
          currency: 'INR',
          status: 'SUCCESS',
          razorpayOrderId: orderId,
          razorpayPaymentId: paymentId || 'mock_payment_id',
          razorpaySignature: signature || 'mock_signature',
          membershipId: membership.id,
          description: `Direct purchase of ${plan.name}`,
        }
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified and membership activated!',
      cardNumber,
      membershipId: membership.id
    });

  } catch (error) {
    console.error('Verify payment API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
