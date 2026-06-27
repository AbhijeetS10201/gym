'use client';

import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, Dumbbell, Award, HelpCircle } from 'lucide-react';

interface Exercise {
  id: string;
  name: string;
  slug: string;
  muscleGroup: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  tips: string; // JSON string array
  videoUrl: string | null;
  imageUrl: string | null;
}

export default function ExercisesSearch({ exercises }: { exercises: Exercise[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Extract unique muscles and equipment
  const muscles = useMemo(() => {
    const unique = new Set(exercises.map((ex) => ex.muscleGroup));
    return ['All', ...Array.from(unique).sort()];
  }, [exercises]);

  const equipments = useMemo(() => {
    const unique = new Set(exercises.map((ex) => ex.equipment));
    return ['All', ...Array.from(unique).sort()];
  }, [exercises]);

  // Filter exercises
  const filteredExercises = useMemo(() => {
    return exercises.filter((ex) => {
      const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup === selectedMuscle;
      const matchesEquipment = selectedEquipment === 'All' || ex.equipment === selectedEquipment;
      const cleanQuery = searchQuery.toLowerCase();
      const matchesSearch =
        ex.name.toLowerCase().includes(cleanQuery) ||
        ex.instructions.toLowerCase().includes(cleanQuery) ||
        ex.muscleGroup.toLowerCase().includes(cleanQuery) ||
        ex.equipment.toLowerCase().includes(cleanQuery);

      return matchesMuscle && matchesEquipment && matchesSearch;
    });
  }, [exercises, searchQuery, selectedMuscle, selectedEquipment]);

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case 'beginner':
        return 'var(--accent-green)';
      case 'intermediate':
        return 'var(--accent-orange)';
      case 'advanced':
        return 'var(--accent-red)';
      default:
        return 'var(--primary)';
    }
  };

  return (
    <div>
      {/* Search & Filters */}
      <div 
        style={{ 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.5rem', 
          marginBottom: '2.5rem' 
        }}
      >
        {/* Text Search */}
        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Search 
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)', 
              color: 'var(--text-secondary)' 
            }} 
            size={20} 
          />
          <input
            type="text"
            placeholder="Search exercises by name, instruction, muscle, or equipment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1rem 1rem 3rem',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              color: '#ffffff',
              fontSize: '1rem',
              outline: 'none',
              transition: 'var(--transition-fast)'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--primary)';
              e.target.style.boxShadow = '0 0 15px rgba(139, 92, 246, 0.15)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'var(--border-color)';
              e.target.style.boxShadow = 'none';
            }}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {/* Muscle Filter */}
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
              MUSCLE GROUP
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {muscles.map((muscle) => (
                <button
                  key={muscle}
                  onClick={() => setSelectedMuscle(muscle)}
                  style={{
                    background: selectedMuscle === muscle ? 'var(--gradient-electric)' : 'rgba(255,255,255,0.02)',
                    border: selectedMuscle === muscle ? 'none' : '1px solid var(--border-color)',
                    color: '#ffffff',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: selectedMuscle === muscle ? 'bold' : 'normal',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {muscle.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Filter */}
          <div>
            <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
              EQUIPMENT
            </span>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {equipments.map((equip) => (
                <button
                  key={equip}
                  onClick={() => setSelectedEquipment(equip)}
                  style={{
                    background: selectedEquipment === equip ? 'var(--gradient-electric)' : 'rgba(255,255,255,0.02)',
                    border: selectedEquipment === equip ? 'none' : '1px solid var(--border-color)',
                    color: '#ffffff',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    fontWeight: selectedEquipment === equip ? 'bold' : 'normal',
                    transition: 'var(--transition-fast)'
                  }}
                >
                  {equip.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grid of Exercises */}
      {filteredExercises.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-secondary)' }}>
          <Dumbbell size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--primary)' }} />
          <h3>No Exercises Found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try clearing your filters or refining your search text.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredExercises.map((ex) => {
            const isExpanded = expandedId === ex.id;
            const parsedTips: string[] = JSON.parse(ex.tips || '[]');

            return (
              <div
                key={ex.id}
                style={{
                  background: 'var(--bg-secondary)',
                  border: `1px solid ${isExpanded ? 'var(--primary)' : 'var(--border-color)'}`,
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  transition: 'border-color var(--transition-fast)'
                }}
              >
                {/* Main Header bar */}
                <div
                  onClick={() => toggleExpand(ex.id)}
                  style={{
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer',
                    userSelect: 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)' }}>
                      {ex.name}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span className="badge" style={{ fontSize: '0.7rem' }}>
                        {ex.muscleGroup.toUpperCase()}
                      </span>
                      <span className="badge" style={{ fontSize: '0.7rem' }}>
                        {ex.equipment.toUpperCase()}
                      </span>
                      <span
                        className="badge"
                        style={{
                          fontSize: '0.7rem',
                          borderColor: getDifficultyColor(ex.difficulty),
                          color: getDifficultyColor(ex.difficulty)
                        }}
                      >
                        {ex.difficulty.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div style={{ color: 'var(--text-secondary)' }}>
                    {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </div>
                </div>

                {/* Collapsible content details */}
                {isExpanded && (
                  <div 
                    style={{ 
                      padding: '0 1.5rem 1.5rem 1.5rem', 
                      borderTop: '1px solid rgba(255,255,255,0.04)',
                      paddingTop: '1.25rem' 
                    }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <HelpCircle size={16} /> Instructions
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          {ex.instructions}
                        </p>
                      </div>

                      {parsedTips.length > 0 && (
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Award size={16} /> Pro Tips
                          </h4>
                          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: 0 }}>
                            {parsedTips.map((tip, i) => (
                              <li key={i} style={{ marginBottom: '0.25rem' }}>
                                {tip}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
