import React from 'react';
import { X, MapPin, Navigation, Home, Briefcase, Check } from 'lucide-react';
import { SAVED_LOCATIONS } from '../data/fashionData';

const LOCATION_ICONS = {
  Home,
  Office: Briefcase,
  'Hotel / Club': MapPin
};

export default function LocationModal({ isOpen, onClose, selectedLocation, onSelectLocation }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <MapPin size={20} color="#0C831F" />
            <span>Select Delivery Address</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {/* Current GPS detection button */}
          <button 
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              border: '1.5px solid #0C831F',
              background: '#F0FDF4',
              color: '#0C831F',
              fontWeight: 800,
              fontSize: '13px',
              marginBottom: '16px',
              cursor: 'pointer'
            }}
            onClick={() => {
              onSelectLocation({
                id: 'gps-current',
                tag: 'Current Location',
                shortAddress: '100 Feet Rd, Indiranagar (Detected via GPS)',
                fullAddress: 'Live GPS Pin: 100 Feet Road, Near Metro Pillar #82, Indiranagar, Bengaluru',
                darkStore: 'Indiranagar Hub #14 (0.4 km)',
                eta: '7-9 mins'
              });
              onClose();
            }}
          >
            <Navigation size={18} />
            <span>Use Current Live GPS Location</span>
            <span style={{ marginLeft: 'auto', fontSize: '11px', background: '#0C831F', color: '#FFF', padding: '2px 8px', borderRadius: '4px' }}>
              8 MINS
            </span>
          </button>

          <div style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
            Saved Delivery Addresses
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SAVED_LOCATIONS.map((loc) => {
              const IconComp = LOCATION_ICONS[loc.tag] || Home;
              const isSelected = selectedLocation.id === loc.id;

              return (
                <div
                  key={loc.id}
                  onClick={() => {
                    onSelectLocation(loc);
                    onClose();
                  }}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: isSelected ? '2px solid #0C831F' : '1px solid #E5E7EB',
                    background: isSelected ? '#FFFFFF' : '#F9FAFB',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '8px',
                    background: isSelected ? '#DCFCE7' : '#E2E8F0',
                    color: isSelected ? '#0C831F' : '#475569',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <IconComp size={18} />
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <strong style={{ fontSize: '14px', color: '#111827' }}>{loc.tag}</strong>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#0C831F' }}>{loc.eta}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '3px', lineHeight: 1.3 }}>
                      {loc.fullAddress}
                    </p>
                    <div style={{ fontSize: '10px', color: '#9CA3AF', marginTop: '4px' }}>
                      Hub: {loc.darkStore}
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{ color: '#0C831F' }}>
                      <Check size={18} strokeWidth={3} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Dark Store Network Info */}
          <div style={{ marginTop: '20px', padding: '12px', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
              Nivvo Hyperlocal Dark Store Grid
            </div>
            <div style={{ fontSize: '11px', color: '#64748B' }}>
              Over 42 micro-fulfillment dark stores across Bengaluru stocked with over 5,000 steam-pressed garments ready for instant 10-minute dispatch.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
