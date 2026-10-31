import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ShieldCheck, Lock, Mail, Eye, EyeOff, 
  ArrowRight, Sparkles, CheckCircle2, AlertCircle, 
  ArrowLeft, Store, User, KeyRound, ShieldAlert,
  Server, Cpu, Activity
} from 'lucide-react';
import { playClickSound, playSuccessChime } from '../../utils/audioEffects';
import { loginAdminApi } from '../../services/api';

export default function NivvoAdminLoginPage() {
  const { navigateTo, handleLoginSuccess, showToast } = useNivvo();

  // Form Fields
  const [identifier, setIdentifier] = useState('admin@nivvo.in');
  const [password, setPassword] = useState('Admin@Nivvo2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [securityPin, setSecurityPin] = useState('9901');

  // Status
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-Fill Admin Demo Credentials
  const handleQuickFill = () => {
    playClickSound();
    setIdentifier('admin@nivvo.in');
    setPassword('Admin@Nivvo2026!');
    setSecurityPin('9901');
    setErrorMessage('');
    setSuccessMessage('Administrator credentials loaded! Click "Authorize Console".');
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    playClickSound();
    setErrorMessage('');
    setSuccessMessage('');

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage('Please enter both administrator identity and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await loginAdminApi({
        identifier: identifier.trim(),
        password: password.trim()
      });

      if (res && (res.ok !== false && (res.token || res.user || res.id))) {
        playSuccessChime();
        setSuccessMessage('Access Granted! Opening Operations Control Center...');
        const authData = {
          user: res.user || {
            id: res.id || 'admin-1',
            name: res.name || 'Operations Administrator',
            email: identifier,
            role: 'admin'
          },
          token: res.token || 'demo-jwt-admin-token',
          role: 'admin'
        };
        setTimeout(() => {
          handleLoginSuccess(authData);
          navigateTo('admin-overview');
        }, 600);
      } else {
        setErrorMessage(res.error || res.message || 'Authorization failed. Invalid administrator credentials or role privileges.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Could not reach security service.');
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
      fontFamily: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* ─── Top Security Bar ─── */}
      <header style={{
        backgroundColor: '#1E293B',
        borderBottom: '1px solid #334155',
        padding: '14px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
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
          <span style={{ fontSize: '24px', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.04em' }}>
            nivvo
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 800,
            backgroundColor: '#1E3A8A',
            color: '#93C5FD',
            padding: '3px 8px',
            borderRadius: '6px',
            textTransform: 'uppercase',
            letterSpacing: '0.04em'
          }}>
            Operations Console
          </span>
        </div>

        <button
          onClick={() => { playClickSound(); navigateTo('landing'); }}
          style={{
            backgroundColor: 'transparent',
            border: '1px solid #334155',
            color: '#94A3B8',
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
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#334155';
            e.currentTarget.style.color = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#94A3B8';
          }}
        >
          <ArrowLeft size={15} />
          <span>Exit to Storefront</span>
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
          backgroundColor: '#1E293B',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px #334155',
          padding: '36px 32px',
          boxSizing: 'border-box'
        }}>
          {/* Header Badge & Title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'rgba(59, 130, 246, 0.15)',
              color: '#60A5FA',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              padding: '4px 12px',
              borderRadius: '99px',
              fontSize: '12px',
              fontWeight: 800,
              marginBottom: '12px'
            }}>
              <ShieldCheck size={14} />
              <span>ROLE-BASED OPERATIONS &amp; GOVERNANCE</span>
            </div>

            <h1 style={{
              fontSize: '26px',
              fontWeight: 900,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              margin: '0 0 8px'
            }}>
              Operations Console Login
            </h1>
            <p style={{
              fontSize: '13.5px',
              color: '#94A3B8',
              margin: 0,
              lineHeight: 1.45
            }}>
              Restricted system for merchant approvals, fleet telemetry, dispatch routing, and financial settlements.
            </p>
          </div>

          {/* DPDP 2023 Encrypted Banner */}
          <div style={{
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid #334155',
            borderRadius: '12px',
            padding: '10px 14px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            color: '#CBD5E1'
          }}>
            <Server size={15} color="#38BDF8" style={{ flexShrink: 0 }} />
            <span>256-bit encrypted session • All administrative actions logged to Neon DB audit trail.</span>
          </div>

          {/* Alerts */}
          {errorMessage && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid #EF4444',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#FCA5A5',
              fontSize: '13px',
              lineHeight: 1.4
            }}>
              <AlertCircle size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div style={{
              backgroundColor: 'rgba(34, 197, 94, 0.15)',
              border: '1px solid #22C55E',
              borderRadius: '12px',
              padding: '12px 14px',
              marginBottom: '18px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              color: '#86EFAC',
              fontSize: '13px',
              lineHeight: 1.4
            }}>
              <CheckCircle2 size={17} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>{successMessage}</div>
            </div>
          )}

          {/* ─── Admin Sign In Form ─── */}
          <form onSubmit={handleSignIn} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                Admin Email / Officer ID
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '12px', color: '#64748B', display: 'flex' }}>
                  <Mail size={16} />
                </div>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="admin@nivvo.in"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: '12px',
                    border: '1.5px solid #334155',
                    backgroundColor: '#0F172A',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#F8FAFC',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                Master Access Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '12px', color: '#64748B', display: 'flex' }}>
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter administrator password"
                  required
                  style={{
                    width: '100%',
                    padding: '11px 40px 11px 38px',
                    borderRadius: '12px',
                    border: '1.5px solid #334155',
                    backgroundColor: '#0F172A',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#F8FAFC',
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
                    color: '#64748B',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#E2E8F0', marginBottom: '6px' }}>
                Hardware Security Key / PIN (Optional)
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <div style={{ position: 'absolute', left: '12px', color: '#64748B', display: 'flex' }}>
                  <KeyRound size={16} />
                </div>
                <input
                  type="password"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  placeholder="PIN: 9901"
                  maxLength={6}
                  style={{
                    width: '100%',
                    padding: '11px 14px 11px 38px',
                    borderRadius: '12px',
                    border: '1.5px solid #334155',
                    backgroundColor: '#0F172A',
                    fontSize: '14px',
                    fontWeight: 700,
                    letterSpacing: '0.15em',
                    color: '#F8FAFC',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            {/* Demo Credentials Quick-Fill Button */}
            <button
              type="button"
              onClick={handleQuickFill}
              style={{
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                border: '1px dashed #3B82F6',
                borderRadius: '10px',
                padding: '9px 12px',
                fontSize: '12.5px',
                fontWeight: 700,
                color: '#60A5FA',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'background-color 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.2)'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)'}
            >
              <Sparkles size={14} color="#60A5FA" />
              <span>Auto-Fill Admin Demo (Operations Admin)</span>
            </button>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              style={{
                backgroundColor: '#2563EB',
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
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                marginTop: '4px',
                transition: 'transform 0.15s'
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.transform = 'translateY(-1px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <span>{loading ? 'Verifying Authorization...' : 'Authorize Admin Console'}</span>
              <ArrowRight size={16} />
            </button>
          </form>

          {/* ─── Role Switcher Links ─── */}
          <div style={{
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid #334155',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#94A3B8'
            }}>
              <span>Looking to shop doorstep fashion?</span>
              <button
                onClick={() => { playClickSound(); navigateTo('customer-login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#4ADE80',
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
              color: '#94A3B8'
            }}>
              <span>Are you a store merchant?</span>
              <button
                onClick={() => { playClickSound(); navigateTo('seller-login'); }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FBBF24',
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
          </div>
        </div>
      </main>
    </div>
  );
}
