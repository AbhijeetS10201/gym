'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Particle {
  id: number;
  top: string;
  left: string;
  size: string;
  delay: string;
  duration: string;
}

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    setMounted(true);
    // Generate randomized particles client-side only to ensure hydration safety
    const generated: Particle[] = Array.from({ length: 6 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 80 + 10}%`,
      left: `${Math.random() * 80 + 10}%`,
      size: `${Math.random() * 150 + 50}px`,
      delay: `${Math.random() * 5}s`,
      duration: `${Math.random() * 10 + 10}s`,
    }));
    setParticles(generated);
  }, []);

  return (
    <section className="hero-section">
      {/* Decorative Particles */}
      <div className="hero-particles">
        {mounted &&
          particles.map((p) => (
            <div
              key={p.id}
              className="hero-particle"
              style={{
                top: p.top,
                left: p.left,
                width: p.size,
                height: p.size,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            />
          ))}
      </div>

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div className="hero-badge">All-India Gym Access</div>
        <h1 className="hero-title">
          TRANSFORM YOUR VIBE<br />
          <span className="text-gradient">SHAPE YOUR DREAMS</span>
        </h1>
        <p className="hero-subtitle">
          Experience fitness elevated. Gain access to premium group classes, state-of-the-art facilities, certified trainers, and digital progress tracking at 25+ premium Indian locations.
        </p>

        <div className="hero-ctas">
          <Link href="/register" className="btn btn-primary btn-lg">
            Join AB Fitness
          </Link>
          <Link href="/#pricing" className="btn btn-secondary btn-lg">
            Explore Plans
          </Link>
        </div>
      </div>
    </section>
  );
}
