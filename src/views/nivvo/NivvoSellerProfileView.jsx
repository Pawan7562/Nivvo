import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Store, MapPin, Phone, Mail, Clock, ShieldCheck, Check, 
  Save, AlertCircle, FileText, Camera, CheckCircle2, Sliders,
  Zap, Lock, Eye, ArrowUpRight, Star, User, ExternalLink,
  Truck, Package, Sparkles, Building2, CreditCard, ChevronRight,
  RefreshCw, Smartphone, Award, Navigation, Info
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';
import SellerLayout from '../../components/nivvo/SellerLayout';

export default function NivvoSellerProfileView({ onBack }) {
  const { 
    shopProfile, 
    setShopProfile, 
    updateShopProfileData, 
    toggleShopAvailability, 
    showToast 
  } = useNivvo();

  const [activeSection, setActiveSection] = useState('general'); // 'general' | 'location' | 'operations' | 'compliance' | 'preview'
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // ─── Editable Form State ───
  const [shopName, setShopName] = useState(shopProfile?.shop_name || 'Sole Street Originals');
  const [tagline, setTagline] = useState('Your neighbourhood handcrafted footwear & sneaker specialist');
  const [ownerName, setOwnerName] = useState(shopProfile?.owner_name || 'Rohan Sharma');
  const [phone, setPhone] = useState(shopProfile?.phone || '+91 9876543210');
  const [email, setEmail] = useState(shopProfile?.email || 'rohan@solestreet.in');
  const [category, setCategory] = useState(shopProfile?.category || 'Footwear, Sneakers & Accessories');
  const [description, setDescription] = useState(
    'Sole Street is Indiranagar’s premier local footwear destination, curating everyday court sneakers, genuine leather sandals, and runners with ultra-fast 10-minute doorstep try-on delivery.'
  );

  // Location state
  const [address, setAddress] = useState(shopProfile?.address || 'Plot 42, 100ft Road, Indiranagar, Bengaluru');
  const [landmark, setLandmark] = useState('Near 12th Main Junction, Opp Starbucks');
  const [city, setCity] = useState(shopProfile?.city || 'Bengaluru');
  const [state, setState] = useState(shopProfile?.state || 'Karnataka');
  const [pincode, setPincode] = useState(shopProfile?.pincode || '560038');
  const [hubName, setHubName] = useState('Indiranagar Cluster Hub #14');
  const [deliveryRadius, setDeliveryRadius] = useState(3.5);

  // Operations state
  const [operatingHours, setOperatingHours] = useState(shopProfile?.operating_hours || '08:00 AM - 11:30 PM');
  const [prepTime, setPrepTime] = useState(shopProfile?.prep_time_minutes || '4–6 min');
  const [tryOnSupported, setTryOnSupported] = useState(true);
  const [tamperTapeActive, setTamperTapeActive] = useState(true);
  const [securityPinHandover, setSecurityPinHandover] = useState(true);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(true);

  // Compliance state
  const [gstin, setGstin] = useState(shopProfile?.gstin || '29AABCU9603R1ZM');
  const [panNumber, setPanNumber] = useState(shopProfile?.pan_number || 'AABCU9603R');
  const [tradeLicense, setTradeLicense] = useState('BBMP-TRD-2024-884102');
  const [bankName, setBankName] = useState(shopProfile?.bank_name || 'ICICI Bank');
  const [bankAccount, setBankAccount] = useState(shopProfile?.bank_account || '•••• •••• 4812');
  const [bankIfsc, setBankIfsc] = useState(shopProfile?.bank_ifsc || 'ICIC0000492');
  const [upiId, setUpiId] = useState(shopProfile?.upi_id || 'solestreet@icici');

  // Mark changes dirty
  const markDirty = () => {
    if (!hasUnsavedChanges) setHasUnsavedChanges(true);
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    playTrialSound();

    const updated = {
      shop_name: shopName,
      owner_name: ownerName,
      phone,
      email,
      category,
      address,
      city,
      state,
      pincode,
      operating_hours: operatingHours,
      prep_time_minutes: prepTime,
      gstin,
      pan_number: panNumber,
      bank_name: bankName,
      bank_account: bankAccount,
      bank_ifsc: bankIfsc,
      upi_id: upiId
    };

    updateShopProfileData(updated);
    setHasUnsavedChanges(false);
    showToast('Store profile updated successfully.');
  };

  // Reusable custom iOS-style toggle component
  const CustomToggle = ({ checked, onChange, title, subtitle, badge }) => (
    <div 
      onClick={() => {
        playClickSound();
        onChange(!checked);
        markDirty();
      }}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '18px 22px',
        borderRadius: '16px',
        border: checked ? '1.5px solid #1F4230' : '1.5px solid #E4E9DD',
        backgroundColor: checked ? '#F5F9F4' : '#FFFFFF',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: checked ? '0 2px 8px rgba(31,66,48,0.06)' : '0 1px 3px rgba(0,0,0,0.02)'
      }}
    >
      <div style={{ flex: 1, paddingRight: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>
            {title}
          </span>
          {badge && (
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              padding: '2px 8px',
              borderRadius: '6px',
              backgroundColor: '#EDFDF0',
              color: '#15803D',
              border: '1px solid #BBF7D0'
            }}>
              {badge}
            </span>
          )}
        </div>
        {subtitle && (
          <div style={{ fontSize: '13px', color: '#687163', lineHeight: 1.5 }}>
            {subtitle}
          </div>
        )}
      </div>

      <div style={{
        width: '48px',
        height: '26px',
        borderRadius: '999px',
        backgroundColor: checked ? '#1F4230' : '#D1D5DB',
        position: 'relative',
        transition: 'background-color 0.25s ease',
        flexShrink: 0
      }}>
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          position: 'absolute',
          top: '3px',
          left: checked ? '25px' : '3px',
          transition: 'left 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
        }} />
      </div>
    </div>
  );

  return (
    <SellerLayout currentTab="profile" breadcrumb="Store Profile & Settings" onBack={onBack}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '26px' }}>

        {/* ─── 1. Page Header ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#14281C', margin: 0, letterSpacing: '-0.03em' }}>
                Store Profile & Operations
              </h1>
              <span style={{
                backgroundColor: shopProfile?.is_open !== false ? '#EDFDF0' : '#FEF2F2',
                color: shopProfile?.is_open !== false ? '#15803D' : '#DC2626',
                border: `1.5px solid ${shopProfile?.is_open !== false ? '#BBF7D0' : '#FECACA'}`,
                padding: '5px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: 800,
                letterSpacing: '0.02em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '7px'
              }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: shopProfile?.is_open !== false ? '#15803D' : '#DC2626',
                  boxShadow: shopProfile?.is_open !== false ? '0 0 8px #22C55E' : 'none'
                }} />
                {shopProfile?.is_open !== false ? 'Store Online · Accepting Orders' : 'Store Paused · Offline'}
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#687163', margin: 0, lineHeight: 1.6 }}>
              Manage store branding, dispatch operations, service radius, and compliance settings.
            </p>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              type="button"
              onClick={toggleShopAvailability}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #D4DEC8',
                borderRadius: '12px',
                padding: '11px 18px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#14281C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '7px',
                transition: 'all 0.15s'
              }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F5F7F2'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FFFFFF'}
            >
              <RefreshCw size={15} color="#687163" />
              {shopProfile?.is_open !== false ? 'Pause Store' : 'Resume Store'}
            </button>

            <button
              type="button"
              onClick={handleSaveProfile}
              style={{
                backgroundColor: '#1F4230',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '12px',
                padding: '11px 24px',
                fontSize: '14px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(31,66,48,0.28)',
                transition: 'transform 0.1s ease, box-shadow 0.15s ease'
              }}
              onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
              onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              <Save size={16} color="#C6F432" />
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* ─── Unsaved Changes Banner ─── */}
        {hasUnsavedChanges && (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1.5px solid #FDE68A',
            borderRadius: '14px',
            padding: '12px 18px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={18} color="#D97706" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#92400E' }}>
                You have unsaved changes to your store settings.
              </span>
            </div>
            <button
              onClick={handleSaveProfile}
              style={{
                backgroundColor: '#D97706',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer'
              }}
            >
              Save Changes
            </button>
          </div>
        )}

        {/* ─── 2. Hero Store Identity Card ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E4E9DD',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 4px 16px rgba(0,0,0,0.04)'
        }}>
          {/* Cover Header Banner */}
          <div style={{
            height: '160px',
            backgroundColor: '#0F2618',
            backgroundImage: 'linear-gradient(135deg, #0F2618 0%, #1F4230 50%, #295B40 100%)',
            position: 'relative',
            padding: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              backgroundColor: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 800,
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <ShieldCheck size={14} color="#C6F432" />
              <span>Verified Merchant · Hub #14 Indiranagar</span>
            </div>

            <button
              type="button"
              onClick={() => showToast('Cover photo upload')}
              style={{
                backgroundColor: 'rgba(0,0,0,0.4)',
                backdropFilter: 'blur(6px)',
                border: '1px solid rgba(255,255,255,0.25)',
                color: '#FFFFFF',
                padding: '6px 14px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Camera size={14} color="#FFFFFF" />
              Change Cover
            </button>
          </div>

          {/* Identity Info Bar */}
          <div style={{
            padding: '0 28px 24px',
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            {/* Avatar & Store Titles */}
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '20px', marginTop: '-46px' }}>
              {/* Store Avatar */}
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '92px',
                  height: '92px',
                  borderRadius: '22px',
                  backgroundColor: '#0F2618',
                  border: '4px solid #FFFFFF',
                  boxShadow: '0 4px 14px rgba(0,0,0,0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#C6F432',
                  fontWeight: 900,
                  fontSize: '30px',
                  letterSpacing: '-0.02em'
                }}>
                  SS
                </div>
                <button
                  type="button"
                  onClick={() => showToast('Store logo updated')}
                  style={{
                    position: 'absolute',
                    bottom: '0',
                    right: '0',
                    backgroundColor: '#1F4230',
                    border: '2px solid #FFFFFF',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
                  }}
                  title="Upload store logo"
                >
                  <Camera size={13} color="#C6F432" />
                </button>
              </div>

              {/* Title & Metadata */}
              <div style={{ paddingBottom: '4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '24px', fontWeight: 900, color: '#14281C', margin: 0, letterSpacing: '-0.02em' }}>
                    {shopName}
                  </h2>
                  <span style={{
                    backgroundColor: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    color: '#B45309',
                    fontSize: '12px',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '8px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <Star size={12} fill="#F59E0B" color="#F59E0B" /> 4.8 Rating
                  </span>
                </div>
                <div style={{ fontSize: '13px', color: '#687163', marginTop: '4px', lineHeight: 1.4 }}>
                  {tagline} · Store ID: <strong>{shopProfile?.shop_id || 'SHP-4012'}</strong>
                </div>
              </div>
            </div>

            {/* Quick KPI Stats Summary */}
            <div style={{
              display: 'flex',
              gap: '16px',
              backgroundColor: '#F8FAF6',
              padding: '12px 20px',
              borderRadius: '16px',
              border: '1.5px solid #E8EDE3',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Completed Orders
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#14281C', marginTop: '2px' }}>
                  1,284
                </div>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#D4DEC8' }} />
              <div>
                <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Average SLA
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#15803D', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Zap size={14} fill="#15803D" color="#15803D" />
                  4.2 min
                </div>
              </div>
              <div style={{ width: '1px', height: '32px', backgroundColor: '#D4DEC8' }} />
              <div>
                <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Doorstep Try-On
                </div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: '#1F4230', marginTop: '2px' }}>
                  Active
                </div>
              </div>
            </div>
          </div>

          {/* ─── Navigation Tabs ─── */}
          <div style={{
            display: 'flex',
            borderTop: '1px solid #E4E9DD',
            backgroundColor: '#F7FAF5',
            padding: '0 24px',
            overflowX: 'auto',
            gap: '8px'
          }}>
            {[
              { id: 'general', label: 'Store Identity', icon: <Store size={15} /> },
              { id: 'location', label: 'Location & Radius', icon: <MapPin size={15} /> },
              { id: 'operations', label: 'Operations & SLA', icon: <Clock size={15} /> },
              { id: 'compliance', label: 'Compliance & Banking', icon: <ShieldCheck size={15} /> },
              { id: 'preview', label: 'App Preview', icon: <Smartphone size={15} /> }
            ].map((tab) => {
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => { playClickSound(); setActiveSection(tab.id); }}
                  style={{
                    padding: '16px 20px',
                    border: 'none',
                    borderBottom: isActive ? '3px solid #1F4230' : '3px solid transparent',
                    backgroundColor: 'transparent',
                    color: isActive ? '#1F4230' : '#687163',
                    fontWeight: isActive ? 800 : 600,
                    fontSize: '14px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.15s'
                  }}
                >
                  <span style={{ color: isActive ? '#1F4230' : '#8A9785' }}>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── TAB 1: STORE IDENTITY & BRAND ─── */}
        {activeSection === 'general' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E4E9DD',
            borderRadius: '20px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14281C', margin: 0 }}>
                  Store Profile & Contact
                </h3>
                <p style={{ fontSize: '13px', color: '#687163', margin: '4px 0 0 0' }}>
                  Visible to shoppers on product cards, invoices, and receipts.
                </p>
              </div>
              <span style={{
                fontSize: '12px',
                fontWeight: 700,
                color: '#15803D',
                backgroundColor: '#EDFDF0',
                padding: '4px 12px',
                borderRadius: '999px',
                border: '1px solid #BBF7D0'
              }}>
                Active
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              {/* Store Name */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Store size={13} color="#1F4230" />
                  Store Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => { setShopName(e.target.value); markDirty(); }}
                  placeholder="e.g. Sole Street Originals"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Tagline */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Sparkles size={13} color="#1F4230" />
                  Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => { setTagline(e.target.value); markDirty(); }}
                  placeholder="e.g. Your neighbourhood footwear specialist"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 500,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Owner Name */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <User size={13} color="#1F4230" />
                  Store Owner
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => { setOwnerName(e.target.value); markDirty(); }}
                  placeholder="e.g. Rohan Sharma"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 500,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Store Category */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Package size={13} color="#1F4230" />
                  Primary Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); markDirty(); }}
                  placeholder="e.g. Footwear, Sneakers & Accessories"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 500,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Contact Phone */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Phone size={13} color="#1F4230" />
                  Dispatch Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => { setPhone(e.target.value); markDirty(); }}
                  placeholder="+91 9876543210"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>

              {/* Store Email */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Mail size={13} color="#1F4230" />
                  Contact Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); markDirty(); }}
                  placeholder="rohan@solestreet.in"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 500,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Store Story Textarea */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                <FileText size={13} color="#1F4230" />
                Store Description
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => { setDescription(e.target.value); markDirty(); }}
                placeholder="Tell shoppers about your local craftsmanship, materials, and passion..."
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1.5px solid #D4DEC8',
                  borderRadius: '12px',
                  fontSize: '14px',
                  boxSizing: 'border-box',
                  backgroundColor: '#FAFBF8',
                  color: '#14281C',
                  lineHeight: 1.6,
                  resize: 'vertical',
                  fontFamily: 'inherit',
                  outline: 'none'
                }}
              />
              <div style={{ fontSize: '12px', color: '#8A9785', marginTop: '6px', textAlign: 'right' }}>
                {description.length} characters
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 2: LOCATION & DELIVERY RADIUS ─── */}
        {activeSection === 'location' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E4E9DD',
            borderRadius: '20px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14281C', margin: 0 }}>
                Store Location & Delivery Radius
              </h3>
              <p style={{ fontSize: '13px', color: '#687163', margin: '4px 0 0 0' }}>
                Storefront coordinates and courier coverage radius.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <MapPin size={13} color="#1F4230" />
                  Physical Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => { setAddress(e.target.value); markDirty(); }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Navigation size={13} color="#1F4230" />
                  Landmark / Directions
                </label>
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => { setLandmark(e.target.value); markDirty(); }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 500,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Building2 size={13} color="#1F4230" />
                  Assigned Hub
                </label>
                <input
                  type="text"
                  value={hubName}
                  onChange={(e) => { setHubName(e.target.value); markDirty(); }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 500,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  City & State
                </label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => { setCity(e.target.value); markDirty(); }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1.5px solid #D4DEC8',
                      borderRadius: '12px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: '#FAFBF8',
                      color: '#14281C',
                      fontWeight: 500,
                      outline: 'none'
                    }}
                  />
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => { setState(e.target.value); markDirty(); }}
                    style={{
                      flex: 1,
                      padding: '12px 16px',
                      border: '1.5px solid #D4DEC8',
                      borderRadius: '12px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: '#FAFBF8',
                      color: '#14281C',
                      fontWeight: 500,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Postal Code
                </label>
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => { setPincode(e.target.value); markDirty(); }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Interactive Delivery Radius Card */}
            <div style={{
              backgroundColor: '#F8FAF6',
              border: '1.5px solid #D4DEC8',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#14281C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Truck size={17} color="#1F4230" />
                    Delivery Radius
                  </div>
                  <div style={{ fontSize: '13px', color: '#687163', marginTop: '3px' }}>
                    Maximum courier delivery range from your store location.
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#1F4230',
                  color: '#C6F432',
                  padding: '6px 18px',
                  borderRadius: '999px',
                  fontSize: '15px',
                  fontWeight: 800
                }}>
                  {deliveryRadius} km radius
                </div>
              </div>

              {/* Slider Control */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '10px 0' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#687163' }}>1.0 km</span>
                <input
                  type="range"
                  min="1"
                  max="6"
                  step="0.5"
                  value={deliveryRadius}
                  onChange={(e) => { setDeliveryRadius(Number(e.target.value)); markDirty(); }}
                  style={{
                    flex: 1,
                    accentColor: '#1F4230',
                    cursor: 'pointer',
                    height: '6px'
                  }}
                />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#687163' }}>6.0 km</span>
              </div>

              {/* Dynamic Geofence Insights Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                paddingTop: '8px',
                borderTop: '1px solid #E4E9DD'
              }}>
                <div style={{ backgroundColor: '#FFFFFF', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E4E9DD' }}>
                  <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase' }}>Estimated Transit</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>
                    ~{Math.round(deliveryRadius * 2.2)} to {Math.round(deliveryRadius * 3)} min
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E4E9DD' }}>
                  <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase' }}>Active Couriers</div>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C', marginTop: '2px' }}>
                    34 couriers available
                  </div>
                </div>

                <div style={{ backgroundColor: '#FFFFFF', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E4E9DD' }}>
                  <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase' }}>Covered Areas</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1F4230', marginTop: '2px' }}>
                    Indiranagar, Domlur, HAL 2nd Stage
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: SLA & TRY-ON PIPELINE ─── */}
        {activeSection === 'operations' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E4E9DD',
            borderRadius: '20px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14281C', margin: 0 }}>
                Operating Hours & SLA Settings
              </h3>
              <p style={{ fontSize: '13px', color: '#687163', margin: '4px 0 0 0' }}>
                Configure operating schedule and counter dispatch targets.
              </p>
            </div>

            {/* Operating Times & SLA Select */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Clock size={13} color="#1F4230" />
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={operatingHours}
                  onChange={(e) => { setOperatingHours(e.target.value); markDirty(); }}
                  placeholder="08:00 AM - 11:30 PM"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Zap size={13} color="#1F4230" />
                  Target Dispatch SLA
                </label>
                <select
                  value={prepTime}
                  onChange={(e) => { setPrepTime(e.target.value); markDirty(); }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="3–5 min">3–5 minutes (Express)</option>
                  <option value="4–6 min">4–6 minutes (Standard)</option>
                  <option value="6–8 min">6–8 minutes (High Volume)</option>
                </select>
              </div>
            </div>

            {/* Visual Dispatch Workflow Timeline */}
            <div style={{
              backgroundColor: '#0F2618',
              borderRadius: '18px',
              padding: '24px',
              color: '#FFFFFF'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#C6F432', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '16px' }}>
                Standard Dispatch Sequence
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                {[
                  { time: '0:00', label: 'Order Received', desc: 'Alert confirmed at counter' },
                  { time: '1:30', label: 'Items Picked', desc: 'Retrieve requested sizes' },
                  { time: '3:00', label: 'Package Sealed', desc: 'Security seal applied' },
                  { time: '4:20', label: 'Courier Handover', desc: 'Pickup PIN verified' }
                ].map((step, idx) => (
                  <div key={idx} style={{
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    borderRadius: '12px',
                    padding: '14px',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#C6F432', marginBottom: '4px' }}>
                      {step.time}
                    </div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#FFFFFF', marginBottom: '2px' }}>
                      {step.label}
                    </div>
                    <div style={{ fontSize: '12px', color: '#A3B899' }}>
                      {step.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Custom Interactive Switches */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <CustomToggle
                checked={tryOnSupported}
                onChange={setTryOnSupported}
                title="Doorstep Try-On"
                subtitle="Allow customers to try adjacent sizes at delivery."
                badge="Active"
              />

              <CustomToggle
                checked={tamperTapeActive}
                onChange={setTamperTapeActive}
                title="Tamper-Evident Seals"
                subtitle="Require security seal on all outgoing packages."
                badge="Required"
              />

              <CustomToggle
                checked={securityPinHandover}
                onChange={setSecurityPinHandover}
                title="Pickup PIN Verification"
                subtitle="Couriers must verify a 4-digit PIN prior to package handover."
                badge="Security"
              />

              <CustomToggle
                checked={autoAcceptOrders}
                onChange={setAutoAcceptOrders}
                title="Auto-Accept Orders"
                subtitle="Automatically accept new incoming orders during operating hours."
                badge="Enabled"
              />
            </div>
          </div>
        )}

        {/* ─── TAB 4: TAX, BANK & COMPLIANCE ─── */}
        {activeSection === 'compliance' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E4E9DD',
            borderRadius: '20px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '26px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14281C', margin: 0 }}>
                  Tax, Banking & Compliance
                </h3>
                <p style={{ fontSize: '13px', color: '#687163', margin: '4px 0 0 0' }}>
                  Tax identifiers and settlement banking details.
                </p>
              </div>

              <span style={{
                backgroundColor: '#EDFDF0',
                color: '#15803D',
                border: '1.5px solid #BBF7D0',
                fontSize: '12px',
                fontWeight: 800,
                padding: '5px 14px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <CheckCircle2 size={14} />
                Verified
              </span>
            </div>

            {/* Tax IDs */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <ShieldCheck size={13} color="#1F4230" />
                  GSTIN
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => { setGstin(e.target.value.toUpperCase()); markDirty(); }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1.5px solid #D4DEC8',
                      borderRadius: '12px',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: '#FAFBF8',
                      color: '#14281C',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      outline: 'none'
                    }}
                  />
                  <span style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: '#15803D',
                    backgroundColor: '#EDFDF0',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>
                    Active
                  </span>
                </div>
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <FileText size={13} color="#1F4230" />
                  Business PAN
                </label>
                <input
                  type="text"
                  value={panNumber}
                  onChange={(e) => { setPanNumber(e.target.value.toUpperCase()); markDirty(); }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 700,
                    letterSpacing: '0.04em',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 700, color: '#4D5C4C', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: '8px' }}>
                  <Award size={13} color="#1F4230" />
                  Trade License Number
                </label>
                <input
                  type="text"
                  value={tradeLicense}
                  onChange={(e) => { setTradeLicense(e.target.value); markDirty(); }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    color: '#14281C',
                    fontWeight: 600,
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            {/* Bank Payout Destination Card */}
            <div style={{
              backgroundColor: '#F8FAF6',
              border: '1.5px solid #D4DEC8',
              borderRadius: '18px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '18px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    backgroundColor: '#1F4230',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#C6F432'
                  }}>
                    <CreditCard size={20} />
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                      Settlement Account
                    </div>
                    <div style={{ fontSize: '12px', color: '#687163' }}>
                      Daily settlement at 06:00 AM (T+1)
                    </div>
                  </div>
                </div>

                <span style={{
                  fontSize: '11px',
                  fontWeight: 800,
                  color: '#15803D',
                  backgroundColor: '#EDFDF0',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  border: '1px solid #BBF7D0'
                }}>
                  Verified for Settlements
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
                <div>
                  <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase' }}>Bank Name</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C', marginTop: '2px' }}>{bankName}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase' }}>Account Number</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C', marginTop: '2px' }}>{bankAccount}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase' }}>IFSC Code</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C', marginTop: '2px' }}>{bankIfsc}</div>
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#687163', fontWeight: 700, textTransform: 'uppercase' }}>UPI ID</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#1F4230', marginTop: '2px' }}>{upiId}</div>
                </div>
              </div>
            </div>

            {/* Merchant Agreement Note */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #E4E9DD',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <FileText size={22} color="#1F4230" />
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 800, color: '#14281C' }}>
                    Merchant Agreement (v2.4)
                  </div>
                  <div style={{ fontSize: '12px', color: '#687163' }}>
                    Signed on 14 Jan 2026 · Valid through 31 Dec 2027
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => showToast('Downloading agreement')}
                style={{
                  border: '1.5px solid #D4DEC8',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '10px',
                  padding: '7px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#1F4230',
                  cursor: 'pointer'
                }}
              >
                View Agreement
              </button>
            </div>
          </div>
        )}

        {/* ─── TAB 5: CUSTOMER APP PREVIEW ─── */}
        {activeSection === 'preview' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E4E9DD',
            borderRadius: '20px',
            padding: '30px',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14281C', margin: 0 }}>
                Storefront Preview
              </h3>
              <p style={{ fontSize: '13px', color: '#687163', margin: '4px 0 0 0' }}>
                Preview how your store profile appears to customers in the app.
              </p>
            </div>

            {/* Smartphone Frame Mockup */}
            <div style={{
              maxWidth: '380px',
              margin: '0 auto',
              backgroundColor: '#FFFFFF',
              borderRadius: '32px',
              border: '6px solid #14281C',
              overflow: 'hidden',
              boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Phone Status Bar */}
              <div style={{
                backgroundColor: '#14281C',
                color: '#FFFFFF',
                padding: '6px 18px',
                fontSize: '11px',
                fontWeight: 700,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span>9:41</span>
                <span style={{ fontSize: '10px', opacity: 0.8 }}>5G</span>
              </div>

              {/* Store Header Banner inside phone */}
              <div style={{
                height: '110px',
                backgroundColor: '#0F2618',
                backgroundImage: 'linear-gradient(135deg, #0F2618 0%, #1F4230 100%)',
                padding: '14px',
                position: 'relative'
              }}>
                <span style={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: '#FFFFFF',
                  padding: '3px 8px',
                  borderRadius: '999px',
                  fontSize: '10px',
                  fontWeight: 800
                }}>
                  10 min delivery
                </span>
              </div>

              {/* Store Meta in phone */}
              <div style={{ padding: '0 16px 16px', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginTop: '-26px', marginBottom: '10px' }}>
                  <div style={{
                    width: '54px',
                    height: '54px',
                    borderRadius: '14px',
                    backgroundColor: '#0F2618',
                    border: '3px solid #FFFFFF',
                    color: '#C6F432',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '18px'
                  }}>
                    SS
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 900, color: '#14281C' }}>{shopName}</div>
                    <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Star size={11} fill="#15803D" color="#15803D" />
                      4.8 (248 reviews) · Indiranagar
                    </div>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: '#687163', marginBottom: '12px', lineHeight: 1.4 }}>
                  {tagline}
                </div>

                {/* Try On Pill */}
                <div style={{
                  backgroundColor: '#EDFDF0',
                  border: '1px solid #BBF7D0',
                  color: '#15803D',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginBottom: '14px'
                }}>
                  <Zap size={12} fill="#15803D" color="#15803D" />
                  Doorstep Try-On Available
                </div>

                {/* Sneaker Preview Card */}
                <div style={{
                  border: '1px solid #EAECE5',
                  borderRadius: '12px',
                  padding: '10px',
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  backgroundColor: '#F9FAF7'
                }}>
                  <div style={{ width: '48px', height: '48px', backgroundColor: '#E4E9DD', borderRadius: '8px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={22} color="#1F4230" />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 800, color: '#14281C' }}>Everyday Court Sneaker</div>
                    <div style={{ fontSize: '11px', color: '#687163' }}>5 sizes in stock · ₹1,299</div>
                  </div>
                  <button style={{
                    backgroundColor: '#1F4230',
                    color: '#C6F432',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '5px 10px',
                    fontSize: '11px',
                    fontWeight: 800
                  }}>
                    Try on
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </SellerLayout>
  );
}
