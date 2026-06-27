'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { 
  LayoutDashboard, 
  CreditCard, 
  Target, 
  TrendingUp, 
  ClipboardList, 
  LogOut, 
  Dumbbell
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { href: '/dashboard/membership', label: 'Membership', icon: CreditCard },
    { href: '/dashboard/goals', label: 'Fitness Goals', icon: Target },
    { href: '/dashboard/progress', label: 'Progress Tracking', icon: TrendingUp },
    { href: '/dashboard/log', label: 'Workout Logger', icon: ClipboardList },
  ];

  const handleLogout = () => {
    signOut({ callbackUrl: '/' });
  };

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="dashboard-sidebar">
      <div>
        <div className="sidebar-logo">
          <Dumbbell className="text-primary" size={24} style={{ color: 'var(--primary)' }} />
          <span>AB FITNESS</span>
        </div>
        <nav className="sidebar-menu">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`sidebar-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {session?.user && (
        <div className="sidebar-user">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div className="sidebar-user-avatar">
              {getInitials(session.user.name)}
            </div>
            <div>
              <div className="sidebar-user-name" title={session.user.name || ''}>
                {session.user.name}
              </div>
              <div className="sidebar-user-role">
                {(session.user as any).role || 'MEMBER'}
              </div>
            </div>
          </div>
          <button 
            className="sidebar-logout-btn" 
            onClick={handleLogout} 
            title="Log Out"
            aria-label="Log Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      )}
    </aside>
  );
}
