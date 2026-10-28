import React, { useState } from 'react';
import { Layers, Bike, Clock, CheckCircle2, RotateCcw, ShieldCheck, Sparkles, HelpCircle, ChevronDown, ChevronUp, ChevronLeft } from 'lucide-react';
import { DARK_STORES } from '../data/fashionData';
import { playTrialSound, playClickSound } from '../utils/audioEffects';

export default function DoorstepTrialView({ onNavigateHome }) {
  const [testSize, setTestSize] = useState('M');
  const [openFaq, setOpenFaq] = useState(null);

  const adjacentSize = testSize === 'S' ? 'M' : (testSize === 'M' ? 'L' : (testSize === 'L' ? 'XL' : 'XXL'));

  const handleTestSizeChange = (s) => {
    playTrialSound();
    setTestSize(s);
  };

  const FAQS = [
    {
      q: 'Is there any security deposit for taking 2 sizes?',
      a: 'Zero. You pay only for 1 item during checkout. The adjacent size is brought completely free of charge as a complimentary service.'
    },
    {
      q: 'How long will the delivery rider wait outside?',
      a: 'Our riders are trained for apparel deliveries and patiently wait 3 to 4 minutes outside your apartment door or office lobby while you try both sizes.'
    },
    {
      q: 'What happens to the garment I return to the rider?',
      a: 'The rider places the returned size back into the sealed anti-dust protective sleeve. When brought back to the dark store hub, it undergoes high-temperature steam sterilization (120°C) and UV sanitization before being hung back on the rack.'
    },
    {
      q: 'What if neither of the two sizes fits me?',
      a: 'You can hand both back to the rider right then! A 100% instant full refund is processed back to your original payment method (or UPI) in under 60 seconds.'
    }
  ];

  return (
    <div className="blinkit-trial-page" style={{ paddingBottom: '90px' }}>
      {/* Native Toolbar */}
      <div className="apk-profile-toolbar">
        <button 
          className="apk-toolbar-back-btn" 
          onClick={() => { playClickSound(); if (onNavigateHome) onNavigateHome(); }}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#293142" />
        </button>
        <h1 className="apk-toolbar-title">Doorstep 2-Size Trial</h1>
      </div>

      <div style={{ padding: '14px' }}>
      {/* Hero Strip */}
      <div style={{
        background: 'linear-gradient(135deg, #0C831F 0%, #064E11 100%)',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '36px 40px',
        boxShadow: '0 8px 30px rgba(12, 131, 31, 0.25)',
        marginBottom: '28px'
      }}>
        <div style={{ maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '12px'
          }}>
            <Layers size={14} color="#F8CB46" />
            <span>INDUSTRY FIRST FASHION QUICK-COMMERCE</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.15, marginBottom: '10px' }}>
            Doorstep 2-Size Trial Studio
          </h1>

          <p style={{ fontSize: '15px', color: '#E2E8F0', lineHeight: 1.45, marginBottom: '20px' }}>
            Traditional fashion e-commerce makes you wait 5 days for returns. Nivvo brings two adjacent sizes to your door in 10 minutes. Keep the winner, hand back the other on the spot.
          </p>

          <button 
            onClick={onNavigateHome}
            style={{
              background: '#F8CB46',
              color: '#111827',
              padding: '12px 24px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Start Shopping with 2-Size Trial
          </button>
        </div>
      </div>

      {/* Interactive Sizing Simulator */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1.5px solid #E5E7EB',
        padding: '28px',
        marginBottom: '32px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Sparkles size={20} color="#0C831F" />
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>
            Interactive 2-Size Pairing Simulator
          </h2>
        </div>
        <p style={{ fontSize: '13px', color: '#6B7280', marginBottom: '20px' }}>
          Test how our dark store algorithm automatically pairs your primary choice with the optimal adjacent trial size:
        </p>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {['S', 'M', 'L', 'XL'].map(s => (
            <button
              key={s}
              onClick={() => handleTestSizeChange(s)}
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '8px',
                border: testSize === s ? '2px solid #0C831F' : '1px solid #D1D5DB',
                background: testSize === s ? '#F0FDF4' : '#F8FAFC',
                fontWeight: 800,
                fontSize: '14px',
                color: testSize === s ? '#0C831F' : '#374151',
                cursor: 'pointer'
              }}
            >
              Primary Size: {s}
            </button>
          ))}
        </div>

        {/* Dispatch Visualizer */}
        <div style={{
          background: '#F8FAFC',
          borderRadius: '12px',
          border: '1.5px dashed #0C831F',
          padding: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#0C831F', textTransform: 'uppercase' }}>
              Dark Store Dispatch Bundle:
            </div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#111827', marginTop: '4px' }}>
              Garment Sleeve #1: <strong>Size {testSize}</strong> + Sleeve #2: <strong>Size {adjacentSize}</strong>
            </div>
            <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
              Both items pre-steamed at 120°C and secured with tamper-proof seal.
            </div>
          </div>

          <div style={{
            background: '#DCFCE7',
            color: '#15803D',
            padding: '8px 16px',
            borderRadius: '8px',
            fontWeight: 800,
            fontSize: '13px'
          }}>
            ✓ Extra Size Cost: ₹0 FREE
          </div>
        </div>
      </div>

      {/* Dark Stores Readiness */}
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
          Hyperlocal Dark Store Hubs with 2-Size Stock
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
          {DARK_STORES.map(hub => (
            <div 
              key={hub.id}
              style={{
                background: '#FFFFFF',
                borderRadius: '12px',
                border: '1px solid #E5E7EB',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong style={{ fontSize: '14px', color: '#111827' }}>{hub.name}</strong>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0C831F' }}>⚡ {hub.eta}</span>
              </div>
              <div style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
                {hub.address} ({hub.distance})
              </div>
              <div style={{ fontSize: '11px', color: '#059669', fontWeight: 700, marginTop: '8px' }}>
                ✓ {hub.stock} Size Inventory Ready
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div style={{
        background: '#FFFFFF',
        borderRadius: '16px',
        border: '1px solid #E5E7EB',
        padding: '24px',
        marginBottom: '40px'
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginBottom: '16px' }}>
          Frequently Asked Questions
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {FAQS.map((faq, i) => {
            const isOpen = openFaq === i;
            return (
              <div 
                key={i}
                style={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '10px',
                  overflow: 'hidden'
                }}
              >
                <div 
                  onClick={() => setOpenFaq(isOpen ? null : i)}
                  style={{
                    padding: '14px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    background: isOpen ? '#F9FAFB' : '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '14px',
                    color: '#111827'
                  }}
                >
                  <span>{faq.q}</span>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
                {isOpen && (
                  <div style={{ padding: '14px 18px', fontSize: '13px', color: '#4B5563', lineHeight: 1.45, background: '#F8FAFC' }}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      </div>
    </div>
  );
}
