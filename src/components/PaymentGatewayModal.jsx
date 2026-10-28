import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  CreditCard, 
  QrCode, 
  Banknote, 
  Lock, 
  RefreshCw, 
  Check, 
  ArrowRight,
  Smartphone,
  Wallet
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { processPaymentApi } from '../services/api';
import { playClickSound, playOrderFanfare } from '../utils/audioEffects';

export default function PaymentGatewayModal({ 
  isOpen, 
  onClose, 
  orderData, 
  onPaymentSuccess,
  walletBalance = 250
}) {
  const [paymentTab, setPaymentTab] = useState('upi'); // 'upi', 'card', 'wallet', 'cod'
  const [selectedUpiApp, setSelectedUpiApp] = useState('gpay');
  const [customUpiId, setCustomUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('Aditya Verma');
  const [useWalletCash, setUseWalletCash] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Payment Status: 'idle' | 'processing' | 'success' | 'failed'
  const [paymentStatus, setPaymentStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [paymentResult, setPaymentResult] = useState(null);

  if (!isOpen || !orderData) return null;

  const rawTotal = orderData.grandTotal || 499;
  const effectiveTotal = useWalletCash ? Math.max(0, rawTotal - walletBalance) : rawTotal;

  const formatCardNumber = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 16);
    return cleaned.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 4);
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleInitiatePayment = async () => {
    playClickSound();
    setPaymentStatus('processing');
    setErrorMessage('');

    const payload = {
      orderId: orderData.orderId || `BW-${Math.floor(100000 + Math.random() * 900000)}`,
      amount: effectiveTotal,
      paymentMethod: paymentTab.toUpperCase(),
      upiId: customUpiId || (paymentTab === 'upi' ? `${selectedUpiApp}@upi` : null),
      cardNumber: cardNumber ? `**** **** **** ${cardNumber.replace(/\s/g, '').slice(-4)}` : null,
      simulateFailure
    };

    const result = await processPaymentApi(payload);

    if (result && result.success) {
      setPaymentResult(result);
      setPaymentStatus('success');
      playOrderFanfare();
      try {
        confetti({ particleCount: 90, spread: 75, origin: { y: 0.6 } });
      } catch (e) {}
      
      // Auto-confirm after 1.8 seconds
      setTimeout(() => {
        onPaymentSuccess({
          ...orderData,
          paymentId: result.paymentId,
          paymentMethod: paymentTab.toUpperCase(),
          grandTotal: effectiveTotal,
          walletUsed: useWalletCash ? Math.min(rawTotal, walletBalance) : 0
        });
      }, 1800);
    } else {
      setPaymentStatus('failed');
      setErrorMessage(result?.message || 'Payment authorization declined by card issuer or bank server timed out.');
    }
  };

  return (
    <div className="modal-overlay" onClick={paymentStatus === 'processing' ? null : onClose}>
      <div className="modal-card payment-gateway-card" onClick={(e) => e.stopPropagation()}>
        {/* Header with Security Badge */}
        <div className="gateway-header">
          <div className="gateway-brand-wrap">
            <div className="gateway-shield-icon">
              <Lock size={16} color="#0C831F" />
            </div>
            <div>
              <div className="gateway-title">Nivvo Secure Checkout</div>
              <div className="gateway-sub">256-Bit Bank Grade SSL • 10-Min Fast Track</div>
            </div>
          </div>
          {paymentStatus !== 'processing' && (
            <button className="modal-close-btn" onClick={onClose}>
              <X size={20} />
            </button>
          )}
        </div>

        {/* Order Summary Strip */}
        <div className="gateway-amount-strip">
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>
              Amount to Pay
            </div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#0F172A' }}>
              ₹{effectiveTotal}
              {useWalletCash && (
                <span style={{ fontSize: '11.5px', color: '#0C831F', marginLeft: '6px', fontWeight: 700 }}>
                  (₹{Math.min(rawTotal, walletBalance)} Wallet Cash Applied)
                </span>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ 
              fontSize: '11px', 
              fontWeight: 800, 
              background: '#DCFCE7', 
              color: '#15803D', 
              padding: '3px 8px', 
              borderRadius: '99px' 
            }}>
              ⚡ 10-Min Dispatch
            </span>
            <div style={{ fontSize: '11px', color: '#64748B', marginTop: '3px' }}>
              {orderData.items?.length || 1} Apparel Items
            </div>
          </div>
        </div>

        {/* STATE: PROCESSING */}
        {paymentStatus === 'processing' && (
          <div className="gateway-processing-view">
            <div className="gateway-spinner" />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A', marginTop: '16px' }}>
              Processing Payment...
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '300px', marginTop: '6px' }}>
              Connecting to secure bank gateway and verifying authorization. Please do not refresh or hit back.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '18px', color: '#0C831F', fontSize: '12px', fontWeight: 700 }}>
              <ShieldCheck size={16} />
              <span>Verified by NPCI & Visa / Mastercard</span>
            </div>
          </div>
        )}

        {/* STATE: SUCCESS */}
        {paymentStatus === 'success' && (
          <div className="gateway-success-view">
            <div className="gateway-success-icon-wrap">
              <CheckCircle2 size={48} color="#0C831F" />
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 900, color: '#0F172A', marginTop: '12px' }}>
              Payment Successful!
            </h3>
            <p style={{ fontSize: '13px', color: '#0C831F', fontWeight: 700, marginTop: '2px' }}>
              ₹{effectiveTotal} Received • Order Confirmed
            </p>
            <div className="gateway-ref-pill">
              Payment ID: <strong>{paymentResult?.paymentId}</strong>
            </div>
            <p style={{ fontSize: '11.5px', color: '#64748B', marginTop: '10px' }}>
              Routing you to the live 10-minute dispatch tracker...
            </p>
          </div>
        )}

        {/* STATE: FAILED */}
        {paymentStatus === 'failed' && (
          <div className="gateway-failed-view">
            <div className="gateway-failed-icon-wrap">
              <AlertCircle size={44} color="#DC2626" />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#991B1B', marginTop: '10px' }}>
              Payment Failed
            </h3>
            <p style={{ fontSize: '12.5px', color: '#64748B', maxWidth: '320px', margin: '8px auto' }}>
              {errorMessage}
            </p>
            <div style={{ display: 'flex', gap: '10px', marginTop: '16px', width: '100%' }}>
              <button 
                className="gateway-action-btn primary"
                onClick={() => { setSimulateFailure(false); handleInitiatePayment(); }}
              >
                <RefreshCw size={14} />
                <span>Retry Payment</span>
              </button>
              <button 
                className="gateway-action-btn secondary"
                onClick={() => { setPaymentStatus('idle'); setPaymentTab('cod'); }}
              >
                <Banknote size={14} />
                <span>Switch to COD</span>
              </button>
            </div>
          </div>
        )}

        {/* STATE: IDLE (Selection) */}
        {paymentStatus === 'idle' && (
          <div className="gateway-body">
            {/* Wallet Quick Balance Checkbox */}
            {walletBalance > 0 && (
              <div 
                className={`wallet-apply-strip ${useWalletCash ? 'active' : ''}`}
                onClick={() => { playClickSound(); setUseWalletCash(!useWalletCash); }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Wallet size={18} color={useWalletCash ? '#0C831F' : '#64748B'} />
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#0F172A' }}>
                      Use Nivvo Cash
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      Available Balance: ₹{walletBalance}
                    </div>
                  </div>
                </div>
                <div className={`custom-checkbox ${useWalletCash ? 'checked' : ''}`}>
                  {useWalletCash && <Check size={12} strokeWidth={3} />}
                </div>
              </div>
            )}

            {/* Payment Method Selector Tabs */}
            <div className="gateway-method-tabs">
              <button 
                className={`method-tab-btn ${paymentTab === 'upi' ? 'active' : ''}`}
                onClick={() => { playClickSound(); setPaymentTab('upi'); }}
              >
                <Smartphone size={16} />
                <span>UPI (Instant)</span>
              </button>
              <button 
                className={`method-tab-btn ${paymentTab === 'card' ? 'active' : ''}`}
                onClick={() => { playClickSound(); setPaymentTab('card'); }}
              >
                <CreditCard size={16} />
                <span>Cards</span>
              </button>
              <button 
                className={`method-tab-btn ${paymentTab === 'cod' ? 'active' : ''}`}
                onClick={() => { playClickSound(); setPaymentTab('cod'); }}
              >
                <Banknote size={16} />
                <span>Pay on Arrival</span>
              </button>
            </div>

            {/* TAB CONTENT: UPI */}
            {paymentTab === 'upi' && (
              <div className="tab-content-panel">
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                  Select Installed UPI App
                </div>
                <div className="upi-app-grid">
                  {[
                    { id: 'gpay', name: 'Google Pay', icon: '🟢', vpa: 'aditya@oksbi' },
                    { id: 'phonepe', name: 'PhonePe', icon: '🟣', vpa: 'aditya@ybl' },
                    { id: 'paytm', name: 'Paytm UPI', icon: '🔵', vpa: 'aditya@paytm' },
                    { id: 'cred', name: 'CRED UPI', icon: '⚫', vpa: 'aditya@cred' }
                  ].map((app) => (
                    <div 
                      key={app.id}
                      className={`upi-app-card ${selectedUpiApp === app.id ? 'active' : ''}`}
                      onClick={() => { playClickSound(); setSelectedUpiApp(app.id); setCustomUpiId(app.vpa); }}
                    >
                      <span style={{ fontSize: '20px' }}>{app.icon}</span>
                      <span className="upi-app-name">{app.name}</span>
                      {selectedUpiApp === app.id && (
                        <div className="upi-check-badge">
                          <Check size={10} strokeWidth={3} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '12px' }}>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Or Enter Any UPI ID / VPA
                  </label>
                  <input 
                    type="text"
                    placeholder="e.g. yourname@okhdfcbank"
                    value={customUpiId}
                    onChange={(e) => setCustomUpiId(e.target.value)}
                    className="gateway-input"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: CARD */}
            {paymentTab === 'card' && (
              <div className="tab-content-panel">
                <div className="gateway-form-group">
                  <label>Card Number</label>
                  <input 
                    type="text"
                    placeholder="4532 8920 1294 8839"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    className="gateway-input"
                    maxLength={19}
                  />
                </div>
                <div className="gateway-form-grid-2">
                  <div className="gateway-form-group">
                    <label>Valid Thru (MM/YY)</label>
                    <input 
                      type="text"
                      placeholder="08/29"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                      className="gateway-input"
                      maxLength={5}
                    />
                  </div>
                  <div className="gateway-form-group">
                    <label>CVV / CVC</label>
                    <input 
                      type="password"
                      placeholder="•••"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.slice(0, 4))}
                      className="gateway-input"
                      maxLength={4}
                    />
                  </div>
                </div>
                <div className="gateway-form-group">
                  <label>Name on Card</label>
                  <input 
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    className="gateway-input"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: COD */}
            {paymentTab === 'cod' && (
              <div className="tab-content-panel">
                <div className="cod-info-box">
                  <Banknote size={24} color="#0C831F" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                      Pay at Doorstep after 2-Size Trial
                    </div>
                    <div style={{ fontSize: '11.5px', color: '#64748B', marginTop: '2px' }}>
                      Try both sizes at home. Pay ₹{effectiveTotal} using Cash or Rider UPI QR only for what you keep!
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Simulator Developer Controls for User Verification */}
            <div className="gateway-testing-toolbar">
              <span style={{ fontSize: '10.5px', fontWeight: 800, color: '#64748B' }}>TEST GATEWAY BEHAVIOR:</span>
              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button 
                  className={`test-toggle-btn ${!simulateFailure ? 'active' : ''}`}
                  onClick={() => setSimulateFailure(false)}
                >
                  ✓ Simulate Success
                </button>
                <button 
                  className={`test-toggle-btn ${simulateFailure ? 'active-fail' : ''}`}
                  onClick={() => setSimulateFailure(true)}
                >
                  ✗ Simulate Bank Decline
                </button>
              </div>
            </div>

            {/* Pay CTA Button */}
            <div style={{ marginTop: '16px' }}>
              <button 
                className="gateway-pay-cta-btn"
                onClick={handleInitiatePayment}
              >
                <span>
                  {paymentTab === 'cod' ? 'Confirm 10-Min Order' : `Pay ₹${effectiveTotal} Securely`}
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
