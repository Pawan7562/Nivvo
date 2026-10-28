import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowRight, ChevronRight,
  TrendingUp, Clock, ShoppingBag, Bell, Menu, 
  Zap, CheckCircle2, MapPin, X, PhoneCall, ShieldAlert,
  Radio, PowerOff, BatteryCharging, Headphones
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';

export default function NivvoRiderDutyView({ onBack, onAcceptJob }) {
  const { 
    riderProfile, 
    toggleRiderDuty, 
    deliveryOffers, 
    acceptRiderJob, 
    declineRiderJob, 
    activeDeliveryJob,
    setActiveModal, 
    showToast,
    navigateTo,
    currentUser,
    setAuthModalOpen,
    setAuthModalRole,
    switchToCustomerMode,
    riderNotifications,
    markRiderNotificationRead,
    markAllRiderNotificationsRead
  } = useNivvo();

  const [countdown, setCountdown] = useState(25);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);

  const unreadNotifCount = riderNotifications?.filter(n => !n.read)?.length || 0;

  // 25-second countdown timer for incoming delivery offers
  useEffect(() => {
    if (!riderProfile.is_online) return;
    const interval = setInterval(() => {
      setCountdown(prev => (prev > 1 ? prev - 1 : 25));
    }, 1000);
    return () => clearInterval(interval);
  }, [riderProfile.is_online]);

  const handleQuickDecline = (offerId) => {
    playClickSound();
    declineRiderJob(offerId, 'Declined by partner');
    showToast('Delivery passed. Looking for new orders...');
  };

  return (
    <div style={{ backgroundColor: '#F4F5EE', minHeight: '100%', paddingBottom: '96px', position: 'relative' }}>
      
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
          
          {/* Identity & Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0, flex: 1 }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#1F4230',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Zap size={18} color="#C6F432" strokeWidth={2.5} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontSize: '15px',
                fontWeight: 800,
                color: '#14281C',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                lineHeight: 1.2
              }}>
                {(currentUser?.role === 'rider' && currentUser.name) || riderProfile.name || 'Ravi Kumar'}
              </div>
              <div style={{
                fontSize: '11px',
                color: '#6B7265',
                marginTop: '2px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
                ID: {riderProfile.partner_id || 'RDR-1082'} · Indiranagar Hub #14
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {/* Header Duty Toggle Button */}
            <button
              onClick={toggleRiderDuty}
              style={{
                backgroundColor: riderProfile.is_online ? '#1F4230' : '#F0F2EB',
                color: riderProfile.is_online ? '#C6F432' : '#4B5563',
                border: riderProfile.is_online ? '1px solid #1F4230' : '1px solid #E2E4DC',
                padding: '6px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              title={riderProfile.is_online ? 'Pause duty (Go Offline)' : 'Start duty (Go Online)'}
              aria-label={riderProfile.is_online ? 'Go Offline' : 'Go Online'}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: riderProfile.is_online ? '#C6F432' : '#9CA3AF'
              }} />
              <span>{riderProfile.is_online ? 'Online' : 'Offline'}</span>
            </button>

            {/* Notifications */}
            <button
              onClick={() => { playClickSound(); setShowNotificationsModal(true); }}
              style={{
                position: 'relative',
                backgroundColor: '#F9FAF7',
                border: '1px solid #E5E7DE',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#14281C',
                flexShrink: 0
              }}
              aria-label="Notifications"
            >
              <Bell size={15} strokeWidth={2.2} />
              {unreadNotifCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '5px',
                  right: '5px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#C6F432',
                  border: '1.5px solid #14281C'
                }} />
              )}
            </button>

            {/* Chat Support */}
            <button
              onClick={() => { playClickSound(); navigateTo('rider-support'); }}
              style={{
                backgroundColor: '#F9FAF7',
                border: '1px solid #E5E7DE',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#1F4230',
                flexShrink: 0
              }}
              title="Dispatch Chat Support & Call Request"
              aria-label="Chat Support"
            >
              <Headphones size={15} strokeWidth={2.2} />
            </button>

            {/* Quick Menu */}
            <button
              onClick={() => { playClickSound(); setActiveModal('riderMenu'); }}
              style={{
                backgroundColor: '#F9FAF7',
                border: '1px solid #E5E7DE',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#14281C',
                flexShrink: 0
              }}
              aria-label="Menu"
            >
              <Menu size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      </div>

      {/* ─── Main Content ─── */}
      <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '14px', maxWidth: '520px', margin: '0 auto' }}>

        {/* ─── Incoming Orders Section (When Online) ─── */}
        {riderProfile.is_online ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Header: Status & Auto-refresh */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#15803D' }} />
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#14281C', margin: 0 }}>
                  Available Orders ({deliveryOffers.length})
                </h3>
              </div>
              {deliveryOffers.length > 0 && (
                <span style={{
                  backgroundColor: '#FEF3C7',
                  color: '#B45309',
                  padding: '4px 10px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Clock size={11} color="#B45309" />
                  <span>{countdown}s remaining</span>
                </span>
              )}
            </div>

            {deliveryOffers.length === 0 ? (
              /* Minimal Waiting Radar */
              <div style={{
                textAlign: 'center',
                padding: '36px 20px',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E5E7DE',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#E8F5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#15803D'
                }}>
                  <Radio size={22} strokeWidth={2.2} />
                </div>

                <div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>
                    Looking for nearby orders
                  </div>
                  <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '2px' }}>
                    Indiranagar Hub #14 · Online
                  </div>
                </div>

                <button
                  onClick={toggleRiderDuty}
                  style={{
                    marginTop: '4px',
                    backgroundColor: '#F4F5EE',
                    color: '#4B5563',
                    border: '1px solid #E5E7DE',
                    padding: '8px 18px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Pause Duty (Go Offline)
                </button>
              </div>
            ) : (
              /* Offers List - Clean, Professional & Order-Focused */
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {deliveryOffers.map((offer) => (
                  <div
                    key={offer.id}
                    style={{
                      border: '1px solid #E5E7DE',
                      borderRadius: '16px',
                      padding: '16px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    {/* Top Row: Payout & Fast Stats */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: '24px', fontWeight: 800, color: '#14281C', letterSpacing: '-0.02em', lineHeight: 1 }}>
                          ₹{offer.payout}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '3px', fontWeight: 600 }}>
                          Order #{offer.order_id?.replace('NV-', '') || offer.order_id}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          backgroundColor: '#F4F5EE',
                          color: '#14281C',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700
                        }}>
                          {offer.totalDistance} · {offer.estTime}
                        </span>
                        <span style={{
                          backgroundColor: '#FEF3C7',
                          color: '#B45309',
                          padding: '4px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px'
                        }}>
                          <Clock size={11} color="#B45309" />
                          <span>{offer.secondsRemaining || countdown}s</span>
                        </span>
                      </div>
                    </div>

                    {/* Route Details */}
                    <div style={{
                      backgroundColor: '#F9FAF7',
                      borderRadius: '12px',
                      padding: '12px',
                      border: '1px solid #EAECE5',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px'
                    }}>
                      {/* Pickup */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#15803D',
                          marginTop: '5px',
                          flexShrink: 0
                        }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C', display: 'flex', justifyContent: 'space-between' }}>
                            <span>{offer.shops?.[0]?.name || 'Store Pickup'}</span>
                            <span style={{ fontSize: '11px', color: '#6B7265', fontWeight: 500 }}>{offer.shops?.[0]?.distance || '0.4 km'}</span>
                          </div>
                          <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '1px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {offer.shops?.[0]?.item || '1 item ready'}
                          </div>
                        </div>
                      </div>

                      {/* Connecting Line */}
                      <div style={{ width: '1px', height: '10px', backgroundColor: '#D5D8CF', marginLeft: '3.5px', marginTop: '-6px', marginBottom: '-6px' }} />

                      {/* Dropoff */}
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                        <div style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          backgroundColor: '#1F4230',
                          marginTop: '5px',
                          flexShrink: 0
                        }} />
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                            {offer.customer?.name || 'Customer'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '1px' }}>
                            {offer.customer?.area || 'Indiranagar'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px', marginTop: '2px' }}>
                      <button
                        onClick={() => handleQuickDecline(offer.id)}
                        style={{
                          backgroundColor: '#F4F5EE',
                          color: '#4B5563',
                          border: '1px solid #E5E7DE',
                          padding: '11px',
                          borderRadius: '10px',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer',
                          minHeight: '44px'
                        }}
                      >
                        Decline
                      </button>

                      <button
                        onClick={() => {
                          playTrialSound();
                          acceptRiderJob(offer.id);
                          onAcceptJob();
                        }}
                        style={{
                          backgroundColor: '#B7F34A',
                          color: '#20251F',
                          border: 'none',
                          padding: '11px',
                          borderRadius: '10px',
                          fontWeight: 800,
                          fontSize: '13px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          cursor: 'pointer',
                          minHeight: '44px',
                          boxShadow: '0 2px 8px rgba(183, 243, 74, 0.35)'
                        }}
                      >
                        <span>Accept Order (₹{offer.payout})</span>
                        <ArrowRight size={15} color="#20251F" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ─── Offline State (Professional & Clean) ─── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Duty Status Hero Card */}
            <div style={{
              textAlign: 'center',
              padding: '28px 20px',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E7DE',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              {/* Status Badge */}
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#F3F4F1', padding: '4px 12px', borderRadius: '999px', marginBottom: '14px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#9CA3AF' }} />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#4B5563', letterSpacing: '0.04em' }}>
                  DUTY PAUSED
                </span>
              </div>

              {/* Icon */}
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: '16px',
                backgroundColor: '#F4F5EE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                border: '1px solid #E5E7DE'
              }}>
                <PowerOff size={24} color="#6B7265" strokeWidth={2.2} />
              </div>

              <div style={{ fontSize: '17px', fontWeight: 800, color: '#14281C', marginBottom: '4px' }}>
                You are currently off duty
              </div>
              <div style={{ fontSize: '12px', color: '#6B7265', marginBottom: '18px', maxWidth: '280px', margin: '0 auto 18px auto', lineHeight: 1.5 }}>
                Turn duty on whenever you are ready to receive 10-minute doorstep try-on delivery jobs in Indiranagar.
              </div>

              <button
                onClick={toggleRiderDuty}
                style={{
                  backgroundColor: '#1F4230',
                  color: '#FFFFFF',
                  border: 'none',
                  width: '100%',
                  maxWidth: '260px',
                  padding: '13px 24px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(31,66,48,0.2)'
                }}
              >
                <Zap size={16} color="#C6F432" strokeWidth={2.5} />
                <span>Go Online</span>
              </button>
            </div>

            {/* Operating Zone & Readiness Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              border: '1px solid #E5E7DE',
              padding: '16px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>
                  Assigned Hub & Cluster
                </div>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  backgroundColor: '#E8F5E9',
                  color: '#15803D',
                  border: '1px solid #C8E6C9'
                }}>
                  High Demand
                </span>
              </div>

              <div style={{
                backgroundColor: '#F9FAF7',
                borderRadius: '12px',
                padding: '12px',
                border: '1px solid #EAECE5',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '12px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  backgroundColor: '#EAECE5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <MapPin size={18} color="#1F4230" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                    Indiranagar Hub #14
                  </div>
                  <div style={{ fontSize: '11px', color: '#6B7265' }}>
                    100ft Road Cluster · Bengaluru
                  </div>
                </div>
              </div>

              {/* Status Readiness Checklist */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #F0F2EB', paddingTop: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#4B5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#15803D" />
                    GPS Location Accuracy
                  </span>
                  <span style={{ fontWeight: 700, color: '#15803D', fontSize: '11px' }}>High (Ready)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                  <span style={{ color: '#4B5563', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={14} color="#15803D" />
                    Delivery Partner Status
                  </span>
                  <span style={{ fontWeight: 700, color: '#15803D', fontSize: '11px' }}>Verified</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ─── Notifications Modal ─── */}
      {showNotificationsModal && (
        <div className="nivvo-modal-overlay" onClick={() => setShowNotificationsModal(false)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Bell size={17} color="#1F4230" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                  Alerts & Announcements
                </h3>
              </div>
              <button className="nivvo-modal-close-btn" onClick={() => setShowNotificationsModal(false)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '4px 0 12px 0' }}>
              <span style={{ fontSize: '12px', color: '#6B7265' }}>
                Indiranagar Hub updates
              </span>
              <button
                onClick={markAllRiderNotificationsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1F4230',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Mark all as read
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {riderNotifications?.map((n) => (
                <div
                  key={n.id}
                  onClick={() => markRiderNotificationRead(n.id)}
                  style={{
                    backgroundColor: n.read ? '#FFFFFF' : '#F9FAF7',
                    border: '1px solid #E5E7DE',
                    borderRadius: '12px',
                    padding: '12px',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                      {n.title}
                    </span>
                    <span style={{ fontSize: '10px', color: '#6B7265' }}>
                      {n.time}
                    </span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#6B7265', margin: 0, lineHeight: 1.4 }}>
                    {n.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
