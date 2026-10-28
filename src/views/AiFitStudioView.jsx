import React, { useState } from 'react';
import { Sparkles, Check, ArrowRight, ShieldCheck, User, RefreshCw, ChevronLeft } from 'lucide-react';
import { playTrialSound, playClickSound } from '../utils/audioEffects';

export default function AiFitStudioView({ globalPreferredSize, onApplyGlobalSize, onNavigateHome }) {
  const [gender, setGender] = useState('men');
  const [heightCm, setHeightCm] = useState(176);
  const [weightKg, setWeightKg] = useState(72);
  const [chestInches, setChestInches] = useState(40);
  const [waistInches, setWaistInches] = useState(32);
  const [build, setBuild] = useState('athletic');
  const [fitPreference, setFitPreference] = useState('regular');

  // Compute recommendation
  let size = 'M';
  let fitDetails = 'Ideal tailored silhouette with 1.5 inches of ease around the torso.';

  if (weightKg < 62 || chestInches < 38) {
    size = 'S';
    fitDetails = 'Slim contour silhouette. Comfortable shoulder seam placement.';
  } else if (weightKg <= 76 && chestInches <= 41) {
    if (fitPreference === 'oversized') {
      size = 'L';
      fitDetails = 'Drop-shoulder drape with 3 inches of extra chest ease for a relaxed look.';
    } else {
      size = 'M';
      fitDetails = 'Balanced classic fit. Clean chest line with zero pulling across buttons.';
    }
  } else if (weightKg <= 88 || chestInches <= 44) {
    if (fitPreference === 'oversized') {
      size = 'XL';
      fitDetails = 'Boxy streetwear cut with wide sleeve openings.';
    } else {
      size = 'L';
      fitDetails = 'Standard athletic broad chest fit with relaxed armhole.';
    }
  } else {
    size = 'XL';
    fitDetails = 'Generous chest (44-46") and relaxed waist contour.';
  }

  const handleApply = () => {
    playTrialSound();
    onApplyGlobalSize(size);
    alert(`Size "${size}" successfully locked as your default fit across Nivvo!`);
  };

  return (
    <div className="blinkit-ai-fit-page" style={{ paddingBottom: '90px' }}>
      {/* Native Toolbar */}
      <div className="apk-profile-toolbar">
        <button 
          className="apk-toolbar-back-btn" 
          onClick={() => { playClickSound(); if (onNavigateHome) onNavigateHome(); }}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#293142" />
        </button>
        <h1 className="apk-toolbar-title">AI Fit Studio</h1>
      </div>

      <div style={{ padding: '14px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '36px 40px',
        marginBottom: '28px',
        boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.15)',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 800,
            color: '#FDE68A',
            letterSpacing: '0.8px',
            marginBottom: '12px'
          }}>
            <Sparkles size={14} color="#FDE68A" />
            <span>AI BIOMETRIC SIZING ENGINE</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.15, marginBottom: '10px' }}>
            Virtual AI Fit & Silhouette Studio
          </h1>

          <p style={{ fontSize: '15px', color: '#CBD5E1', lineHeight: 1.45 }}>
            Calibrate your dimensions once. Our machine-learning sizing model auto-configures the exact garment sizes across shirts, trousers, oversized tees, and shoes for every 10-minute order.
          </p>
        </div>
      </div>

      {/* Main Studio Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Controls Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E5E7EB',
          padding: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
            Your Biometric Profile
          </h3>

          {/* Gender */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Gender Baseline
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {['men', 'women'].map(g => (
                <button
                  key={g}
                  onClick={() => setGender(g)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: gender === g ? '2px solid #0C831F' : '1px solid #D1D5DB',
                    background: gender === g ? '#F0FDF4' : '#F8FAFC',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: gender === g ? '#0C831F' : '#374151',
                    cursor: 'pointer',
                    textTransform: 'capitalize'
                  }}
                >
                  {g === 'men' ? "Men's Fit Model" : "Women's Fit Model"}
                </button>
              ))}
            </div>
          </div>

          {/* Height */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              <span>Height</span>
              <span style={{ color: '#0C831F' }}>{heightCm} cm ({Math.floor(heightCm / 30.48)}'{Math.round((heightCm % 30.48) / 2.54)}")</span>
            </div>
            <input 
              type="range" 
              min="150" 
              max="200" 
              value={heightCm}
              onChange={(e) => setHeightCm(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0C831F' }}
            />
          </div>

          {/* Weight */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              <span>Weight</span>
              <span style={{ color: '#0C831F' }}>{weightKg} kg</span>
            </div>
            <input 
              type="range" 
              min="45" 
              max="115" 
              value={weightKg}
              onChange={(e) => setWeightKg(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0C831F' }}
            />
          </div>

          {/* Chest */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              <span>Chest / Bust Circumference</span>
              <span style={{ color: '#0C831F' }}>{chestInches} inches</span>
            </div>
            <input 
              type="range" 
              min="32" 
              max="48" 
              value={chestInches}
              onChange={(e) => setChestInches(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0C831F' }}
            />
          </div>

          {/* Waist */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, color: '#374151', marginBottom: '6px' }}>
              <span>Waist Circumference</span>
              <span style={{ color: '#0C831F' }}>{waistInches} inches</span>
            </div>
            <input 
              type="range" 
              min="26" 
              max="44" 
              value={waistInches}
              onChange={(e) => setWaistInches(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#0C831F' }}
            />
          </div>

          {/* Fit Preference */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
              Drape & Fit Styling
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[
                { id: 'slim', label: 'Fitted' },
                { id: 'regular', label: 'Classic Regular' },
                { id: 'oversized', label: 'Baggy / Oversized' }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setFitPreference(f.id)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: fitPreference === f.id ? '2px solid #111827' : '1px solid #D1D5DB',
                    background: fitPreference === f.id ? '#111827' : '#F8FAFC',
                    color: fitPreference === f.id ? '#FFFFFF' : '#374151',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Silhouette & Output Card */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E5E7EB',
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
        }}>
          {/* Animated 2D Silhouette graphic */}
          <div style={{
            width: '160px',
            height: '200px',
            background: 'linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%)',
            borderRadius: '24px',
            border: '2px solid #86EFAC',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '20px',
            position: 'relative'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#0C831F',
              marginBottom: '8px'
            }} />
            <div style={{
              width: `${Math.min(95, Math.max(50, (chestInches / 44) * 80))}px`,
              height: '60px',
              borderRadius: '12px',
              background: '#0C831F',
              marginBottom: '6px',
              transition: 'width 0.3s ease'
            }} />
            <div style={{
              width: `${Math.min(85, Math.max(45, (waistInches / 40) * 70))}px`,
              height: '50px',
              borderRadius: '10px',
              background: '#065F46',
              transition: 'width 0.3s ease'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '8px',
              fontSize: '10px',
              fontWeight: 800,
              color: '#065F46'
            }}>
              SILHOUETTE SIMULATED
            </div>
          </div>

          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0C831F', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
            Recommended Size Across Brands
          </span>
          <div style={{ fontSize: '48px', fontWeight: 900, color: '#0C831F', lineHeight: 1, margin: '8px 0' }}>
            {size}
          </div>
          <p style={{ fontSize: '13px', color: '#4B5563', maxWidth: '300px', lineHeight: 1.4, marginBottom: '20px' }}>
            {fitDetails}
          </p>

          <button 
            onClick={handleApply}
            style={{
              width: '100%',
              backgroundColor: '#0C831F',
              color: '#FFFFFF',
              padding: '12px 20px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(12,131,31,0.25)',
              marginBottom: '10px'
            }}
          >
            <span>Lock Size "{size}" Across Store</span>
            <Check size={16} />
          </button>

          <button 
            onClick={onNavigateHome}
            style={{
              background: 'transparent',
              color: '#6B7280',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Return to Store
          </button>
        </div>
      </div>
      </div>
    </div>
  );
}
