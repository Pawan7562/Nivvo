import React, { useState } from 'react';
import './styles/nivvo.css';
import { NivvoAppProvider, useNivvo } from './context/NivvoAppContext';
import NivvoModals from './components/nivvo/NivvoModals';
import NivvoAuthModal from './components/NivvoAuthModal';
import ApplicationStatusView from './components/ApplicationStatusView';
import BecomeRiderModal from './components/BecomeRiderModal';
import GroceryView from './views/nivvo/GroceryView';
import FoodView from './views/nivvo/FoodView';
import ShoppingModeSwitcher from './components/ShoppingModeSwitcher';
import LandingPageView from './views/LandingPageView';

// Import All 17 Dedicated Figma Screen Views
import NivvoHomeView from './views/nivvo/NivvoHomeView';
import NivvoShopsView from './views/nivvo/NivvoShopsView';
import NivvoShopDetailView from './views/nivvo/NivvoShopDetailView';
import NivvoCategoryView from './views/nivvo/NivvoCategoryView';
import NivvoProductDetailView from './views/nivvo/NivvoProductDetailView';
import NivvoBagView from './views/nivvo/NivvoBagView';
import NivvoCheckoutView from './views/nivvo/NivvoCheckoutView';
import NivvoLiveTrackingView from './views/nivvo/NivvoLiveTrackingView';
import NivvoSellerDashboard from './views/nivvo/NivvoSellerDashboard';
import NivvoSellerProductsView from './views/nivvo/NivvoSellerProductsView';
import NivvoSellerOrdersView from './views/nivvo/NivvoSellerOrdersView';
import NivvoSellerPayoutsView from './views/nivvo/NivvoSellerPayoutsView';
import NivvoSellerProfileView from './views/nivvo/NivvoSellerProfileView';
import NivvoSellerReviewsView from './views/nivvo/NivvoSellerReviewsView';
import NivvoSellerSupportView from './views/nivvo/NivvoSellerSupportView';
import NivvoRiderDutyView from './views/nivvo/NivvoRiderDutyView';
import NivvoRiderView from './views/nivvo/NivvoRiderView';
import NivvoRiderEarningsView from './views/nivvo/NivvoRiderEarningsView';
import NivvoRiderSupportView from './views/nivvo/NivvoRiderSupportView';
import NivvoRiderProfileView from './views/nivvo/NivvoRiderProfileView';
import NivvoAdminOverviewView from './views/nivvo/NivvoAdminOverviewView';
import NivvoAdminSellersView from './views/nivvo/NivvoAdminSellersView';
import NivvoAdminOrdersView from './views/nivvo/NivvoAdminOrdersView';
import NivvoAdminDeliveryView from './views/nivvo/NivvoAdminDeliveryView';
import NivvoAdminCustomersView from './views/nivvo/NivvoAdminCustomersView';
import NivvoAdminFinanceView from './views/nivvo/NivvoAdminFinanceView';
import NivvoBrandSystemView from './views/nivvo/NivvoBrandSystemView';
import NivvoProfileView from './views/nivvo/NivvoProfileView';
import NivvoWebCustomerPortal from './views/nivvo/NivvoWebCustomerPortal';

import { NIVVO_PRODUCTS, NIVVO_SHOPS } from './data/nivvoData';
import { ShoppingBag, ChevronDown, Search, Home, Store, Package, User, Smartphone, Tablet, Monitor, Bell, Heart, Bike, Zap, TrendingUp, RotateCcw, HelpCircle, Menu, LayoutGrid, Wifi, Battery, MapPin, X, Mic } from 'lucide-react';
import { playClickSound } from './utils/audioEffects';

