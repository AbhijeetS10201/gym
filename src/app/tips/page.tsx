'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ChevronDown, ChevronUp, Shield, Apple, Users, Flame, Heart } from 'lucide-react';
import '../marketing.css';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
  icon: any;
}

export default function TipsPage() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sections: { title: string; desc: string; items: AccordionItem[] }[] = [
    {
      title: 'Workout Safety Guidelines',
      desc: 'Prevent injury and build strength safely with these foundational training practices.',
      items: [
        {
          id: 'safety-1',
          icon: Shield,
          question: 'Why is warm-up and cool-down essential?',
          answer: 'A proper warm-up raises body temperature and increases blood flow to active muscles, preparing your joints for load and preventing muscle tears. A cool-down gradually lowers heart rate and stretches warm muscles to maintain flexibility and reduce stiffness.',
        },
        {
          id: 'safety-2',
          icon: Shield,
          question: 'How do I know if I am lifting too heavy?',
          answer: 'If you cannot complete a repetition with a full range of motion, have to rely on momentum/swinging, or feel sharp joint pain rather than muscular exertion, the weight is too heavy. Drop the weight and focus on clean, controlled contractions.',
        },
        {
          id: 'safety-3',
          icon: Shield,
          question: 'What is the importance of proper breathing during exercises?',
          answer: 'Never hold your breath while lifting (unless using advanced bracing techniques like the Valsalva maneuver for heavy lifts). The general rule is: Exhale during exertion (pushing or pulling the load) and Inhale during the eccentric/lowering phase.',
        },
      ],
    },
    {
      title: 'Nutrition & Diet Advice',
      desc: 'Fuel your workout splits and maximize recovery with optimized macros and hydration.',
      items: [
        {
          id: 'nutr-1',
          icon: Apple,
          question: 'How much protein do I need daily for muscle growth?',
          answer: 'For active individuals aiming to build or maintain muscle mass, a daily intake of 1.6 to 2.2 grams of protein per kilogram of body weight is widely recommended. Distribute this across 3-5 meals throughout the day.',
        },
        {
          id: 'nutr-2',
          icon: Apple,
          question: 'What should I eat before and after a workout?',
          answer: 'Pre-workout (1-2 hours before): Eat easily digestible complex carbohydrates and moderate protein to fuel muscle glycogen. Post-workout (within 1-2 hours): Consume fast-acting protein (like whey or soy isolates) and carbohydrates to kickstart muscle repair and glycogen replenishment.',
        },
        {
          id: 'nutr-3',
          icon: Apple,
          question: 'How much water should I drink during exercise?',
          answer: 'Drink 500-700ml of water 2 hours before exercising. During your workout, sip 150-250ml every 15-20 minutes, especially in warm climates. If exercising for more than 60 minutes at high intensity, consider electrolyte supplements.',
        },
      ],
    },
    {
      title: 'Gym Etiquette & Code',
      desc: 'Maintain a clean, welcoming, and high-vibe workspace for all fitness enthusiasts.',
      items: [
        {
          id: 'et-1',
          icon: Users,
          question: 'What is the rule on re-racking weights?',
          answer: 'Always re-rack your weights (barbells, plates, and dumbbells) back in their designated holders. Leaving weights on bars or the floor is a safety hazard and creates clutter for fellow members.',
        },
        {
          id: 'et-2',
          icon: Users,
          question: 'Should I wipe down equipment after use?',
          answer: 'Yes, always. Use the disinfectant sprays and paper towels provided to clean sweat off benches, mats, and machine handles immediately after completing your sets.',
        },
        {
          id: 'et-3',
          icon: Users,
          question: 'Can I share gym machinery during peak hours?',
          answer: 'Absolutely. It is expected etiquette to let other members "work in" between your rest sets. Do not occupy machines while browsing your phone or resting for long periods.',
        },
      ],
    },
  ];

  const toggleAccordion = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: '120px', minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ marginBottom: '5rem', maxWidth: '800px' }}>
          <div className="section-header" style={{ marginBottom: '3.5rem' }}>
            <span className="section-subtitle">Faq & Guidelines</span>
            <h1 className="section-title">FITNESS TIPS & SAFETY</h1>
            <p className="section-desc">
              Your source of truth for exercise safety, nutritional optimization, and gym floor etiquette to keep your vibes and gains high.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {sections.map((section, sIdx) => (
              <div key={sIdx}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
                    {section.title}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    {section.desc}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {section.items.map((item) => {
                    const isOpen = activeId === item.id;
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.id}
                        style={{
                          background: 'var(--bg-secondary)',
                          border: `1px solid ${isOpen ? 'var(--secondary)' : 'var(--border-color)'}`,
                          borderRadius: 'var(--radius-md)',
                          overflow: 'hidden',
                          transition: 'border-color var(--transition-fast)'
                        }}
                      >
                        {/* Title trigger */}
                        <div
                          onClick={() => toggleAccordion(item.id)}
                          style={{
                            padding: '1.25rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            cursor: 'pointer',
                            userSelect: 'none'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <Icon size={18} style={{ color: isOpen ? 'var(--secondary)' : 'var(--text-secondary)' }} />
                            <span style={{ fontSize: '0.98rem', fontWeight: '700', color: isOpen ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                              {item.question}
                            </span>
                          </div>
                          <div style={{ color: 'var(--text-secondary)' }}>
                            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                          </div>
                        </div>

                        {/* Answer block */}
                        {isOpen && (
                          <div
                            style={{
                              padding: '0 1.25rem 1.25rem 1.25rem',
                              borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                              paddingTop: '1rem',
                              fontSize: '0.9rem',
                              color: 'var(--text-secondary)',
                              lineHeight: '1.6'
                            }}
                          >
                            {item.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
