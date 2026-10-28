import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MapPin, 
  Search, 
  X, 
  ShoppingBag, 
  Sparkles, 
  AlertCircle, 
  ChevronDown, 
  User,
  ShieldCheck,
  Heart,
  Volume2,
  VolumeX,
  Package,
  Layers,
  Home,
  Grid,
  HelpCircle
} from 'lucide-react';
import { playClickSound, toggleSound, isSoundEnabled } from '../utils/audioEffects';

const SEARCH_PLACEHOLDERS = [
  "Search 'Crisp white formal shirt'",
  "Search 'Emergency coffee spill kit'",
  "Search 'EVA cloud slides & slippers'",
  "Search 'Minimalist canvas sneakers'",
  "Search 'Full-grain leather belt & wallet'",
  "Search 'Korean wide-leg cargo pants'",
  "Search 'Supima cotton trunks & socks'"
];

export default function Navbar({ 
  selectedLocation, 
  onOpenLocationModal, 
  cartCount, 
  cartTotal, 
  onOpenCart, 
  searchQuery, 
  setSearchQuery, 
  onSelectProduct, 
  products, 
  onOpenSizeAdvisor,
  onOpenAuth,
  user,
  activeView,
  setActiveView,
  wishlistCount
}) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleTabClick = (viewId) => {
    playClickSound();
    setActiveView(viewId);
  };

  const handleSoundToggle = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    toggleSound(nextState);
    if (nextState) playClickSound();
  };

  const searchResults = searchQuery.trim().length > 0 
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <header className="blink-navbar">
      {/* Main Top Nav */}
      <div className="blink-nav-inner">
        {/* Brand Logo */}
        <div className="brand-logo-wrap" onClick={() => handleTabClick('home')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img 
            src="/assets/nivvo_header_logo.svg" 
            alt="Nivvo" 
            width="32" 
            height="32" 
            style={{ borderRadius: '8px', display: 'block', flexShrink: 0 }} 
          />
          <div className="brand-text-col">
            <div className="brand-title" style={{ fontFamily: 'Inter, sans-serif', letterSpacing: '-0.5px' }}>
              <span style={{ color: '#20251F', fontWeight: 800, fontSize: '20px' }}>nivvo</span>
            </div>
            <span className="brand-tagline">10 Min Fashion</span>
          </div>
        </div>

        {/* Location Picker Button */}
        <button 
          className="location-selector-btn" 
          onClick={onOpenLocationModal}
          title="Change delivery address"
        >
          <div className="location-time-badge">
            <Zap size={14} className="lightning" fill="#EAB308" />
            <span>10 MINS</span>
          </div>
          <div className="location-address-row">
            <span style={{ fontWeight: 600 }}>{selectedLocation.tag}:</span> {selectedLocation.shortAddress}
            <ChevronDown size={14} color="#6B7280" />
          </div>
        </button>

        {/* Blinkit Search Bar */}
        <div className="nav-search-bar">
          <div className="search-input-wrap">
            <Search size={18} color="#6B7280" />
            <input 
              type="text" 
              className="search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
            />
            {searchQuery && (
              <button 
                className="search-clear-btn" 
                onClick={() => {
                  setSearchQuery('');
                  setShowDropdown(false);
                }}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && searchResults.length > 0 && (
            <div className="search-dropdown">
              <div style={{ padding: '8px 14px', fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>
                Instant 10-Min Matches
              </div>
              {searchResults.map((item) => (
                <div 
                  key={item.id} 
                  className="search-drop-item"
                  onClick={() => {
                    onSelectProduct(item);
                    setShowDropdown(false);
                  }}
                >
                  <img src={item.image} alt={item.name} className="search-drop-img" />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: '#6B7280' }}>
                      <span style={{ color: '#0C831F', fontWeight: 700 }}>⚡ {item.deliveryTime}</span> • ₹{item.price}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Nav Actions */}
        <div className="nav-actions">
          {/* Audio Feedback Toggle */}
          <button 
            className="sound-toggle-btn"
            onClick={handleSoundToggle}
            title={soundOn ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          >
            {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* User Account */}
          <button 
            className="nav-tool-btn"
            onClick={() => handleTabClick('profile')}
          >
            <User size={15} />
            <span>{user ? user.name : 'Profile'}</span>
          </button>

          {/* Blinkit Green Cart Pill */}
          <button 
            className="blink-cart-btn" 
            onClick={onOpenCart}
            id="cart-trigger-btn"
          >
            <div className="cart-icon-wrap">
              <ShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="cart-badge-dot">{cartCount}</span>
              )}
            </div>
            <span>{cartCount > 0 ? `${cartCount} items` : 'My Cart'}</span>
            {cartCount > 0 && (
              <span className="cart-btn-price">₹{cartTotal}</span>
            )}
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs Bar (All Section Pages) */}
      <nav className="nav-tabs-bar">
        <div className="nav-tabs-inner">
          <button 
            className={`nav-tab-item ${activeView === 'home' ? 'active' : ''}`}
            onClick={() => handleTabClick('home')}
          >
            <Home size={15} />
            <span>Storefront</span>
          </button>

          <button 
            className={`nav-tab-item ${activeView === 'categories' ? 'active' : ''}`}
            onClick={() => handleTabClick('categories')}
          >
            <Grid size={15} />
            <span>All Departments</span>
          </button>

          <button 
            className={`nav-tab-item ${activeView === 'sos' ? 'active' : ''}`}
            onClick={() => handleTabClick('sos')}
          >
            <AlertCircle size={15} color="#E11D48" />
            <span style={{ color: '#E11D48' }}>Fashion SOS</span>
            <span className="nav-tab-badge" style={{ background: '#FFE4E6', color: '#9F1239' }}>7 MINS</span>
          </button>

          <button 
            className={`nav-tab-item ${activeView === 'trial' ? 'active' : ''}`}
            onClick={() => handleTabClick('trial')}
          >
            <Layers size={15} />
            <span>2-Size Trial Studio</span>
          </button>

          <button 
            className={`nav-tab-item ${activeView === 'ai-fit' ? 'active' : ''}`}
            onClick={() => handleTabClick('ai-fit')}
          >
            <Sparkles size={15} color="#D97706" />
            <span>AI Fit Studio</span>
          </button>

          <button 
            className={`nav-tab-item ${activeView === 'orders' ? 'active' : ''}`}
            onClick={() => handleTabClick('orders')}
          >
            <Package size={15} />
            <span>My Orders</span>
          </button>

          <button 
            className={`nav-tab-item ${activeView === 'wishlist' ? 'active' : ''}`}
            onClick={() => handleTabClick('wishlist')}
          >
            <Heart size={15} color={wishlistCount > 0 ? '#E11D48' : 'currentColor'} fill={wishlistCount > 0 ? '#E11D48' : 'none'} />
            <span>Saved Outfits</span>
            {wishlistCount > 0 && <span className="nav-tab-badge">{wishlistCount}</span>}
          </button>

          <button 
            className={`nav-tab-item ${activeView === 'profile' ? 'active' : ''}`}
            onClick={() => handleTabClick('profile')}
          >
            <User size={15} />
            <span>VIP Profile</span>
          </button>

          <button 
            className={`nav-tab-item ${activeView === 'help' ? 'active' : ''}`}
            onClick={() => handleTabClick('help')}
          >
            <HelpCircle size={15} />
            <span>24x7 Help</span>
          </button>
        </div>
      </nav>
    </header>
  );
}
