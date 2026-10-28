import React from 'react';
import { Layers, Zap, Shirt, RotateCcw, ArrowRight } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function TrialBanner({ onOpenTrialModal }) {
  return (
    <div className="trust-features-strip">
      <div className="trust-item">
        <div className="trust-icon-box yellow">
          <Zap size={18} />
        </div>
        <div className="trust-text">
          <span className="trust-title">10-Min Fast Dispatch</span>
          <span className="trust-desc">From your local dark store hub</span>
        </div>
      </div>

      <div className="trust-item clickable" onClick={() => { playClickSound(); onOpenTrialModal(); }}>
        <div className="trust-icon-box green">
          <Layers size={18} />
        </div>
        <div className="trust-text">
          <div className="trust-title-row">
            <span className="trust-title">Doorstep 2-Size Trial</span>
            <span className="trust-tag">FREE</span>
          </div>
          <span className="trust-desc">Try 2 sizes at door, pay for 1</span>
        </div>
      </div>

      <div className="trust-item">
        <div className="trust-icon-box slate">
          <Shirt size={18} />
        </div>
        <div className="trust-text">
          <span className="trust-title">Fresh & Steam-Pressed</span>
          <span className="trust-desc">Delivered on hanger, ready to wear</span>
        </div>
      </div>

      <div className="trust-item">
        <div className="trust-icon-box blue">
          <RotateCcw size={18} />
        </div>
        <div className="trust-text">
          <span className="trust-title">Instant 1-Min Return</span>
          <span className="trust-desc">Hand back to rider without repackaging</span>
        </div>
      </div>
    </div>
  );
}
