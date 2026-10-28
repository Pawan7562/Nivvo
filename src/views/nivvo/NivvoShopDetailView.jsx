import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { ArrowLeft, ShoppingBag, ArrowUpRight, Plus, Star } from 'lucide-react';
import { NIVVO_PRODUCTS } from '../../data/nivvoData';
import { playClickSound, playAddSound } from '../../utils/audioEffects';

export default function NivvoShopDetailView({
  onBack,
  onOpenCart,
  onSelectProduct
}) {
  const { totalCartCount, addToCart, allProducts } = useNivvo();
  const [activeChip, setActiveChip] = useState('All products');
  const chips = ['All products', 'Sneakers', 'Sandals', 'Slippers'];

  const productsList = (allProducts && allProducts.length > 0) ? allProducts : NIVVO_PRODUCTS;
  const allShopProducts = productsList.filter(p => 
    p.storeId === 'nv-shop-1' || 
    p.brand === 'Sole Street' || 
    p.id?.startsWith('sp-') || 
    ['nv-prod-1', 'nv-prod-3', 'nv-prod-6'].includes(p.id)
  );

  const filteredShopProducts = allShopProducts.filter(p => {
    if (activeChip === 'Sneakers') return p.name.toLowerCase().includes('sneaker');
    if (activeChip === 'Sandals') return p.name.toLowerCase().includes('sandal');
    return true;
  });

  return (
    <div className="nivvo-shop-detail-screen" style={{ minHeight: '100%', paddingBottom: '40px' }}>
      {/* Header */}
      <div className="nivvo-nav-header">
        <div className="nivvo-nav-header-left">
          <button className="nivvo-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="nivvo-nav-header-title">Sole Street</div>
            <div className="nivvo-nav-header-subtitle">Your neighbourhood footwear specialist</div>
          </div>
        </div>
        <button className="nivvo-bag-trigger" onClick={onOpenCart}>
          <ShoppingBag size={22} strokeWidth={1.8} />
          {totalCartCount > 0 && <span className="nivvo-bag-count-badge">{totalCartCount}</span>}
        </button>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Storefront Hero Photo */}
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          borderRadius: '16px',
          overflow: 'hidden',
          backgroundColor: '#EAECE6',
          marginBottom: '16px'
        }}>
          <img 
            src="/assets/figma/shop_sole_street_banner.png" 
            alt="Sole Street Storefront"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        {/* Title & Verified Badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#20251F', margin: 0 }}>
            Sole Street
          </h1>
          <span style={{
            backgroundColor: '#E8F5E9',
            color: '#238636',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '999px'
          }}>
            Verified shop
          </span>
        </div>

        {/* Location */}
        <div style={{ fontSize: '13px', color: '#73796F', marginBottom: '16px' }}>
          12th Main Road, Indiranagar · 0.6 km away
        </div>

        {/* 3 Metric Columns */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px',
          marginBottom: '16px'
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#20251F' }}>★ 4.8</div>
            <div style={{ fontSize: '12px', color: '#73796F' }}>248 reviews</div>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#20251F' }}>12–18 min</div>
            <div style={{ fontSize: '12px', color: '#73796F' }}>To your door</div>
          </div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#20251F' }}>10 am–9 pm</div>
            <div style={{ fontSize: '12px', color: '#73796F' }}>Open today</div>
          </div>
        </div>

        {/* Story Box */}
        <div style={{
          border: '1px solid #E7EAE3',
          borderRadius: '16px',
          padding: '14px 16px',
          fontSize: '13px',
          lineHeight: 1.45,
          color: '#20251F',
          marginBottom: '18px'
        }}>
          Locally owned since 2018. Thoughtfully selected footwear, now a little closer to your doorstep.
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>
          {chips.map(chip => (
            <button
              key={chip}
              onClick={() => { playClickSound(); setActiveChip(chip); }}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: activeChip === chip ? 700 : 500,
                backgroundColor: activeChip === chip ? '#20251F' : '#FFFFFF',
                color: activeChip === chip ? '#FFFFFF' : '#20251F',
                border: activeChip === chip ? 'none' : '1px solid #E7EAE3',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* The Everyday Edit */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#20251F', margin: 0 }}>
            The everyday edit ({filteredShopProducts.length})
          </h2>
          <span style={{ fontSize: '12px', color: '#73796F' }}>Stock synced 2 min ago</span>
        </div>

        {/* 2-Column Product Grid */}
        <div className="nivvo-product-card-grid">
          {filteredShopProducts.map((prod) => (
            <div 
              key={prod.id}
              className="nivvo-product-card-master"
              onClick={() => {
                playClickSound();
                onSelectProduct(prod);
              }}
              style={{ minWidth: 0, width: '100%', boxSizing: 'border-box' }}
            >
              <div className="nivvo-product-thumb-container">
                <img 
                  src={prod.image} 
                  alt={prod.name} 
                  className="nivvo-product-thumb-img"
                />
                <button 
                  className="nivvo-floating-plus-btn"
                  title="Add to bag"
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(prod, 'UK 8', { name: 'Sole Street', id: 'sole-street' });
                  }}
                >
                  <Plus size={18} strokeWidth={2.6} />
                </button>
              </div>

              <div className="nivvo-card-shop-line" style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, overflow: 'hidden' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>Sole Street</span>
                <span style={{ flexShrink: 0 }}>·</span>
                <span style={{ color: '#24452D', fontWeight: 700, flexShrink: 0 }}>12–18 min</span>
              </div>
              <div className="nivvo-card-title" style={{ minWidth: 0 }}>{prod.name}</div>
              <div className="nivvo-card-price-row" style={{ minWidth: 0 }}>
                <span className="nivvo-card-price" style={{ whiteSpace: 'nowrap' }}>₹{prod.price.toLocaleString('en-IN')}</span>
                <span className="nivvo-card-stock" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>{prod.stockCount} in stock</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
