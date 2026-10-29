import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowLeft, ShoppingBag, MapPin, Plus, Minus, ArrowRight, 
  Trash2, Tag, Check, Sparkles, Clock, ShieldCheck, 
  ChevronRight, CheckCircle2, Bell, Shield, PhoneOff, Home
} from 'lucide-react';
import { playClickSound, playTrialSound, playAddSound } from '../../utils/audioEffects';

export default function NivvoBagView({
  onBack,
  onProceedToCheckout
}) {
  const { 
    cart, 
    updateCartQuantity, 
    clearCart,
    cartSubtotal, 
    cartDeliveryFee, 
    cartPlatformFee, 
    discountAmount, 
    cartTotal, 
    totalCartCount,
    selectedAddress,
    appliedCoupon,
    removeCoupon,
    setActiveModal,
    navigateTo,
    showToast,
    currentUser,
    setAuthModalOpen,
    setAuthModalRole
  } = useNivvo();

  const safeNum = (v, fallback = 0) => {
    if (typeof v === 'number') return isNaN(v) ? fallback : v;
    if (!v) return fallback;
    const n = parseFloat(String(v).replace(/[^0-9.]/g, ''));
    return isNaN(n) ? fallback : n;
  };

  // Free delivery threshold: ₹200 or more
  const FREE_DELIVERY_THRESHOLD = 200;
  const subtotal = safeNum(cartSubtotal, 0);
  const isFreeDelivery = subtotal >= FREE_DELIVERY_THRESHOLD;
  const amountNeeded = Math.max(0, FREE_DELIVERY_THRESHOLD - subtotal);
  const deliveryProgress = Math.min(100, Math.round((subtotal / FREE_DELIVERY_THRESHOLD) * 100));

  // Doorstep Trial Opt-in
  const [doorstepTrialEnabled, setDoorstepTrialEnabled] = useState(true);

  // Delivery Instructions with clean icons
  const [selectedInstruction, setSelectedInstruction] = useState('door');
  const deliveryInstructions = [
    { id: 'door', label: 'Leave at Door', icon: Home },
    { id: 'bell', label: 'Ring Bell', icon: Bell },
    { id: 'guard', label: 'Leave with Guard', icon: Shield },
    { id: 'nocall', label: 'Do Not Call', icon: PhoneOff }
  ];

  // Group unique shops in cart
  const uniqueShops = [...new Set(cart.map(item => item.shopName))];

  return (
    <div className="nivvo-bag-screen" style={{ position: 'relative', minHeight: '100%', paddingBottom: '100px' }}>
      {/* Header */}
      <div className="nivvo-nav-header" style={{ position: 'sticky', top: 0, zIndex: 60, backgroundColor: '#FFFFFF' }}>
        <div className="nivvo-nav-header-left">
          <button 
            className="nivvo-back-btn" 
            onClick={() => { playClickSound(); onBack ? onBack() : window.history.back(); }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="nivvo-nav-header-title">Your Bag</div>
            <div className="nivvo-nav-header-subtitle">
              {totalCartCount === 0 
                ? '0 items added' 
                : `${totalCartCount} item${totalCartCount > 1 ? 's' : ''} · ${uniqueShops.length} local store${uniqueShops.length > 1 ? 's' : ''}`}
            </div>
          </div>
        </div>
        
        {cart.length > 0 && (
          <button 
            onClick={() => {
              playClickSound();
              if (window.confirm('Empty all items from your bag?')) {
                clearCart();
                showToast('Bag cleared');
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#BD3838',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '6px'
            }}
          >
            <Trash2 size={13} />
            <span>Clear</span>
          </button>
        )}
      </div>

      <div style={{ padding: '14px 18px' }}>
        {/* Delivering To Address Card */}
        <div 
          onClick={() => { playClickSound(); setActiveModal('location'); }}
          style={{
            border: '1px solid #E7EAE3',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '14px',
            backgroundColor: '#FFFFFF',
            cursor: 'pointer',
            transition: 'border-color 0.15s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#F7F8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <MapPin size={16} color="#24452D" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#20251F' }}>
                  {selectedAddress.title}
                </span>
                <span style={{
                  backgroundColor: '#F0F3ED',
                  color: '#24452D',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: 700
                }}>
                  {selectedAddress.tag}
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#73796F', marginTop: '1px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedAddress.street}
              </div>
            </div>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#24452D', flexShrink: 0, marginLeft: '8px' }}>
            Change
          </span>
        </div>

        {/* Empty Bag State */}
        {cart.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E7EAE3',
            borderRadius: '20px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#F7F8F5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px auto'
            }}>
              <ShoppingBag size={28} color="#73796F" />
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#20251F', margin: '0 0 6px 0' }}>
              Your bag is currently empty
            </h3>
            <p style={{ fontSize: '12px', color: '#73796F', margin: '0 auto 20px auto', maxWidth: '280px', lineHeight: 1.45 }}>
              Explore sneakers, fashion, and tech accessories from verified shops near you in Indiranagar.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button
                onClick={() => { playClickSound(); navigateTo('categories'); }}
                style={{
                  backgroundColor: '#20251F',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Browse Categories
              </button>
              <button
                onClick={() => { playClickSound(); navigateTo('shops'); }}
                style={{
                  backgroundColor: '#F7F8F5',
                  color: '#20251F',
                  border: '1px solid #E7EAE3',
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Explore 42 Stores
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* 1. Free Delivery Milestone Card */}
            <div style={{
              backgroundColor: isFreeDelivery ? '#EEF4EC' : '#F7F8F5',
              border: isFreeDelivery ? '1px solid #C4D9BC' : '1px solid #E7EAE3',
              borderRadius: '14px',
              padding: '12px 14px',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>
                  {isFreeDelivery ? (
                    <span style={{ color: '#238636', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <CheckCircle2 size={14} />
                      FREE Delivery Unlocked
                    </span>
                  ) : (
                    <span>Add ₹{amountNeeded.toLocaleString('en-IN')} more for <strong>FREE Delivery</strong></span>
                  )}
                </span>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#73796F' }}>
                  Threshold: ₹{FREE_DELIVERY_THRESHOLD}
                </span>
              </div>

              {/* Progress Bar */}
              <div style={{
                width: '100%',
                height: '5px',
                backgroundColor: 'rgba(0,0,0,0.06)',
                borderRadius: '3px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${deliveryProgress}%`,
                  height: '100%',
                  backgroundColor: isFreeDelivery ? '#238636' : '#24452D',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {/* 2. Cart Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '14px' }}>
              {cart.map((item) => (
                <div 
                  key={item.id}
                  style={{
                    border: '1px solid #E7EAE3',
                    borderRadius: '14px',
                    padding: '14px',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#20251F' }}>{item.shopName}</span>
                    <span style={{
                      backgroundColor: '#F0F3ED',
                      padding: '3px 7px',
                      borderRadius: '5px',
                      fontSize: '10px',
                      fontWeight: 700,
                      color: '#24452D',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Clock size={10} />
                      <span>{item.eta || '12–18 min'}</span>
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{ width: '64px', height: '64px', borderRadius: '10px', objectFit: 'cover', backgroundColor: '#EAECE6' }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#20251F', lineHeight: 1.3 }}>{item.name}</div>
                      <div style={{ fontSize: '11px', color: '#73796F', margin: '2px 0 6px 0' }}>
                        {item.variant} · Qty {item.quantity}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
                          <span style={{ fontSize: '15px', fontWeight: 800, color: '#20251F' }}>
                            ₹{(safeNum(item.price, 1299) * (Number(item.quantity) || 1)).toLocaleString('en-IN')}
                          </span>
                          {item.originalPrice && (
                            <span style={{ fontSize: '11px', color: '#73796F', textDecoration: 'line-through' }}>
                              ₹{(safeNum(item.originalPrice, Math.round(safeNum(item.price, 1299) * 1.25)) * (Number(item.quantity) || 1)).toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        
                        {/* Quantity Counter */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 700 }}>
                          <button 
                            onClick={() => updateCartQuantity(item.id, -1)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '7px',
                              border: '1px solid #E7EAE3',
                              backgroundColor: '#F7F8F5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            aria-label="Decrease quantity"
                          >
                            {item.quantity === 1 ? <Trash2 size={12} color="#BD3838" /> : <Minus size={12} />}
                          </button>
                          <span style={{ minWidth: '16px', textAlign: 'center' }}>{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.id, 1)}
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '7px',
                              border: '1px solid #E7EAE3',
                              backgroundColor: '#F7F8F5',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer'
                            }}
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* 3. Doorstep Trial Opt-In Switch */}
            <div style={{
              backgroundColor: '#EEF4EC',
              border: '1px solid #C4D9BC',
              borderRadius: '14px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '14px'
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '9px',
                  backgroundColor: '#24452D',
                  color: '#B7F34A',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Sparkles size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#24452D' }}>
                    10-Minute Doorstep Trial (Free)
                  </div>
                  <div style={{ fontSize: '11px', color: '#5B6858', lineHeight: 1.4, marginTop: '2px' }}>
                    Partner waits 10 minutes at your door. Keep what fits, return the rest on the spot.
                  </div>
                </div>
              </div>

              <label style={{ position: 'relative', display: 'inline-block', width: '40px', height: '22px', flexShrink: 0, cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={doorstepTrialEnabled}
                  onChange={(e) => {
                    playTrialSound();
                    setDoorstepTrialEnabled(e.target.checked);
                    showToast(e.target.checked ? 'Doorstep Trial enabled' : 'Doorstep Trial disabled');
                  }}
                  style={{ opacity: 0, width: 0, height: 0 }}
                />
                <span style={{
                  position: 'absolute',
                  cursor: 'pointer',
                  top: 0, left: 0, right: 0, bottom: 0,
                  backgroundColor: doorstepTrialEnabled ? '#24452D' : '#D1D5DB',
                  borderRadius: '22px',
                  transition: '0.2s'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '',
                    height: '16px',
                    width: '16px',
                    left: doorstepTrialEnabled ? '21px' : '3px',
                    bottom: '3px',
                    backgroundColor: doorstepTrialEnabled ? '#B7F34A' : '#FFFFFF',
                    borderRadius: '50%',
                    transition: '0.2s'
                  }} />
                </span>
              </label>
            </div>

            {/* 4. Delivery Instructions */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#20251F', marginBottom: '8px' }}>
                Delivery Instructions
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {deliveryInstructions.map((inst) => {
                  const InstIcon = inst.icon;
                  const isSelected = selectedInstruction === inst.id;
                  return (
                    <button
                      key={inst.id}
                      onClick={() => {
                        playClickSound();
                        setSelectedInstruction(inst.id);
                        showToast(`Instruction saved: ${inst.label}`);
                      }}
                      style={{
                        border: isSelected ? '1.5px solid #24452D' : '1px solid #E7EAE3',
                        backgroundColor: isSelected ? '#F0F3ED' : '#FFFFFF',
                        color: isSelected ? '#24452D' : '#20251F',
                        padding: '8px 12px',
                        borderRadius: '10px',
                        fontSize: '11px',
                        fontWeight: isSelected ? 800 : 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <InstIcon size={13} color={isSelected ? '#24452D' : '#73796F'} />
                      <span>{inst.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Coupon Voucher Row */}
            <div 
              style={{
                border: '1px dashed #D4DEC8',
                borderRadius: '12px',
                padding: '11px 14px',
                backgroundColor: appliedCoupon ? '#EEF4EC' : '#FFFFFF',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Tag size={15} color={appliedCoupon ? '#24452D' : '#73796F'} />
                {appliedCoupon ? (
                  <div>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#24452D' }}>
                      {appliedCoupon.code} applied
                    </span>
                    <span style={{ fontSize: '11px', color: '#687163', marginLeft: '6px' }}>
                      (-₹{discountAmount})
                    </span>
                  </div>
                ) : (
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#20251F' }}>
                    Have a coupon code?
                  </span>
                )}
              </div>

              {appliedCoupon ? (
                <button
                  onClick={removeCoupon}
                  style={{ background: 'none', border: 'none', color: '#BD3838', fontSize: '11px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => setActiveModal('coupon')}
                  style={{ background: 'none', border: 'none', color: '#24452D', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                >
                  Apply Code +
                </button>
              )}
            </div>

            {/* 6. Price Details Card */}
            <div style={{
              border: '1px solid #E7EAE3',
              borderRadius: '14px',
              padding: '14px 16px',
              backgroundColor: '#FFFFFF',
              marginBottom: '14px'
            }}>
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#20251F', margin: '0 0 12px 0' }}>
                Price Details
              </h3>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: '#73796F' }}>
                <span>Item Total ({totalCartCount} item{totalCartCount > 1 ? 's' : ''})</span>
                <span style={{ color: '#20251F', fontWeight: 600 }}>₹{safeNum(cartSubtotal, 0).toLocaleString('en-IN')}</span>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: '#73796F' }}>
                <span>Delivery ({uniqueShops.length} pickup{uniqueShops.length > 1 ? 's' : ''})</span>
                <span style={{ color: '#20251F', fontWeight: 600 }}>
                  {isFreeDelivery ? <span style={{ color: '#238636', fontWeight: 800 }}>FREE</span> : `₹${safeNum(cartDeliveryFee, 0)}`}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: '#73796F' }}>
                <span>Platform Fee</span>
                <span style={{ color: '#20251F', fontWeight: 600 }}>₹{safeNum(cartPlatformFee, 9)}</span>
              </div>

              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px', color: '#238636' }}>
                  <span>Coupon Discount ({appliedCoupon?.code})</span>
                  <span style={{ fontWeight: 800 }}>-₹{safeNum(discountAmount, 0)}</span>
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '12px', color: '#73796F' }}>
                <span>10-Min Doorstep Trial</span>
                <span style={{ color: '#238636', fontWeight: 800 }}>FREE</span>
              </div>

              <div style={{ borderTop: '1px solid #E7EAE3', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#20251F', display: 'block' }}>Total Payable</span>
                  <span style={{ fontSize: '11px', color: '#73796F' }}>Inclusive of all taxes</span>
                </div>
                <span style={{ fontSize: '18px', fontWeight: 900, color: '#20251F' }}>
                  ₹{safeNum(cartTotal, 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Quick Link to Add More Items */}
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <button
                onClick={() => { playClickSound(); navigateTo('categories'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#24452D',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>+ Add more items from Indiranagar</span>
                <ChevronRight size={13} />
              </button>
            </div>

            {/* Trust Reassurance Note */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: '6px', 
              fontSize: '11px', 
              color: '#73796F',
              textAlign: 'center' 
            }}>
              <ShieldCheck size={14} color="#24452D" />
              <span>Verified local shelf stock · Official tax invoices provided</span>
            </div>
          </>
        )}
      </div>

      {/* Sticky Bottom Checkout Action */}
      {cart.length > 0 && (
        <div className="nivvo-sticky-footer-bar">
          <button 
            className="nivvo-primary-action-btn"
            onClick={() => {
              playClickSound();
              if (!currentUser) {
                setAuthModalRole('customer');
                setAuthModalOpen(true);
                showToast('Please sign in to proceed to checkout');
                return;
              }
              if (onProceedToCheckout) onProceedToCheckout();
              else navigateTo('checkout');
            }}
          >
            <span>Proceed to Checkout · ₹{safeNum(cartTotal, 0).toLocaleString('en-IN')}</span>
            <ArrowRight size={17} />
          </button>
        </div>
      )}
    </div>
  );
}
