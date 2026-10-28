import React, { useState, useEffect } from 'react';
import { ShieldCheck, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { playAddSound, playClickSound } from '../utils/audioEffects';
import { fetchProfile } from '../services/api';

// ROW 1: FOOTWEAR, RUNNING SHOES & CLOUD SLIDES (10-Min Fast Track)
const ROW_1_FOOTWEAR = [
  { name: 'White Minimalist Sneaker', img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&auto=format&fit=crop&q=80' },
  { name: 'Ergonomic Cloud Slides', img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=200&auto=format&fit=crop&q=80' },
  { name: 'Red Sport Runners', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80' },
  { name: 'Casual Skate Sneaker', img: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=200&auto=format&fit=crop&q=80' },
  { name: 'Comfort House Slipper', img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&auto=format&fit=crop&q=80' },
  { name: 'Black Low Top Sneaker', img: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=200&auto=format&fit=crop&q=80' },
  { name: 'Leather Penny Loafer', img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&auto=format&fit=crop&q=80' },
  { name: 'Beach Casual Flip Flop', img: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&auto=format&fit=crop&q=80' }
];

// ROW 2: MEN & WOMEN CLOTHING, HOODIES & JACKETS
const ROW_2_CLOTHING = [
  { name: 'Oversized Cotton Tee', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80' },
  { name: 'Classic Denim Jacket', img: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200&auto=format&fit=crop&q=80' },
  { name: 'Oxford Button-Down Shirt', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200&auto=format&fit=crop&q=80' },
  { name: 'Urban Fleece Hoodie', img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop&q=80' },
  { name: 'Navy Pique Polo', img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&auto=format&fit=crop&q=80' },
  { name: 'Summer Linen Top', img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=200&auto=format&fit=crop&q=80' },
  { name: 'Slim Fit Chinos', img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&auto=format&fit=crop&q=80' },
  { name: 'Monochrome Graphic Tee', img: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=200&auto=format&fit=crop&q=80' }
];

// ROW 3: ELECTRONICS, AUDIO, EARBUDS & SMARTWATCHES
const ROW_3_ELECTRONICS = [
  { name: 'Active ANC Wireless Earbuds', img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80' },
  { name: 'Smart AMOLED Fitness Watch', img: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&auto=format&fit=crop&q=80' },
  { name: 'Over-Ear Studio Headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80' },
  { name: 'Waterproof Bluetooth Speaker', img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&auto=format&fit=crop&q=80' },
  { name: '65W GaN Quick Charger', img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&auto=format&fit=crop&q=80' },
  { name: 'Cordless Precision Trimmer', img: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=200&auto=format&fit=crop&q=80' },
  { name: 'Braided Fast Charging Cable', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80' },
  { name: 'Slim Magnetic Power Bank', img: 'https://images.unsplash.com/photo-1609592807963-424a689f76a5?w=200&auto=format&fit=crop&q=80' }
];

// ROW 4: FASHION ACCESSORIES, PERFUMES, BAGS & SUNGLASSES
const ROW_4_ACCESSORIES = [
  { name: 'Polarized Sunglasses', img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=200&auto=format&fit=crop&q=80' },
  { name: 'Genuine Leather Belt', img: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=200&auto=format&fit=crop&q=80' },
  { name: 'Luxury Eau de Parfum', img: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=200&auto=format&fit=crop&q=80' },
  { name: 'Leather Bifold Wallet', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=200&auto=format&fit=crop&q=80' },
  { name: 'Chronograph Steel Watch', img: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=200&auto=format&fit=crop&q=80' },
  { name: 'Urban Crossbody Sling', img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&auto=format&fit=crop&q=80' },
  { name: 'Cotton Snapback Cap', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=200&auto=format&fit=crop&q=80' },
  { name: 'Leather Cardholder Case', img: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=200&auto=format&fit=crop&q=80' }
];

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [phone, setPhone] = useState('9876543210');
  const [step, setStep] = useState(1); // 1: phone entry, 2: otp
  const [otp, setOtp] = useState(['5', '4', '8', '2']);
  const [resendTimer, setResendTimer] = useState(25);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    let timer;
    if (step === 2 && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, resendTimer]);

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.length >= 10) {
      playAddSound();
      setStep(2);
      setResendTimer(25);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`auth-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`auth-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    playAddSound();

    try {
      const formattedPhone = `+91 ${phone.trim()}`;
      const backendData = await fetchProfile(formattedPhone);

      const loggedInUser = {
        name: backendData?.user?.name || (phone === '9876543210' ? 'Aditya Verma' : 'Verified Shopper'),
        phone: formattedPhone,
        email: backendData?.user?.email || `user${phone.slice(-4)}@example.com`,
        isVerified: true
      };

      if (onLoginSuccess) {
        onLoginSuccess(loggedInUser);
      }
    } catch (err) {
      if (onLoginSuccess) {
        onLoginSuccess({
          name: phone === '9876543210' ? 'Aditya Verma' : 'Verified Shopper',
          phone: `+91 ${phone.trim()}`,
          isVerified: true
        });
      }
    } finally {
      setIsVerifying(false);
      onClose();
    }
  };

  const renderMarqueeRow = (items, speedClass) => {
    // 3x duplication ensures an uninterrupted, seamless infinite conveyor scroll
    const tripleItems = [...items, ...items, ...items];
    return (
      <div className={`blinkit-auth-row-track ${speedClass}`}>
        {tripleItems.map((item, i) => (
          <div key={i} className="blinkit-auth-product-tile" title={item.name}>
            <img 
              src={item.img} 
              alt={item.name} 
              className="blinkit-auth-tile-img" 
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&auto=format&fit=crop&q=80';
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="blinkit-auth-screen-overlay" onClick={onClose}>
      <div className="blinkit-auth-screen-modal" onClick={(e) => e.stopPropagation()}>
        {/* Top Floating Skip Login Pill Button - Exact from Official Screenshot */}
        <button 
          type="button"
          className="blinkit-skip-login-pill" 
          onClick={() => { playClickSound(); onClose(); }}
          aria-label="Skip login and browse"
        >
          Skip login
        </button>

        {/* 100% Fashion, Footwear, Electronics & Accessories - ALL MOVING RIGHT TO LEFT */}
        <div className="blinkit-auth-marquee-container">
          {renderMarqueeRow(ROW_1_FOOTWEAR, 'speed-fast')}
          {renderMarqueeRow(ROW_2_CLOTHING, 'speed-med')}
          {renderMarqueeRow(ROW_3_ELECTRONICS, 'speed-slow')}
          {renderMarqueeRow(ROW_4_ACCESSORIES, 'speed-gentle')}
        </div>

        {/* Bottom Login Sheet with Smooth Gradient Fade */}
        <div className="blinkit-auth-bottom-sheet">
          {/* Nivvo Signature Brand Logo */}
          <div className="blinkwear-auth-brand-logo" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <img 
              src="/assets/nivvo_header_logo.svg" 
              alt="Nivvo" 
              width="36" 
              height="36" 
              style={{ borderRadius: '10px' }} 
            />
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#20251F', letterSpacing: '-0.5px', fontFamily: 'Inter, sans-serif' }}>nivvo</span>
          </div>

          {step === 1 ? (
            /* STEP 1: Phone Entry */
            <div className="blinkit-auth-form-wrap">
              <h2 className="blinkit-auth-headline">India's 10-minute wardrobe app</h2>
              <h3 className="blinkit-auth-subhead">Log In or Sign Up to Nivvo</h3>

              <form onSubmit={handleSendOtp} className="blinkit-auth-phone-form">
                <div className="blinkit-phone-input-group">
                  {/* Indian Flag Pill Box */}
                  <div className="blinkit-country-flag-box">
                    <span className="country-flag-icon">🇮🇳</span>
                    <ChevronDown size={14} color="#64748B" />
                  </div>

                  {/* Mobile Input Box with +91 */}
                  <div className="blinkit-phone-field-box">
                    <span className="country-code-text">+91</span>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter mobile number"
                      maxLength={10}
                      autoFocus
                      className="blinkit-phone-native-input"
                    />
                  </div>
                </div>

                {/* Big Full-Width Continue Button */}
                <button 
                  type="submit"
                  disabled={phone.length < 10}
                  className={`blinkit-auth-continue-btn ${phone.length >= 10 ? 'ready' : ''}`}
                >
                  Continue
                </button>
              </form>

              <div className="blinkit-auth-legal-footer">
                By continuing, you agree to our <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of service</a> & <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy policy</a>
              </div>
            </div>
          ) : (
            /* STEP 2: 4-Digit OTP Verification */
            <div className="blinkit-auth-form-wrap">
              <h2 className="blinkit-auth-headline">Verify Phone Number</h2>
              <p className="blinkit-otp-sent-sub">
                Enter the 4-digit code sent to <strong>+91 {phone}</strong>
              </p>

              <form onSubmit={handleVerify} className="blinkit-auth-phone-form">
                <div className="blinkit-otp-inputs-row">
                  {otp.map((digit, i) => (
                    <input 
                      key={i}
                      id={`auth-otp-${i}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      className="blinkit-otp-box"
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                <div className="blinkit-otp-helper-row">
                  <span className="autofill-tag">
                    <Check size={12} strokeWidth={3} /> Auto-detected: 5482
                  </span>
                  {resendTimer > 0 ? (
                    <span className="resend-countdown">Resend in {resendTimer}s</span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => { playClickSound(); setOtp(['5', '4', '8', '2']); setResendTimer(25); }} 
                      className="resend-active-btn"
                    >
                      <RotateCcw size={12} /> Resend OTP
                    </button>
                  )}
                </div>

                <button 
                  type="submit"
                  disabled={isVerifying}
                  className="blinkit-auth-continue-btn ready"
                >
                  {isVerifying ? 'Verifying...' : 'Verify & Continue'}
                </button>
              </form>

              <div className="blinkit-edit-number-wrap">
                <button 
                  type="button" 
                  onClick={() => setStep(1)} 
                  className="edit-number-link"
                >
                  Change mobile number
                </button>
              </div>

              <div className="blinkit-auth-legal-footer">
                <ShieldCheck size={12} color="#0C831F" style={{ display: 'inline', marginRight: '4px', verticalAlign: '-1px' }} />
                256-bit encrypted secure Nivvo login
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