function AppContent() {
  const { 
    currentScreen, 
    setCurrentScreen, 
    navigateTo, 
    selectedProduct, 
    setSelectedProduct, 
    selectedCategory,
    setSelectedCategory,
    viewMode, 
    setViewMode,
    totalCartCount,
    unreadNotificationCount,
    selectedAddress,
    setActiveModal,
    searchQuery,
    setSearchQuery,
    currentUser,
    authToken,
    authModalOpen,
    setAuthModalOpen,
    authModalRole,
    setAuthModalRole,
    handleLoginSuccess,
    logoutUser,
    shopProfile,
    riderProfile,
    activeDeliveryJob,
    platformMode,
    setPlatformMode,
    switchToWebMode,
    switchToAppMode,
    appMode,
    setAppMode,
    switchToCustomerMode,
    switchToRiderMode,
    becomeRiderModalOpen,
    setBecomeRiderModalOpen
  } = useNivvo();

  const [showMobileSwitcher, setShowMobileSwitcher] = useState(false);
  const [shoppingMode, setShoppingMode] = useState('shop'); // 'shop' | 'grocery' | 'food'

  // Website Screens: Handled Exclusively by the Website (Landing, Seller, Admin)
  const websiteScreens = [
    { id: 'landing', label: 'Website Landing', role: 'Website' },
    { id: 'seller-dash', label: 'Seller Overview', role: 'Seller' },
    { id: 'seller-prods', label: 'Products & Catalog', role: 'Seller' },
    { id: 'seller-orders', label: 'Live Orders', role: 'Seller' },
    { id: 'seller-payouts', label: 'Seller Payouts', role: 'Seller' },
    { id: 'seller-profile', label: 'Store Profile', role: 'Seller' },
    { id: 'seller-reviews', label: 'Customer Reviews', role: 'Seller' },
    { id: 'seller-support', label: 'Seller Support', role: 'Seller' },
    { id: 'admin-overview', label: 'Admin Operations', role: 'Admin' },
    { id: 'admin-sellers', label: 'Admin Merchant Ops', role: 'Admin' },
  ];

  // Mobile App Screens: Handled Exclusively by the Mobile App (Customer & Delivery Partner)
  const mobileAppScreens = [
    { id: 'home', label: 'Storefront Feed', role: 'Customer' },
    { id: 'grocery', label: 'Grocery Express', role: 'Customer' },
    { id: 'food', label: 'Food Quick', role: 'Customer' },
    { id: 'categories', label: 'Categories & Finds', role: 'Customer' },
    { id: 'shops', label: 'Neighbourhood Shops', role: 'Customer' },
    { id: 'shop-detail', label: 'Shop Details', role: 'Customer' },
    { id: 'sneakers', label: 'Footwear & Streetwear', role: 'Customer' },
    { id: 'product-detail', label: 'Product Details', role: 'Customer' },
    { id: 'bag', label: 'Try-On Bag', role: 'Customer' },
    { id: 'checkout', label: 'Express Checkout', role: 'Customer' },
    { id: 'tracking', label: 'Live Tracking', role: 'Customer' },
    { id: 'profile', label: 'Customer Account', role: 'Customer' },
    { id: 'rider-duty', label: 'Rider Duty & Radar', role: 'Rider' },
    { id: 'rider-active', label: 'Active Delivery & OTP', role: 'Rider' },
    { id: 'rider-earnings', label: 'Rider Earnings & Payout', role: 'Rider' },
    { id: 'rider-support', label: 'Rider Support Desk', role: 'Rider' },
    { id: 'rider-profile', label: 'Rider Fleet Profile', role: 'Rider' },
    { id: 'brand', label: 'Brand Guidelines', role: 'Brand' }
  ];

  React.useEffect(() => {
    if (typeof document !== 'undefined') {
      if (platformMode === 'web') {
        document.documentElement.classList.add('web-platform-active');
        document.body.classList.add('web-platform-active');
      } else {
        document.documentElement.classList.remove('web-platform-active');
        document.body.classList.remove('web-platform-active');
      }
    }
  }, [platformMode]);

  // When on website mode or on any website portal screen, render full desktop view
  const isWebPortal = platformMode === 'web' || [
    'landing',
    'seller-dash', 'seller-overview', 'seller-prods', 'seller-orders', 
    'seller-payouts', 'seller-profile', 'seller-reviews', 'seller-support',
    'admin-overview', 'admin-sellers', 'admin-orders', 'admin-delivery', 'admin-customers', 'admin-finance',
    'profile', 'customer', 'customer-portal'
  ].includes(currentScreen) || currentScreen.startsWith('seller-') || currentScreen.startsWith('admin-');

  // On website, hide the mobile bottom navigation bar completely
  const hideBottomNav = platformMode === 'web' || [
    'landing', 'profile', 'customer', 'customer-portal',
    'bag', 'checkout', 'product-detail', 
    'seller-dash', 'seller-overview', 'seller-prods', 'seller-orders',
    'seller-payouts', 'seller-profile', 'seller-reviews', 'seller-support',
    'rider-duty', 'rider-active', 'rider-earnings', 'rider-support', 'rider-profile',
    'admin-overview', 'admin-sellers', 'admin-orders', 'admin-delivery', 'admin-customers', 'admin-finance',
    'brand'
  ].includes(currentScreen) || currentScreen.startsWith('seller-') || currentScreen.startsWith('admin-');

  const isRiderActive = appMode === 'rider' || currentScreen.startsWith('rider-');

  const searchPlaceholders = [
    "Search for sneakers, t-shirts, cosmetics...",
    "Search for jewellery, watches, kurtis...",
    "Search for perfumes, serums, diffusers...",
    "Search for household essentials, candles...",
    "Search for sandals, formal shirts, bags..."
  ];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex(prev => (prev + 1) % searchPlaceholders.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigateTo('sneakers');
  };

  return (
    <div>
      {/* Main Full-Width Responsive Viewport */}
      <div className="nivvo-app-viewport mode-web-portal">

        {/* Home Screen Header (Clean Modern 2-Row Architecture) */}
        {currentScreen === 'home' && (
          <div className="nivvo-master-header" style={{ padding: '6px 14px 10px 14px', borderBottom: '1px solid #E7EAE3' }}>
            {/* Row 1: Brand Logo, Location Selector, Notifications & Bag */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              {/* Left: Brand + Location Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0, flex: 1 }}>
                <div className="nivvo-brand-logo-lockup" onClick={() => navigateTo('home')} style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', flexShrink: 0 }}>
                  <img 
                    src="/assets/nivvo_header_logo.svg" 
                    alt="Nivvo" 
                    width="24" 
                    height="24" 
                    style={{ display: 'block', borderRadius: '6px' }} 
                  />
                  <span className="nivvo-brand-name" style={{ fontSize: '18px', fontWeight: 800, letterSpacing: '-0.03em', color: '#24452D' }}>nivvo</span>
                </div>

                <div style={{ width: '1px', height: '14px', backgroundColor: '#E7EAE3', flexShrink: 0 }} />

                {/* Location Selector */}
                <div 
                  className="nivvo-location-selector" 
                  onClick={() => { playClickSound(); setActiveModal('location'); }}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '3px', 
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#24452D',
                    minWidth: 0
                  }}
                  title="Change delivery location"
                >
                  <MapPin size={12} color="#24452D" style={{ flexShrink: 0 }} />
                  <span style={{ 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap', 
                    maxWidth: '85px'
                  }}>
                    {selectedAddress?.title?.split('·')[0]?.trim() || selectedAddress?.area || 'Home'}
                  </span>
                  <ChevronDown size={11} color="#73796F" style={{ flexShrink: 0 }} />
                </div>
              </div>

              {/* Right: User Login / Profile, Notifications & Bag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                {currentUser ? (
                  <>
                    <div 
                      onClick={() => { 
                        playClickSound(); 
                        if (currentUser.role === 'seller') {
                          navigateTo('seller-dash');
                        } else if (currentUser.role === 'admin') {
                          navigateTo('admin-overview');
                        } else if (currentUser.role === 'rider') {
                          navigateTo('rider-duty');
                        } else {
                          navigateTo('profile');
                        }
                      }}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        padding: '4px 8px',
                        borderRadius: '999px',
                        backgroundColor: currentUser.role === 'seller' ? '#FFF3E0' : (currentUser.role === 'rider' ? '#EEF4EC' : (currentUser.role === 'admin' ? '#F3F4F6' : '#F7F8F5')),
                        border: '1px solid #E7EAE3',
                        cursor: 'pointer',
                        flexShrink: 0,
                        whiteSpace: 'nowrap'
                      }}
                      title={`Logged in as ${currentUser.name || 'User'} (${currentUser.role === 'seller' ? 'Seller Hub' : (currentUser.role === 'admin' ? 'Operations Admin' : (currentUser.role === 'rider' ? 'Delivery Partner' : 'Customer Account'))})`}
                    >
                      <div style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        backgroundColor: '#24452D',
                        color: '#FFFFFF',
                        fontSize: '10px',
                        fontWeight: 800,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        {(currentUser.name || 'U').slice(0, 1).toUpperCase()}
                      </div>
                      <span style={{ fontSize: '11px', fontWeight: 700, color: '#24452D', maxWidth: '65px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {currentUser.name?.split(' ')[0] || 'Account'}
                      </span>
                    </div>

                    <button 
                      className="nivvo-bag-trigger" 
                      onClick={() => { playClickSound(); navigateTo('profile'); }}
                      title="Notifications & Alerts"
                      aria-label="Notifications"
                      style={{ 
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#20251F',
                        flexShrink: 0
                      }}
                    >
                      <Bell size={19} strokeWidth={1.8} />
                      {unreadNotificationCount > 0 && (
                        <span className="nivvo-bag-count-badge" style={{ backgroundColor: '#24452D', color: '#B7F34A', border: '1.5px solid #FFFFFF' }}>
                          {unreadNotificationCount}
                        </span>
                      )}
                    </button>

                    <button 
                      className="nivvo-bag-trigger" 
                      onClick={() => { playClickSound(); navigateTo('bag'); }} 
                      title="Your Bag"
                      aria-label="Shopping Bag"
                      style={{ 
                        padding: '5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#20251F',
                        flexShrink: 0
                      }}
                    >
                      <ShoppingBag size={20} strokeWidth={1.8} />
                      {totalCartCount > 0 && (
                        <span className="nivvo-bag-count-badge" style={{ backgroundColor: '#24452D', color: '#B7F34A', border: '1.5px solid #FFFFFF' }}>
                          {totalCartCount}
                        </span>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      playClickSound();
                      setAuthModalRole('customer');
                      setAuthModalOpen(true);
                    }}
                    style={{
                      backgroundColor: '#24452D',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '999px',
                      padding: '7px 16px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      whiteSpace: 'nowrap',
                      lineHeight: 1,
                      flexShrink: 0,
                      boxShadow: '0 2px 8px rgba(36, 69, 45, 0.25)'
                    }}
                    title="Sign In to Nivvo"
                  >
                    <User size={14} />
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: Clean Full-width Search Bar */}
            <form onSubmit={handleSearchSubmit} className="nivvo-search-bar-wrap" style={{ height: '42px', borderRadius: '12px', padding: '0 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Search size={16} color="#73796F" style={{ flexShrink: 0 }} />
              <input 
                type="text" 
                className="nivvo-search-input"
                placeholder={searchPlaceholders[placeholderIndex]}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (currentScreen !== 'categories' && currentScreen !== 'sneakers') navigateTo('categories');
                }}
                style={{ fontSize: '13px' }}
              />
              {searchQuery ? (
                <button 
                  type="button"
                  onClick={() => setSearchQuery('')}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#73796F', display: 'flex', alignItems: 'center' }}
                  aria-label="Clear search"
                >
                  <X size={15} />
                </button>
              ) : (
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    playClickSound();
                    setActiveModal('voice');
                  }}
                  style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', color: '#73796F', display: 'flex', alignItems: 'center' }}
                  title="Search with Voice"
                  aria-label="Voice Search"
                >
                  <Mic size={16} />
                </button>
              )}
            </form>
          </div>
        )}

        {/* Shopping Mode Switcher – shown on home when in customer mode on mobile app */}
        {platformMode === 'app' && currentScreen === 'home' && appMode === 'customer' && (
          <ShoppingModeSwitcher
            activeMode={shoppingMode}
            onModeChange={(mode) => {
              setShoppingMode(mode);
              if (mode === 'grocery') navigateTo('grocery');
              else if (mode === 'food') navigateTo('food');
            }}
          />
        )}

        {/* Scrollable Screen Body */}
        <div className="nivvo-screen-scroll">
          {/* Platform Landing Page (Full Responsive Web & Mobile Showcase) */}
          {currentScreen === 'landing' && (
            <LandingPageView 
              onNavigateHome={() => {
                const el = document.getElementById('collections');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateCategory={(cat) => {
                setSelectedCategory(cat);
                navigateTo('categories');
              }}
              onNavigateGrocery={() => {
                setShoppingMode('grocery');
                navigateTo('grocery');
              }}
              onNavigateFood={() => {
                setShoppingMode('food');
                navigateTo('food');
              }}
              onNavigateShops={() => navigateTo('shops')}
              onNavigateBag={() => navigateTo('bag')}
              onNavigateCheckout={() => navigateTo('checkout')}
              onNavigateTracking={() => navigateTo('tracking')}
              onNavigateProfile={() => navigateTo('profile')}
              onNavigateSeller={() => {
                switchToWebMode();
                navigateTo('seller-dash');
              }}
              onNavigateRider={() => {
                showToast('Delivery Partner fleet operations run exclusively on the Nivvo Mobile App.');
              }}
              onNavigateAdmin={() => {
                switchToWebMode();
                navigateTo('admin-overview');
              }}
              onOpenAuth={(role) => {
                setAuthModalRole(role === 'admin' ? 'admin' : (role === 'customer' ? 'customer' : 'seller'));
                setAuthModalOpen(true);
              }}
              onLaunchMobileSimulator={() => {
                switchToAppMode('customer');
                navigateTo('home');
              }}
            />
          )}

          {/* Website Mode Boundary Guard: Delivery Fleet operations run exclusively on the Mobile App */}
          {platformMode === 'web' && currentScreen.startsWith('rider-') && (
            <div style={{ maxWidth: '680px', margin: '48px auto', padding: '44px 32px', backgroundColor: '#FFFFFF', borderRadius: '24px', border: '1px solid #E7EAE3', boxShadow: '0 12px 36px rgba(0,0,0,0.06)', textAlign: 'center' }}>
              <div style={{ width: '68px', height: '68px', borderRadius: '20px', backgroundColor: '#EEF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', color: '#24452D' }}>
                <Bike size={34} />
              </div>
              <span style={{ display: 'inline-block', backgroundColor: '#EEF4EC', color: '#24452D', fontSize: '11px', fontWeight: 800, padding: '4px 12px', borderRadius: '999px', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '12px' }}>
                Mobile Application Exclusive
              </span>
              <h2 style={{ fontSize: '26px', fontWeight: 800, color: '#20251F', letterSpacing: '-0.02em', margin: '0 0 12px 0' }}>
                Delivery Fleet Partner Portal
              </h2>
              <p style={{ fontSize: '15px', color: '#73796F', lineHeight: '1.6', maxWidth: '520px', margin: '0 auto 28px' }}>
                Delivery Partner duties, GPS radar dispatch, OTP customer handovers, and weekly earnings run exclusively in the <strong>Nivvo Mobile Application</strong>.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
                <a
                  href="/download/nivvo.apk"
                  download="nivvo.apk"
                  style={{ backgroundColor: '#24452D', color: '#B7F34A', padding: '12px 24px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Package size={16} />
                  Download Rider APK (v1.0.6)
                </a>
                <button
                  onClick={() => {
                    playClickSound();
                    switchToAppMode('rider');
                    navigateTo(currentScreen);
                  }}
                  style={{ backgroundColor: '#F7F8F5', color: '#20251F', border: '1px solid #E7EAE3', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <Smartphone size={16} />
                  Launch in Mobile Simulator
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    navigateTo('landing');
                  }}
                  style={{ backgroundColor: '#20251F', color: '#FFFFFF', padding: '12px 24px', borderRadius: '12px', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer' }}
                >
                  Back to Website
                </button>
              </div>
            </div>
          )}

          {/* Mobile App Mode Boundary Guard: If in Mobile App Mode and user visits a seller/admin website screen */}
          {platformMode === 'app' && (currentScreen.startsWith('seller-') || currentScreen.startsWith('admin-')) && (
            <div style={{ padding: '36px 20px', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '18px', backgroundColor: '#FFF3E0', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#D97706' }}>
                <Monitor size={30} />
              </div>
              <span style={{ display: 'inline-block', backgroundColor: '#FFF3E0', color: '#D97706', fontSize: '11px', fontWeight: 800, padding: '3px 10px', borderRadius: '999px', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '10px' }}>
                Desktop Website Exclusive
              </span>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#20251F', margin: '0 0 10px 0' }}>
                Seller & Admin Portals are Managed on the Desktop Website
              </h3>
              <p style={{ fontSize: '13px', color: '#73796F', lineHeight: '1.5', margin: '0 0 20px 0' }}>
                Inventory cataloging, live audio dispatch chimes, and operations are managed on the <strong>Nivvo Desktop Website</strong>. The Mobile App is exclusively for Customers & Delivery Partners.
              </p>
              <button
                onClick={() => {
                  playClickSound();
                  switchToWebMode();
                }}
                style={{ backgroundColor: '#24452D', color: '#B7F34A', padding: '12px 20px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', width: '100%', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <Monitor size={16} />
                Open Desktop Website Portal
              </button>
              <button
                onClick={() => {
                  playClickSound();
                  navigateTo('home');
                }}
                style={{ backgroundColor: '#F7F8F5', color: '#20251F', border: '1px solid #E7EAE3', padding: '11px 20px', borderRadius: '12px', fontWeight: 700, fontSize: '13px', cursor: 'pointer', width: '100%' }}
              >
                Return to Customer Storefront
              </button>
            </div>
          )}

          {/* Customer Screens (1 to 8) - Accessible on BOTH Website & Mobile App */}
          {(platformMode === 'app' || platformMode === 'web') && currentScreen === 'home' && (
            <NivvoHomeView 
              onSelectCategory={(catId) => {
                setSelectedCategory(catId);
                navigateTo('categories');
              }}
              onExploreFootwear={() => {
                setSelectedCategory('footwear');
                navigateTo('categories');
              }}
              onSelectProduct={(prod) => {
                setSelectedProduct(prod);
                navigateTo('product-detail');
              }}
              onAddToCart={(prod) => {}}
              onNavigateToShops={() => navigateTo('shops')}
            />
          )}

          {/* Grocery Screen */}
          {(platformMode === 'app' || platformMode === 'web') && currentScreen === 'grocery' && (
            <GroceryView
              onBack={() => { setShoppingMode('shop'); navigateTo(platformMode === 'web' ? 'landing' : 'home'); }}
              onNavigateMode={(mode) => {
                setShoppingMode(mode);
                if (mode === 'shop') navigateTo(platformMode === 'web' ? 'landing' : 'home');
                else if (mode === 'food') navigateTo('food');
                else if (mode === 'grocery') navigateTo('grocery');
              }}
            />
          )}

          {/* Food Order Screen */}
          {(platformMode === 'app' || platformMode === 'web') && currentScreen === 'food' && (
            <FoodView
              onBack={() => { setShoppingMode('shop'); navigateTo(platformMode === 'web' ? 'landing' : 'home'); }}
              onNavigateMode={(mode) => {
                setShoppingMode(mode);
                if (mode === 'shop') navigateTo(platformMode === 'web' ? 'landing' : 'home');
                else if (mode === 'grocery') navigateTo('grocery');
                else if (mode === 'food') navigateTo('food');
              }}
            />
          )}

          {(platformMode === 'app' || platformMode === 'web') && currentScreen === 'shops' && (
            <NivvoShopsView 
              onBack={() => navigateTo(platformMode === 'web' ? 'landing' : 'home')}
              onOpenCart={() => navigateTo('bag')}
              onSelectShop={(shop) => navigateTo('shop-detail')}
            />
          )}

          {(platformMode === 'app' || platformMode === 'web') && currentScreen === 'shop-detail' && (
            <NivvoShopDetailView 
              onBack={() => navigateTo('shops')}
              onOpenCart={() => navigateTo('bag')}
              onSelectProduct={(prod) => {
                setSelectedProduct(prod);
                navigateTo('product-detail');
              }}
            />
          )}

          {(platformMode === 'app' || platformMode === 'web') && (currentScreen === 'categories' || currentScreen === 'sneakers') && (
            <NivvoCategoryView 
              initialCategory={currentScreen === 'sneakers' ? 'footwear' : (selectedCategory || 'all')}
              onBack={() => navigateTo(platformMode === 'web' ? 'landing' : 'home')}
              onOpenCart={() => navigateTo('bag')}
              onSelectProduct={(prod) => {
                setSelectedProduct(prod);
                navigateTo('product-detail');
              }}
            />
          )}

          {(platformMode === 'app' || platformMode === 'web') && currentScreen === 'product-detail' && (
            <NivvoProductDetailView 
              product={selectedProduct}
              onBack={() => navigateTo(platformMode === 'web' ? 'landing' : 'categories')}
              onOpenCart={() => navigateTo('bag')}
            />
          )}

          {(platformMode === 'app' || platformMode === 'web') && currentScreen === 'bag' && (
            <NivvoBagView 
              onBack={() => navigateTo(platformMode === 'web' ? 'landing' : 'home')}
              onProceedToCheckout={() => navigateTo('checkout')}
            />
          )}

          {(platformMode === 'app' || platformMode === 'web') && currentScreen === 'checkout' && (
            <NivvoCheckoutView 
              onBack={() => navigateTo('bag')}
              onPaymentSuccess={() => navigateTo('tracking')}
            />
          )}

          {(platformMode === 'app' || platformMode === 'web') && currentScreen === 'tracking' && (
            <NivvoLiveTrackingView 
              onBack={() => navigateTo(platformMode === 'web' ? 'landing' : 'home')}
            />
          )}

          {/* Shop Owner Screens (9 to 11) - Handled Exclusively on Desktop Website Portal */}
          {platformMode === 'web' && (currentScreen === 'seller-dash' || currentScreen === 'seller-overview') && (
            currentUser?.role === 'customer' ? (
              <div style={{ maxWidth: '640px', margin: '48px auto', padding: '40px 32px', backgroundColor: '#FFFFFF', borderRadius: '20px', border: '1px solid #EAECE5', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', textAlign: 'center' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '18px', backgroundColor: '#FFFBEB', color: '#B45309', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Store size={32} />
                </div>
                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
                  Merchant Access Required
                </h3>
                <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: '1.5', maxWidth: '480px', margin: '0 auto 24px' }}>
                  You are currently signed in as a customer (<strong>{currentUser.name}</strong>). To manage your store, inventory, and orders, please sign in with your Merchant credentials.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => {
                      playClickSound();
                      setAuthModalRole('seller');
                      setAuthModalOpen(true);
                    }}
                    style={{ backgroundColor: '#24452D', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '12px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                  >
                    <Store size={16} />
                    <span>Sign In to Seller Hub</span>
                  </button>
                  <button
                    onClick={() => {
                      playClickSound();
                      navigateTo('landing');
                    }}
                    style={{ backgroundColor: '#F3F4F6', color: '#374151', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '12px 20px', fontSize: '14px', fontWeight: 600, cursor: 'pointer' }}
                  >
                    Return to Storefront
                  </button>
                </div>
              </div>
            ) : currentUser?.role === 'seller' && (currentUser?.verification_status || shopProfile?.verification_status)?.toLowerCase() !== 'approved' ? (
              <ApplicationStatusView 
                role="seller"
                user={currentUser}
                statusData={{
                  ...shopProfile,
                  verification_status: currentUser?.verification_status || shopProfile?.verification_status || 'pending',
                  admin_notes: currentUser?.admin_notes || shopProfile?.admin_notes,
                  rejection_reason: currentUser?.rejection_reason || shopProfile?.rejection_reason
                }}
                onLogout={logoutUser}
                onRefresh={() => window.location.reload()}
              />
            ) : (
              <NivvoSellerDashboard 
                onBack={() => navigateTo('landing')}
              />
            )
          )}

          {platformMode === 'web' && currentScreen === 'seller-prods' && (
            currentUser?.role === 'seller' && (currentUser?.verification_status || shopProfile?.verification_status)?.toLowerCase() !== 'approved' ? (
              <ApplicationStatusView 
                role="seller"
                user={currentUser}
                statusData={{
                  ...shopProfile,
                  verification_status: currentUser?.verification_status || shopProfile?.verification_status || 'pending',
                  admin_notes: currentUser?.admin_notes || shopProfile?.admin_notes,
                  rejection_reason: currentUser?.rejection_reason || shopProfile?.rejection_reason
                }}
                onLogout={logoutUser}
                onRefresh={() => window.location.reload()}
              />
            ) : (
              <NivvoSellerProductsView 
                onBack={() => navigateTo('seller-dash')}
              />
            )
          )}

          {platformMode === 'web' && currentScreen === 'seller-orders' && (
            currentUser?.role === 'seller' && (currentUser?.verification_status || shopProfile?.verification_status)?.toLowerCase() !== 'approved' ? (
              <ApplicationStatusView 
                role="seller"
                user={currentUser}
                statusData={{
                  ...shopProfile,
                  verification_status: currentUser?.verification_status || shopProfile?.verification_status || 'pending',
                  admin_notes: currentUser?.admin_notes || shopProfile?.admin_notes,
                  rejection_reason: currentUser?.rejection_reason || shopProfile?.rejection_reason
                }}
                onLogout={logoutUser}
                onRefresh={() => window.location.reload()}
              />
            ) : (
              <NivvoSellerOrdersView 
                onBack={() => navigateTo('seller-dash')}
              />
            )
          )}

          {platformMode === 'web' && currentScreen === 'seller-payouts' && (
            <NivvoSellerPayoutsView 
              onBack={() => navigateTo('seller-dash')}
            />
          )}

          {platformMode === 'web' && currentScreen === 'seller-profile' && (
            <NivvoSellerProfileView 
              onBack={() => navigateTo('seller-dash')}
            />
          )}

          {platformMode === 'web' && currentScreen === 'seller-reviews' && (
            <NivvoSellerReviewsView 
              onBack={() => navigateTo('seller-dash')}
            />
          )}

          {platformMode === 'web' && currentScreen === 'seller-support' && (
            <NivvoSellerSupportView 
              onBack={() => navigateTo('seller-dash')}
            />
          )}

          {/* Delivery Partner Screens (12 to 14) - Handled Exclusively in Mobile App */}
          {platformMode === 'app' && currentScreen === 'rider-duty' && (
            currentUser?.role === 'rider' && (currentUser?.verification_status || riderProfile?.verification_status)?.toLowerCase() !== 'approved' ? (
              <ApplicationStatusView 
                role="rider"
                user={currentUser}
                statusData={{
                  ...riderProfile,
                  verification_status: currentUser?.verification_status || riderProfile?.verification_status || 'pending',
                  admin_notes: currentUser?.admin_notes || riderProfile?.admin_notes,
                  rejection_reason: currentUser?.rejection_reason || riderProfile?.rejection_reason
                }}
                onLogout={logoutUser}
                onRefresh={() => window.location.reload()}
              />
            ) : (
              <NivvoRiderDutyView 
                onBack={() => navigateTo('home')}
                onAcceptJob={() => navigateTo('rider-active')}
              />
            )
          )}

          {platformMode === 'app' && currentScreen === 'rider-active' && (
            currentUser?.role === 'rider' && (currentUser?.verification_status || riderProfile?.verification_status)?.toLowerCase() !== 'approved' ? (
              <ApplicationStatusView 
                role="rider"
                user={currentUser}
                statusData={{
                  ...riderProfile,
                  verification_status: currentUser?.verification_status || riderProfile?.verification_status || 'pending',
                  admin_notes: currentUser?.admin_notes || riderProfile?.admin_notes,
                  rejection_reason: currentUser?.rejection_reason || riderProfile?.rejection_reason
                }}
                onLogout={logoutUser}
                onRefresh={() => window.location.reload()}
              />
            ) : (
              <NivvoRiderView 
                onBack={() => navigateTo('rider-duty')}
              />
            )
          )}

          {platformMode === 'app' && currentScreen === 'rider-earnings' && (
            <NivvoRiderEarningsView 
              onBack={() => navigateTo('rider-duty')}
            />
          )}

          {platformMode === 'app' && currentScreen === 'rider-support' && (
            <NivvoRiderSupportView 
              onBack={() => navigateTo('rider-duty')}
            />
          )}

          {platformMode === 'app' && currentScreen === 'rider-profile' && (
            <NivvoRiderProfileView 
              onBack={() => navigateTo('rider-duty')}
            />
          )}

          {/* Platform Admin Screens - Handled Exclusively on Desktop Website Portal */}
          {currentScreen === 'admin-overview' && (
            <NivvoAdminOverviewView 
              onBack={() => navigateTo('landing')}
              onNavigateSellers={() => navigateTo('admin-sellers')}
            />
          )}

          {currentScreen === 'admin-sellers' && (
            <NivvoAdminSellersView 
              onBack={() => navigateTo('admin-overview')}
            />
          )}

          {currentScreen === 'admin-orders' && (
            <NivvoAdminOrdersView 
              onBack={() => navigateTo('admin-overview')}
            />
          )}

          {currentScreen === 'admin-delivery' && (
            <NivvoAdminDeliveryView 
              onBack={() => navigateTo('admin-overview')}
            />
          )}

          {currentScreen === 'admin-customers' && (
            <NivvoAdminCustomersView 
              onBack={() => navigateTo('admin-overview')}
            />
          )}

          {currentScreen === 'admin-finance' && (
            <NivvoAdminFinanceView 
              onBack={() => navigateTo('admin-overview')}
            />
          )}

          {/* Brand System */}
          {currentScreen === 'brand' && (
            <NivvoBrandSystemView 
              onBack={() => navigateTo(platformMode === 'web' ? 'landing' : 'home')}
            />
          )}

          {/* Customer Profile, Dashboard & Support Hub */}
          {['profile', 'customer', 'customer-portal', 'account'].includes(currentScreen) && (
            platformMode === 'web' ? (
              <NivvoWebCustomerPortal 
                onBack={() => navigateTo('landing')}
              />
            ) : (
              <NivvoProfileView 
                onBack={() => navigateTo('home')}
              />
            )
          )}
        </div>

        {/* Dedicated Delivery Partner Mode 5-Tab Bottom Navigation Bar (Blinkit & Zomato Standard) */}
        {platformMode === 'app' && isRiderActive && (
          <nav className="nivvo-bottom-nav" role="navigation" aria-label="Delivery Partner Navigation">
            <button 
              id="nivvo-rider-nav-duty"
              className={`nivvo-nav-tab ${currentScreen === 'rider-duty' ? 'active' : ''}`}
              onClick={() => { playClickSound(); navigateTo('rider-duty'); }}
              aria-label="Duty & Radar"
            >
              <Zap size={20} strokeWidth={currentScreen === 'rider-duty' ? 2.4 : 1.8} color={currentScreen === 'rider-duty' ? '#24452D' : '#73796F'} />
              <span style={{ color: currentScreen === 'rider-duty' ? '#24452D' : '#73796F', fontWeight: currentScreen === 'rider-duty' ? 800 : 500 }}>
                Duty
              </span>
            </button>

            <button 
              id="nivvo-rider-nav-trip"
              className={`nivvo-nav-tab ${currentScreen === 'rider-active' ? 'active' : ''}`}
              onClick={() => { playClickSound(); navigateTo('rider-active'); }}
              aria-label="Orders Hub"
              style={{ position: 'relative' }}
            >
              <Package size={20} strokeWidth={currentScreen === 'rider-active' ? 2.4 : 1.8} color={currentScreen === 'rider-active' ? '#24452D' : '#73796F'} />
              <span style={{ color: currentScreen === 'rider-active' ? '#24452D' : '#73796F', fontWeight: currentScreen === 'rider-active' ? 800 : 500 }}>
                Orders
              </span>
              {activeDeliveryJob && activeDeliveryJob.stage !== 'delivered' && (
                <span style={{
                  position: 'absolute',
                  top: '4px',
                  right: '16px',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: '#B7F34A',
                  border: '1.5px solid #20251F'
                }} />
              )}
            </button>

            <button 
              id="nivvo-rider-nav-earnings"
              className={`nivvo-nav-tab ${currentScreen === 'rider-earnings' ? 'active' : ''}`}
              onClick={() => { playClickSound(); navigateTo('rider-earnings'); }}
              aria-label="Earnings & Milestones"
            >
              <TrendingUp size={20} strokeWidth={currentScreen === 'rider-earnings' ? 2.4 : 1.8} color={currentScreen === 'rider-earnings' ? '#24452D' : '#73796F'} />
              <span style={{ color: currentScreen === 'rider-earnings' ? '#24452D' : '#73796F', fontWeight: currentScreen === 'rider-earnings' ? 800 : 500 }}>
                Earnings
              </span>
            </button>

            <button 
              id="nivvo-rider-nav-support"
              className={`nivvo-nav-tab ${currentScreen === 'rider-support' ? 'active' : ''}`}
              onClick={() => { playClickSound(); navigateTo('rider-support'); }}
              aria-label="Help & Support Desk"
            >
              <HelpCircle size={20} strokeWidth={currentScreen === 'rider-support' ? 2.4 : 1.8} color={currentScreen === 'rider-support' ? '#24452D' : '#73796F'} />
              <span style={{ color: currentScreen === 'rider-support' ? '#24452D' : '#73796F', fontWeight: currentScreen === 'rider-support' ? 800 : 500 }}>
                Support
              </span>
            </button>

            <button 
              id="nivvo-rider-nav-profile"
              className={`nivvo-nav-tab ${currentScreen === 'rider-profile' ? 'active' : ''}`}
              onClick={() => { playClickSound(); navigateTo('rider-profile'); }}
              aria-label="Fleet Profile & EV Hub"
            >
              <User size={20} strokeWidth={currentScreen === 'rider-profile' ? 2.4 : 1.8} color={currentScreen === 'rider-profile' ? '#24452D' : '#73796F'} />
              <span style={{ color: currentScreen === 'rider-profile' ? '#24452D' : '#73796F', fontWeight: currentScreen === 'rider-profile' ? 800 : 500 }}>
                Profile
              </span>
            </button>
          </nav>
        )}

        {/* Customer Mode Bottom Navigation Bar (Mobile App ONLY: Home, Categories, Shop, Orders, You) */}
        {platformMode === 'app' && !isRiderActive && !hideBottomNav && (
          <nav className="nivvo-bottom-nav" role="navigation" aria-label="Customer Bottom Navigation">
            <button 
              id="nivvo-nav-home"
              className={`nivvo-nav-tab ${currentScreen === 'home' ? 'active' : ''}`}
              onClick={() => { playClickSound(); navigateTo('home'); }}
              aria-label="Home"
            >
              <Home size={22} strokeWidth={currentScreen === 'home' ? 2.4 : 1.8} />
              <span>Home</span>
            </button>

            <button 
              id="nivvo-nav-categories"
              className={`nivvo-nav-tab ${['categories', 'sneakers'].includes(currentScreen) ? 'active' : ''}`}
              onClick={() => { 
                playClickSound(); 
                setSelectedCategory('all');
                navigateTo('categories'); 
              }}
              aria-label="Categories"
            >
              <LayoutGrid size={22} strokeWidth={['categories', 'sneakers'].includes(currentScreen) ? 2.4 : 1.8} />
              <span>Categories</span>
            </button>

            <button 
              id="nivvo-nav-shops"
              className={`nivvo-nav-tab ${['shops', 'shop-detail'].includes(currentScreen) ? 'active' : ''}`}
              onClick={() => { playClickSound(); navigateTo('shops'); }}
              aria-label="Shop"
            >
              <Store size={22} strokeWidth={['shops', 'shop-detail'].includes(currentScreen) ? 2.4 : 1.8} />
              <span>Shop</span>
            </button>

            <button 
              id="nivvo-nav-orders"
              className={`nivvo-nav-tab ${currentScreen === 'tracking' ? 'active' : ''}`}
              onClick={() => { playClickSound(); navigateTo('tracking'); }}
              aria-label="Orders"
            >
              <Package size={22} strokeWidth={currentScreen === 'tracking' ? 2.4 : 1.8} />
              <span>Orders</span>
            </button>

            <button 
              id="nivvo-nav-you"
              className={`nivvo-nav-tab ${currentScreen === 'profile' ? 'active' : ''}`}
              onClick={() => { playClickSound(); navigateTo('profile'); }}
              aria-label="You"
            >
              <User size={22} strokeWidth={currentScreen === 'profile' ? 2.4 : 1.8} />
              <span>You</span>
            </button>
          </nav>
        )}
        {/* Floating Demo Screen Switcher Pill for Mobile */}
        {platformMode === 'app' && (
          <div 
            className="nivvo-mobile-switcher-trigger"
            style={{
              bottom: (totalCartCount > 0 && !isRiderActive && !hideBottomNav)
                ? 'calc(134px + env(safe-area-inset-bottom, 8px))'
                : (hideBottomNav && !isRiderActive)
                  ? 'calc(16px + env(safe-area-inset-bottom, 8px))'
                  : 'calc(76px + env(safe-area-inset-bottom, 8px))'
            }}
          >
            <button
              onClick={() => { playClickSound(); setShowMobileSwitcher(!showMobileSwitcher); }}
              style={{
                backgroundColor: '#20251F',
                color: '#FFFFFF',
                border: '1.5px solid #B7F34A',
                padding: '6px 12px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
                cursor: 'pointer'
              }}
            >
              <span>Screen: {currentScreen}</span>
              <ChevronDown size={14} />
            </button>
          </div>
        )}

        {/* Mobile Screen Switcher Drawer */}
        {showMobileSwitcher && (
          <div className="nivvo-modal-overlay" onClick={() => setShowMobileSwitcher(false)}>
            <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
              <div className="nivvo-modal-header">
                <div>
                  <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#20251F' }}>
                    {platformMode === 'web' ? 'Website Portal Pages' : 'Mobile App Screens'}
                  </h3>
                  <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px' }}>
                    {platformMode === 'web' ? 'Boutique Sellers & Admin Management' : 'Customer 10-Min Try-On & Delivery Fleet'}
                  </div>
                </div>
                <button className="nivvo-modal-close-btn" onClick={() => setShowMobileSwitcher(false)} aria-label="Close">
                  <X size={18} />
                </button>
              </div>

              {/* Seamless Platform Switcher Banner inside Drawer */}
              <div style={{
                margin: '12px 0 8px 0',
                padding: '10px 14px',
                borderRadius: '12px',
                backgroundColor: platformMode === 'web' ? '#EEF4EC' : '#FFF3E0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: platformMode === 'web' ? '#24452D' : '#D97706' }}>
                  {platformMode === 'web' ? 'Switch to Customer/Rider Mobile App?' : 'Switch to Seller/Admin Website Portal?'}
                </span>
                <button
                  onClick={() => {
                    playClickSound();
                    setShowMobileSwitcher(false);
                    if (platformMode === 'web') switchToAppMode();
                    else switchToWebMode();
                  }}
                  style={{
                    backgroundColor: platformMode === 'web' ? '#24452D' : '#D97706',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  {platformMode === 'web' ? '📱 Open App' : '🌐 Open Web'}
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                {(platformMode === 'web' ? websiteScreens : mobileAppScreens).map((sc) => (
                  <button
                    key={sc.id}
                    onClick={() => {
                      playClickSound();
                      if (sc.role === 'Rider' || sc.id.startsWith('rider-')) {
                        setAppMode('rider');
                      } else if (sc.role === 'Customer' || ['home', 'categories', 'shops', 'shop-detail', 'sneakers', 'product-detail', 'bag', 'checkout', 'tracking', 'profile'].includes(sc.id)) {
                        setAppMode('customer');
                      }
                      navigateTo(sc.id);
                      setShowMobileSwitcher(false);
                    }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: currentScreen === sc.id ? '2px solid #20251F' : '1px solid #E7EAE3',
                      backgroundColor: currentScreen === sc.id ? '#F7F8F5' : '#FFFFFF',
                      color: '#20251F',
                      fontWeight: currentScreen === sc.id ? 800 : 500,
                      fontSize: '13px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span>{sc.label}</span>
                    <span style={{
                      fontSize: '10px',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: sc.role === 'Rider' ? '#EEF4EC' : (sc.role === 'Seller' ? '#FFF3E0' : '#F5F5F5'),
                      color: sc.role === 'Rider' ? '#24452D' : (sc.role === 'Seller' ? '#D97706' : '#73796F'),
                      fontWeight: 700
                    }}>
                      {sc.role}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mount All Modal Dialogs and Toasts */}
        <NivvoModals />

        {/* Nivvo Multi-Role Authentication & Verification Modal */}
        <NivvoAuthModal 
          isOpen={authModalOpen} 
          initialRole={authModalRole} 
          onClose={() => setAuthModalOpen(false)} 
          onAuthSuccess={handleLoginSuccess} 
        />

        {/* Customer to Delivery Partner Onboarding Modal */}
        <BecomeRiderModal 
          isOpen={becomeRiderModalOpen}
          onClose={() => setBecomeRiderModalOpen(false)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <NivvoAppProvider>
      <AppContent />
    </NivvoAppProvider>
  );
}
