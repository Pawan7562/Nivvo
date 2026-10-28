import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  LayoutDashboard, Store, Package, Bike, Users, Wallet, 
  Bell, Menu, X, ArrowLeft, ArrowUpRight
} from 'lucide-react';
import { playClickSound } from '../../utils/audioEffects';

export default function AdminLayout({ 
  currentTab = 'overview', 
  breadcrumb = 'Overview', 
  onBack, 
  children,
  onTabChange
}) {
  const { navigateTo, showToast } = useNivvo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} strokeWidth={1.8} />, route: 'admin-overview' },
    { id: 'sellers', label: 'Sellers & operations', icon: <Store size={17} strokeWidth={1.8} />, route: 'admin-sellers' },
    { id: 'orders', label: 'Orders', icon: <Package size={17} strokeWidth={1.8} />, tab: 'orders' },
    { id: 'delivery', label: 'Delivery network', icon: <Bike size={17} strokeWidth={1.8} />, tab: 'delivery' },
    { id: 'customers', label: 'Customers', icon: <Users size={17} strokeWidth={1.8} />, tab: 'customers' },
    { id: 'finance', label: 'Finance', icon: <Wallet size={17} strokeWidth={1.8} />, tab: 'finance' }
  ];

  const handleNavClick = (item) => {
    playClickSound();
    setMobileMenuOpen(false);
    if (item.route) {
      navigateTo(item.route);
    } else if (onTabChange) {
      onTabChange(item.tab);
    } else {
      showToast(`Admin Console: ${item.label} module`);
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
      {/* ─── DESKTOP SIDEBAR MATCHING FIGMA ─── */}
      <aside style={{
        width: '240px',
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #EAECE5',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 18px 24px',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50
      }} className="nivvo-admin-desktop-sidebar">
        {/* Top Branding Lockup */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', paddingLeft: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: '#C6F432',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#14281C',
              fontWeight: 900,
              fontSize: '18px'
            }}>
              ↗
            </div>
            <span style={{ fontSize: '20px', fontWeight: 900, letterSpacing: '-0.04em', color: '#14281C' }}>
              nivvo
            </span>
          </div>

          {/* Console Tag Pill */}
          <div style={{
            display: 'inline-block',
            backgroundColor: '#F3F4EE',
            border: '1px solid #E5E7DE',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            color: '#4B5563',
            marginBottom: '26px',
            marginLeft: '8px'
          }}>
            PLATFORM CONSOLE
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
                    gap: '12px',
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: isActive ? '#E8EFE5' : 'transparent',
                    color: isActive ? '#14281C' : '#5A6553',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '13px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
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

        {/* Bottom Region Status Card & Links matching Figma */}
        <div>
          {/* Bengaluru Region Status Card */}
          <div style={{
            backgroundColor: '#F5F6F2',
            border: '1px solid #EAECE5',
            borderRadius: '12px',
            padding: '14px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>
              Bengaluru region
            </div>
            <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', marginBottom: '10px' }}>
              12 zones · Live operations
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#E4E7DF',
              color: '#14281C',
              fontSize: '11px',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '999px'
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1E3827' }} />
              Network online
            </div>
          </div>

          {/* Help centre ↗ and Settings */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', paddingLeft: '8px' }}>
            <button 
              onClick={() => {
                playClickSound();
                showToast('Platform Console Documentation & Playbooks');
              }}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '12px',
                fontWeight: 500,
                color: '#5A6553',
                cursor: 'pointer',
                padding: 0
              }}
            >
              <span>Help centre</span>
              <ArrowUpRight size={13} />
            </button>

            <button 
              onClick={() => {
                playClickSound();
                showToast('Console configuration & security settings');
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '12px',
                fontWeight: 500,
                color: '#5A6553',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left'
              }}
            >
              Settings
            </button>
          </div>
        </div>
      </aside>

      {/* ─── MAIN CONTENT AREA ─── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        backgroundColor: '#FAFBF8',
        minHeight: '100vh'
      }}>
        {/* Top Header Bar matching Figma */}
        <header style={{
          height: '60px',
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nivvo-admin-mobile-toggle"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                padding: '4px',
                cursor: 'pointer'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {onBack && (
              <button 
                onClick={onBack}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: '#6B7265',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  marginRight: '6px'
                }}
              >
                <ArrowLeft size={16} />
              </button>
            )}

            <span style={{ fontSize: '13px', color: '#6B7265' }}>Platform</span>
            <span style={{ fontSize: '13px', color: '#B5BAC0' }}>/</span>
            <span style={{ fontSize: '13px', color: '#14281C', fontWeight: 600 }}>{breadcrumb}</span>
          </div>

          {/* Right Status Lockup matching Figma */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            <span style={{ fontSize: '12px', color: '#5A6553', fontWeight: 500 }}>
              25 Oct 2026 · 14:46 IST
            </span>

            <button 
              onClick={() => {
                playClickSound();
                showToast('Console alerts: All 12 clusters active');
              }}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                color: '#20251F'
              }}
              aria-label="Platform Alerts"
            >
              <Bell size={18} strokeWidth={1.8} />
            </button>

            {/* Admin Avatar in Figma (AK) */}
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              backgroundColor: '#1E2D24',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer'
            }} title="Admin (AK)">
              AK
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main style={{
          flex: 1,
          padding: '28px 36px 48px',
          maxWidth: '1440px',
          width: '100%',
          boxSizing: 'border-box',
          margin: '0 auto'
        }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .nivvo-admin-desktop-sidebar {
            display: none !important;
          }
          .nivvo-admin-mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
