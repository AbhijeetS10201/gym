'use client';

import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

const TESTIMONIALS = [
  {
    name: "Aarav Sharma",
    role: "Gold Member (Mumbai)",
    rating: 5,
    text: "AB Fitness completely changed my daily routine. The All-India access is perfect for my travel schedules, and the digital progress logging makes tracking weights and sets extremely intuitive."
  },
  {
    name: "Priya Patel",
    role: "Platinum Member (Bengaluru)",
    rating: 5,
    text: "The personal coaching and customized nutrition guides have helped me break through plateaus. Plus, the premium dark-mode styling on the member dashboard feels so high-end."
  },
  {
    name: "Rohan Verma",
    role: "Gold Member (Delhi)",
    rating: 5,
    text: "State-of-the-art facilities! The cafe shakes are delicious, the group HIIT classes are incredibly high energy, and the staff is extremely professional. Worth every single rupee."
  }
];

export default function TestimonialsCarousel() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="section testimonials-section">
      <div className="container">
        <div className="section-header">
          <span className="section-subtitle">Testimonials</span>
          <h2 className="section-title">HEAR FROM OUR MEMBERS</h2>
        </div>

        <div className="carousel-container">
          <div className="carousel-slide">
            <div className="testimonial-rating">
              {Array.from({ length: TESTIMONIALS[activeIdx].rating }).map((_, i) => (
                <Star key={i} size={18} fill="var(--accent-yellow)" style={{ color: 'var(--accent-yellow)', marginRight: '0.15rem' }} />
              ))}
            </div>
            
            <p className="testimonial-text">
              "{TESTIMONIALS[activeIdx].text}"
            </p>

            <div className="testimonial-user">
              <div className="testimonial-avatar">
                {TESTIMONIALS[activeIdx].name.split(' ').map(n => n[0]).join('')}
              </div>
              <div style={{ textAlign: 'left' }}>
                <h4 className="testimonial-name">{TESTIMONIALS[activeIdx].name}</h4>
                <p className="testimonial-role">{TESTIMONIALS[activeIdx].role}</p>
              </div>
            </div>
          </div>

          <div className="carousel-dots">
            {TESTIMONIALS.map((_, idx) => (
              <button
                key={idx}
                className={`carousel-dot ${idx === activeIdx ? 'active' : ''}`}
                onClick={() => setActiveIdx(idx)}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
