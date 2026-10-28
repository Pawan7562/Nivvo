import React, { useState, useEffect } from 'react';
import { Zap, Sparkles, ShieldCheck, ArrowRight, Clock, Award } from 'lucide-react';

const SLIDES = [
  {
    pill: '⚡ 10-Minute Wardrobe Guarantee',
    title: 'Wardrobe Emergency?',
    highlight: 'Clothes at your door in 10 mins.',
    subtitle: 'Spilled coffee, last-minute interview, sudden rain, or date night? Freshly steam-pressed apparel delivered from your local dark store.',
    cta: 'Explore SOS Rescue Kits',
    categoryTarget: 'sos',
    badge: '⚡ 8-Min Express Hub',
    image: 'https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=800&auto=format&fit=crop&q=80',
    features: ['Pre-steamed on hangers', 'Sanitized packaging', 'Zero wait returns']
  },
  {
    pill: '🛡️ Revolutionary Quick-Commerce',
    title: 'Doorstep 2-Size Trial',
    highlight: 'Try M & L at your doorstep for ₹0.',
    subtitle: 'Confused between sizes? We bring both adjacent sizes. Try them on for 2 mins while the rider waits, and hand back the extra size on the spot!',
    cta: 'How Doorstep Trial Works',
    isTrialModal: true,
    badge: '100% Free Service',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800&auto=format&fit=crop&q=80',
    features: ['No upfront extra deposit', 'Instant instant return', 'Zero repackaging hassle']
  },
  {
    pill: '👔 Dark Store Exclusive',
    title: 'Interview in 30 Mins?',
    highlight: 'Executive Formals in 8 Minutes.',
    subtitle: 'Wrinkle-resistant Egyptian cotton shirts, slim stretch trousers, and pure Italian silk ties packed in crease-free garment sleeves.',
    cta: 'Shop Office Formals',
    categoryTarget: 'formal',
    badge: 'Flat 45% OFF',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    features: ['Wrinkle-free tech', 'Includes collar stays', 'Next-to-skin soft']
  }
];

export default function HeroSlider({ onSelectCategory, onOpenTrialModal }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[currentSlide];

  return (
    <div className="hero-slider-wrap">
      <div className="hero-slide">
        <div className="hero-slide-text">
          <div className="hero-pill">
            <Zap size={13} fill="#F8CB46" color="#F8CB46" />
            <span>{slide.pill}</span>
          </div>

          <h1 className="hero-title">
            {slide.title} <br />
            <span className="highlight-yellow">{slide.highlight}</span>
          </h1>

          <p className="hero-subtitle">
            {slide.subtitle}
          </p>

          <button 
            className="hero-cta-btn"
            onClick={() => {
              if (slide.isTrialModal) {
                onOpenTrialModal();
              } else if (slide.categoryTarget) {
                onSelectCategory(slide.categoryTarget);
              }
            }}
          >
            <span>{slide.cta}</span>
            <ArrowRight size={16} />
          </button>

          <div className="hero-features-list">
            {slide.features.map((feat, i) => (
              <div key={i} className="hero-feature-item">
                <ShieldCheck size={14} color="#86EFAC" />
                <span>{feat}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-image-wrap">
          <div className="hero-badge-float">
            <Clock size={13} color="#0C831F" />
            <span>{slide.badge}</span>
          </div>
          <img 
            src={slide.image} 
            alt="Nivvo 10 Minute Delivery" 
            className="hero-mockup-img"
          />
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="hero-dots-wrap">
        {SLIDES.map((_, index) => (
          <div 
            key={index} 
            className={`hero-dot ${index === currentSlide ? 'active' : ''}`}
            onClick={() => setCurrentSlide(index)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
    </div>
  );
}
