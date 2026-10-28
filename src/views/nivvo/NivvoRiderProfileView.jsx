import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowLeft, ShieldCheck, CheckCircle2, ChevronRight, 
  BatteryCharging, CreditCard, ShoppingBag, LogOut, 
  Star, Headphones, Edit3, X, User, Check
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';

export default function NivvoRiderProfileView({ onBack }) {
  const { 
    riderProfile, 
    updateRiderProfileData,
    switchToCustomerMode, 
    logoutUser, 
    currentUser,
    setCurrentUser,
    showToast,
    setAuthModalOpen,
    setAuthModalRole,
    navigateTo
  } = useNivvo();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    email: '',
    emergency_contact: '',
    vehicle_type: '',
    vehicle_number: '',
    hub_id: '',
    bank_name: '',
    bank_account: '',
    upi_id: ''
  });

  const openEditModal = () => {
    playClickSound();
    setEditFormData({
      name: (currentUser?.role === 'rider' && currentUser.name) || riderProfile.name || 'Ravi Kumar',
      phone: (currentUser?.role === 'rider' && currentUser.phone) || riderProfile.phone || '+91 98450 12345',
      email: riderProfile.email || 'ravi.fleet@nivvo.in',
      emergency_contact: riderProfile.emergency_contact || '+91 80 4912 8820',
      vehicle_type: riderProfile.vehicle_type || 'Ather 450X EV Scooter',
      vehicle_number: riderProfile.vehicle_number || 'KA-03-EV-4421',
      hub_id: riderProfile.hub_id || 'Indiranagar Dark Store Hub #14',
      bank_name: riderProfile.bank_name || 'HDFC Bank',
      bank_account: riderProfile.bank_account || '889129031',
      upi_id: riderProfile.upi_id || 'ravi.ev@okhdfc'
    });
    setIsEditingProfile(true);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    if (!editFormData.name.trim()) {
      showToast('Please enter your full name.');
      return;
    }
    if (!editFormData.phone.trim()) {
      showToast('Please enter your phone number.');
      return;
    }

    playTrialSound();

    const updatedFields = {
      name: editFormData.name.trim(),
      phone: editFormData.phone.trim(),
      email: editFormData.email.trim(),
      emergency_contact: editFormData.emergency_contact.trim(),
      vehicle_type: editFormData.vehicle_type,
      vehicle_number: editFormData.vehicle_number.trim().toUpperCase(),
      hub_id: editFormData.hub_id,
      bank_name: editFormData.bank_name.trim(),
      bank_account: editFormData.bank_account.trim(),
      upi_id: editFormData.upi_id.trim()
    };

    updateRiderProfileData(updatedFields);

    if (currentUser) {
      setCurrentUser(prev => prev ? ({
        ...prev,
        name: updatedFields.name,
        phone: updatedFields.phone,
        email: updatedFields.email
      }) : null);
    }

    showToast('Profile updated successfully.');
    setIsEditingProfile(false);
  };

  const documents = [
    { name: 'Driving License', id: riderProfile.license_number || 'DL-04202100892' },
    { name: 'Aadhaar Card', id: riderProfile.aadhaar_number || 'XXXX-XXXX-4819' },
    { name: 'EV Commercial Insurance', id: 'POL-AET-9921' },
    { name: 'Police Background Verification', id: 'BGC-NIVVO-881' }
  ];

  const currentDisplayName = (currentUser?.role === 'rider' && currentUser.name) || riderProfile.name || 'Ravi Kumar';
  const currentDisplayPhone = (currentUser?.role === 'rider' && currentUser.phone) || riderProfile.phone || '+91 98450 12345';
  const currentVehicleType = riderProfile.vehicle_type || 'Ather 450X EV Scooter';
  const currentVehicleNumber = riderProfile.vehicle_number || 'KA-03-EV-4421';
  const currentHub = riderProfile.hub_id || 'Indiranagar Hub #14';

  return (
    <div style={{ backgroundColor: '#F4F5EE', minHeight: '100%', paddingBottom: '96px', position: 'relative' }}>
      
      {/* ─── Top Header Bar ─── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '12px 16px',
        borderBottom: '1px solid #E5E7DE',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={onBack} 
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#14281C',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>
              Profile
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={openEditModal}
              style={{
                backgroundColor: '#F4F5EE',
                border: '1px solid #E5E7DE',
                borderRadius: '8px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#14281C',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
              aria-label="Edit Profile"
            >
              <Edit3 size={12} />
              <span>Edit</span>
            </button>

            <span style={{
              backgroundColor: '#E8F5E9',
              color: '#15803D',
              padding: '4px 8px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <ShieldCheck size={12} />
              <span>Verified Partner</span>
            </span>
          </div>
        </div>
      </div>

      <div style={{ padding: '14px 16px', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* Sign In Banner (If not signed in as rider) */}
        {(!currentUser || currentUser.role !== 'rider') && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7DE',
            borderRadius: '14px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>
                Delivery Partner Sign In
              </div>
              <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '1px' }}>
                Sign in to sync your active shifts and payouts
              </div>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setAuthModalRole('rider');
                setAuthModalOpen(true);
              }}
              style={{
                backgroundColor: '#1F4230',
                color: '#C6F432',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              Sign In
            </button>
          </div>
        )}

        {/* ─── 1. Partner Identity Card ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: '#1F4230',
                color: '#C6F432',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '17px',
                fontWeight: 800,
                flexShrink: 0
              }}>
                {currentDisplayName.charAt(0)}
              </div>

              <div style={{ minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                    {currentDisplayName}
                  </span>
                  <span style={{ backgroundColor: '#E8F5E9', color: '#15803D', fontSize: '9px', fontWeight: 800, padding: '2px 5px', borderRadius: '4px' }}>
                    ACTIVE
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '2px' }}>
                  ID: {riderProfile.partner_id || 'RDR-1082'} · {currentDisplayPhone}
                </div>
              </div>
            </div>

            <button
              onClick={openEditModal}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px',
                color: '#6B7265',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '6px'
              }}
              title="Edit Profile"
              aria-label="Edit Profile"
            >
              <Edit3 size={15} />
            </button>
          </div>

          {/* Performance Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px',
            backgroundColor: '#F9FAF7',
            padding: '10px',
            borderRadius: '12px',
            textAlign: 'center',
            border: '1px solid #EAECE5'
          }}>
            <div>
              <div style={{ fontSize: '10px', color: '#6B7265', fontWeight: 700, textTransform: 'uppercase' }}>Rating</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C', marginTop: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                <Star size={12} fill="#14281C" color="#14281C" />
                <span>{riderProfile.rating || '4.96'}</span>
              </div>
            </div>
            <div style={{ borderLeft: '1px solid #E5E7DE' }}>
              <div style={{ fontSize: '10px', color: '#6B7265', fontWeight: 700, textTransform: 'uppercase' }}>Deliveries</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C', marginTop: '2px' }}>
                {riderProfile.total_deliveries || 342}
              </div>
            </div>
            <div style={{ borderLeft: '1px solid #E5E7DE' }}>
              <div style={{ fontSize: '10px', color: '#6B7265', fontWeight: 700, textTransform: 'uppercase' }}>On-Time</div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#15803D', marginTop: '2px' }}>
                98.8%
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. Assigned Vehicle ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '14px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: '#E8F5E9',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <BatteryCharging size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                {currentVehicleType}
              </div>
              <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '1px' }}>
                {currentVehicleNumber} · {currentHub}
              </div>
            </div>
          </div>

          <span style={{
            backgroundColor: '#E8F5E9',
            color: '#15803D',
            padding: '4px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 800
          }}>
            {riderProfile.battery_level || 88}% Charge
          </span>
        </div>

        {/* ─── 3. Verified KYC Documents ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '14px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#6B7265',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '8px'
          }}>
            Verified Documents
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {documents.map((doc, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '9px 0',
                  borderBottom: idx !== documents.length - 1 ? '1px solid #F4F5EE' : 'none'
                }}
              >
                <div>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#14281C' }}>
                    {doc.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#8A9285', marginTop: '1px' }}>
                    {doc.id}
                  </div>
                </div>

                <CheckCircle2 size={16} color="#15803D" />
              </div>
            ))}
          </div>
        </div>

        {/* ─── 4. Quick Navigation Hub ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '4px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          {/* Edit Profile Shortcut */}
          <div 
            onClick={openEditModal}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #F4F5EE',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <User size={16} color="#1F4230" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                Edit Profile Information
              </span>
            </div>
            <ChevronRight size={15} color="#9CA3AF" />
          </div>

          {/* Earnings & Bank Payouts */}
          <div 
            onClick={() => { playClickSound(); navigateTo('rider-earnings'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #F4F5EE',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CreditCard size={16} color="#1F4230" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                Earnings & Bank Payouts
              </span>
            </div>
            <ChevronRight size={15} color="#9CA3AF" />
          </div>

          {/* Delivery Support Desk */}
          <div 
            onClick={() => { playClickSound(); navigateTo('rider-support'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              borderBottom: '1px solid #F4F5EE',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Headphones size={16} color="#1F4230" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                Delivery Support Desk
              </span>
            </div>
            <ChevronRight size={15} color="#9CA3AF" />
          </div>

          {/* Switch to Customer Shopping Mode */}
          <div 
            onClick={() => { playClickSound(); switchToCustomerMode(); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 0',
              cursor: 'pointer'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <ShoppingBag size={16} color="#1F4230" />
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                Switch to Shopping Mode
              </span>
            </div>
            <ChevronRight size={15} color="#9CA3AF" />
          </div>
        </div>

        {/* ─── 5. Sign Out Button ─── */}
        <button
          onClick={() => { playClickSound(); logoutUser(); }}
          style={{
            width: '100%',
            backgroundColor: '#FFFFFF',
            color: '#DC2626',
            border: '1px solid #FEE2E2',
            borderRadius: '12px',
            padding: '12px',
            fontWeight: 700,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            minHeight: '44px'
          }}
        >
          <LogOut size={15} />
          <span>Sign Out</span>
        </button>

      </div>

      {/* ─── 6. Edit Profile Modal ─── */}
      {isEditingProfile && (
        <div className="nivvo-modal-overlay" onClick={() => setIsEditingProfile(false)}>
          <div 
            className="nivvo-modal-sheet" 
            onClick={(e) => e.stopPropagation()} 
            style={{ 
              maxWidth: '480px', 
              maxHeight: '90vh', 
              display: 'flex', 
              flexDirection: 'column',
              padding: 0,
              overflow: 'hidden'
            }}
          >
            {/* Modal Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px 20px',
              borderBottom: '1px solid #E5E7DE'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                  Edit Partner Profile
                </h3>
                <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '2px' }}>
                  Update your contact, vehicle, and payout preferences
                </div>
              </div>
              <button 
                onClick={() => setIsEditingProfile(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '6px',
                  color: '#6B7265',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '6px'
                }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{ padding: '16px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', flex: 1 }}>
                
                {/* Section A: Personal Information */}
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#1F4230', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '8px' }}>
                    Personal Details
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                        Full Name *
                      </label>
                      <input 
                        type="text"
                        required
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        placeholder="e.g. Ravi Kumar"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7DE',
                          backgroundColor: '#F9FAF7',
                          color: '#14281C',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                          Phone Number *
                        </label>
                        <input 
                          type="tel"
                          required
                          value={editFormData.phone}
                          onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                          placeholder="+91 98450 12345"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '13px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7DE',
                            backgroundColor: '#F9FAF7',
                            color: '#14281C',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                          Emergency Contact
                        </label>
                        <input 
                          type="tel"
                          value={editFormData.emergency_contact}
                          onChange={(e) => setEditFormData({ ...editFormData, emergency_contact: e.target.value })}
                          placeholder="+91 80 4912 8820"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '13px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7DE',
                            backgroundColor: '#F9FAF7',
                            color: '#14281C',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                        Email Address
                      </label>
                      <input 
                        type="email"
                        value={editFormData.email}
                        onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                        placeholder="ravi.fleet@nivvo.in"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7DE',
                          backgroundColor: '#F9FAF7',
                          color: '#14281C',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Vehicle & Fleet Hub */}
                <div style={{ borderTop: '1px solid #F4F5EE', paddingTop: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#1F4230', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '8px' }}>
                    Vehicle & Operating Hub
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                          EV Model
                        </label>
                        <select
                          value={editFormData.vehicle_type}
                          onChange={(e) => setEditFormData({ ...editFormData, vehicle_type: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '13px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7DE',
                            backgroundColor: '#F9FAF7',
                            color: '#14281C',
                            outline: 'none',
                            boxSizing: 'border-box',
                            cursor: 'pointer'
                          }}
                        >
                          <option value="Ather 450X EV Scooter">Ather 450X EV Scooter</option>
                          <option value="Ola S1 Pro EV">Ola S1 Pro EV</option>
                          <option value="TVS iQube Electric">TVS iQube Electric</option>
                          <option value="Hero Vida V1 Pro">Hero Vida V1 Pro</option>
                          <option value="Commercial E-Cargo Bike">Commercial E-Cargo Bike</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                          Registration No.
                        </label>
                        <input 
                          type="text"
                          value={editFormData.vehicle_number}
                          onChange={(e) => setEditFormData({ ...editFormData, vehicle_number: e.target.value })}
                          placeholder="KA-03-EV-4421"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '13px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7DE',
                            backgroundColor: '#F9FAF7',
                            color: '#14281C',
                            outline: 'none',
                            boxSizing: 'border-box',
                            textTransform: 'uppercase'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                        Base Hub / Dark Store
                      </label>
                      <select
                        value={editFormData.hub_id}
                        onChange={(e) => setEditFormData({ ...editFormData, hub_id: e.target.value })}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7DE',
                          backgroundColor: '#F9FAF7',
                          color: '#14281C',
                          outline: 'none',
                          boxSizing: 'border-box',
                          cursor: 'pointer'
                        }}
                      >
                        <option value="Indiranagar Dark Store Hub #14">Indiranagar Dark Store Hub #14</option>
                        <option value="Koramangala Dark Store Hub #08">Koramangala Dark Store Hub #08</option>
                        <option value="HSR Layout Hub #03">HSR Layout Hub #03</option>
                        <option value="Whitefield Dark Store Hub #19">Whitefield Dark Store Hub #19</option>
                        <option value="Jayanagar Hub #05">Jayanagar Hub #05</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section C: Payout & Bank Account */}
                <div style={{ borderTop: '1px solid #F4F5EE', paddingTop: '12px' }}>
                  <div style={{ fontSize: '11px', fontWeight: 800, color: '#1F4230', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '8px' }}>
                    Payout & Settlement Account
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                          Bank Name
                        </label>
                        <input 
                          type="text"
                          value={editFormData.bank_name}
                          onChange={(e) => setEditFormData({ ...editFormData, bank_name: e.target.value })}
                          placeholder="e.g. HDFC Bank"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '13px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7DE',
                            backgroundColor: '#F9FAF7',
                            color: '#14281C',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                          Account Number
                        </label>
                        <input 
                          type="text"
                          value={editFormData.bank_account}
                          onChange={(e) => setEditFormData({ ...editFormData, bank_account: e.target.value })}
                          placeholder="A/C Number"
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            fontSize: '13px',
                            borderRadius: '8px',
                            border: '1px solid #E5E7DE',
                            backgroundColor: '#F9FAF7',
                            color: '#14281C',
                            outline: 'none',
                            boxSizing: 'border-box'
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#6B7265', marginBottom: '4px' }}>
                        UPI ID (Instant Transfer)
                      </label>
                      <input 
                        type="text"
                        value={editFormData.upi_id}
                        onChange={(e) => setEditFormData({ ...editFormData, upi_id: e.target.value })}
                        placeholder="ravi.ev@okhdfc"
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          fontSize: '13px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7DE',
                          backgroundColor: '#F9FAF7',
                          color: '#14281C',
                          outline: 'none',
                          boxSizing: 'border-box'
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '12px 20px',
                borderTop: '1px solid #E5E7DE',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                gap: '10px',
                justifyContent: 'flex-end'
              }}>
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7DE',
                    backgroundColor: '#FFFFFF',
                    color: '#6B7265',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#B7F34A',
                    color: '#14281C',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Check size={15} />
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
