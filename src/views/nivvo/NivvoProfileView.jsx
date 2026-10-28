import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  User, MapPin, Package, CreditCard, HelpCircle, Settings, 
  ChevronRight, ArrowLeft, Plus, Trash2, Edit3, Check, Phone, 
  Mail, Bell, ShieldCheck, FileText, RotateCcw, Sparkles, Volume2, 
  ExternalLink, MessageSquare, AlertCircle, X, Heart, Star, Lock, Download, LogOut, CheckCircle, RefreshCw,
  Bike, Zap, Menu
} from 'lucide-react';
import { NIVVO_PRODUCTS } from '../../data/nivvoData';
import { playClickSound, playTrialSound, playAddSound } from '../../utils/audioEffects';
import { downloadReceiptPdf } from '../../utils/receiptGenerator';

export default function NivvoProfileView({ onBack }) {
  const { 
    selectedAddress, 
    setSelectedAddress, 
    savedAddresses, 
    orders, 
    activeOrder,
    navigateTo, 
    showToast,
    addToCart,
    wishlist,
    toggleWishlist,
    notifications,
    unreadNotificationCount,
    markAllNotificationsRead,
    clearNotification,
    cancelOrder,
    requestReturnOrExchange,
    submitOrderReview,
    currentUser,
    setAuthModalOpen,
    setAuthModalRole,
    logoutUser,
    appMode,
    switchToRiderMode,
    switchToCustomerMode,
    setBecomeRiderModalOpen,
    setActiveModal,
    allProducts
  } = useNivvo();

  // Active Profile Section
  const [activeSection, setActiveSection] = useState('main'); 
  // 'main' | 'orders' | 'addresses' | 'wishlist' | 'support' | 'wallet' | 'notifications' | 'privacy'

  // User Profile State
  const [profile, setProfile] = useState({
    name: 'Aarav Shah',
    email: 'aarav.shah@okaxis',
    phone: '+91 98765 43210',
    memberSince: 'October 2024',
    tier: 'Indiranagar Club Member',
    soundEnabled: true,
    whatsappUpdates: true,
    twoFactorAuth: true
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  // Address Management State
  const [addresses, setAddresses] = useState([
    ...savedAddresses,
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
      etaModifier: 0
    }
  ]);
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    tag: 'Home',
    title: '',
    street: '',
    area: 'Indiranagar',
    city: 'Bengaluru 560038',
    note: ''
  });

  // Invoice Modal State
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  // Cancellation Modal State
  const [cancellingOrder, setCancellingOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of delivery address');

  // Return / Exchange Modal State
  const [returnOrderTarget, setReturnOrderTarget] = useState(null);
  const [returnType, setReturnType] = useState('exchange'); // 'exchange' | 'return'
  const [exchangeSize, setExchangeSize] = useState('UK 9');
  const [returnReason, setReturnReason] = useState('Size is slightly small, need 1 size up');

  // Rating & Review Modal State
  const [reviewOrderTarget, setReviewOrderTarget] = useState(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [selectedReviewTags, setSelectedReviewTags] = useState(['Perfect Fit', 'Lightning Delivery']);
  const [reviewComment, setReviewComment] = useState('');

  // Support Chat State
  const [showSupportChat, setShowSupportChat] = useState(false);
  const [supportMessages, setSupportMessages] = useState([
    { id: 1, sender: 'bot', text: 'Hello Aarav! Welcome to Nivvo Indiranagar Support. How can we help you today?' }
  ]);
  const [supportInput, setSupportInput] = useState('');

  // Sync profile from backend if available
  useEffect(() => {
    fetch('/api/profile?phone=+91 9876543210')
      .then(res => res.json())
      .then(data => {
        if (data?.user?.name) {
          setProfile(prev => ({
            ...prev,
            name: data.user.name || prev.name,
            email: data.user.email || prev.email,
            phone: data.user.phone || prev.phone
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    playTrialSound();
    setProfile({ ...editForm });
    setIsEditingProfile(false);
    showToast('Profile updated successfully');

    // Post to backend
    fetch('/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: editForm.phone,
        name: editForm.name,
        email: editForm.email
      })
    }).catch(() => {});
  };

  const handleAddAddress = (e) => {
    e.preventDefault();
    if (!newAddr.title || !newAddr.street) return;

    playTrialSound();
    const created = {
      id: `addr-${Date.now()}`,
      tag: newAddr.tag,
      title: newAddr.title,
      area: newAddr.area || 'Indiranagar',
      street: newAddr.street,
      city: 'Bengaluru 560038',
      phone: profile.phone,
      recipient: profile.name,
      note: newAddr.note || 'Ring the bell'
    };

    setAddresses([created, ...addresses]);
    setSelectedAddress(created);
    setShowAddAddressModal(false);
    setNewAddr({ tag: 'Home', title: '', street: '', area: 'Indiranagar', city: 'Bengaluru 560038', note: '' });
    showToast(`Added "${created.title}" to saved addresses!`);

    // Post to backend
    fetch('/api/addresses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_phone: profile.phone,
        label: created.tag,
        receiver_name: created.recipient,
        street_address: created.street,
        flat_no: created.title,
        instructions: created.note
      })
    }).catch(() => {});
  };

  const handleDeleteAddress = (id) => {
    playClickSound();
    setAddresses(addresses.filter(a => a.id !== id));
    showToast('Address removed');
  };

  const handleReorder = (order) => {
    playAddSound();
    if (order.items && order.items.length > 0) {
      order.items.forEach(item => {
        addToCart(item, item.variant || 'Standard');
      });
      showToast(`Items from order ${order.id} added to your bag.`);
      navigateTo('bag');
    }
  };

  const handleSendSupport = (e) => {
    e.preventDefault();
    if (!supportInput.trim()) return;
    playClickSound();

    const newMsg = { id: Date.now(), sender: 'user', text: supportInput.trim() };
    setSupportMessages(prev => [...prev, newMsg]);
    setSupportInput('');

    setTimeout(() => {
      setSupportMessages(prev => [
        ...prev,
        { id: Date.now() + 1, sender: 'bot', text: 'Thank you Aarav! Indiranagar Desk Lead Priya has been notified. We will resolve your inquiry within 2 minutes.' }
      ]);
    }, 1000);
  };

  const handleDownloadPersonalData = () => {
    playTrialSound();
    const dataToExport = {
      profile,
      savedAddresses: addresses,
      orders,
      wishlist,
      exportTimestamp: new Date().toISOString(),
      platform: 'Nivvo Hyperlocal Commerce Bengaluru'
    };

    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nivvo_personal_data_${profile.name.toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    showToast('Personal data archive downloaded.');
  };

  // Products in Wishlist
  const productsList = (allProducts && allProducts.length > 0) ? allProducts : NIVVO_PRODUCTS;
  const wishlistedProducts = productsList.filter(p => wishlist.includes(p.id));

  return (
    <div style={{ padding: '12px 16px', backgroundColor: '#F8F9F6', minHeight: '100%', paddingBottom: '96px' }}>
      {/* ─── Top Header ─── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
        {activeSection === 'main' ? (
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, color: '#14281C', margin: 0, letterSpacing: '-0.02em' }}>
              You
            </h1>
            <div style={{ fontSize: '12px', color: '#687163', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={12} color="#15803D" />
              <span>Indiranagar · Bengaluru 560038</span>
            </div>
          </div>
        ) : (
          <button 
            onClick={() => setActiveSection('main')} 
            style={{ background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: '#14281C', cursor: 'pointer', padding: 0 }}
          >
            <ArrowLeft size={18} />
            <span style={{ fontSize: '15px' }}>Back to Account</span>
          </button>
        )}

        {currentUser && activeSection === 'main' && (
          <button
            onClick={() => setIsEditingProfile(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '999px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#14281C',
              cursor: 'pointer'
            }}
          >
            <Edit3 size={13} />
            <span>Edit Profile</span>
          </button>
        )}
      </div>

      {/* ==============================================================
          MAIN DASHBOARD VIEW
          ============================================================== */}
      {activeSection === 'main' && (
        <>
          {/* User Hero Identity Card */}
          {currentUser ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '20px',
              padding: '18px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  <div style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    backgroundColor: '#1F4230',
                    color: '#C6F432',
                    fontSize: '18px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {(currentUser.name || 'U').slice(0, 2).toUpperCase()}
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                        {currentUser.name || 'Aarav Shah'}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '999px',
                        backgroundColor: '#E8F5E9',
                        color: '#15803D'
                      }}>
                        {currentUser.role === 'rider' ? 'DELIVERY PARTNER' : 'CUSTOMER'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#687163', marginTop: '2px' }}>
                      {currentUser.phone || profile.phone || '+91 98765 43210'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => { playClickSound(); logoutUser(); }}
                  style={{
                    backgroundColor: '#F9FAF7',
                    border: '1px solid #E5E7DE',
                    borderRadius: '10px',
                    color: '#DC2626',
                    padding: '8px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    flexShrink: 0
                  }}
                  title="Sign Out"
                >
                  <LogOut size={13} />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '20px',
              padding: '20px',
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#F4F5EE',
                  color: '#1F4230',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <User size={22} />
                </div>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#14281C' }}>Welcome to Nivvo</div>
                  <div style={{ fontSize: '12px', color: '#687163', marginTop: '2px' }}>
                    Sign in to track orders, manage addresses, and try items at your door.
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '10px' }}>
                <button
                  onClick={() => {
                    playClickSound();
                    setAuthModalRole('customer');
                    setAuthModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#1F4230',
                    color: '#C6F432',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <User size={15} />
                  <span>Customer Sign In</span>
                </button>
                <button
                  onClick={() => {
                    playClickSound();
                    setAuthModalRole('rider');
                    setAuthModalOpen(true);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    backgroundColor: '#FFFFFF',
                    color: '#14281C',
                    border: '1px solid #E5E7DE',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  <Bike size={15} />
                  <span>Delivery Partner Sign In</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Metrics Tiles (Orders, Wishlist, Wallet, Alerts) */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            marginBottom: '16px'
          }}>
            <div 
              onClick={() => setActiveSection('orders')} 
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7DE',
                borderRadius: '14px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#F4F5EE', color: '#1F4230', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
                <Package size={14} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>{orders.length}</div>
              <div style={{ fontSize: '10px', color: '#687163', fontWeight: 600, marginTop: '2px' }}>Orders</div>
            </div>

            <div 
              onClick={() => setActiveSection('wishlist')} 
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7DE',
                borderRadius: '14px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#FEE2E2', color: '#E11D48', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
                <Heart size={14} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>{wishlist.length}</div>
              <div style={{ fontSize: '10px', color: '#687163', fontWeight: 600, marginTop: '2px' }}>Wishlist</div>
            </div>

            <div 
              onClick={() => setActiveSection('wallet')} 
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7DE',
                borderRadius: '14px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#E8F5E9', color: '#15803D', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
                <CreditCard size={14} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>₹250</div>
              <div style={{ fontSize: '10px', color: '#687163', fontWeight: 600, marginTop: '2px' }}>Wallet</div>
            </div>

            <div 
              onClick={() => setActiveSection('notifications')} 
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7DE',
                borderRadius: '14px',
                padding: '12px 6px',
                textAlign: 'center',
                cursor: 'pointer'
              }}
            >
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#F4F5EE', color: '#1F4230', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 6px auto' }}>
                <Bell size={14} />
              </div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>{unreadNotificationCount}</div>
              <div style={{ fontSize: '10px', color: '#687163', fontWeight: 600, marginTop: '2px' }}>Alerts</div>
            </div>
          </div>

          {/* Active Live Order Tracker Banner */}
          {activeOrder && activeOrder.status !== 'cancelled' && (
            <div 
              onClick={() => navigateTo('tracking')}
              style={{
                backgroundColor: '#1F4230',
                borderRadius: '16px',
                padding: '14px 16px',
                marginBottom: '16px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                color: '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#C6F432', color: '#14281C', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Package size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800 }}>
                      Order #{activeOrder.id}
                    </span>
                    <span style={{ fontSize: '10px', backgroundColor: '#C6F432', color: '#14281C', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                      OUT FOR DELIVERY
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#D1D5DB', marginTop: '2px' }}>
                    Arriving in 12–18 mins · Handover PIN: <strong>{activeOrder.pin || '4829'}</strong>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} color="#C6F432" />
            </div>
          )}

          {/* ─── GROUP 1: Orders & Shopping ─── */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#687163', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px 4px' }}>
              Orders & Activity
            </div>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              {/* Item: Orders */}
              <div 
                onClick={() => setActiveSection('orders')}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F0F2EB'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Package size={18} color="#1F4230" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>Your Orders & Invoices</div>
                    <div style={{ fontSize: '11px', color: '#687163' }}>Track deliveries, download receipts & returns</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </div>

              {/* Item: Wishlist */}
              <div 
                onClick={() => setActiveSection('wishlist')}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Heart size={18} color="#E11D48" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>Saved Wishlist</div>
                    <div style={{ fontSize: '11px', color: '#687163' }}>{wishlist.length} saved items from local shops</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {wishlist.length > 0 && (
                    <span style={{ fontSize: '11px', backgroundColor: '#FEE2E2', color: '#E11D48', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                      {wishlist.length}
                    </span>
                  )}
                  <ChevronRight size={16} color="#9CA3AF" />
                </div>
              </div>
            </div>
          </div>

          {/* ─── GROUP 2: Payments & Addresses ─── */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#687163', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px 4px' }}>
              Account & Payments
            </div>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              {/* Item: Addresses */}
              <div 
                onClick={() => setActiveSection('addresses')}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F0F2EB'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MapPin size={18} color="#1F4230" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>Saved Delivery Addresses</div>
                    <div style={{ fontSize: '11px', color: '#687163' }}>{addresses.length} saved locations</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </div>

              {/* Item: Wallet */}
              <div 
                onClick={() => setActiveSection('wallet')}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F0F2EB'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CreditCard size={18} color="#1F4230" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>Nivvo Wallet & Pay</div>
                    <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 700 }}>₹250.00 cashback available</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </div>

              {/* Item: Notifications */}
              <div 
                onClick={() => { playClickSound(); setActiveSection('notifications'); }}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '12px',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0, flex: 1 }}>
                  <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                    <Bell size={18} color="#1F4230" />
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>Notifications & Alerts</div>
                    <div style={{ fontSize: '11px', color: '#687163', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Rider status, order updates & stock drops
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                  {unreadNotificationCount > 0 && (
                    <span style={{ 
                      fontSize: '11px', 
                      fontWeight: 700, 
                      backgroundColor: '#E8F5E9', 
                      color: '#15803D', 
                      padding: '3px 9px', 
                      borderRadius: '999px',
                      whiteSpace: 'nowrap',
                      lineHeight: 1.2,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {unreadNotificationCount} new
                    </span>
                  )}
                  <ChevronRight size={16} color="#9CA3AF" style={{ flexShrink: 0 }} />
                </div>
              </div>
            </div>
          </div>

          {/* ─── GROUP 3: Preferences & Security ─── */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#687163', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px 4px' }}>
              Preferences & Security
            </div>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              {/* WhatsApp Toggle */}
              <div style={{
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #F0F2EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <MessageSquare size={18} color="#1F4230" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>WhatsApp Order Updates</div>
                    <div style={{ fontSize: '11px', color: '#687163' }}>Real-time dispatch alerts to your phone</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={profile.whatsappUpdates} 
                  onChange={(e) => {
                    setProfile({ ...profile, whatsappUpdates: e.target.checked });
                    showToast(e.target.checked ? 'WhatsApp updates enabled' : 'WhatsApp updates paused');
                  }}
                  style={{ width: '18px', height: '18px', accentColor: '#1F4230', cursor: 'pointer' }}
                />
              </div>

              {/* Sound Toggle */}
              <div style={{
                padding: '14px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #F0F2EB'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Volume2 size={18} color="#1F4230" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>Audio Feedback & Sounds</div>
                    <div style={{ fontSize: '11px', color: '#687163' }}>Cart additions and notification alerts</div>
                  </div>
                </div>
                <input 
                  type="checkbox" 
                  checked={profile.soundEnabled} 
                  onChange={(e) => {
                    setProfile({ ...profile, soundEnabled: e.target.checked });
                    showToast(e.target.checked ? 'Audio feedback enabled' : 'Audio feedback muted');
                  }}
                  style={{ width: '18px', height: '18px', accentColor: '#1F4230', cursor: 'pointer' }}
                />
              </div>

              {/* Privacy & Security */}
              <div 
                onClick={() => setActiveSection('privacy')}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Lock size={18} color="#1F4230" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>Privacy & Security</div>
                    <div style={{ fontSize: '11px', color: '#687163' }}>Two-factor authentication and data management</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </div>
            </div>
          </div>

          {/* ─── GROUP 4: Support & Services ─── */}
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#687163', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '0 0 6px 4px' }}>
              Support & Services
            </div>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '16px',
              overflow: 'hidden'
            }}>
              {/* Help & Support */}
              <div 
                onClick={() => setActiveSection('support')}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  borderBottom: '1px solid #F0F2EB'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <HelpCircle size={18} color="#1F4230" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>24/7 Customer Support & FAQs</div>
                    <div style={{ fontSize: '11px', color: '#687163' }}>Live desk assistance and delivery queries</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </div>

              {/* Delivery Partner Mode */}
              <div 
                onClick={() => {
                  playTrialSound();
                  switchToRiderMode();
                }}
                style={{
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Bike size={18} color="#1F4230" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>Delivery Partner Console</div>
                    <div style={{ fontSize: '11px', color: '#687163' }}>Switch to fleet radar and active shifts</div>
                  </div>
                </div>
                <ChevronRight size={16} color="#9CA3AF" />
              </div>
            </div>
          </div>
        </>
      )}

      {/* ==============================================================
          WISHLIST & SAVED ITEMS SUB-SECTION
          ============================================================== */}
      {activeSection === 'wishlist' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#20251F', margin: 0 }}>
              Your Wishlist
            </h2>
            <span style={{ fontSize: '12px', color: '#73796F', fontWeight: 700 }}>
              {wishlistedProducts.length} saved
            </span>
          </div>
          <p style={{ fontSize: '12px', color: '#73796F', margin: '0 0 16px 0' }}>
            Products are reserved for quick 1-click addition to bag when in stock.
          </p>

          {wishlistedProducts.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 20px',
              backgroundColor: '#F7F8F5',
              borderRadius: '20px'
            }}>
              <Heart size={40} color="#73796F" style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#20251F', margin: '0 0 6px 0' }}>
                Your wishlist is empty
              </h3>
              <p style={{ fontSize: '12px', color: '#73796F', margin: '0 0 18px 0' }}>
                Tap the heart on any shoe or accessory to save it for later.
              </p>
              <button
                onClick={() => navigateTo('sneakers')}
                style={{
                  backgroundColor: '#B7F34A',
                  color: '#20251F',
                  border: 'none',
                  padding: '12px 20px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                Explore Footwear ↗
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {wishlistedProducts.map((prod) => (
                <div 
                  key={prod.id}
                  style={{
                    border: '1px solid #E7EAE3',
                    borderRadius: '16px',
                    padding: '14px',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    gap: '12px'
                  }}
                >
                  <img 
                    src={prod.image} 
                    alt={prod.name}
                    style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
                  />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div>
                        <span style={{ fontSize: '10px', color: '#73796F', fontWeight: 700, textTransform: 'uppercase' }}>
                          {prod.shopName}
                        </span>
                        <div style={{ fontSize: '13px', fontWeight: 800, color: '#20251F' }}>
                          {prod.name}
                        </div>
                      </div>
                      <button
                        onClick={() => toggleWishlist(prod.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={15} color="#BD3838" />
                      </button>
                    </div>

                    <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '15px', fontWeight: 900, color: '#20251F' }}>
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>

                      <button
                        onClick={() => {
                          playAddSound();
                          addToCart(prod, 'UK 8');
                        }}
                        style={{
                          backgroundColor: '#20251F',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '8px',
                          fontSize: '11px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <Plus size={13} />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==============================================================
          ORDERS HISTORY SUB-SECTION (With Cancel, Return/Exchange & Reviews)
          ============================================================== */}
      {activeSection === 'orders' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#20251F', margin: '0 0 4px 0' }}>
            Your Order History
          </h2>
          <p style={{ fontSize: '12px', color: '#73796F', margin: '0 0 16px 0' }}>
            Delivered directly from independent Indiranagar neighborhood retail stores.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map((ord) => {
              const isCancelled = ord.status === 'cancelled';
              const isDelivered = ord.status === 'delivered';
              const isOutForDelivery = ord.status === 'out_for_delivery';

              return (
                <div 
                  key={ord.id}
                  style={{
                    border: '1px solid #E7EAE3',
                    borderRadius: '18px',
                    padding: '16px',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#20251F' }}>{ord.id}</span>
                      {ord.review && (
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', fontSize: '11px', color: '#24452D', fontWeight: 800 }}>
                          <Star size={11} fill="#24452D" />
                          <span>{ord.review.rating}</span>
                        </span>
                      )}
                    </div>
                    <span style={{
                      backgroundColor: isCancelled ? '#FEE2E2' : (isDelivered ? '#E8F5E9' : '#EEF4EC'),
                      color: isCancelled ? '#BD3838' : (isDelivered ? '#238636' : '#24452D'),
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 800
                    }}>
                      {ord.statusLabel || (isCancelled ? 'Cancelled' : 'Out for delivery')}
                    </span>
                  </div>

                  <div style={{ fontSize: '12px', color: '#73796F', marginBottom: '12px' }}>
                    Placed {ord.placedAt} · {ord.items?.length || 1} item{ord.items?.length > 1 ? 's' : ''} · Total: <strong>₹{ord.total?.toLocaleString('en-IN') || 1846}</strong>
                  </div>

                  {/* Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                    {ord.items?.map((it, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                        <span style={{ color: '#20251F' }}>{it.name} ({it.variant || 'Standard'})</span>
                        <span style={{ fontWeight: 600 }}>₹{it.price}</span>
                      </div>
                    ))}
                  </div>

                  {/* Cancel / Refund Note */}
                  {ord.refundStatus && (
                    <div style={{ fontSize: '11px', color: isCancelled ? '#BD3838' : '#238636', backgroundColor: '#F7F8F5', padding: '6px 10px', borderRadius: '8px', marginBottom: '12px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle size={12} />
                      <span>{ord.refundStatus}</span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid #E7EAE3', paddingTop: '12px', flexWrap: 'wrap' }}>
                    {/* Live Tracking Link if active */}
                    {isOutForDelivery && (
                      <button
                        onClick={() => navigateTo('tracking')}
                        style={{
                          flex: 1,
                          backgroundColor: '#24452D',
                          color: '#FFFFFF',
                          border: 'none',
                          borderRadius: '10px',
                          padding: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <Package size={13} />
                        <span>Live Track</span>
                      </button>
                    )}

                    {/* Cancel button if active */}
                    {isOutForDelivery && (
                      <button
                        onClick={() => setCancellingOrder(ord)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E7EAE3',
                          color: '#BD3838',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    )}

                    {/* Reorder Button */}
                    <button
                      onClick={() => handleReorder(ord)}
                      style={{
                        flex: 1,
                        backgroundColor: '#20251F',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <RotateCcw size={13} />
                      <span>Reorder</span>
                    </button>

                    {/* Return & Size Exchange trigger for delivered */}
                    {isDelivered && (
                      <button
                        onClick={() => {
                          setReturnOrderTarget(ord);
                          setReturnType('exchange');
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: '#F7F8F5',
                          border: '1px solid #E7EAE3',
                          color: '#20251F',
                          borderRadius: '10px',
                          padding: '8px',
                          fontSize: '12px',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '4px'
                        }}
                      >
                        <RefreshCw size={13} />
                        <span>Exchange / Return</span>
                      </button>
                    )}

                    {/* Rate & Review trigger for delivered */}
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
                          gap: '4px'
                        }}
                      >
                        <Star size={13} fill="#24452D" />
                        <span>Rate</span>
                      </button>
                    )}

                    {/* View Tax Receipt Button */}
                    <button
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      style={{
                        backgroundColor: '#F7F8F5',
                        border: '1px solid #E7EAE3',
                        color: '#20251F',
                        borderRadius: '10px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px'
                      }}
                    >
                      <FileText size={13} />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==============================================================
          NOTIFICATIONS & ALERTS SUB-SECTION
          ============================================================== */}
      {activeSection === 'notifications' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#20251F', margin: 0 }}>
                Notifications
              </h2>
              <div style={{ fontSize: '12px', color: '#73796F' }}>Stay updated on Indiranagar dispatches</div>
            </div>
            {unreadNotificationCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#24452D',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Mark all read
              </button>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.map((notif) => (
              <div
                key={notif.id}
                style={{
                  border: notif.read ? '1px solid #E7EAE3' : '1.5px solid #24452D',
                  borderRadius: '16px',
                  padding: '14px',
                  backgroundColor: notif.read ? '#FFFFFF' : '#F0F3ED',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 800, color: '#20251F' }}>
                      {notif.title}
                    </span>
                    {!notif.read && (
                      <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#24452D' }} />
                    )}
                  </div>
                  <div style={{ fontSize: '12px', color: '#73796F', lineHeight: 1.4, marginBottom: '6px' }}>
                    {notif.text}
                  </div>
                  <span style={{ fontSize: '10px', color: '#9CA3AF' }}>{notif.time}</span>
                </div>

                <button
                  onClick={() => clearNotification(notif.id)}
                  style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================================
          PRIVACY & SECURITY SUB-SECTION
          ============================================================== */}
      {activeSection === 'privacy' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#20251F', margin: '0 0 4px 0' }}>
            Privacy & Security
          </h2>
          <p style={{ fontSize: '12px', color: '#73796F', margin: '0 0 20px 0' }}>
            Manage your personal data, two-factor authentication, and active login sessions.
          </p>

          {/* Two-Factor Authentication Card */}
          <div style={{ border: '1px solid #E7EAE3', borderRadius: '16px', padding: '16px', backgroundColor: '#FFFFFF', marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={20} color="#24452D" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#20251F' }}>
                    Two-Factor SMS Verification
                  </div>
                  <div style={{ fontSize: '11px', color: '#73796F' }}>
                    Requires OTP sent to {profile.phone} upon signing in
                  </div>
                </div>
              </div>
              <input 
                type="checkbox"
                checked={profile.twoFactorAuth}
                onChange={(e) => {
                  setProfile({ ...profile, twoFactorAuth: e.target.checked });
                  showToast(e.target.checked ? 'Two-factor authentication enabled' : 'Two-factor authentication disabled');
                }}
                style={{ width: '18px', height: '18px', accentColor: '#24452D', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Active Sessions */}
          <div style={{ border: '1px solid #E7EAE3', borderRadius: '16px', padding: '16px', backgroundColor: '#FFFFFF', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#20251F', margin: '0 0 12px 0' }}>
              Active Login Sessions
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#20251F' }}>Chrome Browser on Windows</div>
                  <div style={{ fontSize: '11px', color: '#238636' }}>Current Session · Bengaluru</div>
                </div>
                <span style={{ fontSize: '11px', color: '#73796F' }}>Active now</span>
              </div>
              <div style={{ borderTop: '1px solid #E7EAE3', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#20251F' }}>Nivvo iOS App · iPhone 15 Pro</div>
                  <div style={{ fontSize: '11px', color: '#73796F' }}>Indiranagar, Bengaluru</div>
                </div>
                <span style={{ fontSize: '11px', color: '#73796F' }}>3h ago</span>
              </div>
            </div>
          </div>

          {/* Data Export & Account Actions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={handleDownloadPersonalData}
              style={{
                backgroundColor: '#F7F8F5',
                border: '1px solid #E7EAE3',
                borderRadius: '12px',
                padding: '14px',
                color: '#20251F',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Download size={16} />
              <span>Download My Personal Data (JSON Archive)</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Request to erase account data has been logged. Our privacy team will process it within 24 hours.')) {
                  showToast('Data erasure request submitted successfully');
                }
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #FEE2E2',
                borderRadius: '12px',
                padding: '14px',
                color: '#BD3838',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <LogOut size={16} />
              <span>Request Account Data Erasure</span>
            </button>
          </div>
        </div>
      )}

      {/* ==============================================================
          SAVED ADDRESSES SUB-SECTION
          ============================================================== */}
      {activeSection === 'addresses' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#20251F', margin: 0 }}>
                Saved Addresses
              </h2>
              <div style={{ fontSize: '12px', color: '#73796F' }}>Manage delivery locations for local shops</div>
            </div>
            <button
              onClick={() => setShowAddAddressModal(true)}
              style={{
                backgroundColor: '#20251F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <Plus size={14} />
              <span>Add new</span>
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {addresses.map((addr) => {
              const isDefault = selectedAddress.id === addr.id;
              return (
                <div
                  key={addr.id}
                  style={{
                    border: isDefault ? '2px solid #20251F' : '1px solid #E7EAE3',
                    borderRadius: '16px',
                    padding: '16px',
                    backgroundColor: isDefault ? '#F7F8F5' : '#FFFFFF',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '15px', fontWeight: 800, color: '#20251F' }}>
                        {addr.title}
                      </span>
                      <span style={{
                        backgroundColor: '#EEF2E8',
                        color: '#24452D',
                        fontSize: '10px',
                        fontWeight: 700,
                        padding: '2px 6px',
                        borderRadius: '4px'
                      }}>
                        {addr.tag}
                      </span>
                      {isDefault && (
                        <span style={{ fontSize: '10px', color: '#238636', fontWeight: 800 }}>
                          Active Address
                        </span>
                      )}
                    </div>
                    {addresses.length > 1 && (
                      <button 
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#BD3838' }}
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>

                  <div style={{ fontSize: '12px', color: '#73796F', lineHeight: 1.4, marginBottom: '8px' }}>
                    {addr.street}, {addr.city}
                  </div>
                  <div style={{ fontSize: '11px', color: '#20251F', backgroundColor: '#FFFFFF', padding: '4px 8px', borderRadius: '6px', border: '1px solid #E7EAE3', display: 'inline-block' }}>
                    Note: {addr.note}
                  </div>

                  {!isDefault && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid #E7EAE3', paddingTop: '10px' }}>
                      <button
                        onClick={() => {
                          playClickSound();
                          setSelectedAddress(addr);
                          showToast(`Set active address to ${addr.title}`);
                        }}
                        style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 800, color: '#20251F', cursor: 'pointer' }}
                      >
                        Set as Active Delivery Address →
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ==============================================================
          NIVVO WALLET & PAY SUB-SECTION
          ============================================================== */}
      {activeSection === 'wallet' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#20251F', margin: '0 0 16px 0' }}>
            Nivvo Wallet & Pay
          </h2>

          <div style={{
            backgroundColor: '#24452D',
            borderRadius: '20px',
            padding: '24px 20px',
            color: '#FFFFFF',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '12px', color: '#B7F34A', fontWeight: 700, letterSpacing: '0.06em', marginBottom: '6px' }}>
              AVAILABLE LOCAL CASHBACK
            </div>
            <div style={{ fontSize: '32px', fontWeight: 800, marginBottom: '12px' }}>₹250.00</div>
            <div style={{ fontSize: '12px', color: '#C5D7C0' }}>
              Auto-applies at checkout for all Indiranagar verified shops.
            </div>
          </div>

          <div style={{ border: '1px solid #E7EAE3', borderRadius: '16px', padding: '16px', marginBottom: '20px' }}>
            <h4 style={{ fontSize: '14px', fontWeight: 800, color: '#20251F', margin: '0 0 12px 0' }}>
              Saved Payment Methods
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#20251F' }}>UPI: aarav.shah@okaxis</div>
                  <div style={{ fontSize: '11px', color: '#238636' }}>Verified Primary</div>
                </div>
                <span style={{ fontSize: '11px', color: '#73796F' }}>Default</span>
              </div>
              <div style={{ borderTop: '1px solid #E7EAE3', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#20251F' }}>HDFC Bank Debit Card (•••• 4028)</div>
                  <div style={{ fontSize: '11px', color: '#73796F' }}>Expires 08/29</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          24/7 SUPPORT & HELP HUB
          ============================================================== */}
      {activeSection === 'support' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#20251F', margin: '0 0 4px 0' }}>
            24/7 Indiranagar Help Desk
          </h2>
          <p style={{ fontSize: '12px', color: '#73796F', margin: '0 0 16px 0' }}>
            Our local resolution team is physically present in Indiranagar.
          </p>

          <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
            <button
              onClick={() => setShowSupportChat(true)}
              style={{
                flex: 1,
                backgroundColor: '#20251F',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <MessageSquare size={16} />
              <span>Chat with Support</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                showToast('Calling Indiranagar Support Desk: 1800-NIVVO-HELP');
              }}
              style={{
                flex: 1,
                backgroundColor: '#F7F8F5',
                border: '1px solid #E7EAE3',
                color: '#20251F',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Phone size={16} />
              <span>Call Local Desk</span>
            </button>
          </div>

          {/* Common FAQs */}
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#20251F', margin: '0 0 12px 0' }}>
            Frequently Asked Questions
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[
              { q: 'How does Doorstep Trial work?', a: 'You can order multiple sizes or models. Your rider waits 10 minutes at your door. You try on the items, keep what fits, and hand back the rest with immediate receipt.' },
              { q: 'What if an item is out of stock?', a: 'Physical shelf stock is synced every 2 minutes with local shops like Sole Street and Circuit House. If an item sells out in-store, it is immediately updated in the app.' },
              { q: 'Are delivery ETAs guaranteed?', a: 'We say 12–18 mins honestly based on actual preparation and traffic conditions. We never enforce reckless 10-minute speed traps.' },
              { q: 'How do returns work for unworn sneakers?', a: 'All footwear includes a 7-day doorstep return policy if unworn with tags attached. A rider picks it up from your address in under 20 mins.' }
            ].map((faq, i) => (
              <div key={i} style={{ border: '1px solid #E7EAE3', borderRadius: '14px', padding: '14px', backgroundColor: '#FFFFFF' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#20251F', marginBottom: '4px' }}>
                  {faq.q}
                </div>
                <div style={{ fontSize: '12px', color: '#73796F', lineHeight: 1.45 }}>
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==============================================================
          MODALS
          ============================================================== */}

      {/* 1. Edit Profile Modal */}
      {isEditingProfile && (
        <div className="nivvo-modal-overlay" onClick={() => setIsEditingProfile(false)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
                Edit Personal Profile
              </h3>
              <button className="nivvo-modal-close-btn" onClick={() => setIsEditingProfile(false)}>✕</button>
            </div>
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name} 
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>Phone Number</label>
                <input 
                  type="text" 
                  value={editForm.phone} 
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', marginTop: '4px' }}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>Email Address</label>
                <input 
                  type="email" 
                  value={editForm.email} 
                  onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', marginTop: '4px' }}
                />
              </div>
              <button 
                type="submit"
                style={{ backgroundColor: '#20251F', color: '#FFFFFF', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '8px' }}
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add Address Modal */}
      {showAddAddressModal && (
        <div className="nivvo-modal-overlay" onClick={() => setShowAddAddressModal(false)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
                Add New Delivery Location
              </h3>
              <button className="nivvo-modal-close-btn" onClick={() => setShowAddAddressModal(false)}>✕</button>
            </div>
            <form onSubmit={handleAddAddress} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>Address Tag</label>
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                  {['Home', 'Work', 'Studio', 'Other'].map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewAddr({ ...newAddr, tag: t })}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '8px',
                        border: newAddr.tag === t ? '1.5px solid #20251F' : '1px solid #E7EAE3',
                        backgroundColor: newAddr.tag === t ? '#20251F' : '#F7F8F5',
                        color: newAddr.tag === t ? '#FFFFFF' : '#20251F',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>Location Title / Building Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Maple Court A-302"
                  value={newAddr.title} 
                  onChange={(e) => setNewAddr({ ...newAddr, title: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', marginTop: '4px' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>Street & Road Details</label>
                <input 
                  type="text" 
                  placeholder="e.g. 12th Main Road, HAL 2nd Stage"
                  value={newAddr.street} 
                  onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', marginTop: '4px' }}
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F' }}>Delivery Notes for Rider</label>
                <input 
                  type="text" 
                  placeholder="e.g. Ring bell, leave with security if away"
                  value={newAddr.note} 
                  onChange={(e) => setNewAddr({ ...newAddr, note: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px', marginTop: '4px' }}
                />
              </div>
              <button 
                type="submit"
                style={{ backgroundColor: '#B7F34A', color: '#20251F', padding: '12px', borderRadius: '12px', fontWeight: 800, fontSize: '14px', border: 'none', cursor: 'pointer', marginTop: '8px' }}
              >
                Save & Set as Active Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3. Cancel Order Modal */}
      {cancellingOrder && (
        <div className="nivvo-modal-overlay" onClick={() => setCancellingOrder(null)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#20251F' }}>
                Cancel Order {cancellingOrder.id}
              </h3>
              <button className="nivvo-modal-close-btn" onClick={() => setCancellingOrder(null)}>✕</button>
            </div>
            <p style={{ fontSize: '13px', color: '#73796F', margin: '4px 0 16px 0' }}>
              Please tell us why you need to cancel. ₹{cancellingOrder.total} will be refunded to your Nivvo Wallet immediately.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
              {[
                'Need to change delivery address',
                'Ordered wrong shoe size or variant',
                'ETA too late for my schedule',
                'Found alternate item in another local shop',
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
                onClick={() => setCancellingOrder(null)}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: '1px solid #E7EAE3', backgroundColor: '#F7F8F5', fontWeight: 700, fontSize: '13px', cursor: 'pointer' }}
              >
                Keep Order
              </button>
              <button
                onClick={() => {
                  cancelOrder(cancellingOrder.id, cancelReason);
                  setCancellingOrder(null);
                }}
                style={{ flex: 1, padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#BD3838', color: '#FFFFFF', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
              >
                Confirm Cancellation
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Return / Size Exchange Modal */}
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
              Order {returnOrderTarget.id}. An Indiranagar rider will arrive in ~15 mins at your door with replacement.
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

      {/* 5. Rate & Review Modal */}
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
                  style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '28px' }}
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
              {['Perfect Fit', 'Lightning Delivery', 'Great Packaging', 'Doorstep Trial Used', 'Polite Rider'].map((t) => {
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
                    {t} {active ? '✓' : '+'}
                  </button>
                );
              })}
            </div>

            <textarea
              placeholder="Tell us about the fit, quality, or delivery speed..."
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
                backgroundColor: '#B7F34A',
                color: '#20251F',
                border: 'none',
                padding: '14px',
                borderRadius: '12px',
                fontWeight: 800,
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              Submit Verified Review
            </button>
          </div>
        </div>
      )}

      {/* 6. Tax Invoice Receipt Modal */}
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
                <span style={{ color: '#14281C', fontWeight: 600 }}>{profile?.name || currentUser?.name || 'Aarav Shah'}</span>
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
                downloadReceiptPdf(selectedInvoiceOrder, profile || currentUser);
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

      {/* 7. Live Support Chat Sheet */}
      {showSupportChat && (
        <div className="nivvo-modal-overlay" onClick={() => setShowSupportChat(false)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()} style={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
            <div className="nivvo-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#238636' }} />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#20251F' }}>
                  Indiranagar Resolution Desk
                </h3>
              </div>
              <button className="nivvo-modal-close-btn" onClick={() => setShowSupportChat(false)}>✕</button>
            </div>

            {/* Chat Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {supportMessages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    backgroundColor: msg.sender === 'user' ? '#20251F' : '#F0F3ED',
                    color: msg.sender === 'user' ? '#FFFFFF' : '#20251F',
                    padding: '10px 14px',
                    borderRadius: '14px',
                    fontSize: '12px',
                    lineHeight: 1.4
                  }}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSendSupport} style={{ display: 'flex', gap: '8px', borderTop: '1px solid #E7EAE3', paddingTop: '12px' }}>
              <input 
                type="text" 
                placeholder="Type your question..."
                value={supportInput}
                onChange={(e) => setSupportInput(e.target.value)}
                style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #E7EAE3', fontSize: '13px' }}
              />
              <button
                type="submit"
                style={{ backgroundColor: '#24452D', color: '#FFFFFF', border: 'none', borderRadius: '10px', padding: '0 16px', fontWeight: 800, fontSize: '13px', cursor: 'pointer' }}
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
