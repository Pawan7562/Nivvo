import React from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  X, Bike, Store, MapPin, Tag, Heart, HelpCircle, 
  Package, User, ShieldCheck, LogOut, ChevronRight, 
  Sparkles, Clock, PhoneCall
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';

export default function CustomerThreeDotMenuModal({ isOpen, onClose }) {
  const { 
    currentUser,
    selectedAddress,
    wishlist,
    setActiveModal, 
    navigateTo, 
    logoutUser,
    switchToRiderMode,
    setAuthModalOpen,
    setAuthModalRole
  } = useNivvo();

  if (!isOpen) return null;

  const handleAction = (actionFn) => {
    playClickSound();
    onClose();
    actionFn();
  };

  const menuSections = [
    {
      title: 'SWITCH MODES & PARTNER NETWORK',
      items: [
        {
          id: 'switch-rider',
          label: 'Switch to Delivery Partner Mode',
          sub: 'Earn ₹850–₹1,400 daily · 10-min drops · Instant UPI payouts',
          icon: Bike,
          iconBg: '#EEF4EC',
          iconColor: '#24452D',
          badge: 'PARTNER ⚡',
          badgeBg: '#24452D',
          badgeColor: '#B7F34A',
          action: () => switchToRiderMode()
        },
        {
          id: 'switch-seller',
          label: 'Merchant Partner Portal',
          sub: 'Manage Sole Street local boutique, products & inventory',
          icon: Store,
          iconBg: '#FFF3E0',
          iconColor: '#D97706',
          badge: 'SELLER',
          badgeBg: '#FFF3E0',
          badgeColor: '#D97706',
          action: () => navigateTo('seller-dash')
        }
      ]
    },
    {
      title: 'DELIVERY & SAVED PREFERENCES',
      items: [
        {
          id: 'address',
          label: 'Delivery Location & Addresses',
          sub: `Delivering to: ${selectedAddress?.title || 'Home · Indiranagar'}`,
          icon: MapPin,
          iconBg: '#EEF4EC',
          iconColor: '#24452D',
          badge: 'CHANGE',
          badgeBg: '#F7F8F5',
          badgeColor: '#73796F',
          action: () => setActiveModal('location')
        },
        {
          id: 'coupons',
          label: 'Active Coupons & Deals',
          sub: 'NIVVO100 (₹100 Off) · FIRST50 (Free Try-on Delivery)',
          icon: Tag,
          iconBg: '#EEF4EC',
          iconColor: '#238636',
          badge: '2 CODES',
          badgeBg: '#B7F34A',
          badgeColor: '#20251F',
          action: () => setActiveModal('coupon')
        },
        {
          id: 'wishlist',
          label: 'Saved Wishlist & Favorites',
          sub: `${wishlist?.length || 0} local items saved for later`,
          icon: Heart,
          iconBg: '#FDECEC',
          iconColor: '#BD3838',
          action: () => navigateTo('profile')
        }
      ]
    },
    {
      title: 'NIVVO TRY-ON & CONCIERGE',
      items: [
        {
          id: 'tryon-guarantee',
          label: '10-Minute Doorstep Try-On',
          sub: 'Order 2 sizes · Try for 10 mins · Pay only for what fits',
          icon: Clock,
          iconBg: '#EEF4EC',
          iconColor: '#24452D',
          badge: '10 MIN ⚡',
          badgeBg: '#24452D',
          badgeColor: '#B7F34A',
          action: () => navigateTo('brand')
        },
        {
          id: 'track-orders',
          label: 'Active Orders & Live Tracking',
          sub: 'Live courier GPS radar & doorstep trial timer',
          icon: Package,
          iconBg: '#EEF4EC',
          iconColor: '#24452D',
          action: () => navigateTo('tracking')
        },
        {
          id: 'support-chat',
          label: '24/7 Customer Care & Helpline',
          sub: 'Instant chat with Indiranagar desk lead Priya',
          icon: HelpCircle,
          iconBg: '#EEF4EC',
          iconColor: '#24452D',
          action: () => navigateTo('profile')
        }
      ]
    },
    {
      title: 'ACCOUNT & SECURITY',
      items: [
        {
          id: 'account-profile',
          label: 'Account Hub & Shoe Sizes',
          sub: `${currentUser?.name || 'Aarav Shah'} · UK 9 Fit · Notifications`,
          icon: User,
          iconBg: '#F7F8F5',
          iconColor: '#20251F',
          action: () => navigateTo('profile')
        },
        {
          id: 'protection',
          label: '100% Genuine Partner Guarantee',
          sub: 'Official retail partners with verified authenticity cards',
          icon: ShieldCheck,
          iconBg: '#EEF4EC',
          iconColor: '#238636',
          badge: 'VERIFIED',
          badgeBg: '#EEF4EC',
          badgeColor: '#238636',
          action: () => navigateTo('brand')
        },
        {
          id: 'auth-action',
          label: currentUser ? 'Sign Out / Switch Account' : 'Sign In / Register',
          sub: currentUser ? `Logged in as ${currentUser.phone || currentUser.email}` : 'Unlock 10-minute instant doorstep delivery',
          icon: LogOut,
          iconBg: currentUser ? '#FDECEC' : '#EEF4EC',
          iconColor: currentUser ? '#BD3838' : '#24452D',
          action: () => {
            if (currentUser) {
              logoutUser();
            } else {
              setAuthModalRole('customer');
              setAuthModalOpen(true);
            }
          }
        }
      ]
    }
  ];

  return (
    <div className="nivvo-modal-overlay" onClick={onClose}>
      <div 
        className="nivvo-modal-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{
          maxHeight: '85vh',
          overflowY: 'auto',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px 24px 0 0',
          paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 16px))'
        }}
      >
        {/* Modal Handle */}
        <div style={{
          width: '36px',
          height: '4px',
          borderRadius: '999px',
          backgroundColor: '#E7EAE3',
          margin: '0 auto 12px auto'
        }} />

        {/* Modal Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #E7EAE3',
          paddingBottom: '14px',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#24452D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px'
            }}>
              <img 
                src="/assets/nivvo_header_logo.svg" 
                alt="Nivvo" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#20251F' }}>
                  {currentUser?.name || 'Aarav Shah'}
                </span>
                <span style={{
                  fontSize: '9px',
                  fontWeight: 800,
                  padding: '2px 6px',
                  borderRadius: '999px',
                  backgroundColor: '#EEF4EC',
                  color: '#24452D'
                }}>
                  ● VIP CUSTOMER
                </span>
              </div>
              <div style={{ fontSize: '11px', color: '#73796F' }}>
                {selectedAddress?.area || 'Indiranagar'}, Bengaluru · 10-Min Try-on Active
              </div>
            </div>
          </div>

          <button 
            className="nivvo-modal-close-btn" 
            onClick={onClose}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        {/* Grouped Options List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {menuSections.map((section, sIdx) => (
            <div key={sIdx}>
              <div style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#73796F',
                letterSpacing: '0.06em',
                marginBottom: '8px',
                paddingLeft: '4px'
              }}>
                {section.title}
              </div>

              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7EAE3',
                borderRadius: '16px',
                overflow: 'hidden'
              }}>
                {section.items.map((item, iIdx) => {
                  const Icon = item.icon;
                  const isLast = iIdx === section.items.length - 1;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleAction(item.action)}
                      style={{
                        padding: '12px 14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        borderBottom: isLast ? 'none' : '1px solid #F7F8F5',
                        backgroundColor: '#FFFFFF',
                        transition: 'background-color 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F8F5'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '10px',
                          backgroundColor: item.iconBg,
                          color: item.iconColor,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Icon size={16} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0, paddingRight: '6px' }}>
                          <div style={{
                            fontSize: '13px',
                            fontWeight: 700,
                            color: item.iconColor === '#BD3838' ? '#BD3838' : '#20251F',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.label}
                          </div>
                          <div style={{
                            fontSize: '11px',
                            color: '#73796F',
                            marginTop: '1px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {item.sub}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                        {item.badge && (
                          <span style={{
                            fontSize: '9px',
                            fontWeight: 800,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: item.badgeBg,
                            color: item.badgeColor
                          }}>
                            {item.badge}
                          </span>
                        )}
                        <ChevronRight size={14} color="#73796F" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
