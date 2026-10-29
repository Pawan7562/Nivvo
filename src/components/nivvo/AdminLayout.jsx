import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  LayoutDashboard, Store, Package, Bike, Users, Wallet, 
  Bell, Menu, X, ArrowLeft, ArrowUpRight, ShieldCheck, LogOut, ExternalLink, Activity
} from 'lucide-react';
import { playClickSound } from '../../utils/audioEffects';

export default function AdminLayout({ 
  currentTab = 'overview', 
  breadcrumb = 'Overview', 
  onBack, 
  children,
  onTabChange
}) {
  const { navigateTo, showToast, logout, logoutUser, currentUser } = useNivvo();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    playClickSound();
    setMobileMenuOpen(false);
    if (typeof logoutUser === 'function') {
      logoutUser();
    } else if (typeof logout === 'function') {
      logout();
    } else {
      localStorage.removeItem('nivvo_user');
      localStorage.removeItem('nivvo_token');
      navigateTo('landing');
      showToast('Signed out of Admin Console');
    }
  };

  const navItems = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard size={20} strokeWidth={2} />, route: 'admin-overview' },
    { id: 'sellers', label: 'Merchants & Operations', icon: <Store size={20} strokeWidth={2} />, route: 'admin-sellers' },
    { id: 'orders', label: 'Orders & Dispatch', icon: <Package size={20} strokeWidth={2} />, route: 'admin-orders' },
    { id: 'delivery', label: 'Delivery Network', icon: <Bike size={20} strokeWidth={2} />, route: 'admin-delivery' },
    { id: 'customers', label: 'Customer Base', icon: <Users size={20} strokeWidth={2} />, route: 'admin-customers' },
    { id: 'finance', label: 'Financial Settlement', icon: <Wallet size={20} strokeWidth={2} />, route: 'admin-finance' }
  ];

  const handleNavClick = (item) => {
    playClickSound();
    setMobileMenuOpen(false);
    if (item.route) {
      navigateTo(item.route);
    } else if (onTabChange) {
      onTabChange(item.tab);
    } else {
      navigateTo(`admin-${item.id}`);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      width: '100%',
      backgroundColor: '#F8FAFC',
      color: '#0F172A',
      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* ─── DESKTOP ENTERPRISE SIDEBAR ─── */}
      <aside style={{
        width: '280px',
        flexShrink: 0,
        backgroundColor: '#FFFFFF',
        borderRight: '1px solid #E2E8F0',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '28px 20px 24px',
        boxSizing: 'border-box',
        position: 'sticky',
        top: 0,
        height: '100vh',
        zIndex: 50,
        boxShadow: '1px 0 3px rgba(0,0,0,0.02)'
      }} className="nivvo-admin-desktop-sidebar">
        {/* Top Branding Lockup */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px', paddingLeft: '8px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: '#0F172A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#C6F432',
              fontWeight: 900,
              fontSize: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              N
            </div>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 900, letterSpacing: '-0.04em', color: '#0F172A', lineHeight: 1.1 }}>
                nivvo
              </div>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748B', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                Operations Console
              </div>
            </div>
          </div>

          {/* Console Tag Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#F1F5F9',
            border: '1px solid #E2E8F0',
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: '#334155',
            marginBottom: '26px',
            marginLeft: '8px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
            ENTERPRISE PLATFORM · V2.4
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
                    backgroundColor: isActive ? '#0F172A' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#475569',
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '15px',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = '#F1F5F9';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span style={{ 
                    color: isActive ? '#C6F432' : '#64748B', 
                    display: 'flex', 
                    alignItems: 'center' 
                  }}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                  {isActive && (
                    <span style={{ 
                      marginLeft: 'auto', 
                      width: '6px', 
                      height: '6px', 
                      borderRadius: '50%', 
                      backgroundColor: '#C6F432' 
                    }} />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Region Status Card & Links */}
        <div>
          {/* Bengaluru Region Status Card */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '18px'
          }}>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Bengaluru Hub</span>
              <Activity size={16} color="#16A34A" />
            </div>
            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px', marginBottom: '12px' }}>
              12 Active Logistics Clusters
            </div>

            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#DCFCE7',
              color: '#166534',
              fontSize: '12px',
              fontWeight: 700,
              padding: '5px 12px',
              borderRadius: '999px'
            }}>
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
              All Systems Optimal
            </div>
          </div>

          {/* Admin Identity & Sign Out Card */}
          <div style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '14px',
            padding: '14px',
            marginBottom: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              position: 'relative',
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              fontSize: '15px',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              AD
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#16A34A',
                border: '2px solid #FFFFFF'
              }} />
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'Platform Admin'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.email || 'admin@nivvo.com'}
              </div>
            </div>
          </div>

          {/* Dedicated Sign Out Button */}
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              padding: '12px 16px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#DC2626',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px',
              transition: 'background-color 0.15s ease'
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
          >
            <LogOut size={16} color="#DC2626" />
            <span>Sign Out</span>
          </button>

          {/* Storefront Link */}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 4px' }}>
            <button 
              onClick={() => {
                playClickSound();
                navigateTo('landing');
              }}
              style={{
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#64748B',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              <ExternalLink size={13} color="#64748B" />
              <span>Customer Storefront</span>
            </button>

            <button 
              onClick={() => {
                playClickSound();
                showToast('Console Docs & Operations Manual');
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: '#64748B',
                cursor: 'pointer',
                padding: '4px 0'
              }}
            >
              Docs
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
        backgroundColor: '#F8FAFC',
        minHeight: '100vh'
      }}>
        {/* Top Header Bar */}
        <header style={{
          height: '72px',
          backgroundColor: '#FFFFFF',
          borderBottom: '1px solid #E2E8F0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 44px',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
        }}>
          {/* Breadcrumb & Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="nivvo-admin-mobile-toggle"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                padding: '6px',
                cursor: 'pointer',
                color: '#0F172A'
              }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {onBack && (
              <button 
                onClick={onBack}
                style={{
                  background: '#F1F5F9',
                  border: '1px solid #E2E8F0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#334155',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: '6px 12px',
                  marginRight: '8px'
                }}
              >
                <ArrowLeft size={16} />
                <span>Return</span>
              </button>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '15px' }}>
              <span style={{ color: '#64748B', fontWeight: 500 }}>Platform Administration</span>
              <span style={{ color: '#CBD5E1' }}>/</span>
              <span style={{ color: '#0F172A', fontWeight: 700 }}>{breadcrumb}</span>
            </div>
          </div>

          {/* Right Status Lockup */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F1F5F9',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '13px',
              color: '#334155',
              fontWeight: 600
            }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
              <span>Fulfillment SLA: 98.4%</span>
            </div>

            <button 
              onClick={() => {
                playClickSound();
                showToast('System Notifications: All clusters functioning at target SLA');
              }}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '8px',
                cursor: 'pointer',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#334155'
              }}
              aria-label="Platform Alerts"
            >
              <Bell size={20} strokeWidth={2} />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                width: '8px',
                height: '8px',
                backgroundColor: '#EF4444',
                borderRadius: '50%',
                border: '2px solid #FFFFFF'
              }} />
            </button>

            {/* Admin Avatar & Name */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              paddingLeft: '14px',
              borderLeft: '1px solid #E2E8F0'
            }}>
              <div style={{
                position: 'relative',
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '14px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }} title="Operations Admin">
                AD
                <span style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  backgroundColor: '#16A34A',
                  border: '2px solid #FFFFFF'
                }} />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', lineHeight: 1.2 }}>
                  {currentUser?.name || 'Platform Admin'}
                </div>
                <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>
                  Operations Lead
                </div>
              </div>

              {/* Direct Header Sign Out Button */}
              <button
                onClick={handleLogout}
                title="Sign out of Admin Console"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  backgroundColor: '#FEF2F2',
                  border: '1px solid #FECACA',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#DC2626',
                  cursor: 'pointer',
                  marginLeft: '8px',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#FEE2E2'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FEF2F2'}
              >
                <LogOut size={14} color="#DC2626" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Navigation & Logout Drawer */}
        {mobileMenuOpen && (
          <div style={{
            position: 'fixed',
            top: '72px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FFFFFF',
            zIndex: 90,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflowY: 'auto',
            boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }}>
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                      padding: '14px 16px',
                      borderRadius: '10px',
                      fontSize: '15px',
                      fontWeight: isActive ? 700 : 600,
                      backgroundColor: isActive ? '#0F172A' : 'transparent',
                      color: isActive ? '#FFFFFF' : '#334155',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    <span style={{ color: isActive ? '#C6F432' : '#64748B' }}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            <div style={{ paddingTop: '20px', borderTop: '1px solid #E2E8F0', marginTop: '24px' }}>
              <div style={{ marginBottom: '14px', fontSize: '14px', color: '#64748B' }}>
                Signed in as <strong>{currentUser?.name || 'Platform Admin'}</strong>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  padding: '14px',
                  backgroundColor: '#DC2626',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
              >
                <LogOut size={18} color="#FFFFFF" />
                <span>Sign Out of Admin Console</span>
              </button>
            </div>
          </div>
        )}

        {/* Page Content Container */}
        <main style={{
          flex: 1,
          padding: '36px 44px 64px',
          maxWidth: '1600px',
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
