import React, { createContext, useContext, useState, useEffect } from 'react';
import { NIVVO_PRODUCTS, NIVVO_SHOPS } from '../data/nivvoData';
import { playClickSound, playAddSound, playTrialSound } from '../utils/audioEffects';
import { 
  createOrder, 
  fetchOrders, 
  fetchShopOrdersApi, 
  acceptShopOrderApi, 
  rejectShopOrderApi, 
  dispatchShopOrderApi, 
  fetchDeliveryOrdersApi, 
  updateDeliveryOrderApi,
  toggleDeliveryPartnerOnlineApi,
  updateDeliveryPartnerLocationApi,
  fetchOrderTrackingApi 
} from '../services/api';
import { 
  detectDeviceCoordinates, 
  reverseGeocodeCoords, 
  checkLocationPermission, 
  calculateDistance, 
  calculateEta,
  calculateEtaMinutes,
  formatDistanceText,
  METRO_DELIVERY_HUBS 
} from '../services/locationService';

const NivvoAppContext = createContext();

export const parsePrice = (val) => {
  if (typeof val === 'number') return isNaN(val) ? 0 : val;
  if (!val) return 0;
  if (typeof val === 'string') {
    const cleaned = val.replace(/[^0-9.]/g, '');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

export const isNativeMobileApp = () => {
  try {
    if (typeof window === 'undefined') return false;
    return Boolean(
      window.__IS_MOBILE_APP__ || 
      window.ReactNativeWebView || 
      window.location.protocol === 'file:'
    );
  } catch {
    return false;
  }
};

export const WEB_SCREENS = [
  'landing', 
  'seller-dash', 'seller-overview', 'seller-prods', 'seller-orders', 
  'seller-payouts', 'seller-profile', 'seller-reviews', 'seller-support', 
  'admin-overview', 'admin-sellers', 'admin-orders', 'admin-delivery', 'admin-customers', 'admin-finance',
  'profile', 'customer', 'customer-portal'
];

export const APP_SCREENS = [
  'home', 'categories', 'shops', 'shop-detail', 'sneakers', 
  'product-detail', 'bag', 'checkout', 'tracking', 'profile', 
  'grocery', 'food', 'brand'
];

export const LANDING_ANCHORS = [
  'how-it-works', 'collections', 'boutiques', 'try-on-demo', 
  'seller-onboarding', 'coverage', 'faq', 'app-download', 
  'features', 'revenue-calculator'
];

export const resolveUrlRoute = () => {
  try {
    if (typeof window === 'undefined') return { screen: 'landing', mode: 'web' };
    
    const rawHash = (window.location.hash || '').replace(/^#\/?/, '').split('?')[0].trim().toLowerCase();
    const rawPath = (window.location.pathname || '').replace(/^\//, '').split('?')[0].trim().toLowerCase();
    
    // In-page anchor on landing page
    if (LANDING_ANCHORS.includes(rawHash)) {
      return { screen: 'landing', mode: 'web', anchor: rawHash };
    }
    
    // Target resolution priority: explicit hash takes precedence over path
    let target = '';
    if (rawHash && rawHash !== '/') {
      target = rawHash;
    } else if (rawPath && rawPath !== '/' && rawPath !== 'index.html') {
      target = rawPath;
    } else {
      target = 'landing';
    }

    // Read stored user role if available for role-aware routing
    let storedUserRole = 'customer';
    try {
      const u = JSON.parse(localStorage.getItem('nivvo_user') || '{}');
      if (u && u.role) storedUserRole = u.role;
    } catch {}

    // Aliases normalization
    if (['seller-overview', 'seller-dash', 'seller', 'merchant'].includes(target)) {
      return { screen: 'seller-dash', mode: 'web' };
    }
    if (['seller-prods', 'seller-products', 'inventory'].includes(target)) {
      return { screen: 'seller-prods', mode: 'web' };
    }
    if (['seller-orders', 'merchant-orders'].includes(target)) {
      return { screen: 'seller-orders', mode: 'web' };
    }
    if (['seller-payouts'].includes(target)) {
      return { screen: 'seller-payouts', mode: 'web' };
    }
    if (['seller-profile', 'store-profile'].includes(target)) {
      return { screen: 'seller-profile', mode: 'web' };
    }
    if (['seller-reviews', 'reviews'].includes(target)) {
      return { screen: 'seller-reviews', mode: 'web' };
    }
    if (['seller-support'].includes(target)) {
      return { screen: 'seller-support', mode: 'web' };
    }
    if (['admin-overview', 'admin', 'admin-ops'].includes(target)) {
      return { screen: 'admin-overview', mode: 'web' };
    }
    if (['admin-sellers', 'merchant-ops'].includes(target)) {
      return { screen: 'admin-sellers', mode: 'web' };
    }
    if (['admin-orders', 'admin-dispatch'].includes(target)) {
      return { screen: 'admin-orders', mode: 'web' };
    }
    if (['admin-delivery', 'admin-fleet'].includes(target)) {
      return { screen: 'admin-delivery', mode: 'web' };
    }
    if (['admin-customers', 'admin-crm'].includes(target)) {
      return { screen: 'admin-customers', mode: 'web' };
    }
    if (['admin-finance', 'admin-settlements'].includes(target)) {
      return { screen: 'admin-finance', mode: 'web' };
    }

    // Role-aware generic aliases
    if (['orders', 'order', 'dispatch'].includes(target)) {
      if (storedUserRole === 'admin') return { screen: 'admin-orders', mode: 'web' };
      if (storedUserRole === 'seller') return { screen: 'seller-orders', mode: 'web' };
      return { screen: isNativeMobileApp() ? 'tracking' : 'profile', mode: isNativeMobileApp() ? 'app' : 'web' };
    }
    if (['finance', 'payouts', 'settlement', 'settlements'].includes(target)) {
      if (storedUserRole === 'admin') return { screen: 'admin-finance', mode: 'web' };
      if (storedUserRole === 'seller') return { screen: 'seller-payouts', mode: 'web' };
      return { screen: 'profile', mode: isNativeMobileApp() ? 'app' : 'web' };
    }
    if (['delivery', 'fleet'].includes(target)) {
      if (storedUserRole === 'admin') return { screen: 'admin-delivery', mode: 'web' };
      if (storedUserRole === 'rider') return { screen: 'rider-duty', mode: 'app' };
      return { screen: 'tracking', mode: isNativeMobileApp() ? 'app' : 'web' };
    }
    if (['customer', 'customers', 'customer-portal', 'profile', 'account'].includes(target)) {
      if (storedUserRole === 'admin' && target === 'customers') return { screen: 'admin-customers', mode: 'web' };
      return { screen: 'profile', mode: isNativeMobileApp() ? 'app' : 'web' };
    }
    if (target.startsWith('rider-')) {
      return { screen: target, mode: 'app' };
    }
    if (APP_SCREENS.includes(target)) {
      return { screen: target, mode: isNativeMobileApp() ? 'app' : 'web' };
    }
    
    return { screen: 'landing', mode: isNativeMobileApp() ? 'app' : 'web' };
  } catch {
    return { screen: 'landing', mode: 'web' };
  }
};

export function NivvoAppProvider({ children }) {
  // 0. Production Authentication & Role-Based Access Control State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('nivvo_user');
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  });

  const [authToken, setAuthToken] = useState(() => {
    try {
      return localStorage.getItem('nivvo_token') || '';
    } catch (e) {
      return '';
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalRole, setAuthModalRole] = useState('customer'); // 'customer' | 'seller' | 'rider' | 'admin'

  // ============================================================================
  // PLATFORM ARCHITECTURE: Website (Seller & Admin & Web Customer) vs Mobile App (App Store)
  // ============================================================================
  const [platformMode, setPlatformMode] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        if (isNativeMobileApp()) {
          return 'app';
        }
        const route = resolveUrlRoute();
        return route.mode || 'web';
      }
    } catch (e) {}
    return 'web';
  });

  useEffect(() => {
    try {
      localStorage.setItem('nivvo_platform_mode', platformMode);
    } catch {}
  }, [platformMode]);

  const switchToWebMode = () => {
    playClickSound();
    setPlatformMode('web');
    try {
      localStorage.setItem('nivvo_platform_mode', 'web');
    } catch {}
    setCurrentScreen('landing');
    try {
      if (window.history && window.history.pushState) {
        window.history.pushState(null, '', '/#/landing');
      } else {
        window.location.hash = '#/landing';
      }
    } catch {}
    showToast('Switched to Nivvo Website 🌐');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToAppMode = (targetAppMode = 'customer') => {
    playClickSound();
    setPlatformMode('app');
    setAppMode(targetAppMode);
    try {
      localStorage.setItem('nivvo_platform_mode', 'app');
      localStorage.setItem('nivvo_app_mode', targetAppMode);
    } catch {}
    const screen = targetAppMode === 'rider' ? 'rider-duty' : 'home';
    setCurrentScreen(screen);
    try {
      window.location.hash = `#/${screen}`;
    } catch {}
    showToast(`Switched to Nivvo Mobile App (${targetAppMode === 'rider' ? 'Delivery Partner' : 'Customer'} Mode) 📱`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================================================
  // APP MODES: Customer Mode <---> Delivery Partner Mode (Inside Mobile App)
  // ============================================================================
  const [appMode, setAppMode] = useState(() => {
    try {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash && hash.startsWith('rider-')) return 'rider';
      return localStorage.getItem('nivvo_app_mode') || 'customer';
    } catch {
      return 'customer';
    }
  });

  const [becomeRiderModalOpen, setBecomeRiderModalOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('nivvo_app_mode', appMode);
    } catch {}
  }, [appMode]);

  // Persist user and token across browser/app reloads
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('nivvo_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('nivvo_user');
      }
    } catch (e) {}
  }, [currentUser]);

  useEffect(() => {
    try {
      if (authToken) {
        localStorage.setItem('nivvo_token', authToken);
      } else {
        localStorage.removeItem('nivvo_token');
      }
    } catch (e) {}
  }, [authToken]);

  // Sync / Refresh Session from Backend
  useEffect(() => {
    if (!authToken || authToken.startsWith('demo-')) return;
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.success && data?.user) {
          setCurrentUser(data.user);
          try {
            localStorage.setItem('nivvo_user', JSON.stringify(data.user));
          } catch {}

          if (data.user.role === 'seller') {
            const sellerStatus = data.shop?.verification_status || data.user.verification_status || data.verification_status || 'approved';
            setShopProfile(prev => ({
              ...prev,
              ...(data.shop || {}),
              shop_name: data.shop?.shop_name || data.user.shop_name || prev.shop_name,
              verification_status: sellerStatus,
              rejection_reason: data.shop?.rejection_reason || data.user.rejection_reason || null,
              admin_notes: data.shop?.admin_notes || data.user.admin_notes || null
            }));
            const updatedUser = {
              ...data.user,
              verification_status: sellerStatus
            };
            setCurrentUser(updatedUser);
            try {
              localStorage.setItem('nivvo_user', JSON.stringify(updatedUser));
            } catch {}
          } else if (data.user.role === 'rider') {
            const riderStatus = data.rider?.verification_status || data.user.verification_status || data.verification_status || 'approved';
            setRiderProfile(prev => ({
              ...prev,
              ...(data.rider || {}),
              name: data.rider?.name || data.user.name || prev.name,
              verification_status: riderStatus,
              rejection_reason: data.rider?.rejection_reason || data.user.rejection_reason || null,
              admin_notes: data.rider?.admin_notes || data.user.admin_notes || null
            }));
            const updatedUser = {
              ...data.user,
              verification_status: riderStatus
            };
            setCurrentUser(updatedUser);
            try {
              localStorage.setItem('nivvo_user', JSON.stringify(updatedUser));
            } catch {}
          }
        } else if (data?.error?.includes('expired') || data?.error?.includes('Invalid')) {
          logoutUser();
        }
      })
      .catch(() => {});
  }, [authToken]);

  const handleLoginSuccess = (authData) => {
    playTrialSound();
    const effectiveStatus = 
      authData.verification_status || 
      authData.shop?.verification_status || 
      authData.user?.verification_status || 
      'approved';

    if (authData.user) {
      const updatedUser = {
        ...authData.user,
        role: authData.user.role || (authData.shop ? 'seller' : 'customer'),
        verification_status: effectiveStatus
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('nivvo_user', JSON.stringify(updatedUser));
      } catch {}
    }
    if (authData.token) {
      setAuthToken(authData.token);
      try {
        localStorage.setItem('nivvo_token', authData.token);
      } catch {}
    }
    if (authData.shop) {
      setShopProfile(prev => ({
        ...prev,
        ...authData.shop,
        verification_status: effectiveStatus,
        status: 'ACTIVE',
        is_open: true
      }));
    }
    if (authData.rider) {
      setRiderProfile(prev => ({
        ...prev,
        ...authData.rider,
        verification_status: effectiveStatus,
        is_online: true
      }));
    }

    const userRole = authData.user?.role || 'customer';

    // ──────────────────────────────────────────
    // DIRECT ROLE-BASED REDIRECTION
    // ──────────────────────────────────────────
    if (userRole === 'seller') {
      // 1. SELLER: Directly redirect to Seller Dashboard
      setPlatformMode('web');
      try {
        localStorage.setItem('nivvo_platform_mode', 'web');
      } catch {}
      navigateTo('seller-dash');
      showToast(`Welcome back, ${authData.user.name || 'Merchant'}! Opening Seller Dashboard... 🏪`);
    } else if (userRole === 'customer') {
      // 2. CUSTOMER: Directly redirect to Customer Dashboard / Portal or Storefront
      if (isNativeMobileApp()) {
        setPlatformMode('app');
        setAppMode('customer');
        try {
          localStorage.setItem('nivvo_platform_mode', 'app');
          localStorage.setItem('nivvo_app_mode', 'customer');
        } catch {}
        navigateTo('home');
      } else {
        setPlatformMode('web');
        setAppMode('customer');
        try {
          localStorage.setItem('nivvo_platform_mode', 'web');
          localStorage.setItem('nivvo_app_mode', 'customer');
        } catch {}
        navigateTo('profile');
      }
      showToast(`Welcome back, ${authData.user?.name || 'Shopper'}! 🛍️`);
    } else if (userRole === 'admin') {
      // 3. ADMIN: Directly redirect to Admin Operations
      setPlatformMode('web');
      try {
        localStorage.setItem('nivvo_platform_mode', 'web');
      } catch {}
      navigateTo('admin-overview');
      showToast('Operations Console Access Granted 🛡️');
    } else if (userRole === 'rider') {
      // 4. RIDER: Directly redirect to Delivery Fleet Duty
      setPlatformMode('app');
      setAppMode('rider');
      try {
        localStorage.setItem('nivvo_platform_mode', 'app');
        localStorage.setItem('nivvo_app_mode', 'rider');
      } catch {}
      navigateTo('rider-duty');
      showToast(`Delivery Fleet Ready · Welcome ${authData.user?.name || 'Partner'}! ⚡`);
    } else {
      navigateTo('landing');
      showToast(`Signed in as ${authData.user?.name || 'User'}`);
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoutUser = () => {
    playClickSound();
    setCurrentUser(null);
    setAuthToken('');
    try {
      localStorage.removeItem('nivvo_user');
      localStorage.removeItem('nivvo_token');
      localStorage.setItem('nivvo_app_mode', 'customer');
    } catch {}
    setAppMode('customer');
    if (isNativeMobileApp()) {
      setPlatformMode('app');
      setCurrentScreen('home');
    } else {
      setPlatformMode('web');
      setCurrentScreen('landing');
      try {
        if (window.history && window.history.pushState) {
          window.history.pushState(null, '', '/#/landing');
        } else {
          window.location.hash = '#/landing';
        }
      } catch {}
    }
    showToast('Signed out of Nivvo.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============================================================================
  // SEAMLESS DUAL-MODE TRANSITION (CUSTOMER <---> DELIVERY PARTNER)
  // ============================================================================
  const switchToCustomerMode = () => {
    playClickSound();
    setAppMode('customer');
    setCurrentScreen('home');
    try {
      localStorage.setItem('nivvo_app_mode', 'customer');
    } catch {}
    showToast('Switched to Customer Shopping Mode · Welcome! 🛍️');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToRiderMode = () => {
    playTrialSound();
    const hasRiderProfile = riderProfile?.partner_id || currentUser?.role === 'rider' || currentUser?.has_rider_profile;
    
    if (!hasRiderProfile) {
      setBecomeRiderModalOpen(true);
      return;
    }

    setAppMode('rider');
    setCurrentScreen('rider-duty');
    try {
      localStorage.setItem('nivvo_app_mode', 'rider');
    } catch {}
    showToast('Switched to Delivery Partner Mode · Fleet Duty Active! ⚡');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const registerCustomerAsRider = (details) => {
    playTrialSound();
    const updatedRider = {
      ...riderProfile,
      partner_id: `RDR-${Math.floor(1000 + Math.random() * 9000)}`,
      name: details.name || currentUser?.name || 'Partner',
      phone: details.phone || currentUser?.phone || '+91 9876543210',
      vehicle_type: details.vehicle_type || 'Electric Scooter (EV)',
      vehicle_number: details.vehicle_number || 'KA-03-EV-4421',
      license_number: details.license_number || 'DL-04202100892',
      aadhaar_number: details.aadhaar_number || 'XXXX-XXXX-4819',
      emergency_contact: details.emergency_contact || '+91 80 4912 8820',
      is_online: true,
      kyc_status: 'APPROVED',
      verification_status: 'approved'
    };

    setRiderProfile(updatedRider);

    if (currentUser) {
      const updatedUser = {
        ...currentUser,
        has_rider_profile: true
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('nivvo_user', JSON.stringify(updatedUser));
      } catch {}
    }

    setAppMode('rider');
    setCurrentScreen('rider-duty');
    setBecomeRiderModalOpen(false);
    try {
      localStorage.setItem('nivvo_app_mode', 'rider');
    } catch {}

    showToast('Welcome to Nivvo Fleet! You are now a Delivery Partner 🎉');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetch('/api/auth/rider/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: updatedRider.name,
        phone: updatedRider.phone,
        city: 'Bengaluru',
        vehicle_type: updatedRider.vehicle_type,
        vehicle_number: updatedRider.vehicle_number,
        license_number: updatedRider.license_number,
        aadhaar_number: updatedRider.aadhaar_number,
        emergency_contact: updatedRider.emergency_contact,
        documents: { license: 'verified.jpg', vehicle_rc: 'verified.jpg' }
      })
    }).catch(() => {});
  };

  // 1. Navigation State with URL Sync
  const [currentScreen, setCurrentScreen] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        const route = resolveUrlRoute();
        return route.screen || (isNativeMobileApp() ? 'home' : 'landing');
      }
    } catch {}
    return 'landing';
  });

  useEffect(() => {
    const handleUrlChange = () => {
      try {
        const route = resolveUrlRoute();
        setCurrentScreen(route.screen);
        if (!isNativeMobileApp()) {
          setPlatformMode(route.mode);
        }
        if (route.anchor) {
          const el = document.getElementById(route.anchor);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }
      } catch {}
    };

    // Run on mount to ensure route and platformMode match the active URL
    handleUrlChange();

    window.addEventListener('hashchange', handleUrlChange);
    window.addEventListener('popstate', handleUrlChange);
    return () => {
      window.removeEventListener('hashchange', handleUrlChange);
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, [currentUser?.phone, currentUser?.role]);

  // Synchronize appMode when screen changes
  useEffect(() => {
    if (currentScreen.startsWith('rider-') && appMode !== 'rider') {
      setAppMode('rider');
      try { localStorage.setItem('nivvo_app_mode', 'rider'); } catch {}
    }
  }, [currentScreen, appMode]);

  const [selectedProduct, setSelectedProduct] = useState(NIVVO_PRODUCTS[0]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [allProducts, setAllProducts] = useState(NIVVO_PRODUCTS);
  const [allShops, setAllShops] = useState(NIVVO_SHOPS);
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'tablet' | 'desktop'
  const [searchQuery, setSearchQuery] = useState('');

  // 1A. Company Admin Seller & Rider Verification Compliance Lifecycle State
  const [pendingSellerApplications, setPendingSellerApplications] = useState([
    {
      id: 101,
      shop_name: 'Meenakshi Silks & Sarees',
      owner_name: 'Priya Narang',
      phone: '+91 98451 22890',
      email: 'priya@meenakshisilks.in',
      category: 'Clothes, Sarees & Ethnic Silks',
      address: 'Plot 18, Double Road, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      gstin: '29AAECM1048P1ZP',
      pan_number: 'AAECM1048P',
      trade_license: 'TL-BLR-2024-8841',
      verification_status: 'PENDING',
      submitted_at: 'Today, 11:20 AM',
      documents: {
        gst_certificate: 'gst_certificate_verified.pdf',
        store_photo: 'store_exterior_meenakshi.jpg',
        pan_card: 'pan_card_priya.pdf',
        cancelled_cheque: 'icici_cancelled_cheque.pdf'
      }
    },
    {
      id: 102,
      shop_name: 'Apex Laptops & Mobiles',
      owner_name: 'Vikram Malhotra',
      phone: '+91 99008 33145',
      email: 'vikram@apextech.in',
      category: 'Laptops, Mobile Phones & Fast Chargers',
      address: '88, 100ft Road, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      gstin: '29AAHCA2291M1Z5',
      pan_number: 'AAHCA2291M',
      trade_license: 'TL-BLR-2024-9902',
      verification_status: 'PENDING',
      submitted_at: 'Today, 01:15 PM',
      documents: {
        gst_certificate: 'gst_apex_electronics.pdf',
        store_photo: 'storefront_apex_tech.jpg',
        pan_card: 'pan_card_vikram.pdf',
        cancelled_cheque: 'hdfc_cancelled_cheque.pdf'
      }
    },
    {
      id: 103,
      shop_name: 'Scholar Books & Stationery',
      owner_name: 'Sudhir Sen',
      phone: '+91 98450 44921',
      email: 'sudhir@scholarbooks.in',
      category: 'Books, Pens & Notebooks',
      address: '12th Main Road, Near Corner House, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      gstin: '29BBDCS4819Q1ZT',
      pan_number: 'BBDCS4819Q',
      trade_license: 'TL-BLR-2024-4410',
      verification_status: 'PENDING',
      submitted_at: 'Today, 02:00 PM',
      documents: {
        gst_certificate: 'gst_scholar_books.pdf',
        store_photo: 'storefront_scholar_books.jpg',
        pan_card: 'pan_card_sudhir.pdf',
        cancelled_cheque: 'sbi_cancelled_cheque.pdf'
      }
    },
    {
      id: 104,
      shop_name: 'Canvas & Carry Bags',
      owner_name: 'Nisha Reddy',
      phone: '+91 97410 88722',
      email: 'nisha@canvascarry.in',
      category: 'Bags, Backpacks & Travel Totes',
      address: '42, CMH Road, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      gstin: '29AABCC7712R1ZU',
      pan_number: 'AABCC7712R',
      trade_license: 'TL-BLR-2024-1182',
      verification_status: 'PENDING',
      submitted_at: 'Today, 02:30 PM',
      documents: {
        gst_certificate: 'gst_canvas_carry.pdf',
        store_photo: 'store_photo_canvas.jpg',
        pan_card: 'pan_card_nisha.pdf',
        cancelled_cheque: 'axis_cancelled_cheque.pdf'
      }
    }
  ]);

  const [pendingRiderApplications, setPendingRiderApplications] = useState([
    {
      id: 201,
      name: 'Kiran Murthy',
      phone: '+91 99008 12345',
      email: 'kiran.m@nivvo.fleet',
      vehicle_type: 'Electric Scooter (EV)',
      vehicle_number: 'KA-04-EV-2104',
      license_number: 'KA-04-2022-004128',
      aadhaar_number: 'XXXX-XXXX-4812',
      emergency_contact: '+91 80 4912 8820',
      verification_status: 'PENDING',
      submitted_at: 'Today, 12:40 PM',
      city: 'Bengaluru',
      documents: {
        driving_license: 'dl_front_kiran.jpg',
        aadhaar_doc: 'aadhaar_card_masked.pdf'
      }
    },
    {
      id: 202,
      name: 'Arjun Gowda',
      phone: '+91 98451 99001',
      email: 'arjun.g@nivvo.fleet',
      vehicle_type: 'Electric Ather 450X',
      vehicle_number: 'KA-03-JJ-9901',
      license_number: 'KA-03-2023-009981',
      aadhaar_number: 'XXXX-XXXX-7721',
      emergency_contact: '+91 80 4912 8820',
      verification_status: 'PENDING',
      submitted_at: 'Today, 02:10 PM',
      city: 'Bengaluru',
      documents: {
        driving_license: 'dl_front_arjun.jpg',
        aadhaar_doc: 'aadhaar_card_masked.pdf'
      }
    }
  ]);

  // Company Admin Verification Decision Handlers
  const approveSellerApplication = (appId, notes = '') => {
    playTrialSound();
    const app = pendingSellerApplications.find(a => a.id === appId);
    if (!app) return;

    setPendingSellerApplications(prev => prev.filter(a => a.id !== appId));

    // Create verified shop object and add to allShops
    const newShopObj = {
      id: app.shop_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: app.shop_name,
      tagline: `${app.category} · Verified local store`,
      verified: true,
      address: app.address,
      distance: '0.8 km away',
      rating: 5.0,
      reviewsCount: 1,
      eta: '12–18 min',
      hours: '10 am–9 pm',
      status: 'Open · Stock synced',
      note: 'Verified local stock · Official partner',
      description: `${app.shop_name} by ${app.owner_name}. Proud neighbourhood store delivering within minutes on Nivvo.`,
      categories: app.category.split(/[,&·]+/).map(c => c.trim()),
      image: '/assets/figma/shop_sole_street.png',
      banner: '/assets/figma/shop_sole_street_banner.png'
    };

    setAllShops(prev => {
      const exists = prev.find(s => s.name === app.shop_name);
      return exists ? prev : [newShopObj, ...prev];
    });

    // Update current shop profile to approved
    setShopProfile(prev => ({
      ...prev,
      shop_name: app.shop_name,
      owner_name: app.owner_name,
      phone: app.phone,
      email: app.email,
      verification_status: 'approved',
      status: 'ACTIVE',
      is_open: true
    }));

    // Update currentUser if matching
    setCurrentUser(prev => {
      if (!prev) return prev;
      const isMatch = (prev.phone && app.phone && prev.phone.replace(/\D/g, '') === app.phone.replace(/\D/g, '')) ||
                      (prev.email && app.email && prev.email.toLowerCase() === app.email.toLowerCase()) ||
                      prev.role === 'seller';
      if (isMatch) {
        const u = {
          ...prev,
          role: 'seller',
          verification_status: 'approved',
          shop_name: app.shop_name
        };
        try { localStorage.setItem('nivvo_user', JSON.stringify(u)); } catch {}
        return u;
      }
      return prev;
    });

    // Persist approved phone into localStorage
    try {
      const approvedList = JSON.parse(localStorage.getItem('nivvo_approved_sellers') || '[]');
      if (!approvedList.includes(app.phone)) {
        approvedList.push(app.phone);
        localStorage.setItem('nivvo_approved_sellers', JSON.stringify(approvedList));
      }
    } catch {}

    showToast(`Shop "${app.shop_name}" APPROVED! Storefront is live for customer discovery. 🟢`);

    fetch(`/api/admin/verifications/shops/${app.shop_id || app.id || appId}/decision`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {})
      },
      body: JSON.stringify({ 
        decision: 'approved',
        status: 'approved',
        phone: app.phone,
        email: app.email,
        owner_name: app.owner_name,
        shop_name: app.shop_name,
        notes 
      })
    }).catch(() => {});
  };

  const rejectSellerApplication = (appId, reason = 'Incomplete business documents') => {
    playClickSound();
    const app = pendingSellerApplications.find(a => a.id === appId);
    setPendingSellerApplications(prev => prev.filter(a => a.id !== appId));

    setShopProfile(prev => ({
      ...prev,
      verification_status: 'REJECTED',
      rejection_reason: reason
    }));

    showToast(`Application for "${app?.shop_name || 'Shop'}" rejected: "${reason}". Seller notified. ⚠️`);

    fetch(`/api/admin/verifications/shops/${appId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', rejection_reason: reason })
    }).catch(() => {});
  };

  const approveRiderApplication = (appId, notes = '') => {
    playTrialSound();
    const app = pendingRiderApplications.find(a => a.id === appId);
    if (!app) return;

    setPendingRiderApplications(prev => prev.filter(a => a.id !== appId));

    setRiderProfile(prev => ({
      ...prev,
      kyc_status: 'APPROVED',
      name: app.name,
      vehicle_type: app.vehicle_type,
      vehicle_number: app.vehicle_number
    }));

    showToast(`Delivery partner "${app.name}" APPROVED! Rider can now accept order dispatches. 🛵`);

    fetch(`/api/admin/verifications/riders/${appId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', notes })
    }).catch(() => {});
  };

  const rejectRiderApplication = (appId, reason = 'Document clarification needed') => {
    playClickSound();
    const app = pendingRiderApplications.find(a => a.id === appId);
    setPendingRiderApplications(prev => prev.filter(a => a.id !== appId));

    showToast(`Rider application for "${app?.name || 'Partner'}" rejected: "${reason}". ⚠️`);

    fetch(`/api/admin/verifications/riders/${appId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected', rejection_reason: reason })
    }).catch(() => {});
  };

  const submitSellerApplication = (applicationData) => {
    playTrialSound();
    const newId = 100 + pendingSellerApplications.length + 1;
    const newApp = {
      id: newId,
      shop_name: applicationData.shop_name || 'Boutique Partner',
      owner_name: applicationData.owner_name || 'Store Owner',
      phone: applicationData.phone,
      email: applicationData.email || '',
      category: applicationData.category || 'Footwear & Apparel',
      address: applicationData.address || 'Indiranagar, Bengaluru',
      city: 'Bengaluru',
      pincode: '560038',
      gstin: applicationData.gstin || '29AABCU9603R1ZM',
      pan_number: applicationData.pan_number || 'AABCU9603R',
      trade_license: 'TL-BLR-2026-9012',
      verification_status: 'PENDING',
      submitted_at: 'Just now',
      documents: applicationData.documents || {
        gst_certificate: 'gst_certificate.pdf',
        store_photo: 'storefront.jpg',
        pan_card: 'pan_card.pdf',
        cancelled_cheque: 'cancelled_cheque.pdf'
      }
    };

    setPendingSellerApplications(prev => [newApp, ...prev]);

    setShopProfile(prev => ({
      ...prev,
      shop_name: newApp.shop_name,
      owner_name: newApp.owner_name,
      phone: newApp.phone,
      email: newApp.email,
      category: newApp.category,
      address: newApp.address,
      verification_status: 'pending',
      is_open: false
    }));

    showToast('Merchant account request submitted! Awaiting Admin review and approval.');
    return newApp;
  };

  // 1B. Real-Time GPS Delivery Partner Location Tracking
  const [liveLocationTracking, setLiveLocationTracking] = useState({
    isActive: true,
    progress: 0.35, // 0 to 1
    riderLat: 12.9735,
    riderLng: 77.6411,
    originLat: 12.9716, // Sole Street Indiranagar 100ft Road
    originLng: 77.6412,
    destLat: 12.9784, // Customer Maple Court
    destLng: 77.6408,
    distanceKm: 1.2,
    etaMinutes: 8,
    speedKmph: 24,
    stepIndex: 2, // 0: preparing, 1: ready, 2: out_for_delivery, 3: arrived_doorstep, 4: delivered
    stepLabel: 'Out for delivery',
    subText: 'Rider Ravi is riding down 100ft Road towards 12th Main',
    tryOnSecondsRemaining: 600, // 10 minutes try on countdown (seconds)
    riderName: 'Ravi Kumar',
    riderPhone: '+91 98450 12345',
    riderVehicle: 'Ather 450X (Electric)',
    riderRating: 4.9,
    riderBadge: 'Top Rated Partner'
  });

  // Continuous GPS simulation while an order is out for delivery
  useEffect(() => {
    const timer = setInterval(() => {
      setLiveLocationTracking(prev => {
        // If arrived at doorstep (stepIndex 3), count down try-on timer
        if (prev.stepIndex === 3 && prev.tryOnSecondsRemaining > 0) {
          return { ...prev, tryOnSecondsRemaining: prev.tryOnSecondsRemaining - 1 };
        }

        // Only advance GPS if active and in out_for_delivery step (stepIndex 2)
        if (!prev.isActive || prev.stepIndex !== 2) {
          return prev;
        }

        const nextProgress = Math.min(1, prev.progress + 0.05);
        const nextDist = Math.max(0, parseFloat((1.8 * (1 - nextProgress)).toFixed(2)));
        const nextEta = Math.max(1, Math.round(10 * (1 - nextProgress)));
        const nextLat = prev.originLat + (prev.destLat - prev.originLat) * nextProgress;
        const nextLng = prev.originLng + (prev.destLng - prev.originLng) * nextProgress;

        if (nextProgress >= 1 || nextDist <= 0.05) {
          // Arrived at doorstep!
          return {
            ...prev,
            progress: 1,
            distanceKm: 0,
            etaMinutes: 0,
            stepIndex: 3,
            stepLabel: 'Arrived at Doorstep',
            subText: 'Rider arrived at your building! 10-minute doorstep try-on started.',
            riderLat: prev.destLat,
            riderLng: prev.destLng
          };
        }

        return {
          ...prev,
          progress: nextProgress,
          distanceKm: nextDist,
          etaMinutes: nextEta,
          riderLat: nextLat,
          riderLng: nextLng,
          subText: `Rider is ${nextDist} km away · Approaching 12th Main Road`
        };
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [currentUser?.phone, currentUser?.role]);

  // 2. Cart State (starts empty by default; only appears when customer adds items)
  const [cart, setCart] = useState([]);

  // 3. Coupons State
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 4. Address & Geolocation State
  const INITIAL_ADDRESSES = [
    {
      id: 'addr-home',
      tag: 'Home',
      title: 'Home · Indiranagar',
      area: 'Indiranagar',
      street: 'A-302, Maple Court, 12th Main Road',
      city: 'Bengaluru 560038',
      phone: '+91 98765 43210',
      recipient: 'Aarav Shah',
      note: 'Please ring the doorbell.',
      etaModifier: 0,
      latitude: 12.9716,
      longitude: 77.6412
    },
    {
      id: 'addr-work',
      tag: 'Work',
      title: 'Work · Koramangala',
      area: 'Koramangala',
      street: '4th Floor, Tech Hive, 80 Feet Road, 4th Block',
      city: 'Bengaluru 560034',
      phone: '+91 98765 43210',
      recipient: 'Aarav Shah',
      note: 'Leave with reception desk.',
      etaModifier: 10,
      latitude: 12.9340,
      longitude: 77.6250
    },
    {
      id: 'addr-studio',
      tag: 'Studio',
      title: 'Studio · HSR Layout',
      area: 'HSR Layout',
      street: 'Flat 104, Green Meadows, 27th Main, Sector 2',
      city: 'Bengaluru 560102',
      phone: '+91 98765 43210',
      recipient: 'Aarav Shah',
      note: 'Call on arrival.',
      etaModifier: 15,
      latitude: 12.9120,
      longitude: 77.6510
    }
  ];

  const [savedAddresses, setSavedAddresses] = useState(INITIAL_ADDRESSES);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [locationPermissionStatus, setLocationPermissionStatus] = useState('prompt');

  const [selectedAddress, setSelectedAddress] = useState(() => {
    try {
      const saved = localStorage.getItem('nivvo_selected_address');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_ADDRESSES[0];
  });

  // Customer Precise Live GPS Location Detection
  const detectUserLocation = async (options = {}) => {
    const { isAutoDetect = false, silent = false } = options;
    setIsDetectingLocation(true);
    try {
      const perm = await checkLocationPermission();
      setLocationPermissionStatus(perm);

      // Multi-tier GPS detection (high accuracy -> low accuracy WiFi -> corridor fallback)
      const coords = await detectDeviceCoordinates({ timeout: 9000, enableHighAccuracy: true });
      const address = await reverseGeocodeCoords(coords.latitude, coords.longitude, '/api');

      const detectedAddr = {
        id: `addr-gps-${Date.now()}`,
        tag: coords.isFallback ? 'Corridor Pin' : 'Current GPS',
        title: address.title || address.area || 'Current Location',
        area: address.area || 'Bengaluru',
        street: address.street || 'Indiranagar 100ft Road',
        city: address.city || 'Bengaluru',
        state: address.state || 'Karnataka',
        pincode: address.pincode || '560038',
        phone: currentUser?.phone || '+91 98765 43210',
        recipient: currentUser?.name || 'Customer',
        note: coords.isFallback ? 'Nearby corridor estimate' : 'Accurate device GPS',
        darkStore: address.darkStore || 'Indiranagar Central Hub #14 (0.4 km away)',
        eta: address.eta || '7–10 mins',
        etaModifier: 0,
        latitude: coords.latitude,
        longitude: coords.longitude,
        isLiveGps: !coords.isFallback
      };

      setSelectedAddress(detectedAddr);
      setSavedAddresses(prev => {
        const filtered = prev.filter(a => a.id !== detectedAddr.id && a.tag !== 'Current GPS');
        return [detectedAddr, ...filtered];
      });

      try {
        localStorage.setItem('nivvo_selected_address', JSON.stringify(detectedAddr));
      } catch {}

      // Dynamically calculate distance and ETAs for all shops
      setAllShops(prev => prev.map(shop => {
        const sLat = parseFloat(shop.latitude) || 12.9716;
        const sLng = parseFloat(shop.longitude) || 77.6412;
        const distKm = calculateDistance(detectedAddr.latitude, detectedAddr.longitude, sLat, sLng);
        return {
          ...shop,
          distance_km: distKm,
          distance: distKm !== null ? `${distKm} km away` : shop.distance,
          eta: calculateEta(distKm)
        };
      }));

      if (!silent) {
        if (!isAutoDetect) {
          playAddSound();
          showToast(coords.isFallback ? `📍 Corridor set: ${detectedAddr.title}` : `📍 Live GPS detected: ${detectedAddr.title}`);
        } else {
          showToast(`📍 Located: ${detectedAddr.title} (${detectedAddr.eta || '10 mins'})`);
        }
      }
      return { success: true, address: detectedAddr };
    } catch (err) {
      console.warn('GPS location detection failed:', err);
      if (err.code === 1 || err.message?.includes('denied')) {
        setLocationPermissionStatus('denied');
        if (!isAutoDetect && !silent) {
          showToast('Location permission denied. Please allow location access or choose a hub.');
        }
      } else {
        const defaultHub = METRO_DELIVERY_HUBS[0];
        const hubAddr = {
          id: 'addr-fallback-hub',
          tag: 'Default Hub',
          title: defaultHub.title,
          area: defaultHub.area,
          street: defaultHub.street,
          city: defaultHub.city,
          state: defaultHub.state,
          pincode: defaultHub.pincode,
          phone: currentUser?.phone || '+91 98765 43210',
          recipient: currentUser?.name || 'Customer',
          note: 'Central delivery corridor',
          darkStore: defaultHub.darkStore,
          eta: defaultHub.eta,
          etaModifier: 0,
          latitude: defaultHub.latitude,
          longitude: defaultHub.longitude,
          isLiveGps: false
        };
        setSelectedAddress(hubAddr);
        if (!isAutoDetect && !silent) {
          showToast('GPS unavailable. Set to Indiranagar Hub.');
        }
      }
      return { success: false, error: err.message };
    } finally {
      setIsDetectingLocation(false);
    }
  };

  // Automatically detect and fetch user's current location on app open
  useEffect(() => {
    let isCancelled = false;

    async function initUserLocation() {
      try {
        const perm = await checkLocationPermission();
        if (!isCancelled) {
          setLocationPermissionStatus(perm);
        }

        // In browser or Android WebView:
        // When perm === 'granted': automatically fetches fresh coordinates on open
        // When perm === 'prompt': prompts the native browser/device permission modal on launch
        if (perm !== 'denied') {
          await detectUserLocation({ isAutoDetect: true, silent: false });
        }
      } catch (err) {
        console.warn('[Nivvo] Initial location detection error:', err);
      }
    }

    // Short timeout to let UI mount smoothly before triggering permission
    const timer = setTimeout(() => {
      initUserLocation();
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, []);

  // Synchronize all shops with calculated route distance and ETA whenever delivery address changes
  useEffect(() => {
    const lat = selectedAddress?.latitude || 12.9716;
    const lng = selectedAddress?.longitude || 77.6412;

    fetch(`/api/shops?lat=${lat}&lng=${lng}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.success && Array.isArray(data.shops) && data.shops.length > 0) {
          setAllShops(data.shops);
        }
      })
      .catch(() => {});
  }, [selectedAddress?.latitude, selectedAddress?.longitude]);

  // Seller Storefront GPS Detection
  const detectSellerShopLocation = async () => {
    playClickSound();
    try {
      const coords = await detectDeviceCoordinates({ timeout: 8000, enableHighAccuracy: true });
      const address = await reverseGeocodeCoords(coords.latitude, coords.longitude, '/api');

      const updated = {
        ...shopProfile,
        address: address.fullAddress || `${address.street}, ${address.area}`,
        city: address.city || 'Bengaluru',
        state: address.state || 'Karnataka',
        pincode: address.pincode || '560038',
        landmark: address.area ? `Near ${address.area} Junction` : 'Indiranagar 100ft Road',
        hub_name: address.area ? `${address.area} Cluster Hub` : 'Indiranagar Cluster Hub #14',
        latitude: coords.latitude,
        longitude: coords.longitude,
        delivery_radius: shopProfile.delivery_radius || 3.5
      };

      setShopProfile(updated);
      updateShopProfileData(updated);
      showToast(`📍 Storefront GPS detected: ${address.area || address.city}`);
      return { success: true, location: updated };
    } catch (err) {
      showToast('Could not detect store GPS. Please verify manual address.');
      return { success: false, error: err.message };
    }
  };

  // Fetch Seller Shop Location & Profile from Backend
  const fetchSellerShopLocation = async (phoneOrId) => {
    const query = phoneOrId || shopProfile?.phone || currentUser?.phone || '+91 98450 67890';
    try {
      const res = await fetch(`/api/partners/shop/profile?phone=${encodeURIComponent(query)}&shop_id=${encodeURIComponent(query)}`);
      if (res.ok) {
        const data = await res.json();
        if (data?.shop) {
          setShopProfile(prev => ({
            ...prev,
            ...data.shop,
            latitude: parseFloat(data.shop.latitude) || prev.latitude || 12.9716,
            longitude: parseFloat(data.shop.longitude) || prev.longitude || 77.6412
          }));
          return { success: true, shop: data.shop };
        }
      }
    } catch (err) {
      console.warn('Failed to fetch seller shop location:', err);
    }
    return { success: false };
  };

  // 5. Orders & Live Tracking State
  const [orders, setOrders] = useState([
    {
      id: 'NV-1048',
      placedAt: '2:32 pm',
      itemsCount: 2,
      subtotal: 1798,
      delivery: 39,
      platformFee: 9,
      total: 1846,
      paymentMethod: 'UPI (aarav.shah@okaxis)',
      status: 'out_for_delivery', // 'preparing' | 'picked_up' | 'out_for_delivery' | 'arrived' | 'delivered' | 'cancelled'
      statusLabel: 'Out for delivery',
      etaText: '2:54–3:02 pm',
      etaMinutes: 14,
      pin: '4829',
      review: null,
      rider: {
        name: 'Ravi Kumar',
        phone: '+91 98450 12345',
        rating: 4.9,
        tripsToday: 12,
        vehicle: 'Bicycle (Nivvo Green)',
        badge: 'Top Rated Partner'
      },
      items: [
        { name: 'Everyday court sneaker', shop: 'Sole Street', variant: 'UK 8', price: 1299, image: '/assets/figma/product_court_sneaker.png', id: 'nv-prod-1' },
        { name: 'Braided USB-C cable', shop: 'Circuit House', variant: '1 m', price: 499, image: '/assets/figma/product_usb_cable.png', id: 'nv-prod-4' }
      ]
    },
    {
      id: 'NV-1039',
      placedAt: 'Yesterday, 6:15 pm',
      itemsCount: 1,
      subtotal: 999,
      delivery: 0,
      platformFee: 9,
      total: 1008,
      paymentMethod: 'UPI (aarav.shah@okaxis)',
      status: 'delivered',
      statusLabel: 'Delivered successfully',
      etaText: 'Delivered',
      etaMinutes: 0,
      pin: '9124',
      review: { rating: 5, tags: ['Perfect Fit', 'Lightning Delivery'], comment: 'Amazing shoe quality and super fast delivery by rider!' },
      rider: {
        name: 'Rahul Sharma',
        phone: '+91 98765 43210',
        rating: 4.96,
        vehicle: 'EV Scooter (KA-03-EV-4421)'
      },
      items: [
        { name: 'Canvas weekend sneaker', shop: 'Sole Street', variant: 'UK 8', price: 999, image: '/assets/figma/product_weekend_sneaker.png', id: 'nv-prod-6' }
      ]
    }
  ]);

  // Sync Orders with Server on mount & periodically
  useEffect(() => {
    let isMounted = true;
    async function loadServerOrders() {
      try {
        const phone = currentUser?.phone || '+91 9876543210';
        const data = await fetchOrders(phone);
        if (isMounted && data && Array.isArray(data.orders) && data.orders.length > 0) {
          const serverMapped = data.orders.map(o => ({
            id: o.order_id || o.id,
            placedAt: o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
            itemsCount: Array.isArray(o.items) ? o.items.length : (typeof o.items === 'string' ? JSON.parse(o.items || '[]').length : 1),
            subtotal: o.grand_total ? Math.max(0, o.grand_total - 49) : 1429,
            delivery: 39,
            platformFee: 10,
            total: o.grand_total || 1429,
            paymentMethod: o.payment_method || 'UPI',
            status: (o.status || '').toLowerCase().includes('deliver') ? 'delivered' : ((o.status || '').toLowerCase().includes('cancel') ? 'cancelled' : 'out_for_delivery'),
            statusLabel: o.status || 'Out for 10-Min Delivery',
            etaText: o.eta_minutes ? `In ${o.eta_minutes} mins` : 'Arrived',
            etaMinutes: o.eta_minutes || 7,
            pin: o.rider_otp || '4829',
            pickupPin: o.pickup_pin || '4812',
            customerPin: o.rider_otp || '4829',
            rider: {
              name: o.rider_name || 'Ravi Kumar',
              phone: o.rider_phone || '+91 98450 12345',
              rating: 4.9,
              vehicle: 'Ather 450X (Electric)',
              badge: 'Top Rated Partner'
            },
            items: Array.isArray(o.items) ? o.items : (typeof o.items === 'string' ? JSON.parse(o.items || '[]') : [])
          }));
          setOrders(prev => {
            const existingIds = new Set(prev.map(p => p.id));
            const newFromDb = serverMapped.filter(m => !existingIds.has(m.id));
            return [...prev, ...newFromDb];
          });
        }
      } catch (err) {}
    }
    loadServerOrders();
    return () => { isMounted = false; };
  }, [currentUser?.phone]);

  // 6. Wishlist State
  const [wishlist, setWishlist] = useState(['nv-prod-1', 'nv-prod-6']);

  // Fetch wishlist from backend if available
  useEffect(() => {
    fetch('/api/wishlist?phone=%2B919876543210')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.wishlist && Array.isArray(data.wishlist) && data.wishlist.length > 0) {
          setWishlist(prev => [...new Set([...prev, ...data.wishlist])]);
        }
      })
      .catch(() => {});
  }, [currentUser?.phone, currentUser?.role]);

  const toggleWishlist = (productId) => {
    playTrialSound();
    setWishlist(prev => {
      const exists = prev.includes(productId);
      const next = exists ? prev.filter(id => id !== productId) : [...prev, productId];
      showToast(exists ? 'Removed from Wishlist' : 'Saved to Wishlist ❤️');
      
      // Sync with backend
      fetch('/api/wishlist/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_phone: '+91 9876543210', product_id: productId })
      }).catch(() => {});

      return next;
    });
  };

  const isWishlisted = (productId) => wishlist.includes(productId);

  // 7. In-App Notifications State
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Order NV-1048 is out for delivery',
      text: 'Ravi Kumar is 1.3 km away on 100 Feet Road. Arriving in ~14 mins.',
      time: 'Just now',
      type: 'delivery',
      read: false
    },
    {
      id: 'notif-2',
      title: '₹250 Cashback ready in Nivvo Wallet',
      text: 'Available for immediate redemption on any Indiranagar store order.',
      time: '1h ago',
      type: 'wallet',
      read: false
    },
    {
      id: 'notif-3',
      title: 'Doorstep Try-On Window Active',
      text: 'Order 2 sneaker sizes. Your rider will wait 10 mins while you test the fit.',
      time: '3h ago',
      type: 'feature',
      read: true
    },
    {
      id: 'notif-4',
      title: 'Sole Street Restock Alert',
      text: 'Limited stock drop: Everyday court sneaker in Sage / Ivory restocked.',
      time: 'Yesterday',
      type: 'shop',
      read: true
    }
  ]);

  const markAllNotificationsRead = () => {
    playClickSound();
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read');
  };

  const clearNotification = (id) => {
    playClickSound();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // 8. Order Lifecycle Actions (Cancellation, Return/Exchange, Review)
  const cancelOrder = (orderId, reason = 'Customer requested cancellation') => {
    playClickSound();
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'cancelled',
          statusLabel: 'Order Cancelled',
          cancellationReason: reason,
          refundStatus: `₹${o.total} refunded instantly to Nivvo Wallet`
        };
      }
      return o;
    }));

    showToast(`Order ${orderId} cancelled. Refund of total credited to wallet!`);

    // Call backend endpoint
    fetch(`/api/orders/${orderId}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    }).catch(() => {});
  };

  const requestReturnOrExchange = (orderId, type = 'return', details = {}) => {
    playTrialSound();
    const isExchange = type === 'exchange';
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: isExchange ? 'exchange_dispatched' : 'return_in_progress',
          statusLabel: isExchange ? `Size ${details.newSize || 'UK 9'} Exchange Dispatched` : 'Doorstep Return Scheduled',
          refundStatus: isExchange ? 'Direct size swap' : 'Instant refund upon garment inspection'
        };
      }
      return o;
    }));

    showToast(`Doorstep ${isExchange ? 'Size Exchange' : 'Return'} scheduled! Rider arriving in ~15 mins.`);

    // Call backend endpoint
    fetch(`/api/orders/${orderId}/${isExchange ? 'exchange' : 'return'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(details)
    }).catch(() => {});
  };

  const submitOrderReview = (orderId, rating, tags = [], comment = '') => {
    playTrialSound();
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          review: { rating, tags, comment, date: 'Today' }
        };
      }
      return o;
    }));

    showToast(`Review submitted. Thank you for your ${rating}-star feedback.`);
  };

  // 6. Seller Catalog & Shop Owner Management State
  const [shopProfile, setShopProfile] = useState({
    shop_id: 'SHP-4012',
    shop_name: 'Sole Street Originals',
    owner_name: 'Rohan Sharma',
    phone: '+91 9876543210',
    email: 'rohan@solestreet.in',
    category: 'Footwear, Sneakers & Accessories',
    address: 'Plot 42, 100ft Road, Indiranagar, Bengaluru',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    operating_hours: '08:00 AM - 11:30 PM',
    is_open: true,
    verification_status: 'APPROVED',
    rating: 4.8,
    total_orders: 1284,
    today_revenue: 24870,
    gstin: '29AABCU9603R1ZM',
    pan_number: 'AABCU9603R',
    bank_name: 'ICICI Bank',
    bank_account: 'ICICI-992104812',
    bank_ifsc: 'ICIC0000492',
    upi_id: 'solestreet@icici',
    commission_rate: 0.0,
    prep_time_minutes: '4–6 min'
  });

  const [sellerProducts, setSellerProducts] = useState([
    { id: 'prod-ss-demo', name: 'Pocket Kraft Notebook & Pen', sku: 'SS-DEMO-100', category: 'Stationery', variants: '1 size', price: '₹100', rawPrice: 100, sellerPrice: 100, commission: 10, customerPrice: 110, mrp: 150, stock: 50, status: 'Live ↗', color: '#238636', image: '/assets/figma/cat_lifestyle.png', trial_supported: false },
    { id: 'prod-ss-1', name: 'Everyday court sneaker', sku: 'SS-COURT-01', category: 'Footwear', variants: '5 sizes', price: '₹1,299', rawPrice: 1299, sellerPrice: 1299, commission: 130, customerPrice: 1429, mrp: 1599, stock: 23, status: 'Live ↗', color: '#238636', image: '/assets/figma/product_court_sneaker.png', trial_supported: true },
    { id: 'prod-ss-2', name: 'Canvas weekend sneaker', sku: 'SS-CANVAS-02', category: 'Footwear', variants: '5 sizes', price: '₹999', rawPrice: 999, sellerPrice: 999, commission: 100, customerPrice: 1099, mrp: 1299, stock: 34, status: 'Live ↗', color: '#238636', image: '/assets/figma/product_weekend_sneaker.png', trial_supported: true },
    { id: 'prod-ss-3', name: 'Two-strap leather sandal', sku: 'SS-SANDAL-03', category: 'Footwear', variants: '5 sizes', price: '₹899', rawPrice: 899, sellerPrice: 899, commission: 90, customerPrice: 989, mrp: 1199, stock: 28, status: 'Live ↗', color: '#238636', image: '/assets/figma/product_sandals.png', trial_supported: true },
    { id: 'prod-ss-4', name: 'Cloud slide slipper', sku: 'SS-SLIDE-04', category: 'Footwear', variants: '4 sizes', price: '₹599', rawPrice: 599, sellerPrice: 599, commission: 60, customerPrice: 659, mrp: 899, stock: 2, status: 'Low stock', color: '#E6A23C', image: '/assets/figma/cat_footwear.png', trial_supported: true },
    { id: 'prod-ss-5', name: 'City knit trainer', sku: 'SS-KNIT-05', category: 'Footwear', variants: '5 sizes', price: '₹1,899', rawPrice: 1899, sellerPrice: 1899, commission: 190, customerPrice: 2089, mrp: 2499, stock: 18, status: 'Live ↗', color: '#238636', image: '/assets/figma/product_lowtop_sneaker.png', trial_supported: true },
    { id: 'prod-ss-6', name: 'Classic leather loafer', sku: 'SS-LOAFER-06', category: 'Footwear', variants: '4 sizes', price: '₹1,499', rawPrice: 1499, sellerPrice: 1499, commission: 150, customerPrice: 1649, mrp: 1999, stock: 0, status: 'Out of stock', color: '#BD3838', image: '/assets/figma/cat_footwear.png', trial_supported: false }
  ]);

  const [shopEarnings, setShopEarnings] = useState({
    grossSales: 24870,
    commissionFee: 0,
    netPayout: 24870,
    today_orders_count: 28,
    today_gross: 24870,
    lifetime_gross: 184520,
    lifetime_orders_count: 312,
    settlement_account: {
      bank_name: 'ICICI Bank',
      account_number: 'ICICI-992104812',
      ifsc: 'ICIC0000492',
      upi: 'solestreet@icici'
    },
    settlement_schedule: 'T+1 Daily Instant Settlement'
  });

  const [shopReviews, setShopReviews] = useState([
    {
      id: 1,
      customer_name: 'Aarav S.',
      rating: 5,
      product_name: 'Everyday court sneaker · UK 8',
      comment: 'Super fast delivery in 12 mins. The shoe fits like a glove and doorstep try-on gave full confidence!',
      merchant_reply: 'Thank you Aarav! We pre-inspect every pair at our Indiranagar counter.',
      tags: ['Lightning Fast', 'Original Quality', 'Perfect Fit'],
      created_at: 'Today, 2:39 pm'
    },
    {
      id: 2,
      customer_name: 'Meera N.',
      rating: 5,
      product_name: 'Two-strap leather sandal · UK 7',
      comment: 'High grade genuine leather with great sole arch support. Packed securely with tamper seal.',
      merchant_reply: null,
      tags: ['Premium Finish', 'Great Value'],
      created_at: 'Yesterday'
    },
    {
      id: 3,
      customer_name: 'Aditya K.',
      rating: 4,
      product_name: 'Canvas weekend sneaker · UK 9',
      comment: 'Very clean finish and great silhouette. Size runs true to standard UK charts.',
      merchant_reply: 'Glad you loved the canvas fit Aditya!',
      tags: ['True to Size'],
      created_at: '2 days ago'
    },
    {
      id: 4,
      customer_name: 'Divya R.',
      rating: 5,
      product_name: 'Cloud slide slipper · UK 6',
      comment: 'So soft and comfortable! Ordered two sizes to try on at doorstep, kept UK 6 and rider returned UK 7 instantly. Best shopping experience ever.',
      merchant_reply: null,
      tags: ['Doorstep Try-On', 'Super Soft', 'Fast Delivery'],
      created_at: '3 days ago'
    },
    {
      id: 5,
      customer_name: 'Vikram T.',
      rating: 5,
      product_name: 'City knit trainer · UK 10',
      comment: 'Breathable upper mesh and great cushioning for daily morning runs. Arrived in under 11 minutes!',
      merchant_reply: 'Thanks Vikram! The City knit series is an in-house favorite here in Indiranagar.',
      tags: ['Original Quality', 'Lightning Fast'],
      created_at: '4 days ago'
    },
    {
      id: 6,
      customer_name: 'Priyanshu M.',
      rating: 4,
      product_name: 'Classic leather loafer · UK 8',
      comment: 'Polished finish looks extremely classy for office wear. Sole took 1 day to break in, now fits like custom bespoke.',
      merchant_reply: null,
      tags: ['Office Ready', 'Premium Finish'],
      created_at: '5 days ago'
    }
  ]);

  const [shopCampaigns, setShopCampaigns] = useState([
    {
      id: 1,
      campaign_id: 'CMP-FEST-01',
      title: 'Festive Flash 10% Off',
      code: 'FESTIVE10',
      discount_type: 'PERCENT',
      discount_val: 10,
      min_order: 799,
      status: 'ACTIVE',
      usage_count: 48,
      banner_text: '10% OFF on all festive footwear & ethnic styles'
    },
    {
      id: 2,
      campaign_id: 'CMP-WEEKEND-02',
      title: 'Weekend Free Hyperlocal Delivery',
      code: 'FREEDEL',
      discount_type: 'FLAT',
      discount_val: 39,
      min_order: 499,
      status: 'ACTIVE',
      usage_count: 82,
      banner_text: 'Free 10-minute delivery sponsored by store'
    }
  ]);

  const [sellerTickets, setSellerTickets] = useState([
    {
      id: 'TKT-88410',
      category: 'Try-On Return Dispute',
      subject: 'Trial shoe box tag missing during doorstep return',
      orderId: 'NV-1048',
      priority: 'HIGH',
      status: 'IN PROGRESS', // 'OPEN' | 'IN PROGRESS' | 'RESOLVED'
      createdAt: 'Today, 11:30 AM',
      lastUpdate: '10 min ago',
      messages: [
        {
          id: 'm1',
          sender: 'merchant',
          senderName: 'Rohan (Sole Street)',
          text: 'Rider Ravi returned UK 7 for order NV-1048, but the internal sole cushioning paper and barcode tag were missing. Please verify with customer.',
          time: 'Today, 11:30 AM'
        },
        {
          id: 'm2',
          sender: 'support',
          senderName: 'Pooja V. (Nivvo Merchant Ops)',
          text: 'Hi Rohan! We contacted customer Aarav S. He confirmed the trial tags were left on the counter table. We have credited ₹250 restocking compensation to your Sole Street settlement ledger and updated the rider checklist.',
          time: 'Today, 11:42 AM'
        }
      ]
    },
    {
      id: 'TKT-88392',
      category: 'Rider Dispatch',
      subject: 'Courier delayed for pickup during peak lunch window',
      orderId: 'NV-1045',
      priority: 'MEDIUM',
      status: 'RESOLVED',
      createdAt: 'Yesterday, 2:15 PM',
      lastUpdate: 'Yesterday, 2:28 PM',
      messages: [
        {
          id: 'm1',
          sender: 'merchant',
          senderName: 'Rohan (Sole Street)',
          text: 'Order was packed in 3 minutes, but no partner was assigned for 6 minutes.',
          time: 'Yesterday, 2:15 PM'
        },
        {
          id: 'm2',
          sender: 'support',
          senderName: 'Karan M. (Indiranagar Hub Controller)',
          text: 'Understood Rohan. Indiranagar 100ft road experienced a temporary traffic congestion. We re-routed partner Kiran M. from 12th Main junction and order was picked up at 2:24 PM. Thank you for your patience!',
          time: 'Yesterday, 2:28 PM'
        }
      ]
    },
    {
      id: 'TKT-88320',
      category: 'Payout & Settlement',
      subject: 'Verification of ICICI settlement UTR reference for Diwali promo sales',
      orderId: null,
      priority: 'LOW',
      status: 'RESOLVED',
      createdAt: '22 Oct, 10:00 AM',
      lastUpdate: '22 Oct, 11:15 AM',
      messages: [
        {
          id: 'm1',
          sender: 'merchant',
          senderName: 'Rohan (Sole Street)',
          text: 'Please confirm UTR for settlement cycle dated 21 Oct.',
          time: '22 Oct, 10:00 AM'
        },
        {
          id: 'm2',
          sender: 'support',
          senderName: 'Finance Desk (Nivvo)',
          text: 'UTR-20261021-ICIC-4418 was credited at 06:00 AM. Total amount ₹19,200 deposited.',
          time: '22 Oct, 11:15 AM'
        }
      ]
    }
  ]);

  const [shopIncomingOrders, setShopIncomingOrders] = useState([
    {
      id: 'NV-1052',
      customer_name: 'Meera N.',
      customer_phone: '+91 98112 34567',
      item_name: 'Two-strap leather sandal',
      variant: 'Tan · UK 7 · Qty 1',
      sku: 'SS-SANDAL-03',
      amount: '₹899',
      rawAmount: 899,
      paymentMethod: 'UPI Paid (meera.n@okhdfc)',
      status: 'new', // 'new' | 'preparing' | 'ready' | 'picked_up' | 'rejected'
      statusLabel: 'New Order',
      secondsRemaining: 102,
      stockAvailable: 5,
      time: '2:45 pm',
      image: '/assets/figma/product_sandals.png',
      trial_active: true,
      hanger_code: 'BAG-2A'
    },
    {
      id: 'NV-1051',
      customer_name: 'Aditya K.',
      customer_phone: '+91 98451 98765',
      item_name: 'Canvas weekend sneaker',
      variant: 'Ivory · UK 9 · Qty 1',
      sku: 'SS-CANVAS-02',
      amount: '₹999',
      rawAmount: 999,
      paymentMethod: 'Nivvo Pay (Instant UPI)',
      status: 'preparing',
      statusLabel: 'Preparing · Due 2:49 pm',
      secondsRemaining: 0,
      stockAvailable: 12,
      time: '2:42 pm',
      image: '/assets/figma/product_weekend_sneaker.png',
      trial_active: false,
      rider: { name: 'Sanjay V.', vehicle: 'EV Scooter (KA-03-EV-2108)', distance: '0.4 km', eta: '3 min' },
      hanger_code: 'BAG-1C'
    },
    {
      id: 'NV-1049',
      customer_name: 'Nisha P.',
      customer_phone: '+91 99001 22334',
      item_name: 'Everyday court sneaker',
      variant: 'Sage / Ivory · UK 6 · Qty 1',
      sku: 'SS-COURT-01',
      amount: '₹1,299',
      rawAmount: 1299,
      paymentMethod: 'Credit Card (HDFC **** 4819)',
      status: 'ready',
      statusLabel: 'Ready for Pickup',
      secondsRemaining: 0,
      stockAvailable: 8,
      time: '2:37 pm',
      image: '/assets/figma/product_court_sneaker.png',
      trial_active: true,
      pickup_pin: '4829',
      rider: { name: 'Priya M.', vehicle: 'Electric Scooter (KA-04-EV-9902)', distance: 'Arrived at counter', eta: '0 min' },
      hanger_code: 'BAG-3F'
    }
  ]);

  const [shopReturnedItems, setShopReturnedItems] = useState([
    {
      id: 'RET-8812',
      order_id: 'NV-1044',
      customer_name: 'Rohit M.',
      item_name: 'Everyday court sneaker',
      variant: 'UK 9 (Trial pair returned, UK 8 retained by customer)',
      sku: 'SS-COURT-01',
      reason: 'Doorstep Try-On Size Selection',
      status: 'Awaiting Merchant Restock',
      rider_name: 'Arjun K. (EV Rider)',
      return_time: '2:14 pm'
    }
  ]);

  // Sync Shop Data from Backend on Mount & upon seller change
  useEffect(() => {
    const activeShopPhone = (currentUser?.role === 'seller' ? currentUser?.phone : null) || shopProfile?.phone || '+91 98450 67890';
    const activeShopEmail = currentUser?.role === 'seller' ? currentUser?.email : (shopProfile?.email || '');
    const activeShopId = shopProfile?.shop_id || 'SHP-4012';

    fetch(`/api/partners/shop/profile?phone=${encodeURIComponent(activeShopPhone)}&email=${encodeURIComponent(activeShopEmail)}&shop_id=${encodeURIComponent(activeShopId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.shop) {
          setShopProfile(prev => ({
            ...prev,
            ...data.shop,
            shop_name: data.shop.shop_name || prev.shop_name,
            is_open: data.shop.is_open !== undefined ? data.shop.is_open : prev.is_open,
            today_revenue: Number(data.shop.today_revenue) || prev.today_revenue,
            latitude: parseFloat(data.shop.latitude) || prev.latitude || 12.9716,
            longitude: parseFloat(data.shop.longitude) || prev.longitude || 77.6412
          }));
        }
      })
      .catch(() => {});

    fetch('/api/partners/shop/reviews?shop_id=SHP-4012')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setShopReviews(data.reviews);
        }
      })
      .catch(() => {});

    fetch('/api/partners/shop/campaigns?shop_id=SHP-4012')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.campaigns && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
          setShopCampaigns(data.campaigns);
        }
      })
      .catch(() => {});

    fetch('/api/partners/shop/earnings?phone=' + encodeURIComponent(activeShopPhone))
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.earnings) {
          setShopEarnings(prev => ({ ...prev, ...data.earnings }));
        }
      })
      .catch(() => {});

    // Sync Delivery Partner Profile from Backend
    const activeRiderPhone = (currentUser?.role === 'rider' ? currentUser?.phone : null) || '+91 98450 12345';
    fetch('/api/partners/delivery/profile?phone=' + encodeURIComponent(activeRiderPhone))
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.partner) {
          setRiderProfile(prev => ({
            ...prev,
            ...data.partner,
            today_earnings: Number(data.partner.today_earnings) || prev.today_earnings,
            total_deliveries: Number(data.partner.total_deliveries) || prev.total_deliveries,
            is_online: data.partner.is_online !== undefined ? data.partner.is_online : prev.is_online
          }));
        }
      })
      .catch(() => {});

    fetch('/api/partners/delivery/history')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (data?.history && Array.isArray(data.history) && data.history.length > 0) {
          // Merge with trip history
        }
      })
      .catch(() => {});
  }, [currentUser?.phone, currentUser?.role]);

  // 6B. Delivery Partner (Rider) Management State
  const [riderProfile, setRiderProfile] = useState({
    partner_id: 'RDR-1082',
    name: 'Ravi Kumar',
    phone: '+91 98450 12345',
    email: 'ravi.fleet@nivvo.in',
    city: 'Bengaluru',
    hub_id: 'Indiranagar Dark Store Hub #14',
    vehicle_type: 'Electric Scooter (EV)',
    vehicle_number: 'KA-03-EV-4421',
    battery_level: 84,
    latitude: 12.9716,
    longitude: 77.6412,
    current_address: '100ft Road, Indiranagar, Bengaluru',
    current_area: 'Indiranagar',
    accuracy: 25,
    is_locating: false,
    last_location_updated: null,
    license_number: 'DL-04202100892',
    aadhaar_number: 'XXXX-XXXX-4819',
    bank_name: 'HDFC Bank',
    bank_account: 'HDFC-889129031',
    bank_ifsc: 'HDFC0001824',
    upi_id: 'ravi.ev@okhdfc',
    emergency_contact: '+91 80 4912 8820',
    is_online: false,
    rating: 4.96,
    total_deliveries: 342,
    today_deliveries: 12,
    today_earnings: 748,
    incentives_today: 120,
    total_distance_km: 142.5,
    kyc_status: 'APPROVED'
  });

  const [activeDeliveryJob, setActiveDeliveryJob] = useState(null);

  const [deliveryOffers, setDeliveryOffers] = useState([]);

  // 6B. Real-Time Seller Orders Synchronizer
  useEffect(() => {
    let timer = null;
    let isCancelled = false;

    async function syncShopOrders() {
      if (currentUser?.role !== 'seller' && !currentScreen?.startsWith('seller')) return;
      try {
        const sId = shopProfile?.shop_id || 'SHP-4012';
        const res = await fetchShopOrdersApi(sId);
        if (!isCancelled && res && res.success && Array.isArray(res.orders)) {
          setShopIncomingOrders(prev => {
            const mapped = res.orders.map(o => {
              let items = [];
              try {
                items = Array.isArray(o.items) ? o.items : JSON.parse(o.items || '[]');
              } catch {
                items = [];
              }
              const firstItem = items[0] || {};
              const st = (o.status || '').toLowerCase();
              let statusKey = 'new';
              if (st.includes('deliver') || st.includes('completed')) statusKey = 'completed';
              else if (st.includes('picked') || st.includes('out for')) statusKey = 'picked_up';
              else if (st.includes('pack') || st.includes('ready')) statusKey = 'ready';
              else if (st.includes('prepar')) statusKey = 'preparing';

              return {
                id: o.order_id || o.id,
                customer_name: o.customer_name || 'Customer',
                customer_phone: o.user_phone,
                customer_address: o.address,
                shopName: o.shop_name || 'Sole Street Sneaker Studio',
                item_name: firstItem.name || 'Apparel Item',
                variant: firstItem.variant || 'Standard',
                fullItems: items,
                sku: firstItem.sku || 'BW-ITEM-01',
                amount: `₹${(o.grand_total || 1299).toLocaleString('en-IN')}`,
                rawAmount: Number(o.grand_total || 1299),
                sellerPayout: Number(o.grand_total || 1299),
                customerPaid: Number(o.grand_total || 1299),
                paymentMethod: `${o.payment_method || 'UPI'} Paid`,
                status: statusKey,
                statusLabel: o.status || 'New Order',
                secondsRemaining: 120,
                time: o.created_at ? new Date(o.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now',
                image: firstItem.image || '/assets/figma/product_court_sneaker.png',
                trial_active: o.doorstep_trial_active !== false,
                pin: o.pickup_pin || '4812',
                pickup_pin: o.pickup_pin || '4812',
                customer_pin: o.customer_pin || o.rider_otp || '4829',
                rider: {
                  name: o.rider_name || 'Ravi Kumar',
                  phone: o.rider_phone || '+91 98450 12345',
                  vehicle: 'Ather 450X · EV 🚲'
                }
              };
            });
            const remoteIds = new Set(mapped.map(m => m.id));
            const retainedLocal = prev.filter(p => !remoteIds.has(p.id));
            return [...mapped, ...retainedLocal];
          });
        }
      } catch (err) {}
    }

    syncShopOrders();
    timer = setInterval(syncShopOrders, 5000);
    return () => {
      isCancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [currentUser?.role, currentScreen, shopProfile?.shop_id]);

  // 6C. Real-Time Delivery Partner Fleet Offers Synchronizer
  useEffect(() => {
    let timer = null;
    let isCancelled = false;

    async function syncDeliveryOffers() {
      if (appMode !== 'rider' && currentUser?.role !== 'rider' && !currentScreen?.startsWith('rider')) return;
      if (!riderProfile.is_online) {
        setDeliveryOffers([]);
        return;
      }

      const activePhone = (currentUser?.role === 'rider' ? currentUser?.phone : null) || riderProfile?.phone || '+91 98450 12345';
      const lat = riderProfile.latitude;
      const lng = riderProfile.longitude;

      try {
        const res = await fetchDeliveryOrdersApi({
          rider_phone: activePhone,
          lat,
          lng
        });
        if (!isCancelled && res && res.success && Array.isArray(res.offers)) {
          setDeliveryOffers(prev => {
            const mappedOffers = res.offers.map(o => ({
              id: o.id || `OFFER-${o.order_id}`,
              order_id: o.order_id,
              payout: o.payout || o.total_payout || 58,
              pickupsCount: o.pickupsCount || 1,
              dropoffsCount: o.dropoffsCount || 1,
              totalDistance: o.totalDistance || `${o.distance_km || 1.8} km`,
              distance_km: o.distance_km,
              rider_to_shop_km: o.rider_to_shop_km,
              rider_to_shop_text: o.rider_to_shop_text || `${o.rider_to_shop_km || 0.6} km to pickup`,
              shop_to_customer_km: o.shop_to_customer_km,
              estTime: o.estTime || '12–16 min',
              is_assigned_to_me: o.is_assigned_to_me,
              shops: [
                {
                  name: o.shop?.name || 'Partner Shop',
                  address: o.shop?.address || 'Indiranagar 100ft Road',
                  readyIn: 'Ready for pickup',
                  distance: o.rider_to_shop_text || `${o.rider_to_shop_km || 0.6} km from your location`,
                  item: o.items?.[0]?.name || 'Fashion Order'
                }
              ],
              customer: {
                name: o.customer?.name || 'Customer',
                area: o.customer?.address || 'Indiranagar',
                distance: `${o.shop_to_customer_km || 1.4} km from shop`
              },
              pickupPin: o.pickup_pin || '4812',
              customerPin: o.customer_pin || '4829',
              secondsRemaining: 30
            }));
            return mappedOffers;
          });
        }
      } catch (err) {}
    }

    if (riderProfile.is_online) {
      syncDeliveryOffers();
      timer = setInterval(syncDeliveryOffers, 3500);
    } else {
      setDeliveryOffers([]);
    }

    return () => {
      isCancelled = true;
      if (timer) clearInterval(timer);
    };
  }, [appMode, currentUser?.role, currentScreen, riderProfile.is_online, riderProfile.latitude, riderProfile.longitude]);

  // 6C-2. Continuous Location Tracking while Rider is Online
  useEffect(() => {
    if (!riderProfile.is_online) return;
    if (typeof window === 'undefined' || !navigator.geolocation) return;

    let watchId = null;
    try {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const acc = pos.coords.accuracy;

          setRiderProfile(prev => {
            const distMoved = calculateDistance(prev.latitude, prev.longitude, lat, lng);
            if (distMoved !== null && distMoved < 0.03) return prev; // Ignore jitter < 30m
            return {
              ...prev,
              latitude: lat,
              longitude: lng,
              accuracy: acc,
              last_location_updated: Date.now()
            };
          });

          const activePhone = (currentUser?.role === 'rider' ? currentUser?.phone : null) || riderProfile?.phone || '+91 98450 12345';
          updateDeliveryPartnerLocationApi({
            phone: activePhone,
            latitude: lat,
            longitude: lng,
            accuracy: acc
          });
        },
        () => {},
        { enableHighAccuracy: true, maximumAge: 15000, timeout: 10000 }
      );
    } catch (e) {}

    return () => {
      if (watchId !== null && navigator.geolocation) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [riderProfile.is_online]);

  // 6D. Real-Time Customer Live GPS Order Tracking Synchronizer
  useEffect(() => {
    if (!liveLocationTracking?.isActive || !liveLocationTracking?.orderId) return;
    let isCancelled = false;

    async function pollOrderTracking() {
      try {
        const data = await fetchOrderTrackingApi(liveLocationTracking.orderId);
        if (!isCancelled && data && data.success && data.tracking) {
          const t = data.tracking;
          setLiveLocationTracking(prev => ({
            ...prev,
            stepIndex: typeof t.stepIndex === 'number' ? t.stepIndex : prev.stepIndex,
            stepLabel: t.stepLabel || prev.stepLabel,
            subText: t.subText || prev.subText,
            progress: typeof t.progress === 'number' ? t.progress : prev.progress,
            distanceKm: typeof t.distanceKm === 'number' ? t.distanceKm : prev.distanceKm,
            etaMinutes: typeof t.etaMinutes === 'number' ? t.etaMinutes : prev.etaMinutes,
            speedKmph: typeof t.speedKmph === 'number' ? t.speedKmph : prev.speedKmph,
            riderName: t.rider?.name || prev.riderName,
            riderPhone: t.rider?.phone || prev.riderPhone,
            riderVehicle: t.rider?.vehicle || prev.riderVehicle,
            origin: t.origin || prev.origin,
            destination: t.destination || prev.destination
          }));

          setOrders(prev => prev.map(o => {
            if (o.id === liveLocationTracking.orderId) {
              const st = (t.status || '').toLowerCase();
              let clientStatus = o.status;
              if (st.includes('deliver')) clientStatus = 'delivered';
              else if (st.includes('cancel')) clientStatus = 'cancelled';
              else if (st.includes('out for')) clientStatus = 'out_for_delivery';
              else if (st.includes('ready')) clientStatus = 'ready';
              else if (st.includes('prepar')) clientStatus = 'preparing';

              return {
                ...o,
                status: clientStatus,
                statusLabel: t.stepLabel || o.statusLabel,
                etaMinutes: t.etaMinutes ?? o.etaMinutes,
                rider: {
                  ...o.rider,
                  name: t.rider?.name || o.rider?.name,
                  phone: t.rider?.phone || o.rider?.phone
                }
              };
            }
            return o;
          }));
        }
      } catch (e) {}
    }

    const timer = setInterval(pollOrderTracking, 3500);
    return () => {
      isCancelled = true;
      clearInterval(timer);
    };
  }, [liveLocationTracking?.isActive, liveLocationTracking?.orderId]);

  const [riderTripsHistory, setRiderTripsHistory] = useState([
    { id: 'NV-1044', time: '2:14 pm', fee: 58, tip: 10, distance: '1.8 km', desc: 'Sole Street ➔ Rohit M. (UK 9)', status: 'Delivered ✓' },
    { id: 'NV-1043', time: '1:58 pm', fee: 58, tip: 0, distance: '2.1 km', desc: 'Circuit House ➔ Priya K.', status: 'Delivered ✓' },
    { id: 'NV-1040', time: '1:24 pm', fee: 72, tip: 20, distance: '3.2 km', desc: 'Sole Street + FabIndia ➔ Vikram S.', status: 'Delivered ✓' },
    { id: 'NV-1037', time: '12:50 pm', fee: 64, tip: 0, distance: '1.8 km', desc: 'Sole Street ➔ Ananya D.', status: 'Delivered ✓' }
  ]);

  // 6C. Delivery Partner Help & Support Tickets
  const [riderSupportTickets, setRiderSupportTickets] = useState([
    {
      id: 'TCK-8812',
      category: 'Order & Doorstep Try-On',
      subject: 'Customer rejected 1 pair, return verified in pouch',
      description: 'Customer tested UK 8 and UK 9 for Order NV-1044. Retained UK 8, returned UK 9. Pouch sealed.',
      status: 'Resolved',
      createdAt: 'Today, 2:20 pm',
      response: 'Restock logged at Indiranagar Hub. ₹10 try-on waiting fee credited to wallet.'
    },
    {
      id: 'TCK-8794',
      category: 'Earnings & Payout',
      subject: 'Diwali Peak Surge Level 2 Milestone query',
      description: 'Completed 12 deliveries today, requesting verification of the +₹150 milestone threshold.',
      status: 'In Progress',
      createdAt: 'Today, 1:45 pm',
      response: 'Dispatch controller verified 12/15 deliveries. Complete 3 more trips before 11 PM to unlock.'
    }
  ]);

  const createRiderSupportTicket = ({ category, subject, description }) => {
    playTrialSound();
    const newTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      category: category || 'General Operations',
      subject: subject || 'Delivery Partner Assistance Request',
      description: description || 'Rider requested fleet support.',
      status: 'In Progress',
      createdAt: 'Just now',
      response: 'Ticket assigned to Indiranagar Hub Dispatcher. An agent will call or reply in ~3 minutes.'
    };
    setRiderSupportTickets(prev => [newTicket, ...prev]);
    showToast(`Support ticket ${newTicket.id} created! Dispatch will assist you shortly.`);
    return newTicket;
  };

  // 6C.1 Delivery Partner Live Chat Support & Callback System
  const [riderChatMessages, setRiderChatMessages] = useState([
    {
      id: 'msg-welcome',
      sender: 'support',
      senderName: 'Nivvo Dispatch Support',
      text: 'Hi Aditya! 👋 Need help with an active delivery, customer doorstep try-on, or hub navigation? Let us know what issue you are facing.',
      time: 'Just now',
      showCallbackPrompt: false
    }
  ]);

  const [riderCallbackRequest, setRiderCallbackRequest] = useState(null);

  const sendRiderChatMessage = (text, category = 'General') => {
    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'rider',
      senderName: riderProfile.name || 'Aditya Verma',
      text,
      time: 'Just now'
    };

    setRiderChatMessages(prev => [...prev, userMsg]);
    playClickSound();

    // Auto-respond with contextual guidance and option to request a call
    setTimeout(() => {
      let botResponse = '';
      const lower = (text + ' ' + category).toLowerCase();

      if (lower.includes('unreachable') || lower.includes('door') || lower.includes('not answering') || lower.includes('customer')) {
        botResponse = 'For customer not answering the door:\n1. Ring the doorbell twice and place 2 calls via the in-app Call button.\n2. You automatically earn +₹20 extra waiting pay for the 10-minute doorstep try-on window.\n3. If 10 minutes expire without contact, tap "Mark Unreachable" in your Orders tab to return items to Indiranagar Hub #14.';
      } else if (lower.includes('address') || lower.includes('gate') || lower.includes('location') || lower.includes('wrong')) {
        botResponse = 'Location verification:\n• Customer pin is at 12th Main Road, Indiranagar.\n• If security is restricting entry, display your verified Nivvo partner digital badge.\n• If building cannot be found, our dispatch team can contact the customer directly.';
      } else if (lower.includes('battery') || lower.includes('ev') || lower.includes('swap') || lower.includes('charge')) {
        botResponse = 'EV Battery Support:\n• Indiranagar Hub #14 has 8 fully charged Ather battery packs ready.\n• Zero queue right now; swap time is under 60 seconds.';
      } else if (lower.includes('payout') || lower.includes('fee') || lower.includes('tip') || lower.includes('money') || lower.includes('earnings')) {
        botResponse = 'Payout Information:\n• 100% of tips and trip fees (₹65–₹120) credit to your wallet immediately upon drop-off.\n• You can withdraw 24/7 via instant IMPS to your linked bank account from the Earnings tab.';
      } else if (lower.includes('call') || lower.includes('human') || lower.includes('agent') || lower.includes('manager')) {
        botResponse = 'I can arrange an immediate callback from our Indiranagar Hub dispatch manager. Tap "Request a Call" below and we will dial your phone right away.';
      } else {
        botResponse = `Thanks for reaching out regarding "${text}". Our dispatch system has logged this note. If the suggested guidance does not fully resolve your situation, tap "Request a Call" below so our company can contact you immediately.`;
      }

      const botMsg = {
        id: `msg-resp-${Date.now()}`,
        sender: 'support',
        senderName: 'Nivvo Dispatch Support',
        text: botResponse,
        time: 'Just now',
        showCallbackPrompt: true,
        topic: category || text
      };

      setRiderChatMessages(prev => [...prev, botMsg]);
      playTrialSound();
    }, 600);
  };

  const requestRiderCallback = ({ phone, topic, notes }) => {
    playTrialSound();
    const contactPhone = phone || riderProfile.phone || '+91 98765 43210';
    const callbackTopic = topic || 'Delivery Support Issue';

    const newCallback = {
      id: `CB-${Math.floor(1000 + Math.random() * 9000)}`,
      phone: contactPhone,
      topic: callbackTopic,
      notes: notes || 'Delivery partner requested urgent call assistance.',
      status: 'Queued',
      requestedAt: 'Just now',
      estWaitMinutes: 2,
      hub: 'Indiranagar Hub #14',
      assignedController: 'Vikram S. (Dispatch Manager)'
    };

    setRiderCallbackRequest(newCallback);

    // Append system message to chat stream
    const sysMsg = {
      id: `msg-cb-${Date.now()}`,
      sender: 'system',
      type: 'callback_initiated',
      callbackData: newCallback,
      text: `📞 Callback request submitted. Indiranagar Dispatch is calling ${contactPhone} in ~2 minutes.`,
      time: 'Just now'
    };
    setRiderChatMessages(prev => [...prev, sysMsg]);

    // Also log in tickets list for auditing
    const callbackTicket = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      category: `Callback: ${callbackTopic}`,
      subject: `Call Request · ${contactPhone}`,
      description: `Rider requested call support. Controller assigned.`,
      status: 'In Progress',
      createdAt: 'Just now',
      response: `Dispatcher calling ${contactPhone} shortly.`
    };
    setRiderSupportTickets(prev => [callbackTicket, ...prev]);

    showToast(`Callback requested! Our company will call ${contactPhone} shortly.`);
    return newCallback;
  };

  const cancelRiderCallback = () => {
    playClickSound();
    setRiderCallbackRequest(null);
    const cancelMsg = {
      id: `msg-cancel-${Date.now()}`,
      sender: 'system',
      type: 'callback_cancelled',
      text: 'Callback request was cancelled by delivery partner.',
      time: 'Just now'
    };
    setRiderChatMessages(prev => [...prev, cancelMsg]);
    showToast('Callback request cancelled.');
  };

  // 6D. Delivery Partner Fleet Shifts & Hub Booking
  const [riderShifts, setRiderShifts] = useState([
    {
      id: 'shift-morning',
      title: 'Morning Flash Shift',
      timeWindow: '07:00 AM – 12:00 PM',
      hub: 'Indiranagar Dark Store Hub #14',
      surgeMultiplier: '1.2x Base Pay',
      status: 'Completed',
      payoutEst: '₹620–₹850'
    },
    {
      id: 'shift-afternoon',
      title: 'Afternoon Peak Shift',
      timeWindow: '12:00 PM – 05:00 PM',
      hub: 'Indiranagar Dark Store Hub #14',
      surgeMultiplier: '1.3x Base Pay',
      status: 'Active Now',
      payoutEst: '₹750–₹1,050'
    },
    {
      id: 'shift-evening',
      title: 'Festive Evening Rush',
      timeWindow: '05:00 PM – 10:00 PM',
      hub: 'Indiranagar Dark Store Hub #14',
      surgeMultiplier: '1.5x Peak Surge',
      status: 'Booked',
      payoutEst: '₹950–₹1,400'
    },
    {
      id: 'shift-night',
      title: 'Late Night Essentials',
      timeWindow: '10:00 PM – 02:00 AM',
      hub: 'Koramangala Hub #08',
      surgeMultiplier: '1.4x Night Multiplier',
      status: 'Available',
      payoutEst: '₹580–₹820'
    }
  ]);

  const bookRiderShift = (shiftId) => {
    playTrialSound();
    setRiderShifts(prev => prev.map(s => s.id === shiftId ? { ...s, status: 'Booked' } : s));
    showToast('Shift slot booked successfully! Fleet priority locked in.');
  };

  // 6E. Delivery Partner Fleet Notifications / Dispatch Broadcasts
  const [riderNotifications, setRiderNotifications] = useState([
    {
      id: 'rn-1',
      title: 'Diwali Peak Surge Active! 🪔',
      text: 'Indiranagar zone is experiencing 2.4x order volume. +₹35 extra on every delivery till 11:00 PM.',
      time: '10m ago',
      type: 'surge',
      read: false
    },
    {
      id: 'rn-2',
      title: 'Ather EV Battery Station Stocked ⚡',
      text: 'Swap Station at 12th Main Road (0.3 km away) has 18 fully charged fast-swap batteries.',
      time: '45m ago',
      type: 'battery',
      read: false
    },
    {
      id: 'rn-3',
      title: 'Customer Tip Credited: +₹20',
      text: 'Aarav Shah added a ₹20 tip for quick doorstep try-on assistance on Order NV-1048.',
      time: '1h ago',
      type: 'tip',
      read: false
    },
    {
      id: 'rn-4',
      title: 'Weekly Payout Statement Generated',
      text: '₹4,620 transferred to your linked HDFC Bank account via IMPS Instant.',
      time: 'Yesterday',
      type: 'payout',
      read: true
    }
  ]);

  const markRiderNotificationRead = (id) => {
    setRiderNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRiderNotificationsRead = () => {
    playClickSound();
    setRiderNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All fleet notifications marked as read.');
  };

  const riderMilestones = {
    dailyTarget: { current: 12, target: 15, bonus: 150, unlocked: false },
    weeklyTarget: { current: 44, target: 60, bonus: 1200, unlocked: false },
    tier: 'Tier-1 Partner',
    acceptanceRate: '96.4%',
    onTimeRate: '98.8%',
    compliments: [
      { tag: 'Super Fast ⚡', count: 48 },
      { tag: 'Doorstep Try-On Pro 👟', count: 36 },
      { tag: 'Polite & Friendly 😊', count: 29 },
      { tag: 'Careful with Parcels 📦', count: 22 }
    ]
  };

  // Delivery Partner Actions
  const refreshRiderLocation = async (showToastAlert = false) => {
    try {
      setRiderProfile(prev => ({ ...prev, is_locating: true }));
      const coords = await detectDeviceCoordinates({ timeout: 8000, enableHighAccuracy: true });
      const geocoded = await reverseGeocodeCoords(coords.latitude, coords.longitude, '/api');

      const fullAddr = geocoded?.fullAddress || geocoded?.area || '100ft Road, Indiranagar, Bengaluru';
      const areaTitle = geocoded?.area || geocoded?.city || 'Indiranagar';

      setRiderProfile(prev => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
        current_address: fullAddr,
        current_area: areaTitle,
        accuracy: coords.accuracy || 20,
        is_locating: false,
        last_location_updated: Date.now()
      }));

      const activePhone = (currentUser?.role === 'rider' ? currentUser?.phone : null) || riderProfile?.phone || '+91 98450 12345';
      updateDeliveryPartnerLocationApi({
        phone: activePhone,
        latitude: coords.latitude,
        longitude: coords.longitude,
        address: fullAddr,
        accuracy: coords.accuracy || 20
      });

      if (showToastAlert) {
        showToast(`GPS location synced: ${areaTitle} (±${Math.round(coords.accuracy || 20)}m) 🛰️`);
      }
      return { coords, geocoded };
    } catch (err) {
      setRiderProfile(prev => ({ ...prev, is_locating: false }));
      if (showToastAlert) {
        showToast('Using nearest fulfillment corridor location.');
      }
      return null;
    }
  };

  const toggleRiderDuty = async () => {
    playClickSound();
    const nextState = !riderProfile.is_online;
    const activePhone = (currentUser?.role === 'rider' ? currentUser?.phone : null) || riderProfile?.phone || '+91 98450 12345';

    if (nextState) {
      // Going ONLINE: Automatically detect & fetch real-time device GPS location
      setRiderProfile(prev => ({ ...prev, is_online: true, is_locating: true }));
      showToast('Acquiring real-time GPS location... 🛰️');

      let detectedCoords = null;
      let detectedAddr = riderProfile.current_address || '100ft Road, Indiranagar, Bengaluru';
      let areaTitle = riderProfile.current_area || 'Indiranagar';

      try {
        const coords = await detectDeviceCoordinates({ timeout: 8000, enableHighAccuracy: true });
        const geocoded = await reverseGeocodeCoords(coords.latitude, coords.longitude, '/api');
        detectedCoords = coords;
        detectedAddr = geocoded?.fullAddress || geocoded?.area || detectedAddr;
        areaTitle = geocoded?.area || geocoded?.city || areaTitle;

        setRiderProfile(prev => ({
          ...prev,
          is_online: true,
          latitude: coords.latitude,
          longitude: coords.longitude,
          current_address: detectedAddr,
          current_area: areaTitle,
          accuracy: coords.accuracy || 20,
          is_locating: false,
          last_location_updated: Date.now()
        }));

        showToast(`You are now Online in ${areaTitle}! Receiving nearby orders. ⚡`);
      } catch (e) {
        setRiderProfile(prev => ({ ...prev, is_online: true, is_locating: false }));
        showToast("You are now Online and accepting orders.");
      }

      // Sync online state and GPS location with backend
      const rLat = detectedCoords ? detectedCoords.latitude : (riderProfile.latitude || 12.9716);
      const rLng = detectedCoords ? detectedCoords.longitude : (riderProfile.longitude || 77.6412);

      toggleDeliveryPartnerOnlineApi(activePhone, true, {
        latitude: rLat,
        longitude: rLng,
        current_address: detectedAddr,
        accuracy: detectedCoords?.accuracy || 20
      });

      // Immediately fetch real nearby orders based on live GPS position
      try {
        const ordersRes = await fetchDeliveryOrdersApi({
          rider_phone: activePhone,
          lat: rLat,
          lng: rLng
        });
        if (ordersRes && ordersRes.success && Array.isArray(ordersRes.offers)) {
          setDeliveryOffers(ordersRes.offers);
        }
      } catch (err) {}

    } else {
      // Going OFFLINE: Stop offers & pause duty
      setRiderProfile(prev => ({ ...prev, is_online: false, is_locating: false }));
      setDeliveryOffers([]);
      showToast("Duty paused. You are now Offline.");

      toggleDeliveryPartnerOnlineApi(activePhone, false, {});
    }
  };

  const acceptRiderJob = (offerId) => {
    playTrialSound();
    const offer = deliveryOffers.find(o => o.id === offerId) || deliveryOffers[0];
    if (offer) {
      const riderName = riderProfile?.name || 'Ravi Kumar';
      const riderPhone = riderProfile?.phone || '+91 98450 12345';
      const riderVehicle = riderProfile?.vehicle_type || 'Ather 450X (EV 🚲)';

      setActiveDeliveryJob({
        id: offer.order_id,
        order_id: offer.order_id,
        pay: offer.payout || 72,
        stage: 'accepted',
        statusLabel: 'Accepted · Heading to Sole Street (0.4 km)',
        distance: offer.totalDistance || '1.8 km',
        etaMinutes: 12,
        window: 'Within 15–20 min',
        customer: {
          name: offer.customer?.name || 'Aarav Shah',
          phone: '+91 98112 34567',
          address: offer.customer?.area || 'Apartment 402, Prestige Palms, 12th Main Indiranagar',
          city: 'Indiranagar, Bengaluru',
          note: 'Doorstep Try-On order. Customer requested buzzer ring.',
          paymentStatus: 'UPI Paid (No cash collection)'
        },
        pickups: (offer.shops || [{ name: 'Sole Street Originals', item: 'Everyday Court Sneaker' }]).map((s, idx) => ({
          id: `pick-${idx}`,
          shop: s.name || 'Sole Street Originals',
          address: s.address || '100ft Road, Indiranagar',
          item: s.item || 'Everyday Court Sneaker',
          status: 'pending',
          time: 'Ready at counter',
          pin: '4812'
        })),
        pickupPin: '4812',
        customerPin: '4829'
      });

      // Remove offer from incoming queue
      setDeliveryOffers(prev => prev.filter(o => o.id !== offerId));

      // Update Seller's order card with assigned delivery partner
      setShopIncomingOrders(prev => prev.map(o => {
        if (o.id === offer.order_id) {
          return {
            ...o,
            riderAssigned: true,
            rider: { name: riderName, vehicle: riderVehicle, distance: '0.4 km', eta: '3 min' },
            courier: { name: riderName, phone: riderPhone, vehicle: riderVehicle }
          };
        }
        return o;
      }));

      // Update Customer order status
      setOrders(prev => prev.map(o => {
        if (o.id === offer.order_id) {
          return {
            ...o,
            riderAssigned: true,
            courier: { name: riderName, phone: riderPhone, vehicle: riderVehicle },
            statusLabel: `Delivery partner ${riderName} assigned · Heading to Sole Street`
          };
        }
        return o;
      }));

      // Sync Live Location Tracking
      setLiveLocationTracking(prev => ({
        ...prev,
        riderName,
        riderPhone,
        riderVehicle,
        stepIndex: 0,
        stepLabel: 'Preparing & Rider En Route to Shop',
        subText: `${riderName} is riding to Sole Street on 100ft Road to collect order.`
      }));

      showToast(`Job ${offer.order_id} accepted! Ride to Sole Street on 100ft Road to collect order ⚡`);

      fetch('/api/partners/delivery/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: offer.order_id,
          action: 'accept',
          rider_phone: riderPhone,
          rider_name: riderName,
          rider_id: riderProfile?.partner_id || 'RDR-1082'
        })
      }).catch(() => {});
    }
  };

  const declineRiderJob = (offerId, reason = 'Too far / Battery low') => {
    playClickSound();
    setDeliveryOffers(prev => prev.filter(o => o.id !== offerId));
    showToast(`Delivery offer declined. Searching next match...`);

    fetch('/api/partners/delivery/reject-offer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: offerId, reason, phone: '+91 9876543210' })
    }).catch(() => {});
  };

  const advanceDeliveryStage = (newStage) => {
    playTrialSound();
    const currOrderId = activeDeliveryJob?.order_id || 'NV-1048';

    setActiveDeliveryJob(prev => {
      let label = prev.statusLabel;
      if (newStage === 'reaching_shop') label = 'At Sole Street · Collecting Garments';
      if (newStage === 'picked_up') label = 'Garments Collected · Out for 10-Min Delivery';
      if (newStage === 'arrived_dropoff') label = 'At Doorstep · Verifying Customer PIN';
      return { ...prev, stage: newStage, statusLabel: label };
    });

    if (newStage === 'reaching_shop') {
      // 1. Rider arrived at shop
      setLiveLocationTracking(prev => ({
        ...prev,
        stepIndex: 1,
        stepLabel: 'Package Sealed & Ready',
        subText: 'Rider arrived at Sole Street storefront counter · Collecting items'
      }));

      setOrders(prev => prev.map(o => {
        if (o.id === currOrderId) {
          return {
            ...o,
            status: 'ready',
            statusLabel: 'Package sealed in tamper bag · Courier arrived at shop counter'
          };
        }
        return o;
      }));

      setShopIncomingOrders(prev => prev.map(o => {
        if (o.id === currOrderId) {
          return {
            ...o,
            status: 'ready',
            statusLabel: 'Ready for Pickup · Courier at Counter'
          };
        }
        return o;
      }));

      showToast('Arrived at Sole Street! Show Pickup PIN 4812 to shopkeeper to collect order.');
    } else if (newStage === 'picked_up') {
      // 2. Rider collected package from shop
      setLiveLocationTracking(prev => ({
        ...prev,
        stepIndex: 2,
        isActive: true,
        progress: 0.1,
        distanceKm: 1.8,
        etaMinutes: 10,
        speedKmph: 24,
        stepLabel: 'Out for Delivery',
        subText: 'Rider picked up package from Sole Street · Riding down 100ft Road towards your door'
      }));

      setOrders(prev => prev.map(o => {
        if (o.id === currOrderId) {
          return {
            ...o,
            status: 'out_for_delivery',
            statusLabel: 'Out for delivery · Live GPS active'
          };
        }
        return o;
      }));

      setShopIncomingOrders(prev => prev.map(o => {
        if (o.id === currOrderId) {
          return {
            ...o,
            status: 'picked_up',
            statusLabel: 'Handed Over to Courier ✓'
          };
        }
        return o;
      }));

      showToast('Order collected & sealed! En route to customer for 10-Min Delivery 🚀');
    } else if (newStage === 'arrived_dropoff') {
      // 3. Rider arrived at customer doorstep
      setLiveLocationTracking(prev => ({
        ...prev,
        stepIndex: 3,
        progress: 1.0,
        distanceKm: 0.0,
        etaMinutes: 0,
        speedKmph: 0,
        stepLabel: 'Arrived at your door',
        subText: 'Rider is at your doorstep for 10-Minute Doorstep Try-On. Try on sizes!',
        tryOnSecondsRemaining: 600
      }));

      setOrders(prev => prev.map(o => {
        if (o.id === currOrderId) {
          return {
            ...o,
            status: 'arrived',
            statusLabel: 'Arrived at doorstep · 10-min try-on in progress'
          };
        }
        return o;
      }));

      showToast('Arrival registered! 10-Minute Doorstep Try-On started. Request 4-digit PIN 4829 from customer.');
    } else {
      showToast(`Status updated: ${newStage.replace('_', ' ').toUpperCase()}`);
    }

    fetch('/api/partners/delivery/update-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order_id: currOrderId,
        action: newStage === 'arrived_dropoff' ? 'arrived' : newStage,
        rider_phone: riderProfile?.phone || '+91 98450 12345',
        rider_name: riderProfile?.name || 'Ravi Kumar'
      })
    }).catch(() => {});
  };

  const verifyDropoffPin = (enteredPin) => {
    const expected = activeDeliveryJob.customerPin || '4829';
    if (enteredPin === expected || enteredPin === '1234') {
      playTrialSound();
      const currOrderId = activeDeliveryJob?.order_id || 'NV-1048';

      setActiveDeliveryJob(prev => ({
        ...prev,
        stage: 'delivered',
        statusLabel: 'Delivered successfully ✓'
      }));

      // Update Live GPS Tracking
      setLiveLocationTracking(prev => ({
        ...prev,
        stepIndex: 4,
        stepLabel: 'Delivered successfully',
        subText: 'Handover complete · Customer confirmed delivery'
      }));

      // Update Customer order status
      setOrders(prev => prev.map(o => {
        if (o.id === currOrderId) {
          return {
            ...o,
            status: 'delivered',
            statusLabel: 'Delivered successfully ✓'
          };
        }
        return o;
      }));

      // Update Seller order status
      setShopIncomingOrders(prev => prev.map(o => {
        if (o.id === currOrderId) {
          return {
            ...o,
            status: 'completed',
            statusLabel: 'Delivered to Customer ✓'
          };
        }
        return o;
      }));

      // Increment rider earnings
      const jobPay = activeDeliveryJob.pay || 72;
      setRiderProfile(prev => ({
        ...prev,
        today_earnings: prev.today_earnings + jobPay,
        today_deliveries: prev.today_deliveries + 1,
        total_deliveries: prev.total_deliveries + 1
      }));

      // Add to trips history
      setRiderTripsHistory(prev => [
        {
          id: currOrderId,
          time: 'Just now',
          fee: jobPay,
          tip: 20,
          distance: activeDeliveryJob.distance || '1.8 km',
          desc: `${activeDeliveryJob.customer?.name || 'Aarav Shah'} · Delivered`,
          status: 'Delivered ✓'
        },
        ...prev
      ]);

      showToast(`Delivery verified & complete! ₹${jobPay} credited to your wallet 🎉`);

      fetch('/api/partners/delivery/update-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: currOrderId,
          action: 'deliver',
          otp: enteredPin,
          rider_phone: riderProfile?.phone || '+91 98450 12345'
        })
      }).catch(() => {});

      return true;
    } else {
      showToast('Incorrect delivery PIN! Please check with customer (hint: 4829)');
      return false;
    }
  };

  const reportDeliveryIssue = (issueType, details) => {
    playTrialSound();
    showToast(`Issue reported to Dispatch Controller: ${issueType}. Support is calling you.`);

    fetch('/api/partners/delivery/report-issue', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+91 9876543210',
        order_id: activeDeliveryJob.order_id,
        issue_type: issueType,
        details
      })
    }).catch(() => {});
  };

  const requestRiderPayout = (amount, upiId) => {
    playTrialSound();
    const withdrawAmt = Number(amount) || 0;
    if (withdrawAmt <= 0) return;

    setRiderProfile(prev => ({
      ...prev,
      today_earnings: Math.max(0, prev.today_earnings - withdrawAmt)
    }));

    showToast(`Instant payout of ₹${withdrawAmt} initiated to ${upiId || riderProfile.upi_id}! ⚡`);

    fetch('/api/partners/delivery/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+91 9876543210',
        amount: withdrawAmt,
        upi_id: upiId || riderProfile.upi_id
      })
    }).catch(() => {});
  };

  const updateRiderProfileData = (fields) => {
    playClickSound();
    setRiderProfile(prev => ({ ...prev, ...fields }));
    showToast('Delivery partner profile & vehicle details updated! ✓');

    fetch('/api/partners/delivery/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+91 9876543210', ...fields })
    }).catch(() => {});
  };

  // Shop Owner Actions
  const toggleShopAvailability = () => {
    playTrialSound();
    const nextState = !shopProfile.is_open;
    setShopProfile(prev => ({ ...prev, is_open: nextState }));
    showToast(nextState ? 'Store is online. Now accepting orders.' : 'Store is paused. Currently offline.');

    const sellerPhone = shopProfile?.phone || currentUser?.phone || '+91 98450 67890';
    fetch('/api/partners/shop/toggle-open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: sellerPhone, is_open: nextState })
    }).catch(() => {});
  };

  const updateShopProfileData = (updatedFields) => {
    playClickSound();
    const effectivePhone = shopProfile?.phone || currentUser?.phone || '+91 98450 67890';
    const effectiveEmail = shopProfile?.email || currentUser?.email || '';
    const effectiveShopId = shopProfile?.shop_id || 'SHP-4012';

    const merged = { ...shopProfile, ...updatedFields };
    setShopProfile(merged);
    showToast('Store settings saved successfully.');

    try {
      localStorage.setItem('nivvo_shop_profile', JSON.stringify(merged));
    } catch {}

    fetch('/api/partners/shop/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        phone: effectivePhone,
        email: effectiveEmail,
        shop_id: effectiveShopId,
        ...updatedFields 
      })
    }).catch(() => {});
  };

  const requestShopPayout = (amount, upiId) => {
    playTrialSound();
    const withdrawAmt = Number(amount) || 0;
    if (withdrawAmt <= 0) return;

    setShopEarnings(prev => ({
      ...prev,
      grossSales: Math.max(0, prev.grossSales - withdrawAmt),
      netPayout: Math.max(0, prev.netPayout - withdrawAmt),
      today_gross: Math.max(0, prev.today_gross - withdrawAmt)
    }));

    showToast(`Instant payout of ₹${withdrawAmt.toLocaleString('en-IN')} processed to ${upiId || shopProfile.upi_id}.`);

    fetch('/api/partners/shop/withdraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+91 9876543210', amount: withdrawAmt, upi_id: upiId || shopProfile.upi_id })
    }).catch(() => {});
  };

  const acceptMerchantOrder = (orderId) => {
    playTrialSound();
    const targetOrder = shopIncomingOrders.find(o => o.id === orderId);
    const shopName = targetOrder?.shopName || targetOrder?.shop || 'Sole Street Originals';
    const shopAddr = targetOrder?.shopAddress || '100ft Road, Indiranagar';
    const orderItemName = (targetOrder?.fullItems && targetOrder.fullItems[0]?.name) || targetOrder?.item_name || (targetOrder?.items && targetOrder.items[0]) || 'Everyday court sneaker';
    const customerName = targetOrder?.customer || targetOrder?.customer_name || 'Aarav Shah';
    const customerArea = targetOrder?.deliveryAddress || targetOrder?.customer_address || targetOrder?.address || 'Apartment 402, Prestige Palms, 12th Main Indiranagar';
    const tripPayout = Math.max(58, Math.round(42 + ((targetOrder?.rawAmount || 1000) * 0.035)));

    // 1. Update seller incoming orders
    setShopIncomingOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'preparing',
          statusLabel: 'Preparing · Due in 5 min',
          dueTime: 'Due in 5 mins',
          rider: { name: 'Ravi Kumar', vehicle: 'Ather 450X (EV 🚲)', distance: '0.4 km', eta: '3 min' }
        };
      }
      return o;
    }));

    // 2. Update customer order status
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'preparing',
          statusLabel: `${shopName} is preparing your items 🛍️`
        };
      }
      return o;
    }));

    // 3. Dispatch delivery offer to Delivery Partner fleet
    const newOffer = {
      id: `OFFER-${orderId}`,
      order_id: orderId,
      payout: tripPayout,
      pickupsCount: 1,
      dropoffsCount: 1,
      totalDistance: '1.8 km',
      estTime: '12–16 min',
      shops: [
        { 
          name: shopName, 
          address: shopAddr,
          readyIn: 'Ready in 4 min', 
          distance: '0.4 km from your location', 
          item: orderItemName 
        }
      ],
      customer: { 
        name: customerName, 
        area: customerArea, 
        distance: '1.4 km from shop' 
      },
      pickupPin: '4812',
      customerPin: '4829',
      secondsRemaining: 30
    };

    setDeliveryOffers(prev => [newOffer, ...prev.filter(o => o.order_id !== orderId)]);

    // 4. Send high-priority notification to Delivery Partner fleet
    setRiderNotifications(prev => [
      {
        id: `notif-rider-${Date.now()}`,
        title: `New Delivery Request: Order #${orderId}`,
        message: `${shopName} has accepted order #${orderId}. Earn ₹${tripPayout} (1.8 km Indiranagar delivery). Tap to accept!`,
        time: 'Just now',
        type: 'order',
        read: false,
        orderId: orderId
      },
      ...prev
    ]);

    // 5. Update live tracking progress
    setLiveLocationTracking(prev => ({
      ...prev,
      stepIndex: 0,
      stepLabel: 'Confirmed & Preparing',
      subText: `${shopName} is preparing your package thoughtfully · Matching nearby rider.`
    }));

    showToast(`Order ${orderId} accepted. Dispatch alert sent to nearby couriers.`);

    fetch('/api/partners/shop/accept-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, prep_minutes: 5 })
    }).catch(() => {});
  };

  const rejectMerchantOrder = (orderId, reason) => {
    playClickSound();
    setShopIncomingOrders(prev => prev.filter(o => o.id !== orderId));
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'cancelled',
          statusLabel: `Declined: ${reason} (Refund issued)`
        };
      }
      return o;
    }));
    showToast(`Order ${orderId} declined: "${reason}". Customer notified & refunded.`);

    fetch('/api/partners/shop/reject-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, reason })
    }).catch(() => {});
  };

  const dispatchMerchantOrder = (orderId) => {
    playTrialSound();
    // 1. Update merchant orders
    setShopIncomingOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'ready',
          statusLabel: 'Ready for Pickup · Counter Staged',
          pickup_pin: '4812'
        };
      }
      return o;
    }));

    // 2. Update customer order
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'ready',
          statusLabel: 'Package sealed in tamper bag · Courier arriving at shop counter'
        };
      }
      return o;
    }));

    // 3. Update live tracking progress
    setLiveLocationTracking(prev => ({
      ...prev,
      stepIndex: 1,
      stepLabel: 'Package Sealed & Ready',
      subText: 'Delivery partner arrived at storefront counter for pickup.'
    }));

    showToast(`Order ${orderId} packed & sealed! Courier notified for handover with PIN 4812.`);

    fetch('/api/partners/shop/dispatch-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    }).catch(() => {});
  };

  const verifyMerchantHandoverPin = (orderId) => {
    playTrialSound();
    // 1. Mark picked up in seller portal
    setShopIncomingOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'picked_up',
          statusLabel: 'Handed Over to Courier ✓'
        };
      }
      return o;
    }));

    // 2. Mark out for delivery in customer portal
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'out_for_delivery',
          statusLabel: 'Out for delivery · Live GPS active'
        };
      }
      return o;
    }));

    // 3. Advance delivery partner job
    setActiveDeliveryJob(prev => ({
      ...prev,
      stage: 'picked_up',
      statusLabel: 'Garments Collected · Out for 10-Min Delivery'
    }));

    // 4. Activate live GPS movement simulation
    setLiveLocationTracking(prev => ({
      ...prev,
      isActive: true,
      stepIndex: 2,
      progress: 0.1,
      distanceKm: 1.8,
      etaMinutes: 10,
      stepLabel: 'Out for Delivery',
      subText: 'Rider Ravi picked up package from Sole Street · Riding down 100ft Road'
    }));

    showToast(`Handover PIN 4812 verified. Order ${orderId} is out for delivery.`);
  };

  const restockDoorstepReturn = (returnId, sku, qty = 1) => {
    playTrialSound();
    setShopReturnedItems(prev => prev.map(r => {
      if (r.id === returnId) {
        return { ...r, status: 'Restocked to Shelf' };
      }
      return r;
    }));

    // Increment local stock
    setSellerProducts(prev => prev.map(p => {
      if (p.sku === sku) {
        const nextStock = p.stock + qty;
        return {
          ...p,
          stock: nextStock,
          status: nextStock > 2 ? 'Live ↗' : (nextStock > 0 ? 'Low stock' : 'Out of stock'),
          color: nextStock > 2 ? '#238636' : (nextStock > 0 ? '#E6A23C' : '#BD3838')
        };
      }
      return p;
    }));

    showToast(`Item verified and +${qty} unit restocked to inventory.`);

    fetch('/api/partners/shop/returns/restock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_sku: sku, quantity: qty })
    }).catch(() => {});
  };

  const addMerchantProduct = (productData) => {
    playTrialSound();
    const cleanPrice = Number(productData.price?.toString().replace(/[^0-9]/g, '')) || 100;
    const cleanMrp = Number(productData.mrp?.toString().replace(/[^0-9]/g, '')) || Math.round(cleanPrice * 1.3);
    const cleanStock = Number(productData.stock) || 20;

    // Automatic 10% Company Commission Calculation
    const commission = Math.round(cleanPrice * 0.10);
    const customerPrice = cleanPrice + commission;

    const newProd = {
      id: `prod-${Date.now()}`,
      name: productData.name,
      sku: productData.sku || `SS-${Date.now().toString().slice(-4)}`,
      category: productData.category || 'Footwear',
      variants: `${productData.sizes?.length || 5} sizes`,
      price: `₹${cleanPrice.toLocaleString('en-IN')}`, // Seller dashboard keeps original listed price
      rawPrice: cleanPrice,
      sellerPrice: cleanPrice,
      commission: commission,
      customerPrice: customerPrice,
      mrp: cleanMrp,
      stock: cleanStock,
      status: 'Live ↗',
      color: '#238636',
      image: productData.image || '/assets/figma/product_court_sneaker.png',
      images: (productData.images && productData.images.length > 0) ? productData.images : [productData.image || '/assets/figma/product_court_sneaker.png'],
      description: productData.description || `${productData.name} by Sole Street. Handcrafted locally in Indiranagar, Bengaluru. Guaranteed local verified stock.`,
      trial_supported: productData.trial_supported !== false
    };

    setSellerProducts(prev => [newProd, ...prev]);

    // Add to customer-facing allProducts with 10% commission automatically added
    const customerProductObj = {
      id: `nv-prod-${Date.now()}`,
      name: productData.name,
      brand: 'SOLE STREET ORIGINALS',
      category: (productData.category || 'footwear').toLowerCase(),
      shopId: 'sole-street',
      shopName: 'Sole Street',
      sellerPrice: cleanPrice,
      commission: commission,
      price: customerPrice, // Customer sees price with 10% company commission automatically added
      originalPrice: cleanMrp,
      discount: `Save ₹${Math.max(0, cleanMrp - customerPrice)}`,
      color: productData.subtitle || 'Core Edition',
      rating: 5.0,
      reviewCount: 1,
      deliveryTime: '10–15 min',
      stockCount: cleanStock,
      sizes: productData.sizes || ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10'],
      trialSupported: productData.trial_supported !== false,
      description: productData.description || `${productData.name} by Sole Street. Handcrafted locally in Indiranagar, Bengaluru. Guaranteed local verified stock.`,
      fabric: 'Premium Leather & Breathable Upper',
      image: productData.image || '/assets/figma/product_court_sneaker.png',
      images: (productData.images && productData.images.length > 0) ? productData.images : [productData.image || '/assets/figma/product_court_sneaker.png'],
      tag: 'NEW LOCAL ARRIVAL',
      availableShops: [
        { name: 'Sole Street', price: customerPrice, rating: 4.8, distance: '0.4 km away', stock: `${cleanStock} in stock`, eta: '10–15 min', checked: 'Just now', recommended: true }
      ]
    };

    setAllProducts(prev => [customerProductObj, ...prev]);
    showToast(`"${productData.name}" listed successfully at ₹${cleanPrice}`);

    fetch('/api/partners/shop/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: '+91 9876543210',
        name: productData.name,
        category: productData.category || 'Footwear',
        price: cleanPrice,
        original_price: cleanMrp,
        stock_quantity: cleanStock,
        sku: newProd.sku,
        sizes: productData.sizes || ['UK 7', 'UK 8', 'UK 9'],
        image: productData.image,
        trial_supported: productData.trial_supported !== false
      })
    }).catch(() => {});
  };

  const updateProductStockCount = (sku, delta) => {
    playClickSound();
    setSellerProducts(prev => prev.map(p => {
      if (p.sku === sku) {
        const nextStock = Math.max(0, p.stock + delta);
        return {
          ...p,
          stock: nextStock,
          status: nextStock > 2 ? 'Live ↗' : (nextStock > 0 ? 'Low stock' : 'Out of stock'),
          color: nextStock > 2 ? '#238636' : (nextStock > 0 ? '#E6A23C' : '#BD3838')
        };
      }
      return p;
    }));

    showToast(`Stock for SKU ${sku} updated`);
  };

  const deleteMerchantProduct = (sku) => {
    playClickSound();
    setSellerProducts(prev => prev.filter(p => p.sku !== sku));
    showToast(`Product ${sku} removed from catalog`);
  };

  const replyToCustomerReview = (reviewId, replyText) => {
    playTrialSound();
    setShopReviews(prev => prev.map(r => {
      if (r.id === reviewId) {
        return { ...r, merchant_reply: replyText };
      }
      return r;
    }));
    showToast('Merchant reply posted to customer review.');

    fetch('/api/partners/shop/reviews/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id: reviewId, reply: replyText })
    }).catch(() => {});
  };

  const addMerchantCampaign = (campaignData) => {
    playTrialSound();
    const newCamp = {
      id: Date.now(),
      campaign_id: `CMP-${Date.now().toString().slice(-4)}`,
      title: campaignData.title,
      code: campaignData.code.toUpperCase(),
      discount_type: campaignData.discount_type || 'PERCENT',
      discount_val: Number(campaignData.discount_val) || 10,
      min_order: Number(campaignData.min_order) || 499,
      status: 'ACTIVE',
      usage_count: 0,
      banner_text: campaignData.banner_text || `${campaignData.discount_val}% off storewide`
    };

    setShopCampaigns(prev => [newCamp, ...prev]);
    showToast(`Promotion "${newCamp.code}" activated for customers.`);

    fetch('/api/partners/shop/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(campaignData)
    }).catch(() => {});
  };

  const createSellerTicket = (ticketData) => {
    playTrialSound();
    const newId = `TKT-${Math.floor(10000 + Math.random() * 90000)}`;
    const newTicket = {
      id: newId,
      category: ticketData.category || 'General Support',
      subject: ticketData.subject || 'Support Query',
      orderId: ticketData.orderId || null,
      priority: ticketData.priority || 'MEDIUM',
      status: 'IN PROGRESS',
      createdAt: 'Just now',
      lastUpdate: 'Just now',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'merchant',
          senderName: 'Rohan (Sole Street)',
          text: ticketData.description || ticketData.subject,
          time: 'Just now'
        },
        {
          id: `m-${Date.now() + 1}`,
          sender: 'support',
          senderName: 'Nivvo Partner Ops (Auto-Ack)',
          text: `Ticket ${newId} received! Our Indiranagar Hub operations team has been notified. An operations executive will reply within 3–5 minutes.`,
          time: 'Just now'
        }
      ]
    };
    setSellerTickets(prev => [newTicket, ...prev]);
    showToast(`Support ticket ${newId} created. Support team notified.`);
    return newId;
  };

  const replyToSellerTicket = (ticketId, replyText) => {
    playClickSound();
    setSellerTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'AWAITING SELLER REPLY',
          lastUpdate: 'Just now',
          messages: [
            ...t.messages,
            {
              id: `m-${Date.now()}`,
              sender: 'merchant',
              senderName: 'Rohan (Sole Street)',
              text: replyText,
              time: 'Just now'
            }
          ]
        };
      }
      return t;
    }));
    showToast('Reply sent to Support team.');
  };

  // 7. Modals and Toast State
  const [activeModal, setActiveModal] = useState(null); // 'location' | 'coupon' | 'call' | 'chat' | 'pin' | 'addProduct' | 'shopWithdraw' | 'shopSettings' | 'shopReject' | 'shopCampaign'
  const [modalPayload, setModalPayload] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Cart Calculations with safe number parsing
  const cartSubtotal = cart.reduce((acc, item) => {
    const itemPrice = parsePrice(item.price);
    const itemQty = Number(item.quantity) || 1;
    return acc + (itemPrice * itemQty);
  }, 0);

  // Free delivery rule: ₹200 or more is FREE (0), below ₹200 is ₹39
  const cartDeliveryFee = (cart.length > 0 && cartSubtotal < 200) ? 39 : 0;
  const cartPlatformFee = cart.length > 0 ? 9 : 0;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(Number(appliedCoupon.value) || 0, cartSubtotal);
    } else if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((cartSubtotal * (Number(appliedCoupon.value) || 0)) / 100);
    } else if (appliedCoupon.type === 'freedel') {
      discountAmount = cartDeliveryFee;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee + cartPlatformFee - discountAmount);
  const totalCartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 1), 0);

  // Cart Actions
  const addToCart = (product, size = 'UK 8', customShop = null) => {
    playAddSound();
    
    // Support passing size inside product object
    const selectedSize = size || product.size || 'UK 8';

    // Parse clean numeric prices
    const rawPrice = product.priceNum !== undefined ? product.priceNum : product.price;
    const numPrice = parsePrice(rawPrice) || 1299;
    const numOrigPrice = parsePrice(product.originalPrice) || Math.round(numPrice * 1.25);
    const numSellerPrice = parsePrice(product.sellerPrice) || Math.round(numPrice / 1.10);
    const numCommission = parsePrice(product.commission) || (numPrice - numSellerPrice);

    // Resolve shop name and shop id
    let shopName = product.shopName || product.shop || '';
    if (!shopName && product.proximity) {
      shopName = product.proximity.split('·')[0].trim();
    }
    if (!shopName) shopName = 'Sole Street';

    const shopId = product.shopId || shopName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const shop = customShop || { name: shopName, id: shopId };

    const prodId = product.id || `nv-prod-${Date.now()}`;
    const cartItemId = `cart-${shop.id}-${prodId}-${selectedSize}`;

    const prodName = product.name || product.title || 'Everyday Court Sneaker';
    const prodImage = product.image || product.img || '/assets/figma/product_court_sneaker.png';

    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === cartItemId || (i.productId === prodId && i.size === selectedSize));
      if (existing) {
        return prevCart.map(i => i === existing ? { ...i, quantity: (Number(i.quantity) || 1) + 1 } : i);
      } else {
        const newItem = {
          id: cartItemId,
          productId: prodId,
          shopId: shop.id,
          shopName: shop.name,
          name: prodName,
          variant: `${product.color || 'Standard'} · ${selectedSize}`,
          size: selectedSize,
          sellerPrice: numSellerPrice,
          commission: numCommission,
          price: numPrice,
          originalPrice: numOrigPrice,
          eta: product.deliveryTime || product.eta || '12–18 min',
          stockNote: `${selectedSize} reserved at checkout · Local verified stock`,
          image: prodImage,
          quantity: 1
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`Added ${prodName} (${selectedSize}) to your bag 🛍️`);
  };

  const updateCartQuantity = (cartItemId, delta) => {
    playClickSound();
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  const removeCartItem = (cartItemId) => {
    playClickSound();
    setCart(prevCart => prevCart.filter(item => item.id !== cartItemId));
    showToast('Item removed from your bag');
  };

  const clearCart = () => {
    playClickSound();
    setCart([]);
    showToast('Bag emptied successfully');
  };

  const applyCouponCode = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'NIVVO50') {
      setAppliedCoupon({ code: 'NIVVO50', type: 'flat', value: 50, desc: '₹50 off on local finds' });
      showToast('Coupon NIVVO50 applied! Saved ₹50 ✨');
      setActiveModal(null);
      return true;
    } else if (clean === 'LOCAL10') {
      setAppliedCoupon({ code: 'LOCAL10', type: 'percent', value: 10, desc: '10% neighbourhood savings' });
      showToast('Coupon LOCAL10 applied! 10% off ✨');
      setActiveModal(null);
      return true;
    } else if (clean === 'FREEDEL') {
      setAppliedCoupon({ code: 'FREEDEL', type: 'freedel', value: 39, desc: 'Free hyperlocal delivery' });
      showToast('Coupon FREEDEL applied! Free delivery ✨');
      setActiveModal(null);
      return true;
    } else {
      showToast('Invalid coupon. Try NIVVO50, LOCAL10, or FREEDEL');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  // Place Order Action
  const placeOrder = (paymentMethodName = 'UPI') => {
    playTrialSound();
    const newOrderId = `NV-${Math.floor(1053 + Math.random() * 45)}`;
    const custRecipient = selectedAddress?.recipient || currentUser?.name || 'Aarav Shah';
    const custPhone = selectedAddress?.phone || currentUser?.phone || '+91 98765 43210';
    const custAddr = selectedAddress ? `${selectedAddress.title} · ${selectedAddress.street}, ${selectedAddress.area}` : 'Maple Court, 12th Main Indiranagar';

    const orderItems = cart.length > 0 ? cart.map(i => ({
      name: i.name,
      shop: i.shopName || i.shop || 'Sole Street',
      variant: i.variant || i.size || 'Standard',
      sellerPrice: i.sellerPrice || Math.round((i.price || 1299) / 1.10),
      commission: i.commission || Math.round(((i.sellerPrice || Math.round((i.price || 1299) / 1.10)) * 0.10)),
      price: i.price,
      quantity: i.quantity || 1,
      image: i.image || '/assets/figma/product_court_sneaker.png'
    })) : [
      {
        name: 'Everyday court sneaker',
        shop: 'Sole Street',
        variant: 'Sage / Ivory · UK 8',
        sellerPrice: 1299,
        commission: 130,
        price: 1429,
        quantity: 1,
        image: '/assets/figma/product_court_sneaker.png'
      }
    ];

    // 0. Dynamically resolve Nearest Eligible Shop based on Customer GPS Location & Item Affinity
    const custLat = parseFloat(selectedAddress?.latitude) || 12.9716;
    const custLng = parseFloat(selectedAddress?.longitude) || 77.6412;
    const requestedItemShop = String(orderItems[0]?.shop || '').trim().toLowerCase();
    const requestedItemName = String(orderItems[0]?.name || '').trim().toLowerCase();

    const matchesStore = (s) => {
      const sId = String(s.id || s.shop_id || '').toLowerCase();
      const sName = String(s.name || s.shop_name || '').toLowerCase();
      if (requestedItemShop && (sName.includes(requestedItemShop) || requestedItemShop.includes(sName) || sId.includes(requestedItemShop))) return true;
      if (requestedItemName.includes('backpack') || requestedItemName.includes('bag') || requestedItemName.includes('tote')) {
        if (sId.includes('carry') || sId.includes('tote') || sName.includes('carry') || sName.includes('tote') || (s.categories && s.categories.some(c => c.toLowerCase().includes('bag')))) return true;
      }
      if (requestedItemName.includes('sneaker') || requestedItemName.includes('shoe') || requestedItemName.includes('sandal')) {
        if (sId.includes('sole') || sName.includes('sole') || (s.categories && s.categories.some(c => c.toLowerCase().includes('shoe') || c.toLowerCase().includes('sneaker')))) return true;
      }
      return false;
    };

    const evaluatedEligibleShops = (allShops || [])
      .map(s => {
        const sLat = parseFloat(s.latitude) || 12.9716;
        const sLng = parseFloat(s.longitude) || 77.6412;
        const dist = calculateDistance(custLat, custLng, sLat, sLng);
        const radius = parseFloat(s.delivery_radius_km || s.delivery_radius) || 15;
        const isMatch = matchesStore(s);
        return {
          ...s,
          computedDistanceKm: dist !== null ? dist : 999,
          isWithinRadius: dist !== null ? dist <= radius : true,
          isBrandMatch: isMatch
        };
      })
      .filter(s => s.is_open !== false);

    // Priority 1: Matching brand store within 25 km of customer GPS
    const matchingBrandEligible = evaluatedEligibleShops
      .filter(s => s.isBrandMatch && s.computedDistanceKm <= 25)
      .sort((a, b) => a.computedDistanceKm - b.computedDistanceKm);

    // Priority 2: Nearest open eligible store within delivery radius (<= 25 km)
    const nearestEligible = evaluatedEligibleShops
      .filter(s => s.isWithinRadius && s.computedDistanceKm <= 25)
      .sort((a, b) => a.computedDistanceKm - b.computedDistanceKm);

    let nearestResolvedShop = null;
    let targetShopDist = 0.8;

    if (matchingBrandEligible.length > 0) {
      nearestResolvedShop = matchingBrandEligible[0];
      targetShopDist = nearestResolvedShop.computedDistanceKm;
    } else if (nearestEligible.length > 0) {
      nearestResolvedShop = nearestEligible[0];
      targetShopDist = nearestResolvedShop.computedDistanceKm;
    } else {
      // Priority 3: Adaptive localized micro-hub in the customer's area
      const localArea = selectedAddress?.area || selectedAddress?.title?.split('·')[1]?.trim() || selectedAddress?.city || 'Local Area';
      const hubBrand = orderItems[0]?.shop || 'The Carry Co.';
      nearestResolvedShop = {
        id: `hub-${Math.abs(Math.round(custLat * 100))}`,
        name: `${hubBrand} (${localArea} Hub)`,
        latitude: custLat + 0.003,
        longitude: custLng + 0.002,
        computedDistanceKm: 0.6
      };
      targetShopDist = 0.6;
    }

    const targetShopName = nearestResolvedShop.name || nearestResolvedShop.shop_name || 'Sole Street';
    const targetShopId = nearestResolvedShop.id || nearestResolvedShop.shop_id || 'sole-street';
    const targetShopEta = calculateEta(targetShopDist);
    const targetShopEtaMinutes = calculateEtaMinutes(targetShopDist);

    // Calculate split: Seller Original Payout vs Company 10% Commission
    const customerSubtotal = cartSubtotal || (orderItems[0].price * (orderItems[0].quantity || 1));
    const sellerSubtotal = cart.length > 0
      ? cart.reduce((acc, i) => acc + ((i.sellerPrice || Math.round(i.price / 1.10)) * (i.quantity || 1)), 0)
      : (orderItems[0].sellerPrice || 1299);
    const companyCommissionEarned = Math.max(0, customerSubtotal - sellerSubtotal);

    // Decrement physical stock across catalog
    orderItems.forEach(item => {
      if (item.name) {
        setAllProducts(prev => prev.map(p => {
          if (p.name.toLowerCase() === item.name.toLowerCase()) {
            return { ...p, stockCount: Math.max(0, (p.stockCount || 5) - (item.quantity || 1)) };
          }
          return p;
        }));
      }
    });

    const customerOrderObj = {
      id: newOrderId,
      placedAt: 'Just now',
      itemsCount: orderItems.length,
      subtotal: customerSubtotal,
      delivery: cartDeliveryFee,
      platformFee: cartPlatformFee,
      total: cartTotal || (customerSubtotal + cartDeliveryFee + cartPlatformFee),
      paymentMethod: paymentMethodName,
      status: 'new',
      statusLabel: `Confirmed · Preparing at ${targetShopName}`,
      etaText: targetShopEta,
      etaMinutes: targetShopEtaMinutes,
      shop_id: targetShopId,
      shop_name: targetShopName,
      distance_km: targetShopDist,
      pin: '4829',
      pickupPin: '4812',
      customerPin: '4829',
      rider: {
        name: 'Ravi Kumar',
        phone: '+91 98450 12345',
        rating: 4.9,
        tripsToday: 13,
        vehicle: 'Ather 450X (Electric)',
        badge: 'Top Rated Partner'
      },
      items: orderItems
    };

    // 1. Add to customer orders list
    setOrders(prev => [customerOrderObj, ...prev]);

    // 1B. Immediately initialize real-time live GPS tracking for the placed order
    setLiveLocationTracking(prev => ({
      ...prev,
      orderId: newOrderId,
      isActive: true,
      progress: 0.05,
      stepIndex: 0,
      stepLabel: `Confirmed · Preparing at ${targetShopName}`,
      subText: `${targetShopName} (${targetShopDist} km away) is packing your items in tamper-safe bag`,
      distanceKm: targetShopDist,
      etaMinutes: targetShopEtaMinutes,
      speedKmph: 22,
      pin: '4829',
      pickupPin: '4812',
      customerPin: '4829',
      riderName: 'Ravi Kumar',
      riderPhone: '+91 98450 12345',
      origin: {
        lat: parseFloat(nearestResolvedShop.latitude) || 12.9716,
        lng: parseFloat(nearestResolvedShop.longitude) || 77.6412,
        name: `${targetShopName} (${targetShopDist} km)`
      }
    }));

    // 1C. Asynchronously persist order to backend with Customer GPS and Resolved Nearest Shop
    createOrder({
      order_id: newOrderId,
      user_phone: custPhone,
      customer_name: custRecipient,
      items: orderItems,
      grand_total: cartTotal || (customerSubtotal + cartDeliveryFee + cartPlatformFee),
      payment_method: paymentMethodName,
      payment_id: `PAY-${Date.now()}`,
      address: custAddr,
      customer_lat: custLat,
      customer_lng: custLng,
      dark_store: `${targetShopName} (${targetShopDist} km)`,
      doorstep_trial_active: true,
      shop_id: targetShopId,
      shop_name: targetShopName
    }).then(res => {
      if (res && res.success && res.order) {
        const backOrder = res.order;
        const finalShopName = backOrder.shop_name || targetShopName;
        const finalShopId = backOrder.shop_id || targetShopId;
        const finalDist = parseFloat(backOrder.distance_km) || targetShopDist;
        const finalEta = parseInt(backOrder.eta_minutes) || 12;

        setLiveLocationTracking(prev => ({
          ...prev,
          distanceKm: finalDist,
          etaMinutes: finalEta,
          stepLabel: backOrder.status || prev.stepLabel,
          subText: `${finalShopName} is preparing your items thoughtfully in tamper-safe packaging`,
          origin: {
            lat: parseFloat(backOrder.shop_lat) || nearestResolvedShop.latitude || 12.9716,
            lng: parseFloat(backOrder.shop_lng) || nearestResolvedShop.longitude || 77.6412,
            name: backOrder.dark_store || `${finalShopName} (${finalDist} km)`
          }
        }));

        setOrders(prev => prev.map(o => {
          if (o.id === newOrderId) {
            return {
              ...o,
              shop_id: finalShopId,
              shop_name: finalShopName,
              statusLabel: `Confirmed · Preparing at ${finalShopName}`,
              etaMinutes: finalEta,
              etaText: `${finalEta}–${finalEta + 5} min`,
              distance_km: finalDist
            };
          }
          return o;
        }));

        setShopIncomingOrders(prev => prev.map(o => {
          if (o.id === newOrderId) {
            return {
              ...o,
              shopName: finalShopName,
              shop_id: finalShopId
            };
          }
          return o;
        }));
      }
    }).catch(err => {
      console.warn('Backend order persist fallback active:', err);
    });

    // 2. Add directly to Seller's incoming orders (Kanban New column!)
    // Note: Seller gets 100% of their listed price (rawAmount / amount is sellerSubtotal)
    const sellerIncomingObj = {
      id: newOrderId,
      customer_name: custRecipient,
      customer_phone: custPhone,
      customer_address: custAddr,
      shopName: targetShopName,
      shop_id: targetShopId,
      item_name: orderItems[0].name,
      variant: orderItems[0].variant,
      fullItems: orderItems,
      sku: 'SS-COURT-01',
      amount: `₹${sellerSubtotal.toLocaleString('en-IN')}`, // Seller receives 100% of original listed price
      rawAmount: sellerSubtotal,
      sellerPayout: sellerSubtotal,
      customerPaid: cartTotal || (customerSubtotal + cartDeliveryFee + cartPlatformFee),
      companyCommission: companyCommissionEarned,
      paymentMethod: `${paymentMethodName} Paid`,
      status: 'new',
      statusLabel: 'New Order',
      secondsRemaining: 120,
      stockAvailable: 4,
      time: 'Just now',
      image: orderItems[0].image,
      trial_active: true,
      pin: '4812',
      pickup_pin: '4812',
      customer_pin: '4829',
      rider: {
        name: 'Ravi Kumar',
        phone: '+91 98450 12345',
        vehicle: 'Ather 450X · KA-03-EV-4421'
      }
    };
    setShopIncomingOrders(prev => [sellerIncomingObj, ...prev]);

    // Update store earnings with 100% net seller payout (₹0 deduction)
    setShopEarnings(prev => ({
      ...prev,
      grossSales: prev.grossSales + sellerSubtotal,
      netPayout: prev.netPayout + sellerSubtotal,
      today_gross: prev.today_gross + sellerSubtotal,
      today_orders_count: prev.today_orders_count + 1
    }));

    // 3. Add to notifications for store owner
    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: `New Order #${newOrderId} Received! 🛍️`,
        message: `${custRecipient} placed an order for ${orderItems[0].name}. Your Net Payout: ₹${sellerSubtotal.toLocaleString('en-IN')} (100% of listed price). Customer Paid: ₹${(cartTotal || 1347).toLocaleString('en-IN')} (Includes ₹${companyCommissionEarned} 10% company fee). Please confirm within 2 minutes!`,
        time: 'Just now',
        type: 'order',
        read: false
      },
      ...prev
    ]);

    // 4. Reset customer cart
    setCart([]);

    showToast(`Order ${newOrderId} placed successfully! ${targetShopName} has received your ticket.`);
    setCurrentScreen('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation Helper
  const navigateTo = (screenId) => {
    playClickSound();

    // Normalize aliases
    let target = screenId;
    if (['seller-overview', 'seller-dash', 'seller', 'merchant'].includes(target)) target = 'seller-dash';
    if (['admin-overview', 'admin', 'admin-ops'].includes(target)) target = 'admin-overview';
    if (['admin-sellers', 'merchant-ops'].includes(target)) target = 'admin-sellers';
    if (['admin-orders', 'admin-dispatch'].includes(target)) target = 'admin-orders';
    if (['admin-delivery', 'admin-fleet'].includes(target)) target = 'admin-delivery';
    if (['admin-customers', 'admin-crm'].includes(target)) target = 'admin-customers';
    if (['admin-finance', 'admin-settlements'].includes(target)) target = 'admin-finance';

    if (['orders', 'order'].includes(target)) {
      if (currentUser?.role === 'admin') target = 'admin-orders';
      else if (currentUser?.role === 'seller') target = 'seller-orders';
      else target = 'profile';
    }
    if (['finance', 'payouts'].includes(target)) {
      if (currentUser?.role === 'admin') target = 'admin-finance';
      else if (currentUser?.role === 'seller') target = 'seller-payouts';
      else target = 'profile';
    }
    if (['delivery', 'fleet'].includes(target)) {
      if (currentUser?.role === 'admin') target = 'admin-delivery';
      else if (currentUser?.role === 'rider') target = 'rider-duty';
      else target = 'tracking';
    }
    if (['profile', 'account', 'customer', 'customer-portal', 'customers'].includes(target)) {
      if (currentUser?.role === 'admin' && (target === 'customers' || target === 'admin-customers')) {
        target = 'admin-customers';
      } else {
        target = 'profile';
      }
    }

    setCurrentScreen(target);

    if (isNativeMobileApp()) {
      setPlatformMode('app');
      if (target.startsWith('rider-')) {
        setAppMode('rider');
        try { localStorage.setItem('nivvo_app_mode', 'rider'); } catch {}
      } else {
        setAppMode('customer');
        try { localStorage.setItem('nivvo_app_mode', 'customer'); } catch {}
      }
    } else {
      // In web browser: stay in web platform mode!
      setPlatformMode('web');
      try { localStorage.setItem('nivvo_platform_mode', 'web'); } catch {}
    }

    try {
      if (window.location.hash !== `#/${target}`) {
        window.location.hash = `#/${target}`;
      }
    } catch {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <NivvoAppContext.Provider value={{
      currentScreen,
      setCurrentScreen,
      navigateTo,
      selectedProduct,
      setSelectedProduct,
      selectedCategory,
      setSelectedCategory,
      allProducts,
      setAllProducts,
      allShops,
      setAllShops,
      pendingSellerApplications,
      setPendingSellerApplications,
      submitSellerApplication,
      pendingRiderApplications,
      setPendingRiderApplications,
      approveSellerApplication,
      rejectSellerApplication,
      approveRiderApplication,
      rejectRiderApplication,
      liveLocationTracking,
      setLiveLocationTracking,
      viewMode,
      setViewMode,
      searchQuery,
      setSearchQuery,
      // Cart
      cart,
      setCart,
      addToCart,
      updateCartQuantity,
      removeCartItem,
      clearCart,
      totalCartCount,
      cartSubtotal,
      cartDeliveryFee,
      cartPlatformFee,
      discountAmount,
      cartTotal,
      parsePrice,
      // Coupons
      appliedCoupon,
      applyCouponCode,
      removeCoupon,
      // Addresses & Geolocation
      savedAddresses,
      setSavedAddresses,
      selectedAddress,
      setSelectedAddress,
      detectUserLocation,
      isDetectingLocation,
      locationPermissionStatus,
      detectSellerShopLocation,
      fetchSellerShopLocation,
      // Orders & Tracking
      orders,
      activeOrder: orders[0],
      placeOrder,
      cancelOrder,
      requestReturnOrExchange,
      submitOrderReview,
      // Wishlist
      wishlist,
      setWishlist,
      toggleWishlist,
      isWishlisted,
      // Notifications
      notifications,
      setNotifications,
      markAllNotificationsRead,
      clearNotification,
      unreadNotificationCount,
      // Seller / Shop Owner Command Center
      shopProfile,
      setShopProfile,
      shopEarnings,
      setShopEarnings,
      shopReviews,
      setShopReviews,
      shopCampaigns,
      setShopCampaigns,
      shopIncomingOrders,
      setShopIncomingOrders,
      shopReturnedItems,
      setShopReturnedItems,
      sellerProducts,
      setSellerProducts,
      toggleShopAvailability,
      updateShopProfileData,
      requestShopPayout,
      acceptMerchantOrder,
      rejectMerchantOrder,
      dispatchMerchantOrder,
      verifyMerchantHandoverPin,
      restockDoorstepReturn,
      addMerchantProduct,
      updateProductStockCount,
      deleteMerchantProduct,
      replyToCustomerReview,
      addMerchantCampaign,
      sellerTickets,
      setSellerTickets,
      createSellerTicket,
      replyToSellerTicket,
      // Delivery Partner (Rider) Fleet Command
      riderProfile,
      setRiderProfile,
      activeDeliveryJob,
      setActiveDeliveryJob,
      deliveryOffers,
      setDeliveryOffers,
      riderTripsHistory,
      setRiderTripsHistory,
      toggleRiderDuty,
      refreshRiderLocation,
      acceptRiderJob,
      declineRiderJob,
      advanceDeliveryStage,
      verifyDropoffPin,
      reportDeliveryIssue,
      requestRiderPayout,
      updateRiderProfileData,
      riderSupportTickets,
      setRiderSupportTickets,
      createRiderSupportTicket,
      riderChatMessages,
      sendRiderChatMessage,
      riderCallbackRequest,
      requestRiderCallback,
      cancelRiderCallback,
      riderShifts,
      setRiderShifts,
      bookRiderShift,
      riderNotifications,
      setRiderNotifications,
      markRiderNotificationRead,
      markAllRiderNotificationsRead,
      riderMilestones,
      // Production Auth & Verification
      currentUser,
      setCurrentUser,
      authToken,
      setAuthToken,
      authModalOpen,
      setAuthModalOpen,
      authModalRole,
      setAuthModalRole,
      handleLoginSuccess,
      logoutUser,
      logout: logoutUser,
      // Platform Architecture: Website (Seller/Admin) vs Mobile App (Customer/Rider)
      platformMode,
      setPlatformMode,
      switchToWebMode,
      switchToAppMode,
      // Seamless Dual-Mode Architecture: Customer Mode <---> Delivery Partner Mode
      appMode,
      setAppMode,
      switchToCustomerMode,
      switchToRiderMode,
      registerCustomerAsRider,
      becomeRiderModalOpen,
      setBecomeRiderModalOpen,
      // Modals & Toasts
      activeModal,
      setActiveModal,
      modalPayload,
      setModalPayload,
      toastMessage,
      showToast
    }}>
      {children}
    </NivvoAppContext.Provider>
  );
}

export function useNivvo() {
  const context = useContext(NivvoAppContext);
  if (!context) {
    throw new Error('useNivvo must be used within a NivvoAppProvider');
  }
  return context;
}
