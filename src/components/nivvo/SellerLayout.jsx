import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  LayoutDashboard, Package, Boxes, Wallet, Store, Star, 
  ArrowUpRight, Bell, Menu, X, ArrowLeft, Check, AlertTriangle, 
  Phone, Clock, ShieldCheck, Sliders, Volume2, VolumeX, Printer, CheckCircle2, ChevronRight, Search, Headphones,
  Globe, ShoppingBag, LogOut, User
} from 'lucide-react';
import { playClickSound, playTrialSound, playAddSound } from '../../utils/audioEffects';

export default function SellerLayout({ 
  currentTab = 'overview', 
  breadcrumb = 'Overview', 
  onBack, 
  children,
  onTabChange
}) {
  const { 
    navigateTo, 
    shopProfile, 
    setShopProfile,
    toggleShopAvailability,
    showToast,
    currentUser,
    logoutUser
  } = useNivvo();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [availabilityModalOpen, setAvailabilityModalOpen] = useState(false);
  const [helpModalOpen, setHelpModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState('');
  const [soundAlerts, setSoundAlerts] = useState(true);
  const [currentTimeStr, setCurrentTimeStr] = useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false };
      setCurrentTimeStr(now.toLocaleDateString('en-GB', options) + ' IST');
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  const ownerInitials = (shopProfile?.owner_name || currentUser?.name || 'Rohan Sethi')
    .trim()
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'SS';

  const handleHeaderSearch = (e) => {
    e?.preventDefault();
    if (!headerSearch.trim()) return;
    const q = headerSearch.trim().toLowerCase();
    if (q.startsWith('nv-') || q.includes('order') || q.includes('1052') || q.includes('1051') || q.includes('1049') || q.includes('meera') || q.includes('aditya')) {
      navigateTo('seller-orders');
      showToast(`Navigated to incoming orders for "${headerSearch}"`);
    } else {
      navigateTo('seller-prods');
      showToast(`Searching products catalog for "${headerSearch}"`);
    }
    setHeaderSearch('');
  };

  const toggleSoundAlerts = () => {
    const next = !soundAlerts;
    setSoundAlerts(next);
    if (next) {
      playAddSound();
      showToast('Order sound chimes enabled');
    } else {
      showToast('Order sound chimes muted');
    }
  };

  // Live notifications state
  const [notifications, setNotifications] = useState([
    {
      id: 'notif-1',
      title: 'New incoming order NV-1052',
      detail: 'Meera N. ordered Two-strap leather sandal (UK 7). Target prep: 4–6 min.',
      time: '2 min ago',
      unread: true,
      type: 'order'
    },
    {
      id: 'notif-2',
      title: 'Low stock warning',
      detail: 'Cloud slide slipper (UK 8) has only 2 units remaining on shelf.',
      time: '18 min ago',
      unread: true,
      type: 'stock'
    },
    {
      id: 'notif-3',
      title: 'Daily settlement initiated',
      detail: '₹18,420 queued for transfer to ICICI Bank account **** 4812.',
      time: '1 hour ago',
      unread: true,
      type: 'payout'
    },
    {
      id: 'notif-4',
      title: 'New 5-star customer review',
      detail: 'Aarav S.: "Super fast delivery in 12 mins. The shoe fits like a glove!"',
      time: '2 hours ago',
      unread: false,
      type: 'review'
    }
  ]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => {
    playClickSound();
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
    showToast('All notifications marked as read');
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} strokeWidth={2} />, route: 'seller-dash' },
    { id: 'products', label: 'Products & stock', icon: <Boxes size={20} strokeWidth={2} />, route: 'seller-prods' },
    { id: 'orders', label: 'Incoming orders', icon: <Package size={20} strokeWidth={2} />, route: 'seller-orders' },
    { id: 'payouts', label: 'Payouts', icon: <Wallet size={20} strokeWidth={2} />, route: 'seller-payouts' },
    { id: 'profile', label: 'Store profile', icon: <Store size={20} strokeWidth={2} />, route: 'seller-profile' },
    { id: 'reviews', label: 'Reviews', icon: <Star size={20} strokeWidth={2} />, route: 'seller-reviews' },
    { id: 'support', label: 'Help & support', icon: <Headphones size={20} strokeWidth={2} />, route: 'seller-support' }
  ];

  const handleNavClick = (item) => {
    playClickSound();
    setMobileMenuOpen(false);
    if (item.route) {
      navigateTo(item.route);
    } else if (onTabChange) {
      onTabChange(item.tab);
    } else {
      navigateTo('seller-dash');
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#FAFBF8',
      color: '#14281C',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* ─── DESKTOP SIDEBAR (FIXED TO VIEWPORT) ─── */}
      <aside style={{
        width: '260px',
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #EAECE5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '24px 18px 20px',
        boxSizing: 'border-box',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        height: '100vh',
        zIndex: 50,
        overflowY: 'auto'
      }} className="nivvo-seller-desktop-sidebar">
        {/* Top Branding Lockup */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingLeft: '8px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#C6F432',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#14281C',
              boxShadow: '0 2px 6px rgba(198, 244, 50, 0.4)'
            }}>
              <ArrowUpRight size={20} strokeWidth={2.5} />
            </div>
            <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.03em', color: '#14281C' }}>
              nivvo
            </span>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '11px 16px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? '#E8EFE5' : 'transparent',
                    color: isActive ? '#14281C' : '#5A6553',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '14px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#F5F6F2';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ color: isActive ? '#14281C' : '#5A6553', display: 'flex', alignItems: 'center' }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Store Status & Settings */}
        <div style={{ paddingTop: '16px' }}>
          {/* Store Card in Figma */}
          <div style={{
            backgroundColor: '#F7F8F4',
            border: '1px solid #EAECE5',
            borderRadius: '14px',
            padding: '14px 16px',
            marginBottom: '14px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#14281C' }}>
              {shopProfile.shop_name || 'Sole Street'}
            </div>
            <div style={{ fontSize: '12px', color: '#667061', marginTop: '2px', marginBottom: '10px' }}>
              {shopProfile.locality || 'Indiranagar'} · SS-018
            </div>

            <button
              onClick={() => {
                playClickSound();
                setAvailabilityModalOpen(true);
              }}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                padding: '7px 12px',
                borderRadius: '999px',
                border: '1px solid #E2E5DC',
                backgroundColor: shopProfile.is_open ? '#EDFDF0' : '#FEF2F2',
                color: shopProfile.is_open ? '#15803D' : '#DC2626',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: shopProfile.is_open ? '#16A34A' : '#EF4444'
              }} />
              <span>{shopProfile.is_open ? 'Store accepting orders' : 'Store paused'}</span>
            </button>
          </div>

          {/* Settings & Logout Links */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
            <button
              onClick={() => {
                playClickSound();
                setSettingsModalOpen(true);
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px 0',
                fontSize: '13px',
                color: '#5A6553',
                cursor: 'pointer',
                textAlign: 'left',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sliders size={14} />
              <span>Settings</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                logoutUser();
              }}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px 0',
                fontSize: '13px',
                color: '#DC2626',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                fontWeight: 600
              }}
              title="Log out of seller account"
            >
              <LogOut size={13} color="#DC2626" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div 
        className="nivvo-seller-main-wrapper"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          backgroundColor: '#FAFBF8',
          minHeight: '100vh',
          marginLeft: '260px'
        }}
      >
        {/* Top Header Bar matching Figma */}
        <header style={{
          height: '68px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #EAECE5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 36px',
          position: 'sticky',
          top: 0,
          zIndex: 40
        }}>
          {/* Breadcrumb */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nivvo-seller-mobile-toggle"
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                color: '#14281C'
              }}
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {onBack && (
              <button 
                onClick={onBack}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#56634F',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  marginRight: '4px'
                }}
              >
                <ArrowLeft size={18} />
                <span>Back</span>
              </button>
            )}

            <span style={{ fontSize: '14px', color: '#56634F', fontWeight: 500 }}>Seller Portal</span>
            <span style={{ fontSize: '14px', color: '#A3ACA0' }}>/</span>
            <span style={{ fontSize: '14px', color: '#14281C', fontWeight: 700 }}>{breadcrumb}</span>
          </div>

          {/* Middle: Quick Search for Orders / Products */}
          <form 
            onSubmit={handleHeaderSearch}
            style={{
              position: 'relative',
              maxWidth: '320px',
              width: '100%',
              margin: '0 20px',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Search size={15} color="#667061" style={{ position: 'absolute', left: '12px', pointerEvents: 'none' }} />
            <input 
              type="text"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              placeholder="Search order #NV- or SKU catalog..."
              style={{
                width: '100%',
                padding: '8px 14px 8px 36px',
                borderRadius: '10px',
                border: '1px solid #D8DCD2',
                backgroundColor: '#F7F8F4',
                fontSize: '13px',
                color: '#14281C',
                outline: 'none',
                transition: 'all 0.15s ease'
              }}
              onFocus={(e) => {
                e.target.style.backgroundColor = '#FFFFFF';
                e.target.style.borderColor = '#1E3827';
                e.target.style.boxShadow = '0 0 0 2px rgba(30, 56, 39, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.backgroundColor = '#F7F8F4';
                e.target.style.borderColor = '#D8DCD2';
                e.target.style.boxShadow = 'none';
              }}
            />
          </form>

          {/* Right Header Status, Date, Notification & Avatar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', position: 'relative' }}>
            {/* Quick Live Store Status Pill */}
            <button
              onClick={() => {
                playClickSound();
                toggleShopAvailability();
              }}
              title="Click to toggle Store Live / Paused"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px',
                padding: '7px 14px',
                borderRadius: '999px',
                border: shopProfile.is_open ? '1px solid #B8E6B8' : '1px solid #FCA5A5',
                backgroundColor: shopProfile.is_open ? '#EDFDF0' : '#FEF2F2',
                color: shopProfile.is_open ? '#15803D' : '#DC2626',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.02em',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <span style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: shopProfile.is_open ? '#16A34A' : '#EF4444'
              }} />
              <span>{shopProfile.is_open ? 'STORE LIVE' : 'STORE PAUSED'}</span>
            </button>

            {/* Audio Alerts Button */}
            <button
              onClick={toggleSoundAlerts}
              title={`Order sound alert chimes: ${soundAlerts ? 'ON (Click to mute)' : 'MUTED (Click to enable)'}`}
              style={{
                background: 'none',
                border: '1px solid #E2E5DC',
                borderRadius: '9px',
                padding: '7px 12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: soundAlerts ? '#15803D' : '#5A6553',
                backgroundColor: soundAlerts ? '#F0FDF4' : '#FFFFFF',
                transition: 'all 0.15s ease'
              }}
            >
              {soundAlerts ? <Volume2 size={15} color="#15803D" /> : <VolumeX size={15} color="#8A9285" />}
              <span>{soundAlerts ? 'Chimes ON' : 'Muted'}</span>
            </button>

            <span style={{ fontSize: '13px', color: '#56634F', fontWeight: 500 }} className="nivvo-seller-desktop-time">
              {currentTimeStr}
            </span>

            {/* Notifications Bell with Popover */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  playClickSound();
                  setNotificationsOpen(!notificationsOpen);
                }}
                style={{
                  background: 'none',
                  border: '1px solid #E5E7DE',
                  borderRadius: '9px',
                  cursor: 'pointer',
                  color: '#20251F',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '7px',
                  backgroundColor: notificationsOpen ? '#EFF3ED' : '#FFFFFF',
                  transition: 'background-color 0.15s ease'
                }}
                aria-label="Notifications"
              >
                <Bell size={19} strokeWidth={2} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-2px',
                    right: '-2px',
                    width: '9px',
                    height: '9px',
                    borderRadius: '50%',
                    backgroundColor: '#DC2626',
                    border: '2px solid #FFFFFF'
                  }} />
                )}
              </button>

              {notificationsOpen && (
                <div style={{
                  position: 'absolute',
                  top: '125%',
                  right: 0,
                  width: '360px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '16px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
                  border: '1px solid #EAECE5',
                  zIndex: 100,
                  overflow: 'hidden'
                }}>
                  <div style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #F0F2ED',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#FAFBF8'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 700, color: '#14281C' }}>Notifications</span>
                      {unreadCount > 0 && (
                        <span style={{
                          backgroundColor: '#1E3827',
                          color: '#FFFFFF',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '999px'
                        }}>
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#15803D',
                          cursor: 'pointer',
                          padding: 0
                        }}
                      >
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          playClickSound();
                          setNotifications(prev => prev.map(item => item.id === n.id ? { ...item, unread: false } : item));
                          if (n.type === 'order') navigateTo('seller-orders');
                          if (n.type === 'stock') navigateTo('seller-prods');
                          setNotificationsOpen(false);
                        }}
                        style={{
                          padding: '14px 20px',
                          borderBottom: '1px solid #F0F2ED',
                          backgroundColor: n.unread ? '#FAFBF8' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F4F6F1'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.unread ? '#FAFBF8' : '#FFFFFF'}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3px' }}>
                          <span style={{ fontSize: '14px', fontWeight: n.unread ? 700 : 600, color: '#14281C' }}>
                            {n.title}
                          </span>
                          <span style={{ fontSize: '11px', color: '#73796F' }}>{n.time}</span>
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#56634F', lineHeight: '1.45' }}>
                          {n.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Store Owner Avatar with Account Menu */}
            <div style={{ position: 'relative' }}>
              <div 
                onClick={() => {
                  playClickSound();
                  setUserMenuOpen(!userMenuOpen);
                }}
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#1E3827',
                  color: '#C6F432',
                  fontSize: '13px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.15s ease'
                }} 
                title={`${shopProfile.owner_name || 'Owner'} (${shopProfile.shop_name || 'Store'}) - Account Menu`}
              >
                {ownerInitials}
              </div>

              {userMenuOpen && (
                <div style={{
                  position: 'absolute',
                  top: '125%',
                  right: 0,
                  width: '240px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '14px',
                  boxShadow: '0 16px 40px rgba(0,0,0,0.14)',
                  border: '1px solid #EAECE5',
                  zIndex: 100,
                  padding: '12px 0'
                }}>
                  {/* User Profile Header */}
                  <div style={{ padding: '4px 16px 12px', borderBottom: '1px solid #F0F2ED' }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#14281C' }}>
                      {shopProfile.owner_name || currentUser?.name || 'Rohan Sethi'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#687163', marginTop: '2px' }}>
                      {shopProfile.shop_name || 'Sole Street'} · Seller
                    </div>
                  </div>

                  {/* Menu Options */}
                  <div style={{ padding: '6px 0' }}>
                    <button
                      onClick={() => {
                        playClickSound();
                        setUserMenuOpen(false);
                        navigateTo('seller-profile');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#14281C',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F6F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Store size={15} color="#5A6553" />
                      <span>Store Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        playClickSound();
                        setUserMenuOpen(false);
                        setSettingsModalOpen(true);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#14281C',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F6F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Sliders size={15} color="#5A6553" />
                      <span>Store Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        playClickSound();
                        setUserMenuOpen(false);
                        navigateTo('home');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#14281C',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F6F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ArrowUpRight size={15} color="#5A6553" />
                      <span>Customer Storefront</span>
                    </button>
                  </div>

                  {/* Log Out Button */}
                  <div style={{ borderTop: '1px solid #F0F2ED', paddingTop: '6px' }}>
                    <button
                      onClick={() => {
                        playClickSound();
                        setUserMenuOpen(false);
                        logoutUser();
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        background: 'none',
                        border: 'none',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#DC2626',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF2F2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut size={15} color="#DC2626" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="nivvo-seller-main-content" style={{
          flex: 1,
          maxWidth: '1440px',
          width: '100%',
          boxSizing: 'border-box',
          margin: '0 auto'
        }}>
          {children}
        </main>
      </div>

      {/* ─── MOBILE DRAWER (SLIDE-OUT FROM LEFT) ─── */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20,40,28,0.5)',
            backdropFilter: 'blur(4px)',
            zIndex: 1000,
            display: 'flex'
          }}
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '280px',
              maxWidth: '85%',
              height: '100%',
              backgroundColor: '#FFFFFF',
              boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '24px 18px',
              overflowY: 'auto'
            }}
          >
            <div>
              {/* Brand Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '10px',
                    backgroundColor: '#C6F432',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#14281C'
                  }}>
                    <ArrowUpRight size={20} strokeWidth={2.5} />
                  </div>
                  <span style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.03em', color: '#14281C' }}>
                    nivvo
                  </span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  style={{ background: 'none', border: 'none', padding: '8px', cursor: 'pointer', color: '#14281C' }}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>

              {/* Navigation Links */}
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {navItems.map((item) => {
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        width: '100%',
                        padding: '12px 16px',
                        borderRadius: '10px',
                        border: 'none',
                        backgroundColor: isActive ? '#E8EFE5' : 'transparent',
                        color: isActive ? '#14281C' : '#5A6553',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '15px',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ color: isActive ? '#14281C' : '#5A6553' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Drawer Store Card */}
            <div style={{ paddingTop: '18px', borderTop: '1px solid #EAECE5' }}>
              <div style={{
                backgroundColor: '#F7F8F4',
                border: '1px solid #EAECE5',
                borderRadius: '14px',
                padding: '14px 16px',
                marginBottom: '12px'
              }}>
                <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>
                  {shopProfile.shop_name || 'Sole Street'}
                </div>
                <div style={{ fontSize: '12px', color: '#667061', marginTop: '3px', marginBottom: '10px' }}>
                  {shopProfile.locality || 'Indiranagar'} · SS-018
                </div>
                <button
                  onClick={() => {
                    toggleShopAvailability();
                  }}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '999px',
                    border: '1px solid #E2E5DC',
                    backgroundColor: shopProfile.is_open ? '#EDFDF0' : '#FEF2F2',
                    color: shopProfile.is_open ? '#15803D' : '#DC2626',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <span style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: shopProfile.is_open ? '#15803D' : '#DC2626'
                  }} />
                  <span>{shopProfile.is_open ? 'Store Accepting Orders' : 'Store Paused'}</span>
                </button>
              </div>

              {/* Mobile Drawer Settings & Logout */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 4px' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSettingsModalOpen(true);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px 0',
                    fontSize: '13px',
                    color: '#5A6553',
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Sliders size={14} />
                  <span>Settings</span>
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logoutUser();
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '6px 0',
                    fontSize: '13px',
                    color: '#DC2626',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontWeight: 600
                  }}
                >
                  <LogOut size={13} color="#DC2626" />
                  <span>Log out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── 1. STORE AVAILABILITY MODAL ─── */}
      {availabilityModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20,40,28,0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '460px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#14281C' }}>
                Manage Store Availability
              </h3>
              <button 
                onClick={() => setAvailabilityModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#5A6553', margin: '0 0 20px 0', lineHeight: 1.5 }}>
              Controls whether customers can place 10-minute instant delivery orders from Sole Street Indiranagar.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div 
                onClick={() => {
                  playTrialSound();
                  setShopProfile(p => ({ ...p, is_open: true }));
                  setAvailabilityModalOpen(false);
                  showToast('Store is live. Accepting orders.');
                }}
                style={{
                  border: shopProfile.is_open ? '1.5px solid #1C7532' : '1px solid #EAECE5',
                  backgroundColor: shopProfile.is_open ? '#F2FAF4' : '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#1C7532' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C' }}>Accepting Orders (Normal)</div>
                  <div style={{ fontSize: '12px', color: '#5A6553' }}>Live on Nivvo app · Dispatch under 6 mins</div>
                </div>
                {shopProfile.is_open && <Check size={16} color="#1C7532" />}
              </div>

              <div 
                onClick={() => {
                  playTrialSound();
                  setShopProfile(p => ({ ...p, is_open: true }));
                  setAvailabilityModalOpen(false);
                  showToast('Rush buffer active: +5 min added to preparation time');
                }}
                style={{
                  border: '1px solid #EAECE5',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#E6A23C' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C' }}>Rush Buffer (+5 min)</div>
                  <div style={{ fontSize: '12px', color: '#5A6553' }}>Counter busy · Automatically informs riders & customers</div>
                </div>
              </div>

              <div 
                onClick={() => {
                  playTrialSound();
                  setShopProfile(p => ({ ...p, is_open: false }));
                  setAvailabilityModalOpen(false);
                  showToast('Store paused. No new orders will arrive.');
                }}
                style={{
                  border: !shopProfile.is_open ? '1.5px solid #C92A2A' : '1px solid #EAECE5',
                  backgroundColor: !shopProfile.is_open ? '#FDF2F2' : '#FFFFFF',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}
              >
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#C92A2A' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C' }}>Pause Store (Offline)</div>
                  <div style={{ fontSize: '12px', color: '#5A6553' }}>Temporarily closed for inventory count or restock</div>
                </div>
                {!shopProfile.is_open && <Check size={16} color="#C92A2A" />}
              </div>
            </div>

            <button
              onClick={() => setAvailabilityModalOpen(false)}
              style={{
                width: '100%',
                padding: '11px',
                backgroundColor: '#1E3827',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ─── 2. STORE OWNER PROFILE MODAL ─── */}
      {profileModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20,40,28,0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '520px',
            padding: '26px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#1E2D24',
                  color: '#FFFFFF',
                  fontSize: '18px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  RS
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#14281C' }}>
                    Rohan Sethi
                  </h3>
                  <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '2px' }}>
                    Sole Street · SS-018 · Indiranagar, Bengaluru
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setProfileModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{
              backgroundColor: '#FAFBF8',
              border: '1px solid #ECEEE7',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '10px' }}>
                Business Compliance & KYC
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#1C7532' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>GSTIN Verified: 29AABCU9603R1ZM (GST e-Invoice active)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>Owner Aadhaar & PAN KYC approved</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={15} />
                  <span>Settlement Bank: ICICI Bank **** 4812 (UPI: solestreet@icici)</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px', fontSize: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '10px', backgroundColor: '#F5F6F2', borderRadius: '8px' }}>
                <span style={{ color: '#73796F' }}>Store Hours</span>
                <div style={{ fontWeight: 700, color: '#14281C', marginTop: '2px' }}>08:00 AM – 11:30 PM</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#F5F6F2', borderRadius: '8px' }}>
                <span style={{ color: '#73796F' }}>SLA Target</span>
                <div style={{ fontWeight: 700, color: '#14281C', marginTop: '2px' }}>4–6 min dispatch</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#F5F6F2', borderRadius: '8px' }}>
                <span style={{ color: '#73796F' }}>Contact Number</span>
                <div style={{ fontWeight: 700, color: '#14281C', marginTop: '2px' }}>+91 98765 43210</div>
              </div>
              <div style={{ padding: '10px', backgroundColor: '#F5F6F2', borderRadius: '8px' }}>
                <span style={{ color: '#73796F' }}>Settlement Cycle</span>
                <div style={{ fontWeight: 700, color: '#14281C', marginTop: '2px' }}>Daily T+1 Instant</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  navigateTo('seller-prods');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E5DC',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#14281C',
                  cursor: 'pointer'
                }}
              >
                Manage Catalog
              </button>
              <button
                onClick={() => {
                  setProfileModalOpen(false);
                  showToast('Profile settings saved');
                }}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#1E3827',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. HELP CENTRE MODAL ─── */}
      {helpModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20,40,28,0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '540px',
            padding: '26px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#14281C' }}>
                Seller Help Centre & Partner Desk
              </h3>
              <button 
                onClick={() => setHelpModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '22px' }}>
              <div style={{ padding: '12px 16px', backgroundColor: '#F8F9F5', borderRadius: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C', marginBottom: '4px' }}>
                  How does 10-minute dispatch work?
                </div>
                <div style={{ fontSize: '12px', color: '#5A6553', lineHeight: '1.4' }}>
                  Keep your inventory accurate. When an order arrives, you have ~2 minutes to accept and pack. The rider arrives within 4 minutes to pick up.
                </div>
              </div>

              <div style={{ padding: '12px 16px', backgroundColor: '#F8F9F5', borderRadius: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C', marginBottom: '4px' }}>
                  Doorstep Try-On Returns
                </div>
                <div style={{ fontSize: '12px', color: '#5A6553', lineHeight: '1.4' }}>
                  If the customer tries 2 sizes and returns one, the rider brings the trial pair back to your counter in a sealed tamper pouch for instant restock.
                </div>
              </div>

              <div style={{ padding: '12px 16px', backgroundColor: '#F8F9F5', borderRadius: '10px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C', marginBottom: '4px' }}>
                  Settlement & Payout Timeline
                </div>
                <div style={{ fontSize: '12px', color: '#5A6553', lineHeight: '1.4' }}>
                  Net sales are disbursed automatically every morning via IMPS directly into Sole Street’s linked ICICI settlement account.
                </div>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              backgroundColor: '#EFF5EE',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>Indiranagar Merchant Helpline</div>
                <div style={{ fontSize: '12px', color: '#1C7532' }}>Direct line to Hub Dispatch Controller</div>
              </div>
              <button
                onClick={() => showToast('Calling Indiranagar Hub Controller (+91 80 4912 8820)...')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#1E3827',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Phone size={13} />
                <span>Call Hub</span>
              </button>
            </div>

            <button
              onClick={() => setHelpModalOpen(false)}
              style={{
                width: '100%',
                padding: '11px',
                backgroundColor: '#1E3827',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ─── 4. SETTINGS MODAL ─── */}
      {settingsModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20,40,28,0.4)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '480px',
            padding: '26px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#14281C' }}>
                Store Preferences & Automation
              </h3>
              <button 
                onClick={() => setSettingsModalOpen(false)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>Sound alert on incoming order</div>
                  <div style={{ fontSize: '11px', color: '#73796F' }}>Plays high-priority chime until accepted</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#1E3827', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>Auto-print Kitchen/Packing KOT</div>
                  <div style={{ fontSize: '11px', color: '#73796F' }}>Sends order slip to Bluetooth thermal printer</div>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#1E3827', cursor: 'pointer' }} />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>Low-stock alert threshold</div>
                  <div style={{ fontSize: '11px', color: '#73796F' }}>Warns when size stock drops below</div>
                </div>
                <select style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #E5E7DE', fontSize: '12px', fontWeight: 600 }}>
                  <option>2 units</option>
                  <option>3 units</option>
                  <option>5 units</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>Target preparation time</div>
                  <div style={{ fontSize: '11px', color: '#73796F' }}>Standard SLA promised to Indiranagar buyers</div>
                </div>
                <select style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #E5E7DE', fontSize: '12px', fontWeight: 600 }}>
                  <option>4–6 min (Recommended)</option>
                  <option>3–5 min (Fast Counter)</option>
                  <option>6–8 min (Complex apparel)</option>
                </select>
              </div>
            </div>

            <button
              onClick={() => {
                setSettingsModalOpen(false);
                playTrialSound();
                showToast('Store settings updated successfully.');
              }}
              style={{
                width: '100%',
                padding: '11px',
                backgroundColor: '#1E3827',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              Save Preferences
            </button>

            <div style={{ borderTop: '1px solid #ECEEE7', paddingTop: '12px' }}>
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setSettingsModalOpen(false);
                  logoutUser();
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#FEF2F2',
                  color: '#DC2626',
                  border: '1px solid #FCA5A5',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <LogOut size={15} />
                <span>Log Out of Seller Account</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .nivvo-seller-desktop-sidebar {
            display: none !important;
          }
          .nivvo-seller-main-wrapper {
            margin-left: 0 !important;
          }
          .nivvo-seller-mobile-toggle {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .nivvo-seller-desktop-time {
            display: none !important;
          }
          .nivvo-seller-main-content {
            padding: 16px 14px 40px !important;
          }
        }
        @media (min-width: 901px) {
          .nivvo-seller-desktop-sidebar {
            display: flex !important;
          }
          .nivvo-seller-main-wrapper {
            margin-left: 260px !important;
          }
          .nivvo-seller-mobile-toggle {
            display: none !important;
          }
          .nivvo-seller-desktop-time {
            display: inline-block !important;
          }
          .nivvo-seller-main-content {
            padding: 24px 36px 48px !important;
          }
        }
        @media (max-width: 640px) {
          form[style*="maxWidth: 260px"] {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
