import React from 'react';
import { Clock, ArrowUpRight } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function NivvoHeroBanner({ onSelectCategory, onExploreFootwear }) {
  return (
    <div className="nivvo-hero-container">
      {/* Figma Screen 1 Master Hero Card */}
      <div className="nivvo-figma-hero-card">
        <div className="nivvo-hero-left">
          <span className="nivvo-hero-tag">GOOD FINDS. CLOSE BY.</span>
          <h1 className="nivvo-hero-headline">
            A fresh pair.<br />
            A local affair.
          </h1>
          <p className="nivvo-hero-desc">
            Discover everyday favourites from shops around you.
          </p>
          <button 
            className="nivvo-hero-explore-link"
            onClick={() => {
              playClickSound();
              if (onExploreFootwear) onExploreFootwear();
              else if (onSelectCategory) onSelectCategory('footwear');
            }}
          >
            <span>Explore footwear</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="nivvo-hero-right">
          <div className="nivvo-hero-image-wrap">
            <img 
              src="/assets/figma/hero_sneaker.png" 
              alt="Everyday court sneaker" 
              className="nivvo-hero-img"
              loading="eager"
            />
          </div>
        </div>
      </div>

      {/* Honest Delivery Reassurance Line from Figma */}
      <div className="nivvo-honest-delivery-line">
        <Clock size={15} className="nivvo-clock-icon" />
        <span>From ~10 min on eligible nearby finds. Most orders here arrive in 12–30 min.</span>
      </div>
    </div>
  );
}
