import React, { useState } from 'react';
import { Sparkles, ChevronRight, Star, Plus, Minus, Clock, Heart } from 'lucide-react';
import { playClickSound, playAddSound } from '../utils/audioEffects';
import { FESTIVE_SPECIALS_PRODUCTS } from '../data/fashionData';

export default function FestiveShowcaseSection({
  onSelectCategory,
  onOpenTrialModal,
  cartItems = [],
  onAddToCart,
  onUpdateQuantity,
  onQuickView
}) {
  const [quantities, setQuantities] = useState({});

  const handleAddLocal = (e, prod) => {
    e.stopPropagation();
    playAddSound();
    if (onAddToCart) {
      onAddToCart(prod, prod.sizes[0] || '1 pc');
    } else {
      setQuantities(prev => ({ ...prev, [prod.id]: (prev[prod.id] || 0) + 1 }));
    }
  };

  const handleIncLocal = (e, prod, currentQty) => {
    e.stopPropagation();
    playAddSound();
    if (onUpdateQuantity) {
      onUpdateQuantity(prod.id, prod.sizes[0] || '1 pc', currentQty + 1);
    } else {
      setQuantities(prev => ({ ...prev, [prod.id]: currentQty + 1 }));
    }
  };

  const handleDecLocal = (e, prod, currentQty) => {
    e.stopPropagation();
    playClickSound();
    if (onUpdateQuantity) {
      onUpdateQuantity(prod.id, prod.sizes[0] || '1 pc', currentQty - 1);
    } else {
      setQuantities(prev => ({ ...prev, [prod.id]: Math.max(0, currentQty - 1) }));
    }
  };

  return (
    <section className="blinkit-festive-hero-master-container">
      {/* 1. Maroon Festive Hero Banner & Bento Grid (Exact from Screenshot) */}
      <div className="festive-maroon-zone">
        {/* Animated Background Lights & Glowing Lanterns */}
        <div className="festive-ambient-glow" />
        <div className="festive-fairy-lights">
          {[...Array(9)].map((_, i) => (
            <span key={i} className={`fairy-light-bulb bulb-${i % 3}`} />
          ))}
        </div>

        {/* Top Header: Subho Dashami & Animated Scene Illustration */}
        <div className="dashami-header-row">
          <div className="dashami-title-box">
            <span className="subho-ornament">~ SUBHO ~</span>
            <h2 className="dashami-bold-title">DASHAMI</h2>
            <span className="dashami-sub-tag">Festive Celebrations • 10 Mins Delivery</span>
          </div>

          {/* Animated Kolkata Taxi & Mother-Child Festive Artwork */}
          <div className="dashami-animated-scene">
            <div className="scene-artwork-wrapper">
              {/* Yellow Taxi with glowing headlights */}
              <div className="yellow-taxi-animated">
                <div className="taxi-roof-carrier" />
                <div className="taxi-body">
                  <span className="taxi-sign">TAXI</span>
                  <div className="taxi-light-beam" />
                </div>
                <div className="taxi-wheels">
                  <span className="wheel wheel-left" />
                  <span className="wheel wheel-right" />
                </div>
              </div>

              {/* Mother & Child Silhouette in Traditional Attire */}
              <div className="festive-people-art">
                <span className="floating-flower-petal p1">🌸</span>
                <span className="floating-flower-petal p2">✨</span>
                <span className="people-icon">👩‍👦</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Bento 5-Card Festive Grid (Exact Layout from Screenshot) */}
        <div className="festive-bento-grid">
          {/* Card 1: WOMEN'S GLAM (Tall Left Card) */}
          <div 
            className="bento-card bento-tall bento-women-glam"
            onClick={() => { playClickSound(); onSelectCategory('festive'); }}
          >
            <div className="bento-card-header">
              <span className="bento-label">WOMEN'S GLAM</span>
              <div className="bento-price-tag">
                <span className="strikethrough-mini">₹75</span>
                <span className="current-maroon-badge">₹64</span>
              </div>
              <span className="bento-sub-item-name">Alta</span>
            </div>

            <div className="bento-img-container alta-bottle-box">
              <img 
                src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=350&auto=format&fit=crop&q=80" 
                alt="Alta Festive Red" 
                className="bento-product-img alta-img"
              />
              <div className="golden-shimmer-ring" />
            </div>
          </div>

          {/* Card 2: Men's Ethnic Wear (Top Middle) */}
          <div 
            className="bento-card bento-men-ethnic"
            onClick={() => { playClickSound(); onSelectCategory('festive'); }}
          >
            <span className="bento-label">Men's Ethnic Wear</span>
            <div className="bento-img-container">
              <img 
                src="https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=350&auto=format&fit=crop&q=80" 
                alt="Men's Ethnic Wear" 
                className="bento-product-img"
              />
            </div>
          </div>

          {/* Card 3: Kids Corner (Top Right) */}
          <div 
            className="bento-card bento-kids-corner"
            onClick={() => { playClickSound(); onSelectCategory('all'); }}
          >
            <span className="bento-label">Kids Corner</span>
            <div className="bento-img-container">
              <img 
                src="https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=350&auto=format&fit=crop&q=80" 
                alt="Kids Festive Toys" 
                className="bento-product-img"
              />
            </div>
          </div>

          {/* Card 4: Feasting Corner (Bottom Middle) */}
          <div 
            className="bento-card bento-feasting-corner"
            onClick={() => { playClickSound(); onSelectCategory('all'); }}
          >
            <span className="bento-label">Feasting Corner</span>
            <div className="bento-img-container">
              <img 
                src="https://images.unsplash.com/photo-1586201375761-83865001e31c?w=350&auto=format&fit=crop&q=80" 
                alt="Feasting Spices & Rice" 
                className="bento-product-img"
              />
            </div>
          </div>

          {/* Card 5: Kumari Pujo (Bottom Right) */}
          <div 
            className="bento-card bento-kumari-pujo"
            onClick={() => { playClickSound(); onSelectCategory('all'); }}
          >
            <span className="bento-label">Kumari Pujo</span>
            <div className="bento-img-container">
              <img 
                src="https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=350&auto=format&fit=crop&q=80" 
                alt="Kumari Pujo Offerings" 
                className="bento-product-img"
              />
            </div>
          </div>
        </div>

        {/* 3. Tradition Strip Banner (Sindoor Khela & Dashami) */}
        <div 
          className="festive-tradition-strip"
          onClick={() => { playClickSound(); onSelectCategory('festive'); }}
        >
          <div className="tradition-strip-left">
            <span className="tradition-leaf-icon">🍃</span>
            <div className="tradition-text-group">
              <strong className="tradition-main-text">Celebrate Dashami with Sindoor Khela</strong>
              <span className="tradition-sub-text">Know the traditions of Vijaya Dashami & visarjan</span>
            </div>
          </div>
          <ChevronRight size={16} color="#78350F" />
        </div>
      </div>

      {/* Decorative Scallop Border Transition (Maroon to Cream) */}
      <div className="festive-scallop-divider" />

      {/* 4. ~ FESTIVE SPECIALS ~ Product Shelf Carousel */}
      <div className="festive-specials-cream-zone">
        <div className="festive-specials-header">
          <span className="ornate-curl">~ 🪔 ~</span>
          <h3 className="festive-specials-title">FESTIVE SPECIALS</h3>
          <span className="ornate-curl">~ 🪔 ~</span>
        </div>

        <div className="festive-specials-scroll-rail">
          {FESTIVE_SPECIALS_PRODUCTS.map((item) => {
            const inCart = cartItems.find(c => c.id === item.id);
            const quantity = inCart ? inCart.quantity : (quantities[item.id] || 0);

            return (
              <div 
                key={item.id} 
                className="festive-specials-card"
                onClick={() => onQuickView && onQuickView(item)}
              >
                {/* Product Image Box */}
                <div className="festive-card-top-box">
                  <img src={item.image} alt={item.name} className="festive-card-image" loading="lazy" />
                  
                  {item.badge && (
                    <span className="festive-top-rated-tag">{item.badge}</span>
                  )}

                  <button 
                    className="festive-heart-btn"
                    onClick={(e) => { e.stopPropagation(); playClickSound(); }}
                  >
                    <Heart size={14} color="#64748B" />
                  </button>
                </div>

                {/* Unit & Green Add Button Row */}
                <div className="festive-card-action-row" onClick={(e) => e.stopPropagation()}>
                  <span className="festive-unit-label">{item.unit || '1 pc'}</span>

                  {quantity === 0 ? (
                    <button 
                      className="festive-green-add-btn"
                      onClick={(e) => handleAddLocal(e, item)}
                    >
                      <span>ADD</span>
                    </button>
                  ) : (
                    <div className="festive-counter-group">
                      <button 
                        className="f-counter-btn"
                        onClick={(e) => handleDecLocal(e, item, quantity)}
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="f-counter-val">{quantity}</span>
                      <button 
                        className="f-counter-btn"
                        onClick={(e) => handleIncLocal(e, item, quantity)}
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Line */}
                <div className="festive-price-row">
                  <span className="festive-curr-price">₹{item.price}</span>
                  {item.originalPrice && (
                    <span className="festive-orig-price">₹{item.originalPrice}</span>
                  )}
                </div>
                {item.discount && (
                  <div className="festive-discount-blue">{item.discount}</div>
                )}

                {/* Title */}
                <h4 className="festive-product-name" title={item.name}>
                  {item.name}
                </h4>

                {/* Material / Size Tags */}
                <div className="festive-attribute-tags">
                  {item.material && <span className="attr-tag">{item.material}</span>}
                  {item.sizeType && <span className="attr-tag">{item.sizeType}</span>}
                </div>

                {/* Rating & Delivery Time */}
                <div className="festive-meta-ratings">
                  <div className="star-rating-box">
                    <Star size={10} fill="#F59E0B" color="#F59E0B" />
                    <span>{item.rating}</span>
                    <span className="rev-count">({item.reviewCount})</span>
                  </div>
                </div>

                <div className="festive-delivery-pill">
                  <Clock size={11} color="#0C831F" />
                  <span>{item.deliveryTime}</span>
                  {item.stockLeft && (
                    <span className="stock-alert">• {item.stockLeft} left</span>
                  )}
                </div>

                {/* See More Like This Button */}
                <button 
                  className="see-more-like-this-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onSelectCategory('festive');
                  }}
                >
                  <span>See more like this</span>
                  <ChevronRight size={12} />
                </button>
              </div>
            );
          })}
        </div>

        {/* 5. Exclusive Payment Offers Banner Strip */}
        <div className="exclusive-payment-offers-strip">
          <span className="payment-offers-title">EXCLUSIVE PAYMENT OFFERS</span>
          <div className="payment-bank-badges">
            <span className="bank-chip axis">AXIS BANK</span>
            <span className="bank-chip visa">VISA</span>
            <span className="bank-chip au">AU</span>
            <ChevronRight size={14} color="#78350F" />
          </div>
        </div>
      </div>

      {/* Bottom Scallop Divider leading directly into Bestsellers */}
      <div className="festive-scallop-divider reverse" />
    </section>
  );
}
