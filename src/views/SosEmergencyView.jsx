import React from 'react';
import { SOS_KITS } from '../data/fashionData';
import { Zap, AlertTriangle, Clock, ShieldCheck, CheckCircle2, ShoppingBag, ChevronLeft } from 'lucide-react';
import { playAddSound, playClickSound } from '../utils/audioEffects';

export default function SosEmergencyView({ onAddToCart, onOpenCart, onQuickView, onNavigateHome }) {
  const handleQuickBuy = (kit) => {
    playAddSound();
    onAddToCart(kit, kit.sizes[0], true);
    onOpenCart();
  };

  return (
    <div className="blinkit-sos-page" style={{ paddingBottom: '90px' }}>
      {/* Native Toolbar */}
      <div className="apk-profile-toolbar">
        <button 
          className="apk-toolbar-back-btn" 
          onClick={() => { playClickSound(); if (onNavigateHome) onNavigateHome(); }}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#293142" />
        </button>
        <h1 className="apk-toolbar-title">⚡ Fashion SOS Emergency</h1>
      </div>

      <div style={{ padding: '14px' }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #E11D48 0%, #881337 100%)',
        color: '#FFFFFF',
        borderRadius: '20px',
        padding: '36px 40px',
        boxShadow: '0 8px 30px rgba(225, 29, 72, 0.25)',
        marginBottom: '28px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '640px', position: 'relative', zIndex: 2 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.2)',
            padding: '4px 12px',
            borderRadius: '99px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.8px',
            marginBottom: '12px'
          }}>
            <Zap size={14} fill="#FEF08A" color="#FEF08A" />
            <span>DISPATCHED IN 7 TO 9 MINUTES FLAT</span>
          </div>

          <h1 style={{ fontSize: '32px', fontWeight: 900, lineHeight: 1.15, marginBottom: '10px' }}>
            Fashion Emergency? <br />
            <span style={{ color: '#FEF08A' }}>Wardrobe SOS at Your Doorstep</span>
          </h1>

          <p style={{ fontSize: '15px', color: '#FFE4E6', lineHeight: 1.45, marginBottom: '20px' }}>
            Spilled coffee right before a client presentation? Caught in sudden monsoon rain? Date night change in 15 minutes? We keep steam-ironed outfits on hangers in local dark stores ready to ride.
          </p>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', fontWeight: 700 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Clock size={16} color="#FEF08A" />
              <span>Under 8 Min Delivery</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#FEF08A" />
              <span>Pre-Steamed & Hung</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#FEF08A" />
              <span>Doorstep 2-Size Trial Free</span>
            </div>
          </div>
        </div>
      </div>

      {/* SOS Bundles Grid */}
      <div style={{ marginBottom: '16px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 900, color: '#111827' }}>
          Select Your Wardrobe Emergency
        </h2>
        <p style={{ fontSize: '13px', color: '#6B7280' }}>
          Every kit comes packaged in a dustproof garment sleeve with emergency care accessories.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '40px' }}>
        {SOS_KITS.map(kit => (
          <div 
            key={kit.id}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              border: '1.5px solid #E5E7EB',
              overflow: 'hidden',
              boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
              <img 
                src={kit.image} 
                alt={kit.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                left: '12px',
                background: '#E11D48',
                color: '#FFFFFF',
                fontSize: '11px',
                fontWeight: 800,
                padding: '4px 8px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Zap size={12} fill="#FFF" />
                <span>{kit.deliveryTime} EXPRESS</span>
              </div>
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(0,0,0,0.7)',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '4px'
              }}>
                📍 {kit.darkStore}
              </div>
            </div>

            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#E11D48', textTransform: 'uppercase' }}>
                {kit.tag}
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', margin: '4px 0 6px 0' }}>
                {kit.name}
              </h3>
              <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: 1.4, marginBottom: '12px' }}>
                {kit.subtitle}
              </p>

              <div style={{
                background: '#FFF1F2',
                borderRadius: '8px',
                padding: '10px',
                fontSize: '11px',
                color: '#9F1239',
                marginBottom: '16px',
                lineHeight: 1.35
              }}>
                <strong>Included in Kit:</strong> {kit.description}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '12px', borderTop: '1px solid #F3F4F6' }}>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 900, color: '#111827' }}>₹{kit.price}</div>
                  <div style={{ fontSize: '11px', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{kit.originalPrice}</div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => onQuickView(kit)}
                    style={{
                      border: '1px solid #D1D5DB',
                      background: '#FFFFFF',
                      color: '#374151',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Inspect
                  </button>
                  <button 
                    onClick={() => handleQuickBuy(kit)}
                    style={{
                      background: '#E11D48',
                      color: '#FFFFFF',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: 800,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      boxShadow: '0 2px 8px rgba(225, 29, 72, 0.3)'
                    }}
                  >
                    <Zap size={14} fill="#FFF" />
                    <span>Get in 7 Mins</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
}
