import React, { createContext, useContext, useState, useEffect } from 'react';
import { NIVVO_PRODUCTS, NIVVO_SHOPS } from '../data/nivvoData';
import { playClickSound, playAddSound, playTrialSound } from '../utils/audioEffects';

const NivvoAppContext = createContext();

export function NivvoAppProvider({ children }) {
  // 0. Production Authentication & Role-Based Access Control State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const stored = localStorage.getItem('nivvo_user');
      return stored ? JSON.parse(stored) : {
        id: 1,
        role: 'customer',
        name: 'Aarav Shah',
        phone: '+91 98765 43210',
        email: 'aarav.shah@okaxis',
        status: 'active'
      };
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
  // PLATFORM ARCHITECTURE: Website (Seller & Admin) vs Mobile App (Customer & Delivery Partner)
  // ============================================================================
  const [platformMode, setPlatformMode] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        if (window.__IS_MOBILE_APP__ || window.ReactNativeWebView || window.location.protocol === 'file:') {
          return 'app';
        }
        const searchParams = new URLSearchParams(window.location.search);
        if (searchParams.get('platform') === 'app' || searchParams.get('mode') === 'mobile') {
          return 'app';
        }
        if (searchParams.get('platform') === 'web') {
          return 'web';
        }
        const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
        const webScreens = ['landing', 'seller-dash', 'seller-prods', 'seller-orders', 'seller-payouts', 'seller-profile', 'seller-reviews', 'seller-support', 'admin-overview', 'admin-sellers'];
        const webAnchors = ['how-it-works', 'collections', 'boutiques', 'try-on-demo', 'seller-onboarding', 'coverage', 'faq', 'app-download', 'features', 'revenue-calculator'];
        if (webScreens.includes(hash) || webAnchors.includes(hash) || hash.startsWith('seller-') || hash.startsWith('admin-')) {
          return 'web';
        }
        const appScreens = ['home', 'categories', 'shops', 'shop-detail', 'sneakers', 'product-detail', 'bag', 'checkout', 'tracking', 'profile', 'grocery', 'food'];
        if (appScreens.includes(hash) || hash.startsWith('rider-')) {
          return 'app';
        }
        const stored = localStorage.getItem('nivvo_platform_mode');
        if (stored === 'web' || stored === 'app') return stored;
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
      window.location.hash = '#/landing';
    } catch {}
    showToast('Switched to Nivvo Website (Seller & Admin Portal) 🌐');
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
    if (!authToken) return;
    fetch('/api/auth/me', {
      headers: { Authorization: `Bearer ${authToken}` }
    })
      .then(r => r.json())
      .then(data => {
        if (data?.success && data?.user) {
          setCurrentUser(data.user);
          try {
            localStorage.setItem('nivvo_user', JSON.stringify(data.user));
          } catch {}

          if (data.user.role === 'seller') {
            setShopProfile(prev => ({
              ...prev,
              shop_name: data.user.shop_name || prev.shop_name,
              verification_status: data.user.verification_status || prev.verification_status,
              rejection_reason: data.user.rejection_reason || null,
              admin_notes: data.user.admin_notes || null
            }));
          } else if (data.user.role === 'rider') {
            setRiderProfile(prev => ({
              ...prev,
              name: data.user.name || prev.name,
              verification_status: data.user.verification_status || prev.verification_status,
              rejection_reason: data.user.rejection_reason || null,
              admin_notes: data.user.admin_notes || null
            }));
          }
        } else if (data?.error?.includes('expired') || data?.error?.includes('Invalid')) {
          logoutUser();
        }
      })
      .catch(() => {});
  }, [authToken]);

  const handleLoginSuccess = (authData) => {
    playTrialSound();
    if (authData.user) {
      setCurrentUser(authData.user);
      try {
        localStorage.setItem('nivvo_user', JSON.stringify(authData.user));
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
        verification_status: authData.shop.verification_status || 'pending'
      }));
    }
    if (authData.rider) {
      setRiderProfile(prev => ({
        ...prev,
        ...authData.rider,
        verification_status: authData.rider.verification_status || 'pending'
      }));
    }

    // Role-specific transition: Website (Seller/Admin) vs Mobile App (Customer/Rider)
    if (authData.user?.role === 'rider') {
      setPlatformMode('app');
      setAppMode('rider');
      setCurrentScreen('rider-duty');
      try {
        localStorage.setItem('nivvo_platform_mode', 'app');
        localStorage.setItem('nivvo_app_mode', 'rider');
      } catch {}
      showToast(`Signed in as Delivery Partner · Welcome, ${authData.user.name || 'Partner'}!`);
    } else if (authData.user?.role === 'customer') {
      setPlatformMode('app');
      setAppMode('customer');
      setCurrentScreen('home');
      try {
        localStorage.setItem('nivvo_platform_mode', 'app');
        localStorage.setItem('nivvo_app_mode', 'customer');
      } catch {}
      showToast(`Signed in as Customer · Welcome, ${authData.user.name || 'Shopper'}!`);
    } else if (authData.user?.role === 'seller') {
      setPlatformMode('web');
      setCurrentScreen('seller-dash');
      try {
        localStorage.setItem('nivvo_platform_mode', 'web');
      } catch {}
      showToast(`Signed in as Merchant · ${authData.shop?.shop_name || 'Store Hub'}`);
    } else if (authData.user?.role === 'admin') {
      setPlatformMode('web');
      setCurrentScreen('admin-overview');
      try {
        localStorage.setItem('nivvo_platform_mode', 'web');
      } catch {}
      showToast('Signed in as Company Administrator.');
    } else {
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
    setCurrentScreen('home');
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

  // 1. Navigation State with URL Hash Sync
  const WEB_SCREENS = ['landing', 'seller-dash', 'seller-prods', 'seller-orders', 'seller-payouts', 'seller-profile', 'seller-reviews', 'seller-support', 'admin-overview', 'admin-sellers'];
  const APP_SCREENS = ['home', 'categories', 'shops', 'shop-detail', 'sneakers', 'product-detail', 'bag', 'checkout', 'tracking', 'profile', 'grocery', 'food', 'brand'];
  const LANDING_ANCHORS = ['how-it-works', 'collections', 'boutiques', 'try-on-demo', 'seller-onboarding', 'coverage', 'faq', 'app-download', 'features', 'revenue-calculator'];

  const [currentScreen, setCurrentScreen] = useState(() => {
    try {
      const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
      if (WEB_SCREENS.includes(hash) || hash.startsWith('seller-') || hash.startsWith('admin-')) {
        return hash;
      }
      if (APP_SCREENS.includes(hash) || hash.startsWith('rider-')) {
        return hash;
      }
    } catch {}
    return 'landing';
  });

  useEffect(() => {
    const handleHashChange = () => {
      try {
        const hash = window.location.hash.replace(/^#\/?/, '').split('?')[0];
        if (!hash) {
          setCurrentScreen('landing');
          setPlatformMode('web');
          return;
        }

        // If the hash is an in-page anchor on the landing page, stay on landing page and scroll to section
        if (LANDING_ANCHORS.includes(hash) || document.getElementById(hash)) {
          setCurrentScreen('landing');
          setPlatformMode('web');
          const el = document.getElementById(hash);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
          return;
        }

        if (WEB_SCREENS.includes(hash) || hash.startsWith('seller-') || hash.startsWith('admin-')) {
          setCurrentScreen(hash);
          setPlatformMode('web');
        } else if (hash.startsWith('rider-')) {
          setCurrentScreen(hash);
          setPlatformMode('app');
          setAppMode('rider');
        } else if (APP_SCREENS.includes(hash)) {
          setCurrentScreen(hash);
          setPlatformMode('app');
          setAppMode('customer');
        } else {
          // Fallback to website landing
          setCurrentScreen('landing');
          setPlatformMode('web');
        }
      } catch {}
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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

    // Update current shop profile if it matches
    setShopProfile(prev => ({
      ...prev,
      verification_status: 'APPROVED',
      is_open: true,
      shop_name: app.shop_name
    }));

    showToast(`Shop "${app.shop_name}" APPROVED! Storefront is live for customer discovery. 🟢`);

    fetch(`/api/admin/verifications/shops/${appId}/decision`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved', notes })
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
  }, []);

  // 2. Cart State (starts empty by default; only appears when customer adds items)
  const [cart, setCart] = useState([]);

  // 3. Coupons State
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // 4. Address State
  const savedAddresses = [
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
      etaModifier: 0
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
      etaModifier: 10
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
      etaModifier: 15
    }
  ];
  const [selectedAddress, setSelectedAddress] = useState(savedAddresses[0]);

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

  // 6. Wishlist State
  const [wishlist, setWishlist] = useState(['nv-prod-1', 'nv-prod-6']);

  // Fetch wishlist from backend if available
  useEffect(() => {
    fetch('/api/wishlist?phone=+91 9876543210')
      .then(res => res.json())
      .then(data => {
        if (data?.wishlist && Array.isArray(data.wishlist) && data.wishlist.length > 0) {
          setWishlist(prev => [...new Set([...prev, ...data.wishlist])]);
        }
      })
      .catch(() => {});
  }, []);

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

  // Sync Shop Data from Backend on Mount
  useEffect(() => {
    fetch('/api/partners/shop/profile?phone=%2B919876543210')
      .then(r => r.json())
      .then(data => {
        if (data?.shop) {
          setShopProfile(prev => ({
            ...prev,
            ...data.shop,
            shop_name: data.shop.shop_name || prev.shop_name,
            is_open: data.shop.is_open !== undefined ? data.shop.is_open : prev.is_open,
            today_revenue: Number(data.shop.today_revenue) || prev.today_revenue
          }));
        }
      })
      .catch(() => {});

    fetch('/api/partners/shop/reviews?shop_id=SHP-4012')
      .then(r => r.json())
      .then(data => {
        if (data?.reviews && Array.isArray(data.reviews) && data.reviews.length > 0) {
          setShopReviews(data.reviews);
        }
      })
      .catch(() => {});

    fetch('/api/partners/shop/campaigns?shop_id=SHP-4012')
      .then(r => r.json())
      .then(data => {
        if (data?.campaigns && Array.isArray(data.campaigns) && data.campaigns.length > 0) {
          setShopCampaigns(data.campaigns);
        }
      })
      .catch(() => {});

    fetch('/api/partners/shop/earnings?phone=%2B919876543210')
      .then(r => r.json())
      .then(data => {
        if (data?.earnings) {
          setShopEarnings(prev => ({ ...prev, ...data.earnings }));
        }
      })
      .catch(() => {});

    // Sync Delivery Partner Profile from Backend
    fetch('/api/partners/delivery/profile?phone=%2B919876543210')
      .then(r => r.json())
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
      .then(r => r.json())
      .then(data => {
        if (data?.history && Array.isArray(data.history) && data.history.length > 0) {
          // Merge with trip history
        }
      })
      .catch(() => {});
  }, []);

  // 6B. Delivery Partner (Rider) Management State
  const [riderProfile, setRiderProfile] = useState({
    partner_id: 'RDR-1082',
    name: 'Ravi Kumar',
    phone: '+91 9876543210',
    email: 'ravi.fleet@nivvo.in',
    city: 'Bengaluru',
    hub_id: 'Indiranagar Dark Store Hub #14',
    vehicle_type: 'Electric Scooter (EV)',
    vehicle_number: 'KA-03-EV-4421',
    battery_level: 84,
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
  const toggleRiderDuty = () => {
    playClickSound();
    const nextState = !riderProfile.is_online;
    setRiderProfile(prev => ({ ...prev, is_online: nextState }));

    if (nextState) {
      // Going ONLINE: Start receiving Indiranagar orders
      setDeliveryOffers([
        {
          id: 'OFFER-1052',
          order_id: 'NV-1052',
          payout: 68,
          pickupsCount: 1,
          dropoffsCount: 1,
          totalDistance: '2.1 km',
          estTime: '18–22 min',
          shops: [{ name: 'Sole Street', readyIn: 'Ready now', distance: '0.4 km', item: 'Two-strap sandal (UK 7)' }],
          customer: { name: 'Meera N.', area: '12th Main, Indiranagar', distance: '1.7 km from shop' },
          secondsRemaining: 28
        },
        {
          id: 'OFFER-1051',
          order_id: 'NV-1051',
          payout: 76,
          pickupsCount: 2,
          dropoffsCount: 1,
          totalDistance: '2.8 km',
          estTime: '24–28 min',
          shops: [
            { name: 'Sole Street', readyIn: '2 min left', distance: '0.4 km', item: 'Canvas sneaker (UK 9)' },
            { name: 'Urban Trendz', readyIn: 'Ready now', distance: '0.6 km', item: 'Heavyweight Tee (L)' }
          ],
          customer: { name: 'Aditya K.', area: 'HAL 2nd Stage', distance: '1.8 km from hub' },
          secondsRemaining: 45
        }
      ]);
      showToast("You are now Online and accepting orders.");
    } else {
      // Going OFFLINE: Clear all incoming offers (offline riders cannot receive orders)
      setDeliveryOffers([]);
      showToast("Duty paused. You are now Offline.");
    }

    fetch('/api/partners/delivery/toggle-online', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+91 9876543210', is_online: nextState })
    }).catch(() => {});
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
        body: JSON.stringify({ order_id: offer.order_id, action: 'accept', rider_phone: '+91 9876543210' })
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
      body: JSON.stringify({ order_id: currOrderId, action: newStage === 'arrived_dropoff' ? 'reached_shop' : newStage, rider_phone: '+91 9876543210' })
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
        body: JSON.stringify({ order_id: currOrderId, action: 'deliver', otp: enteredPin, rider_phone: '+91 9876543210' })
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

    fetch('/api/partners/shop/toggle-open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+91 9876543210', is_open: nextState })
    }).catch(() => {});
  };

  const updateShopProfileData = (updatedFields) => {
    playClickSound();
    setShopProfile(prev => ({ ...prev, ...updatedFields }));
    showToast('Store settings saved successfully.');

    fetch('/api/partners/shop/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: '+91 9876543210', ...updatedFields })
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

  // Cart Calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  // Free delivery rule: ₹200 or more is FREE (0), below ₹200 is ₹39
  const cartDeliveryFee = (cart.length > 0 && cartSubtotal < 200) ? 39 : 0;
  const cartPlatformFee = cart.length > 0 ? 9 : 0;
  
  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'flat') {
      discountAmount = Math.min(appliedCoupon.value, cartSubtotal);
    } else if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((cartSubtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'freedel') {
      discountAmount = cartDeliveryFee;
    }
  }

  const cartTotal = Math.max(0, cartSubtotal + cartDeliveryFee + cartPlatformFee - discountAmount);
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Actions
  const addToCart = (product, size = 'UK 8', customShop = null) => {
    playAddSound();
    const shop = customShop || { name: product.shopName || 'Sole Street', id: product.shopId || 'sole-street' };
    const cartItemId = `cart-${shop.id}-${product.id || 'custom'}-${size}`;

    const baseSellerPrice = product.sellerPrice || (product.price ? Math.round(product.price / 1.10) : 100);
    const baseCommission = product.commission || (product.price ? (product.price - baseSellerPrice) : 10);
    const custPrice = product.price || (baseSellerPrice + baseCommission);

    setCart(prevCart => {
      const existing = prevCart.find(i => i.id === cartItemId || (i.productId === product.id && i.size === size));
      if (existing) {
        return prevCart.map(i => i === existing ? { ...i, quantity: i.quantity + 1 } : i);
      } else {
        const newItem = {
          id: cartItemId,
          productId: product.id || `nv-prod-${Date.now()}`,
          shopId: shop.id,
          shopName: shop.name,
          name: product.name,
          variant: `${product.color || 'Standard'} · ${size}`,
          size: size,
          sellerPrice: baseSellerPrice,
          commission: baseCommission,
          price: custPrice,
          originalPrice: product.originalPrice || (custPrice + 300),
          eta: product.deliveryTime || '12–18 min',
          stockNote: `${size} reserved at checkout · Local verified stock`,
          image: product.image || '/assets/figma/product_court_sneaker.png',
          quantity: 1
        };
        return [...prevCart, newItem];
      }
    });

    showToast(`Added ${product.name} (${size}) to your bag 🛍️`);
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

    const targetShopName = orderItems[0]?.shop || 'Sole Street';

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
      etaText: 'In 12–18 mins',
      etaMinutes: 14,
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

    // 2. Add directly to Seller's incoming orders (Kanban New column!)
    // Note: Seller gets 100% of their listed price (rawAmount / amount is sellerSubtotal)
    const sellerIncomingObj = {
      id: newOrderId,
      customer_name: custRecipient,
      customer_phone: custPhone,
      customer_address: custAddr,
      shopName: targetShopName,
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
    setCurrentScreen(screenId);
    if (['landing', 'seller-dash', 'seller-prods', 'seller-orders', 'seller-payouts', 'seller-profile', 'seller-reviews', 'seller-support', 'admin-overview', 'admin-sellers'].includes(screenId)) {
      setPlatformMode('web');
      try { localStorage.setItem('nivvo_platform_mode', 'web'); } catch {}
    } else if (screenId.startsWith('rider-')) {
      setPlatformMode('app');
      setAppMode('rider');
      try {
        localStorage.setItem('nivvo_platform_mode', 'app');
        localStorage.setItem('nivvo_app_mode', 'rider');
      } catch {}
    } else if (['home', 'categories', 'shops', 'shop-detail', 'sneakers', 'product-detail', 'bag', 'checkout', 'tracking', 'profile', 'grocery', 'food'].includes(screenId)) {
      setPlatformMode('app');
      setAppMode('customer');
      try {
        localStorage.setItem('nivvo_platform_mode', 'app');
        localStorage.setItem('nivvo_app_mode', 'customer');
      } catch {}
    }
    try {
      if (window.location.hash !== `#/${screenId}`) {
        window.location.hash = `#/${screenId}`;
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
      // Coupons
      appliedCoupon,
      applyCouponCode,
      removeCoupon,
      // Addresses
      savedAddresses,
      selectedAddress,
      setSelectedAddress,
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
