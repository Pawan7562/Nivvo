import React from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  X, ShoppingBag, ShieldAlert, HelpCircle, Calendar, 
  Bell, BatteryCharging, FileText, TrendingUp, LogOut, 
  ChevronRight, Sparkles, User, Bike, PhoneCall, Zap, PowerOff, Headphones
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';

export default function RiderThreeDotMenuModal({ isOpen, onClose }) {
  const { 
    riderProfile, 
    switchToCustomerMode, 
    setActiveModal, 
    navigateTo, 
    logoutUser,
    toggleRiderDuty
  } = useNivvo();

  if (!isOpen) return null;

  const handleAction = (actionFn) => {
    playClickSound();
    onClose();
    actionFn();
  };

  return (
    <div className="nivvo-modal-overlay" onClick={onClose}>
      <div 
        className="nivvo-modal-sheet" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '420px', margin: '0 auto' }}
      >
        <div className="nivvo-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="#1F4230" />
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
              Fleet Options
            </h3>
          </div>
          <button className="nivvo-modal-close-btn" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '10px' }}>
          
          {/* 1. Toggle Duty */}
          <div
            onClick={() => handleAction(toggleRiderDuty)}
            style={{
              backgroundColor: '#F9FAF7',
              border: '1px solid #E5E7DE',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: riderProfile.is_online ? '#E8F5E9' : '#F3F4F1',
                color: riderProfile.is_online ? '#15803D' : '#6B7265',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {riderProfile.is_online ? <Zap size={16} /> : <PowerOff size={16} />}
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                  {riderProfile.is_online ? 'Pause Duty (Go Offline)' : 'Resume Duty (Go Online)'}
                </div>
                <div style={{ fontSize: '11px', color: '#6B7265' }}>
                  Status: {riderProfile.is_online ? 'Online' : 'Offline'}
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#6B7265" />
          </div>

          {/* 2. Switch to Shopping Mode */}
          <div
            onClick={() => handleAction(switchToCustomerMode)}
            style={{
              backgroundColor: '#F9FAF7',
              border: '1px solid #E5E7DE',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#E8F5E9',
                color: '#1F4230',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                  Customer Shopping Mode
                </div>
                <div style={{ fontSize: '11px', color: '#6B7265' }}>
                  Order footwear and garments
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#6B7265" />
          </div>

          {/* 3. Live Chat Support Desk */}
          <div
            onClick={() => handleAction(() => navigateTo('rider-support'))}
            style={{
              backgroundColor: '#F9FAF7',
              border: '1px solid #E5E7DE',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#1F4230',
                color: '#C6F432',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Headphones size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                  Chat Support & Call Request
                </div>
                <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 600 }}>
                  ● Online · Live Dispatcher
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#6B7265" />
          </div>

          {/* 4. Call Dispatch */}
          <a
            href="tel:+918049128820"
            onClick={() => handleAction(() => {})}
            style={{
              backgroundColor: '#F9FAF7',
              border: '1px solid #E5E7DE',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              textDecoration: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#E8F5E9',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <PhoneCall size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                  Call Dispatch Controller
                </div>
                <div style={{ fontSize: '11px', color: '#6B7265' }}>
                  Indiranagar Hub #14 direct line
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#6B7265" />
          </a>

          {/* 4. Emergency SOS */}
          <div
            onClick={() => handleAction(() => setActiveModal('riderSafety'))}
            style={{
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#DC2626',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldAlert size={16} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#DC2626' }}>
                  Emergency SOS
                </div>
                <div style={{ fontSize: '11px', color: '#7F1D1D' }}>
                  Ambulance & Police emergency
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#DC2626" />
          </div>

          {/* 5. Sign Out */}
          <div
            onClick={() => handleAction(logoutUser)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: '#F3F4F1',
                color: '#6B7265',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <LogOut size={15} />
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                  Sign Out
                </div>
                <div style={{ fontSize: '11px', color: '#6B7265' }}>
                  Safely end fleet session
                </div>
              </div>
            </div>
            <ChevronRight size={16} color="#6B7265" />
          </div>

        </div>
      </div>
    </div>
  );
}
