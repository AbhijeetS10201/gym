'use client';

import React, { useState } from 'react';
import { MapPin, Phone, Clock, Star } from 'lucide-react';

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

export default function LocationsPreview({ locations }: { locations: GymLocation[] }) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const activeLoc = locations[selectedIdx] || locations[0];

  // Function to project coordinates onto a 2D box for India
  // Latitude: 8 to 36 North, Longitude: 68 to 97 East
  const getMarkerCoords = (lat: number, lng: number) => {
    const minLat = 8;
    const maxLat = 36;
    const minLng = 68;
    const maxLng = 97;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100;

    return {
      left: `${Math.max(5, Math.min(95, x))}%`,
      top: `${Math.max(5, Math.min(95, y))}%`,
    };
  };

  const activeCoords = activeLoc 
    ? getMarkerCoords(activeLoc.lat, activeLoc.lng) 
    : { left: '50%', top: '50%' };

  return (
    <section id="locations" className="section container">
      <div className="section-header">
        <span className="section-subtitle">Gym Locator</span>
        <h2 className="section-title">FIND YOUR GYM</h2>
        <p className="section-desc">
          Work out at any of our 25+ premium gym locations across India. Change your location in the portal anytime.
        </p>
      </div>

      <div className="locations-container" style={{ marginTop: '2rem' }}>
        {/* Left column: scrollable locations list */}
        <div className="locations-list">
          {locations.map((loc, idx) => {
            const parsedAmenities: string[] = JSON.parse(loc.amenities || '[]');
            return (
              <div
                key={loc.id}
                className={`location-item ${idx === selectedIdx ? 'active' : ''}`}
                onClick={() => setSelectedIdx(idx)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 className="location-name">{loc.name}</h3>
                    <p className="location-city" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {loc.address}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--accent-yellow)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <Star size={16} fill="var(--accent-yellow)" style={{ color: 'var(--accent-yellow)' }} />
                    <span>{loc.rating.toFixed(1)}</span>
                  </div>
                </div>

                <div className="location-details" style={{ marginTop: '0.5rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                    <Clock size={14} />
                    {loc.timings}
                  </span>
                  {loc.phone && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Phone size={14} />
                      {loc.phone}
                    </span>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.5rem' }}>
                  {parsedAmenities.slice(0, 3).map((amenity, i) => (
                    <span key={i} className="badge" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                      {amenity}
                    </span>
                  ))}
                  {parsedAmenities.length > 3 && (
                    <span className="badge" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
                      +{parsedAmenities.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Right column: interactive map */}
        <div className="map-container">
          <div className="map-grid-lines" />
          <div className="map-glow-center" />

          {activeLoc && (
            <div
              className="map-marker"
              style={{
                left: activeCoords.left,
                top: activeCoords.top,
                transform: 'translate(-50%, -100%)',
              }}
            >
              <div className="map-marker-pin" />
              <div className="map-marker-card">
                {activeLoc.name.replace('AB Fitness - ', '')} ({activeLoc.city})
              </div>
            </div>
          )}

          <div style={{
            position: 'absolute',
            bottom: '1rem',
            left: '1rem',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '600'
          }}>
            India Geo-locator Grid
          </div>
        </div>
      </div>
    </section>
  );
}
