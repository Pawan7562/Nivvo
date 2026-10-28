import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  MapPin, 
  Search, 
  X, 
  ChevronDown, 
  Heart, 
  Volume2, 
  VolumeX,
  Sparkles,
  Mic,
  Coins,
  User,
  Palette,
  Sliders,
  LayoutGrid,
  ShoppingBag,
  Laptop,
  HeartPulse,
  PartyPopper,
  Briefcase,
  Shirt,
  Footprints,
  Layers,
  Watch
} from 'lucide-react';
import { playClickSound, toggleSound } from '../utils/audioEffects';
import { useCustomization } from '../context/CustomizationContext';

const SEARCH_PLACEHOLDERS = [
  "Search sneakers, tech, fashion…",
  "Search Sole Street sneakers…",
  "Search Circuit House audio & chargers…",
  "Search Indiranagar linen shirts…"
];

export default function AppHeader({
  selectedLocation,
  onOpenLocationModal,
  searchQuery,
  setSearchQuery,
  onSelectProduct,
  products,
  wishlistCount,
  onOpenWishlist,
  onOpenAiFit,
  onOpenVoiceSearch,
  onOpenProfile,
  onOpenWallet,
  walletBalance = 250,
  appTheme = 'navy',
  setAppTheme,
  activeCategory = 'all',
  setActiveCategory,
  user,
  onOpenAuth
}) {
  const { config, setIsCustomizerOpen } = useCustomization();
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % SEARCH_PLACEHOLDERS.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const handleSoundToggle = () => {
    const nextState = !soundOn;
    setSoundOn(nextState);
    toggleSound(nextState);
    if (nextState) playClickSound();
  };

  const cycleTheme = () => {
    playClickSound();
    if (!setAppTheme) return;
    const themeOrder = ['navy', 'classic', 'blush', 'festive', 'minimal'];
    const currentIndex = themeOrder.indexOf(appTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    setAppTheme(themeOrder[nextIndex]);
  };

  const QUICK_SUB_TABS = [
    { id: 'all', label: 'All', icon: ShoppingBag },
    { id: 'casual', label: 'Men', icon: Shirt },
    { id: 'women', label: 'Women', icon: Sparkles },
    { id: 'footwear', label: 'Shoes & Slides', icon: Footprints },
    { id: 'electronics', label: 'Electronics', icon: Laptop },
    { id: 'formal', label: 'Formals', icon: Briefcase },
    { id: 'festive', label: 'Festive', icon: Sparkles },
    { id: 'accessories', label: 'Accessories', icon: Watch },
    { id: 'sos', label: 'Fashion SOS', icon: Zap }
  ];

  const searchResults = searchQuery.trim().length > 0
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  return (
    <header className={`mobile-app-header theme-${appTheme}`}>
      {/* Top App Bar Row - Exact Blinkit Architecture */}
      <div className="app-header-top-row">
        {/* Left: Nivvo Brand Wordmark & Delivering to Home */}
        <div 
          className="nivvo-header-left-col"
          onClick={() => { playClickSound(); onOpenLocationModal(); }}
        >
          <div className="nivvo-brand-wordmark" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <img 
              src="/assets/nivvo_header_logo.svg" 
              alt="Nivvo" 
              width="24" 
              height="24" 
              style={{ borderRadius: '6px', display: 'block', flexShrink: 0 }} 
            />
            <span className="wordmark-text">{config.appName || 'nivvo'}</span>
          </div>
          <div className="nivvo-deliver-tag">DELIVERING TO</div>
          <div className="nivvo-address-row">
            <span className="address-full-text">Home · Indiranagar ⌄ Bengaluru</span>
          </div>
        </div>

        {/* Right: Wallet Balance, Theme Switcher & Profile Avatar */}
        <div className="app-header-right-actions">
          {/* Live Studio / Customizer Pill Button */}
          <button 
            className="app-customizer-pill-btn" 
            onClick={() => { playClickSound(); setIsCustomizerOpen(true); }}
            title="Open Live App Customizer Studio"
          >
            <Sliders size={13} />
            <span className="customizer-btn-text">Studio</span>
          </button>

          {/* Fashion Wallet Badge */}
          <button 
            className="app-wallet-pill-btn" 
            onClick={() => { playClickSound(); if (onOpenWallet) onOpenWallet(); else onOpenProfile(); }}
            title="Fashion Cash - Tap to Scratch Mystery Card"
          >
            <Coins size={13} color="#D97706" />
            <span className="wallet-amount">{config.currencySymbol || '₹'}{walletBalance}</span>
          </button>

          {/* Quick Theme Switcher Icon */}
          <button 
            className="app-icon-round-btn theme-cycle-btn" 
            onClick={() => { playClickSound(); setIsCustomizerOpen(true); }}
            title="App Customizer & Theme Studio"
          >
            <Palette size={15} />
          </button>

          {/* User Profile Avatar / Login Button */}
          {!user ? (
            <button 
              className="app-header-login-btn" 
              onClick={() => { playClickSound(); if (onOpenAuth) onOpenAuth(); else onOpenProfile(); }}
              title="Log In or Sign Up"
            >
              <User size={13} style={{ marginRight: '4px' }} />
              <span>Login</span>
            </button>
          ) : (
            <button 
              className="app-profile-avatar-btn" 
              onClick={() => { playClickSound(); onOpenProfile(); }}
              title="Account & Orders"
            >
              <div className="avatar-circle">
                <User size={15} color="#0F172A" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* In-App Mobile Search Bar with Voice Search Mic */}
      <div className="app-header-search-row">
        <div className="app-search-input-wrap">
          <Search size={16} color="#64748B" />
          <input 
            type="text" 
            className="app-search-input"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowDropdown(true);
            }}
            onFocus={() => setShowDropdown(true)}
            placeholder={SEARCH_PLACEHOLDERS[placeholderIndex]}
          />
          {searchQuery ? (
            <button 
              className="app-search-clear-btn" 
              onClick={() => {
                setSearchQuery('');
                setShowDropdown(false);
              }}
            >
              <X size={14} />
            </button>
          ) : (
            <button 
              className="app-voice-mic-btn"
              onClick={() => { playClickSound(); onOpenVoiceSearch(); }}
              title="Voice Search (Advance Feature)"
            >
              <Mic size={15} color="#0C831F" />
            </button>
          )}
        </div>

        {/* Search Results Dropdown */}
        {showDropdown && searchResults.length > 0 && (
          <div className="app-search-dropdown">
            <div className="app-search-dropdown-header">
              ⚡ 10-Minute Dark Store Matches
            </div>
            {searchResults.map((item) => (
              <div 
                key={item.id} 
                className="app-search-drop-item"
                onClick={() => {
                  onSelectProduct(item);
                  setShowDropdown(false);
                }}
              >
                <img src={item.image} alt={item.name} className="app-search-drop-img" />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="app-search-drop-name">{item.name}</div>
                  <div className="app-search-drop-meta">
                    <span className="drop-time">⚡ {item.deliveryTime}</span> • ₹{item.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Category Sub-Tabs Strip (Exact Reference from Screenshot 1 & 2) */}
      {setActiveCategory && (
        <div className="app-header-subtabs-row">
          {QUICK_SUB_TABS.map((tab) => {
            const isTabActive = activeCategory === tab.id;
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`header-subtab-chip ${isTabActive ? 'active' : ''}`}
                onClick={() => {
                  playClickSound();
                  setActiveCategory(tab.id);
                  document.getElementById('products-section-anchor')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <TabIcon size={14} className="subtab-icon" />
                <span className="subtab-label">{tab.label}</span>
                {isTabActive && <span className="subtab-active-indicator" />}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
