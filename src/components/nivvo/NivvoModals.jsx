import React, { useState, useEffect, useRef } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  X, Check, MapPin, Tag, Phone, PhoneOff, Mic, MicOff, Volume2, 
  Send, Sparkles, AlertCircle, Plus, Copy, ShieldCheck, ArrowRight,
  UploadCloud, Image as ImageIcon, Trash2, Star, CheckCircle2
} from 'lucide-react';
import { playClickSound, playTrialSound, playAddSound } from '../../utils/audioEffects';
import RiderThreeDotMenuModal from './RiderThreeDotMenuModal';
import CustomerThreeDotMenuModal from './CustomerThreeDotMenuModal';


// ============================================================================
// 1. LOCATION PICKER MODAL
// ============================================================================
export function LocationPickerModal() {
  const { activeModal, setActiveModal, savedAddresses, selectedAddress, setSelectedAddress, showToast } = useNivvo();
  const [customAddress, setCustomAddress] = useState('');

  if (activeModal !== 'location') return null;

  const handleSelect = (addr) => {
    playClickSound();
    setSelectedAddress(addr);
    showToast(`Delivering to ${addr.title}`);
    setActiveModal(null);
  };

  const handleCustomAdd = (e) => {
    e.preventDefault();
    if (!customAddress.trim()) return;
    const newAddr = {
      id: `addr-${Date.now()}`,
      tag: 'Other',
      title: customAddress.trim().split(',')[0] || 'Custom Location',
      area: customAddress.trim().split(',')[1] || 'Bengaluru',
      street: customAddress.trim(),
      city: 'Bengaluru',
      phone: '+91 98765 43210',
      recipient: 'Aarav Shah',
      note: 'Deliver at door',
      etaModifier: 5
    };
    setSelectedAddress(newAddr);
    showToast(`Address set to ${newAddr.title}`);
    setActiveModal(null);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#24452D" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Choose delivery location
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#73796F', margin: '4px 0 16px 0' }}>
          Select a saved neighbourhood to update local shop listings and precise delivery times.
        </p>

        {/* Saved Addresses List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          {savedAddresses.map((addr) => {
            const isSelected = selectedAddress.id === addr.id;
            return (
              <div
                key={addr.id}
                onClick={() => handleSelect(addr)}
                style={{
                  border: isSelected ? '2px solid #20251F' : '1px solid #E7EAE3',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  backgroundColor: isSelected ? '#F7F8F5' : '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.15s ease'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '14px', fontWeight: 700, color: '#20251F' }}>
                      {addr.title}
                    </span>
                    <span style={{
                      backgroundColor: '#EEF2E8',
                      color: '#24452D',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {addr.tag}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#73796F', lineHeight: 1.35 }}>
                    {addr.street}, {addr.city}
                  </div>
                </div>
                {isSelected && (
                  <div style={{ width: '22px', height: '22px', borderRadius: '50%', backgroundColor: '#20251F', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Check size={13} strokeWidth={3} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Enter new address */}
        <form onSubmit={handleCustomAdd} style={{ marginTop: '8px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F', marginBottom: '6px' }}>
            Add another location
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              placeholder="e.g. 100 Feet Road, Indiranagar, Bengaluru"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              style={{
                flex: 1,
                border: '1px solid #E7EAE3',
                borderRadius: '10px',
                padding: '10px 12px',
                fontSize: '13px',
                backgroundColor: '#F7F8F5'
              }}
            />
            <button
              type="submit"
              disabled={!customAddress.trim()}
              style={{
                backgroundColor: customAddress.trim() ? '#20251F' : '#E7EAE3',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '0 16px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: customAddress.trim() ? 'pointer' : 'default'
              }}
            >
              Set
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 2. COUPON DRAWER MODAL
// ============================================================================
export function CouponDrawerModal() {
  const { activeModal, setActiveModal, applyCouponCode, appliedCoupon, removeCoupon } = useNivvo();
  const [inputCode, setInputCode] = useState('');

  if (activeModal !== 'coupon') return null;

  const coupons = [
    { code: 'NIVVO50', title: '₹50 Instant Discount', desc: 'Valid on any order above ₹499 from neighbourhood shops', badge: 'POPULAR' },
    { code: 'LOCAL10', title: '10% Local Retail Support', desc: 'Save 10% on sneakers, fashion & tech accessories', badge: 'SPECIAL' },
    { code: 'FREEDEL', title: 'Free Hyperlocal Delivery', desc: 'Zero delivery fee on multi-pickup orders', badge: 'BEST VALUE' }
  ];

  const handleApply = (code) => {
    playTrialSound();
    applyCouponCode(code);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={20} color="#24452D" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Apply Coupon
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        {/* Input Form */}
        <div style={{ display: 'flex', gap: '8px', margin: '16px 0 20px 0' }}>
          <input
            type="text"
            placeholder="Enter promo code (e.g. NIVVO50)"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value.toUpperCase())}
            style={{
              flex: 1,
              border: '1.5px solid #20251F',
              borderRadius: '12px',
              padding: '12px 14px',
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          />
          <button
            onClick={() => handleApply(inputCode)}
            disabled={!inputCode.trim()}
            style={{
              backgroundColor: '#B7F34A',
              color: '#20251F',
              border: 'none',
              borderRadius: '12px',
              padding: '0 20px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: inputCode.trim() ? 'pointer' : 'default',
              opacity: inputCode.trim() ? 1 : 0.6
            }}
          >
            Apply
          </button>
        </div>

        {/* Active Coupon notification */}
        {appliedCoupon && (
          <div style={{
            backgroundColor: '#EEF4EC',
            border: '1px solid #D4DEC8',
            borderRadius: '12px',
            padding: '12px 14px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#24452D' }}>
                ✓ {appliedCoupon.code} applied
              </div>
              <div style={{ fontSize: '11px', color: '#687163' }}>
                {appliedCoupon.desc}
              </div>
            </div>
            <button
              onClick={removeCoupon}
              style={{
                background: 'none',
                border: 'none',
                color: '#BD3838',
                fontWeight: 700,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Remove
            </button>
          </div>
        )}

        {/* Available coupons */}
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F', marginBottom: '10px' }}>
          Available Offers
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {coupons.map((c) => {
            const isCurrent = appliedCoupon?.code === c.code;
            return (
              <div
                key={c.code}
                style={{
                  border: isCurrent ? '2px solid #238636' : '1px solid #E7EAE3',
                  borderRadius: '14px',
                  padding: '14px 16px',
                  backgroundColor: '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{
                      backgroundColor: '#20251F',
                      color: '#FFFFFF',
                      fontSize: '12px',
                      fontWeight: 800,
                      padding: '4px 8px',
                      borderRadius: '6px',
                      letterSpacing: '0.05em'
                    }}>
                      {c.code}
                    </span>
                    <span style={{ fontSize: '10px', color: '#238636', fontWeight: 700 }}>
                      {c.badge}
                    </span>
                  </div>
                  <button
                    onClick={() => handleApply(c.code)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: isCurrent ? '#238636' : '#20251F',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {isCurrent ? 'Applied ✓' : 'Apply +'}
                  </button>
                </div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F', marginBottom: '2px' }}>
                  {c.title}
                </div>
                <div style={{ fontSize: '11px', color: '#73796F' }}>
                  {c.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. RIDER CALL MODAL (Simulated In-App Call with Ravi Kumar)
// ============================================================================
export function RiderCallModal() {
  const { activeModal, setActiveModal, showToast } = useNivvo();
  const [callTime, setCallTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);

  useEffect(() => {
    let timer;
    if (activeModal === 'call') {
      timer = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    } else {
      setCallTime(0);
    }
    return () => clearInterval(timer);
  }, [activeModal]);

  if (activeModal !== 'call') return null;

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remaining = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    playClickSound();
    setActiveModal(null);
    showToast('Call ended with Ravi Kumar');
  };

  return (
    <div className="nivvo-modal-overlay" style={{ backgroundColor: 'rgba(20, 25, 20, 0.88)' }}>
      <div style={{
        width: '100%',
        maxWidth: '380px',
        backgroundColor: '#1E251E',
        borderRadius: '28px',
        padding: '36px 24px',
        color: '#FFFFFF',
        textAlign: 'center',
        boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        margin: 'auto'
      }}>
        <div style={{ fontSize: '12px', color: '#B7F34A', fontWeight: 700, letterSpacing: '0.08em', marginBottom: '16px' }}>
          NIVVO HYPERLOCAL SECURE CALL
        </div>

        {/* Avatar */}
        <div style={{
          width: '84px',
          height: '84px',
          borderRadius: '50%',
          backgroundColor: '#24452D',
          border: '4px solid #B7F34A',
          margin: '0 auto 16px auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '28px',
          fontWeight: 700,
          color: '#FFFFFF'
        }}>
          RK
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 4px 0' }}>
          Ravi Kumar
        </h2>
        <div style={{ fontSize: '13px', color: '#A0ABA0', marginBottom: '8px' }}>
          Delivery Partner · Order NV-1048
        </div>
        <div style={{ fontSize: '15px', color: '#B7F34A', fontFamily: 'monospace', fontWeight: 700, marginBottom: '32px' }}>
          {formatTime(callTime)}
        </div>

        {/* Quick Simulated Response Audio Visualizer */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', height: '24px', alignItems: 'center', marginBottom: '32px' }}>
          {[12, 24, 16, 28, 20, 10, 26, 14].map((h, i) => (
            <div 
              key={i} 
              style={{
                width: '4px',
                height: `${h}px`,
                backgroundColor: '#B7F34A',
                borderRadius: '2px',
                animation: 'pulse 1s infinite alternate'
              }} 
            />
          ))}
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '32px' }}>
          <button
            onClick={() => setIsMuted(!isMuted)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: isMuted ? '#BD3838' : 'rgba(255,255,255,0.12)',
              border: 'none',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
          </button>

          <button
            onClick={() => setIsSpeaker(!isSpeaker)}
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: isSpeaker ? '#B7F34A' : 'rgba(255,255,255,0.12)',
              border: 'none',
              color: isSpeaker ? '#20251F' : '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }}
          >
            <Volume2 size={22} />
          </button>
        </div>

        {/* Red End Call Button */}
        <button
          onClick={handleEndCall}
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#E53E3E',
            border: 'none',
            color: '#FFFFFF',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 8px 24px rgba(229, 62, 62, 0.4)'
          }}
        >
          <PhoneOff size={28} />
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 4. RIDER CHAT MODAL (Interactive 2-Way Messaging with Ravi Kumar)
// ============================================================================
export function RiderChatModal() {
  const { activeModal, setActiveModal, showToast } = useNivvo();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'rider', text: 'Hi Aarav! I have collected your court sneakers from Sole Street.', time: '2:40 pm' },
    { id: 2, sender: 'rider', text: 'Picked up the USB-C cable from Circuit House as well. Navigating to Maple Court now!', time: '2:44 pm' }
  ]);
  const [typedMessage, setTypedMessage] = useState('');

  if (activeModal !== 'chat') return null;

  const quickReplies = [
    'Please ring the doorbell 🔔',
    'Leave at the door step 🚪',
    'I will meet you at the gate 👋',
    'Call me when here 📞'
  ];

  const handleSend = (textToSend) => {
    const text = textToSend || typedMessage;
    if (!text.trim()) return;

    playClickSound();
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: text.trim(),
      time: 'Just now'
    };
    setMessages(prev => [...prev, userMsg]);
    setTypedMessage('');

    // Simulate Rider Response after 1s
    setTimeout(() => {
      const responses = [
        'Got it! Arriving in ~8 minutes at 12th Main.',
        'Noted! Will ring the doorbell as requested.',
        'Perfect, see you at the entrance with your parcel!'
      ];
      const randomReply = responses[Math.floor(Math.random() * responses.length)];
      setMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'rider', text: randomReply, time: 'Just now' }
      ]);
    }, 1100);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" style={{ height: '520px', display: 'flex', flexDirection: 'column' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="nivvo-modal-header" style={{ paddingBottom: '12px', borderBottom: '1px solid #E7EAE3' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#24452D', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>
              RK
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#20251F' }}>
                Ravi Kumar · Partner
              </div>
              <div style={{ fontSize: '11px', color: '#238636', fontWeight: 600 }}>
                ● Active on route · Indiranagar
              </div>
            </div>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        {/* Message Thread */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.map((m) => {
            const isMe = m.sender === 'user';
            return (
              <div
                key={m.id}
                style={{
                  alignSelf: isMe ? 'flex-end' : 'flex-start',
                  maxWidth: '82%',
                  backgroundColor: isMe ? '#24452D' : '#F7F8F5',
                  color: isMe ? '#FFFFFF' : '#20251F',
                  borderRadius: isMe ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                  padding: '10px 14px',
                  border: isMe ? 'none' : '1px solid #E7EAE3'
                }}
              >
                <div style={{ fontSize: '13px', lineHeight: 1.4 }}>{m.text}</div>
                <div style={{ fontSize: '10px', color: isMe ? '#A0BBA0' : '#73796F', marginTop: '4px', textAlign: 'right' }}>
                  {m.time}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Reply Chips */}
        <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '10px' }}>
          {quickReplies.map((qr) => (
            <button
              key={qr}
              onClick={() => handleSend(qr)}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7EAE3',
                borderRadius: '999px',
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#20251F',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {qr}
            </button>
          ))}
        </div>

        {/* Text Input Row */}
        <div style={{ display: 'flex', gap: '8px', paddingTop: '8px', borderTop: '1px solid #E7EAE3' }}>
          <input
            type="text"
            placeholder="Type a message to Ravi..."
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              border: '1px solid #E7EAE3',
              borderRadius: '12px',
              padding: '10px 14px',
              fontSize: '13px',
              backgroundColor: '#F7F8F5'
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!typedMessage.trim()}
            style={{
              backgroundColor: '#B7F34A',
              color: '#20251F',
              border: 'none',
              borderRadius: '12px',
              padding: '0 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: typedMessage.trim() ? 'pointer' : 'default',
              opacity: typedMessage.trim() ? 1 : 0.6
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. DELIVERY PIN MODAL
// ============================================================================
export function HandoverPinModal() {
  const { activeModal, setActiveModal, activeOrder, showToast } = useNivvo();

  if (activeModal !== 'pin') return null;

  const pinDigits = (activeOrder?.pin || '4829').split('');

  const handleCopy = () => {
    navigator.clipboard?.writeText(activeOrder?.pin || '4829');
    showToast('PIN 4829 copied to clipboard! 📋');
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={22} color="#24452D" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Delivery Handover PIN
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#73796F', margin: '4px 0 20px 0' }}>
          Share this 4-digit code with your rider upon arrival to securely verify your package handover.
        </p>

        {/* 4 Large PIN Digits */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '24px' }}>
          {pinDigits.map((digit, i) => (
            <div
              key={i}
              style={{
                width: '56px',
                height: '64px',
                borderRadius: '14px',
                backgroundColor: '#24452D',
                color: '#B7F34A',
                fontSize: '32px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(36, 69, 45, 0.2)'
              }}
            >
              {digit}
            </div>
          ))}
        </div>

        <button
          onClick={handleCopy}
          style={{
            width: '100%',
            backgroundColor: '#F7F8F5',
            border: '1px solid #E7EAE3',
            color: '#20251F',
            padding: '12px',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          <Copy size={16} />
          <span>Copy verification code</span>
        </button>

        <div style={{ fontSize: '11px', color: '#73796F', textAlign: 'center', lineHeight: 1.45 }}>
          Do not share this PIN over phone or chat. Share in person only after checking that the tamper-evident seal is intact.
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6. ADD PRODUCT MODAL (For Shop Owner)
// ============================================================================
export function AddProductModal() {
  const { activeModal, setActiveModal, addMerchantProduct, showToast } = useNivvo();
  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [price, setPrice] = useState('');
  const [mrp, setMrp] = useState('');
  const [stock, setStock] = useState('15');
  const [category, setCategory] = useState('Footwear');
  const [selectedSizes, setSelectedSizes] = useState(['UK 7', 'UK 8', 'UK 9']);
  const [colorName, setColorName] = useState('Tan Leather');
  const [description, setDescription] = useState('Handcrafted locally with premium materials and supportive comfort cushioning.');
  const [trialSupported, setTrialSupported] = useState(true);
  const [uploadedImages, setUploadedImages] = useState([
    { id: 'modal-img-1', url: '/assets/figma/product_court_sneaker.png', name: 'front_view.png', isPrimary: true }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  if (activeModal !== 'addProduct') return null;

  const footwearSizes = ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
  const apparelSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Free Size'];
  const gadgetSizes = ['Standard', '128 GB', '256 GB', '512 GB', 'One Size'];
  
  const availableSizeOptions = category === 'Footwear' 
    ? footwearSizes 
    : (['Apparel', 'Ethnic'].includes(category) ? apparelSizes : gadgetSizes);

  const toggleSize = (sz) => {
    playClickSound();
    setSelectedSizes(prev => 
      prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
    );
  };

  const handleGenerateSku = () => {
    playClickSound();
    const prefix = category === 'Footwear' ? 'SS-FTW' : 'SS-APP';
    const rand = Math.floor(100 + Math.random() * 900);
    setSku(`${prefix}-${(name.slice(0, 3) || 'ITM').toUpperCase()}-${rand}`);
  };

  const handleProcessFiles = (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    const validImageFiles = fileList.filter(f => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      showToast('Please select valid image files.');
      return;
    }

    if (uploadedImages.length + validImageFiles.length > 8) {
      showToast('Maximum 8 images allowed.');
      return;
    }

    playAddSound();
    let readCount = 0;
    const newItems = [];

    validImageFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        newItems.push({
          id: `modal-img-${Date.now()}-${idx}`,
          url: dataUrl,
          name: file.name,
          isPrimary: uploadedImages.length === 0 && newItems.length === 0
        });

        readCount++;
        if (readCount === validImageFiles.length) {
          setUploadedImages(prev => {
            const hasPrimary = prev.some(img => img.isPrimary);
            if (!hasPrimary && newItems.length > 0) newItems[0].isPrimary = true;
            return [...prev, ...newItems];
          });
          showToast(`Added ${validImageFiles.length} photo(s).`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleSetCover = (id) => {
    playClickSound();
    setUploadedImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === id
    })));
  };

  const handleRemoveImage = (id) => {
    playClickSound();
    setUploadedImages(prev => {
      const remaining = prev.filter(img => img.id !== id);
      if (remaining.length > 0 && !remaining.some(img => img.isPrimary)) {
        remaining[0].isPrimary = true;
      }
      return remaining;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !price) {
      showToast('Please provide product name and price');
      return;
    }

    const generatedSku = sku.trim() || `SS-${(name.slice(0, 4) || 'PROD').toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`;
    const sellingPrice = parseInt(price) || 999;
    const finalMrp = parseInt(mrp) || Math.round(sellingPrice * 1.3);

    const primaryImg = uploadedImages.find(img => img.isPrimary) || uploadedImages[0] || { url: '/assets/figma/product_court_sneaker.png' };
    const allUrls = uploadedImages.length > 0 ? uploadedImages.map(i => i.url) : [primaryImg.url];

    addMerchantProduct({
      name: name.trim(),
      sku: generatedSku,
      category,
      price: sellingPrice,
      mrp: finalMrp,
      stock: parseInt(stock) || 10,
      sizes: selectedSizes.length > 0 ? selectedSizes : ['Standard'],
      color: colorName,
      image: primaryImg.url,
      images: allUrls,
      description: description.trim(),
      trial_supported: trialSupported
    });

    setActiveModal(null);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} color="#24452D" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Add Product to Catalog
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#73796F', margin: '4px 0 14px 0' }}>
          Upload high-resolution photography, configure size options & doorstep try-on delivery.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Image Upload Zone */}
          <div style={{ backgroundColor: '#FAFBF8', border: '1px solid #E2E5DC', borderRadius: '12px', padding: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <ImageIcon size={14} color="#1E3827" />
                <span>Product Photos ({uploadedImages.length}/8)</span>
              </label>
              <span style={{ fontSize: '11px', color: '#687163' }}>Drag & drop or browse</span>
            </div>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDragging ? '#1E3827' : '#D0D5C9'}`,
                backgroundColor: isDragging ? '#EEF6EB' : '#FFFFFF',
                borderRadius: '10px',
                padding: '16px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleProcessFiles(e.target.files)}
                style={{ display: 'none' }}
              />
              <UploadCloud size={22} color="#1E3827" style={{ margin: '0 auto 4px auto' }} />
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#14281C' }}>
                Drag & drop product images, or click to browse
              </div>
              <div style={{ fontSize: '10px', color: '#73796F' }}>
                PNG, JPG, WEBP, AVIF up to 10MB
              </div>
            </div>

            {/* Gallery Previews */}
            {uploadedImages.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(95px, 1fr))', gap: '8px', marginTop: '10px' }}>
                {uploadedImages.map(img => (
                  <div
                    key={img.id}
                    style={{
                      position: 'relative',
                      border: img.isPrimary ? '2px solid #14281C' : '1px solid #DCE0D5',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#FFFFFF',
                      textAlign: 'center'
                    }}
                  >
                    {img.isPrimary && (
                      <span style={{
                        position: 'absolute',
                        top: '4px',
                        left: '4px',
                        backgroundColor: '#14281C',
                        color: '#B8F135',
                        fontSize: '9px',
                        fontWeight: 800,
                        padding: '1px 4px',
                        borderRadius: '3px'
                      }}>
                        Cover
                      </span>
                    )}
                    <img src={img.url} alt={img.name} style={{ width: '100%', height: '70px', objectFit: 'contain', padding: '4px', boxSizing: 'border-box' }} />
                    <div style={{ padding: '3px 4px', borderTop: '1px solid #ECEEE7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      {!img.isPrimary ? (
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleSetCover(img.id); }}
                          style={{ background: 'none', border: 'none', fontSize: '9px', fontWeight: 700, color: '#1E3827', cursor: 'pointer', padding: 0 }}
                        >
                          Cover
                        </button>
                      ) : (
                        <span style={{ fontSize: '9px', color: '#15803D', fontWeight: 700 }}>Primary</span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleRemoveImage(img.id); }}
                        style={{ background: 'none', border: 'none', color: '#DC2626', cursor: 'pointer', padding: 0 }}
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Category *
            </label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                if (e.target.value === 'Footwear') {
                  setSelectedSizes(['UK 7', 'UK 8', 'UK 9']);
                } else if (['Apparel', 'Ethnic'].includes(e.target.value)) {
                  setSelectedSizes(['M', 'L', 'XL']);
                } else {
                  setSelectedSizes(['Standard']);
                }
              }}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', backgroundColor: '#FFFFFF' }}
            >
              <option value="Footwear">Footwear & Sneakers</option>
              <option value="Apparel">Casual Apparel & Tees</option>
              <option value="Ethnic">Ethnic & Festive Wear</option>
              <option value="Accessories">Accessories & Fast Tech</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Product Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Suede Runner Court Sneaker"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Selling Price (₹) *
              </label>
              <input
                type="number"
                required
                placeholder="1299"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                MRP / List Price (₹)
              </label>
              <input
                type="number"
                placeholder="1599"
                value={mrp}
                onChange={(e) => setMrp(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Automatic 10% Commission & Customer Price Preview */}
          {(() => {
            const numPrice = Number(price) || 0;
            const commission = Math.round(numPrice * 0.10);
            const customerPrice = numPrice + commission;
            return (
              <div style={{
                backgroundColor: '#F5F8F3',
                border: '1.5px solid #D5E2D1',
                borderRadius: '12px',
                padding: '12px 14px',
                fontSize: '12px',
                color: '#14281C'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '6px', color: '#1E3827', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span>10% Platform Commission Preview</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#73796F' }}>Your Listed Price (You keep 100%):</span>
                  <span style={{ fontWeight: 700 }}>₹{numPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: '#73796F' }}>Company 10% Commission (+):</span>
                  <span style={{ fontWeight: 600, color: '#24452D' }}>+₹{commission.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #C8D6C4', paddingTop: '6px', marginTop: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#14281C' }}>Customer Sees (Automatic):</span>
                  <span style={{ fontWeight: 800, color: '#1C7532', fontSize: '13px' }}>₹{customerPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            );
          })()}

          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>
                  SKU Code
                </label>
                <button
                  type="button"
                  onClick={handleGenerateSku}
                  style={{ background: 'none', border: 'none', color: '#24452D', fontSize: '11px', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                >
                  Auto-generate
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. SS-COURT-07"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Initial Stock
              </label>
              <input
                type="number"
                placeholder="15"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
              Size Variants (Select available)
            </label>
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              {availableSizeOptions.map(sz => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => toggleSize(sz)}
                    style={{
                      border: isSelected ? '1.5px solid #24452D' : '1px solid #E7EAE3',
                      backgroundColor: isSelected ? '#EEF4EC' : '#FFFFFF',
                      color: isSelected ? '#24452D' : '#73796F',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer'
                    }}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Colorway & Description
            </label>
            <input
              type="text"
              placeholder="e.g. Sage / Ivory, Classic Tan"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', marginBottom: '8px' }}
            />
            <textarea
              rows="2"
              placeholder="Describe materials, leather grade, sole cushioning, and care instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>

          {/* Doorstep Try-on Toggle */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            backgroundColor: '#F7F8F5',
            borderRadius: '10px',
            border: '1px solid #E7EAE3'
          }}>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>
                Enable Doorstep Try-On (10 Mins)
              </div>
              <div style={{ fontSize: '11px', color: '#73796F' }}>
                Customer can try adjacent sizes at door; rider returns unchosen pair
              </div>
            </div>
            <input
              type="checkbox"
              checked={trialSupported}
              onChange={(e) => setTrialSupported(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#24452D', cursor: 'pointer' }}
            />
          </div>

          <button
            type="submit"
            disabled={!name.trim() || !price || uploadedImages.length === 0}
            style={{
              marginTop: '8px',
              backgroundColor: (!name.trim() || !price || uploadedImages.length === 0) ? '#D8DCD1' : '#B7F34A',
              color: '#20251F',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: (!name.trim() || !price || uploadedImages.length === 0) ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Publish live on Sole Street</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 6B. SHOP INSTANT PAYOUT / WITHDRAWAL MODAL
// ============================================================================
export function ShopWithdrawModal() {
  const { activeModal, setActiveModal, shopEarnings, requestShopPayout, shopProfile } = useNivvo();
  const [amount, setAmount] = useState('5000');
  const [upiId, setUpiId] = useState(shopProfile.upi_id || 'solestreet@icici');

  if (activeModal !== 'shopWithdraw') return null;

  const currentBalance = shopEarnings.grossSales || 24870;

  const handleWithdraw = (e) => {
    e.preventDefault();
    const withdrawAmt = parseInt(amount) || 0;
    if (withdrawAmt <= 0) return;
    requestShopPayout(withdrawAmt, upiId);
    setActiveModal(null);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#24452D" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Instant Merchant Payout
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <div style={{
          backgroundColor: '#EEF4EC',
          border: '1px solid #D4DEC8',
          borderRadius: '12px',
          padding: '14px',
          marginTop: '14px',
          marginBottom: '14px'
        }}>
          <div style={{ fontSize: '11px', color: '#73796F', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Available Settlement Balance
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#20251F', marginTop: '2px' }}>
            ₹{currentBalance.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#238636', fontWeight: 600, marginTop: '2px' }}>
            0% Platform Commission Inaugural Promo · Real-time IMPS
          </div>
        </div>

        <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
              Withdrawal Amount (₹)
            </label>
            <input
              type="number"
              required
              min="100"
              max={currentBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '12px', fontSize: '16px', fontWeight: 700, color: '#20251F' }}
            />
            {/* Quick chips */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {[2000, 5000, 10000, currentBalance].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(String(amt))}
                  style={{
                    border: '1px solid #E7EAE3',
                    backgroundColor: '#F7F8F5',
                    padding: '6px 10px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#20251F',
                    cursor: 'pointer'
                  }}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Payout UPI ID / VPA
            </label>
            <input
              type="text"
              required
              placeholder="e.g. solestreet@icici"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
            />
          </div>

          <div style={{ fontSize: '11px', color: '#73796F', backgroundColor: '#F7F8F5', padding: '10px', borderRadius: '8px' }}>
            Bank settlement: <strong>{shopProfile.bank_name || 'ICICI Bank'}</strong> ({shopProfile.bank_account || 'ICICI-992104812'}). Transferred via RBI IMPS gateway in &lt; 30 seconds.
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#B7F34A',
              color: '#20251F',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Transfer ₹{parseInt(amount || 0).toLocaleString('en-IN')} now</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 6C. STORE SETTINGS & BUSINESS HOURS MODAL
// ============================================================================
export function ShopSettingsModal() {
  const { activeModal, setActiveModal, shopProfile, updateShopProfileData } = useNivvo();
  const [shopName, setShopName] = useState(shopProfile.shop_name || 'Sole Street Originals');
  const [ownerName, setOwnerName] = useState(shopProfile.owner_name || 'Rohan Sharma');
  const [operatingHours, setOperatingHours] = useState(shopProfile.operating_hours || '08:00 AM - 11:30 PM');
  const [address, setAddress] = useState(shopProfile.address || 'Plot 42, 100ft Road, Indiranagar, Bengaluru');
  const [gstin, setGstin] = useState(shopProfile.gstin || '29AABCU9603R1ZM');
  const [pan, setPan] = useState(shopProfile.pan_number || 'AABCU9603R');
  const [bankAccount, setBankAccount] = useState(shopProfile.bank_account || 'ICICI-992104812');
  const [upiId, setUpiId] = useState(shopProfile.upi_id || 'solestreet@icici');

  if (activeModal !== 'shopSettings') return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateShopProfileData({
      shop_name: shopName,
      owner_name: ownerName,
      operating_hours: operatingHours,
      address,
      gstin,
      pan_number: pan,
      bank_account: bankAccount,
      upi_id: upiId
    });
    setActiveModal(null);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#238636" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Store Profile & Operating Hours
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Store Name *
            </label>
            <input
              type="text"
              required
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Owner Name *
              </label>
              <input
                type="text"
                required
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Daily Operating Hours
              </label>
              <input
                type="text"
                value={operatingHours}
                onChange={(e) => setOperatingHours(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Store / Dark Store Hub Address
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                GSTIN (Tax ID)
              </label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                PAN Number
              </label>
              <input
                type="text"
                value={pan}
                onChange={(e) => setPan(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Bank Account
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Default Merchant UPI
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '10px',
              backgroundColor: '#20251F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Save Store Settings & Business Hours
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 6D. REJECT ORDER MODAL
// ============================================================================
export function ShopRejectOrderModal() {
  const { activeModal, setActiveModal, modalPayload, rejectMerchantOrder } = useNivvo();
  const [selectedReason, setSelectedReason] = useState('Item / Size out of stock');

  if (activeModal !== 'shopReject') return null;

  const orderId = modalPayload?.orderId || 'NV-1052';

  const reasons = [
    'Item / Size out of stock',
    'Garment damaged during shelf inspection',
    'Dark store order preparation capacity reached',
    'Store closing early / inventory recount'
  ];

  const handleConfirm = () => {
    rejectMerchantOrder(orderId, selectedReason);
    setActiveModal(null);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} color="#BD3838" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Decline Order {orderId}
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '13px', color: '#73796F', margin: '8px 0 16px 0' }}>
          Customer will be refunded immediately and alerted with your chosen reason:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '20px' }}>
          {reasons.map(r => (
            <div
              key={r}
              onClick={() => setSelectedReason(r)}
              style={{
                border: selectedReason === r ? '1.5px solid #BD3838' : '1px solid #E7EAE3',
                backgroundColor: selectedReason === r ? '#FFF5F5' : '#FFFFFF',
                borderRadius: '10px',
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontSize: '13px',
                fontWeight: selectedReason === r ? 700 : 500,
                color: '#20251F'
              }}
            >
              <input
                type="radio"
                checked={selectedReason === r}
                onChange={() => setSelectedReason(r)}
                style={{ accentColor: '#BD3838', cursor: 'pointer' }}
              />
              <span>{r}</span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveModal(null)}
            style={{ flex: 1, border: '1px solid #E7EAE3', backgroundColor: '#FFFFFF', padding: '12px', borderRadius: '10px', fontWeight: 600, fontSize: '13px', cursor: 'pointer' }}
          >
            Back
          </button>
          <button
            onClick={handleConfirm}
            style={{ flex: 1, backgroundColor: '#BD3838', color: '#FFFFFF', border: 'none', padding: '12px', borderRadius: '10px', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
          >
            Confirm Decline
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6E. CREATE PROMOTIONAL CAMPAIGN MODAL
// ============================================================================
export function ShopCampaignModal() {
  const { activeModal, setActiveModal, addMerchantCampaign } = useNivvo();
  const [title, setTitle] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState('PERCENT');
  const [discountVal, setDiscountVal] = useState('10');
  const [minOrder, setMinOrder] = useState('699');
  const [bannerText, setBannerText] = useState('');

  if (activeModal !== 'shopCampaign') return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !code.trim()) return;

    addMerchantCampaign({
      title: title.trim(),
      code: code.trim(),
      discount_type: discountType,
      discount_val: parseInt(discountVal) || 10,
      min_order: parseInt(minOrder) || 499,
      banner_text: bannerText.trim() || `${discountVal}% off on local store finds`
    });

    setActiveModal(null);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Tag size={20} color="#24452D" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Create Store Promotion
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Promotion Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Sunday Sneaker Rush 15% Off"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Coupon Code *
              </label>
              <input
                type="text"
                required
                placeholder="RUSH15"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontWeight: 700 }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Discount Value (% or ₹)
              </label>
              <input
                type="number"
                required
                placeholder="15"
                value={discountVal}
                onChange={(e) => setDiscountVal(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Discount Type
              </label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', backgroundColor: '#FFFFFF' }}
              >
                <option value="PERCENT">Percentage (%)</option>
                <option value="FLAT">Flat Cash (₹)</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Min Order (₹)
              </label>
              <input
                type="number"
                placeholder="699"
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Announcement Banner Note
            </label>
            <input
              type="text"
              placeholder="15% OFF across all sneakers this Sunday only"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: '10px',
              backgroundColor: '#B7F34A',
              color: '#20251F',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            Launch Campaign Now
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 6F. RIDER INSTANT PAYOUT / WITHDRAWAL MODAL
// ============================================================================
export function RiderWithdrawModal() {
  const { activeModal, setActiveModal, riderProfile, requestRiderPayout } = useNivvo();
  const [amount, setAmount] = useState('500');
  const [upiId, setUpiId] = useState(riderProfile.upi_id || 'ravi.ev@okhdfc');

  if (activeModal !== 'riderWithdraw') return null;

  const currentBalance = riderProfile.today_earnings || 748;

  const handleWithdraw = (e) => {
    e.preventDefault();
    const withdrawAmt = parseInt(amount) || 0;
    if (withdrawAmt <= 0) return;
    requestRiderPayout(withdrawAmt, upiId);
    setActiveModal(null);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={20} color="#24452D" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Instant Fleet Wallet Payout
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <div style={{
          backgroundColor: '#EEF4EC',
          border: '1px solid #D4DEC8',
          borderRadius: '12px',
          padding: '14px',
          marginTop: '14px',
          marginBottom: '14px'
        }}>
          <div style={{ fontSize: '11px', color: '#73796F', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Available Today Earnings
          </div>
          <div style={{ fontSize: '28px', fontWeight: 800, color: '#20251F', marginTop: '2px' }}>
            ₹{currentBalance.toLocaleString('en-IN')}
          </div>
          <div style={{ fontSize: '11px', color: '#238636', fontWeight: 600, marginTop: '2px' }}>
            ✓ 0% Transfer Fee · Instant IMPS to UPI or Bank Account
          </div>
        </div>

        <form onSubmit={handleWithdraw} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
              Withdrawal Amount (₹)
            </label>
            <input
              type="number"
              required
              min="50"
              max={currentBalance}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '12px', fontSize: '16px', fontWeight: 700, color: '#20251F' }}
            />
            {/* Quick chips */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {[200, 500, currentBalance].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setAmount(String(amt))}
                  style={{
                    border: '1px solid #E7EAE3',
                    backgroundColor: '#F7F8F5',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#20251F',
                    cursor: 'pointer'
                  }}
                >
                  ₹{amt.toLocaleString('en-IN')}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Destination UPI ID
            </label>
            <input
              type="text"
              required
              placeholder="e.g. ravi.ev@okhdfc"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
            />
          </div>

          <div style={{ fontSize: '11px', color: '#73796F', backgroundColor: '#F7F8F5', padding: '10px', borderRadius: '8px' }}>
            🔒 Bank account: <strong>{riderProfile.bank_name || 'HDFC Bank'}</strong> ({riderProfile.bank_account || 'HDFC-889129031'}). 100% tips and delivery pay transferred in &lt; 30 seconds.
          </div>

          <button
            type="submit"
            style={{
              backgroundColor: '#B7F34A',
              color: '#20251F',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontWeight: 700,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <span>Transfer ₹{parseInt(amount || 0).toLocaleString('en-IN')} now</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 6G. RIDER REPORT ISSUE / DISPATCH INCIDENT MODAL
// ============================================================================
export function RiderIssueModal() {
  const { activeModal, setActiveModal, reportDeliveryIssue } = useNivvo();
  const [selectedIssue, setSelectedIssue] = useState('Customer Unreachable / Doorbell Unanswered');
  const [notes, setNotes] = useState('');

  if (activeModal !== 'riderIssue') return null;

  const issueOptions = [
    { title: 'Customer Unreachable / Doorbell Unanswered', desc: 'Called 3 times with no answer at gate' },
    { title: 'Incorrect Delivery Address / Navigation Error', desc: 'Doorstep is > 1.5 km away from pinned GPS' },
    { title: 'Customer Requested Delay / Trying Sizes', desc: 'Customer requested 5 extra mins for doorstep try-on' },
    { title: 'EV Scooter Issue / Flat Tyre', desc: 'Battery low (<10%) or mechanical breakdown' },
    { title: 'Heavy Rain / Waterlogged Street', desc: 'Safe delivery delayed due to localized flooding' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    reportDeliveryIssue(selectedIssue, notes);
    setActiveModal(null);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={20} color="#BD3838" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Report Delivery Incident
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#73796F', margin: '4px 0 14px 0' }}>
          Select the situation below. Indiranagar Dispatch Controller will immediately assist or adjust customer SLA timer.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {issueOptions.map(opt => (
            <div
              key={opt.title}
              onClick={() => setSelectedIssue(opt.title)}
              style={{
                border: selectedIssue === opt.title ? '1.5px solid #24452D' : '1px solid #E7EAE3',
                backgroundColor: selectedIssue === opt.title ? '#EEF4EC' : '#FFFFFF',
                borderRadius: '10px',
                padding: '10px 12px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input
                  type="radio"
                  checked={selectedIssue === opt.title}
                  onChange={() => setSelectedIssue(opt.title)}
                  style={{ accentColor: '#24452D', cursor: 'pointer' }}
                />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>{opt.title}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#73796F', marginLeft: '22px', marginTop: '2px' }}>
                {opt.desc}
              </div>
            </div>
          ))}

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Additional details (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Guard won't allow EV inside gate"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '8px', padding: '8px 12px', fontSize: '12px' }}
            />
          </div>

          <button
            type="submit"
            style={{
              marginTop: '6px',
              backgroundColor: '#20251F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Alert Fleet Dispatch & Request Call
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 6H. RIDER PROFILE & EV VEHICLE MODAL
// ============================================================================
export function RiderProfileModal() {
  const { activeModal, setActiveModal, riderProfile, updateRiderProfileData } = useNivvo();
  const [name, setName] = useState(riderProfile.name || 'Ravi Kumar');
  const [vehicleNumber, setVehicleNumber] = useState(riderProfile.vehicle_number || 'KA-03-EV-4421');
  const [vehicleType, setVehicleType] = useState(riderProfile.vehicle_type || 'Electric Scooter (EV)');
  const [emergencyPhone, setEmergencyPhone] = useState(riderProfile.emergency_contact || '+91 80 4912 8820');
  const [bankAccount, setBankAccount] = useState(riderProfile.bank_account || 'HDFC-889129031');
  const [upiId, setUpiId] = useState(riderProfile.upi_id || 'ravi.ev@okhdfc');

  if (activeModal !== 'riderProfile') return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateRiderProfileData({
      name,
      vehicle_number: vehicleNumber,
      vehicle_type: vehicleType,
      emergency_contact: emergencyPhone,
      bank_account: bankAccount,
      upi_id: upiId
    });
    setActiveModal(null);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#238636" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Rider Profile & EV Details
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', backgroundColor: '#FFFFFF' }}
              >
                <option value="Electric Scooter (EV)">Electric Scooter (EV)</option>
                <option value="Bicycle (Nivvo Green 🚲)">Bicycle (Nivvo Green)</option>
                <option value="Motorcycle (Standard)">Motorcycle</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Vehicle Number
              </label>
              <input
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px', fontWeight: 700 }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
              Emergency SOS Contact Number
            </label>
            <input
              type="text"
              required
              value={emergencyPhone}
              onChange={(e) => setEmergencyPhone(e.target.value)}
              style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Bank Account
              </label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '4px' }}>
                Default Payout UPI ID
              </label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                style={{ width: '100%', boxSizing: 'border-box', border: '1px solid #E7EAE3', borderRadius: '10px', padding: '10px 12px', fontSize: '13px' }}
              />
            </div>
          </div>

          <div style={{ backgroundColor: '#F7F8F5', padding: '10px', borderRadius: '8px', fontSize: '11px', color: '#73796F' }}>
            ✓ Verified KYC Documents: Aadhaar ({riderProfile.aadhaar_number}) · Driving License ({riderProfile.license_number})
          </div>

          <button
            type="submit"
            style={{
              marginTop: '4px',
              backgroundColor: '#20251F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontWeight: 700,
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Save Vehicle & Partner Details
          </button>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 6I. RIDER SAFETY & SOS HOTLINE MODAL
// ============================================================================
export function RiderSafetyModal() {
  const { activeModal, setActiveModal, showToast } = useNivvo();

  if (activeModal !== 'riderSafety') return null;

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#238636" />
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
              Fleet Safety & Emergency Hub
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#73796F', margin: '6px 0 16px 0' }}>
          Your safety is our top priority. 10-minute delivery estimates are route planning models, never speed targets.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => {
              playTrialSound();
              showToast('Dialing 24/7 Fleet Safety Hotline: 1800-NIVVO-SAFE');
              setActiveModal(null);
            }}
            style={{
              backgroundColor: '#BD3838',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            <Phone size={18} />
            <span>Emergency SOS Button (1800-NIVVO-SAFE)</span>
          </button>

          <button
            onClick={() => {
              playClickSound();
              showToast('Connecting to Indiranagar Dark Store Hub Manager (+91 80 4912 8820)');
              setActiveModal(null);
            }}
            style={{
              backgroundColor: '#EEF4EC',
              color: '#24452D',
              border: '1px solid #D4DEC8',
              borderRadius: '12px',
              padding: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px'
            }}
          >
            <Phone size={16} />
            <span>Call Dark Store Hub Controller</span>
          </button>

          <div style={{ border: '1px solid #E7EAE3', borderRadius: '12px', padding: '12px', fontSize: '11px', color: '#73796F' }}>
            📍 <strong>Nearest EV Battery Swap Station:</strong> Indiranagar Dark Store #14 (100ft Road). 12 fully charged battery packs available.
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 6J. RIDER KYC & IDENTITY VERIFICATION MODAL
// ============================================================================
export function RiderKycModal() {
  const { activeModal, setActiveModal, riderProfile, showToast } = useNivvo();
  const [selectedDoc, setSelectedDoc] = useState('driving_license');
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (activeModal !== 'riderKyc') return null;

  const handleSimulateUpload = (e) => {
    e.preventDefault();
    playTrialSound();
    setUploadSuccess(true);
    showToast('Document uploaded successfully! AI verification passed in 3 seconds ✓');
    setTimeout(() => setUploadSuccess(false), 4000);
  };

  return (
    <div className="nivvo-modal-overlay" onClick={() => setActiveModal(null)}>
      <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldCheck size={20} color="#238636" />
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
                Identity & KYC Verification
              </h3>
              <div style={{ fontSize: '11px', color: '#238636', fontWeight: 700 }}>
                ● Status: APPROVED & ACTIVE (Tier-1 Fleet Partner)
              </div>
            </div>
          </div>
          <button className="nivvo-modal-close-btn" onClick={() => setActiveModal(null)}>
            <X size={18} />
          </button>
        </div>

        <p style={{ fontSize: '12px', color: '#73796F', margin: '6px 0 16px 0' }}>
          Government-verified credentials for partner <strong>{riderProfile.name}</strong> ({riderProfile.partner_id}).
        </p>

        {/* 4 Verified Documents Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
          <div style={{ border: '1px solid #E7EAE3', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FBFDFB' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F' }}>Aadhaar Card (UIDAI)</div>
              <div style={{ fontSize: '11px', color: '#73796F' }}>Number: {riderProfile.aadhaar_number} · e-KYC Verified</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#238636', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '6px' }}>
              Verified ✓
            </span>
          </div>

          <div style={{ border: '1px solid #E7EAE3', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FBFDFB' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F' }}>Commercial Driving License (DL)</div>
              <div style={{ fontSize: '11px', color: '#73796F' }}>Number: {riderProfile.license_number} · Valid till 2029</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#238636', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '6px' }}>
              Verified ✓
            </span>
          </div>

          <div style={{ border: '1px solid #E7EAE3', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FBFDFB' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F' }}>Permanent Account Number (PAN)</div>
              <div style={{ fontSize: '11px', color: '#73796F' }}>Number: AABCU9603R · TDS exemption verified</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#238636', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '6px' }}>
              Verified ✓
            </span>
          </div>

          <div style={{ border: '1px solid #E7EAE3', borderRadius: '12px', padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FBFDFB' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F' }}>EV Registration Certificate & Insurance</div>
              <div style={{ fontSize: '11px', color: '#73796F' }}>Reg: {riderProfile.vehicle_number} · Zero-emission verified</div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#238636', backgroundColor: '#E8F5E9', padding: '3px 8px', borderRadius: '6px' }}>
              Verified ✓
            </span>
          </div>
        </div>

        {/* Upload new / update document form */}
        <form onSubmit={handleSimulateUpload} style={{ borderTop: '1px solid #E7EAE3', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F' }}>
            Upload replacement or renewal document
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <select
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              style={{ border: '1px solid #E7EAE3', borderRadius: '8px', padding: '8px 10px', fontSize: '12px', backgroundColor: '#FFFFFF' }}
            >
              <option value="driving_license">Driving License renewal</option>
              <option value="ev_insurance">EV Insurance renewal</option>
              <option value="bank_passbook">Bank Passbook / Cheque</option>
              <option value="pcc">Police Clearance Certificate</option>
            </select>
            <input
              type="file"
              accept="image/*,.pdf"
              style={{ border: '1px solid #E7EAE3', borderRadius: '8px', padding: '6px', fontSize: '11px', backgroundColor: '#F7F8F5' }}
            />
          </div>
          <button
            type="submit"
            style={{
              backgroundColor: '#20251F',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '8px',
              padding: '10px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            Submit for Instant AI Verification
          </button>
          {uploadSuccess && (
            <div style={{ fontSize: '12px', color: '#238636', fontWeight: 700, textAlign: 'center' }}>
              ✓ Document accepted & OCR matched with partner records!
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 7. TOAST NOTIFICATION
// ============================================================================
export function ToastNotification() {
  const { toastMessage } = useNivvo();
  if (!toastMessage) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#20251F',
      color: '#FFFFFF',
      padding: '10px 18px',
      borderRadius: '999px',
      fontSize: '13px',
      fontWeight: 600,
      boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      zIndex: 9999,
      border: '1.5px solid #B7F34A',
      animation: 'fadeInUp 0.25s ease'
    }}>
      <Sparkles size={16} color="#B7F34A" />
      <span>{toastMessage}</span>
    </div>
  );
}

// ============================================================================
// 8. MASTER MODAL CONTAINER
// ============================================================================
export default function NivvoModals() {
  const { activeModal, setActiveModal } = useNivvo();
  return (
    <>
      <LocationPickerModal />
      <CouponDrawerModal />
      <RiderCallModal />
      <RiderChatModal />
      <HandoverPinModal />
      <AddProductModal />
      <ShopWithdrawModal />
      <ShopSettingsModal />
      <ShopRejectOrderModal />
      <ShopCampaignModal />
      <RiderWithdrawModal />
      <RiderIssueModal />
      <RiderProfileModal />
      <RiderSafetyModal />
      <RiderKycModal />
      <RiderThreeDotMenuModal 
        isOpen={activeModal === 'riderMenu'} 
        onClose={() => setActiveModal(null)} 
      />
      <CustomerThreeDotMenuModal 
        isOpen={activeModal === 'customerMenu'} 
        onClose={() => setActiveModal(null)} 
      />
      <ToastNotification />
    </>
  );
}
