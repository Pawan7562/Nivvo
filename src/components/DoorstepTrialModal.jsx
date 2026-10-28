import React from 'react';
import { X, Layers, Bike, Clock, CheckCircle2, RotateCcw, ShieldCheck } from 'lucide-react';

export default function DoorstepTrialModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>
            <Layers size={20} color="#0C831F" />
            <span>How Doorstep 2-Size Trial Works</span>
          </h3>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{ 
              background: '#DCFCE7', 
              color: '#15803D', 
              padding: '4px 12px', 
              borderRadius: '99px', 
              fontSize: '11px', 
              fontWeight: 800,
              textTransform: 'uppercase'
            }}>
              Zero Return Friction • 100% Free
            </span>
            <h4 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', marginTop: '8px' }}>
              Never worry about ordering the wrong fit again
            </h4>
            <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '4px' }}>
              Unlike traditional fashion apps where returning takes 4-7 days, Nivvo solves fit right at your doorstep in under 10 minutes.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Step 1 */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#0C831F', 
                color: '#FFFFFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800, 
                fontSize: '13px',
                flexShrink: 0 
              }}>
                1
              </div>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Select "Bring 2 Adjacent Sizes"</h5>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  If you choose Size M, our dark store automatically packs both Size M and Size L in pristine protective sleeves at no extra deposit.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#0C831F', 
                color: '#FFFFFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800, 
                fontSize: '13px',
                flexShrink: 0 
              }}>
                2
              </div>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Rider Arrives in 10 Minutes</h5>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  Your delivery partner arrives on an EV with your garments pre-steamed and clean.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#0C831F', 
                color: '#FFFFFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800, 
                fontSize: '13px',
                flexShrink: 0 
              }}>
                3
              </div>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Try On in 2 Minutes</h5>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  Slip into both sizes in your home/office washroom. The rider patiently waits outside your lobby or apartment gate.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: '#0C831F', 
                color: '#FFFFFF', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                fontWeight: 800, 
                fontSize: '13px',
                flexShrink: 0 
              }}>
                4
              </div>
              <div>
                <h5 style={{ fontSize: '14px', fontWeight: 800, color: '#111827' }}>Keep the Winner, Hand Back the Rest</h5>
                <p style={{ fontSize: '12px', color: '#6B7280', marginTop: '2px' }}>
                  Hand the extra garment back to the rider. Zero courier returns, zero refund wait times, zero stress!
                </p>
              </div>
            </div>
          </div>

          <div style={{ 
            marginTop: '20px', 
            padding: '12px', 
            background: '#F8FAFC', 
            borderRadius: '10px', 
            border: '1px solid #E2E8F0', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '10px' 
          }}>
            <ShieldCheck size={20} color="#0C831F" />
            <span style={{ fontSize: '11px', color: '#475569' }}>
              Garments returned on spot undergo UV sanitization and re-steaming before restocking.
            </span>
          </div>

          <button 
            onClick={onClose}
            style={{
              width: '100%',
              backgroundColor: '#0C831F',
              color: '#FFFFFF',
              padding: '12px',
              borderRadius: '10px',
              fontWeight: 800,
              fontSize: '14px',
              marginTop: '16px',
              cursor: 'pointer'
            }}
          >
            Got It, Let's Shop!
          </button>
        </div>
      </div>
    </div>
  );
}
