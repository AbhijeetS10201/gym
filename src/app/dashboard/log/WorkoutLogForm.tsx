'use client';

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Dumbbell, 
  Calendar, 
  Flame, 
  TrendingUp, 
  Plus, 
  AlertCircle,
  Clock,
  BookOpen
} from 'lucide-react';

interface ExerciseItem {
  id: string;
  name: string;
  muscleGroup: string;
}

interface WorkoutLog {
  id: string;
  exerciseId: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  notes: string | null;
  date: string;
}

export default function WorkoutLogForm({ exercises }: { exercises: ExerciseItem[] }) {
  const [logs, setLogs] = useState<WorkoutLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  
  // Form State
  const [exerciseId, setExerciseId] = useState(exercises[0]?.id || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [sets, setSets] = useState('3');
  const [reps, setReps] = useState('10');
  const [weight, setWeight] = useState('0');
  const [duration, setDuration] = useState('45');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Exercise Map to find names by ID
  const exerciseMap = React.useMemo(() => {
    return new Map(exercises.map(ex => [ex.id, ex]));
  }, [exercises]);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoadingLogs(true);
      const res = await fetch('/api/workout-log');
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingLogs(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exerciseId || !sets || !reps || !weight || !duration) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setSubmitting(true);
      setSuccessMsg('');
      const res = await fetch('/api/workout-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exerciseId,
          sets: parseInt(sets),
          reps: parseInt(reps),
          weight: parseFloat(weight),
          duration: parseInt(duration),
          notes: notes || null,
          date: date,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit log');
      }

      setSuccessMsg('Workout logged successfully!');
      // Reset form variables (keep date and duration for convenience)
      setWeight('0');
      setNotes('');
      // Refetch history
      fetchLogs();
      
      // Auto clear success message
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2.5rem' }} className="log-workspace-grid">
      {/* Visual media layout adjustments for wide monitors */}
      <style jsx global>{`
        @media (min-width: 1024px) {
          .log-workspace-grid {
            grid-template-columns: 360px 1fr !important;
          }
        }
      `}</style>

      {/* Left panel: Log entry form */}
      <div>
        <div 
          style={{ 
            background: 'var(--bg-secondary)', 
            border: '1px solid var(--border-color)', 
            borderRadius: 'var(--radius-lg)', 
            padding: '2rem 1.5rem' 
          }}
        >
          <h2 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ClipboardList className="text-secondary" style={{ color: 'var(--secondary)' }} /> Record Exercise
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>
                Select Exercise
              </label>
              <select
                value={exerciseId}
                onChange={(e) => setExerciseId(e.target.value)}
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
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name} ({ex.muscleGroup})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>
                Workout Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>
                  Sets
                </label>
                <input
                  type="number"
                  min="1"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
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
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>
                  Reps
                </label>
                <input
                  type="number"
                  min="1"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
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
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="any"
                  min="0"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
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

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>
                Duration (mins)
              </label>
              <input
                type="number"
                min="0"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
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
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.4rem', fontWeight: '600' }}>
                Workout Notes
              </label>
              <textarea
                placeholder="e.g. Felt strong today, raised chest posture, last set to failure"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  background: 'rgba(0,0,0,0.2)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  color: '#ffffff',
                  outline: 'none',
                  resize: 'vertical',
                  minHeight: '80px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            {successMsg && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-green)', color: 'var(--accent-green)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', textAlign: 'center' }}>
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                cursor: 'pointer'
              }}
            >
              <Plus size={16} /> {submitting ? 'Logging...' : 'Log Workout'}
            </button>
          </form>
        </div>
      </div>

      {/* Right panel: Timeline history */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '1.5rem' }}>Workout Log History</h2>

        {loadingLogs ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading workout history...</div>
        ) : logs.length === 0 ? (
          <div 
            style={{ 
              background: 'var(--bg-secondary)', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: '3rem', 
              textAlign: 'center', 
              color: 'var(--text-secondary)' 
            }}
          >
            <Dumbbell size={36} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--secondary)' }} />
            <p>Your log is currently empty. Record your first set to kick off your calendar feed.</p>
          </div>
        ) : (
          <div className="timeline-container">
            {logs.map((log) => {
              const ex = exerciseMap.get(log.exerciseId);
              return (
                <div key={log.id} className="timeline-item">
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <span className="timeline-title">
                        {ex?.name || 'Logged Exercise'}
                      </span>
                      <span className="timeline-date">
                        {new Date(log.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="timeline-body">
                      <div>
                        <strong>{log.sets} sets</strong> × <strong>{log.reps} reps</strong> at <strong>{log.weight} kg</strong>
                        {log.duration > 0 && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginLeft: '0.75rem', color: 'var(--text-secondary)' }}>
                            <Clock size={12} /> {log.duration} mins
                          </span>
                        )}
                      </div>
                      {log.notes && (
                        <div style={{ marginTop: '0.5rem', fontStyle: 'italic', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          Note: &quot;{log.notes}&quot;
                        </div>
                      )}
                      {ex?.muscleGroup && (
                        <span 
                          style={{ 
                            display: 'inline-block', 
                            fontSize: '0.7rem', 
                            background: 'rgba(255,255,255,0.05)', 
                            padding: '0.15rem 0.5rem', 
                            borderRadius: '4px', 
                            marginTop: '0.5rem' 
                          }}
                        >
                          {ex.muscleGroup.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
