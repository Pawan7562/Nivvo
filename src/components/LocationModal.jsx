import React, { useState } from 'react';
import { X, MapPin, Navigation, Home, Briefcase, Check, Loader2, AlertCircle } from 'lucide-react';
import { SAVED_LOCATIONS } from '../data/fashionData';
import { detectDeviceCoordinates, reverseGeocodeCoords, METRO_DELIVERY_HUBS } from '../services/locationService';

const LOCATION_ICONS = {
  Home,
  Office: Briefcase,
  'Hotel / Club': MapPin
};

export default function LocationModal({ isOpen, onClose, selectedLocation, onSelectLocation }) {
  const [isDetecting, setIsDetecting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleUseGps = async () => {
    setIsDetecting(true);
    setErrorMsg('');
    try {
      const coords = await detectDeviceCoordinates({ timeout: 10000, enableHighAccuracy: true });
      const address = await reverseGeocodeCoords(coords.latitude, coords.longitude, '/api');
      onSelectLocation({
        id: address.id || 'gps-current',
        tag: 'Live GPS Pin',
        shortAddress: `${address.area}, ${address.city}`,
        fullAddress: address.fullAddress,
        darkStore: address.darkStore,
        eta: address.eta,
        latitude: coords.latitude,
        longitude: coords.longitude
      });
      onClose();
    } catch (err) {
      console.warn('GPS location detection failed:', err);
      setErrorMsg(err.message || 'Unable to detect location. Please select an area manually.');
    } finally {
      setIsDetecting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '440px' }}>
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
              padding: '13px 15px',
              borderRadius: '12px',
              border: '1.5px solid #0C831F',
              background: '#F0FDF4',
              color: '#0C831F',
              fontWeight: 800,
              fontSize: '13.5px',
              marginBottom: '12px',
              cursor: isDetecting ? 'wait' : 'pointer'
            }}
            onClick={handleUseGps}
            disabled={isDetecting}
          >
            {isDetecting ? (
              <Loader2 size={18} className="nivvo-spin" />
            ) : (
              <Navigation size={18} />
            )}
            <span>{isDetecting ? 'Detecting Precise GPS Location...' : 'Use Current Live GPS Location'}</span>
            <span style={{ marginLeft: 'auto', fontSize: '11px', background: '#0C831F', color: '#FFF', padding: '3px 8px', borderRadius: '5px' }}>
              8–10 MINS
            </span>
          </button>

          {errorMsg && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '8px',
              color: '#B91C1C',
              fontSize: '12px',
              marginBottom: '12px'
            }}>
              <AlertCircle size={15} />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Popular Neighbourhood Hubs */}
          <div style={{ marginBottom: '14px' }}>
            <div style={{ fontSize: '11.5px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
              Fastest Verified Hubs (10 Mins)
            </div>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {METRO_DELIVERY_HUBS.map(hub => (
                <button
                  key={hub.id}
                  onClick={() => {
                    onSelectLocation({
                      id: hub.id,
                      tag: hub.area,
                      shortAddress: `${hub.area}, Bengaluru`,
                      fullAddress: hub.fullAddress,
                      darkStore: hub.darkStore,
                      eta: hub.eta,
                      latitude: hub.latitude,
                      longitude: hub.longitude
                    });
                    onClose();
                  }}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '999px',
                    border: '1px solid #E2E8F0',
                    background: '#F8FAFC',
                    color: '#334155',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  📍 {hub.area}
                </button>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase', marginBottom: '8px' }}>
            Saved Delivery Addresses
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {SAVED_LOCATIONS.map((loc) => {
              const IconComp = LOCATION_ICONS[loc.tag] || Home;
              const isSelected = selectedLocation?.id === loc.id || selectedLocation?.tag === loc.tag;

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
