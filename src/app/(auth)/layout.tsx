import React from 'react';
import '../auth.css';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="auth-container">
      {/* Left Column: Premium Gym Branding */}
      <div className="auth-sidebar">
        <div className="auth-sidebar-overlay" />
        
        <div className="auth-sidebar-header">
          <div className="auth-logo">
            AB FITNESS<span className="auth-logo-dot" />
          </div>
        </div>

        <div className="auth-sidebar-body">
          <div className="auth-quote-block">
            <p className="auth-quote">
              "THE ONLY BAD WORKOUT IS THE ONE THAT DID NOT HAPPEN."
            </p>
            <div className="auth-quote-author">AB Fitness Philosophy</div>
          </div>
        </div>

        <div className="auth-sidebar-footer">
          <div className="auth-stats-grid">
            <div>
              <div className="auth-stat-num">25+</div>
              <div className="auth-stat-label">Locations</div>
            </div>
            <div>
              <div className="auth-stat-num">50K+</div>
              <div className="auth-stat-label">Active Members</div>
            </div>
            <div>
              <div className="auth-stat-num">4.8★</div>
              <div className="auth-stat-label">Google Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Auth Form Inputs */}
      <div className="auth-form-side">
        {children}
      </div>
    </div>
  );
}
