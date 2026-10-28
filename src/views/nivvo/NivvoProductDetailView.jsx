import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowLeft, ShoppingBag, ArrowUpRight, Plus, Check, X, 
  ShieldCheck, Heart, Sparkles, Star, ThumbsUp, Truck, RotateCcw
} from 'lucide-react';
import { playClickSound, playAddSound, playTrialSound } from '../../utils/audioEffects';

export default function NivvoProductDetailView({
  product,
  onBack,
  onOpenCart
}) {
  const { addToCart, totalCartCount, showToast, isWishlisted, toggleWishlist } = useNivvo();
  const [selectedSize, setSelectedSize] = useState('UK 8');
  const [selectedShop, setSelectedShop] = useState('sole-street');
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' | 'reviews'

  const sizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'];

  const prodData = product || {
    id: 'nv-prod-1',
    name: 'Everyday court sneaker',
    brand: 'SOLE STREET ORIGINALS',
    price: 1299,
    originalPrice: 1599,
    discount: 'Save ₹300',
    color: 'Sage / Ivory',
    rating: 4.8,
    reviewCount: 64,
    deliveryTime: '12–18 min',
    stockCount: 4,
    image: '/assets/figma/product_court_sneaker.png'
  };

  const isFavorited = isWishlisted(prodData.id);

  const handleAdd = () => {
    const shopObj = selectedShop === 'sole-street' 
      ? { name: 'Sole Street', id: 'sole-street' }
      : { name: 'Urban Steps', id: 'urban-steps' };
    
    addToCart(prodData, selectedSize, shopObj);
  };

  const sampleReviews = [
    {
      id: 1,
      author: 'Kabir N.',
      rating: 5,
      date: '2 days ago · Verified Indiranagar Purchase',
      text: 'Delivered in literally 14 minutes by electric bike! Tried on both UK 8 and UK 9 at the doorstep. UK 8 fit like a glove, handed UK 9 back to the rider right then.',
      tags: ['Doorstep Trial Used', 'True to Size']
    },
    {
      id: 2,
      author: 'Sneha M.',
      rating: 5,
      date: 'Last week · Verified 100ft Road Purchase',
      text: 'The Sage / Ivory colorway looks even cleaner in person. Very comfortable cushioned insole for walking around Bangalore.',
      tags: ['Super Fast', 'Great Comfort']
    },
    {
      id: 3,
      author: 'Rohan P.',
      rating: 4,
      date: '2 weeks ago',
      text: 'Good local sneaker. Leather and canvas stitching is sturdy. Sole Street is right around the corner from my flat.',
      tags: ['Local Shop Quality']
    }
  ];

  return (
    <div className="nivvo-product-detail-screen" style={{ position: 'relative', minHeight: '100%', paddingBottom: '100px' }}>
      {/* Header */}
      <div className="nivvo-nav-header">
        <div className="nivvo-nav-header-left">
          <button className="nivvo-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="nivvo-nav-header-title">{prodData.name}</div>
            <div className="nivvo-nav-header-subtitle">{prodData.brand}</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={() => toggleWishlist(prodData.id)}
            style={{
              background: '#FFFFFF',
              border: '1px solid #E7EAE3',
              borderRadius: '50%',
              width: '38px',
              height: '38px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
            title={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart 
              size={18} 
              color={isFavorited ? '#E11D48' : '#20251F'} 
              fill={isFavorited ? '#E11D48' : 'none'} 
            />
          </button>
          <button className="nivvo-bag-trigger" onClick={onOpenCart}>
            <ShoppingBag size={22} strokeWidth={1.8} />
            {totalCartCount > 0 && <span className="nivvo-bag-count-badge">{totalCartCount}</span>}
          </button>
        </div>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Large Product Photo */}
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          borderRadius: '20px',
          overflow: 'hidden',
          backgroundColor: '#EAECE6',
          marginBottom: '12px'
        }}>
          <img 
            src={prodData.image || '/assets/figma/product_court_sneaker.png'} 
            alt={prodData.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '12px',
            backgroundColor: 'rgba(36, 69, 45, 0.9)',
            color: '#FFFFFF',
            padding: '4px 10px',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <Truck size={13} />
            <span>Delivers in {prodData.deliveryTime}</span>
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px' }}>
          <span style={{ width: '18px', height: '4px', borderRadius: '2px', backgroundColor: '#20251F' }} />
          <span style={{ width: '6px', height: '4px', borderRadius: '2px', backgroundColor: '#CBD5E1' }} />
          <span style={{ width: '6px', height: '4px', borderRadius: '2px', backgroundColor: '#CBD5E1' }} />
        </div>

        {/* Brand */}
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', letterSpacing: '0.06em', marginBottom: '4px' }}>
          {prodData.brand || 'SOLE STREET ORIGINALS'}
        </div>

        {/* Title */}
        <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#20251F', margin: '0 0 10px 0' }}>
          {prodData.name}
        </h1>

        {/* Price & Rating Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '24px', fontWeight: 900, color: '#20251F' }}>
                ₹{selectedShop === 'urban-steps' ? '1,349' : prodData.price.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '14px', color: '#73796F', textDecoration: 'line-through' }}>
                MRP ₹{prodData.originalPrice ? prodData.originalPrice.toLocaleString('en-IN') : '1,599'}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#238636', fontWeight: 700, marginTop: '2px' }}>
              Inclusive of all taxes · Save ₹300
            </div>
          </div>
          <div 
            onClick={() => setActiveTab('reviews')}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: 800, color: '#20251F', backgroundColor: '#F0F3ED', padding: '6px 10px', borderRadius: '10px', cursor: 'pointer' }}
          >
            <Star size={14} fill="#24452D" color="#24452D" />
            <span>{prodData.rating || 4.8}</span>
            <span style={{ color: '#73796F', fontWeight: 500 }}>({prodData.reviewCount || 64})</span>
          </div>
        </div>

        {/* 10-Minute Doorstep Trial Assurance Box */}
        <div style={{
          backgroundColor: '#EEF4EC',
          border: '1.5px solid #C4D9BC',
          borderRadius: '16px',
          padding: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ width: '36px', height: '36px', borderRadius: '10px', backgroundColor: '#24452D', color: '#B7F34A', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Sparkles size={18} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '12px', fontWeight: 800, color: '#24452D' }}>
              10-Minute Doorstep Trial Included
            </div>
            <div style={{ fontSize: '11px', color: '#5B6858', lineHeight: 1.35, marginTop: '2px' }}>
              Order your size + 1 spare size in the bag. Keep what fits at home!
            </div>
          </div>
        </div>

        {/* Tab Switcher: Details vs Reviews */}
        <div style={{ display: 'flex', borderBottom: '1px solid #E7EAE3', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveTab('details')}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'details' ? '2.5px solid #20251F' : 'none',
              color: activeTab === 'details' ? '#20251F' : '#73796F',
              fontWeight: activeTab === 'details' ? 800 : 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Product & Sizing
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'reviews' ? '2.5px solid #20251F' : 'none',
              color: activeTab === 'reviews' ? '#20251F' : '#73796F',
              fontWeight: activeTab === 'reviews' ? 800 : 600,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Customer Reviews ({prodData.reviewCount || 64})
          </button>
        </div>

        {activeTab === 'details' ? (
          <>
            {/* Colour Swatches */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#20251F', marginBottom: '8px' }}>
                Colour · {prodData.color || 'Sage / Ivory'}
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: '#7D8D78',
                  border: '2px solid #20251F',
                  boxShadow: '0 0 0 2px #FFFFFF',
                  cursor: 'pointer'
                }} />
                <span 
                  onClick={() => showToast('Selected Ivory / Off-White variant')}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#EFEAE1',
                    border: '1px solid #CBD5E1',
                    cursor: 'pointer'
                  }} 
                />
              </div>
            </div>

            {/* Size Selection */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#20251F' }}>Choose Size: {selectedSize}</span>
                <button 
                  onClick={() => setShowSizeGuide(true)}
                  style={{ background: 'none', border: 'none', color: '#20251F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer', fontSize: '12px' }}
                >
                  <span>Size guide</span>
                  <ArrowUpRight size={13} />
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => { playClickSound(); setSelectedSize(s); }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '12px',
                      fontSize: '13px',
                      fontWeight: selectedSize === s ? 800 : 600,
                      backgroundColor: selectedSize === s ? '#20251F' : '#FFFFFF',
                      color: selectedSize === s ? '#FFFFFF' : '#20251F',
                      border: selectedSize === s ? 'none' : '1px solid #E7EAE3',
                      cursor: 'pointer'
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Available from 2 neighbourhood shops */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#20251F', margin: '0 0 12px 0' }}>
                Available from 2 neighbourhood shops
              </h3>

              {/* Shop 1: Sole Street */}
              <div 
                onClick={() => { playClickSound(); setSelectedShop('sole-street'); }}
                style={{
                  border: selectedShop === 'sole-street' ? '1.5px solid #20251F' : '1px solid #E7EAE3',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  backgroundColor: selectedShop === 'sole-street' ? '#F7F8F5' : '#FFFFFF',
                  marginBottom: '10px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: selectedShop === 'sole-street' ? '4px solid #20251F' : '1.5px solid #CBD5E1',
                      backgroundColor: '#FFFFFF'
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#20251F' }}>Sole Street</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#20251F' }}>₹1,299</span>
                </div>

                <div style={{ fontSize: '12px', color: '#73796F', paddingLeft: '22px', marginBottom: '8px' }}>
                  ★ 4.8 · 0.6 km away · 4 pairs in {selectedSize}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: '22px', fontSize: '12px' }}>
                  <span style={{ fontWeight: 800, color: '#20251F' }}>12–18 min</span>
                  <span style={{ color: '#238636', fontWeight: 700 }}>Stock checked 2 min ago ✓</span>
                </div>
              </div>

              {/* Shop 2: Urban Steps */}
              <div 
                onClick={() => { playClickSound(); setSelectedShop('urban-steps'); }}
                style={{
                  border: selectedShop === 'urban-steps' ? '1.5px solid #20251F' : '1px solid #E7EAE3',
                  borderRadius: '16px',
                  padding: '14px 16px',
                  backgroundColor: selectedShop === 'urban-steps' ? '#F7F8F5' : '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      width: '14px',
                      height: '14px',
                      borderRadius: '50%',
                      border: selectedShop === 'urban-steps' ? '4px solid #20251F' : '1.5px solid #CBD5E1',
                      backgroundColor: '#FFFFFF'
                    }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#20251F' }}>Urban Steps</span>
                  </div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#20251F' }}>₹1,349</span>
                </div>

                <div style={{ fontSize: '12px', color: '#73796F', paddingLeft: '22px' }}>
                  ★ 4.6 · 1.8 km · 2 pairs · 20–28 min
                </div>
              </div>
            </div>

            {/* Feature bullets */}
            <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#73796F', margin: '0 0 12px 0' }}>
              Cushioned footbed. Breathable canvas upper. Durable rubber sole. Easy 7-day doorstep returns on unworn pairs.
            </p>
          </>
        ) : (
          /* Reviews Tab */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ backgroundColor: '#F7F8F5', padding: '16px', borderRadius: '16px' }}>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#20251F', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>4.8</span>
                <span style={{ fontSize: '16px', color: '#24452D' }}>★★★★★</span>
              </div>
              <div style={{ fontSize: '12px', color: '#73796F', marginTop: '2px' }}>
                Based on 64 verified customer purchases in Indiranagar
              </div>
            </div>

            {sampleReviews.map((rev) => (
              <div key={rev.id} style={{ border: '1px solid #E7EAE3', borderRadius: '16px', padding: '14px', backgroundColor: '#FFFFFF' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#20251F' }}>{rev.author}</span>
                  <span style={{ fontSize: '11px', color: '#24452D', fontWeight: 700 }}>{'★'.repeat(rev.rating)}</span>
                </div>
                <div style={{ fontSize: '11px', color: '#73796F', marginBottom: '8px' }}>{rev.date}</div>
                <p style={{ fontSize: '12px', color: '#20251F', lineHeight: 1.45, margin: '0 0 8px 0' }}>{rev.text}</p>
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {rev.tags.map((t, i) => (
                    <span key={i} style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#F0F3ED', color: '#24452D', padding: '2px 8px', borderRadius: '6px' }}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Button */}
      <div className="nivvo-sticky-footer-bar">
        <button 
          className="nivvo-primary-action-btn"
          onClick={handleAdd}
        >
          <span>
            Add to bag · ₹{selectedShop === 'urban-steps' ? '1,349' : prodData.price.toLocaleString('en-IN')}
          </span>
          <Plus size={18} strokeWidth={2.6} />
        </button>
      </div>

      {/* Size Guide Modal */}
      {showSizeGuide && (
        <div className="nivvo-modal-overlay" onClick={() => setShowSizeGuide(false)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
                Footwear Size Guide
              </h3>
              <button className="nivvo-modal-close-btn" onClick={() => setShowSizeGuide(false)}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#73796F', margin: '4px 0 16px 0' }}>
              True to Indian & UK sizing. If you wear half sizes, we recommend sizing up.
            </p>
            <div style={{ border: '1px solid #E7EAE3', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
              <table style={{ width: '100%', fontSize: '12px', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead style={{ backgroundColor: '#F7F8F5' }}>
                  <tr>
                    <th style={{ padding: '8px 12px' }}>UK Size</th>
                    <th style={{ padding: '8px 12px' }}>Foot Length (cm)</th>
                    <th style={{ padding: '8px 12px' }}>US Equivalent</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { uk: 'UK 6', cm: '24.5 cm', us: 'US 7' },
                    { uk: 'UK 7', cm: '25.4 cm', us: 'US 8' },
                    { uk: 'UK 8', cm: '26.2 cm', us: 'US 9 (Standard)' },
                    { uk: 'UK 9', cm: '27.1 cm', us: 'US 10' },
                    { uk: 'UK 10', cm: '27.9 cm', us: 'US 11' }
                  ].map(r => (
                    <tr key={r.uk} style={{ borderTop: '1px solid #E7EAE3' }}>
                      <td style={{ padding: '8px 12px', fontWeight: 700 }}>{r.uk}</td>
                      <td style={{ padding: '8px 12px', color: '#73796F' }}>{r.cm}</td>
                      <td style={{ padding: '8px 12px', color: '#20251F' }}>{r.us}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              onClick={() => setShowSizeGuide(false)}
              style={{ width: '100%', backgroundColor: '#20251F', color: '#FFFFFF', padding: '10px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', border: 'none', cursor: 'pointer' }}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
