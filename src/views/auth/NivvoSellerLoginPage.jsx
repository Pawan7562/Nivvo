import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Store, Lock, Phone, Mail, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, 
  ArrowLeft, User, Shield, MapPin, Loader2, Navigation,
  TrendingUp, Zap, Clock
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../../utils/audioEffects';
import { loginSellerApi, registerSellerApi } from '../../services/api';
import { detectDeviceCoordinates, reverseGeocodeCoords } from '../../services/locationService';

export default function NivvoSellerLoginPage() {
  const { navigateTo, handleLoginSuccess, showToast } = useNivvo();

  // Mode: 'signin' | 'register'
  const [mode, setMode] = useState('signin');

  // Sign In Fields
  const [identifier, setIdentifier] = useState('9845067890');
  const [password, setPassword] = useState('Seller@Nivvo2026!');
  const [showPassword, setShowPassword] = useState(false);

  // Store Registration Fields
  const [name, setName] = useState('');
  const [shopName, setShopName] = useState('');
  const [shopCategory, setShopCategory] = useState('Footwear & Streetwear Sneakers');
  const [shopAddress, setShopAddress] = useState('');
  const [shopLat, setShopLat] = useState(null);
  const [shopLng, setShopLng] = useState(null);
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-Fill Demo Merchant Credentials
  const handleQuickFill = () => {
    playClickSound();
    setIdentifier('9845067890');
    setPassword('Seller@Nivvo2026!');
    setErrorMessage('');
    setSuccessMessage('Sole Street Sneaker Studio demo credentials loaded. Click "Open Seller Hub".');
  };

  // Physical Store GPS Detection
  const handleDetectStoreLocation = async () => {
    playClickSound();
    setIsDetectingLocation(true);
    setErrorMessage('');
    try {
      const coords = await detectDeviceCoordinates({ timeout: 9000, enableHighAccuracy: true });
      const address = await reverseGeocodeCoords(coords.latitude, coords.longitude, '/api');
      const formatted = address.fullAddress || `${address.street || 'Storefront'}, ${address.area || 'Commercial Area'}, ${address.city || 'Bengaluru'} ${address.pincode || '560038'}`;
      setShopAddress(formatted);
      setShopLat(coords.latitude);
      setShopLng(coords.longitude);
      setSuccessMessage(`📍 Store location locked: ${address.area || address.city} (${coords.latitude.toFixed(4)}°N, ${coords.longitude.toFixed(4)}°E)`);
    } catch (err) {
      setErrorMessage(err.message || 'Could not auto-detect store GPS. Please enter manual address.');
    } finally {
      setIsDetectingLocation(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter your merchant phone/email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginSellerApi({
        identifier: identifier.trim(),
        password: password.trim()
      });

      if (res && (res.ok !== false && (res.token || res.user || res.shop || res.id))) {
        playSuccessChime();
        setSuccessMessage('Merchant authorized! Redirecting to Seller Dashboard...');
        const authData = {
          user: res.user || {
            id: res.id || 'seller-1',
            name: res.name || 'Vikram Sen',
            phone: identifier,
            email: res.email || 'seller@solestreet.in',
            role: 'seller'
          },
          shop: res.shop || {
            id: 'shop-1',
            name: 'Sole Street Sneaker Studio',
            category: 'Footwear & Streetwear Sneakers',
            verification_status: 'approved'
          },
          token: res.token || 'demo-jwt-seller-token',
          role: 'seller'
        };
        setTimeout(() => {
          handleLoginSuccess(authData);
          navigateTo('seller-dash');
        }, 600);
      } else {
        setErrorMessage(res.error || res.message || 'Invalid merchant credentials. Please verify your phone and password.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Authentication error. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !shopName.trim() || !phone.trim() || !email.trim() || !regPassword.trim()) {
      setErrorMessage('Please complete all required store profile fields.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerSellerApi({
        name: name.trim(),
        shop_name: shopName.trim(),
        category: shopCategory,
        address: shopAddress.trim() || 'Indiranagar 100ft Road, Bengaluru',
        latitude: shopLat || 12.9716,
        longitude: shopLng || 77.6412,
        phone: phone.trim(),
        email: email.trim(),
        password: regPassword
      });

      if (res && (res.ok !== false && (res.token || res.user || res.shop || res.id))) {
        playSuccessChime();
        setSuccessMessage('Boutique registered successfully! Loading your Seller Hub...');
        const authData = {
          user: res.user || {
            id: res.id || `seller-${Date.now()}`,
            name,
            phone,
            email,
            role: 'seller'
          },
          shop: res.shop || {
            name: shopName,
            category: shopCategory,
            address: shopAddress,
            latitude: shopLat,
            longitude: shopLng,
            verification_status: 'pending'
          },
          token: res.token || 'demo-jwt-seller-token',
          role: 'seller'
        };
        setTimeout(() => {
          handleLoginSuccess(authData);
          navigateTo('seller-dash');
        }, 700);
      } else {
        setErrorMessage(res.error || res.message || 'Registration failed. Phone or email might already be registered.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration request failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#FAF7F2',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* ─── Top Header Bar ─── */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #EAE3D9',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 1px 6px rgba(0,0,0,0.03)'
      }}>
        <div 
          onClick={() => { playClickSound(); navigateTo('landing'); }}
          style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
        >
          <img 
            src="/assets/nivvo_header_logo.svg" 
            alt="Nivvo" 
            width="32" 
            height="32" 
            style={{ borderRadius: '8px' }} 
          />
          <span style={{ fontSize: '24px', fontWeight: 900, color: '#24452D', letterSpacing: '-0.04em' }}>
            nivvo
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            backgroundColor: '#FEF3C7',
            color: '#B45309',
            padding: '3px 8px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Seller Hub Login
          </span>
        </div>

        <button
          onClick={() => { playClickSound(); navigateTo('landing'); }}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #EAE3D9',
            color: '#454C41',
            borderRadius: '10px',
            padding: '8px 16px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5EFE6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <ArrowLeft size={15} />
          <span>Back to Storefront</span>
        </button>
      </header>

      {/* ─── Main Content Container ─── */}
      <main style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 16px 48px rgba(180, 83, 9, 0.08), 0 2px 6px rgba(0,0,0,0.02)',
          border: '1px solid #EAE3D9',
          padding: '36px 32px',
          boxSizing: 'border-box'
        }}>
          {/* Header Badge & Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FEF3C7',
              color: '#B45309',
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '12px'
            }}>
              <Store size={14} />
              <span>BOUTIQUE & DARK STORE PORTAL</span>
            </div>

            <h1 style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#20251F',
              letterSpacing: '-0.03em',
              margin: '0 0 8px'
            }}>
              {mode === 'signin' ? 'Merchant Partner Login' : 'Register Your Boutique'}
            </h1>
            <p style={{
              fontSize: '13.5px',
              color: '#73796F',
              margin: 0,
              lineHeight: 1.45
            }}>
              {mode === 'signin'
                ? 'Sign in to access real-time dispatch, inventory sync, and daily settlements.'
                : 'Turn your store into a 10-minute dispatch hub across your neighbourhood.'}
            </p>
          </div>

          {/* Mode Switcher */}
          <div style={{
            display: 'flex',
            backgroundColor: '#F5F1EA',
            padding: '4px',
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <button
              onClick={() => { playClickSound(); setMode('signin'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: mode === 'signin' ? '#FFFFFF' : 'transparent',
                color: mode === 'signin' ? '#B45309' : '#73796F',
                fontWeight: mode === 'signin' ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: mode === 'signin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Merchant Sign In
            </button>
            <button
              onClick={() => { playClickSound(); setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: mode === 'register' ? '#FFFFFF' : 'transparent',
                color: mode === 'register' ? '#B45309' : '#73796F',
                fontWeight: mode === 'register' ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: mode === 'register' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Register New Store
            </button>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#B91C1C',
              fontSize: '13px',
              lineHeight: 1.4
            }}>
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div style={{
              backgroundColor: '#F0FDF4',
              border: '1px solid #86EFAC',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#15803D',
              fontSize: '13px',
              lineHeight: 1.4
            }}>
              <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{successMessage}</div>
            </div>
          )}

          {/* ─── Merchant Sign In Form ─── */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '6px' }}>
                  Merchant Phone or Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: '12px', color: '#73796F', display: 'flex' }}>
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 9845067890 or seller@solestreet.in"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '12px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#20251F',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#333D2F' }}>
                    Password
                  </label>
                  <span 
                    onClick={() => showToast('Demo merchant password: Seller@Nivvo2026! or click Quick-Fill demo below.')}
                    style={{ fontSize: '12px', color: '#B45309', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Forgot Password?
                  </span>
                </div>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: '12px', color: '#73796F', display: 'flex' }}>
                    <Lock size={16} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter merchant password"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 40px 11px 38px',
                      borderRadius: '12px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#20251F',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      background: 'none',
                      border: 'none',
                      color: '#73796F',
                      cursor: 'pointer',
                      padding: 0
                    }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Demo Credentials Quick-Fill Button */}
              <button
                type="button"
                onClick={handleQuickFill}
                style={{
                  backgroundColor: '#FFFBEB',
                  border: '1px dashed #FCD34D',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#B45309',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FEF3C7'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFBEB'}
              >
                <Sparkles size={14} color="#D97706" />
                <span>Auto-Fill Seller Demo (Sole Street Studio)</span>
              </button>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#B45309',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(180, 83, 9, 0.25)',
                  marginTop: '4px',
                  transition: 'transform 0.15s'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span>{loading ? 'Authorizing Merchant...' : 'Open Seller Hub'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* ─── Store Registration Form ─── */
            <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                  Merchant / Owner Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vikram Sen"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #EAE3D9',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                  Boutique / Store Name
                </label>
                <input
                  type="text"
                  value={shopName}
                  onChange={(e) => setShopName(e.target.value)}
                  placeholder="e.g. Sole Street Sneaker Studio"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #EAE3D9',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                  Store Category
                </label>
                <select
                  value={shopCategory}
                  onChange={(e) => setShopCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #EAE3D9',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value="Footwear & Streetwear Sneakers">Footwear & Streetwear Sneakers</option>
                  <option value="Fashion & Apparel">Fashion & Apparel</option>
                  <option value="Jewellery & Watches">Jewellery & Watches</option>
                  <option value="Beauty & Fragrance">Beauty & Fragrance</option>
                  <option value="Gadgets & Accessories">Gadgets & Accessories</option>
                </select>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 700, color: '#333D2F' }}>
                    Physical Store Address
                  </label>
                  <button
                    type="button"
                    onClick={handleDetectStoreLocation}
                    disabled={isDetectingLocation}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#B45309',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: 0
                    }}
                  >
                    {isDetectingLocation ? <Loader2 size={13} className="nivvo-spin" /> : <Navigation size={13} />}
                    <span>{isDetectingLocation ? 'Detecting...' : 'Detect GPS'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={shopAddress}
                  onChange={(e) => setShopAddress(e.target.value)}
                  placeholder="e.g. 100ft Road, Indiranagar, Bengaluru"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #EAE3D9',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                    Mobile Number
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="9845067890"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                    Business Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seller@domain.in"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                    Create Password
                  </label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Password"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                    Confirm
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #EAE3D9',
                      fontSize: '13.5px',
                      fontWeight: 600,
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#B45309',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '13px',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(180, 83, 9, 0.25)',
                  marginTop: '6px'
                }}
              >
                <span>{loading ? 'Submitting Application...' : 'Register & Enter Hub'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ─── Role Switcher Links ─── */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #EAE3D9',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#73796F'
            }}>
              <span>Looking to shop doorstep fashion?</span>
              <button
                onClick={() => { playClickSound(); navigateTo('customer-login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#15803D',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <User size={14} />
                <span>Customer Login →</span>
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#73796F'
            }}>
              <span>Platform Operations Staff?</span>
              <button
                onClick={() => { playClickSound(); navigateTo('admin-login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#1D4ED8',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <Shield size={14} />
                <span>Admin Login →</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
