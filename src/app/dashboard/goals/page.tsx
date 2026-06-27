'use client';

import React, { useState, useEffect } from 'react';
import { 
  Target, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Calendar, 
  TrendingUp, 
  X, 
  ChevronRight,
  Dumbbell
} from 'lucide-react';

interface FitnessGoal {
  id: string;
  type: string;
  title: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  status: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<FitnessGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formType, setFormType] = useState('Strength');
  const [formTitle, setFormTitle] = useState('');
  const [formTarget, setFormTarget] = useState('');
  const [formCurrent, setFormCurrent] = useState('0');
  const [formUnit, setFormUnit] = useState('kg');
  const [formDeadline, setFormDeadline] = useState('');

  // Inline progress update state
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [updateVal, setUpdateVal] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/goals');
      if (!res.ok) throw new Error('Failed to load goals');
      const data = await res.json();
      setGoals(data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formTarget || !formUnit || !formDeadline) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const res = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formType,
          title: formTitle,
          target: parseFloat(formTarget),
          current: parseFloat(formCurrent) || 0,
          unit: formUnit,
          deadline: formDeadline,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create goal');
      }

      setIsModalOpen(false);
      resetForm();
      fetchGoals();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateProgress = async (id: string) => {
    const val = parseFloat(updateVal);
    if (isNaN(val)) return;

    try {
      const res = await fetch('/api/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          current: val,
        }),
      });

      if (!res.ok) throw new Error('Failed to update goal');
      
      setUpdatingId(null);
      setUpdateVal('');
      fetchGoals();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleToggleComplete = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'COMPLETED' ? 'IN_PROGRESS' : 'COMPLETED';
    try {
      const res = await fetch('/api/goals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          status: nextStatus,
        }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      fetchGoals();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteGoal = async (id: string) => {
    if (!confirm('Are you sure you want to archive/delete this goal?')) return;
    try {
      const res = await fetch(`/api/goals?id=${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Failed to delete goal');
      fetchGoals();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const resetForm = () => {
    setFormType('Strength');
    setFormTitle('');
    setFormTarget('');
    setFormCurrent('0');
    setFormUnit('kg');
    setFormDeadline('');
  };

  const calculatePercent = (current: number, target: number) => {
    if (target === 0) return 0;
    const pct = (current / target) * 100;
    return Math.min(100, Math.max(0, Math.round(pct)));
  };

  const getDaysRemaining = (dateStr: string) => {
    const diffTime = new Date(dateStr).getTime() - new Date().getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return 'Overdue';
    if (diffDays === 0) return 'Today';
    return `${diffDays} days left`;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>Fitness Goals</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Set training checkpoints, track key metrics, and measure progression over time.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setIsModalOpen(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <Plus size={18} /> Add New Goal
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)' }}>Loading your goals...</div>
      ) : error ? (
        <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--accent-red)' }}>Error: {error}</div>
      ) : goals.length === 0 ? (
        <div 
          style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-md)', 
            padding: '4rem 2rem', 
            textAlign: 'center', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto' 
          }}
        >
          <Target size={48} style={{ opacity: 0.3, marginBottom: '1.5rem', color: 'var(--primary)' }} />
          <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem', color: '#ffffff' }}>No Active Goals</h3>
          <p style={{ marginBottom: '1.5rem' }}>Defining milestones increases workout consistency. Add your first goal today.</p>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>Create Your First Goal</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
          {goals.map((goal) => {
            const pct = calculatePercent(goal.current, goal.target);
            const daysLeft = getDaysRemaining(goal.deadline);
            const isCompleted = goal.status === 'COMPLETED' || pct >= 100;

            return (
              <div 
                key={goal.id} 
                className="glass-card" 
                style={{ 
                  background: 'var(--bg-secondary)', 
                  border: isCompleted ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1rem',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <span className="badge" style={{ fontSize: '0.7rem', verticalAlign: 'middle', marginRight: '0.5rem' }}>{goal.type}</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', display: 'inline-block', textDecoration: isCompleted ? 'line-through' : 'none', opacity: isCompleted ? 0.6 : 1 }}>
                      {goal.title}
                    </h3>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button 
                      onClick={() => handleToggleComplete(goal.id, goal.status)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: isCompleted ? 'var(--accent-green)' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: '0.85rem'
                      }}
                      title={isCompleted ? "Mark Incomplete" : "Mark Completed"}
                    >
                      <CheckCircle size={16} fill={isCompleted ? "var(--accent-green)" : "none"} />
                      <span>{isCompleted ? 'Completed' : 'Check Off'}</span>
                    </button>
                    <button 
                      onClick={() => handleDeleteGoal(goal.id)}
                      style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      title="Archive Goal"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Progress bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>
                    <span>
                      Progress: <strong>{goal.current}</strong> / {goal.target} {goal.unit}
                    </span>
                    <span>
                      {pct}%
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        width: `${pct}%`, 
                        height: '100%', 
                        background: isCompleted ? 'var(--accent-green)' : 'var(--gradient-electric)',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease-out'
                      }} 
                    />
                  </div>
                </div>

                {/* Footer and Update Controls */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '0.85rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Calendar size={14} />
                    <span>Deadline: {new Date(goal.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ({daysLeft})</span>
                  </div>

                  {updatingId === goal.id ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <input
                        type="number"
                        placeholder="Current value"
                        value={updateVal}
                        onChange={(e) => setUpdateVal(e.target.value)}
                        style={{
                          background: 'rgba(0,0,0,0.2)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '4px',
                          color: '#ffffff',
                          padding: '0.25rem 0.5rem',
                          width: '100px',
                          fontSize: '0.85rem'
                        }}
                      />
                      <button 
                        onClick={() => handleUpdateProgress(goal.id)}
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.75rem', fontSize: '0.8rem' }}
                      >
                        Save
                      </button>
                      <button 
                        onClick={() => setUpdatingId(null)}
                        style={{ background: 'none', border: 'none', color: '#ffffff', cursor: 'pointer' }}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    !isCompleted && (
                      <button 
                        onClick={() => {
                          setUpdatingId(goal.id);
                          setUpdateVal(goal.current.toString());
                        }}
                        style={{ 
                          background: 'none', 
                          border: 'none', 
                          color: 'var(--secondary)', 
                          fontWeight: '600', 
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.25rem'
                        }}
                      >
                        Update Progress <ChevronRight size={14} />
                      </button>
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Goal Modal overlay */}
      {isModalOpen && (
        <div 
          style={{ 
            position: 'fixed', 
            top: 0, 
            left: 0, 
            width: '100vw', 
            height: '100vh', 
            background: 'rgba(0,0,0,0.85)', 
            backdropFilter: 'blur(5px)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            zIndex: 1000 
          }}
        >
          <div 
            style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-lg)', 
              width: '90%', 
              maxWidth: '500px', 
              padding: '2rem',
              position: 'relative'
            }}
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Target className="text-primary" style={{ color: 'var(--primary)' }} /> Create Fitness Goal
            </h2>

            <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Goal Type</label>
                <select
                  value={formType}
                  onChange={(e) => setFormType(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                >
                  <option value="Strength">Strength / Lifting</option>
                  <option value="Weight Loss">Weight Management</option>
                  <option value="Endurance">Cardio & Endurance</option>
                  <option value="Consistency">Consistency / Freq</option>
                  <option value="Other">Other Milestone</option>
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Goal Description</label>
                <input
                  type="text"
                  placeholder="e.g. Squat 100 kg, Run 5k without stopping"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: 'rgba(0,0,0,0.2)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    color: '#ffffff',
                    outline: 'none'
                  }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Target Value</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="100"
                    value={formTarget}
                    onChange={(e) => setFormTarget(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Unit of Measure</label>
                  <input
                    type="text"
                    placeholder="kg, reps, mins, sessions"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Current Value</label>
                  <input
                    type="number"
                    step="any"
                    placeholder="0"
                    value={formCurrent}
                    onChange={(e) => setFormCurrent(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      background: 'rgba(0,0,0,0.2)',
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-sm)',
                      color: '#ffffff',
                      outline: 'none'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>Deadline</label>
                  <input
                    type="date"
                    value={formDeadline}
                    onChange={(e) => setFormDeadline(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
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

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
