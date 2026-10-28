import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowLeft, Clock, Lock, CreditCard, Banknote, 
  ShieldCheck, MapPin, Check, ChevronRight
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';

export default function NivvoCheckoutView({
  onBack,
  onPaymentSuccess
}) {
  const { 
    cart, 
    cartSubtotal, 
    cartDeliveryFee, 
    cartPlatformFee, 
    discountAmount, 
    cartTotal, 
    totalCartCount,
    selectedAddress,
    setActiveModal,
    placeOrder,
    navigateTo,
    currentUser,
    setAuthModalOpen,
    setAuthModalRole,
    showToast
  } = useNivvo();

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('aarav.shah@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePay = () => {
    if (isProcessing) return;
    if (!currentUser) {
      setAuthModalRole('customer');
      setAuthModalOpen(true);
      showToast('Please sign in to complete payment');
      return;
    }
    playTrialSound();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      const methodLabel = paymentMethod === 'upi' 
        ? `UPI (${upiId})` 
        : (paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery');
      placeOrder(methodLabel);
      if (onPaymentSuccess) onPaymentSuccess();
      else navigateTo('tracking');
    }, 1200);
  };

  return (
    <div className="nivvo-checkout-screen" style={{ position: 'relative', minHeight: '100%', paddingBottom: '105px', backgroundColor: '#F8F9F6' }}>
      
      {/* ─── Header ─── */}
      <div className="nivvo-nav-header" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E5E7DE', position: 'sticky', top: 0, zIndex: 60 }}>
        <div className="nivvo-nav-header-left" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button 
            className="nivvo-back-btn" 
            onClick={() => { playClickSound(); onBack ? onBack() : navigateTo('bag'); }} 
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="nivvo-nav-header-title" style={{ fontSize: '18px', fontWeight: 800, color: '#14281C' }}>
            Checkout
          </div>
        </div>
      </div>

      <div style={{ padding: '16px', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* ─── 1. Delivery Address ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <MapPin size={15} color="#1F4230" />
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>
                Delivery Address
              </span>
              {selectedAddress?.title && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: '#EEF2E8',
                  color: '#1F4230',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {selectedAddress.title}
                </span>
              )}
            </div>
            <button 
              onClick={() => { playClickSound(); setActiveModal('location'); }}
              style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 700, color: '#1F4230', cursor: 'pointer', padding: 0 }}
            >
              Change
            </button>
          </div>

          <div style={{ fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '2px' }}>
            {currentUser?.name || selectedAddress?.recipient || 'Aarav Shah'} · {currentUser?.phone || selectedAddress?.phone || '+91 98765 43210'}
          </div>
          
          <div style={{ fontSize: '12px', color: '#687163', lineHeight: 1.4 }}>
            {selectedAddress?.street || '12th Main Road, HAL 2nd Stage'}, {selectedAddress?.city || 'Bengaluru'}
          </div>

          {selectedAddress?.note && (
            <div style={{ fontSize: '11px', color: '#687163', backgroundColor: '#F4F5EE', padding: '6px 10px', borderRadius: '8px', marginTop: '8px' }}>
              Note: {selectedAddress.note}
            </div>
          )}
        </div>

        {/* ─── 2. Delivery ETA ─── */}
        <div style={{
          backgroundColor: '#F0F4EE',
          border: '1px solid #DCE6D5',
          borderRadius: '14px',
          padding: '12px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1F4230',
              color: '#C6F432',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Clock size={16} />
            </div>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#1F4230' }}>
              Delivery in 20–30 mins
            </span>
          </div>
          <span style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#15803D',
            backgroundColor: '#DCFCE7',
            padding: '3px 8px',
            borderRadius: '999px'
          }}>
            Fast Dispatch
          </span>
        </div>

        {/* ─── 3. Order Items ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>
              Items ({totalCartCount})
            </span>
            <button 
              onClick={() => { playClickSound(); navigateTo('bag'); }}
              style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 700, color: '#1F4230', cursor: 'pointer', padding: 0 }}
            >
              Edit
            </button>
          </div>

          {cart.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px 0', fontSize: '12px', color: '#687163' }}>
              Bag is empty
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cart.map((item) => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                    {(item.image || item.images?.[0]) ? (
                      <img 
                        src={item.image || item.images[0]} 
                        alt={item.name}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          objectFit: 'cover',
                          backgroundColor: '#F4F5EE',
                          border: '1px solid #E5E7DE',
                          flexShrink: 0
                        }} 
                      />
                    ) : (
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '8px',
                        backgroundColor: '#F4F5EE',
                        border: '1px solid #E5E7DE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#687163',
                        flexShrink: 0
                      }}>
                        {item.size || 'M'}
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#14281C', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#687163', marginTop: '1px' }}>
                        Size: {item.size} · Qty: {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C', flexShrink: 0 }}>
                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ─── 4. Payment Method ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C', marginBottom: '10px' }}>
            Payment Method
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {/* UPI */}
            <div 
              onClick={() => { playClickSound(); setPaymentMethod('upi'); }}
              style={{
                border: paymentMethod === 'upi' ? '1.5px solid #1F4230' : '1px solid #E5E7DE',
                borderRadius: '12px',
                padding: '12px 14px',
                backgroundColor: paymentMethod === 'upi' ? '#F7F8F5' : '#FFFFFF',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: paymentMethod === 'upi' ? '5px solid #1F4230' : '1.5px solid #CBD5E1',
                    backgroundColor: '#FFFFFF',
                    flexShrink: 0
                  }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>UPI</span>
                </div>
                <span style={{ fontSize: '11px', color: '#687163' }}>Google Pay, PhonePe, Paytm</span>
              </div>

              {paymentMethod === 'upi' && (
                <div style={{ paddingLeft: '26px', marginTop: '8px' }}>
                  <input 
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    placeholder="Enter UPI ID"
                    style={{
                      border: '1px solid #E5E7DE',
                      borderRadius: '8px',
                      padding: '6px 10px',
                      fontSize: '12px',
                      color: '#14281C',
                      width: '100%',
                      maxWidth: '240px',
                      backgroundColor: '#FFFFFF',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Credit / Debit Card */}
            <div 
              onClick={() => { playClickSound(); setPaymentMethod('card'); }}
              style={{
                border: paymentMethod === 'card' ? '1.5px solid #1F4230' : '1px solid #E5E7DE',
                borderRadius: '12px',
                padding: '12px 14px',
                backgroundColor: paymentMethod === 'card' ? '#F7F8F5' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: paymentMethod === 'card' ? '5px solid #1F4230' : '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  flexShrink: 0
                }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>Card</span>
              </div>
              <CreditCard size={16} color="#687163" />
            </div>

            {/* Cash on Delivery */}
            <div 
              onClick={() => { playClickSound(); setPaymentMethod('cod'); }}
              style={{
                border: paymentMethod === 'cod' ? '1.5px solid #1F4230' : '1px solid #E5E7DE',
                borderRadius: '12px',
                padding: '12px 14px',
                backgroundColor: paymentMethod === 'cod' ? '#F7F8F5' : '#FFFFFF',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: paymentMethod === 'cod' ? '5px solid #1F4230' : '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  flexShrink: 0
                }} />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>Cash on Delivery</span>
              </div>
              <Banknote size={16} color="#687163" />
            </div>
          </div>
        </div>

        {/* ─── 5. Bill Details ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C', marginBottom: '10px' }}>
            Bill Details
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#687163' }}>
            <span>Item total</span>
            <span style={{ color: '#14281C', fontWeight: 600 }}>₹{cartSubtotal.toLocaleString('en-IN')}</span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#687163' }}>
            <span>Delivery fee</span>
            <span style={{ color: cartDeliveryFee === 0 ? '#15803D' : '#14281C', fontWeight: 600 }}>
              {cartDeliveryFee === 0 ? 'FREE' : `₹${cartDeliveryFee}`}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#687163' }}>
            <span>Platform fee</span>
            <span style={{ color: '#14281C', fontWeight: 600 }}>₹{cartPlatformFee}</span>
          </div>

          {discountAmount > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: '#15803D' }}>
              <span>Discount</span>
              <span style={{ fontWeight: 700 }}>-₹{discountAmount}</span>
            </div>
          )}

          <div style={{ borderTop: '1px solid #E5E7DE', paddingTop: '10px', marginTop: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>To Pay</span>
            <span style={{ fontSize: '17px', fontWeight: 900, color: '#14281C' }}>
              ₹{cartTotal.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

      </div>

      {/* ─── Sticky Bottom Bar ─── */}
      <div className="nivvo-sticky-footer-bar" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E5E7DE', padding: '12px 16px' }}>
        <button 
          className="nivvo-primary-action-btn"
          onClick={handlePay}
          disabled={isProcessing}
          style={{ opacity: isProcessing ? 0.8 : 1 }}
        >
          {isProcessing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="nivvo-spinner" style={{ width: '16px', height: '16px', border: '2px solid #20251F', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.6s linear infinite' }} />
              <span>Processing...</span>
            </div>
          ) : (
            <>
              <span>Pay ₹{cartTotal.toLocaleString('en-IN')}</span>
              <Lock size={15} />
            </>
          )}
        </button>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#687163', marginTop: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
          <ShieldCheck size={13} color="#15803D" />
          <span>Secure SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}
