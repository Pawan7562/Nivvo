import React from 'react';
import ProductCard from '../components/ProductCard';
import { Heart, ShoppingBag, ArrowRight, ChevronLeft } from 'lucide-react';
import { playAddSound, playClickSound } from '../utils/audioEffects';

export default function WishlistView({ 
  wishlist, 
  products, 
  onQuickView, 
  cartItems, 
  onAddToCart, 
  onUpdateQuantity, 
  globalPreferredSize,
  onToggleWishlist,
  onNavigateHome 
}) {
  const wishlistedProducts = products.filter(p => wishlist.includes(p.id));

  const handleAddAllToCart = () => {
    playAddSound();
    wishlistedProducts.forEach(p => {
      onAddToCart(p, p.sizes ? p.sizes[0] : 'Free Size', true);
    });
    alert(`Added all ${wishlistedProducts.length} saved items to your cart!`);
  };

  return (
    <div className="blinkit-wishlist-page" style={{ paddingBottom: '90px' }}>
      {/* Native Toolbar */}
      <div className="apk-profile-toolbar">
        <button 
          className="apk-toolbar-back-btn" 
          onClick={() => { playClickSound(); if (onNavigateHome) onNavigateHome(); }}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#293142" />
        </button>
        <h1 className="apk-toolbar-title">Your Saved Wishlist ({wishlist.length})</h1>
      </div>

      <div style={{ padding: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <p style={{ fontSize: '12px', color: '#64748B' }}>
              Outfits and essentials saved for instant 10-minute dispatch.
            </p>
          </div>

        {wishlistedProducts.length > 0 && (
          <button 
            onClick={handleAddAllToCart}
            style={{
              background: '#0C831F',
              color: '#FFFFFF',
              padding: '10px 18px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <ShoppingBag size={15} />
            <span>Move All to Cart</span>
          </button>
        )}
      </div>

      {wishlistedProducts.length === 0 ? (
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E5E7EB',
          padding: '60px 20px',
          textAlign: 'center',
          maxWidth: '480px',
          margin: '40px auto'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: '#FFE4E6',
            color: '#E11D48',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px auto'
          }}>
            <Heart size={30} fill="#E11D48" />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>
            Your Wishlist is Empty
          </h3>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px', marginBottom: '20px' }}>
            Tap the heart icon on any shirt, shoe, dress, or emergency kit to save it for quick 10-minute ordering later.
          </p>
          <button 
            onClick={onNavigateHome}
            style={{
              background: '#0C831F',
              color: '#FFFFFF',
              padding: '10px 24px',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Explore 10-Min Catalog
          </button>
        </div>
      ) : (
        <div className="products-grid">
          {wishlistedProducts.map(item => {
            const cartItem = cartItems.find(c => c.id === item.id);
            return (
              <ProductCard 
                key={item.id}
                product={item}
                onQuickView={onQuickView}
                cartItem={cartItem}
                onAddToCart={onAddToCart}
                onUpdateQuantity={onUpdateQuantity}
                globalPreferredSize={globalPreferredSize}
                isWishlisted={true}
                onToggleWishlist={onToggleWishlist}
              />
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
