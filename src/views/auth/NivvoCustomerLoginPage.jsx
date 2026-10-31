import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  User, Lock, Phone, Mail, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, 
  ArrowLeft, Store, Shield, RefreshCw, KeyRound, Check
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../../utils/audioEffects';
import { loginCustomerApi, registerCustomerApi, sendOtpApi } from '../../services/api';

export default function NivvoCustomerLoginPage() {
  const { navigateTo, handleLoginSuccess, showToast } = useNivvo();

  // Mode: 'signin' | 'signup'
  const [mode, setMode] = useState('signin');
  // Auth Method: 'password' | 'otp'
  const [method, setMethod] = useState('password');

  // Form Fields
  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('Customer@Nivvo2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Sign Up Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [otpCountdown, setOtpCountdown] = useState(0);

  // Feedback State
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Demo Credentials Fill
  const handleQuickFill = () => {
    playClickSound();
    setIdentifier('9876543210');
    setPassword('Customer@Nivvo2026!');
    setErrorMessage('');
    setSuccessMessage('Demo customer credentials filled! Click "Sign In" below.');
  };

  const handleSendOtp = async () => {
    playClickSound();
    if (!identifier || identifier.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      await sendOtpApi(identifier);
      setOtpSent(true);
      setOtpCountdown(30);
      setSuccessMessage(`OTP sent! Use demo code 5482 or 123456 to verify.`);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage('');
    setSuccessMessage('');

    if (method === 'otp') {
      if (!otpCode || otpCode.length < 4) {
        setErrorMessage('Please enter the 4-digit or 6-digit verification code.');
        return;
      }
    } else {
      if (!identifier.trim() || !password.trim()) {
        setErrorMessage('Please enter both your phone/email and password.');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await loginCustomerApi({
        identifier: identifier.trim(),
        password: method === 'password' ? password : '',
        otp: method === 'otp' ? otpCode : ''
      });

      if (res && (res.ok !== false && (res.token || res.user || res.id))) {
        playSuccessChime();
        setSuccessMessage('Login successful! Redirecting to Nivvo Storefront...');
        const authData = {
          user: res.user || {
            id: res.id || 'cust-1',
            name: res.name || 'Aarav Shah',
            phone: identifier,
            email: res.email || 'aarav.shah@gmail.com',
            role: 'customer'
          },
          token: res.token || 'demo-jwt-customer-token',
          role: 'customer'
        };
        setTimeout(() => {
          handleLoginSuccess(authData);
          navigateTo('landing');
        }, 600);
      } else {
        setErrorMessage(res.error || res.message || 'Invalid customer credentials. Please check details.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not connect to authentication service.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !phone.trim() || !email.trim() || !signUpPassword.trim()) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }
    if (signUpPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerCustomerApi({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim(),
        password: signUpPassword
      });

      if (res && (res.ok !== false && (res.token || res.user || res.id))) {
        playSuccessChime();
        setSuccessMessage('Account registered successfully! Welcome to Nivvo.');
        const authData = {
          user: res.user || {
            id: res.id || `cust-${Date.now()}`,
            name,
            phone,
            email,
            role: 'customer'
          },
          token: res.token || 'demo-jwt-customer-token',
          role: 'customer'
        };
        setTimeout(() => {
          handleLoginSuccess(authData);
          navigateTo('landing');
        }, 700);
      } else {
        setErrorMessage(res.error || res.message || 'Registration failed. Phone or email may already be registered.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Registration request could not be processed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F5F7F3',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* ─── Top Header Bar ─── */}
      <header style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E7EAE3',
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
            backgroundColor: '#EEF4EC',
            color: '#24452D',
            padding: '3px 8px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Customer Login
          </span>
        </div>

        <button
          onClick={() => { playClickSound(); navigateTo('landing'); }}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #E7EAE3',
            color: '#24452D',
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
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F2EB'}
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
          maxWidth: '460px',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 16px 48px rgba(36, 69, 45, 0.08), 0 2px 6px rgba(0,0,0,0.02)',
          border: '1px solid #E7EAE3',
          padding: '36px 32px',
          boxSizing: 'border-box'
        }}>
          {/* Header Badge & Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#EEF4EC',
              color: '#24452D',
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '12px'
            }}>
              <User size={14} />
              <span>SHOPPER & CUSTOMER ACCOUNT</span>
            </div>

            <h1 style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#20251F',
              letterSpacing: '-0.03em',
              margin: '0 0 8px'
            }}>
              {mode === 'signin' ? 'Welcome Back to Nivvo' : 'Create Customer Account'}
            </h1>
            <p style={{
              fontSize: '13.5px',
              color: '#73796F',
              margin: 0,
              lineHeight: 1.45
            }}>
              {mode === 'signin' 
                ? 'Sign in to access your 10-minute wardrobe try-ons and live orders.' 
                : 'Join India\'s premier doorstep fashion try-on network in 30 seconds.'}
            </p>
          </div>

          {/* Mode Tabs: Sign In / Create Account */}
          <div style={{
            display: 'flex',
            backgroundColor: '#F5F6F2',
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
                color: mode === 'signin' ? '#24452D' : '#73796F',
                fontWeight: mode === 'signin' ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: mode === 'signin' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              Sign In
            </button>
            <button
              onClick={() => { playClickSound(); setMode('signup'); setErrorMessage(''); setSuccessMessage(''); }}
              style={{
                flex: 1,
                padding: '9px',
                borderRadius: '8px',
                border: 'none',
                backgroundColor: mode === 'signup' ? '#FFFFFF' : 'transparent',
                color: mode === 'signup' ? '#24452D' : '#73796F',
                fontWeight: mode === 'signup' ? 800 : 600,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: mode === 'signup' ? '0 2px 6px rgba(0,0,0,0.06)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              New Account
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

          {/* ─── Sign In Form ─── */}
          {mode === 'signin' ? (
            <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Method Toggle: Password vs OTP */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#20251F' }}>Login Method:</span>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    type="button"
                    onClick={() => { setMethod('password'); setErrorMessage(''); }}
                    style={{
                      background: method === 'password' ? '#EEF4EC' : 'none',
                      border: `1px solid ${method === 'password' ? '#24452D' : '#E7EAE3'}`,
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: method === 'password' ? 800 : 600,
                      color: method === 'password' ? '#24452D' : '#73796F',
                      cursor: 'pointer'
                    }}
                  >
                    Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setMethod('otp'); setErrorMessage(''); }}
                    style={{
                      background: method === 'otp' ? '#EEF4EC' : 'none',
                      border: `1px solid ${method === 'otp' ? '#24452D' : '#E7EAE3'}`,
                      borderRadius: '8px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      fontWeight: method === 'otp' ? 800 : 600,
                      color: method === 'otp' ? '#24452D' : '#73796F',
                      cursor: 'pointer'
                    }}
                  >
                    Instant OTP
                  </button>
                </div>
              </div>

              {/* Identifier Input */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '6px' }}>
                  Phone Number or Email
                </label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <div style={{ position: 'absolute', left: '12px', color: '#73796F', display: 'flex' }}>
                    <Phone size={16} />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. 9876543210 or yourname@gmail.com"
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px 11px 38px',
                      borderRadius: '12px',
                      border: '1.5px solid #E7EAE3',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#20251F',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              </div>

              {/* Password or OTP Input */}
              {method === 'password' ? (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#333D2F' }}>
                      Password
                    </label>
                    <span 
                      onClick={() => showToast('Enter demo password: Customer@Nivvo2026! or click Quick-Fill demo below.')}
                      style={{ fontSize: '12px', color: '#15803D', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Forgot?
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
                      placeholder="Enter account password"
                      required
                      style={{
                        width: '100%',
                        padding: '11px 40px 11px 38px',
                        borderRadius: '12px',
                        border: '1.5px solid #E7EAE3',
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
              ) : (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '13px', fontWeight: 700, color: '#333D2F' }}>
                      One-Time Password (OTP)
                    </label>
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={loading || otpCountdown > 0}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: otpCountdown > 0 ? '#9CA3AF' : '#15803D',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: otpCountdown > 0 ? 'default' : 'pointer',
                        padding: 0
                      }}
                    >
                      {otpCountdown > 0 ? `Resend in ${otpCountdown}s` : (otpSent ? 'Resend OTP' : 'Send Code')}
                    </button>
                  </div>
                  <input
                    type="text"
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="Enter 4-digit code (e.g. 5482)"
                    maxLength={6}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid #E7EAE3',
                      fontSize: '15px',
                      fontWeight: 800,
                      letterSpacing: '0.15em',
                      color: '#20251F',
                      textAlign: 'center',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
              )}

              {/* Demo Credentials Quick-Fill Button */}
              <button
                type="button"
                onClick={handleQuickFill}
                style={{
                  backgroundColor: '#F5F8F3',
                  border: '1px dashed #A3C9A8',
                  borderRadius: '10px',
                  padding: '9px 12px',
                  fontSize: '12.5px',
                  fontWeight: 700,
                  color: '#24452D',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#E8F2E6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#F5F8F3'}
              >
                <Sparkles size={14} color="#15803D" />
                <span>Auto-Fill Customer Demo (Aarav Shah)</span>
              </button>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#24452D',
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
                  boxShadow: '0 4px 14px rgba(36, 69, 45, 0.25)',
                  marginTop: '4px',
                  transition: 'transform 0.15s'
                }}
                onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                <span>{loading ? 'Authenticating...' : 'Sign In as Customer'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          ) : (
            /* ─── Sign Up Form ─── */
            <form onSubmit={handleSignUp} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #E7EAE3',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                  Mobile Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. 9812345678"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #E7EAE3',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. priya@example.com"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #E7EAE3',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                  Create Password
                </label>
                <input
                  type="password"
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #E7EAE3',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#333D2F', marginBottom: '4px' }}>
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #E7EAE3',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  backgroundColor: '#24452D',
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
                  boxShadow: '0 4px 14px rgba(36, 69, 45, 0.25)',
                  marginTop: '6px'
                }}
              >
                <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
                <ArrowRight size={16} />
              </button>
            </form>
          )}

          {/* ─── Role Switcher Links ─── */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #E7EAE3',
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
              <span>Are you a store merchant?</span>
              <button
                onClick={() => { playClickSound(); navigateTo('seller-login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#B45309',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: 0
                }}
              >
                <Store size={14} />
                <span>Seller Login →</span>
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
