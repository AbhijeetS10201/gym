'use client';

import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';

export default function RestTimer({ defaultSeconds }: { defaultSeconds: number }) {
  const [seconds, setSeconds] = useState(defaultSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds((prev) => prev - 1);
      }, 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      // Play a subtle notification tone or visual effect if desired
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setIsActive(false);
    setSeconds(defaultSeconds);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins}:${remaining < 10 ? '0' : ''}${remaining}`;
  };

  return (
    <div 
      style={{ 
        display: 'inline-flex', 
        alignItems: 'center', 
        gap: '0.75rem', 
        background: 'rgba(255, 255, 255, 0.03)', 
        border: '1px solid var(--border-color)', 
        borderRadius: 'var(--radius-sm)', 
        padding: '0.4rem 0.8rem',
        fontSize: '0.85rem'
      }}
    >
      <Timer size={16} className="text-secondary" style={{ color: 'var(--secondary)' }} />
      <span style={{ fontFamily: 'monospace', fontWeight: 'bold', minWidth: '35px' }}>
        {formatTime(seconds)}
      </span>
      <button 
        onClick={toggle} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: '#ffffff', 
          display: 'flex', 
          alignItems: 'center' 
        }}
        title={isActive ? 'Pause' : 'Start Timer'}
      >
        {isActive ? <Pause size={14} /> : <Play size={14} />}
      </button>
      <button 
        onClick={reset} 
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: 'var(--text-secondary)', 
          display: 'flex', 
          alignItems: 'center' 
        }}
        title="Reset"
      >
        <RotateCcw size={14} />
      </button>
    </div>
  );
}
