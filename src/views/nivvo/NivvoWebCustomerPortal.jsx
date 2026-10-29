import React, { useState } from 'react';
import '../../styles/customer-portal.css';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  User, MapPin, Package, CreditCard, HelpCircle, 
  ChevronRight, ArrowLeft, Plus, Trash2, Edit3, Check, Phone, 
  Mail, Bell, ShieldCheck, FileText, Sparkles, Volume2, 
  MessageSquare, AlertCircle, X, Heart, Star, Lock, Download, 
  LogOut, CheckCircle, RefreshCw, ShoppingBag, LayoutDashboard,
  Search, ArrowUpRight, Clock, Sliders, ExternalLink, QrCode, Store
} from 'lucide-react';
import { playClickSound, playTrialSound, playAddSound } from '../../utils/audioEffects';
import { downloadReceiptPdf } from '../../utils/receiptGenerator';

export default function NivvoWebCustomerPortal({ onBack }) {
  const { 
    selectedAddress, 
    setSelectedAddress, 
    savedAddresses = [], 
    orders = [], 
    activeOrder,
    navigateTo, 
    showToast,
    addToCart,
    totalCartCount = 0,
    wishlist = [],
    toggleWishlist,
    notifications = [],
    unreadNotificationCount = 0,
    markAllNotificationsRead,
    clearNotification,
    currentUser,
    logoutUser,
    allProducts = []
  } = useNivvo();

  // Active Navigation Tab
  const [activeTab, setActiveTab] = useState('overview'); 
  // 'overview' | 'orders' | 'addresses' | 'wallet' | 'wishlist' | 'size-locker' | 'notifications' | 'support' | 'security'

  // User Profile State
  const [profile, setProfile] = useState({
    name: currentUser?.name || 'Aarav Shah',
    email: currentUser?.email || 'aarav.shah@okaxis',
    phone: currentUser?.phone || '+91 98765 43210',
    memberSince: 'October 2024',
    tier: 'Indiranagar Club VIP',
    soundEnabled: true,
    whatsappUpdates: true,
    twoFactorAuth: true,
    topSize: 'M',
    bottomSize: '32',
    shoeSize: 'UK 9',
    autoTrialPairing: true
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  // Address State
  const [addresses, setAddresses] = useState([
    ...(savedAddresses.length > 0 ? savedAddresses : [
      {
        id: 'addr-home',
        tag: 'Home',
        title: 'Home · Indiranagar',
        area: 'Indiranagar',
        street: '#402, Green Glen Terraces, 12th Main Road, HAL 2nd Stage',
        city: 'Bengaluru 560038',
        phone: '+91 98765 43210',
        recipient: 'Aarav Shah',
        note: 'Ring bell twice. Leave package at doorstep if not answering.',
        isDefault: true
      },
      {
        id: 'addr-work',
        tag: 'Work',
        title: 'Tech Park Office',
        area: 'Koramangala',
        street: 'WeWork Galaxy, 43 Residency Road, 3rd Floor',
        city: 'Bengaluru 560025',
        phone: '+91 98765 43210',
        recipient: 'Aarav Shah (Desk 304)',
        note: 'Deliver to 3rd floor reception lobby.',
        isDefault: false
      }
    ]),
    {
      id: 'addr-gym',
      tag: 'Other',
      title: 'Fitness First · Indiranagar',
      area: 'Indiranagar',
      street: '100ft Road, 2nd Stage, Above Third Wave Coffee',
      city: 'Bengaluru 560038',
      phone: '+91 98765 43210',
      recipient: 'Aarav Shah',
      note: 'Leave at front desk with security.',
      isDefault: false
    }
  ]);

  const [showAddAddrModal, setShowAddAddrModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    tag: 'Home',
    title: '',
    street: '',
    area: 'Indiranagar',
    city: 'Bengaluru 560038',
    note: ''
  });

  // Wallet State
  const [walletBalance, setWalletBalance] = useState(250.00);
  const [walletTransactions, setWalletTransactions] = useState([
    { id: 'tx-1', type: 'credit', desc: '10-Min Doorstep Trial Cashback', amount: 50.00, date: 'Today, 2:30 PM' },
    { id: 'tx-2', type: 'debit', desc: 'Order #NV-982411 Payment', amount: 1299.00, date: '28 Oct 2026' },
    { id: 'tx-3', type: 'credit', desc: 'Welcome Bonus · Indiranagar Club', amount: 200.00, date: '15 Oct 2026' }
  ]);

  // Support State
  const [supportTickets, setSupportTickets] = useState([
    { id: 'TCK-8921', category: '2-Size Trial', subject: 'Exchange Size M to Size L', status: 'Resolved', date: '26 Oct 2026' },
    { id: 'TCK-7712', category: 'Grocery Freshness', subject: 'Hydroponic Spinach Cold Chain Query', status: 'Answered', date: '21 Oct 2026' }
  ]);
  const [ticketForm, setTicketForm] = useState({ category: 'Delivery Speed & Tracking', subject: '', message: '' });
  const [activeFaq, setActiveFaq] = useState(0);

  // Orders State (Enhanced default mock if context is empty)
  const displayOrders = orders.length > 0 ? orders : [
    {
      id: 'NV-982411',
      date: 'Today, 2:15 PM',
      status: 'Out for 10-Min Delivery',
      isLive: true,
      eta: '6 mins',
      riderName: 'Rahul Sharma',
      riderRating: '4.9 ★',
      otp: '7492',
      darkStore: 'Indiranagar Hub #04',
      items: [
        { title: 'Oversized Heavyweight Tee', size: 'L (Trial Pair: M)', price: 1299, qty: 1, img: '/assets/figma/db4d35b4e6157c2baa3cae5926027493ad3575b4.png' },
        { title: 'Artisan Sourdough Loaf', size: 'Fresh 500g', price: 180, qty: 1, img: '/assets/figma/cat_food.png' }
      ],
      total: 1479
    },
    {
      id: 'NV-910284',
      date: '27 Oct 2026, 6:40 PM',
      status: 'Delivered (Doorstep Trial Kept UK 9)',
      isLive: false,
      riderName: 'Vikram Gowda',
      riderRating: '4.8 ★',
      darkStore: 'Koramangala Hub #02',
      items: [
        { title: 'Weekend Suede Low-Tops', size: 'UK 9 (Handed back UK 8)', price: 2899, qty: 1, img: '/assets/figma/product_lowtop_sneaker.png' }
      ],
      total: 2899
    },
    {
      id: 'NV-884019',
      date: '22 Oct 2026, 11:20 AM',
      status: 'Delivered in 8 mins',
      isLive: false,
      riderName: 'Sunil Kumar',
      riderRating: '4.9 ★',
      darkStore: 'HSR Sector 2 Hub',
      items: [
        { title: 'Cold-Pressed Valencia Orange Juice', size: '1 Litre', price: 220, qty: 2, img: '/assets/figma/cat_grocery.png' }
      ],
      total: 440
    }
  ];

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setProfile({ ...editForm });
    setIsEditingProfile(false);
    playClickSound();
    showToast('Profile information updated successfully!');
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.title || !newAddr.street) {
      showToast('Please provide an address title and street address.');
      return;
    }
    const created = {
      id: `addr-${Date.now()}`,
      ...newAddr,
      recipient: profile.name,
      phone: profile.phone,
      isDefault: addresses.length === 0
    };
    setAddresses([...addresses, created]);
    setShowAddAddrModal(false);
    setNewAddr({ tag: 'Home', title: '', street: '', area: 'Indiranagar', city: 'Bengaluru 560038', note: '' });
    playAddSound();
    showToast('New delivery address saved!');
  };

  const handleDeleteAddress = (id) => {
    playClickSound();
    setAddresses(addresses.filter(a => a.id !== id));
    showToast('Address removed.');
  };

  const handleSetDefaultAddress = (addr) => {
    playClickSound();
    setAddresses(addresses.map(a => ({ ...a, isDefault: a.id === addr.id })));
    if (setSelectedAddress) {
      setSelectedAddress(addr);
    }
    showToast(`Set "${addr.title}" as your default delivery address.`);
  };

  const handleAddWalletMoney = (amt) => {
    playTrialSound();
    setWalletBalance(prev => prev + amt);
    setWalletTransactions([
      { id: `tx-${Date.now()}`, type: 'credit', desc: 'Instant UPI Top-Up', amount: amt, date: 'Just now' },
      ...walletTransactions
    ]);
    showToast(`₹${amt} added to your Nivvo Wallet!`);
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (!ticketForm.subject.trim()) {
      showToast('Please enter a ticket subject.');
      return;
    }
    const newTck = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      category: ticketForm.category,
      subject: ticketForm.subject,
      status: 'Open (Avg. resolution 3 min)',
      date: 'Just now'
    };
    setSupportTickets([newTck, ...supportTickets]);
    setTicketForm({ category: 'Delivery Speed & Tracking', subject: '', message: '' });
    playAddSound();
    showToast(`Ticket ${newTck.id} created! Our Indiranagar desk is on it.`);
  };

  const initials = profile.name
    .split(' ')
    .filter(Boolean)
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || 'AS';

  const faqs = [
    { q: 'How does the Doorstep 2-Size Trial work on the website?', a: 'When you order eligible shoes or apparel, your rider automatically brings your primary size and an adjacent size. The rider waits outside for 2-3 minutes while you try them on, you keep what fits, and hand back the second piece with zero return paperwork.' },
    { q: 'What is the delivery radius for 10-minute dispatch?', a: 'All items are dispatched strictly from verified stores, dark kitchens, and cold mandis within a 2.5 km radius of your location, guaranteeing speed without road safety risks.' },
    { q: 'How can I download my GST tax invoice?', a: 'Go to your Orders tab and click "Download Tax Invoice (PDF)" next to any completed order. A compliant PDF receipt with full item breakdowns and GST registration is generated instantly.' },
    { q: 'Is my Nivvo Wallet balance refundable?', a: 'Yes. Any unused wallet balance can be withdrawn to your original UPI ID or bank account anytime from the Wallet & Payments tab.' }
  ];

  return (
    <div className="nivvo-cust-portal">
      {/* ── Top Bar ── */}
      <header className="nivvo-cust-topbar">
        <div className="nivvo-cust-brand" onClick={() => { playClickSound(); onBack ? onBack() : navigateTo('landing'); }}>
          <div className="nivvo-cust-logo-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor">
              <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
            </svg>
          </div>
          <span className="nivvo-cust-brand-name">nivvo</span>
          <div className="nivvo-cust-breadcrumb">
            <span>Marketplace</span>
            <ChevronRight size={14} />
            <span>Customer Account</span>
            <ChevronRight size={14} />
            <span className="current">
              {activeTab === 'overview' && 'Overview'}
              {activeTab === 'orders' && 'Orders & 2-Size Trials'}
              {activeTab === 'addresses' && 'Saved Addresses'}
              {activeTab === 'wallet' && 'Wallet & Cashback'}
              {activeTab === 'wishlist' && 'Saved Finds'}
              {activeTab === 'size-locker' && 'AI Size Locker'}
              {activeTab === 'notifications' && 'Notifications'}
              {activeTab === 'support' && 'Resolution Desk'}
              {activeTab === 'security' && 'Security & Settings'}
            </span>
          </div>
        </div>

        <div className="nivvo-cust-topbar-actions">
          {currentUser?.role === 'seller' && (
            <button
              type="button"
              className="nivvo-cust-seller-switch-btn"
              onClick={() => { playClickSound(); navigateTo('seller-dash'); }}
              style={{
                backgroundColor: '#FFFBEB',
                color: '#B45309',
                border: '1px solid #FDE68A',
                borderRadius: '8px',
                padding: '7px 12px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
              title="Open your Merchant Seller Dashboard"
            >
              <Store size={14} />
              <span>Seller Hub ↗</span>
            </button>
          )}

          <button 
            type="button"
            className="nivvo-cust-back-btn" 
            onClick={() => { playClickSound(); onBack ? onBack() : navigateTo('landing'); }}
          >
            <ArrowLeft size={15} />
            <span>Back to Storefront</span>
          </button>

          {totalCartCount > 0 && (
            <button 
              type="button"
              className="nivvo-cust-cart-badge-btn"
              onClick={() => { playClickSound(); navigateTo('bag'); }}
            >
              <ShoppingBag size={15} />
              <span>Bag</span>
              <span className="nivvo-cust-cart-count">{totalCartCount}</span>
            </button>
          )}
        </div>
      </header>

      {/* ── Layout Grid (Sidebar + Main Content) ── */}
      <div className="nivvo-cust-layout">

        {/* ── Left Sidebar ── */}
        <aside className="nivvo-cust-sidebar">
          {/* User Profile Card */}
          <div className="nivvo-cust-user-card">
            <div className="nivvo-cust-avatar-wrapper">
              <div className="nivvo-cust-avatar">{initials}</div>
              <div className="nivvo-cust-vip-badge" title="VIP Prime Member">
                <Star size={13} fill="#FFFFFF" />
              </div>
            </div>

            <h3 className="nivvo-cust-user-name">{profile.name}</h3>
            <p className="nivvo-cust-user-contact">{profile.phone}<br />{profile.email}</p>

            <span className="nivvo-cust-tier-pill">
              <ShieldCheck size={12} />
              <span>{profile.tier}</span>
            </span>
          </div>

          {/* Navigation Links Card */}
          <nav className="nivvo-cust-nav-card" aria-label="Customer Account Navigation">
            <button 
              type="button"
              className={`nivvo-cust-nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('overview'); }}
            >
              <div className="nivvo-cust-nav-item-left">
                <LayoutDashboard size={17} className="nivvo-cust-nav-icon" />
                <span>Account Overview</span>
              </div>
            </button>

            <button 
              type="button"
              className={`nivvo-cust-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('orders'); }}
            >
              <div className="nivvo-cust-nav-item-left">
                <Package size={17} className="nivvo-cust-nav-icon" />
                <span>Orders &amp; Trials</span>
              </div>
              <span className="nivvo-cust-nav-badge">{displayOrders.length}</span>
            </button>

            <button 
              type="button"
              className={`nivvo-cust-nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('addresses'); }}
            >
              <div className="nivvo-cust-nav-item-left">
                <MapPin size={17} className="nivvo-cust-nav-icon" />
                <span>Saved Addresses</span>
              </div>
              <span className="nivvo-cust-nav-badge">{addresses.length}</span>
            </button>

            <button 
              type="button"
              className={`nivvo-cust-nav-item ${activeTab === 'wallet' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('wallet'); }}
            >
              <div className="nivvo-cust-nav-item-left">
                <CreditCard size={17} className="nivvo-cust-nav-icon" />
                <span>Wallet &amp; Cashback</span>
              </div>
              <span className="nivvo-cust-nav-badge">₹{walletBalance.toFixed(0)}</span>
            </button>

            <button 
              type="button"
              className={`nivvo-cust-nav-item ${activeTab === 'size-locker' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('size-locker'); }}
            >
              <div className="nivvo-cust-nav-item-left">
                <Sparkles size={17} className="nivvo-cust-nav-icon" />
                <span>AI Size Locker &amp; Fit</span>
              </div>
            </button>

            <button 
              type="button"
              className={`nivvo-cust-nav-item ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('notifications'); }}
            >
              <div className="nivvo-cust-nav-item-left">
                <Bell size={17} className="nivvo-cust-nav-icon" />
                <span>Alerts &amp; WhatsApp</span>
              </div>
              {unreadNotificationCount > 0 && (
                <span className="nivvo-cust-nav-badge">{unreadNotificationCount} new</span>
              )}
            </button>

            <button 
              type="button"
              className={`nivvo-cust-nav-item ${activeTab === 'support' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('support'); }}
            >
              <div className="nivvo-cust-nav-item-left">
                <HelpCircle size={17} className="nivvo-cust-nav-icon" />
                <span>24x7 Resolution Desk</span>
              </div>
            </button>

            <button 
              type="button"
              className={`nivvo-cust-nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab('security'); }}
            >
              <div className="nivvo-cust-nav-item-left">
                <ShieldCheck size={17} className="nivvo-cust-nav-icon" />
                <span>Security &amp; Login</span>
              </div>
            </button>

            <button 
              type="button"
              className="nivvo-cust-logout-btn"
              onClick={() => {
                playClickSound();
                if (logoutUser) logoutUser();
                showToast('Signed out successfully.');
                onBack ? onBack() : navigateTo('landing');
              }}
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </nav>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="nivvo-cust-content">

          {/* =================================================================
              TAB 1: ACCOUNT OVERVIEW
              ================================================================= */}
          {activeTab === 'overview' && (
            <>
              <div className="nivvo-cust-header-banner">
                <div className="nivvo-cust-header-title">
                  <h2>Welcome back, {profile.name.split(' ')[0]}</h2>
                  <p>Here is a summary of your hyperlocal orders, doorstep trial status, and address preferences.</p>
                </div>
                <button 
                  type="button"
                  className="nivvo-cust-btn-primary" 
                  onClick={() => { playClickSound(); navigateTo('home'); }}
                >
                  <ShoppingBag size={15} />
                  <span>Explore Neighbourhood Stores</span>
                </button>
              </div>

              {/* 4 Metric Cards */}
              <div className="nivvo-cust-metrics-grid">
                <div className="nivvo-cust-metric-card">
                  <div className="nivvo-cust-metric-top">
                    <span className="nivvo-cust-metric-label">Completed Orders</span>
                    <div className="nivvo-cust-metric-icon"><Package size={18} /></div>
                  </div>
                  <span className="nivvo-cust-metric-value">{displayOrders.length}</span>
                  <span style={{ fontSize: '11px', color: '#15803D', fontWeight: 600 }}>All within 10-12 mins</span>
                </div>

                <div className="nivvo-cust-metric-card">
                  <div className="nivvo-cust-metric-top">
                    <span className="nivvo-cust-metric-label">Wallet Cashback</span>
                    <div className="nivvo-cust-metric-icon"><CreditCard size={18} /></div>
                  </div>
                  <span className="nivvo-cust-metric-value">₹{walletBalance.toFixed(2)}</span>
                  <span style={{ fontSize: '11px', color: '#15803D', fontWeight: 600 }}>Instant checkout balance</span>
                </div>

                <div className="nivvo-cust-metric-card">
                  <div className="nivvo-cust-metric-top">
                    <span className="nivvo-cust-metric-label">Doorstep 2-Size Trial</span>
                    <div className="nivvo-cust-metric-icon"><Sparkles size={18} /></div>
                  </div>
                  <span className="nivvo-cust-metric-value">Enabled</span>
                  <span style={{ fontSize: '11px', color: '#15803D', fontWeight: 600 }}>Free ₹0 adjacent sizes</span>
                </div>

                <div className="nivvo-cust-metric-card">
                  <div className="nivvo-cust-metric-top">
                    <span className="nivvo-cust-metric-label">Saved Addresses</span>
                    <div className="nivvo-cust-metric-icon"><MapPin size={18} /></div>
                  </div>
                  <span className="nivvo-cust-metric-value">{addresses.length}</span>
                  <span style={{ fontSize: '11px', color: '#6B7A68', fontWeight: 600 }}>Default: {addresses[0]?.title}</span>
                </div>
              </div>

              {/* Live In-Transit Order Banner */}
              {displayOrders.find(o => o.isLive) && (
                <div className="nivvo-cust-active-order-card">
                  <div className="nivvo-cust-active-left">
                    <div className="nivvo-cust-active-pulsing-badge">
                      <Clock size={24} />
                    </div>
                    <div className="nivvo-cust-active-info">
                      <h3>Order #{displayOrders.find(o => o.isLive).id} is Out for Delivery</h3>
                      <p>
                        Rider <strong>{displayOrders.find(o => o.isLive).riderName}</strong> ({displayOrders.find(o => o.isLive).riderRating}) arriving in ~{displayOrders.find(o => o.isLive).eta}
                      </p>
                    </div>
                  </div>

                  <div className="nivvo-cust-active-actions">
                    <div className="nivvo-cust-active-otp">
                      Delivery OTP: {displayOrders.find(o => o.isLive).otp}
                    </div>
                    <button 
                      type="button"
                      className="nivvo-cust-btn-primary" 
                      style={{ backgroundColor: '#B7F34A', color: '#1A3622' }}
                      onClick={() => { playClickSound(); navigateTo('tracking'); }}
                    >
                      <MapPin size={14} />
                      <span>Track Rider Live</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Recent Orders Overview */}
              <div className="nivvo-cust-card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1A3622' }}>
                    Recent Orders &amp; Doorstep Trials
                  </h3>
                  <button 
                    type="button"
                    className="nivvo-cust-btn-outline" 
                    onClick={() => { playClickSound(); setActiveTab('orders'); }}
                  >
                    <span>View All Orders</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>

                <div className="nivvo-cust-orders-list">
                  {displayOrders.slice(0, 2).map((order) => (
                    <div key={order.id} className="nivvo-cust-order-card">
                      <div className="nivvo-cust-order-header">
                        <div className="nivvo-cust-order-id-group">
                          <span className="nivvo-cust-order-id">#{order.id}</span>
                          <span className="nivvo-cust-order-date">· {order.date}</span>
                        </div>
                        <span className={`nivvo-cust-order-status-pill ${order.isLive ? 'transit' : 'delivered'}`}>
                          {order.status}
                        </span>
                      </div>

                      <div className="nivvo-cust-order-items">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="nivvo-cust-order-item-row">
                            <div className="nivvo-cust-order-item-main">
                              <img src={item.img} alt={item.title} className="nivvo-cust-order-item-img" />
                              <div>
                                <div style={{ fontWeight: 700, color: '#1A3622' }}>{item.title}</div>
                                <div style={{ fontSize: '12px', color: '#6B7A68' }}>{item.size} · Qty {item.qty}</div>
                              </div>
                            </div>
                            <span style={{ fontWeight: 800, color: '#1A3622' }}>₹{item.price}</span>
                          </div>
                        ))}
                      </div>

                      <div className="nivvo-cust-order-footer">
                        <span className="nivvo-cust-order-total">Total: ₹{order.total}</span>
                        <div className="nivvo-cust-order-actions">
                          <button
                            type="button"
                            className="nivvo-cust-btn-outline"
                            onClick={() => {
                              playTrialSound();
                              downloadReceiptPdf(order, profile);
                              showToast(`Tax invoice generated for order #${order.id}`);
                            }}
                          >
                            <Download size={14} />
                            <span>Invoice (PDF)</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* =================================================================
              TAB 2: ORDERS & 2-SIZE TRIALS
              ================================================================= */}
          {activeTab === 'orders' && (
            <div className="nivvo-cust-card">
              <div className="nivvo-cust-header-banner" style={{ padding: '0 0 20px 0', border: 'none', borderRadius: 0, borderBottom: '1px solid #E7EDE3', marginBottom: '24px' }}>
                <div className="nivvo-cust-header-title">
                  <h2>Order History &amp; 2-Size Trials</h2>
                  <p>Track live deliveries, view past orders, inspect 2-size trial resolutions, and download invoices.</p>
                </div>
              </div>

              <div className="nivvo-cust-orders-list">
                {displayOrders.map((order) => (
                  <div key={order.id} className="nivvo-cust-order-card">
                    <div className="nivvo-cust-order-header">
                      <div className="nivvo-cust-order-id-group">
                        <span className="nivvo-cust-order-id">#{order.id}</span>
                        <span className="nivvo-cust-order-date">· {order.date}</span>
                        <span style={{ fontSize: '12px', color: '#15803D', fontWeight: 600 }}>· {order.darkStore}</span>
                      </div>
                      <span className={`nivvo-cust-order-status-pill ${order.isLive ? 'transit' : 'delivered'}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="nivvo-cust-order-items">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="nivvo-cust-order-item-row">
                          <div className="nivvo-cust-order-item-main">
                            <img src={item.img} alt={item.title} className="nivvo-cust-order-item-img" />
                            <div>
                              <div style={{ fontWeight: 700, color: '#1A3622' }}>{item.title}</div>
                              <div style={{ fontSize: '12px', color: '#6B7A68' }}>{item.size} · Qty {item.qty}</div>
                            </div>
                          </div>
                          <span style={{ fontWeight: 800, color: '#1A3622' }}>₹{item.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="nivvo-cust-order-footer">
                      <div>
                        <span className="nivvo-cust-order-total">Total Bill: ₹{order.total}</span>
                        <span style={{ fontSize: '12px', color: '#6B7A68', marginLeft: '12px' }}>
                          Delivery Partner: <strong>{order.riderName}</strong> ({order.riderRating})
                        </span>
                      </div>

                      <div className="nivvo-cust-order-actions">
                        {order.isLive && (
                          <button
                            type="button"
                            className="nivvo-cust-btn-primary"
                            onClick={() => { playClickSound(); navigateTo('tracking'); }}
                          >
                            <MapPin size={14} />
                            <span>Live Map</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="nivvo-cust-btn-outline"
                          onClick={() => {
                            playTrialSound();
                            downloadReceiptPdf(order, profile);
                            showToast(`GST Invoice for order #${order.id} downloaded.`);
                          }}
                        >
                          <Download size={14} />
                          <span>Download Invoice</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 3: SAVED DELIVERY ADDRESSES
              ================================================================= */}
          {activeTab === 'addresses' && (
            <div className="nivvo-cust-card">
              <div className="nivvo-cust-header-banner" style={{ padding: '0 0 20px 0', border: 'none', borderRadius: 0, borderBottom: '1px solid #E7EDE3', marginBottom: '24px' }}>
                <div className="nivvo-cust-header-title">
                  <h2>Saved Delivery Addresses</h2>
                  <p>Manage your home, workplace, and gym locations for accurate 10-minute route estimates.</p>
                </div>
                <button 
                  type="button"
                  className="nivvo-cust-btn-primary"
                  onClick={() => { playClickSound(); setShowAddAddrModal(true); }}
                >
                  <Plus size={15} />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="nivvo-cust-addresses-grid">
                {addresses.map((addr) => (
                  <div key={addr.id} className={`nivvo-cust-address-card ${addr.isDefault ? 'selected' : ''}`}>
                    <div>
                      <div className="nivvo-cust-addr-header">
                        <span className="nivvo-cust-addr-tag">
                          <MapPin size={11} />
                          <span>{addr.tag}</span>
                        </span>
                        <div className="nivvo-cust-addr-actions">
                          {addr.isDefault && (
                            <span style={{ fontSize: '11px', color: '#15803D', fontWeight: 800, background: '#DCFCE7', padding: '3px 8px', borderRadius: '6px' }}>
                              Default
                            </span>
                          )}
                          <button 
                            type="button"
                            className="nivvo-cust-addr-icon-btn" 
                            onClick={() => handleDeleteAddress(addr.id)}
                            title="Delete address"
                          >
                            <Trash2 size={15} color="#DC2626" />
                          </button>
                        </div>
                      </div>

                      <h4 className="nivvo-cust-addr-title" style={{ marginTop: '12px' }}>{addr.title}</h4>
                      <p className="nivvo-cust-addr-text">{addr.street}</p>
                      <p className="nivvo-cust-addr-text" style={{ fontWeight: 600, color: '#1A3622', marginTop: '4px' }}>
                        {addr.area}, {addr.city}
                      </p>
                      {addr.note && (
                        <p style={{ fontSize: '12px', color: '#71826E', fontStyle: 'italic', marginTop: '8px' }}>
                          Note: "{addr.note}"
                        </p>
                      )}
                    </div>

                    <div style={{ paddingTop: '14px', borderTop: '1px solid #F1F5EE', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#6B7A68' }}>{addr.recipient} · {addr.phone}</span>
                      {!addr.isDefault && (
                        <button
                          type="button"
                          className="nivvo-cust-btn-outline"
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                          onClick={() => handleSetDefaultAddress(addr)}
                        >
                          Set as Default
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {showAddAddrModal && (
                <div style={{
                  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                  background: 'rgba(0,0,0,0.5)', zIndex: 9999,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
                }}>
                  <div style={{ background: '#FFFFFF', borderRadius: '20px', padding: '30px', maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800 }}>Add Delivery Address</h3>
                      <button type="button" onClick={() => setShowAddAddrModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
                    </div>

                    <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="nivvo-cust-form-group">
                        <label>Address Title / Label</label>
                        <input 
                          type="text" 
                          className="nivvo-cust-input" 
                          placeholder="e.g. Home, Office, Studio" 
                          value={newAddr.title}
                          onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="nivvo-cust-form-group">
                        <label>Category Tag</label>
                        <select 
                          className="nivvo-cust-input"
                          value={newAddr.tag}
                          onChange={(e) => setNewAddr({ ...newAddr, tag: e.target.value })}
                        >
                          <option value="Home">Home</option>
                          <option value="Work">Work</option>
                          <option value="Gym">Gym</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="nivvo-cust-form-group">
                        <label>Flat / House No. &amp; Street Address</label>
                        <input 
                          type="text" 
                          className="nivvo-cust-input" 
                          placeholder="e.g. #302, 100ft Road, near Sony Signal" 
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                          required
                        />
                      </div>

                      <div className="nivvo-cust-form-group">
                        <label>Bengaluru Neighbourhood Micro-Hub</label>
                        <select 
                          className="nivvo-cust-input"
                          value={newAddr.area}
                          onChange={(e) => setNewAddr({ ...newAddr, area: e.target.value, city: `Bengaluru (${e.target.value})` })}
                        >
                          <option value="Indiranagar">Indiranagar (560038)</option>
                          <option value="Koramangala">Koramangala (560034)</option>
                          <option value="HSR Layout">HSR Layout (560102)</option>
                          <option value="Jayanagar">Jayanagar (560041)</option>
                          <option value="Whitefield">Whitefield (560066)</option>
                        </select>
                      </div>

                      <div className="nivvo-cust-form-group">
                        <label>Rider Delivery Instructions (Optional)</label>
                        <input 
                          type="text" 
                          className="nivvo-cust-input" 
                          placeholder="e.g. Leave with building security" 
                          value={newAddr.note}
                          onChange={(e) => setNewAddr({ ...newAddr, note: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                        <button type="submit" className="nivvo-cust-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Save Address</button>
                        <button type="button" className="nivvo-cust-btn-outline" onClick={() => setShowAddAddrModal(false)}>Cancel</button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* =================================================================
              TAB 4: WALLET & CASHBACK
              ================================================================= */}
          {activeTab === 'wallet' && (
            <>
              <div className="nivvo-cust-wallet-banner">
                <div className="nivvo-cust-wallet-balance-wrap">
                  <span>Available Nivvo Cash &amp; Cashback</span>
                  <div className="nivvo-cust-wallet-amount">₹{walletBalance.toFixed(2)}</div>
                  <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#DCE4D8' }}>
                    Auto-applied on eligible 10-minute fashion, grocery, and dining orders.
                  </p>
                </div>

                <div className="nivvo-cust-wallet-actions">
                  <button type="button" className="nivvo-cust-quick-amt-btn" onClick={() => handleAddWalletMoney(200)}>+₹200</button>
                  <button type="button" className="nivvo-cust-quick-amt-btn" onClick={() => handleAddWalletMoney(500)}>+₹500</button>
                  <button type="button" className="nivvo-cust-quick-amt-btn" onClick={() => handleAddWalletMoney(1000)}>+₹1,000</button>
                </div>
              </div>

              <div className="nivvo-cust-card">
                <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 800, color: '#1A3622' }}>
                  Wallet Ledger &amp; Cashback History
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {walletTransactions.map((tx) => (
                    <div 
                      key={tx.id} 
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '14px 18px', borderRadius: '12px', background: '#F7F9F5',
                        border: '1px solid #E7EDE3'
                      }}
                    >
                      <div>
                        <div style={{ fontWeight: 700, color: '#1A3622', fontSize: '14px' }}>{tx.desc}</div>
                        <div style={{ fontSize: '12px', color: '#6B7A68' }}>{tx.date}</div>
                      </div>
                      <span style={{
                        fontSize: '15px', fontWeight: 800,
                        color: tx.type === 'credit' ? '#15803D' : '#DC2626'
                      }}>
                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* =================================================================
              TAB 5: AI SIZE LOCKER & FIT PROFILE
              ================================================================= */}
          {activeTab === 'size-locker' && (
            <div className="nivvo-cust-card">
              <div className="nivvo-cust-header-banner" style={{ padding: '0 0 20px 0', border: 'none', borderRadius: 0, borderBottom: '1px solid #E7EDE3', marginBottom: '24px' }}>
                <div className="nivvo-cust-header-title">
                  <h2>AI Size Locker &amp; Doorstep 2-Size Trial</h2>
                  <p>Locks your verified sizing so boutiques pack the exact right fits automatically.</p>
                </div>
              </div>

              <div className="nivvo-cust-form-grid">
                <div className="nivvo-cust-form-group">
                  <label>Preferred Tops Size (Shirts, Tees, Jackets)</label>
                  <select 
                    className="nivvo-cust-input"
                    value={profile.topSize}
                    onChange={(e) => setProfile({ ...profile, topSize: e.target.value })}
                  >
                    <option value="S">S (38 in)</option>
                    <option value="M">M (40 in) · Active Default</option>
                    <option value="L">L (42 in)</option>
                    <option value="XL">XL (44 in)</option>
                  </select>
                </div>

                <div className="nivvo-cust-form-group">
                  <label>Preferred Bottoms Size (Denims, Trousers)</label>
                  <select 
                    className="nivvo-cust-input"
                    value={profile.bottomSize}
                    onChange={(e) => setProfile({ ...profile, bottomSize: e.target.value })}
                  >
                    <option value="30">30 Waist</option>
                    <option value="32">32 Waist · Active Default</option>
                    <option value="34">34 Waist</option>
                    <option value="36">36 Waist</option>
                  </select>
                </div>

                <div className="nivvo-cust-form-group">
                  <label>Footwear Size (Sneakers, Loafers)</label>
                  <select 
                    className="nivvo-cust-input"
                    value={profile.shoeSize}
                    onChange={(e) => setProfile({ ...profile, shoeSize: e.target.value })}
                  >
                    <option value="UK 7">UK 7 (EU 41)</option>
                    <option value="UK 8">UK 8 (EU 42)</option>
                    <option value="UK 9">UK 9 (EU 43) · Active Default</option>
                    <option value="UK 10">UK 10 (EU 44)</option>
                  </select>
                </div>

                <div className="nivvo-cust-form-group">
                  <label>Free Doorstep 2-Size Trial Policy</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 0' }}>
                    <input 
                      type="checkbox" 
                      id="auto-trial"
                      checked={profile.autoTrialPairing} 
                      onChange={(e) => setProfile({ ...profile, autoTrialPairing: e.target.checked })}
                      style={{ width: '18px', height: '18px', accentColor: '#24452D' }}
                    />
                    <label htmlFor="auto-trial" style={{ fontSize: '13px', color: '#1A3622', cursor: 'pointer', margin: 0 }}>
                      Auto-include adjacent size for free 2-minute doorstep try-on
                    </label>
                  </div>
                </div>

                <div className="nivvo-cust-form-group full" style={{ marginTop: '10px' }}>
                  <button 
                    type="button"
                    className="nivvo-cust-btn-primary"
                    onClick={() => {
                      playTrialSound();
                      showToast('AI Size Locker updated! Next delivery calibrated to your fits.');
                    }}
                  >
                    <Check size={15} />
                    <span>Save Fit Calibration</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 6: NOTIFICATIONS & WHATSAPP
              ================================================================= */}
          {activeTab === 'notifications' && (
            <div className="nivvo-cust-card">
              <div className="nivvo-cust-header-banner" style={{ padding: '0 0 20px 0', border: 'none', borderRadius: 0, borderBottom: '1px solid #E7EDE3', marginBottom: '24px' }}>
                <div className="nivvo-cust-header-title">
                  <h2>Alerts &amp; Real-time WhatsApp Updates</h2>
                  <p>Configure how you receive your 10-minute dispatch milestones and rider OTPs.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '14px', background: '#F7F9F5', border: '1px solid #E7EDE3' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#1A3622' }}>
                      WhatsApp Instant Order Updates
                    </h4>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#6B7A68' }}>
                      Receive live electric rider GPS tracking link and delivery OTP on {profile.phone}.
                    </p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={profile.whatsappUpdates}
                    onChange={(e) => {
                      setProfile({ ...profile, whatsappUpdates: e.target.checked });
                      showToast(`WhatsApp alerts ${e.target.checked ? 'enabled' : 'disabled'}.`);
                    }}
                    style={{ width: '20px', height: '20px', accentColor: '#15803D' }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderRadius: '14px', background: '#F7F9F5', border: '1px solid #E7EDE3' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#1A3622' }}>
                      Interactive Audio Feedback &amp; Sounds
                    </h4>
                    <p style={{ margin: 0, fontSize: '12.5px', color: '#6B7A68' }}>
                      Play synthetic audio pops and chimes when adding to bag or completing orders.
                    </p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={profile.soundEnabled}
                    onChange={(e) => {
                      setProfile({ ...profile, soundEnabled: e.target.checked });
                      showToast(`Audio sounds ${e.target.checked ? 'enabled' : 'muted'}.`);
                    }}
                    style={{ width: '20px', height: '20px', accentColor: '#15803D' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 7: 24X7 RESOLUTION DESK & FAQS
              ================================================================= */}
          {activeTab === 'support' && (
            <div className="nivvo-cust-card">
              <div className="nivvo-cust-header-banner" style={{ padding: '0 0 20px 0', border: 'none', borderRadius: 0, borderBottom: '1px solid #E7EDE3', marginBottom: '24px' }}>
                <div className="nivvo-cust-header-title">
                  <h2>24x7 Customer Resolution Desk</h2>
                  <p>Real-time concierge assistance for Indiranagar, Koramangala &amp; Bengaluru deliveries.</p>
                </div>
              </div>

              {/* Support Ticket Form */}
              <form onSubmit={handleSubmitTicket} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1A3622' }}>
                  Create a Support Request
                </h4>

                <div className="nivvo-cust-form-grid">
                  <div className="nivvo-cust-form-group">
                    <label>Category</label>
                    <select 
                      className="nivvo-cust-input"
                      value={ticketForm.category}
                      onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                    >
                      <option value="Delivery Speed & Tracking">Delivery Speed &amp; Tracking</option>
                      <option value="2-Size Trial Resolution">Doorstep 2-Size Trial Issue</option>
                      <option value="Damaged or Wrong Item">Produce Freshness or Wrong Item</option>
                      <option value="Billing & Refund">Billing, UPI &amp; Refunds</option>
                    </select>
                  </div>

                  <div className="nivvo-cust-form-group">
                    <label>Subject</label>
                    <input 
                      type="text" 
                      className="nivvo-cust-input" 
                      placeholder="e.g. Rider eta inquiry for order #NV-982411" 
                      value={ticketForm.subject}
                      onChange={(e) => setTicketForm({ ...ticketForm, subject: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="nivvo-cust-btn-primary" style={{ alignSelf: 'flex-start' }}>
                  <MessageSquare size={14} />
                  <span>Submit to Priority Queue</span>
                </button>
              </form>

              {/* Recent Tickets Table */}
              <h4 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 800, color: '#1A3622' }}>
                Your Recent Inquiries
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {supportTickets.map((tck) => (
                  <div 
                    key={tck.id} 
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '12px 18px', borderRadius: '12px', background: '#F7F9F5',
                      border: '1px solid #E7EDE3', fontSize: '13px'
                    }}
                  >
                    <div>
                      <strong style={{ color: '#1A3622' }}>{tck.id}</strong> · {tck.subject}
                      <div style={{ fontSize: '11px', color: '#6B7A68' }}>{tck.category} · {tck.date}</div>
                    </div>
                    <span style={{ fontWeight: 700, color: '#15803D', background: '#DCFCE7', padding: '3px 10px', borderRadius: '6px', fontSize: '11px' }}>
                      {tck.status}
                    </span>
                  </div>
                ))}
              </div>

              {/* FAQs Accordion */}
              <h4 style={{ margin: '0 0 14px', fontSize: '16px', fontWeight: 800, color: '#1A3622' }}>
                Frequently Answered Questions
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {faqs.map((f, i) => (
                  <div 
                    key={i} 
                    style={{ border: '1px solid #E7EDE3', borderRadius: '12px', overflow: 'hidden' }}
                  >
                    <div 
                      onClick={() => setActiveFaq(activeFaq === i ? -1 : i)}
                      style={{
                        padding: '14px 18px', background: '#FFFFFF', cursor: 'pointer',
                        fontWeight: 700, fontSize: '13.5px', color: '#1A3622',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                      }}
                    >
                      <span>{f.q}</span>
                      <span>{activeFaq === i ? '−' : '+'}</span>
                    </div>
                    {activeFaq === i && (
                      <div style={{ padding: '14px 18px', background: '#F7F9F5', fontSize: '13px', color: '#56634F', lineHeight: 1.5, borderTop: '1px solid #EEF3EB' }}>
                        {f.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =================================================================
              TAB 8: SECURITY & SETTINGS
              ================================================================= */}
          {activeTab === 'security' && (
            <div className="nivvo-cust-card">
              <div className="nivvo-cust-header-banner" style={{ padding: '0 0 20px 0', border: 'none', borderRadius: 0, borderBottom: '1px solid #E7EDE3', marginBottom: '24px' }}>
                <div className="nivvo-cust-header-title">
                  <h2>Account Security &amp; Credentials</h2>
                  <p>Manage your account credentials, login credentials, and session authorizations.</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="nivvo-cust-form-grid">
                  <div className="nivvo-cust-form-group">
                    <label>Full Name</label>
                    <input 
                      type="text" 
                      className="nivvo-cust-input" 
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>

                  <div className="nivvo-cust-form-group">
                    <label>Registered Phone Number</label>
                    <input 
                      type="text" 
                      className="nivvo-cust-input" 
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                  </div>

                  <div className="nivvo-cust-form-group full">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="nivvo-cust-input" 
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>

                <div style={{ paddingTop: '20px', borderTop: '1px solid #E7EDE3', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: '#1A3622' }}>
                      Two-Factor Authentication (SMS &amp; WhatsApp OTP)
                    </h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#6B7A68' }}>
                      Require an OTP on your verified phone number when logging in.
                    </p>
                  </div>
                  <input 
                    type="checkbox"
                    checked={profile.twoFactorAuth}
                    onChange={(e) => {
                      setProfile({ ...profile, twoFactorAuth: e.target.checked });
                      showToast(`Two-Factor Authentication ${e.target.checked ? 'activated' : 'deactivated'}.`);
                    }}
                    style={{ width: '20px', height: '20px', accentColor: '#15803D' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button 
                    type="button"
                    className="nivvo-cust-btn-primary"
                    onClick={() => {
                      playClickSound();
                      showToast('Security details saved successfully!');
                    }}
                  >
                    <Check size={14} />
                    <span>Save Changes</span>
                  </button>

                  <button 
                    type="button"
                    className="nivvo-cust-btn-outline"
                    style={{ color: '#DC2626', borderColor: '#FCA5A5' }}
                    onClick={() => {
                      playClickSound();
                      if (logoutUser) logoutUser();
                      showToast('Signed out.');
                      onBack ? onBack() : navigateTo('landing');
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out of Account</span>
                  </button>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}
