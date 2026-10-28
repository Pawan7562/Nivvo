import React from 'react';
import { playClickSound } from '../utils/audioEffects';

export default function BrandSpotlight({ onSelectBrand }) {
  const BRANDS = [
    { name: 'Manyavar', tag: 'Royal Ethnic', logoText: 'MANYAVAR', color: '#881337', bg: '#FFF1F2' },
    { name: 'Biba', tag: 'Festive Suits', logoText: 'BIBA', color: '#9D174D', bg: '#FDF2F8' },
    { name: 'FabIndia', tag: 'Handcrafted', logoText: 'fabindia', color: '#B45309', bg: '#FEF3C7' },
    { name: 'Levi\'s', tag: 'Original Denim', logoText: 'Levi\'s', color: '#B91C1C', bg: '#FEF2F2' },
    { name: 'Zara', tag: 'Euro High-Street', logoText: 'ZARA', color: '#0F172A', bg: '#F1F5F9' },
    { name: 'Snitch', tag: 'Men\'s Fast Trend', logoText: 'SNITCH', color: '#047857', bg: '#ECFDF5' },
    { name: 'Nike', tag: 'Sport & Slides', logoText: 'NIKE', color: '#1E293B', bg: '#F8FAFC' },
    { name: 'Puma', tag: 'Athleisure', logoText: 'PUMA', color: '#C2410C', bg: '#FFF7ED' },
    { name: 'Bewakoof', tag: 'Graphic Tees', logoText: 'BEWAKOOF', color: '#EAB308', bg: '#FEFCE8' }
  ];

  return (
    <div className="brand-spotlight-section">
      <div className="section-header-compact">
        <h3 className="section-title-compact">Top Brand Stores in 10 Mins</h3>
        <span className="section-sub-compact">100% Genuine Certified</span>
      </div>

      <div className="brand-logos-scroll">
        {BRANDS.map((brand) => (
          <div 
            key={brand.name} 
            className="brand-store-card"
            style={{ backgroundColor: brand.bg }}
            onClick={() => {
              playClickSound();
              if (onSelectBrand) onSelectBrand(brand.name);
            }}
          >
            <div className="brand-logo-badge" style={{ color: brand.color }}>
              {brand.logoText}
            </div>
            <span className="brand-tag-name">{brand.tag}</span>
            <span className="brand-speed-badge">⚡ 8-10 Mins</span>
          </div>
        ))}
      </div>
    </div>
  );
}
