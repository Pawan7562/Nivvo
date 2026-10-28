import React from 'react';
import { NIVVO_CATEGORIES } from '../data/nivvoData';
import { playClickSound } from '../utils/audioEffects';
import { ArrowUpRight } from 'lucide-react';

export default function VisualCategoryGrid({ activeCategory, onSelectCategory }) {
  return (
    <section className="nivvo-figma-category-section">
      <div className="nivvo-section-header">
        <h2 className="nivvo-section-title">Find your everyday</h2>
        <button 
          className="nivvo-section-link"
          onClick={() => { playClickSound(); onSelectCategory('all'); }}
        >
          <span>All categories</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="nivvo-figma-category-grid">
        {NIVVO_CATEGORIES.map((item) => {
          const isSelected = activeCategory === item.id;

          return (
            <div 
              key={item.id}
              className={`nivvo-category-item ${isSelected ? 'active' : ''}`}
              onClick={() => {
                playClickSound();
                onSelectCategory(item.id);
              }}
            >
              <div className="nivvo-category-photo-box">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="nivvo-category-img"
                  loading="lazy"
                />
              </div>
              <span className="nivvo-category-label">{item.name}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
