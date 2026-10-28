import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  Clock, 
  ShoppingBag, 
  Layers, 
  Tag, 
  Check, 
  HeartHandshake, 
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  QrCode,
  Banknote,
  MapPin,
  Sparkles,
  Info
} from 'lucide-react';
import { FREQUENTLY_FORGOTTEN } from '../data/fashionData';
import { playAddSound, playClickSound, playOrderFanfare } from '../utils/audioEffects';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQuantity, 
  onRemoveItem, 
  onQuickAddForgotten, 
  onCheckout,
  doorstepTrialMaster,
  setDoorstepTrialMaster,
  selectedLocation,
  onOpenLocationModal
}) {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [selectedTip, setSelectedTip] = useState(30);
  const [showCouponsList, setShowCouponsList] = useState(false);

  if (!isOpen) return null;

  const itemTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const deliveryFee = itemTotal >= 499 ? 0 : 35;
  const packagingFee = 15;

  let discountAmount = 0;
  if (appliedCoupon === 'NIVVO100' || appliedCoupon === 'BLINKWEAR100') discountAmount = 100;
  else if (appliedCoupon === 'FESTIVE50') discountAmount = 50;
  else if (appliedCoupon === 'WELCOME20') discountAmount = Math.min(150, Math.round(itemTotal * 0.2));
  else if (appliedCoupon === 'FIRSTTRIAL') discountAmount = 50;

  const grandTotal = Math.max(0, itemTotal + deliveryFee + packagingFee + selectedTip - discountAmount);

  const AVAILABLE_COUPONS = [
    { code: 'NIVVO100', title: 'FLAT ₹100 OFF', desc: 'Valid on 10-minute wardrobe orders above ₹499', minOrder: 499 },
    { code: 'FESTIVE50', title: 'FESTIVE SAVER ₹50 OFF', desc: 'Instant ₹50 discount on all ethnic and casual wear', minOrder: 0 },
    { code: 'WELCOME20', title: '20% OFF (UP TO ₹150)', desc: 'Welcome bonus on your first 10-min wardrobe delivery', minOrder: 299 },
    { code: 'FIRSTTRIAL', title: 'FREE TRIAL + ₹50 OFF', desc: 'Doorstep 2-Size Trial guarantee with ₹50 wallet credit', minOrder: 0 }
  ];

  const applyCoupon = (code) => {
    playClickSound();
    const upper = code.trim().toUpperCase();
    const found = AVAILABLE_COUPONS.find(c => c.code === upper);
    if (found) {
      if (itemTotal < found.minOrder) {
        alert(`Minimum item total for ${found.code} is ₹${found.minOrder}. Current total: ₹${itemTotal}`);
        return;
      }
      setAppliedCoupon(upper);
      setCouponCode(upper);
      setShowCouponsList(false);
    } else {
      alert("Invalid coupon code. Try 'NIVVO100', 'FESTIVE50', or 'WELCOME20'");
    }
  };

  const handleCheckoutClick = () => {
    playClickSound();
    onCheckout({
      grandTotal,
      itemTotal,
      deliveryFee,
      packagingFee,
      items: cartItems,
      appliedCoupon,
      discountAmount,
      tip: selectedTip,
      doorstepTrialActive: doorstepTrialMaster
    });
  };

  return (
    <div className="cart-drawer-overlay" onClick={onClose}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cart-header">
          <div>
            <div className="cart-header-title">My Fashion Cart</div>
            <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
              {cartItems.length} items from Nearby Dark Store Hub
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* 10 Min Delivery Ticker with Address */}
        <div className="cart-eta-ticker">
          <Clock size={16} />
          <div style={{ flex: 1 }}>
            <span>Delivering in <strong>8 to 10 mins</strong> to:</span>
            <div style={{ fontSize: '11px', fontWeight: 600, opacity: 0.9 }}>
              {selectedLocation?.name || 'Indiranagar 100ft Road'}
            </div>
          </div>
          <button 
            onClick={() => { playClickSound(); if (onOpenLocationModal) onOpenLocationModal(); }}
            style={{ 
              background: '#FFFFFF', 
              color: '#0C831F', 
              border: 'none', 
              padding: '3px 8px', 
              borderRadius: '4px', 
              fontSize: '10.5px', 
              fontWeight: 800, 
              cursor: 'pointer' 
            }}
          >
            CHANGE
          </button>
        </div>

        {/* Body */}
        <div className="cart-body-scroll">
          {cartItems.length === 0 ? (
            <div className="empty-cart-view">
              <div className="empty-cart-icon">
                <ShoppingBag size={38} />
              </div>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>
                Your wardrobe cart is empty
              </h3>
              <p style={{ fontSize: '12px', color: '#6B7280', maxWidth: '240px', marginBottom: '20px' }}>
                Explore 10-minute emergency tees, shoes, slippers, crisp office shirts, or accessories.
              </p>
              <button 
                onClick={onClose}
                style={{
                  backgroundColor: '#0C831F',
                  color: '#FFFFFF',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '13px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Doorstep 2-Size Trial Master Banner */}
              <div className="doorstep-trial-box">
                <div className="doorstep-trial-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={16} />
                    <span>Doorstep 2-Size Trial (Active)</span>
                  </div>
                  <span style={{ 
                    backgroundColor: '#0C831F', 
                    color: '#FFFFFF', 
                    fontSize: '9px', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    fontWeight: 800 
                  }}>
                    FREE ₹0
                  </span>
                </div>
                <p className="doorstep-trial-body">
                  Our rider brings adjacent sizes for your clothing items. You have 3 minutes to try them on and hand back whichever doesn't fit!
                </p>
              </div>

              {/* Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="cart-item-card">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-size-badge">
                        Size: <strong>{item.selectedSize}</strong> • {item.brand || 'Nivvo'}
                      </div>
                      {item.trialSupported && (
                        <div className="cart-trial-pill">
                          <CheckCircle2 size={10} />
                          <span>2-Size Trial Included</span>
                        </div>
                      )}

                      <div className="cart-item-footer">
                        <span className="cart-item-price">₹{item.price * item.quantity}</span>
                        <div className="blink-counter-btn-group">
                          <button 
                            className="counter-btn"
                            onClick={() => {
                              playClickSound();
                              onUpdateQuantity(item.id, item.selectedSize, item.quantity - 1);
                            }}
                          >
                            <Minus size={12} strokeWidth={3} />
                          </button>
                          <span className="counter-value">{item.quantity}</span>
                          <button 
                            className="counter-btn"
                            onClick={() => {
                              playAddSound();
                              onUpdateQuantity(item.id, item.selectedSize, item.quantity + 1);
                            }}
                          >
                            <Plus size={12} strokeWidth={3} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Frequently Forgotten Emergency Items */}
              <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '12px', border: '1px solid #E5E7EB' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
                  Frequently Added with Fashion Orders
                </div>
                <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                  {FREQUENTLY_FORGOTTEN.map((acc) => (
                    <div 
                      key={acc.id}
                      style={{
                        minWidth: '130px',
                        maxWidth: '130px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '8px',
                        padding: '8px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <img src={acc.image} alt={acc.name} style={{ width: '100%', height: '70px', objectFit: 'cover', borderRadius: '6px', marginBottom: '6px' }} />
                      <div style={{ fontSize: '10px', fontWeight: 700, color: '#1E293B', lineHeight: 1.2, height: '24px', overflow: 'hidden' }}>
                        {acc.name}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0F172A' }}>₹{acc.price}</span>
                        <button 
                          onClick={() => {
                            playAddSound();
                            onQuickAddForgotten(acc);
                          }}
                          style={{
                            background: '#0C831F',
                            color: '#FFFFFF',
                            fontSize: '9px',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            border: 'none'
                          }}
                        >
                          + ADD
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promo / Coupon Box with 1-Tap List */}
              <div style={{ background: '#FFFFFF', borderRadius: '10px', padding: '12px', border: '1px solid #E5E7EB' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Tag size={15} color="#0C831F" />
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#111827' }}>Coupons & Offers</span>
                  </div>
                  <button 
                    onClick={() => setShowCouponsList(!showCouponsList)}
                    style={{ background: 'none', border: 'none', color: '#0C831F', fontSize: '11.5px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    {showCouponsList ? 'Hide Offers' : 'View Offers (4)'}
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <input 
                    type="text" 
                    placeholder="Enter Coupon (e.g. NIVVO100)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    style={{
                      flex: 1,
                      border: '1px solid #D1D5DB',
                      borderRadius: '6px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      textTransform: 'uppercase'
                    }}
                  />
                  <button 
                    onClick={() => applyCoupon(couponCode)}
                    style={{
                      background: '#111827',
                      color: '#FFFFFF',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: 'none'
                    }}
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div style={{ marginTop: '8px', fontSize: '11px', color: '#0C831F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Check size={12} /> Coupon <strong>{appliedCoupon}</strong> applied! You saved ₹{discountAmount}
                    <button 
                      onClick={() => { setAppliedCoupon(null); setCouponCode(''); }}
                      style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#DC2626', fontSize: '10px', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Remove
                    </button>
                  </div>
                )}

                {/* Available Coupons Accordion */}
                {showCouponsList && (
                  <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px dashed #E2E8F0', paddingTop: '10px' }}>
                    {AVAILABLE_COUPONS.map(c => (
                      <div 
                        key={c.code}
                        onClick={() => applyCoupon(c.code)}
                        style={{
                          background: appliedCoupon === c.code ? '#DCFCE7' : '#F8FAFC',
                          border: `1px solid ${appliedCoupon === c.code ? '#86EFAC' : '#E2E8F0'}`,
                          borderRadius: '8px',
                          padding: '8px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A' }}>
                            {c.code} • {c.title}
                          </div>
                          <div style={{ fontSize: '10.5px', color: '#64748B' }}>
                            {c.desc}
                          </div>
                        </div>
                        <button 
                          style={{
                            background: appliedCoupon === c.code ? '#0C831F' : '#FFFFFF',
                            color: appliedCoupon === c.code ? '#FFFFFF' : '#0C831F',
                            border: `1px solid ${appliedCoupon === c.code ? '#0C831F' : '#0C831F'}`,
                            fontSize: '10.5px',
                            fontWeight: 800,
                            padding: '3px 10px',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          {appliedCoupon === c.code ? 'APPLIED' : 'APPLY'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Rider Tip Section */}
              <div className="tip-section">
                <div className="tip-title">
                  <HeartHandshake size={16} color="#0C831F" />
                  <span>Tip your 10-Min Delivery Partner</span>
                </div>
                <p style={{ fontSize: '11px', color: '#6B7280', marginBottom: '8px' }}>
                  100% of the tip goes directly to your rider who rushes your wardrobe to you.
                </p>
                <div className="tip-options-row">
                  {[0, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      className={`tip-chip ${selectedTip === amount ? 'active' : ''}`}
                      onClick={() => { playClickSound(); setSelectedTip(amount); }}
                    >
                      {amount === 0 ? 'No tip' : `₹${amount}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Details */}
              <div className="cart-bill-card">
                <div className="bill-title">Bill Breakdown</div>
                <div className="bill-row">
                  <span>Item Total</span>
                  <span>₹{itemTotal}</span>
                </div>
                <div className="bill-row highlight-green">
                  <span>Doorstep 2-Size Trial Service</span>
                  <span>FREE</span>
                </div>
                <div className="bill-row">
                  <span>Delivery Partner Fee</span>
                  <span>{deliveryFee === 0 ? <strong style={{ color: '#0C831F' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="bill-row">
                  <span>Garment Steaming & Hanger Pack</span>
                  <span>₹{packagingFee}</span>
                </div>
                {selectedTip > 0 && (
                  <div className="bill-row">
                    <span>Delivery Partner Tip</span>
                    <span>₹{selectedTip}</span>
                  </div>
                )}
                {discountAmount > 0 && (
                  <div className="bill-row highlight-green">
                    <span>Coupon Discount ({appliedCoupon})</span>
                    <span>-₹{discountAmount}</span>
                  </div>
                )}
                <div className="bill-total-row">
                  <span>To Pay</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Checkout CTA */}
        {cartItems.length > 0 && (
          <div className="cart-footer">
            <button 
              className="checkout-btn"
              onClick={handleCheckoutClick}
              id="proceed-checkout-btn"
            >
              <div>
                <div style={{ fontSize: '11px', opacity: 0.9 }}>TOTAL TO PAY</div>
                <div style={{ fontSize: '18px', fontWeight: 900 }}>₹{grandTotal}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>Proceed to Pay</span>
                <ChevronRight size={18} />
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
