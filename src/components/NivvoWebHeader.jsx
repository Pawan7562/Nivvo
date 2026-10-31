import React, { useState, useEffect } from 'react';
import { useNivvo } from '../context/NivvoAppContext';
import {
  ShoppingBag, Search, MapPin, User, LogOut, ArrowRight,
  Sparkles, Bell, Bike, Store, ShieldCheck, ChevronDown,
  X, Mic, Loader2, Navigation, Heart, ExternalLink, Package,
  Layers, Check
} from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function NivvoWebHeader() {
  const {
    currentScreen,
    navigateTo,
    selectedAddress,
    isDetectingLocation,
    setActiveModal,
    searchQuery,
    setSearchQuery,
    totalCartCount,
    unreadNotificationCount,
    currentUser,
    logoutUser,
    setAuthModalOpen,
    setAuthModalRole,
    setSelectedCategory,
    switchToAppMode,
    showToast
  } = useNivvo();

  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  const searchPlaceholders = [
    "Search for sneakers, footwear, court shoes...",
    "Search for shirts, oversized tees, sarees...",
    "Search for perfumes, serums, cosmetics...",
    "Search for luxury watches, jewellery, gold...",
    "Search for chargers, noise-cancelling audio..."
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % searchPlaceholders.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (currentScreen !== 'categories' && currentScreen !== 'sneakers') {
      navigateTo('categories');
    }
  };

  const categoriesRail = [
    { id: 'all', label: 'All Collections' },
    { id: 'footwear', label: 'Footwear & Sneakers' },
    { id: 'fashion', label: 'Fashion & Apparel' },
    { id: 'jewellery', label: 'Jewellery & Watches' },
    { id: 'beauty', label: 'Beauty & Fragrance' },
    { id: 'accessories', label: 'Gadgets & Audio' },
    { id: 'shops', label: 'Local Boutiques', route: 'shops' },
    { id: 'grocery', label: 'Grocery Express 🥬', route: 'grocery' },
    { id: 'food', label: 'Food Quick 🍲', route: 'food' }
  ];

  return (
    <header className="nivvo-web-master-header" style={{
      backgroundColor: '#FFFFFF',
      borderBottom: '1px solid #E7EAE3',
      position: 'sticky',
      top: 0,
      zIndex: 90,
      width: '100%',
      boxShadow: '0 2px 12px rgba(0,0,0,0.03)'
    }}>
      {/* ─── Top Bar: Announcements & Quick Access Portals ─── */}
      <div style={{
        backgroundColor: '#24452D',
        color: '#FFFFFF',
        fontSize: '12px',
        fontWeight: 600,
        padding: '6px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            backgroundColor: '#B7F34A',
            color: '#14281C',
            fontSize: '10px',
            fontWeight: 800,
            padding: '2px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}>
            10-Min Try-On
          </span>
          <span>
            ⚡ Hyperlocal instant delivery active across {selectedAddress?.area || selectedAddress?.city ? `${selectedAddress.area || selectedAddress.city} & nearby dark stores` : 'Delhi NCR, Bengaluru, Mumbai & major metro corridors'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => {
              playClickSound();
              if (currentUser?.role === 'seller') {
                navigateTo('seller-dash');
              } else {
                navigateTo('seller-login');
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#E0E7DC',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              borderRadius: '4px',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#B7F34A'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#E0E7DC'}
          >
            <Store size={13} />
            <span>Seller Hub</span>
          </button>

          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

          <button
            onClick={() => {
              playClickSound();
              if (currentUser?.role === 'admin') {
                navigateTo('admin-overview');
              } else {
                navigateTo('admin-login');
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#E0E7DC',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              borderRadius: '4px',
              transition: 'color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#B7F34A'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#E0E7DC'}
          >
            <ShieldCheck size={13} />
            <span>Admin Console</span>
          </button>

          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>

          <button
            onClick={() => {
              playClickSound();
              switchToAppMode('customer');
            }}
            style={{
              backgroundColor: 'rgba(255,255,255,0.12)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#FFFFFF',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 8px',
              borderRadius: '999px',
              transition: 'all 0.15s'
            }}
            title="Preview customer & rider mobile app simulation"
          >
            <span>📱 Mobile App Simulator</span>
          </button>
        </div>
      </div>

      {/* ─── Main Brand & Search Navigation Bar ─── */}
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '12px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '24px'
      }}>
        {/* Left: Brand Logo + Location Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexShrink: 0 }}>
          {/* Logo */}
          <div
            onClick={() => { playClickSound(); navigateTo('landing'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            title="Nivvo - Home"
          >
            <img
              src="/assets/nivvo_header_logo.svg"
              alt="Nivvo"
              width="32"
              height="32"
              style={{ display: 'block', borderRadius: '8px' }}
            />
            <span style={{
              fontSize: '24px',
              fontWeight: 900,
              letterSpacing: '-0.04em',
              color: '#24452D'
            }}>
              nivvo
            </span>
          </div>

          <div style={{ width: '1px', height: '28px', backgroundColor: '#E7EAE3' }} />

          {/* Location Selector */}
          <div
            onClick={() => { playClickSound(); setActiveModal('location'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: 'pointer',
              padding: '6px 12px',
              borderRadius: '10px',
              backgroundColor: isDetectingLocation ? '#F0FDF4' : '#F7F8F5',
              border: '1px solid #E7EAE3',
              transition: 'all 0.2s ease'
            }}
            title="Delivery Location · Click to Change"
          >
            {isDetectingLocation ? (
              <Loader2 size={16} className="nivvo-spin" color="#15803D" />
            ) : (
              <MapPin size={16} color="#24452D" />
            )}
            <div>
              <div style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#15803D' }}>
                Delivery in 10-18m
              </div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedAddress?.area || 'Indiranagar, Bengaluru'}
              </div>
            </div>
            <ChevronDown size={14} color="#73796F" />
          </div>
        </div>

        {/* Center: Universal Live Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          style={{
            flex: 1,
            maxWidth: '620px',
            position: 'relative',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          <div style={{
            width: '100%',
            height: '46px',
            borderRadius: '12px',
            backgroundColor: '#F5F6F2',
            border: '1.5px solid transparent',
            display: 'flex',
            alignItems: 'center',
            padding: '0 16px',
            gap: '10px',
            transition: 'all 0.2s ease',
            boxSizing: 'border-box'
          }}
            className="nivvo-web-search-box"
          >
            <Search size={18} color="#73796F" style={{ flexShrink: 0 }} />
            <input
              type="text"
              placeholder={searchPlaceholders[placeholderIndex]}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => {
                if (currentScreen !== 'categories' && currentScreen !== 'sneakers') navigateTo('categories');
              }}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                fontSize: '14px',
                fontWeight: 500,
                color: '#20251F'
              }}
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#73796F' }}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  playClickSound();
                  setActiveModal('voice');
                }}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#73796F' }}
                title="Search with Voice"
              >
                <Mic size={18} />
              </button>
            )}
          </div>
        </form>

        {/* Right: Navigation Actions (Boutiques, Live Tracking, Try-On Bag, Profile) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexShrink: 0 }}>
          {/* Boutiques */}
          <button
            onClick={() => { playClickSound(); navigateTo('shops'); }}
            style={{
              background: 'none',
              border: 'none',
              color: currentScreen === 'shops' ? '#24452D' : '#454C41',
              fontSize: '14px',
              fontWeight: currentScreen === 'shops' ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F8F5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Store size={17} />
            <span>Boutiques</span>
          </button>

          {/* Live Order Tracking */}
          <button
            onClick={() => { playClickSound(); navigateTo('tracking'); }}
            style={{
              background: 'none',
              border: 'none',
              color: currentScreen === 'tracking' ? '#24452D' : '#454C41',
              fontSize: '14px',
              fontWeight: currentScreen === 'tracking' ? 800 : 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'background-color 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F7F8F5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <Package size={17} />
            <span>Live Tracking</span>
          </button>

          {/* Try-On Bag Button */}
          <button
            onClick={() => { playClickSound(); navigateTo('bag'); }}
            style={{
              backgroundColor: currentScreen === 'bag' ? '#14281C' : '#24452D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '9px 18px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '9px',
              boxShadow: '0 2px 8px rgba(36, 69, 45, 0.25)',
              transition: 'transform 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            title="Open 10-Minute Doorstep Try-On Bag"
          >
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <ShoppingBag size={18} strokeWidth={2.2} />
              {totalCartCount > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-10px',
                  backgroundColor: '#B7F34A',
                  color: '#14281C',
                  fontSize: '11px',
                  fontWeight: 900,
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #24452D'
                }}>
                  {totalCartCount}
                </span>
              )}
            </div>
            <span>Try-On Bag</span>
          </button>

          {/* User Account / Profile Menu */}
          <div style={{ position: 'relative' }}>
            {currentUser ? (
              <div style={{ position: 'relative' }}>
                <button
                  onClick={() => setAccountMenuOpen(!accountMenuOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 10px',
                    borderRadius: '10px',
                    backgroundColor: '#F5F6F2',
                    border: '1px solid #E7EAE3',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: '#24452D',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {(currentUser.name || 'U').charAt(0).toUpperCase()}
                  </div>
                  <div style={{ textAlign: 'left', minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {currentUser.name?.split(' ')[0] || 'Account'}
                    </div>
                  </div>
                  <ChevronDown size={14} color="#73796F" />
                </button>

                {accountMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '240px',
                      backgroundColor: '#FFFFFF',
                      borderRadius: '14px',
                      boxShadow: '0 12px 36px rgba(0,0,0,0.12)',
                      border: '1px solid #E7EAE3',
                      padding: '8px',
                      zIndex: 100
                    }}
                    onClick={() => setAccountMenuOpen(false)}
                  >
                    <div style={{ padding: '8px 12px', borderBottom: '1px solid #F0F2EB', marginBottom: '6px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#20251F' }}>{currentUser.name}</div>
                      <div style={{ fontSize: '12px', color: '#73796F' }}>{currentUser.phone || currentUser.email}</div>
                    </div>

                    <button
                      onClick={() => { playClickSound(); navigateTo('profile'); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#20251F',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F6F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <User size={16} />
                      <span>Customer Portal & Profile</span>
                    </button>

                    <button
                      onClick={() => { playClickSound(); navigateTo('tracking'); }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#20251F',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F6F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Package size={16} />
                      <span>My Orders & Try-Ons</span>
                    </button>

                    {currentUser.role === 'seller' && (
                      <button
                        onClick={() => { playClickSound(); navigateTo('seller-dash'); }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#B45309',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FFFBEB'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <Store size={16} />
                        <span>Seller Dashboard</span>
                      </button>
                    )}

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => { playClickSound(); navigateTo('admin-overview'); }}
                        style={{
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#1D4ED8',
                          textAlign: 'left'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#EFF6FF'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <ShieldCheck size={16} />
                        <span>Admin Console</span>
                      </button>
                    )}

                    <div style={{ height: '1px', backgroundColor: '#F0F2EB', margin: '6px 0' }} />

                    <button
                      onClick={() => {
                        playClickSound();
                        logoutUser();
                      }}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#DC2626',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => {
                  playClickSound();
                  navigateTo('customer-login');
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#24452D',
                  border: '1.5px solid #24452D',
                  borderRadius: '12px',
                  padding: '8px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.15s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#24452D';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#24452D';
                }}
                title="Sign In to Nivvo"
              >
                <User size={15} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Bottom Sub-Rail: Category Navigation Tabs ─── */}
      <div style={{
        borderTop: '1px solid #F0F2EB',
        backgroundColor: '#FAFAF7',
        padding: '0 32px'
      }}>
        <div style={{
          maxWidth: '1440px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflowX: 'auto',
          scrollbarWidth: 'none',
          padding: '8px 0'
        }}>
          {categoriesRail.map((cat) => {
            const isSelected =
              (cat.route && currentScreen === cat.route) ||
              (cat.id === 'all' && currentScreen === 'categories') ||
              (cat.id === 'footwear' && currentScreen === 'sneakers');

            return (
              <button
                key={cat.id}
                onClick={() => {
                  playClickSound();
                  if (cat.route) {
                    navigateTo(cat.route);
                  } else {
                    setSelectedCategory(cat.id);
                    navigateTo(cat.id === 'footwear' ? 'sneakers' : 'categories');
                  }
                }}
                style={{
                  padding: '7px 14px',
                  borderRadius: '999px',
                  fontSize: '13px',
                  fontWeight: isSelected ? 800 : 600,
                  border: isSelected ? '1px solid #24452D' : '1px solid #E5E8E0',
                  backgroundColor: isSelected ? '#24452D' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : '#454C41',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#F0F2EB';
                    e.currentTarget.style.color = '#14281C';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) {
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                    e.currentTarget.style.color = '#454C41';
                  }
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
}

