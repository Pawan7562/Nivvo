import React from 'react';
import { playClickSound } from '../utils/audioEffects';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

const FEATURED_STORIES = [
  {
    id: 'eternal-card',
    tag: 'FLASH ACCESS',
    tagBg: '#EF4444',
    tagColor: '#FFFFFF',
    title: 'Eternal Card',
    subtitle: 'Black Tier Access',
    desc: 'VIP 10-Min Priority',
    bg: 'linear-gradient(150deg, #181922 0%, #0B0C10 100%)',
    borderColor: 'rgba(96, 165, 250, 0.45)',
    glowColor: 'rgba(59, 130, 246, 0.25)',
    isVipCard: true,
    actionType: 'category',
    target: 'all'
  },
  {
    id: 'sneaker-lab',
    tag: 'NEW DROP',
    tagBg: '#FFFFFF',
    tagColor: '#C2410C',
    title: 'Sneaker Lab',
    subtitle: 'Retro Air Dunks',
    desc: 'Try 2 Sizes Free',
    bg: 'linear-gradient(150deg, #9A3412 0%, #431407 100%)',
    borderColor: 'rgba(251, 146, 60, 0.45)',
    glowColor: 'rgba(234, 88, 12, 0.3)',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&auto=format&fit=crop&q=80',
    actionType: 'category',
    target: 'footwear'
  },
  {
    id: 'ajmal',
    tag: 'SPONSORED',
    tagBg: '#FCE7F3',
    tagColor: '#9D174D',
    title: 'AJMAL Perfumes',
    subtitle: 'Aristocrat EDP',
    desc: 'Royal Fragrance',
    bg: 'linear-gradient(150deg, #9D174D 0%, #500724 100%)',
    borderColor: 'rgba(244, 114, 182, 0.45)',
    glowColor: 'rgba(219, 39, 119, 0.3)',
    img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=300&auto=format&fit=crop&q=80',
    actionType: 'category',
    target: 'accessories'
  },
  {
    id: 'fashion-sos',
    tag: 'DOORSTEP TRIAL',
    tagBg: '#DCFCE7',
    tagColor: '#166534',
    title: 'Fashion SOS',
    subtitle: '2-Size Try-On',
    desc: 'Delivered in 8 Mins',
    bg: 'linear-gradient(150deg, #065F46 0%, #022C22 100%)',
    borderColor: 'rgba(52, 211, 153, 0.45)',
    glowColor: 'rgba(16, 185, 129, 0.3)',
    img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300&auto=format&fit=crop&q=80',
    actionType: 'view',
    target: 'trial'
  },
  {
    id: 'audio-studio',
    tag: 'TECH DROP',
    tagBg: '#E0E7FF',
    tagColor: '#3730A3',
    title: 'Audio Studio',
    subtitle: 'ANC TWS Buds',
    desc: 'Instant Beat Drop',
    bg: 'linear-gradient(150deg, #1E1B4B 0%, #0F172A 100%)',
    borderColor: 'rgba(129, 140, 248, 0.45)',
    glowColor: 'rgba(99, 102, 241, 0.3)',
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=80',
    actionType: 'category',
    target: 'electronics'
  }
];

export default function BlinkitFeaturedStories({ onSelectCategory, onOpenTrialModal }) {
  return (
    <section className="blinkit-featured-section">
      <div className="featured-stories-header">
        <h3 className="featured-stories-title">Featured this week</h3>
      </div>

      <div className="featured-stories-rail">
        {FEATURED_STORIES.map((story) => (
          <div 
            key={story.id} 
            className="featured-story-card"
            style={{
              background: story.bg,
              borderColor: story.borderColor,
              boxShadow: `0 8px 20px -4px ${story.glowColor || 'rgba(0,0,0,0.25)'}`
            }}
            onClick={() => {
              playClickSound();
              if (story.actionType === 'view' && onOpenTrialModal) {
                onOpenTrialModal();
              } else if (onSelectCategory) {
                onSelectCategory(story.target);
              }
            }}
          >
            {/* Top Tag Pill */}
            <div className="featured-tag-pill-row">
              <span 
                className="featured-tag-pill" 
                style={{ 
                  backgroundColor: story.tagBg,
                  color: story.tagColor
                }}
              >
                {story.tag}
              </span>
            </div>

            {/* Showcase Visual Area */}
            <div className="story-showcase-visual">
              {story.isVipCard ? (
                <div className="mini-eternal-card">
                  <div className="eternal-card-chip"></div>
                  <div className="eternal-card-brand">
                    <span className="eternal-logo-txt">ETERNAL</span>
                    <Sparkles size={10} color="#FBBF24" />
                  </div>
                  <div className="eternal-card-number">•••• 8820</div>
                  <div className="eternal-card-holder">VIP MEMBER</div>
                </div>
              ) : (
                <div className="story-product-pod">
                  <div className="story-product-halo"></div>
                  <img 
                    src={story.img} 
                    alt={story.title}
                    className="story-product-img"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&auto=format&fit=crop&q=80';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Bottom Content Info */}
            <div className="story-content-wrap">
              <h4 className="story-main-title">{story.title}</h4>
              <div className="story-sub-title">{story.subtitle}</div>
              <p className="story-desc">{story.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
