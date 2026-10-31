import React from 'react';
import { useNivvo } from '../context/NivvoAppContext';
import {
  Zap, RefreshCw, Sparkles, ShieldCheck,
  Store, Lock, User, Package, ArrowRight,
  ExternalLink, Phone, Mail, MapPin, Heart
} from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

/**
 * NivvoWebFooter — Universal Desktop & Web Platform Footer
 * Features:
 * - 4-Pillar 10-Minute Wardrobe & Doorstep Try-On Promises
 * - Direct navigation to Customer Login, Seller Login, Admin Login
 * - Merchant & Rider Onboarding access
 * - Regulatory compliance & DPDP 2023 trust badges
 */
export default function NivvoWebFooter() {
  const {
    navigateTo,
    currentUser,
    showToast,
    setActiveModal,
    switchToAppMode
  } = useNivvo();

  return (
    <footer style={{
      backgroundColor: '#1E3624',
      color: '#E0E7DC',
      borderTop: '1px solid #2D4C35',
      marginTop: '60px',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* ─── 1. Brand Guarantees / 4 Pillars ─── */}
      <div style={{
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '36px 32px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '24px'
        }}>
          {/* Pillar 1 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(183, 243, 74, 0.15)',
              color: '#B7F34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Zap size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                10-Minute Wardrobe
              </div>
              <div style={{ fontSize: '13px', color: '#A3B49E', lineHeight: 1.45 }}>
                Local boutique inventory dispatched immediately with GPS live tracking.
              </div>
            </div>
          </div>

          {/* Pillar 2 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(183, 243, 74, 0.15)',
              color: '#B7F34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <RefreshCw size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                Doorstep 2-Size Trial
              </div>
              <div style={{ fontSize: '13px', color: '#A3B49E', lineHeight: 1.45 }}>
                Order adjacent sizes. Rider waits 10 minutes while you test fit at home.
              </div>
            </div>
          </div>

          {/* Pillar 3 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(183, 243, 74, 0.15)',
              color: '#B7F34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Sparkles size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                100% Genuine Brands
              </div>
              <div style={{ fontSize: '13px', color: '#A3B49E', lineHeight: 1.45 }}>
                Directly sourced from verified city dark stores and premium streetwear boutiques.
              </div>
            </div>
          </div>

          {/* Pillar 4 */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              backgroundColor: 'rgba(183, 243, 74, 0.15)',
              color: '#B7F34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF', marginBottom: '4px' }}>
                Instant Zero-Hassle Return
              </div>
              <div style={{ fontSize: '13px', color: '#A3B49E', lineHeight: 1.45 }}>
                Hand what doesn't fit back to the rider. Instant refund to your account.
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── 2. Main Navigation Columns ─── */}
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '50px 32px 36px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '40px'
      }}>
        {/* Brand & Overview Column */}
        <div>
          <div
            onClick={() => { playClickSound(); navigateTo('landing'); }}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginBottom: '16px' }}
          >
            <img
              src="/assets/nivvo_header_logo.svg"
              alt="Nivvo"
              width="34"
              height="34"
              style={{ borderRadius: '8px' }}
            />
            <span style={{ fontSize: '26px', fontWeight: 900, letterSpacing: '-0.04em', color: '#FFFFFF' }}>
              nivvo
            </span>
          </div>

          <p style={{ fontSize: '13.5px', color: '#A3B49E', lineHeight: 1.6, marginBottom: '20px' }}>
            India's premier 10-minute instant fashion commerce platform. Hyperlocal boutique inventory delivered straight to your doorstep with 10-minute try-on.
          </p>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(183, 243, 74, 0.1)',
            border: '1px solid rgba(183, 243, 74, 0.3)',
            borderRadius: '99px',
            padding: '4px 12px',
            fontSize: '11px',
            color: '#B7F34A',
            fontWeight: 700
          }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#B7F34A' }} />
            <span>Hyperlocal Service Active • Bengaluru</span>
          </div>
        </div>

        {/* Column 1: Customer Portal & Shopping */}
        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '18px'
          }}>
            Customer Portal
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>
              <button
                onClick={() => { playClickSound(); navigateTo('customer-login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B7F34A',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 0,
                  transition: 'opacity 0.15s'
                }}
              >
                <User size={15} />
                <span>Customer Login</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: '#B7F34A',
                  color: '#14281C',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  marginLeft: '4px'
                }}>
                  SIGN IN
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => { playClickSound(); navigateTo('landing'); }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Storefront & Collections
              </button>
            </li>
            <li>
              <button
                onClick={() => { playClickSound(); navigateTo('shops'); }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Boutiques Near You
              </button>
            </li>
            <li>
              <button
                onClick={() => { playClickSound(); navigateTo('tracking'); }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Live Order & Try-On Tracking
              </button>
            </li>
            <li>
              <button
                onClick={() => { playClickSound(); navigateTo('profile'); }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                My Account & Order History
              </button>
            </li>
          </ul>
        </div>

        {/* Column 2: Merchant / Seller Hub */}
        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '18px'
          }}>
            Merchant Partner
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>
              <button
                onClick={() => { playClickSound(); navigateTo('seller-login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FBBF24',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 0,
                  transition: 'opacity 0.15s'
                }}
              >
                <Store size={15} />
                <span>Seller Login</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: '#FBBF24',
                  color: '#78350F',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  marginLeft: '4px'
                }}>
                  SELLER HUB
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playClickSound();
                  if (currentUser?.role === 'seller') navigateTo('seller-dash');
                  else navigateTo('seller-login');
                }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Merchant Operations Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playClickSound();
                  if (currentUser?.role === 'seller') navigateTo('seller-prods');
                  else navigateTo('seller-login');
                }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Catalog & Inventory Control
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playClickSound();
                  if (currentUser?.role === 'seller') navigateTo('seller-orders');
                  else navigateTo('seller-login');
                }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Live Orders & Dispatch
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playClickSound();
                  if (currentUser?.role === 'seller') navigateTo('seller-payouts');
                  else navigateTo('seller-login');
                }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Instant Daily Settlements
              </button>
            </li>
          </ul>
        </div>

        {/* Column 3: Platform Operations & Administration */}
        <div>
          <h4 style={{
            fontSize: '14px',
            fontWeight: 800,
            color: '#FFFFFF',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            marginBottom: '18px'
          }}>
            Operations & Admin
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li>
              <button
                onClick={() => { playClickSound(); navigateTo('admin-login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#93C5FD',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 0,
                  transition: 'opacity 0.15s'
                }}
              >
                <Lock size={15} />
                <span>Admin Login</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: '#3B82F6',
                  color: '#FFFFFF',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  marginLeft: '4px'
                }}>
                  OPS CONSOLE
                </span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playClickSound();
                  if (currentUser?.role === 'admin') navigateTo('admin-overview');
                  else navigateTo('admin-login');
                }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Operations Control Center
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playClickSound();
                  if (currentUser?.role === 'admin') navigateTo('admin-sellers');
                  else navigateTo('admin-login');
                }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Merchant Verification & KYC
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playClickSound();
                  if (currentUser?.role === 'admin') navigateTo('admin-delivery');
                  else navigateTo('admin-login');
                }}
                style={{ background: 'none', border: 'none', color: '#C5D4BF', fontSize: '14px', cursor: 'pointer', padding: 0 }}
              >
                Fleet Telemetry & Dispatch
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playClickSound();
                  if (currentUser?.role === 'rider') {
                    switchToAppMode('rider');
                  } else {
                    navigateTo('rider-login');
                  }
                }}
                style={{ background: 'none', border: 'none', color: '#B7F34A', fontSize: '14px', cursor: 'pointer', padding: 0, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <span>⚡ Delivery Partner Login</span>
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  playClickSound();
                  switchToAppMode('rider');
                }}
                style={{ background: 'none', border: 'none', color: '#A3B49E', fontSize: '13px', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>Delivery Partner App</span>
                <ExternalLink size={12} />
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* ─── 3. Legal & Regulatory Bottom Row ─── */}
      <div style={{
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '24px 32px',
        backgroundColor: '#16291B'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ fontSize: '13px', color: '#889B84' }}>
            © 2026 Nivvo Technologies Pvt. Ltd. • All rights reserved. 10-Minute Wardrobe & Doorstep Trial Network.
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '12.5px', color: '#A3B49E' }}>
            <span
              onClick={() => showToast('DPDP Act 2023 Compliant: User privacy, encrypted tokens, and data minimization.')}
              style={{ cursor: 'pointer' }}
            >
              Privacy Policy
            </span>
            <span>•</span>
            <span
              onClick={() => showToast('Nivvo Hyperlocal Marketplace Terms of Service')}
              style={{ cursor: 'pointer' }}
            >
              Terms of Service
            </span>
            <span>•</span>
            <span
              onClick={() => showToast('Merchant Fair Trade & 24h Payout Policy')}
              style={{ cursor: 'pointer' }}
            >
              Seller Terms
            </span>
            <span>•</span>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              padding: '2px 8px',
              borderRadius: '6px',
              fontSize: '11px',
              color: '#B7F34A',
              fontWeight: 700
            }}>
              <ShieldCheck size={12} />
              <span>DPDP 2023 Verified</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

