'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, LogOut, Dumbbell } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link href="/" className="navbar-logo">
          <Dumbbell size={28} style={{ color: 'var(--primary)' }} />
          <span>AB FITNESS</span>
          <span className="auth-logo-dot" />
        </Link>

        {/* Desktop Links */}
        <div className="navbar-links">
          <Link href="/#features" className="navbar-link">Features</Link>
          <Link href="/#locations" className="navbar-link">Locations</Link>
          <Link href="/#pricing" className="navbar-link">Plans</Link>
          {session && (
            <Link href="/dashboard" className="navbar-link">Dashboard</Link>
          )}
        </div>

        {/* Desktop Actions */}
        <div className="navbar-actions">
          {session ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Hi, {session.user?.name?.split(' ')[0]}
              </span>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem 0.8rem' }}
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Toggle Button */}
        <button onClick={toggleMenu} className="navbar-mobile-toggle">
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isOpen ? 'open' : ''}`}>
        <Link href="/#features" onClick={toggleMenu} className="mobile-menu-link">Features</Link>
        <Link href="/#locations" onClick={toggleMenu} className="mobile-menu-link">Locations</Link>
        <Link href="/#pricing" onClick={toggleMenu} className="mobile-menu-link">Plans</Link>
        {session ? (
          <>
            <Link href="/dashboard" onClick={toggleMenu} className="mobile-menu-link">Dashboard</Link>
            <button 
              onClick={() => { toggleMenu(); signOut({ callbackUrl: '/' }); }}
              className="btn btn-secondary"
              style={{ width: '100%', marginTop: '1rem' }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/login" onClick={toggleMenu} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}
