'use client';

import React, { useState, useEffect } from 'react';

import {
  TrendingUp as TrendIcon,
  Scale as ScaleIcon,
  Percent as PercentIcon,
  Plus as PlusIcon,
  Calendar as CalendarIcon,
  FileText as FileIcon
} from 'lucide-react';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';

interface ProgressEntry {
  id: string;
  weight: number | null;
  bodyFat: number | null;
  notes: string | null;
  date: string;
}

export default function ProgressPage() {
  const [entries, setEntries] = useState<ProgressEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  // Form State
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    setIsMounted(true);
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/progress');
      if (!res.ok) throw new Error('Failed to load metrics');
      const data = await res.json();
      setEntries(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!weight && !bodyFat) {
      alert('Please fill in at least one metric (Weight or Body Fat)');
      return;
    }

    try {
      setSubmitting(true);
      setSuccessMsg('');
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weight: weight ? parseFloat(weight) : null,
          bodyFat: bodyFat ? parseFloat(bodyFat) : null,
          date,
          notes: notes || null
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to record progress');
      }

      setSuccessMsg('Metrics logged successfully!');
      setWeight('');
      setBodyFat('');
      setNotes('');
      fetchEntries();

      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Format date labels for chart
  const chartData = React.useMemo(() => {
    return entries.map(entry => ({
      ...entry,
      formattedDate: new Date(entry.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short'
      }),
      // Recharts handles nulls gracefully if they are undefined
      Weight: entry.weight || undefined,
      BodyFat: entry.bodyFat || undefined
    }));
  }, [entries]);

  const latestWeight = entries.filter(e => e.weight !== null).pop()?.weight || null;
  const latestBodyFat = entries.filter(e => e.bodyFat !== null).pop()?.bodyFat || null;

  return (
    <div>
      <div style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Progress Tracking</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Log and visualize body composition metrics over time to verify the efficacy of your routines.</p>
      </div>

      {/* Grid: Form and Quick Metrics */}
      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '3rem'
        }}
      >
        {/* Metric Form */}
        <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendIcon size={18} className="text-primary" style={{ color: 'var(--primary)' }} /> Log Body Metrics
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: '600' }}>Weight (kg)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="e.g. 78.5"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: '600' }}>Body Fat (%)</label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  placeholder="e.g. 14.2"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: '600' }}>Log Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: '600' }}>Notes</label>
              <textarea
                placeholder="Optional notes (e.g. measured morning fasting)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '60px',
                  fontFamily: 'inherit',
                  fontSize: '0.9rem'
                }}
              />
            </div>

            {successMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '0.5rem', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', textAlign: 'center' }}>
                {successMsg}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn btn-primary" style={{ padding: '0.75rem', fontSize: '0.9rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
              <PlusIcon size={16} /> Record Entry
            </button>
          </form>
        </div>

        {/* Current status display cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', justifyContent: 'space-between' }}>
          <div className="stat-card" style={{ flexGrow: 1 }}>
            <div className="stat-card-left">
              <span className="stat-card-label">Last Recorded Weight</span>
              <span className="stat-card-value">
                {latestWeight !== null ? `${latestWeight} kg` : '--'}
              </span>
            </div>
            <div className="stat-card-icon">
              <ScaleIcon size={24} />
            </div>
          </div>

          <div className="stat-card" style={{ flexGrow: 1 }}>
            <div className="stat-card-left">
              <span className="stat-card-label">Last Body Fat %</span>
              <span className="stat-card-value">
                {latestBodyFat !== null ? `${latestBodyFat} %` : '--'}
              </span>
            </div>
            <div className="stat-card-icon">
              <PercentIcon size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Visual Analytics graphs */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem' }}>Performance Charts</h2>

        {!isMounted || loading ? (
          <div 
            style={{ 
              height: '350px', 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              color: 'var(--text-secondary)' 
            }}
          >
            Loading visualization metrics...
          </div>
        ) : entries.length < 2 ? (
          <div 
            style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              padding: '4rem 2rem', 
              textAlign: 'center', 
              color: 'var(--text-secondary)' 
            }}
          >
            <TrendIcon size={40} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--primary)' }} />
            <h3>Insufficient Analytics Data</h3>
            <p style={{ marginTop: '0.5rem' }}>Please enter at least 2 metric logs to generate chart progression trends.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }} className="charts-grid">
            <style jsx global>{`
              @media (min-width: 1024px) {
                .charts-grid {
                  grid-template-columns: 1fr 1fr !important;
                }
              }
            `}</style>

            {/* Weight Progression Chart */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', paddingLeft: '0.75rem', marginBottom: '1.25rem', color: '#ffffff' }}>Weight Trend (kg)</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                    <XAxis dataKey="formattedDate" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis domain={['dataMin - 3', 'dataMax + 3']} stroke="var(--text-muted)" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ background: '#090d16', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#ffffff' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="Weight" 
                      stroke="#8b5cf6" 
                      strokeWidth={3} 
                      activeDot={{ r: 8 }} 
                      dot={{ stroke: '#8b5cf6', strokeWidth: 2, r: 4, fill: '#090d16' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Body Fat Progression Chart */}
            <div style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem 1rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: '700', paddingLeft: '0.75rem', marginBottom: '1.25rem', color: '#ffffff' }}>Body Fat Trend (%)</h3>
              <div style={{ width: '100%', height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.04)" />
                    <XAxis dataKey="formattedDate" stroke="var(--text-muted)" fontSize={11} />
                    <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="var(--text-muted)" fontSize={11} />
                    <Tooltip 
                      contentStyle={{ background: '#090d16', border: '1px solid var(--border-color)', borderRadius: '6px' }}
                      labelStyle={{ fontWeight: 'bold', color: '#ffffff' }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="BodyFat" 
                      stroke="#06b6d4" 
                      strokeWidth={3} 
                      activeDot={{ r: 8 }} 
                      dot={{ stroke: '#06b6d4', strokeWidth: 2, r: 4, fill: '#090d16' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log Feed Table */}
      {entries.length > 0 && (
        <div style={{ marginTop: '3rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem' }}>Metric History Log</h2>
          <div className="table-container">
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Weight (kg)</th>
                  <th>Body Fat (%)</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {[...entries].reverse().map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      {new Date(entry.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>
                    <td>{entry.weight !== null ? `${entry.weight} kg` : '--'}</td>
                    <td>{entry.bodyFat !== null ? `${entry.bodyFat} %` : '--'}</td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{entry.notes || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
