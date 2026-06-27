'use client';

import React, { useState, useMemo } from 'react';
import { Search, MapPin, Phone, Clock, Star, Mail } from 'lucide-react';

interface GymLocation {
  id: string;
  name: string;
  city: string;
  state: string;
  address: string;
  phone: string | null;
  email: string | null;
  lat: number;
  lng: number;
  timings: string;
  rating: number;
  imageUrl: string | null;
  amenities: string;
}

export default function LocationsSearch({ locations }: { locations: GymLocation[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  // Extract unique cities for quick filters
  const cities = useMemo(() => {
    const uniqueCities = new Set(locations.map((loc) => loc.city));
    return ['All', ...Array.from(uniqueCities).sort()];
  }, [locations]);

  // Filter locations based on query and city
  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesCity = selectedCity === 'All' || loc.city === selectedCity;
      const cleanQuery = searchQuery.toLowerCase();
      const matchesSearch =
        loc.name.toLowerCase().includes(cleanQuery) ||
        loc.city.toLowerCase().includes(cleanQuery) ||
        loc.state.toLowerCase().includes(cleanQuery) ||
        loc.address.toLowerCase().includes(cleanQuery);

      return matchesCity && matchesSearch;
    });
  }, [locations, searchQuery, selectedCity]);

  return (
    <div>
      {/* Search and Filters Panel */}
      <div 
        style={{ 
          background: 'var(--bg-secondary)', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-lg)', 
          padding: '1.5rem', 
          marginBottom: '2.5rem' 
        }}
      >
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
            placeholder="Search by gym name, city, state, or address..."
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

        {/* City Filter Tabs */}
        <div>
          <span style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', fontWeight: 600 }}>
            QUICK CITY FILTER
          </span>
          <div 
            style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              flexWrap: 'wrap', 
              maxHeight: '120px', 
              overflowY: 'auto',
              paddingBottom: '0.25rem'
            }}
          >
            {cities.map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className="badge"
                style={{
                  background: selectedCity === city ? 'var(--gradient-electric)' : 'rgba(255,255,255,0.03)',
                  border: selectedCity === city ? 'none' : '1px solid var(--border-color)',
                  color: '#ffffff',
                  padding: '0.5rem 1rem',
                  fontSize: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  fontWeight: selectedCity === city ? 'bold' : 'normal',
                  transition: 'var(--transition-fast)'
                }}
              >
                {city.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {filteredLocations.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '5rem 2rem', color: 'var(--text-secondary)' }}>
          <MapPin size={48} style={{ opacity: 0.3, marginBottom: '1rem', color: 'var(--secondary)' }} />
          <h3>No Gym Locations Found</h3>
          <p style={{ marginTop: '0.5rem' }}>Try refining your search keyword or selecting a different city filter.</p>
        </div>
      ) : (
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
            gap: '1.5rem' 
          }}
        >
          {filteredLocations.map((loc) => {
            const parsedAmenities: string[] = JSON.parse(loc.amenities || '[]');
            return (
              <div
                key={loc.id}
                className="glass-card"
                style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '260px',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-secondary)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform var(--transition-fast), border-color var(--transition-fast)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--secondary)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{loc.name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-yellow)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      <Star size={16} fill="var(--accent-yellow)" style={{ color: 'var(--accent-yellow)' }} />
                      <span>{loc.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                      <MapPin size={16} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                      <span>{loc.address}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} style={{ color: 'var(--primary)' }} />
                      <span>{loc.timings}</span>
                    </div>
                    {loc.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Phone size={16} style={{ color: 'var(--primary)' }} />
                        <span>{loc.phone}</span>
                      </div>
                    )}
                    {loc.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Mail size={16} style={{ color: 'var(--primary)' }} />
                        <span>{loc.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    {parsedAmenities.map((amenity, i) => (
                      <span key={i} className="badge" style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}>
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
