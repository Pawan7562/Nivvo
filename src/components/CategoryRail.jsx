import React from 'react';
import { 
  Sparkles, 
  Zap, 
  Briefcase, 
  Shirt, 
  Layers, 
  Activity, 
  Heart, 
  Footprints, 
  Watch 
} from 'lucide-react';
import { CATEGORIES } from '../data/fashionData';

const ICON_MAP = {
  Sparkles,
  Zap,
  Briefcase,
  Shirt,
  Sparkle: Sparkles,
  Layers,
  Activity,
  Heart,
  Footprints,
  Watch
};

export default function CategoryRail({ activeCategory, onSelectCategory }) {
  return (
    <section className="categories-rail-section">
      <div className="categories-scroll">
        {CATEGORIES.map((cat) => {
          const IconComp = ICON_MAP[cat.icon] || Sparkles;
          const isActive = activeCategory === cat.id;
          const isSos = cat.id === 'sos';

          return (
            <button
              key={cat.id}
              className={`category-chip ${isActive ? (isSos ? 'sos-active' : 'active') : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <IconComp size={15} color={isActive ? '#FFFFFF' : (isSos ? '#E11D48' : '#4B5563')} />
              <span>{cat.name}</span>
              <span className="category-chip-count">({cat.count})</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
