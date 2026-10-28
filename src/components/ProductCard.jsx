import React, { useState } from 'react';
import { Clock, Star, Plus, Minus, Layers, Heart, MapPin } from 'lucide-react';
import { playAddSound, playClickSound } from '../utils/audioEffects';
import { useCustomization } from '../context/CustomizationContext';

export default function ProductCard({ 
  product, 
  onQuickView, 
  cartItem, 
  onAddToCart, 
  onUpdateQuantity,
  globalPreferredSize,
  isWishlisted,
  onToggleWishlist
}) {
  const { config } = useCustomization();
  const defaultSize = product.sizes && product.sizes.length > 0 
    ? (product.sizes.includes(globalPreferredSize) ? globalPreferredSize : product.sizes[0])
    : 'Free Size';

  const [selectedSize, setSelectedSize] = useState(defaultSize);

  const quantity = cartItem ? cartItem.quantity : 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    playAddSound();
    onAddToCart(product, selectedSize);
  };

  const handleIncrement = (e) => {
    e.stopPropagation();
    playAddSound();
    onUpdateQuantity(product.id, selectedSize, quantity + 1);
  };

  const handleDecrement = (e) => {
    e.stopPropagation();
    playClickSound();
    onUpdateQuantity(product.id, selectedSize, quantity - 1);
  };

  const handleWishlistClick = (e) => {
    e.stopPropagation();
    playClickSound();
    if (onToggleWishlist) {
      onToggleWishlist(product.id);
    }
  };

  return (
    <div className="product-card" onClick={() => onQuickView(product)}>
      {/* Product Image Box */}
      <div className="product-image-box">
        <img src={product.image} alt={product.name} className="product-img" loading="lazy" />

        {/* Wishlist Heart Button */}
        <button 
          className={`wishlist-heart-btn ${isWishlisted ? 'active' : ''}`}
          onClick={handleWishlistClick}
          title={isWishlisted ? 'Remove from Wishlist' : 'Save to Wishlist'}
        >
          <Heart size={15} fill={isWishlisted ? '#E11D48' : 'none'} color={isWishlisted ? '#E11D48' : '#64748B'} />
        </button>

        {/* Top-Left Speed Badge */}
        <div className="delivery-tag">
          <Clock size={11} className="clock-icon" />
          <span>{product.deliveryTime}</span>
        </div>

        {/* Bottom-Left 2-Size Trial Badge (if supported) */}
        {product.trialSupported && (
          <div className="trial-ready-badge">
            <Layers size={10} />
            <span>2-Size Trial</span>
          </div>
        )}

        {/* Emergency SOS Tag if applicable */}
        {(product.tag === 'EMERGENCY HERO' || product.tag === 'CAREER SAVER' || product.tag === 'MONSOON DEFENSE') && (
          <div className="sos-ribbon">{product.tag}</div>
        )}
      </div>

      {/* Card Details */}
      <div className="product-info">
        <div className="product-meta-row">
          <span className="product-brand">{product.brand || config.appName || 'Nivvo'}</span>
          <div className="product-rating">
            <Star size={11} fill="#F59E0B" color="#F59E0B" />
            <span>{product.rating}</span>
            <span style={{ color: '#94A3B8', fontSize: '10px' }}>({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="product-name" title={product.name}>
          {product.name}
        </h3>

        <div className="product-subtitle">
          {product.subtitle || product.fabric}
        </div>

        {/* Local Stock Information Tag */}
        {config.localStockDisplay && (
          <div className="local-stock-indicator">
            <span className="stock-dot" />
            <span>In stock at Indiranagar Hub</span>
          </div>
        )}

        {/* Size Selector Chips on Card */}
        {product.sizes && product.sizes.length > 1 && (
          <div className="card-size-selector" onClick={(e) => e.stopPropagation()}>
            {product.sizes.map((sz) => {
              const isSelected = selectedSize === sz;
              const isPreferred = globalPreferredSize && sz.includes(globalPreferredSize);

              return (
                <button
                  key={sz}
                  className={`size-pill-mini ${isSelected ? 'active' : ''} ${isPreferred && !isSelected ? 'trial-candidate' : ''}`}
                  onClick={() => { playClickSound(); setSelectedSize(sz); }}
                  title={isPreferred ? 'AI Recommended Fit' : ''}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        )}

        {/* Bottom Pricing & Blinkit Action CTA */}
        <div className="product-bottom-row" onClick={(e) => e.stopPropagation()}>
          <div className="price-col">
            <div className="price-main-line">
              <span className="current-price">{config.currencySymbol || '₹'}{product.price}</span>
              {product.originalPrice && (
                <span className="original-price">{config.currencySymbol || '₹'}{product.originalPrice}</span>
              )}
            </div>
            {product.discount && (
              <span className="price-discount-tag">{product.discount}</span>
            )}
          </div>

          {quantity === 0 ? (
            <button className="blink-add-btn" onClick={handleAdd}>
              <span>ADD</span>
              <Plus size={13} strokeWidth={3} />
            </button>
          ) : (
            <div className="blink-counter-btn-group">
              <button className="counter-btn" onClick={handleDecrement} aria-label="Decrease">
                <Minus size={13} strokeWidth={3} />
              </button>
              <span className="counter-value">{quantity}</span>
              <button className="counter-btn" onClick={handleIncrement} aria-label="Increase">
                <Plus size={13} strokeWidth={3} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
