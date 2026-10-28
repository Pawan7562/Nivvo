import React from 'react';
import ProductCard from './ProductCard';
import { ChevronRight, ArrowRight } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function ProductShelf({
  title,
  subtitle,
  badgeText,
  badgeColor = '#0C831F',
  badgeBg = '#DCFCE7',
  onSeeAll,
  products = [],
  cartItems = [],
  onQuickView,
  onAddToCart,
  onUpdateQuantity,
  globalPreferredSize,
  wishlist = [],
  onToggleWishlist,
  containerClass = ''
}) {
  if (!products || products.length === 0) return null;

  return (
    <div className={`product-shelf-container ${containerClass}`}>
      {/* Shelf Header */}
      <div className="product-shelf-header">
        <div className="shelf-header-left">
          {badgeText && (
            <span 
              className="shelf-badge-pill" 
              style={{ color: badgeColor, backgroundColor: badgeBg }}
            >
              {badgeText}
            </span>
          )}
          <h2 className="shelf-title">{title}</h2>
          {subtitle && <p className="shelf-sub">{subtitle}</p>}
        </div>

        {onSeeAll && (
          <button 
            className="shelf-see-all-top-btn"
            onClick={() => {
              playClickSound();
              onSeeAll();
            }}
          >
            <span>See all</span>
            <ChevronRight size={14} />
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Shelf Track */}
      <div className="product-shelf-scroll-track">
        {products.map((item) => {
          const cartItem = cartItems.find(c => c.id === item.id);
          const isWishlisted = wishlist.includes(item.id);

          return (
            <div key={item.id} className="shelf-product-item">
              <ProductCard
                product={item}
                onQuickView={onQuickView}
                cartItem={cartItem}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                globalPreferredSize={globalPreferredSize}
                isWishlisted={isWishlisted}
                onToggleWishlist={onToggleWishlist}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

