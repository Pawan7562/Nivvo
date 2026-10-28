import React, { useState } from 'react';
import { 
  Phone, 
  ChevronRight, 
  ChevronLeft,
  ChevronDown,
  Edit3, 
  Save, 
  CheckCircle2, 
  DownloadCloud,
  Check,
  ShieldCheck,
  ExternalLink,
  Bike,
  Store
} from 'lucide-react';
import { updateProfile } from '../services/api';
import { playAddSound, playClickSound } from '../utils/audioEffects';

export default function ProfileView({ 
  user, 
  globalPreferredSize, 
  onApplyGlobalSize,
  walletBalance = 250,
  onOpenScratchCard,
  onNavigateView,
  appTheme = 'navy',
  setAppTheme,
  onBack,
  onOpenAddresses,
  onLogout,
  onOpenAuth
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || 'Aditya Verma');
  const [email, setEmail] = useState(user?.email || 'aditya.verma@example.com');
  const [heightCm, setHeightCm] = useState(178);
  const [weightKg, setWeightKg] = useState(74);
  const [fitPreference, setFitPreference] = useState('regular');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isThemePickerOpen, setIsThemePickerOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    playAddSound();
    await updateProfile({
      phone: user?.phone || '+91 9876543210',
      name,
      email,
      gender: 'men',
      height_cm: heightCm,
      weight_kg: weightKg,
      preferred_size: globalPreferredSize,
      fit_preference: fitPreference
    });
    setIsSaving(false);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const themesList = [
    { id: 'navy', name: 'Midnight Navy Blue', dot: '#0C2340', tag: 'Reference 1 & 2' },
    { id: 'classic', name: 'Nivvo Lime & Green', dot: '#B7F34A', tag: 'Official Brand' },
    { id: 'blush', name: 'Fashion Blush Pink', dot: '#F43F5E', tag: 'Reference 4' },
    { id: 'festive', name: 'Festive Maroon & Gold', dot: '#7A0C1E', tag: 'Diwali Special' },
    { id: 'minimal', name: 'Minimal Silver', dot: '#64748B', tag: 'Reference 3' }
  ];

  const handleBack = () => {
    playClickSound();
    if (onBack) {
      onBack();
    } else if (onNavigateView) {
      onNavigateView('home');
    }
  };

  return (
    <div className="blinkit-apk-profile-view">
      {/* 0. Native Toolbar (cw_page_v2.json: toolbar_config) */}
      <div className="apk-profile-toolbar">
        <button 
          className="apk-toolbar-back-btn" 
          onClick={handleBack}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#293142" />
        </button>
        <h1 className="apk-toolbar-title">Profile</h1>
      </div>

      <div className="apk-profile-scrollable-content">
        {/* 1. Header Card (cw_page_v2.json: profile_header) */}
        {!user ? (
          <div className="apk-profile-header-card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#F0FDF4', border: '2px solid #86EFAC', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px auto' }}>
              <Phone size={28} color="#0C831F" />
            </div>
            <h2 className="apk-profile-title" style={{ fontSize: '19px' }}>Log In to Your Account</h2>
            <p style={{ fontSize: '13px', color: '#64748B', margin: '6px 0 16px 0', lineHeight: 1.4 }}>
              Access your saved addresses, past orders, Doorstep 2-Size Trial, and VIP benefits
            </p>
            <button 
              className="apk-edit-profile-btn"
              style={{ background: '#0C831F', color: '#FFFFFF', borderColor: '#0C831F', padding: '11px 28px', fontWeight: 800, fontSize: '13px', borderRadius: '10px' }}
              onClick={() => { playClickSound(); if (onOpenAuth) onOpenAuth(); }}
            >
              Log In with Phone Number
            </button>
          </div>
        ) : (
          <div className="apk-profile-header-card">
            <div className="apk-profile-avatar-wrapper">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_v3_hero_image/profile_v3_hero_image_light.png" 
                alt="Profile Avatar" 
                className="apk-profile-avatar-img"
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=180&auto=format&fit=crop&q=80";
                }}
              />
            </div>

            <h2 className="apk-profile-title">{user.name || name}</h2>
            <div className="apk-profile-subtitle">
              <Phone size={13} color="#64748B" />
              <span>{user.phone || '+91 9876543210'}</span>
              <span className="dot-divider">•</span>
              <span className="verified-pill">
                <Check size={11} strokeWidth={3} /> Verified
              </span>
            </div>

            <button 
              className="apk-edit-profile-btn"
              onClick={() => { playClickSound(); setIsEditing(!isEditing); }}
            >
              <Edit3 size={13} />
              <span>{isEditing ? 'Cancel Edit' : 'Edit Biometrics & Fit Details'}</span>
            </button>

          {/* Collapsible Edit Biometrics Form */}
          {isEditing && (
            <div className="apk-edit-biometrics-form">
              <div className="apk-form-group">
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="apk-form-input"
                />
              </div>
              <div className="apk-form-group">
                <label>Email Address</label>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="apk-form-input"
                />
              </div>
              <div className="apk-form-grid-2">
                <div className="apk-form-group">
                  <label>Height (cm)</label>
                  <input 
                    type="number" 
                    value={heightCm} 
                    onChange={(e) => setHeightCm(e.target.value)} 
                    className="apk-form-input"
                  />
                </div>
                <div className="apk-form-group">
                  <label>Weight (kg)</label>
                  <input 
                    type="number" 
                    value={weightKg} 
                    onChange={(e) => setWeightKg(e.target.value)} 
                    className="apk-form-input"
                  />
                </div>
              </div>
              <div className="apk-form-group">
                <label>Preferred Size for AI Fit</label>
                <div className="apk-size-selector-row">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                    <button
                      key={sz}
                      className={`apk-size-chip ${globalPreferredSize === sz ? 'active' : ''}`}
                      onClick={() => {
                        playClickSound();
                        if (onApplyGlobalSize) onApplyGlobalSize(sz);
                      }}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
              <button 
                className="apk-save-btn" 
                onClick={handleSave} 
                disabled={isSaving}
              >
                <Save size={14} />
                <span>{isSaving ? 'Syncing to Neon Cloud DB...' : 'Save Biometrics'}</span>
              </button>
            </div>
          )}

          {savedSuccess && (
            <div className="apk-success-banner">
              <CheckCircle2 size={14} color="#0C831F" />
              <span>Profile & Biometrics saved to Neon PostgreSQL Database!</span>
            </div>
          )}
        </div>
      )}

        {/* 2. Top 3 Action Tiles (cw_page_v2.json lines 169-318: your_order_tile, blinkit_money_tile, need_help_tile) */}
        <div className="apk-three-tiles-grid">
          {/* Tile 1: Your Orders */}
          <div 
            className="apk-action-tile"
            onClick={() => { playClickSound(); if (onNavigateView) onNavigateView('orders'); }}
          >
            <div className="apk-tile-media">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_v3_your_orders/profile_v3_your_orders_light.png" 
                alt="Your orders" 
                className="apk-tile-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <span className="apk-tile-title">Your orders</span>
          </div>

          {/* Tile 2: Blinkit Money */}
          <div 
            className="apk-action-tile"
            onClick={() => { playClickSound(); if (onOpenScratchCard) onOpenScratchCard(); }}
          >
            <div className="apk-tile-media">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_v3_your_wallet/profile_v3_your_wallet_light.png" 
                alt="Nivvo Cash" 
                className="apk-tile-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <span className="apk-tile-title">Nivvo Cash</span>
          </div>

          {/* Tile 3: Need Help? */}
          <div 
            className="apk-action-tile"
            onClick={() => { playClickSound(); if (onNavigateView) onNavigateView('help'); }}
          >
            <div className="apk-tile-media">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_v3_support/profile_v3_support_light.png" 
                alt="Need help?" 
                className="apk-tile-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            </div>
            <span className="apk-tile-title">Need help?</span>
          </div>
        </div>

        {/* 3. In-App Update Banner (cw_page_v2.json: app_update) */}
        <div className="apk-app-update-card">
          <div className="update-card-left">
            <img 
              src="https://cdn.grofers.com/layout-engine/v2/2025-08/profile_v2_update_app/profile_v2_update_app_light.png" 
              alt="App Update" 
              className="update-media-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="update-text-wrap">
              <div className="update-card-title">App update available</div>
              <div className="update-card-sub">bug fixes and improvements</div>
            </div>
          </div>
          <span className="update-badge">UPDATE</span>
        </div>

        {/* 4. Appearance & Themes Accordion (cw_page_v2.json: appearance_collapsed) */}
        <div className="apk-menu-card">
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); setIsThemePickerOpen(!isThemePickerOpen); }}
          >
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-06/address.png" 
                alt="Appearance" 
                className="menu-row-icon-img"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="menu-row-title">Appearance</span>
            </div>
            <div className="menu-row-right">
              <span className="menu-theme-pill">{appTheme.toUpperCase()}</span>
              <ChevronDown 
                size={18} 
                color="#94A3B8" 
                style={{ transform: isThemePickerOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} 
              />
            </div>
          </div>

          {isThemePickerOpen && (
            <div className="theme-picker-drawer">
              {themesList.map((t) => (
                <div 
                  key={t.id} 
                  className={`theme-pick-item ${appTheme === t.id ? 'active' : ''}`}
                  onClick={() => { playClickSound(); if (setAppTheme) setAppTheme(t.id); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span className="theme-dot" style={{ backgroundColor: t.dot }} />
                    <span className="theme-name">{t.name}</span>
                  </div>
                  <span className="theme-tag">{t.tag}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 5. Group 1: YOUR INFORMATION (cw_page_v2.json lines 1128-1582) */}
        <div className="apk-menu-group-header">YOUR INFORMATION</div>
        <div className="apk-menu-card">
          {/* Address Book */}
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); if (onOpenAddresses) onOpenAddresses(); }}
          >
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_address_book/profile_address_book_light.png" 
                alt="Address book" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">Address book</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* Doorstep 2-Size Trial Bookings */}
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); if (onNavigateView) onNavigateView('trial'); }}
          >
            <div className="menu-row-left">
              <div className="custom-row-badge-icon teal">👔</div>
              <div>
                <span className="menu-row-title">Doorstep 2-Size Trial Bookings</span>
                <span className="menu-row-sub">Try adjacent sizes at home for ₹0</span>
              </div>
            </div>
            <div className="menu-row-right">
              <span className="menu-tag-badge green">ACTIVE</span>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* AI Fit Studio & Biometrics */}
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); if (onNavigateView) onNavigateView('ai-fit'); }}
          >
            <div className="menu-row-left">
              <div className="custom-row-badge-icon purple">✨</div>
              <div>
                <span className="menu-row-title">AI Fit Studio & Sizing</span>
                <span className="menu-row-sub">Your Calibrated Size: <strong>{globalPreferredSize}</strong></span>
              </div>
            </div>
            <div className="menu-row-right">
              <span className="menu-tag-badge purple">Size {globalPreferredSize}</span>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* Wishlist */}
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); if (onNavigateView) onNavigateView('wishlist'); }}
          >
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_heart/profile_heart_light.png" 
                alt="Your wishlist" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">Your wishlist</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* GST Details */}
          <div className="apk-menu-row">
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_gst_details/profile_gst_details_light.png" 
                alt="GST details" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">GST details</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* E-Gift Cards */}
          <div className="apk-menu-row">
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_gift_cards/profile_gift_cards_light.png" 
                alt="E-gift cards" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">E-gift cards</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>
        </div>

        {/* 6. Group 2: PAYMENT AND REWARDS (cw_page_v2.json lines 1584-1986) */}
        <div className="apk-menu-group-header">PAYMENT AND COUPONS</div>
        <div className="apk-menu-card">
          {/* Wallet */}
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); if (onOpenScratchCard) onOpenScratchCard(); }}
          >
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_wallet/profile_wallet_light.png" 
                alt="Wallet" 
                className="menu-row-icon-img"
              />
              <div>
                <span className="menu-row-title">Nivvo Cash Wallet</span>
                <span className="menu-row-sub">₹{walletBalance} Balance</span>
              </div>
            </div>
            <div className="menu-row-right">
              <span className="menu-tag-badge yellow">₹{walletBalance}</span>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* Mystery Scratch Cards */}
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); if (onOpenScratchCard) onOpenScratchCard(); }}
          >
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_coupon/profile_coupon_light.png" 
                alt="Mystery Scratch Cards" 
                className="menu-row-icon-img"
              />
              <div>
                <span className="menu-row-title">Mystery Scratch Cards</span>
                <span className="menu-row-sub">Instant cashback & discounts</span>
              </div>
            </div>
            <div className="menu-row-right">
              <span className="menu-tag-badge rose">1 Unscratched</span>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* Payment Settings */}
          <div className="apk-menu-row">
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_payments/profile_payments_light.png" 
                alt="Payment settings" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">Payment settings</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* Claim Gift Card */}
          <div className="apk-menu-row">
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_gift_cards/profile_gift_cards_light.png" 
                alt="Claim Gift card" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">Claim Gift card</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>
        </div>

        {/* 7. Group 3: FASHION SOS & SPEED PROMISE */}
        <div className="apk-menu-group-header">FASHION EMERGENCY & DISPATCH</div>
        <div className="apk-menu-card">
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); if (onNavigateView) onNavigateView('sos'); }}
          >
            <div className="menu-row-left">
              <div className="custom-row-badge-icon red">⚡</div>
              <div>
                <span className="menu-row-title">Fashion SOS 8-Min Wardrobe Rescue</span>
                <span className="menu-row-sub">Spilled coffee, torn seams, sudden meetings</span>
              </div>
            </div>
            <div className="menu-row-right">
              <span className="menu-tag-badge red">8 MINS</span>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          <div className="apk-menu-row">
            <div className="menu-row-left">
              <div className="custom-row-badge-icon green">🛡️</div>
              <div>
                <span className="menu-row-title">10-Minute Doorstep Guarantee</span>
                <span className="menu-row-sub">Indiranagar Dark Store #14 • On-time or ₹100 credit</span>
              </div>
            </div>
            <div className="menu-row-right">
              <span className="menu-tag-badge green">100% Guaranteed</span>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>
        </div>

        {/* 8. Group: GROW & PARTNER WITH NIVVO */}
        <div className="apk-menu-group-header">GROW & PARTNER WITH NIVVO</div>
        <div className="apk-menu-card">
          {/* Delivery Partner */}
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); if (onNavigateView) onNavigateView('delivery-partner'); }}
          >
            <div className="menu-row-left">
              <div className="custom-row-badge-icon green" style={{ background: '#DCFCE7', color: '#15803D' }}>
                <Bike size={18} />
              </div>
              <div>
                <span className="menu-row-title">Delivery Partner (Nivvo Fleet)</span>
                <span className="menu-row-sub">Earn up to ₹35,000/mo • Daily payouts & EV fleet perks</span>
              </div>
            </div>
            <div className="menu-row-right">
              <span className="menu-tag-badge green">EARN ₹35K</span>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* Shop / Merchant Partner */}
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); if (onNavigateView) onNavigateView('shop-owner'); }}
          >
            <div className="menu-row-left">
              <div className="custom-row-badge-icon amber" style={{ background: '#FEF3C7', color: '#B45309' }}>
                <Store size={18} />
              </div>
              <div>
                <span className="menu-row-title">Register Your Fashion Boutique / Shop</span>
                <span className="menu-row-sub">Sell to 50,000+ local fashion shoppers in 10 mins</span>
              </div>
            </div>
            <div className="menu-row-right">
              <span className="menu-tag-badge yellow">0% FEE M1</span>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>
        </div>

        {/* 9. Group 4: OTHER INFORMATION (cw_page_v2.json lines 2200-2815) */}
        <div className="apk-menu-group-header">OTHER INFORMATION</div>
        <div className="apk-menu-card">
          {/* Share the App */}
          <div className="apk-menu-row">
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_share_app/profile_share_app_light.png" 
                alt="Share the app" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">Share the app</span>
            </div>
            <div className="menu-row-right">
              <span className="menu-tag-badge orange">Earn ₹100</span>
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* About Us */}
          <div className="apk-menu-row">
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_about_us/profile_about_us_light.png" 
                alt="About us" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">About us</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* Account Privacy */}
          <div className="apk-menu-row">
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_v2_account_privacy/profile_v2_account_privacy_light.png" 
                alt="Account privacy" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">Account privacy</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="apk-menu-row">
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_bell/profile_bell_light.png" 
                alt="Notification preferences" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title">Notification preferences</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>

          {/* Log Out */}
          <div 
            className="apk-menu-row"
            onClick={() => { playClickSound(); setShowLogoutModal(true); }}
          >
            <div className="menu-row-left">
              <img 
                src="https://cdn.grofers.com/layout-engine/v2/2025-07/profile_logout/profile_logout_light.png" 
                alt="Log out" 
                className="menu-row-icon-img"
              />
              <span className="menu-row-title" style={{ color: '#DC2626' }}>Log out</span>
            </div>
            <div className="menu-row-right">
              <ChevronRight size={18} color="#94A3B8" />
            </div>
          </div>
        </div>

        {/* 9. Profile Footer Branding */}
        <div className="apk-profile-footer">
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
            <img 
              src="/assets/nivvo_header_logo.svg" 
              alt="Nivvo" 
              width="36" 
              height="36" 
              style={{ borderRadius: '10px' }} 
            />
            <span style={{ fontSize: '24px', fontWeight: 800, color: '#20251F', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>nivvo</span>
          </div>
          <div className="apk-footer-brand-title">Nivvo Quick Fashion</div>
          <div className="apk-footer-sub">v14.18.2 • 10-Minute Dark Store Network</div>
          <div className="apk-footer-db-status">⚡ Synced with Neon PostgreSQL Database</div>
        </div>
      </div>

      {/* Logout Confirmation Dialog (cw_page_v2.json: log_out dialog) */}
      {showLogoutModal && (
        <div className="modal-overlay" onClick={() => setShowLogoutModal(false)}>
          <div className="apk-logout-modal-card" onClick={(e) => e.stopPropagation()}>
            <h3 className="apk-logout-heading">Log out from?</h3>
            <div className="apk-logout-buttons">
              <button 
                className="apk-logout-option-btn primary"
                onClick={() => {
                  playClickSound();
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                }}
              >
                Current Device
              </button>
              <button 
                className="apk-logout-option-btn"
                onClick={() => {
                  playClickSound();
                  setShowLogoutModal(false);
                  if (onLogout) onLogout();
                }}
              >
                All Devices
              </button>
              <button 
                className="apk-logout-option-btn cancel"
                onClick={() => { playClickSound(); setShowLogoutModal(false); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
