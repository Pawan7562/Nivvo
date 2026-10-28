import React from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { ArrowLeft, ArrowUpRight, Check, AlertCircle, Copy, Sparkles } from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';

export default function NivvoBrandSystemView({ onBack }) {
  const { showToast } = useNivvo();

  const colors = [
    { name: 'Lime / Action', hex: '#B7F34A', role: 'Primary CTA, active states' },
    { name: 'Forest / Identity', hex: '#24452D', role: 'Brand canvas, header lockup' },
    { name: 'White / Canvas', hex: '#FFFFFF', role: 'Clean cards & page backgrounds' },
    { name: 'Mist / Surface', hex: '#F7F8F5', role: 'Input & neutral boxes' },
    { name: 'Text Primary', hex: '#20251F', role: 'High-contrast typography' },
    { name: 'Secondary', hex: '#73796F', role: 'Subtitles & metadata' },
    { name: 'Border', hex: '#E7EAE3', role: 'Crisp structural dividers' },
    { name: 'Success', hex: '#238636', role: 'Stock confirmed, verified status' },
    { name: 'Warning', hex: '#E6A23C', role: 'Low stock notification' },
    { name: 'Error', hex: '#BD3838', role: 'Unavailable item' }
  ];

  const handleCopyHex = (color) => {
    playTrialSound();
    navigator.clipboard?.writeText(color.hex);
    showToast(`Copied ${color.hex} (${color.name}) to clipboard! 🎨`);
  };

  return (
    <div style={{ padding: '24px 20px', minHeight: '100%', backgroundColor: '#FFFFFF', paddingBottom: '60px' }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button 
          onClick={onBack}
          style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#20251F', cursor: 'pointer' }}
        >
          <ArrowLeft size={18} />
          <span>Back to App</span>
        </button>
        <span style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', letterSpacing: '0.06em' }}>
          IDENTITY & INTERFACE / 01
        </span>
      </div>

      {/* Brand Hero Card */}
      <div style={{
        backgroundColor: '#24452D',
        borderRadius: '24px',
        padding: '28px 24px',
        color: '#FFFFFF',
        marginBottom: '28px'
      }}>
        <div style={{ color: '#B7F34A', fontSize: '11px', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '10px' }}>
          NEARBY FINDS. LOCAL POSSIBILITIES.
        </div>
        <h1 style={{ fontSize: '32px', fontWeight: 700, lineHeight: 1.15, margin: '0 0 14px 0', letterSpacing: '-0.02em' }}>
          Your neighbourhood.<br />
          A little closer.
        </h1>
        <p style={{ fontSize: '14px', lineHeight: 1.5, color: '#C5D7C0', margin: 0 }}>
          Nivvo connects the shops you pass every day with the things you need right now. Local choice, considered design, honest arrival times.
        </p>
      </div>

      {/* Principles Card */}
      <div style={{
        backgroundColor: '#F7F8F5',
        borderRadius: '20px',
        padding: '20px',
        border: '1px solid #E7EAE3',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <div style={{ width: '28px', height: '28px', backgroundColor: '#B7F34A', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#24452D' }}>
            ↗
          </div>
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#24452D' }}>nivvo</span>
        </div>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#20251F', marginBottom: '6px' }}>
          A new kind of local.
        </div>
        <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#73796F', margin: '0 0 14px 0' }}>
          A compact, friendly wordmark. An upward neighbourhood arrow signals movement and possibility.
        </p>
        <div style={{ borderTop: '1px solid #E7EAE3', paddingTop: '12px', fontSize: '12px', lineHeight: 1.6, color: '#20251F' }}>
          Considered, not cluttered.<br />
          Helpful, never hurried.<br />
          Fast when it's possible. Honest, always.
        </div>
      </div>

      {/* 01 / Colour with purpose (Interactive copy) */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#20251F', margin: 0 }}>
            01 / Colour with purpose
          </h2>
          <span style={{ fontSize: '11px', color: '#73796F' }}>Tap swatch to copy hex</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
          {colors.map(c => (
            <div 
              key={c.name} 
              onClick={() => handleCopyHex(c)}
              style={{
                border: '1px solid #E7EAE3',
                borderRadius: '14px',
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                backgroundColor: '#FFFFFF'
              }}
              title="Click to copy hex"
            >
              <div style={{ height: '48px', backgroundColor: c.hex, borderBottom: '1px solid rgba(0,0,0,0.06)' }} />
              <div style={{ padding: '10px 12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>{c.name}</span>
                  <Copy size={12} color="#73796F" />
                </div>
                <div style={{ fontSize: '11px', color: '#73796F', fontFamily: 'monospace', marginTop: '2px' }}>{c.hex}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 02 / Typography scale */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#20251F', margin: '0 0 8px 0' }}>
          02 / Inter. Clear at every scale.
        </h2>
        <div style={{ fontSize: '36px', fontWeight: 700, color: '#24452D', letterSpacing: '-0.02em', margin: '12px 0' }}>
          Aa ₹ 0123
        </div>
        <div style={{ fontSize: '12px', color: '#73796F', lineHeight: 1.6 }}>
          Display 32–42 / 600 · Heading 20–28 / 650<br />
          Body 13–15 / 400 · Metadata 10–12 / 500<br />
          A disciplined 4 px spacing rhythm. 10–16 px corners. Soft daylight product photography with natural shadows.
        </div>
      </div>

      {/* 03 / UI Badges & Action Rule */}
      <div>
        <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#20251F', margin: '0 0 14px 0' }}>
          03 / Familiar. Reassuring.
        </h2>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <span style={{ backgroundColor: '#E8F5E9', color: '#238636', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
            Stock confirmed
          </span>
          <span style={{ backgroundColor: '#FFF3E0', color: '#E6A23C', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
            Low stock
          </span>
          <span style={{ backgroundColor: '#FFEBEE', color: '#BD3838', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700 }}>
            Unavailable
          </span>
        </div>

        <div style={{
          backgroundColor: '#F7F8F5',
          borderRadius: '14px',
          padding: '14px 16px',
          border: '1px solid #E7EAE3',
          fontSize: '12px',
          lineHeight: 1.5,
          color: '#20251F'
        }}>
          <strong>Primary Action Rule:</strong> Always use dark green text on lime actions (<code>#B7F34A</code> background with <code>#20251F</code> text). Never place white small text on lime or yellow.
        </div>
      </div>
    </div>
  );
}
