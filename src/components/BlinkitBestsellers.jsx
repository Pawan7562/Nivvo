import React from 'react';
import { playClickSound } from '../utils/audioEffects';

const BESTSELLER_GROUPS = [
  {
    id: 'bestseller-tshirts-polos',
    category: 'casual',
    title: 'T-Shirts & Polos',
    moreCount: '+120 more',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'bestseller-formal-shirts-chinos',
    category: 'formal',
    title: 'Formal Shirts & Chinos',
    moreCount: '+95 more',
    images: [
      'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'bestseller-shoes-sneakers',
    category: 'footwear',
    title: 'Shoes & Sneakers',
    moreCount: '+140 more',
    images: [
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'bestseller-cloud-slides-slippers',
    category: 'footwear',
    title: 'Cloud Slides & Slippers',
    moreCount: '+110 more',
    images: [
      'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'bestseller-electronics-audio',
    category: 'electronics',
    title: 'Electronics & Audio',
    moreCount: '+85 more',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'
    ]
  },
  {
    id: 'bestseller-watches-accessories',
    category: 'accessories',
    title: 'Watches & Accessories',
    moreCount: '+95 more',
    images: [
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&auto=format&fit=crop&q=80'
    ]
  }
];

export default function BlinkitBestsellers({ onSelectCategory }) {
  return (
    <section className="blinkit-bestsellers-section">
      <div className="bestsellers-header">
        <h2 className="bestsellers-title">Bestsellers</h2>
      </div>

      <div className="bestsellers-grid">
        {BESTSELLER_GROUPS.map((group) => (
          <div 
            key={group.id} 
            className="bestseller-card"
            onClick={() => {
              playClickSound();
              onSelectCategory(group.category);
            }}
          >
            <div className="bestseller-thumb-box">
              <div className="bestseller-quad-grid">
                {group.images.map((img, idx) => (
                  <div key={idx} className="quad-img-wrapper">
                    <img 
                      src={img} 
                      alt="" 
                      className="quad-img" 
                      loading="lazy"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80';
                      }}
                    />
                  </div>
                ))}
              </div>
              <div className="bestseller-more-pill">
                {group.moreCount}
              </div>
            </div>
            <span className="bestseller-card-title">{group.title}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
