import React, { useState, useRef } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowLeft, Navigation, Phone, Check, 
  MapPin, Clock, Package, ChevronRight, Search, 
  CheckCircle2, X, Menu, Headphones, Store, User
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';
import LiveGpsMapTracker from '../../components/LiveGpsMapTracker';

export default function NivvoRiderView({ onBack }) {
  const { 
    activeDeliveryJob, 
    advanceDeliveryStage, 
    verifyDropoffPin, 
    riderProfile,
    riderTripsHistory,
    setActiveModal, 
    showToast,
    navigateTo 
  } = useNivvo();

  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHistoryTrip, setSelectedHistoryTrip] = useState(null);

  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);

  const job = activeDeliveryJob;
  const stage = job?.stage || 'accepted';
  const isDelivered = stage === 'delivered';
  const isAtDoorstep = stage === 'arrived_dropoff';
  const isPickingUp = stage === 'reaching_shop';
  const isAccepted = stage === 'accepted';
  const isOnTheWay = stage === 'picked_up' || stage === 'on_the_way';

  const [isNavigating, setIsNavigating] = useState(false);
  const mapSectionRef = useRef(null);

  // In-App Navigation (keeps delivery partner completely inside the app)
  const handleStartInAppNavigation = (destinationLabel) => {
    playClickSound();
    setIsNavigating(true);
    showToast(`In-app turn-by-turn navigation started for ${destinationLabel || 'destination'}`);
    mapSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Handle customer PIN verification
  const handleVerifyDelivery = (e) => {
    if (e) e.preventDefault();
    if (!pinInput || pinInput.length < 4) {
      setPinError(true);
      showToast('Enter the 4-digit customer PIN (Hint: 4829)');
      return;
    }

    const success = verifyDropoffPin(pinInput);
    if (success) {
      setPinError(false);
      showToast('Delivery verified. ₹' + (job?.pay || 72) + ' added to wallet.');
    } else {
      setPinError(true);
    }
  };

  const filteredTrips = riderTripsHistory.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.desc.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const firstShop = job?.pickups?.[0] || {
    shop: 'Sole Street Originals',
    address: '100ft Road, Indiranagar',
    item: 'Everyday Court Sneaker'
  };

  return (
    <div style={{ backgroundColor: '#F4F5EE', minHeight: '100%', paddingBottom: '100px', position: 'relative' }}>
      
      {/* ─── Top Header Bar ─── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '12px 16px',
        borderBottom: '1px solid #E5E7DE',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={onBack} 
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#14281C',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              title="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>
                {activeTab === 'active' 
                  ? (job ? `Order #${job.order_id?.replace('NV-', '') || job.order_id}` : 'Active Delivery')
                  : 'Past Deliveries'}
              </span>
              {activeTab === 'active' && job && (
                <span style={{
                  backgroundColor: '#E8F5E9',
                  color: '#15803D',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  ₹{job.pay}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => { playClickSound(); setActiveModal('riderSafety'); }}
              style={{
                backgroundColor: '#FEE2E2',
                color: '#DC2626',
                border: '1px solid #FCA5A5',
                padding: '5px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
              title="Emergency SOS"
            >
              SOS
            </button>

            <button
              onClick={() => { playClickSound(); navigateTo('rider-support'); }}
              style={{
                backgroundColor: '#F4F5EE',
                border: '1px solid #E5E7DE',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#1F4230'
              }}
              title="Rider Support"
              aria-label="Support"
            >
              <Headphones size={15} />
            </button>

            <button
              onClick={() => { playClickSound(); setActiveModal('riderMenu'); }}
              style={{
                backgroundColor: '#F4F5EE',
                border: '1px solid #E5E7DE',
                borderRadius: '50%',
                width: '34px',
                height: '34px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#14281C'
              }}
              aria-label="Menu"
            >
              <Menu size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* ─── Minimal Segmented Switcher (Only if rider has past history or wants to toggle) ─── */}
        <div style={{
          display: 'flex',
          backgroundColor: '#EAECE5',
          padding: '3px',
          borderRadius: '10px',
          gap: '4px'
        }}>
          <button 
            onClick={() => { playClickSound(); setActiveTab('active'); }}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: activeTab === 'active' ? 700 : 600,
              backgroundColor: activeTab === 'active' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'active' ? '#14281C' : '#6B7265',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              boxShadow: activeTab === 'active' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <span>Current Order</span>
            {job && !isDelivered && (
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803D' }} />
            )}
          </button>

          <button 
            onClick={() => { playClickSound(); setActiveTab('history'); }}
            style={{
              flex: 1,
              padding: '7px 12px',
              borderRadius: '8px',
              fontSize: '12px',
              fontWeight: activeTab === 'history' ? 700 : 600,
              backgroundColor: activeTab === 'history' ? '#FFFFFF' : 'transparent',
              color: activeTab === 'history' ? '#14281C' : '#6B7265',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: activeTab === 'history' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none'
            }}
          >
            <span>Past Orders ({riderTripsHistory.length})</span>
          </button>
        </div>

        {/* ===================================================================
           TAB 1: LIVE ACTIVE DELIVERY (Clean & Stage-Focused)
           =================================================================== */}
        {activeTab === 'active' && (
          !job ? (
            /* Empty State */
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E7DE',
              boxShadow: '0 2px 6px rgba(0,0,0,0.02)'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto'
              }}>
                <Package size={22} color="#6B7265" />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C', marginBottom: '4px' }}>
                No Active Delivery
              </div>
              <div style={{ fontSize: '12px', color: '#6B7265', maxWidth: '280px', margin: '0 auto 18px auto', lineHeight: 1.4 }}>
                {riderProfile.is_online 
                  ? 'You are Online. Available delivery jobs will appear on your Duty dashboard.' 
                  : 'You are currently Offline. Go online to start receiving orders.'}
              </div>
              <button
                onClick={() => { playClickSound(); navigateTo('rider-duty'); }}
                style={{
                  backgroundColor: '#1F4230',
                  color: '#FFFFFF',
                  border: 'none',
                  padding: '11px 22px',
                  borderRadius: '10px',
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Go to Duty Dashboard
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              
              {/* 1. Clean 3-Stage Progress Tracker */}
              <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E7DE',
                padding: '12px 14px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      backgroundColor: isDelivered ? '#15803D' : '#1F4230'
                    }} />
                    <span style={{ fontSize: '12px', fontWeight: 800, color: '#14281C' }}>
                      {isDelivered 
                        ? 'Order Delivered' 
                        : isAtDoorstep 
                          ? 'At Customer Doorstep' 
                          : isOnTheWay 
                            ? 'On the Way to Customer' 
                            : isPickingUp 
                              ? 'At Store · Collecting Items' 
                              : 'Heading to Store (0.4 km)'}
                    </span>
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7265' }}>
                    {isDelivered ? 'Done' : '10-Min Doorstep'}
                  </span>
                </div>

                {/* Progress Indicator Bars */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                  <div style={{ height: '4px', borderRadius: '2px', backgroundColor: '#1F4230' }} />
                  <div style={{ height: '4px', borderRadius: '2px', backgroundColor: (isOnTheWay || isAtDoorstep || isDelivered) ? '#1F4230' : '#E5E7DE' }} />
                  <div style={{ height: '4px', borderRadius: '2px', backgroundColor: isDelivered ? '#15803D' : (isAtDoorstep ? '#1F4230' : '#E5E7DE') }} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#6B7265', marginTop: '6px', fontWeight: 600 }}>
                  <span style={{ color: (isAccepted || isPickingUp) ? '#14281C' : '#8A9285', fontWeight: (isAccepted || isPickingUp) ? 700 : 500 }}>1. Store Pickup</span>
                  <span style={{ color: isOnTheWay ? '#14281C' : '#8A9285', fontWeight: isOnTheWay ? 700 : 500 }}>2. On Way</span>
                  <span style={{ color: (isAtDoorstep || isDelivered) ? '#14281C' : '#8A9285', fontWeight: (isAtDoorstep || isDelivered) ? 700 : 500 }}>3. Doorstep</span>
                </div>
              </div>

              {/* Real-Time Interactive Navigation Map for Delivery Partner */}
              {!isDelivered && (
                <div ref={mapSectionRef}>
                  <LiveGpsMapTracker 
                    mode="rider"
                    address={job.customer?.address || 'Maple Court, A-302, 12th Main Road, Indiranagar'}
                    storeName={firstShop.shop || 'Sole Street Originals'}
                    storeAddress={firstShop.address || '100ft Road, Indiranagar'}
                    customerName={job.customer?.name || 'Aarav Shah'}
                    riderName={riderProfile?.name || 'Ravi Kumar'}
                    riderVehicle={riderProfile?.vehicle_type || 'Ather 450X'}
                    activeStep={
                      isDelivered ? 4 :
                      isAtDoorstep ? 3 :
                      isOnTheWay ? 2 :
                      isPickingUp ? 1 : 0
                    }
                    isNavigating={isNavigating}
                    onToggleNavigation={() => setIsNavigating(prev => !prev)}
                    height={isNavigating ? '320px' : '230px'}
                  />
                </div>
              )}

              {/* =========================================================
                 STAGE A: STORE PICKUP (When accepted or at shop)
                 ========================================================= */}
              {(isAccepted || isPickingUp) && (
                <>
                  {/* Store Pickup Card */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5E7DE',
                    padding: '16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{
                            backgroundColor: '#E8F5E9',
                            color: '#15803D',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '10px',
                            fontWeight: 800
                          }}>
                            PICKUP STORE
                          </span>
                          <span style={{ fontSize: '11px', color: '#6B7265' }}>0.4 km</span>
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                          {firstShop.shop}
                        </div>
                        <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '1px' }}>
                          {firstShop.address}
                        </div>
                      </div>

                      {/* Store Pickup PIN */}
                      <div style={{
                        backgroundColor: '#1F4230',
                        color: '#FFFFFF',
                        padding: '6px 12px',
                        borderRadius: '10px',
                        textAlign: 'center',
                        flexShrink: 0
                      }}>
                        <div style={{ fontSize: '9px', fontWeight: 700, color: '#C6F432', textTransform: 'uppercase' }}>
                          Store PIN
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '1.5px', fontFamily: 'monospace' }}>
                          {job.pickupPin || '4812'}
                        </div>
                      </div>
                    </div>

                    {/* Quick Store Actions: In-App Navigate & Call */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                      <button
                        onClick={() => handleStartInAppNavigation(firstShop.shop)}
                        style={{
                          backgroundColor: isNavigating && (isAccepted || isPickingUp) ? '#1F4230' : '#F4F5EE',
                          color: isNavigating && (isAccepted || isPickingUp) ? '#C6F432' : '#1F4230',
                          border: '1px solid #E5E7DE',
                          borderRadius: '10px',
                          padding: '10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Navigation size={14} color={isNavigating && (isAccepted || isPickingUp) ? '#C6F432' : '#1F4230'} />
                        <span>{isNavigating && (isAccepted || isPickingUp) ? 'Navigating' : 'Navigate'}</span>
                      </button>

                      <button
                        onClick={() => { playClickSound(); setActiveModal('call'); }}
                        style={{
                          backgroundColor: '#F4F5EE',
                          color: '#1F4230',
                          border: '1px solid #E5E7DE',
                          borderRadius: '10px',
                          padding: '10px',
                          fontSize: '12px',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <Phone size={14} color="#1F4230" />
                        <span>Call Store</span>
                      </button>
                    </div>
                  </div>

                  {/* Items to Collect (Clean Minimal List) */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '14px',
                    border: '1px solid #E5E7DE',
                    padding: '14px 16px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Items to Collect ({job.pickups?.length || 1})
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {job.pickups?.map((p, idx) => (
                        <div
                          key={p.id || idx}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '8px 10px',
                            backgroundColor: '#F9FAF7',
                            borderRadius: '8px',
                            border: '1px solid #EAECE5'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              backgroundColor: '#E8F5E9',
                              color: '#15803D',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}>
                              <Check size={11} strokeWidth={3} />
                            </div>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#14281C' }}>
                              {p.item}
                            </span>
                          </div>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: '#15803D' }}>
                            Ready
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Minimal Next Stop Preview */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E5E7DE',
                    fontSize: '11px',
                    color: '#6B7265'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={13} color="#6B7265" />
                      <span>Next Dropoff: <strong style={{ color: '#14281C' }}>{job.customer?.name}</strong></span>
                    </div>
                    <span>{job.distance || '1.8 km'} total</span>
                  </div>
                </>
              )}

              {/* =========================================================
                 STAGE B: OUT FOR DELIVERY & DOORSTEP DROP-OFF
                 ========================================================= */}
              {(isOnTheWay || isAtDoorstep) && (
                <>
                  {/* Customer Dropoff Card */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E5E7DE',
                    padding: '16px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.02)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <div style={{
                          backgroundColor: '#F4F5EE',
                          color: '#14281C',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '10px',
                          fontWeight: 800,
                          display: 'inline-block',
                          marginBottom: '4px'
                        }}>
                          CUSTOMER DROPOFF
                        </div>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                          {job.customer?.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#14281C', marginTop: '2px', lineHeight: 1.4, fontWeight: 500 }}>
                          {job.customer?.address}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '1px' }}>
                          {job.customer?.city}
                        </div>
                      </div>

                      {/* Call Customer Quick Action */}
                      <button
                        onClick={() => { playClickSound(); setActiveModal('call'); }}
                        style={{
                          backgroundColor: '#E8F5E9',
                          color: '#15803D',
                          border: '1px solid #C8E6C9',
                          borderRadius: '50%',
                          width: '42px',
                          height: '42px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          flexShrink: 0
                        }}
                        title="Call Customer"
                      >
                        <Phone size={17} />
                      </button>
                    </div>

                    {/* Customer Delivery Note */}
                    {job.customer?.note && (
                      <div style={{
                        backgroundColor: '#FEF3C7',
                        border: '1px solid #FDE68A',
                        padding: '8px 12px',
                        borderRadius: '8px',
                        fontSize: '11px',
                        color: '#92400E',
                        fontWeight: 600
                      }}>
                        {job.customer.note}
                      </div>
                    )}

                    {/* In-App Navigate Button */}
                    <button
                      onClick={() => handleStartInAppNavigation(job.customer?.name || 'Customer')}
                      style={{
                        backgroundColor: isNavigating && (isOnTheWay || isAtDoorstep) ? '#1F4230' : '#F4F5EE',
                        color: isNavigating && (isOnTheWay || isAtDoorstep) ? '#C6F432' : '#1F4230',
                        border: '1px solid #E5E7DE',
                        borderRadius: '10px',
                        padding: '10px',
                        fontSize: '12px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        cursor: 'pointer'
                      }}
                    >
                      <Navigation size={14} color={isNavigating && (isOnTheWay || isAtDoorstep) ? '#C6F432' : '#1F4230'} />
                      <span>{isNavigating && (isOnTheWay || isAtDoorstep) ? 'Navigating to Customer' : 'Navigate to Customer'}</span>
                    </button>
                  </div>

                  {/* 10-Min Doorstep Service Chip */}
                  <div style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '12px',
                    border: '1px solid #E5E7DE',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Clock size={14} color="#1F4230" />
                      <span style={{ fontWeight: 700, color: '#14281C' }}>10-Minute Doorstep Try-On</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#15803D', fontWeight: 700 }}>Active</span>
                  </div>

                  {/* Customer PIN Verification (When at Doorstep) */}
                  {isAtDoorstep && (
                    <form onSubmit={handleVerifyDelivery} style={{
                      backgroundColor: '#FFFFFF',
                      borderRadius: '16px',
                      border: '1.5px solid #1F4230',
                      padding: '16px',
                      boxShadow: '0 4px 12px rgba(31,66,48,0.08)'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: 800, color: '#14281C', marginBottom: '2px' }}>
                        Customer Delivery PIN
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7265', marginBottom: '12px' }}>
                        Ask {job.customer?.name} for the 4-digit code (Hint: 4829)
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          maxLength="4"
                          placeholder="4829"
                          value={pinInput}
                          onChange={(e) => {
                            setPinInput(e.target.value);
                            setPinError(false);
                          }}
                          style={{
                            width: '110px',
                            textAlign: 'center',
                            fontSize: '20px',
                            fontWeight: 800,
                            letterSpacing: '4px',
                            padding: '10px',
                            borderRadius: '10px',
                            border: pinError ? '2px solid #DC2626' : '1.5px solid #1F4230',
                            backgroundColor: '#F9FAF7',
                            color: '#14281C',
                            outline: 'none'
                          }}
                        />
                        <button
                          type="submit"
                          style={{
                            flex: 1,
                            backgroundColor: '#1F4230',
                            color: '#C6F432',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 800,
                            fontSize: '13px',
                            cursor: 'pointer',
                            minHeight: '44px'
                          }}
                        >
                          Complete Delivery
                        </button>
                      </div>

                      {pinError && (
                        <div style={{ fontSize: '11px', color: '#DC2626', fontWeight: 700, marginTop: '8px' }}>
                          Invalid PIN. Please ask customer for 4829.
                        </div>
                      )}
                    </form>
                  )}
                </>
              )}

              {/* =========================================================
                 STAGE C: DELIVERED CELEBRATION
                 ========================================================= */}
              {isDelivered && (
                <div style={{
                  backgroundColor: '#E8F5E9',
                  borderRadius: '16px',
                  border: '1.5px solid #C8E6C9',
                  padding: '24px 20px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px auto'
                  }}>
                    <CheckCircle2 size={28} color="#15803D" />
                  </div>
                  <div style={{ fontSize: '17px', fontWeight: 800, color: '#15803D', marginBottom: '4px' }}>
                    Delivery Completed!
                  </div>
                  <div style={{ fontSize: '13px', color: '#14281C', marginBottom: '16px' }}>
                    ₹{job.pay} credited to your wallet · +₹20 customer tip.
                  </div>
                  <button
                    onClick={() => { playTrialSound(); navigateTo('rider-duty'); }}
                    style={{
                      backgroundColor: '#1F4230',
                      color: '#FFFFFF',
                      border: 'none',
                      padding: '11px 24px',
                      borderRadius: '999px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    Back to Duty Dashboard
                  </button>
                </div>
              )}

              {/* ─── Sticky Primary Action Button (When not delivered & not at doorstep PIN) ─── */}
              {!isDelivered && !isAtDoorstep && (
                <div style={{
                  position: 'sticky',
                  bottom: '16px',
                  zIndex: 30,
                  marginTop: '8px'
                }}>
                  {isAccepted && (
                    <button
                      onClick={() => advanceDeliveryStage('reaching_shop')}
                      style={{
                        width: '100%',
                        backgroundColor: '#1F4230',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        minHeight: '48px',
                        boxShadow: '0 4px 14px rgba(31,66,48,0.25)'
                      }}
                    >
                      <span>I Have Arrived at Store</span>
                      <ChevronRight size={17} color="#C6F432" />
                    </button>
                  )}

                  {isPickingUp && (
                    <button
                      onClick={() => advanceDeliveryStage('picked_up')}
                      style={{
                        width: '100%',
                        backgroundColor: '#1F4230',
                        color: '#C6F432',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        minHeight: '48px',
                        boxShadow: '0 4px 14px rgba(31,66,48,0.25)'
                      }}
                    >
                      <span>Confirm Pickup & Start Delivery</span>
                      <ChevronRight size={17} color="#C6F432" />
                    </button>
                  )}

                  {isOnTheWay && (
                    <button
                      onClick={() => advanceDeliveryStage('arrived_dropoff')}
                      style={{
                        width: '100%',
                        backgroundColor: '#1F4230',
                        color: '#FFFFFF',
                        border: 'none',
                        padding: '14px',
                        borderRadius: '12px',
                        fontWeight: 800,
                        fontSize: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        minHeight: '48px',
                        boxShadow: '0 4px 14px rgba(31,66,48,0.25)'
                      }}
                    >
                      <span>I Have Arrived at Customer Door</span>
                      <MapPin size={17} color="#C6F432" />
                    </button>
                  )}
                </div>
              )}

            </div>
          )
        )}

        {/* ===================================================================
           TAB 2: COMPLETED DELIVERIES HISTORY (Clean list)
           =================================================================== */}
        {activeTab === 'history' && (
          <div>
            {/* Search Input */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '10px',
              padding: '9px 12px',
              gap: '8px',
              marginBottom: '10px'
            }}>
              <Search size={15} color="#6B7265" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  background: 'none',
                  fontSize: '13px',
                  color: '#14281C',
                  width: '100%',
                  outline: 'none'
                }}
              />
            </div>

            {/* List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredTrips.map((trip) => (
                <div
                  key={trip.id}
                  onClick={() => { playClickSound(); setSelectedHistoryTrip(trip); }}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7DE',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>
                        {trip.id}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 700,
                        backgroundColor: '#E8F5E9',
                        color: '#15803D',
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {trip.status}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#14281C' }}>
                        ₹{Number(trip.fee) + Number(trip.tip || 0)}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '2px' }}>
                    {trip.desc}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '8px',
                    paddingTop: '8px',
                    borderTop: '1px dashed #E5E7DE',
                    fontSize: '11px',
                    color: '#6B7265'
                  }}>
                    <span>{trip.distance}</span>
                    <span>{trip.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Trip Details Modal */}
      {selectedHistoryTrip && (
        <div className="nivvo-modal-overlay" onClick={() => setSelectedHistoryTrip(null)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                Trip Details · {selectedHistoryTrip.id}
              </h3>
              <button className="nivvo-modal-close-btn" onClick={() => setSelectedHistoryTrip(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: 800, color: '#14281C' }}>
                  ₹{Number(selectedHistoryTrip.fee) + Number(selectedHistoryTrip.tip || 0)}
                </span>
                <span style={{ backgroundColor: '#E8F5E9', color: '#15803D', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                  {selectedHistoryTrip.status}
                </span>
              </div>

              <div style={{ backgroundColor: '#F9FAF7', borderRadius: '10px', padding: '12px', fontSize: '12px', color: '#14281C', marginBottom: '12px', border: '1px solid #E5E7DE' }}>
                <div><strong>Route:</strong> {selectedHistoryTrip.desc}</div>
                <div style={{ color: '#6B7265', marginTop: '4px' }}>Distance: {selectedHistoryTrip.distance} · Completed at {selectedHistoryTrip.time}</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px', color: '#6B7265' }}>
                <span>Delivery base pay</span>
                <span style={{ fontWeight: 700, color: '#14281C' }}>₹{selectedHistoryTrip.fee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '12px', color: '#6B7265' }}>
                <span>Customer tip</span>
                <span style={{ fontWeight: 700, color: '#15803D' }}>₹{selectedHistoryTrip.tip || 0}</span>
              </div>

              <div style={{ borderTop: '1px solid #E5E7DE', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 800 }}>
                <span>Total Payout</span>
                <span>₹{Number(selectedHistoryTrip.fee) + Number(selectedHistoryTrip.tip || 0)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
