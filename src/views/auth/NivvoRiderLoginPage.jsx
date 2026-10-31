import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Bike, Lock, Phone, Mail, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, 
  ArrowLeft, User, Shield, MapPin, Loader2, Navigation,
  TrendingUp, Zap, Clock
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../../utils/audioEffects';
import { loginRiderApi, registerRiderApi } from '../../services/api';

export default function NivvoRiderLoginPage() {
  const { navigateTo, handleLoginSuccess, showToast, switchToAppMode } = useNivvo();

  // Mode: 'signin' | 'register'
  const [mode, setMode] = useState('signin');

  // Sign In Fields
  const [identifier, setIdentifier] = useState('9845012345');
  const [password, setPassword] = useState('Rider@Nivvo2026!');
  const [showPassword, setShowPassword] = useState(false);

  // Delivery Partner Registration Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [vehicleType, setVehicleType] = useState('Electric Scooter (EV)');
  const [vehicleNumber, setVehicleNumber] = useState('KA-03-EV-4421');
  const [operatingCity, setOperatingCity] = useState('Bengaluru (Indiranagar Hub)');
  const [regPassword, setRegPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-Fill Demo Delivery Partner Credentials
  const handleQuickFill = () => {
    playClickSound();
    setIdentifier('9845012345');
    setPassword('Rider@Nivvo2026!');
    setErrorMessage('');
    setSuccessMessage('Ravi Kumar (DP-042) fleet credentials loaded. Click "Open Delivery Console".');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter your rider phone/ID and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginRiderApi({
        identifier: identifier.trim(),
        password: password.trim()
      });

      if (res && (res.ok !== false && (res.token || res.user || res.id))) {
        playSuccessChime();
        setSuccessMessage(`Delivery Partner verified! Launching Fleet Duty Mode... ⚡`);
        const authData = {
          user: res.user || {
            id: res.id || 'rdr-01',
            name: res.name || 'Ravi Kumar',
            phone: identifier,
            email: res.email || 'ravi.fleet@nivvo.in',
            role: 'rider',
            verification_status: 'approved'
          },
          rider: res.rider || {
            partner_id: 'RDR-2041',
            name: res.name || 'Ravi Kumar',
            phone: identifier,
            vehicle_type: 'Electric Scooter (EV)',
            vehicle_number: 'KA-03-EV-4421',
            verification_status: 'approved',
            is_online: true
          },
          token: res.token || 'demo-jwt-rider-token',
          role: 'rider',
          verification_status: 'approved'
        };

        setTimeout(() => {
          handleLoginSuccess(authData);
          switchToAppMode('rider');
        }, 600);
      } else {
        setErrorMessage(res.error || res.message || 'Invalid delivery partner credentials.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not connect to fleet dispatch service.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim() || !phone.trim() || !regPassword.trim()) {
      setErrorMessage('Please fill in your name, phone number, and password.');
      return;
    }
    if (regPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please recheck.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerRiderApi({
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || `rider_${phone.replace(/\D/g, '')}@nivvo.fleet`,
        vehicle_type: vehicleType,
        vehicle_number: vehicleNumber.trim(),
        city: operatingCity,
        password: regPassword
      });

      if (res && (res.ok !== false && (res.token || res.user || res.id))) {
        playSuccessChime();
        setSuccessMessage('Delivery Partner application approved! Welcome to the Nivvo Fleet ⚡');
        const authData = {
          user: res.user || {
            id: res.id || 'rdr-new',
            name: name.trim(),
            phone: phone.trim(),
            role: 'rider',
            verification_status: 'approved'
          },
          rider: res.rider || {
            partner_id: 'RDR-' + Math.floor(1000 + Math.random() * 9000),
            name: name.trim(),
            phone: phone.trim(),
            vehicle_type: vehicleType,
            verification_status: 'approved',
            is_online: true
          },
          token: res.token || 'demo-jwt-rider-token',
          role: 'rider',
          verification_status: 'approved'
        };
        setTimeout(() => {
          handleLoginSuccess(authData);
          switchToAppMode('rider');
        }, 600);
      } else {
        setErrorMessage(res.error || res.message || 'Rider registration failed.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Connection to fleet registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0F172A',
      color: '#F8FAFC',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Top Navbar */}
      <div style={{
        padding: '16px 32px',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            onClick={() => { playClickSound(); navigateTo('landing'); }}
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#F8FAFC',
              borderRadius: '8px',
              padding: '6px 12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: 600
            }}
          >
            <ArrowLeft size={16} />
            <span>Website Home</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              backgroundColor: '#B7F34A',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#0F172A',
              fontWeight: 900
            }}>
              ⚡
            </div>
            <span style={{ fontSize: '18px', fontWeight: 900, letterSpacing: '-0.03em', color: '#F8FAFC' }}>
              nivvo <span style={{ color: '#B7F34A', fontSize: '14px', fontWeight: 700 }}>Fleet</span>
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={() => { playClickSound(); navigateTo('customer-login'); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Customer Login
          </button>
          <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
          <button
            onClick={() => { playClickSound(); navigateTo('seller-login'); }}
            style={{
              background: 'none',
              border: 'none',
              color: '#94A3B8',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Seller Hub
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        maxWidth: '1280px',
        width: '100%',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 460px) minmax(320px, 480px)',
          gap: '48px',
          alignItems: 'center',
          width: '100%',
          maxWidth: '960px'
        }}>
          {/* Left Hero Column */}
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(183, 243, 74, 0.1)',
              color: '#B7F34A',
              padding: '6px 12px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '16px'
            }}>
              <Zap size={14} />
              <span>Hyperlocal 10-Minute Fleet</span>
            </div>

            <h1 style={{
              fontSize: '34px',
              fontWeight: 900,
              lineHeight: 1.15,
              color: '#F8FAFC',
              marginBottom: '12px',
              letterSpacing: '-0.02em'
            }}>
              Deliver speed.<br />
              <span style={{ color: '#B7F34A' }}>Earn per trip.</span>
            </h1>

            <p style={{
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#94A3B8',
              marginBottom: '28px'
            }}>
              Join the fastest delivery network. Receive nearby orders from local boutiques and dark stores with instant daily payouts and live turn-by-turn routing.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(183, 243, 74, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B7F34A' }}>
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>₹65–₹110 per delivery</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Peak-hour incentives & try-on doorstep bonuses</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(183, 243, 74, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B7F34A' }}>
                  <Clock size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>Instant UPI Payouts</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>Withdraw earnings instantly to your bank account</div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: 'rgba(183, 243, 74, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B7F34A' }}>
                  <Navigation size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F8FAFC' }}>Smart Radar Order Matching</div>
                  <div style={{ fontSize: '12px', color: '#64748B' }}>High priority dispatch based on your live location</div>
                </div>
              </div>
            </div>

            {/* Quick Demo Pill */}
            <button
              onClick={handleQuickFill}
              style={{
                backgroundColor: 'rgba(183, 243, 74, 0.12)',
                border: '1px solid rgba(183, 243, 74, 0.3)',
                borderRadius: '10px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                color: '#B7F34A',
                fontSize: '13px',
                fontWeight: 700,
                width: '100%',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
            >
              <Sparkles size={16} />
              <span>Auto-Fill Demo Rider (Ravi Kumar)</span>
            </button>
          </div>

          {/* Right Login / Register Card */}
          <div style={{
            backgroundColor: '#1E293B',
            border: '1px solid #334155',
            borderRadius: '20px',
            padding: '32px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}>
            {/* Tabs */}
            <div style={{
              display: 'flex',
              backgroundColor: '#0F172A',
              borderRadius: '10px',
              padding: '4px',
              marginBottom: '24px'
            }}>
              <button
                type="button"
                onClick={() => { playClickSound(); setMode('signin'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: mode === 'signin' ? '#334155' : 'transparent',
                  color: mode === 'signin' ? '#F8FAFC' : '#94A3B8',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { playClickSound(); setMode('register'); setErrorMessage(''); setSuccessMessage(''); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: mode === 'register' ? '#334155' : 'transparent',
                  color: mode === 'register' ? '#F8FAFC' : '#94A3B8',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                New Partner Onboarding
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div style={{
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#FCA5A5',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div style={{
                backgroundColor: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
                color: '#86EFAC',
                padding: '10px 14px',
                borderRadius: '8px',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '16px'
              }}>
                <CheckCircle2 size={16} />
                <span>{successMessage}</span>
              </div>
            )}

            {/* SIGN IN FORM */}
            {mode === 'signin' ? (
              <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                    Rider Phone, ID or Email
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type="text"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      placeholder="e.g. 9845012345 or Ravi Kumar"
                      style={{
                        width: '100%',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        padding: '10px 12px 10px 38px',
                        color: '#F8FAFC',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '6px' }}>
                    Password
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock size={16} color="#64748B" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '10px',
                        padding: '10px 40px 10px 38px',
                        color: '#F8FAFC',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '11px',
                        background: 'none',
                        border: 'none',
                        color: '#64748B',
                        cursor: 'pointer'
                      }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: '#B7F34A',
                    color: '#0F172A',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '8px',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="nivvo-spin" />
                      <span>Authenticating Partner...</span>
                    </>
                  ) : (
                    <>
                      <span>Open Delivery Console</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* REGISTRATION FORM */
              <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Suresh Nair"
                    style={{
                      width: '100%',
                      backgroundColor: '#0F172A',
                      border: '1px solid #334155',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      color: '#F8FAFC',
                      fontSize: '13px',
                      outline: 'none'
                    }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Mobile Phone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98XXXXXXXX"
                      style={{
                        width: '100%',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#F8FAFC',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Vehicle Type
                    </label>
                    <select
                      value={vehicleType}
                      onChange={(e) => setVehicleType(e.target.value)}
                      style={{
                        width: '100%',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#F8FAFC',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    >
                      <option value="Electric Scooter (EV)">Electric Scooter (EV)</option>
                      <option value="Motorcycle / Petrol Bike">Motorcycle / Petrol Bike</option>
                      <option value="Bicycle">Bicycle</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Vehicle Plate / Reg
                    </label>
                    <input
                      type="text"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="KA-01-EV-1234"
                      style={{
                        width: '100%',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#F8FAFC',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Operating City
                    </label>
                    <input
                      type="text"
                      value={operatingCity}
                      onChange={(e) => setOperatingCity(e.target.value)}
                      placeholder="Bengaluru (Indiranagar)"
                      style={{
                        width: '100%',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#F8FAFC',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Create Password
                    </label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#F8FAFC',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#94A3B8', marginBottom: '4px' }}>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      style={{
                        width: '100%',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        padding: '8px 12px',
                        color: '#F8FAFC',
                        fontSize: '13px',
                        outline: 'none'
                      }}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: '#B7F34A',
                    color: '#0F172A',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '12px',
                    fontSize: '14px',
                    fontWeight: 800,
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '6px',
                    opacity: loading ? 0.7 : 1
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="nivvo-spin" />
                      <span>Submitting Application...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Partner Application</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
