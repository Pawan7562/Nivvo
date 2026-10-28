import React from 'react';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function FloatingCartBar({ cartCount, cartTotal, onOpenCart }) {
  if (cartCount <= 0) return null;

  const handleClick = () => {
    playClickSound();
    onOpenCart();
  };

  return (
    <div className="floating-cart-wrapper">
      <button className="floating-cart-bar" onClick={handleClick}>
        <div className="cart-bar-left">
          <div className="cart-bar-icon-wrap">
            <ShoppingBag size={18} />
            <span className="cart-bar-badge">{cartCount}</span>
          </div>
          <div className="cart-bar-text">
            <span className="cart-bar-count">{cartCount} {cartCount === 1 ? 'item' : 'items'}</span>
            <span className="cart-bar-total">₹{cartTotal}</span>
          </div>
        </div>

        <div className="cart-bar-right">
          <span>View Cart</span>
          <ArrowRight size={15} />
        </div>
      </button>
    </div>
  );
}
