import React from 'react';
import Link from 'next/link';
import { Dumbbell, Instagram, Twitter, Youtube, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div className="footer-brand">
            <Link href="/" className="footer-logo">
              <Dumbbell size={24} style={{ color: 'var(--primary)' }} />
              <span>AB FITNESS</span>
              <span className="auth-logo-dot" />
            </Link>
            <p className="footer-desc">
              India's premium gym franchise. Reshaping fitness with high-performance spaces and digital progress logs to help members conquer their ultimate goals.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="YouTube">
                <Youtube size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-icon" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Column 1: Explore */}
          <div className="footer-column">
            <h4 className="footer-title">Explore</h4>
            <ul className="footer-links">
              <li><Link href="/#features" className="footer-link">Features</Link></li>
              <li><Link href="/#locations" className="footer-link">Locations</Link></li>
              <li><Link href="/#pricing" className="footer-link">Pricing Plans</Link></li>
            </ul>
          </div>

          {/* Column 2: Account */}
          <div className="footer-column">
            <h4 className="footer-title">Account</h4>
            <ul className="footer-links">
              <li><Link href="/login" className="footer-link">Sign In</Link></li>
              <li><Link href="/register" className="footer-link">Register</Link></li>
              <li><Link href="/dashboard" className="footer-link">Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="footer-column">
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li className="footer-link" style={{ cursor: 'default' }}>support@abfitness.com</li>
              <li className="footer-link" style={{ cursor: 'default' }}>+91 98765 43210</li>
              <li className="footer-link" style={{ cursor: 'default' }}>Mumbai, India</li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} AB Fitness Gym Franchise. All rights reserved.</p>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/" className="footer-link">Privacy Policy</Link>
            <Link href="/" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
