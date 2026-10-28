import React from 'react';
import { Zap, ShieldCheck, RefreshCw, Sparkles, Clock, Heart } from 'lucide-react';

export default function Footer({ onOpenTrialModal, onOpenSizeAdvisor }) {
  return (
    <footer className="blink-footer">
      <div className="footer-inner">
        {/* 4 Pillars Grid */}
        <div className="footer-features-grid">
          <div className="footer-feature-box">
            <div className="footer-feature-icon">
              <Zap size={22} color="#0C831F" />
            </div>
            <div className="footer-feature-text">
              <h5>10-Minute Wardrobe Dispatch</h5>
              <p>Over 40 dark stores stocked with 5,000+ steam-pressed shirts, tees, and bottoms ready to ride.</p>
            </div>
          </div>

          <div className="footer-feature-box" onClick={onOpenTrialModal} style={{ cursor: 'pointer' }}>
            <div className="footer-feature-icon" style={{ backgroundColor: '#DCFCE7' }}>
              <RefreshCw size={22} color="#0C831F" />
            </div>
            <div className="footer-feature-text">
              <h5>Doorstep 2-Size Trial (Free)</h5>
              <p>Rider carries both M & L sizes. Try on for 2 mins, keep the one that fits, hand back the other!</p>
            </div>
          </div>

          <div className="footer-feature-box">
            <div className="footer-feature-icon">
              <Sparkles size={22} color="#0C831F" />
            </div>
            <div className="footer-feature-text">
              <h5>Pre-Steamed & Ready to Wear</h5>
              <p>Every single garment is steam-ironed at 120°C and hung inside an anti-crease garment sleeve.</p>
            </div>
          </div>

          <div className="footer-feature-box" onClick={onOpenSizeAdvisor} style={{ cursor: 'pointer' }}>
            <div className="footer-feature-icon" style={{ backgroundColor: '#FEF3C7' }}>
              <ShieldCheck size={22} color="#92400E" />
            </div>
            <div className="footer-feature-text">
              <h5>AI Size Engine (99.2% Fit)</h5>
              <p>Input height and weight to auto-calibrate your perfect silhouette across every single brand.</p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <img 
                src="/assets/nivvo_header_logo.svg" 
                alt="Nivvo" 
                width="22" 
                height="22" 
                style={{ borderRadius: '6px' }} 
              />
              <span style={{ fontSize: '18px', fontWeight: 900, color: '#20251F', fontFamily: 'Inter, sans-serif' }}>nivvo</span>
            </div>
            <span style={{ color: '#9CA3AF' }}>• India's Instant 10-Minute Fashion Commerce</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#15803D', background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '3px 8px', borderRadius: '99px', fontWeight: 700 }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
              <span>Neon Cloud PostgreSQL Active</span>
            </div>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>© 2026 Nivvo Technologies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
