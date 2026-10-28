import React, { useState } from 'react';
import { useNivvo } from '../context/NivvoAppContext';
import { 
  X, Bike, Zap, ShieldCheck, ArrowRight, CheckCircle2, 
  DollarSign, MapPin, Sparkles, Clock, AlertCircle 
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../utils/audioEffects';

export default function BecomeRiderModal({ isOpen, onClose }) {
  const { currentUser, registerCustomerAsRider } = useNivvo();

  const [name, setName] = useState(currentUser?.name || 'Aarav Shah');
  const [phone, setPhone] = useState(currentUser?.phone || '+91 9876543210');
  const [vehicleType, setVehicleType] = useState('Electric Scooter (EV)');
  const [vehicleNumber, setVehicleNumber] = useState('KA-03-EV-4421');
  const [licenseNumber, setLicenseNumber] = useState('DL-04202100892');
  const [aadhaarNumber, setAadhaarNumber] = useState('XXXX-XXXX-4819');
  const [emergencyContact, setEmergencyContact] = useState('+91 80 4912 8820');
  const [agreed, setAgreed] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!agreed) return;
    playTrialSound();

    registerCustomerAsRider({
      name,
      phone,
      vehicle_type: vehicleType,
      vehicle_number: vehicleNumber,
      license_number: licenseNumber,
      aadhaar_number: aadhaarNumber,
      emergency_contact: emergencyContact
    });

    onClose();
  };

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(32, 37, 31, 0.75)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        animation: 'fadeIn 0.2s ease'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '440px',
          maxHeight: '92vh',
          backgroundColor: '#FFFFFF',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '24px 20px',
          overflowY: 'auto',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <div style={{
                backgroundColor: '#24452D',
                color: '#B7F34A',
                padding: '6px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Bike size={20} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#20251F', margin: 0 }}>
                Become a Nivvo Rider
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#73796F', margin: 0 }}>
              Deliver hyperlocal fashion & essentials in Bengaluru. Earn daily.
            </p>
          </div>

          <button 
            onClick={onClose}
            style={{
              background: '#F1F3EE',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#20251F'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Benefits Grid */}
        <div style={{
          backgroundColor: '#24452D',
          borderRadius: '16px',
          padding: '14px 16px',
          color: '#FFFFFF',
          marginBottom: '20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px'
        }}>
          <div>
            <div style={{ fontSize: '10px', color: '#B7F34A', fontWeight: 700, textTransform: 'uppercase' }}>
              Daily Earnings
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, marginTop: '2px' }}>
              ₹800–1,500/day
            </div>
            <div style={{ fontSize: '10px', color: '#C5D7C0' }}>Instant UPI payout</div>
          </div>
          <div>
            <div style={{ fontSize: '10px', color: '#B7F34A', fontWeight: 700, textTransform: 'uppercase' }}>
              10-Min Radius
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, marginTop: '2px' }}>
              ~1.5 km Trips
            </div>
            <div style={{ fontSize: '10px', color: '#C5D7C0' }}>Neighbourhood dark stores</div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
              Full Name
            </label>
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full legal name"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #D4DEC8',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
              Mobile Number (linked to UPI)
            </label>
            <input 
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #D4DEC8',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
                Vehicle Type
              </label>
              <select
                value={vehicleType}
                onChange={(e) => setVehicleType(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: '1px solid #D4DEC8',
                  fontSize: '12px',
                  backgroundColor: '#FFFFFF',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                <option value="Electric Scooter (EV)">Electric Scooter (EV)</option>
                <option value="Bicycle (Green Fleet)">Bicycle (Eco Fleet)</option>
                <option value="Motorcycle / Scooter">Motorcycle / Scooter</option>
              </select>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
                Vehicle Number
              </label>
              <input 
                type="text"
                required
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="KA-03-EV-4421"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #D4DEC8',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
                Driving License No.
              </label>
              <input 
                type="text"
                required
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                placeholder="DL-04202100892"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #D4DEC8',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
                Aadhaar Number
              </label>
              <input 
                type="text"
                required
                value={aadhaarNumber}
                onChange={(e) => setAadhaarNumber(e.target.value)}
                placeholder="XXXX-XXXX-4819"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #D4DEC8',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 700, color: '#20251F', display: 'block', marginBottom: '6px' }}>
              Emergency Contact
            </label>
            <input 
              type="tel"
              value={emergencyContact}
              onChange={(e) => setEmergencyContact(e.target.value)}
              placeholder="+91 80 4912 8820"
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #D4DEC8',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '4px' }}>
            <input 
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#24452D' }}
            />
            <span style={{ fontSize: '11px', color: '#73796F' }}>
              I agree to the Nivvo Fleet Partner Terms & Safe Riding Code of Conduct.
            </span>
          </label>

          <button
            type="submit"
            disabled={!agreed}
            style={{
              backgroundColor: '#B7F34A',
              color: '#20251F',
              border: 'none',
              borderRadius: '12px',
              padding: '14px',
              fontWeight: 800,
              fontSize: '14px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: '8px',
              boxShadow: '0 4px 14px rgba(183, 243, 74, 0.4)'
            }}
          >
            <Zap size={18} />
            <span>Join Fleet & Switch to Delivery Mode</span>
            <ArrowRight size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
