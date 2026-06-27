'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Check, Star } from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  slug: string;
  price: number;
  duration: number;
  tier: string;
  description: string;
  features: string; // JSON string list
  popular: boolean;
}

interface SandboxData {
  orderId: string;
  planId: string;
  planName: string;
  price: number;
}

export default function PricingCards({ plans }: { plans: Plan[] }) {
  const { data: session } = useSession();
  const router = useRouter();

  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [showSandbox, setShowSandbox] = useState(false);
  const [sandboxData, setSandboxData] = useState<SandboxData | null>(null);
  const [simulating, setSimulating] = useState(false);

  // Dynamic script loader for Razorpay
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleSelectPlan = async (plan: Plan) => {
    if (!session || !session.user) {
      router.push(`/login?callbackUrl=/#pricing`);
      return;
    }

    setLoadingPlanId(plan.id);

    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Failed to create order');
        setLoadingPlanId(null);
        return;
      }

      if (data.isMock) {
        // Open Sandbox Simulator modal
        setSandboxData({
          orderId: data.orderId,
          planId: plan.id,
          planName: plan.name,
          price: plan.price,
        });
        setShowSandbox(true);
        setLoadingPlanId(null);
      } else {
        // Load Razorpay Checkout SDK
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert('Failed to load Razorpay SDK. Running in simulator fallback...');
          setSandboxData({
            orderId: data.orderId,
            planId: plan.id,
            planName: plan.name,
            price: plan.price,
          });
          setShowSandbox(true);
          setLoadingPlanId(null);
          return;
        }

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_yourkeyhere',
          amount: data.amount * 100, // paise
          currency: data.currency,
          name: 'AB Fitness Gym',
          description: `Subscription: ${plan.name}`,
          order_id: data.orderId,
          handler: async function (response: any) {
            // Verify payment
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planId: plan.id,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              router.push('/dashboard/membership');
              router.refresh();
            } else {
              alert(verifyData.error || 'Payment verification failed');
            }
          },
          prefill: {
            name: session.user?.name || '',
            email: session.user?.email || '',
          },
          theme: {
            color: '#8b5cf6',
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
        setLoadingPlanId(null);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('An unexpected error occurred during checkout');
      setLoadingPlanId(null);
    }
  };

  const handleSimulateSuccess = async () => {
    if (!sandboxData) return;
    setSimulating(true);

    try {
      const verifyRes = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: sandboxData.orderId,
          paymentId: `pay_mock_${Math.random().toString(36).substring(2, 11)}`,
          signature: 'mock_signature',
          planId: sandboxData.planId,
        }),
      });

      const verifyData = await verifyRes.json();
      if (verifyRes.ok && verifyData.success) {
        setShowSandbox(false);
        router.push('/dashboard/membership');
        router.refresh();
      } else {
        alert(verifyData.error || 'Mock verification failed');
        setSimulating(false);
      }
    } catch (error) {
      console.error('Simulator error:', error);
      alert('Failed to verify mock payment');
      setSimulating(false);
    }
  };

  return (
    <div className="grid-3" style={{ marginTop: '3rem', position: 'relative' }}>
      {plans.map((plan) => {
        const features: string[] = JSON.parse(plan.features || '[]');
        const isLoading = loadingPlanId === plan.id;

        return (
          <div 
            key={plan.id} 
            className={`card-gradient pricing-card`}
            style={plan.popular ? { 
              borderColor: 'var(--primary)', 
              boxShadow: '0 10px 30px rgba(139, 92, 246, 0.15)',
              background: 'linear-gradient(180deg, rgba(139, 92, 246, 0.05) 0%, rgba(18, 18, 30, 0.8) 100%)'
            } : {}}
          >
            {plan.popular && (
              <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                <span className="badge badge-gold">Popular</span>
              </div>
            )}
            
            <div className="pricing-header">
              <span className="pricing-tier">{plan.name}</span>
              <div className="pricing-price-container">
                <span className="pricing-currency">₹</span>
                <span className="pricing-price">{plan.price.toLocaleString('en-IN')}</span>
                <span className="pricing-duration">/{plan.duration} mo</span>
              </div>
              <p className="pricing-desc">{plan.description}</p>
            </div>
            
            <ul className="pricing-features">
              {features.map((feat, i) => (
                <li key={i} className="pricing-feature">
                  <span className="pricing-feature-check"><Check size={16} /></span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
            
            <button 
              onClick={() => handleSelectPlan(plan)}
              className={`btn ${plan.popular ? 'btn-primary' : 'btn-secondary'}`} 
              style={{ width: '100%', marginTop: 'auto' }}
              disabled={isLoading}
            >
              {isLoading ? 'Processing...' : 'Get Started'}
            </button>
          </div>
        );
      })}

      {/* Sandbox Simulator Modal */}
      {showSandbox && sandboxData && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.85)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 10000,
          padding: '1.5rem',
          backdropFilter: 'blur(8px)'
        }}>
          <div className="card-glass" style={{
            maxWidth: '450px',
            width: '100%',
            padding: '2.5rem 2rem',
            border: '1px solid var(--secondary)',
            boxShadow: '0 0 30px rgba(6, 182, 212, 0.25)',
            textAlign: 'center'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(6, 182, 212, 0.1)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 1.5rem auto',
              border: '1px solid var(--secondary)',
              color: 'var(--secondary)'
            }}>
              <Star size={30} fill="var(--secondary)" style={{ margin: '0 auto' }} />
            </div>

            <h3 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', marginBottom: '0.5rem' }}>
              Razorpay Sandbox Simulator
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              We detected placeholder keys. Proceed to simulate a successful checkout.
            </p>

            <div style={{
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'left',
              fontSize: '0.9rem',
              marginBottom: '2rem',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}>
              <div><strong>Plan Name:</strong> {sandboxData.planName}</div>
              <div><strong>Price Amount:</strong> ₹{sandboxData.price}</div>
              <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <strong>Order ID:</strong> {sandboxData.orderId}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={handleSimulateSuccess} 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={simulating}
              >
                {simulating ? 'Processing...' : 'Simulate Success'}
              </button>
              <button 
                onClick={() => setShowSandbox(false)} 
                className="btn btn-secondary"
                style={{ width: '100%' }}
                disabled={simulating}
              >
                Cancel Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
