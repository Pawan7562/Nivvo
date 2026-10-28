import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowLeft, ShoppingBag, Phone, MessageSquare, Check, HelpCircle, 
  Navigation, ShieldCheck, Copy, RefreshCw, Package, Clock, MapPin, 
  Store, Bike, Zap, RotateCcw, FileText, Star, CheckCircle2, XCircle, 
  ChevronRight, AlertCircle, X, Download, CreditCard, ChevronDown
} from 'lucide-react';
import { playClickSound, playTrialSound, playAddSound } from '../../utils/audioEffects';
import { downloadReceiptPdf } from '../../utils/receiptGenerator';
import LiveGpsMapTracker from '../../components/LiveGpsMapTracker';

export default function NivvoLiveTrackingView({
  onBack,
  onOpenHelp
}) {
  const { 
    activeOrder, 
    orders = [], 
    setActiveModal, 
    showToast, 
    navigateTo, 
    cancelOrder, 
    requestReturnOrExchange,
    submitOrderReview,
    liveLocationTracking, 
    setLiveLocationTracking,
    addToCart,
    selectedAddress,
    totalCartCount,
    currentUser
  } = useNivvo();

  // Active Top Tab: 'tracking' (Active Delivery) | 'history' (Order History)
  const [activeTab, setActiveTab] = useState('tracking');
  
  // History Filter: 'all' | 'active' | 'delivered' | 'cancelled'
  const [historyFilter, setHistoryFilter] = useState('all');

  // Currently Selected Order to Track (defaults to activeOrder.id or first order)
  const [selectedOrderId, setSelectedOrderId] = useState(activeOrder?.id || orders[0]?.id || 'NV-1048');

  // Modals state
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Change of delivery address');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);
  const [returnOrderTarget, setReturnOrderTarget] = useState(null);
  const [returnType, setReturnType] = useState('exchange'); // 'exchange' | 'return'
  const [exchangeSize, setExchangeSize] = useState('UK 9');
  const [returnReason, setReturnReason] = useState('Size is slightly small, need 1 size up');
  const [reviewOrderTarget, setReviewOrderTarget] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [selectedReviewTags, setSelectedReviewTags] = useState(['Perfect Fit', 'Fast Delivery']);
  const [reviewComment, setReviewComment] = useState('');

  // Target order being inspected
  const currentOrder = orders.find(o => o.id === selectedOrderId) || activeOrder || orders[0];

  // Delivery simulation step
  const [deliveryStep, setDeliveryStep] = useState(2);
  const effectiveStep = (liveLocationTracking?.stepIndex !== undefined) ? liveLocationTracking.stepIndex : deliveryStep;

  const steps = [
    { title: 'Confirmed & Preparing', subtitle: 'Sole Street Indiranagar is packing your items in tamper-safe bag', time: '2:34 pm' },
    { title: 'Package Sealed & Ready', subtitle: 'Sole Street verified and staged package for courier pickup', time: '2:46 pm' },
    { title: 'Out for Delivery', subtitle: `Rider Ravi is riding down 100ft Road · ${liveLocationTracking?.distanceKm ?? 1.2} km away`, time: '2:48 pm' },
    { title: 'Arrived at Maple Court', subtitle: 'Ready for 10-minute doorstep try-on & handover verification', time: '2:56 pm' }
  ];

  const advanceDeliveryStep = () => {
    playTrialSound();
    const nextStep = (effectiveStep + 1) % steps.length;
    setDeliveryStep(nextStep);
    if (setLiveLocationTracking) {
      setLiveLocationTracking(prev => ({
        ...prev,
        stepIndex: nextStep,
        stepLabel: steps[nextStep].title,
        subText: steps[nextStep].subtitle,
        progress: nextStep === 0 ? 0 : (nextStep === 1 ? 0.2 : (nextStep === 2 ? 0.6 : 1.0)),
        distanceKm: nextStep >= 3 ? 0 : Math.max(0.2, (3 - nextStep) * 0.6)
      }));
    }
    showToast(`Order status updated: ${steps[nextStep].title}`);
  };

  const formatTryOnTime = (totalSecs) => {
    const m = Math.floor(totalSecs / 60);
    const s = totalSecs % 60;
    return `${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const copyPin = (pin) => {
    navigator.clipboard?.writeText(pin || '4829');
    showToast(`Verification PIN ${pin || '4829'} copied to clipboard`);
  };

  const handleReorder = (order) => {
    playAddSound();
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        addToCart(item, item.variant || 'Standard');
      });
      showToast(`Items from order ${order.id} added to bag`);
      navigateTo('bag');
    }
  };

  const isCurrentOrderActive = currentOrder && currentOrder.status !== 'cancelled' && currentOrder.status !== 'delivered';

  // Filtered orders for History tab
  const filteredOrders = orders.filter(o => {
    if (historyFilter === 'all') return true;
    if (historyFilter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
    if (historyFilter === 'delivered') return o.status === 'delivered';
    if (historyFilter === 'cancelled') return o.status === 'cancelled';
    return true;
  });

  return (
    <div className="nivvo-tracking-screen" style={{ minHeight: '100%', paddingBottom: '70px', backgroundColor: '#FFFFFF' }}>
      {/* Header */}
      <div className="nivvo-nav-header">
        <div className="nivvo-nav-header-left">
          <button className="nivvo-back-btn" onClick={onBack || (() => navigateTo('home'))} aria-label="Go Back">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="nivvo-nav-header-title">Customer Orders</div>
            <div className="nivvo-nav-header-subtitle">
              {activeTab === 'tracking' 
                ? `Tracking Order ${currentOrder?.id || 'NV-1048'}` 
                : `${orders.length} order${orders.length !== 1 ? 's' : ''} in your history`}
            </div>
          </div>
        </div>
        <button className="nivvo-bag-trigger" onClick={() => navigateTo('bag')} aria-label="View Shopping Bag">
          <ShoppingBag size={22} strokeWidth={1.8} />
          {totalCartCount > 0 && <span className="nivvo-bag-count-badge">{totalCartCount}</span>}
        </button>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Modern Segmented Navigation Tabs */}
        <div className="nivvo-orders-segmented-bar">
          <button
            className={`nivvo-orders-segmented-btn ${activeTab === 'tracking' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('tracking'); }}
          >
            {isCurrentOrderActive && <span className="nivvo-pulse-dot-green" />}
            <Navigation size={15} />
            <span>Active Delivery</span>
          </button>

          <button
            className={`nivvo-orders-segmented-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('history'); }}
          >
            <Package size={15} />
            <span>Order History ({orders.length})</span>
          </button>
        </div>

        {/* ==============================================================
            TAB 1: ACTIVE DELIVERY TRACKING VIEW
            ============================================================== */}
        {activeTab === 'tracking' && (
          <div>
            {/* Status Header Bar: Order metadata + Live GPS + Milestone Chip */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              marginBottom: '16px',
              paddingBottom: '14px',
              borderBottom: '1px solid #EAECE6'
            }}>
              {/* Row 1: Order ID & Timestamp on Left, Live GPS & Step simulator on Right */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{ fontSize: '13px', color: '#687163', fontWeight: 700, letterSpacing: '-0.01em' }}>
                  Order #{currentOrder?.id || 'NV-1048'} · {currentOrder?.placedAt || 'Today, 2:32 pm'}
                </div>

                {isCurrentOrderActive && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    <span style={{
                      backgroundColor: '#1F4230',
                      color: '#FFFFFF',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap'
                    }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4ADE80', display: 'inline-block' }} />
                      <span>Live GPS</span>
                    </span>

                    <button
                      onClick={advanceDeliveryStep}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #D5D8CF',
                        borderRadius: '999px',
                        padding: '4px 10px',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#20251F',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        transition: 'all 0.15s ease'
                      }}
                      title="Simulate Next Delivery Milestone"
                    >
                      <RefreshCw size={11} />
                      <span>Step</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Row 2: Status Chip - prominently positioned with its own breathing room */}
              <div>
                <span 
                  className={`nivvo-pro-chip ${currentOrder?.status === 'delivered' ? 'delivered' : (currentOrder?.status === 'cancelled' ? 'cancelled' : 'active')}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap'
                  }}
                >
                  {currentOrder?.status === 'delivered' ? (
                    <>
                      <CheckCircle2 size={13} />
                      <span>Delivered</span>
                    </>
                  ) : currentOrder?.status === 'cancelled' ? (
                    <>
                      <XCircle size={13} />
                      <span>Cancelled</span>
                    </>
                  ) : (
                    <>
                      <Bike size={13} />
                      <span>{steps[effectiveStep]?.title || 'Out for Delivery'}</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* ETA Headline or Status Message */}
            {currentOrder?.status === 'delivered' ? (
              <div style={{ marginBottom: '16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#20251F', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                  Order Delivered Successfully
                </h1>
                <p style={{ fontSize: '13px', color: '#73796F', margin: 0 }}>
                  Package handed over at your doorstep. Thank you for shopping local with Nivvo!
                </p>
              </div>
            ) : currentOrder?.status === 'cancelled' ? (
              <div style={{ marginBottom: '16px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#BD3838', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                  Order Cancelled
                </h1>
                <p style={{ fontSize: '13px', color: '#73796F', margin: 0 }}>
                  {currentOrder.refundStatus || 'Refund has been credited to your Nivvo Wallet.'}
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: '16px' }}>
                <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#20251F', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>
                  {effectiveStep === 3 ? 'Arrived at your door' : `Arriving in ${liveLocationTracking?.etaMinutes ?? 8} mins`}
                </h1>
                <div style={{ fontSize: '13px', color: '#73796F', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span>{steps[effectiveStep]?.subtitle || 'Rider is on the way'}</span>
                  <span>·</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Zap size={12} color="#24452D" /> {liveLocationTracking?.speedKmph ?? 24} km/h
                  </span>
                  <span>·</span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', color: '#24452D', fontWeight: 700 }}>
                    <MapPin size={12} /> {liveLocationTracking?.distanceKm ?? 1.2} km away
                  </span>
                </div>
              </div>
            )}

            {/* Doorstep Try-On Countdown Alert (When Arrived) */}
            {effectiveStep === 3 && isCurrentOrderActive && (
              <div style={{
                backgroundColor: '#0F2618',
                color: '#FFFFFF',
                borderRadius: '16px',
                padding: '16px 18px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 14px rgba(15, 38, 24, 0.25)'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B7F34A', display: 'inline-block' }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#B7F34A' }}>
                      Doorstep Try-On Active
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#E4F4D6', lineHeight: 1.4 }}>
                    Ravi is waiting at your door. Try your sizes, keep what fits!
                  </div>
                </div>
                <div style={{
                  backgroundColor: 'rgba(183, 243, 74, 0.15)',
                  border: '1.5px solid #B7F34A',
                  padding: '6px 14px',
                  borderRadius: '10px',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '9px', fontWeight: 700, color: '#B7F34A', textTransform: 'uppercase' }}>Time Left</div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '1px', fontFamily: 'monospace' }}>
                    {formatTryOnTime(liveLocationTracking?.tryOnSecondsRemaining ?? 600)}
                  </div>
                </div>
              </div>
            )}

            {/* Real Interactive Leaflet Live GPS Map & Rider Tracking */}
            {isCurrentOrderActive && (
              <div style={{ marginBottom: '16px' }}>
                <LiveGpsMapTracker 
                  mode="customer"
                  address={currentOrder?.shippingAddress?.street || selectedAddress?.street || 'Maple Court, A-302, 12th Main Road, Indiranagar'}
                  storeName="Sole Street Originals"
                  storeAddress="100ft Road, Indiranagar"
                  customerName={currentOrder?.shippingAddress?.recipient || selectedAddress?.recipient || 'Aarav Shah'}
                  riderName={liveLocationTracking?.riderName || 'Ravi Kumar'}
                  riderVehicle={liveLocationTracking?.riderVehicle || 'Ather 450X'}
                  activeStep={effectiveStep}
                  height="250px"
                />
              </div>
            )}

            {/* Delivery Handover Verification PIN Card */}
            {isCurrentOrderActive && (
              <div style={{
                backgroundColor: '#EEF4EC',
                border: '1px solid #D4DEC8',
                borderRadius: '16px',
                padding: '14px 18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '16px'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color="#24452D" />
                    <span style={{ fontSize: '11px', color: '#24452D', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      Handover Verification PIN
                    </span>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: 800, color: '#20251F', letterSpacing: '5px', marginTop: '3px' }}>
                    {currentOrder?.pin || '4829'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#687163', marginTop: '2px' }}>
                    Share with delivery partner only after receiving the sealed package.
                  </div>
                </div>

                <button
                  onClick={() => copyPin(currentOrder?.pin || '4829')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #D4DEC8',
                    borderRadius: '10px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#20251F',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Copy size={13} />
                  <span>Copy PIN</span>
                </button>
              </div>
            )}

            {/* Delivery Partner Profile Card */}
            {isCurrentOrderActive && (
              <div style={{
                border: '1px solid #E7EAE3',
                borderRadius: '16px',
                padding: '14px 16px',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '18px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    backgroundColor: '#24452D',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '15px'
                  }}>
                    RK
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#20251F' }}>
                      Ravi Kumar
                    </div>
                    <div style={{ fontSize: '12px', color: '#73796F', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                      <Star size={12} fill="#24452D" color="#24452D" />
                      <span style={{ fontWeight: 700, color: '#20251F' }}>4.9</span>
                      <span>·</span>
                      <Bike size={12} color="#73796F" />
                      <span>Electric Fleet</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => { playClickSound(); setActiveModal('call'); }}
                    title="Call delivery partner"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '1px solid #E7EAE3',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Phone size={16} color="#20251F" />
                  </button>
                  <button 
                    onClick={() => { playClickSound(); setActiveModal('chat'); }}
                    title="Message delivery partner"
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '50%',
                      border: '1px solid #E7EAE3',
                      backgroundColor: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <MessageSquare size={16} color="#20251F" />
                  </button>
                </div>
              </div>
            )}

            {/* Delivery Milestones Progress */}
            {isCurrentOrderActive && (
              <div style={{ marginBottom: '22px' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#20251F', margin: '0 0 14px 0' }}>
                  Delivery Progress
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {steps.map((st, idx) => {
                    const isPast = idx < effectiveStep;
                    const isCurrent = idx === effectiveStep;
                    return (
                      <div key={st.title} style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <div style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: isPast ? '#238636' : (isCurrent ? '#B7F34A' : '#EAECE6'),
                            color: isPast ? '#FFFFFF' : '#20251F',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '11px',
                            fontWeight: 700
                          }}>
                            {isPast ? <Check size={13} strokeWidth={3} /> : idx + 1}
                          </div>
                          {idx < steps.length - 1 && (
                            <div style={{
                              width: '2px',
                              height: '24px',
                              backgroundColor: isPast ? '#238636' : '#EAECE6',
                              margin: '4px 0'
                            }} />
                          )}
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: isCurrent ? '#20251F' : (isPast ? '#238636' : '#73796F') }}>
                            {st.title}
                          </div>
                          <div style={{ fontSize: '11px', color: '#73796F' }}>
                            {st.subtitle}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Order Items Summary Card */}
            <div style={{
              border: '1px solid #E7EAE3',
              borderRadius: '16px',
              padding: '16px',
              backgroundColor: '#FFFFFF',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#20251F' }}>
                  Items in this Order ({currentOrder?.items?.length || 1})
                </span>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#238636' }}>
                  Total: ₹{currentOrder?.total?.toLocaleString('en-IN') || 1846}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {currentOrder?.items?.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <img 
                      src={it.image || '/assets/figma/product_court_sneaker.png'} 
                      alt={it.name}
                      style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover', border: '1px solid #E7EAE3' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F' }}>
                        {it.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#73796F', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                        <span>{it.shop || 'Sole Street'}</span>
                        <span>·</span>
                        <span style={{ backgroundColor: '#F0F3ED', padding: '1px 6px', borderRadius: '4px', fontWeight: 600 }}>
                          {it.variant || 'Standard'}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F' }}>
                      ₹{it.price}
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Address Row */}
              <div style={{ borderTop: '1px solid #E7EAE3', marginTop: '14px', paddingTop: '12px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={16} color="#24452D" style={{ marginTop: '2px', flexShrink: 0 }} />
                <div style={{ fontSize: '12px' }}>
                  <div style={{ fontWeight: 700, color: '#20251F' }}>
                    Delivery to {selectedAddress?.title || 'Home · Indiranagar'}
                  </div>
                  <div style={{ color: '#73796F', marginTop: '2px' }}>
                    {selectedAddress?.street || 'A-302, Maple Court, 12th Main Road'}, {selectedAddress?.area || 'Indiranagar'}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Details Card */}
            <div style={{
              border: '1px solid #E7EAE3',
              borderRadius: '16px',
              padding: '16px',
              backgroundColor: '#FAFAF8',
              marginBottom: '18px'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F', marginBottom: '10px' }}>
                Payment Summary
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px', color: '#73796F' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Item Subtotal</span>
                  <span style={{ color: '#20251F', fontWeight: 600 }}>₹{currentOrder?.subtotal?.toLocaleString('en-IN') || 1798}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Delivery Fee</span>
                  <span style={{ color: '#20251F', fontWeight: 600 }}>{currentOrder?.delivery ? `₹${currentOrder.delivery}` : 'FREE'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Platform & Safety Fee</span>
                  <span style={{ color: '#20251F', fontWeight: 600 }}>₹{currentOrder?.platformFee || 9}</span>
                </div>
                <div style={{ borderTop: '1px solid #E7EAE3', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800, color: '#20251F' }}>
                  <span>Total Amount Paid</span>
                  <span style={{ color: '#24452D' }}>₹{currentOrder?.total?.toLocaleString('en-IN') || 1846}</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '10px', fontSize: '11px', color: '#73796F' }}>
                <CreditCard size={13} color="#24452D" />
                <span>Paid via {currentOrder?.paymentMethod || 'UPI (aarav.shah@okaxis)'}</span>
              </div>
            </div>

            {/* Action Buttons (Help, Invoice, Cancel) */}
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={() => setShowSupportModal(true)}
                style={{
                  flex: 1,
                  border: '1px solid #E7EAE3',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  backgroundColor: '#FFFFFF',
                  color: '#20251F',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <HelpCircle size={16} />
                <span>Customer Support</span>
              </button>

              <button
                onClick={() => setSelectedInvoiceOrder(currentOrder)}
                style={{
                  border: '1px solid #E7EAE3',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  backgroundColor: '#FFFFFF',
                  color: '#20251F',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <FileText size={16} />
                <span>Receipt</span>
              </button>

              {isCurrentOrderActive && (
                <button
                  onClick={() => setShowCancelModal(true)}
                  style={{
                    border: '1px solid #FCA5A5',
                    borderRadius: '12px',
                    padding: '12px 16px',
                    backgroundColor: '#FFFFFF',
                    color: '#BD3838',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 2: ORDER HISTORY SECTION
            ============================================================== */}
        {activeTab === 'history' && (
          <div>
            {/* Filter Chips */}
            <div className="nivvo-orders-filter-chips">
              {[
                { id: 'all', label: `All (${orders.length})` },
                { id: 'active', label: 'In Progress' },
                { id: 'delivered', label: 'Delivered' },
                { id: 'cancelled', label: 'Cancelled' }
              ].map(f => (
                <button
                  key={f.id}
                  className={`nivvo-orders-filter-chip ${historyFilter === f.id ? 'active' : ''}`}
                  onClick={() => { playClickSound(); setHistoryFilter(f.id); }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Orders Stack */}
            {filteredOrders.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '48px 20px',
                backgroundColor: '#F7F8F5',
                borderRadius: '18px'
              }}>
                <Package size={36} color="#73796F" style={{ margin: '0 auto 10px auto', opacity: 0.5 }} />
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#20251F', margin: '0 0 6px 0' }}>
                  No orders found
                </h3>
                <p style={{ fontSize: '12px', color: '#73796F', margin: '0 0 16px 0' }}>
                  No orders match this status filter.
                </p>
                <button
                  onClick={() => navigateTo('categories')}
                  style={{
                    backgroundColor: '#20251F',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Explore Categories
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredOrders.map(ord => {
                  const isDelivered = ord.status === 'delivered';
                  const isCancelled = ord.status === 'cancelled';
                  const isActive = !isDelivered && !isCancelled;

                  return (
                    <div key={ord.id} className="nivvo-pro-order-card">
                      {/* Order Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 800, color: '#20251F' }}>
                              Order {ord.id}
                            </span>
                            {ord.review && (
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#24452D', fontWeight: 800 }}>
                                <Star size={11} fill="#24452D" />
                                <span>{ord.review.rating}</span>
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px' }}>
                            Placed {ord.placedAt} · {ord.paymentMethod || 'UPI'}
                          </div>
                        </div>

                        <span className={`nivvo-pro-chip ${isDelivered ? 'delivered' : (isCancelled ? 'cancelled' : 'active')}`}>
                          {isDelivered ? (
                            <>
                              <CheckCircle2 size={12} />
                              <span>Delivered</span>
                            </>
                          ) : isCancelled ? (
                            <>
                              <XCircle size={12} />
                              <span>Cancelled</span>
                            </>
                          ) : (
                            <>
                              <Bike size={12} />
                              <span>Out for delivery</span>
                            </>
                          )}
                        </span>
                      </div>

                      {/* Items List */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
                        {ord.items?.map((it, idx) => (
                          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img 
                              src={it.image || '/assets/figma/product_court_sneaker.png'} 
                              alt={it.name}
                              style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E7EAE3' }}
                            />
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>
                                {it.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#73796F' }}>
                                {it.shop || 'Sole Street'} · {it.variant || 'Standard'}
                              </div>
                            </div>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>
                              ₹{it.price}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total and Refund note */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E7EAE3', paddingTop: '10px', marginBottom: '12px' }}>
                        <span style={{ fontSize: '12px', color: '#73796F' }}>
                          Total ({ord.items?.length || 1} item{ord.items?.length > 1 ? 's' : ''}):
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 800, color: '#20251F' }}>
                          ₹{ord.total?.toLocaleString('en-IN') || 1846}
                        </span>
                      </div>

                      {ord.refundStatus && (
                        <div style={{
                          fontSize: '11px',
                          color: isCancelled ? '#BD3838' : '#238636',
                          backgroundColor: isCancelled ? '#FEE2E2' : '#E8F5E9',
                          padding: '6px 10px',
                          borderRadius: '8px',
                          marginBottom: '12px',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {isCancelled ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                          <span>{ord.refundStatus}</span>
                        </div>
                      )}

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {isActive && (
                          <button
                            onClick={() => {
                              setSelectedOrderId(ord.id);
                              setActiveTab('tracking');
                            }}
                            style={{
                              flex: 1,
                              backgroundColor: '#24452D',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '10px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <Navigation size={13} />
                            <span>Live Track</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleReorder(ord)}
                          style={{
                            flex: 1,
                            backgroundColor: '#20251F',
                            color: '#FFFFFF',
                            border: 'none',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <RotateCcw size={13} />
                          <span>Reorder</span>
                        </button>

                        <button
                          onClick={() => setSelectedInvoiceOrder(ord)}
                          style={{
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #E7EAE3',
                            color: '#20251F',
                            borderRadius: '10px',
                            padding: '8px 12px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <FileText size={13} />
                          <span>Receipt</span>
                        </button>

                        {isDelivered && (
                          <button
                            onClick={() => {
                              setReturnOrderTarget(ord);
                              setReturnType('exchange');
                            }}
                            style={{
                              backgroundColor: '#FFFFFF',
                              border: '1px solid #E7EAE3',
                              color: '#20251F',
                              borderRadius: '10px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <RefreshCw size={13} />
                            <span>Exchange</span>
                          </button>
                        )}

                        {isDelivered && !ord.review && (
                          <button
                            onClick={() => {
                              setReviewOrderTarget(ord);
                              setReviewRating(5);
                            }}
                            style={{
                              backgroundColor: '#F0F3ED',
                              border: '1px solid #C4D9BC',
                              color: '#24452D',
                              borderRadius: '10px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px'
                            }}
                          >
                            <Star size={13} fill="#24452D" />
                            <span>Rate</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==============================================================
          MODAL 1: TAX INVOICE & RECEIPT MODAL
          ============================================================== */}
      {selectedInvoiceOrder && (
        <div className="nivvo-modal-overlay" onClick={() => setSelectedInvoiceOrder(null)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14281C' }}>
                  Order Receipt
                </h3>
                <span style={{ fontSize: '12px', color: '#687163' }}>Order #{selectedInvoiceOrder.id}</span>
              </div>
              <button className="nivvo-modal-close-btn" onClick={() => setSelectedInvoiceOrder(null)}>✕</button>
            </div>

            <div style={{ border: '1px solid #E5E7DE', borderRadius: '12px', padding: '12px 14px', backgroundColor: '#F8F9F6', marginTop: '12px', marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#687163' }}>Store:</span>
                <span style={{ color: '#14281C', fontWeight: 600 }}>{selectedInvoiceOrder.shopName || selectedInvoiceOrder.shop || 'Sole Street Originals'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#687163' }}>Customer:</span>
                <span style={{ color: '#14281C', fontWeight: 600 }}>{currentUser?.name || 'Aarav Shah'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#687163' }}>Payment:</span>
                <span style={{ color: '#14281C', fontWeight: 600 }}>{selectedInvoiceOrder.paymentMethod || 'UPI'}</span>
              </div>
            </div>

            <div style={{ borderBottom: '1px solid #E5E7DE', paddingBottom: '12px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#687163', marginBottom: '6px' }}>
                <span>Item Subtotal:</span>
                <span style={{ color: '#14281C', fontWeight: 600 }}>₹{selectedInvoiceOrder.subtotal?.toLocaleString('en-IN') || 1798}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#687163', marginBottom: '6px' }}>
                <span>Delivery Fee:</span>
                <span style={{ color: selectedInvoiceOrder.delivery ? '#14281C' : '#15803D', fontWeight: 600 }}>
                  {selectedInvoiceOrder.delivery ? `₹${selectedInvoiceOrder.delivery}` : 'FREE'}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#687163', marginBottom: '6px' }}>
                <span>Platform Fee:</span>
                <span style={{ color: '#14281C', fontWeight: 600 }}>₹{selectedInvoiceOrder.platformFee || 9}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', fontWeight: 900, color: '#14281C', marginTop: '10px', paddingTop: '8px', borderTop: '1px solid #E5E7DE' }}>
                <span>Total Paid:</span>
                <span style={{ color: '#1F4230' }}>₹{selectedInvoiceOrder.total?.toLocaleString('en-IN') || 1846}</span>
              </div>
            </div>

            <button
              onClick={() => {
                playTrialSound();
                downloadReceiptPdf(selectedInvoiceOrder, currentUser || { name: 'Aarav Shah', phone: '+91 98765 43210' });
                showToast(`Receipt downloaded for ${selectedInvoiceOrder.id}`);
                setSelectedInvoiceOrder(null);
              }}
              style={{
                width: '100%',
                backgroundColor: '#1F4230',
                color: '#FFFFFF',
                border: 'none',
                padding: '12px',
                borderRadius: '12px',
                fontWeight: 700,
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Download size={15} />
              <span>Download Receipt (PDF)</span>
            </button>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL 2: CANCEL ORDER MODAL
          ============================================================== */}
      {showCancelModal && (
        <div className="nivvo-modal-overlay" onClick={() => setShowCancelModal(false)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
                Cancel Order {currentOrder?.id || 'NV-1048'}
              </h3>
              <button className="nivvo-modal-close-btn" onClick={() => setShowCancelModal(false)}>✕</button>
            </div>
            <p style={{ fontSize: '13px', color: '#73796F', margin: '4px 0 16px 0' }}>
              Please select a cancellation reason. Total of ₹{currentOrder?.total || 1846} will be refunded to your Nivvo Wallet immediately.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                'Need to change delivery address',
                'Ordered wrong shoe size or variant',
                'ETA too late for my schedule',
                'Accidental order'
              ].map((reason) => (
                <div 
                  key={reason}
                  onClick={() => setCancelReason(reason)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: cancelReason === reason ? '1.5px solid #BD3838' : '1px solid #E7EAE3',
                    backgroundColor: cancelReason === reason ? '#FEE2E2' : '#FFFFFF',
                    color: cancelReason === reason ? '#BD3838' : '#20251F',
                    fontSize: '12px',
                    fontWeight: cancelReason === reason ? 700 : 500,
                    cursor: 'pointer'
                  }}
                >
                  {reason}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowCancelModal(false)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E7EAE3', backgroundColor: '#F7F8F5', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Keep Order
              </button>
              <button
                onClick={() => {
                  cancelOrder(currentOrder?.id || 'NV-1048', cancelReason);
                  setShowCancelModal(false);
                }}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#BD3838', color: '#FFFFFF', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL 3: RETURN & SIZE EXCHANGE MODAL
          ============================================================== */}
      {returnOrderTarget && (
        <div className="nivvo-modal-overlay" onClick={() => setReturnOrderTarget(null)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
                Doorstep Return / Exchange
              </h3>
              <button className="nivvo-modal-close-btn" onClick={() => setReturnOrderTarget(null)}>✕</button>
            </div>
            <p style={{ fontSize: '13px', color: '#73796F', margin: '4px 0 16px 0' }}>
              Order {returnOrderTarget.id}. An Indiranagar courier will arrive in ~15 mins for doorstep service.
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <button
                type="button"
                onClick={() => setReturnType('exchange')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: returnType === 'exchange' ? '2px solid #24452D' : '1px solid #E7EAE3',
                  backgroundColor: returnType === 'exchange' ? '#EEF4EC' : '#FFFFFF',
                  color: returnType === 'exchange' ? '#24452D' : '#20251F',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Size Exchange (Free)
              </button>
              <button
                type="button"
                onClick={() => setReturnType('return')}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '10px',
                  border: returnType === 'return' ? '2px solid #24452D' : '1px solid #E7EAE3',
                  backgroundColor: returnType === 'return' ? '#EEF4EC' : '#FFFFFF',
                  color: returnType === 'return' ? '#24452D' : '#20251F',
                  fontWeight: 800,
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                Full Return & Refund
              </button>
            </div>

            {returnType === 'exchange' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
                  Select Replacement Size:
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['UK 7', 'UK 8', 'UK 9', 'UK 10'].map(sz => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setExchangeSize(sz)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: exchangeSize === sz ? '2px solid #20251F' : '1px solid #E7EAE3',
                        backgroundColor: exchangeSize === sz ? '#20251F' : '#FFFFFF',
                        color: exchangeSize === sz ? '#FFFFFF' : '#20251F',
                        fontWeight: 800,
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => {
                requestReturnOrExchange(returnOrderTarget.id, returnType, {
                  newSize: exchangeSize,
                  reason: returnReason
                });
                setReturnOrderTarget(null);
              }}
              style={{
                width: '100%',
                backgroundColor: '#20251F',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              {returnType === 'exchange' ? `Confirm Dispatch for Size ${exchangeSize}` : 'Schedule Doorstep Pickup & Refund'}
            </button>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL 4: RATE & REVIEW MODAL
          ============================================================== */}
      {reviewOrderTarget && (
        <div className="nivvo-modal-overlay" onClick={() => setReviewOrderTarget(null)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
                Rate Order {reviewOrderTarget.id}
              </h3>
              <button className="nivvo-modal-close-btn" onClick={() => setReviewOrderTarget(null)}>✕</button>
            </div>
            <p style={{ fontSize: '13px', color: '#73796F', margin: '4px 0 16px 0' }}>
              How was your experience with Sole Street and rider {reviewOrderTarget.rider?.name || 'Ravi Kumar'}?
            </p>

            {/* Interactive Stars */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '16px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => { playClickSound(); setReviewRating(star); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  aria-label={`${star} Stars`}
                >
                  <Star 
                    size={32} 
                    fill={reviewRating >= star ? '#24452D' : 'none'} 
                    color="#24452D" 
                  />
                </button>
              ))}
            </div>

            {/* Review Tags */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
              {['Perfect Fit', 'Fast Delivery', 'Great Packaging', 'Doorstep Trial Used', 'Polite Rider'].map((t) => {
                const active = selectedReviewTags.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setSelectedReviewTags(prev => active ? prev.filter(x => x !== t) : [...prev, t]);
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: active ? '1.5px solid #24452D' : '1px solid #E7EAE3',
                      backgroundColor: active ? '#EEF4EC' : '#FFFFFF',
                      color: active ? '#24452D' : '#73796F',
                      fontSize: '11px',
                      fontWeight: active ? 800 : 600,
                      cursor: 'pointer'
                    }}
                  >
                    {t}
                  </button>
                );
              })}
            </div>

            <textarea
              placeholder="Tell us about the fit, quality, or delivery experience..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              style={{
                width: '100%',
                height: '70px',
                padding: '10px',
                borderRadius: '10px',
                border: '1px solid #E7EAE3',
                fontSize: '12px',
                marginBottom: '16px',
                fontFamily: 'inherit'
              }}
            />

            <button
              onClick={() => {
                submitOrderReview(reviewOrderTarget.id, reviewRating, selectedReviewTags, reviewComment);
                setReviewOrderTarget(null);
              }}
              style={{
                width: '100%',
                backgroundColor: '#20251F',
                color: '#FFFFFF',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Submit Feedback
            </button>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL 5: CUSTOMER SUPPORT MODAL
          ============================================================== */}
      {showSupportModal && (
        <div className="nivvo-modal-overlay" onClick={() => setShowSupportModal(false)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
                Nivvo Support Desk
              </h3>
              <button className="nivvo-modal-close-btn" onClick={() => setShowSupportModal(false)}>✕</button>
            </div>
            <p style={{ fontSize: '13px', color: '#73796F', margin: '4px 0 16px 0' }}>
              How can we assist you with Order {currentOrder?.id || 'NV-1048'}?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                'Change delivery instructions / gate code',
                'Report a route delay or ETA question',
                'Incorrect or missing item in package',
                'Request doorstep return or exchange window'
              ].map((topic) => (
                <button
                  key={topic}
                  onClick={() => {
                    playClickSound();
                    setShowSupportModal(false);
                    showToast('Support specialist Priya assigned to your request.');
                  }}
                  style={{
                    textAlign: 'left',
                    backgroundColor: '#F7F8F5',
                    border: '1px solid #E7EAE3',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#20251F',
                    cursor: 'pointer'
                  }}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
