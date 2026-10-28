import React, { useState } from 'react';
import { 
  Palette, 
  Layers, 
  Sliders, 
  Sparkles, 
  MapPin, 
  Clock, 
  ShoppingBag, 
  Truck, 
  Store, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  ChevronRight,
  ArrowRight,
  Eye,
  RefreshCw,
  Zap,
  Activity,
  PackageCheck,
  CreditCard,
  HeartHandshake
} from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';
import { playClickSound } from '../utils/audioEffects';

export default function AdminStudioView({ onNavigateScreen, onOpenCustomizer }) {
  const { config, presets, applyPreset, resetToNivvo } = useCustomization();
  const [selectedHub, setSelectedHub] = useState('hub-indiranagar');
  const [tab, setTab] = useState('screens'); // 'screens', 'brand-board', 'dark-stores'

  const DARK_STORE_HUBS = [
    {
      id: 'hub-indiranagar',
      name: 'Indiranagar Hub #14 (Primary)',
      address: '100ft Road, Indiranagar, Bengaluru',
      distance: '400m',
      eta: '12-14 mins',
      activeRiders: 18,
      stockSkus: '2,420 Items',
      status: 'High Velocity',
      efficiency: '99.4%'
    },
    {
      id: 'hub-koramangala',
      name: 'Koramangala Hub #08',
      address: '5th Block, 80ft Road, Bengaluru',
      distance: '1.2 km',
      eta: '15-18 mins',
      activeRiders: 14,
      stockSkus: '1,980 Items',
      status: 'Optimal',
      efficiency: '98.8%'
    },
    {
      id: 'hub-hsr',
      name: 'HSR Layout Hub #03',
      address: '27th Main, Sector 1, Bengaluru',
      distance: '2.1 km',
      eta: '18-20 mins',
      activeRiders: 12,
      stockSkus: '1,650 Items',
      status: 'Optimal',
      efficiency: '97.9%'
    },
    {
      id: 'hub-whitefield',
      name: 'Whitefield Pod #21',
      address: 'ITPL Main Road, Bengaluru',
      distance: '3.4 km',
      eta: '22-25 mins',
      activeRiders: 16,
      stockSkus: '2,800 Items',
      status: 'High Velocity',
      efficiency: '99.1%'
    }
  ];

  // The 16 Coordinated Screens from the Figma Design
  const COORDINATED_SCREENS = [
    // 8 Customer Screens
    {
      id: 'home',
      group: 'Customer',
      title: '1. Storefront Discovery Home',
      desc: 'Nivvo banner, categories, contextual ETA pill, local stock tags, search',
      badge: 'Discovery',
      icon: ShoppingBag,
      role: 'customer'
    },
    {
      id: 'categories',
      group: 'Customer',
      title: '2. All Departments Hub',
      desc: 'Left vertical category rail + categorized product shelves',
      badge: 'Catalog',
      icon: Layers,
      role: 'customer'
    },
    {
      id: 'ai-fit',
      group: 'Customer',
      title: '3. AI Fit & Silhouette Studio',
      desc: 'Biometric sliders (Height/Weight) + dynamic 2D silhouette fit locker',
      badge: 'AI Smart',
      icon: Sparkles,
      role: 'customer'
    },
    {
      id: 'trial',
      group: 'Customer',
      title: '4. Doorstep 2-Size Trial Studio',
      desc: 'Pair adjacent sizes (M+L) for ₹0 doorstep try-on & instant returns',
      badge: 'Try & Buy',
      icon: HeartHandshake,
      role: 'customer'
    },
    {
      id: 'sos',
      group: 'Customer',
      title: '5. Fashion SOS Emergency Center',
      desc: 'Ready-to-wear emergency kits dispatched in 7-9 contextual minutes',
      badge: 'Emergency',
      icon: Zap,
      role: 'customer'
    },
    {
      id: 'cart-preview',
      group: 'Customer',
      title: '6. Slide-Over Cart & Trial Ledger',
      desc: 'Review 2-size trial pairs, bill breakdown, and instant coupon vouchers',
      badge: 'Checkout',
      icon: PackageCheck,
      role: 'customer'
    },
    {
      id: 'payment-modal',
      group: 'Customer',
      title: '7. Indian Rupee Payment Gateway',
      desc: 'UPI (GPay/PhonePe), Credit/Debit, NetBanking with real bank simulator',
      badge: 'Payments',
      icon: CreditCard,
      role: 'customer'
    },
    {
      id: 'orders',
      group: 'Customer',
      title: '8. Live Dispatch & GPS Rider Tracker',
      desc: 'Live 10-minute scooter map, ticking countdown, delivery OTP & instant refund',
      badge: 'Tracking',
      icon: Truck,
      role: 'customer'
    },

    // 3 Shop-Owner Dashboards
    {
      id: 'shop-owner',
      subView: 'status',
      group: 'Shop-Owner',
      title: '9. Store Operations & Live GMV',
      desc: 'Store open/closed toggle, today’s gross sales, queue volume & live metrics',
      badge: 'Operations',
      icon: Store,
      role: 'shop-owner'
    },
    {
      id: 'shop-owner',
      subView: 'inventory',
      group: 'Shop-Owner',
      title: '10. Local Stock & Inventory Console',
      desc: 'Real-time stock by size (S/M/L/XL), low stock alerts & catalog manager',
      badge: 'Inventory',
      icon: Layers,
      role: 'shop-owner'
    },
    {
      id: 'shop-owner',
      subView: 'fulfillment',
      group: 'Shop-Owner',
      title: '11. Order Fulfillment & Payouts',
      desc: 'Accept orders, pack items, handover to rider & daily direct settlement',
      badge: 'Settlements',
      icon: CheckCircle2,
      role: 'shop-owner'
    },

    // 3 Delivery-Partner Screens
    {
      id: 'delivery-partner',
      subView: 'duty',
      group: 'Delivery-Partner',
      title: '12. Rider Duty & Zone Minimum Guarantee',
      desc: 'Go online/offline, shift minimum guarantee (₹15,000) & wallet earnings',
      badge: 'Duty & Pay',
      icon: Activity,
      role: 'delivery-partner'
    },
    {
      id: 'delivery-partner',
      subView: 'navigation',
      group: 'Delivery-Partner',
      title: '13. Live Dispatch Queue & Navigation',
      desc: 'Hyperlocal pickup route, turn-by-turn map, customer address notes',
      badge: 'Navigation',
      icon: MapPin,
      role: 'delivery-partner'
    },
    {
      id: 'delivery-partner',
      subView: 'doorstep-handover',
      group: 'Delivery-Partner',
      title: '14. Doorstep Trial Handover & OTP',
      desc: '15-min try-on countdown, return item scan, customer OTP verification',
      badge: 'Handover',
      icon: ShieldCheck,
      role: 'delivery-partner'
    },

    // 2 Platform-Admin Dashboards
    {
      id: 'admin-brand',
      group: 'Platform Admin',
      title: '15. Nivvo Brand System & Live Studio',
      desc: 'Custom color palettes, brand typography, logo, layout visibility & JSON config',
      badge: 'Brand Studio',
      icon: Palette,
      role: 'admin'
    },
    {
      id: 'admin-network',
      group: 'Platform Admin',
      title: '16. Dark Store Network & Contextual ETA',
      desc: 'Hyperlocal dark store radius rules, weather speed adjustments & fleet density',
      badge: 'Network Ops',
      icon: Sliders,
      role: 'admin'
    }
  ];

  const handleLaunchScreen = (screen) => {
    playClickSound();
    if (screen.id === 'admin-brand') {
      onOpenCustomizer();
    } else if (screen.id === 'admin-network') {
      setTab('dark-stores');
    } else {
      onNavigateScreen(screen.id, screen.role);
    }
  };

  return (
    <div className="admin-studio-container">
      {/* Top Banner Header */}
      <div className="admin-studio-header">
        <div className="admin-header-title-col">
          <div className="admin-identity-badge">
            <span className="badge-pulse-dot" />
            <span>Figma AI Coordinated Architecture</span>
          </div>
          <h1 className="admin-main-title">
            <span style={{ color: config.colors?.primary || '#0C831F' }}>{config.appName}</span> Marketplace System
          </h1>
          <p className="admin-sub-title">
            16 Coordinated Screens & Brand-System Board • Hyperlocal Dark Stores • Indian Rupee ({config.currencySymbol}) Pricing
          </p>
        </div>

        <div className="admin-header-actions">
          <button 
            className="admin-studio-btn secondary"
            onClick={() => { playClickSound(); resetToNivvo(); }}
          >
            <RefreshCw size={14} />
            <span>Reset to Nivvo</span>
          </button>
          <button 
            className="admin-studio-btn primary"
            onClick={() => { playClickSound(); onOpenCustomizer(); }}
          >
            <Palette size={14} />
            <span>Live Theme Studio</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="admin-tab-nav">
        <button 
          className={`admin-nav-item ${tab === 'screens' ? 'active' : ''}`}
          onClick={() => { playClickSound(); setTab('screens'); }}
        >
          <Layers size={15} />
          <span>16-Screen Matrix</span>
          <span className="tab-count-pill">16</span>
        </button>
        <button 
          className={`admin-nav-item ${tab === 'brand-board' ? 'active' : ''}`}
          onClick={() => { playClickSound(); setTab('brand-board'); }}
        >
          <Sparkles size={15} />
          <span>Nivvo Brand-System Board</span>
        </button>
        <button 
          className={`admin-nav-item ${tab === 'dark-stores' ? 'active' : ''}`}
          onClick={() => { playClickSound(); setTab('dark-stores'); }}
        >
          <Store size={15} />
          <span>Hyperlocal Dark Store Hubs</span>
          <span className="tab-count-pill">{DARK_STORE_HUBS.length}</span>
        </button>
      </div>

      {/* TAB 1: 16-SCREEN MATRIX */}
      {tab === 'screens' && (
        <div className="admin-tab-content">
          <div className="screens-summary-bar">
            <div className="summary-stat-box">
              <span className="stat-num">8</span>
              <span className="stat-lbl">Customer Screens</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-num">3</span>
              <span className="stat-lbl">Shop-Owner Consoles</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-num">3</span>
              <span className="stat-lbl">Delivery Fleet</span>
            </div>
            <div className="summary-stat-box">
              <span className="stat-num">2</span>
              <span className="stat-lbl">Platform Admin</span>
            </div>
          </div>

          <div className="screens-cards-grid">
            {COORDINATED_SCREENS.map((sc) => {
              const Icon = sc.icon;
              return (
                <div key={sc.title} className="screen-card-box">
                  <div className="screen-card-top">
                    <span className={`screen-group-tag ${sc.group.toLowerCase().replace(' ', '-')}`}>
                      {sc.group}
                    </span>
                    <span className="screen-badge-pill">{sc.badge}</span>
                  </div>

                  <div className="screen-card-body">
                    <div className="screen-icon-wrap" style={{ color: config.colors?.primary || '#0C831F' }}>
                      <Icon size={22} />
                    </div>
                    <div className="screen-details">
                      <h3 className="screen-title">{sc.title}</h3>
                      <p className="screen-desc">{sc.desc}</p>
                    </div>
                  </div>

                  <div className="screen-card-footer">
                    <button 
                      className="screen-launch-btn"
                      onClick={() => handleLaunchScreen(sc)}
                    >
                      <span>Open Screen</span>
                      <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BRAND-SYSTEM BOARD */}
      {tab === 'brand-board' && (
        <div className="admin-tab-content">
          <div className="brand-board-grid">
            {/* Color System */}
            <div className="brand-board-card">
              <h2 className="board-card-title">1. Color Palette Tokens</h2>
              <div className="swatches-collection">
                <div className="swatch-unit">
                  <div className="swatch-color" style={{ backgroundColor: config.colors?.primary || '#0C831F' }} />
                  <span className="swatch-label">Primary Brand</span>
                  <span className="swatch-hex">{config.colors?.primary || '#0C831F'}</span>
                </div>
                <div className="swatch-unit">
                  <div className="swatch-color" style={{ backgroundColor: config.colors?.secondary || '#10B981' }} />
                  <span className="swatch-label">Secondary Mint</span>
                  <span className="swatch-hex">{config.colors?.secondary || '#10B981'}</span>
                </div>
                <div className="swatch-unit">
                  <div className="swatch-color" style={{ backgroundColor: config.colors?.headerBg || '#096D19' }} />
                  <span className="swatch-label">Header Canvas</span>
                  <span className="swatch-hex">{config.colors?.headerBg || '#096D19'}</span>
                </div>
                <div className="swatch-unit">
                  <div className="swatch-color" style={{ backgroundColor: config.colors?.accentSoft || '#F0FDF4', border: '1px solid #CBD5E1' }} />
                  <span className="swatch-label">Soft Tint</span>
                  <span className="swatch-hex">{config.colors?.accentSoft || '#F0FDF4'}</span>
                </div>
              </div>
            </div>

            {/* Contextual ETA Rules */}
            <div className="brand-board-card">
              <h2 className="board-card-title">2. Contextual Delivery Estimates</h2>
              <p className="board-card-desc">Dynamic hyperlocal ETA based on rider GPS, dark store proximity, and neighborhood traffic.</p>
              <div className="eta-rules-table">
                <div className="eta-rule-row header">
                  <span>Proximity Radius</span>
                  <span>Contextual ETA</span>
                  <span>Assigned Hub</span>
                </div>
                <div className="eta-rule-row">
                  <span>Within 1.0 km</span>
                  <span className="eta-time-tag">⚡ 8 - 12 mins</span>
                  <span>Indiranagar Dark Store</span>
                </div>
                <div className="eta-rule-row">
                  <span>1.0 - 2.5 km</span>
                  <span className="eta-time-tag">🚗 12 - 18 mins</span>
                  <span>Koramangala Pod</span>
                </div>
                <div className="eta-rule-row">
                  <span>2.5 - 4.5 km</span>
                  <span className="eta-time-tag">🛵 20 - 25 mins</span>
                  <span>HSR Hyperlocal Hub</span>
                </div>
              </div>
            </div>

            {/* Indian Rupee Pricing & Trial Standard */}
            <div className="brand-board-card">
              <h2 className="board-card-title">3. Pricing & Doorstep Trial Standard</h2>
              <div className="trial-standard-list">
                <div className="standard-item">
                  <CheckCircle2 size={16} color="#10B981" />
                  <div>
                    <strong>Indian Rupee ({config.currencySymbol}) Standard:</strong> All GST taxes and hyperlocal dark store handling fees included in displayed price.
                  </div>
                </div>
                <div className="standard-item">
                  <CheckCircle2 size={16} color="#10B981" />
                  <div>
                    <strong>Free 2-Size Trial Service (₹0 Fee):</strong> Customers can order adjacent sizes (e.g. M + L). Rider waits 15 minutes at doorstep while they try both.
                  </div>
                </div>
                <div className="standard-item">
                  <CheckCircle2 size={16} color="#10B981" />
                  <div>
                    <strong>Instant UPI Refund:</strong> Returned size is inspected by delivery partner and refund credited instantly to customer UPI ID.
                  </div>
                </div>
              </div>
            </div>

            {/* Typography & Design Tokens */}
            <div className="brand-board-card">
              <h2 className="board-card-title">4. Typography & Shape Tokens</h2>
              <div className="typography-specs">
                <div className="type-row">
                  <span className="type-role">Font Family</span>
                  <span className="type-value">Outfit, Plus Jakarta Sans, Apple System</span>
                </div>
                <div className="type-row">
                  <span className="type-role">Border Radius</span>
                  <span className="type-value">{config.borderRadius || 12}px (Tailored Hyperlocal)</span>
                </div>
                <div className="type-row">
                  <span className="type-role">Elevation Shadows</span>
                  <span className="type-value">Clean Soft 0 2px 8px rgba(0,0,0,0.04)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: DARK STORE HUBS */}
      {tab === 'dark-stores' && (
        <div className="admin-tab-content">
          <div className="dark-stores-header-row">
            <div>
              <h2 className="dark-stores-heading">Hyperlocal Dark Store Hub Network</h2>
              <p className="dark-stores-subheading">Bengaluru Metropolitan Ward Coverage • Automated rider dispatch radius</p>
            </div>
            <span className="network-live-pill">
              <span className="pulse-green-dot" />
              <span>All 4 Hubs Operational</span>
            </span>
          </div>

          <div className="hubs-grid-cards">
            {DARK_STORE_HUBS.map((hub) => {
              const isSelected = selectedHub === hub.id;
              return (
                <div 
                  key={hub.id} 
                  className={`dark-hub-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => { playClickSound(); setSelectedHub(hub.id); }}
                >
                  <div className="hub-top-row">
                    <span className="hub-status-badge">{hub.status}</span>
                    <span className="hub-distance-pill">📍 {hub.distance}</span>
                  </div>

                  <h3 className="hub-name">{hub.name}</h3>
                  <p className="hub-address">{hub.address}</p>

                  <div className="hub-metrics-row">
                    <div className="metric-col">
                      <span className="metric-val">{hub.eta}</span>
                      <span className="metric-key">Average ETA</span>
                    </div>
                    <div className="metric-col">
                      <span className="metric-val">{hub.activeRiders}</span>
                      <span className="metric-key">Active Riders</span>
                    </div>
                    <div className="metric-col">
                      <span className="metric-val">{hub.efficiency}</span>
                      <span className="metric-key">Fulfillment</span>
                    </div>
                  </div>

                  <div className="hub-footer-row">
                    <span className="hub-skus">📦 {hub.stockSkus}</span>
                    <button 
                      className="hub-set-active-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        playClickSound();
                        setSelectedHub(hub.id);
                        config.hubName = hub.name;
                      }}
                    >
                      {isSelected ? '✓ Default Hub' : 'Set as Default'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
