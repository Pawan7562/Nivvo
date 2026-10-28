import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Plus, 
  Check, 
  Home, 
  Briefcase, 
  Building, 
  Trash2, 
  Navigation,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { fetchAddressesApi, saveAddressApi, deleteAddressApi } from '../services/api';
import { playClickSound, playAddSound } from '../utils/audioEffects';

export default function SavedAddressesModal({ 
  isOpen, 
  onClose, 
  selectedLocation, 
  onSelectLocation,
  user
}) {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Home',
      receiver_name: 'Aditya Verma',
      flat_no: 'Flat 402, Tower B',
      street_address: 'Prestige Ozone, 100ft Road, Indiranagar',
      landmark: 'Near Indiranagar Metro Station',
      pincode: '560038',
      instructions: 'Leave with security guard if not answering bell',
      dark_store: 'Indiranagar Hub #14 (0.6 km • 8-10 mins)'
    },
    {
      id: 2,
      label: 'Work',
      receiver_name: 'Aditya Verma (Office)',
      flat_no: '6th Floor, Wing A',
      street_address: 'Bagmane Tech Park, CV Raman Nagar',
      landmark: 'Near Lake View Gate',
      pincode: '560093',
      instructions: 'Call on arrival, leave at reception desk',
      dark_store: 'CV Raman Nagar Dark Store #7 (1.2 km • 9-11 mins)'
    }
  ]);

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [label, setLabel] = useState('Home');
  const [receiverName, setReceiverName] = useState(user?.name || 'Aditya Verma');
  const [flatNo, setFlatNo] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('560038');
  const [instructions, setInstructions] = useState('Ring bell twice');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadAddresses();
    }
  }, [isOpen]);

  const loadAddresses = async () => {
    const data = await fetchAddressesApi(user?.phone || '+91 9876543210');
    if (data && data.addresses && data.addresses.length > 0) {
      setAddresses(data.addresses);
    }
  };

  if (!isOpen) return null;

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    if (!flatNo || !streetAddress) {
      alert('Please fill in your flat number and street address.');
      return;
    }

    setIsSaving(true);
    playAddSound();

    const newAddr = {
      user_phone: user?.phone || '+91 9876543210',
      label,
      receiver_name: receiverName,
      flat_no: flatNo,
      street_address: streetAddress,
      landmark,
      pincode,
      instructions
    };

    const res = await saveAddressApi(newAddr);
    setIsSaving(false);

    if (res && res.address) {
      setAddresses([res.address, ...addresses]);
      onSelectLocation({
        name: `${res.address.label} - ${res.address.flat_no}`,
        address: `${res.address.street_address}, ${res.address.pincode}`,
        eta: '8-10 mins',
        hub: 'Indiranagar Hub #14'
      });
      setIsAddingNew(false);
      onClose();
    } else {
      // Local fallback
      const localItem = { id: Date.now(), ...newAddr, dark_store: 'Indiranagar Hub #14 (0.6 km • 8-10 mins)' };
      setAddresses([localItem, ...addresses]);
      onSelectLocation({
        name: `${label} - ${flatNo}`,
        address: `${streetAddress}, ${pincode}`,
        eta: '8-10 mins',
        hub: 'Indiranagar Hub #14'
      });
      setIsAddingNew(false);
      onClose();
    }
  };

  const handleDeleteAddress = async (id, e) => {
    e.stopPropagation();
    playClickSound();
    await deleteAddressApi(id);
    setAddresses(addresses.filter(a => a.id !== id));
  };

  const handleSelect = (addr) => {
    playClickSound();
    onSelectLocation({
      name: `${addr.label} - ${addr.flat_no || ''}`,
      address: `${addr.street_address || addr.address}, ${addr.pincode || ''}`,
      eta: '8-10 mins',
      hub: addr.dark_store || 'Indiranagar Hub #14'
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card address-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="#0C831F" />
            <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0F172A' }}>
              Select Delivery Address
            </h3>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body-scroll" style={{ padding: '16px' }}>
          {/* Current GPS Location Quick Action */}
          <div 
            className="current-gps-strip"
            onClick={() => {
              playClickSound();
              onSelectLocation({
                name: 'Current Location (GPS)',
                address: '100ft Road, Indiranagar, Bengaluru - 560038',
                eta: '8-10 mins',
                hub: 'Indiranagar Hub #14'
              });
              onClose();
            }}
          >
            <div className="gps-icon-circle">
              <Navigation size={16} color="#0C831F" />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0C831F' }}>
                Use Current GPS Location
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Indiranagar 100ft Road, Bengaluru • Dark store 0.6 km away
              </div>
            </div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: '#0C831F' }}>8 MINS →</span>
          </div>

          {/* Toggle Add New Address */}
          {!isAddingNew ? (
            <button 
              className="add-address-trigger-btn"
              onClick={() => { playClickSound(); setIsAddingNew(true); }}
            >
              <Plus size={16} />
              <span>Add New Delivery Address</span>
            </button>
          ) : (
            <form onSubmit={handleSaveAddress} className="new-address-form">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                  Save New Address
                </span>
                <button 
                  type="button" 
                  onClick={() => setIsAddingNew(false)}
                  style={{ fontSize: '11.5px', color: '#64748B', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>

              {/* Label Selector */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                {['Home', 'Work', 'Hotel', 'Other'].map(lbl => (
                  <button
                    type="button"
                    key={lbl}
                    className={`address-label-chip ${label === lbl ? 'active' : ''}`}
                    onClick={() => setLabel(lbl)}
                  >
                    {lbl}
                  </button>
                ))}
              </div>

              <div className="form-group-compact">
                <label>Receiver Name</label>
                <input 
                  type="text"
                  value={receiverName}
                  onChange={(e) => setReceiverName(e.target.value)}
                  className="address-input"
                  required
                />
              </div>

              <div className="form-group-compact">
                <label>Flat / House / Floor No.</label>
                <input 
                  type="text"
                  placeholder="e.g. Flat 304, Block B"
                  value={flatNo}
                  onChange={(e) => setFlatNo(e.target.value)}
                  className="address-input"
                  required
                />
              </div>

              <div className="form-group-compact">
                <label>Street / Society / Area</label>
                <input 
                  type="text"
                  placeholder="e.g. 100ft Road, Indiranagar"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  className="address-input"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div className="form-group-compact">
                  <label>Landmark</label>
                  <input 
                    type="text"
                    placeholder="e.g. Near Metro"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    className="address-input"
                  />
                </div>
                <div className="form-group-compact">
                  <label>Pincode</label>
                  <input 
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="address-input"
                    maxLength={6}
                    required
                  />
                </div>
              </div>

              <div className="form-group-compact">
                <label>Delivery Instructions for Rider</label>
                <input 
                  type="text"
                  placeholder="e.g. Ring bell twice, leave with guard"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="address-input"
                />
              </div>

              <button 
                type="submit" 
                className="save-address-btn"
                disabled={isSaving}
              >
                {isSaving ? 'Saving to Neon DB...' : 'Save & Deliver Here'}
              </button>
            </form>
          )}

          {/* List of Saved Addresses */}
          <div style={{ marginTop: '16px' }}>
            <div style={{ fontSize: '11px', fontWeight: 800, color: '#64748B', textTransform: 'uppercase', marginBottom: '8px' }}>
              SAVED ADDRESSES ({addresses.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {addresses.map((addr) => {
                const isSelected = selectedLocation?.name?.includes(addr.label) || selectedLocation?.address?.includes(addr.street_address);

                return (
                  <div 
                    key={addr.id}
                    className={`saved-address-card ${isSelected ? 'active' : ''}`}
                    onClick={() => handleSelect(addr)}
                  >
                    <div style={{ display: 'flex', gap: '12px' }}>
                      <div className="addr-type-icon">
                        {addr.label === 'Home' ? <Home size={18} /> : (addr.label === 'Work' ? <Briefcase size={18} /> : <Building size={18} />)}
                      </div>

                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <span className="addr-label">{addr.label}</span>
                          {isSelected && (
                            <span className="current-active-tag">
                              <Check size={11} strokeWidth={3} /> DELIVERING HERE
                            </span>
                          )}
                        </div>

                        <div className="addr-receiver">{addr.receiver_name}</div>
                        <div className="addr-full">
                          {addr.flat_no ? `${addr.flat_no}, ` : ''}{addr.street_address}
                          {addr.landmark ? ` • Landmark: ${addr.landmark}` : ''}
                          {addr.pincode ? ` (${addr.pincode})` : ''}
                        </div>

                        {addr.instructions && (
                          <div className="addr-instruction-pill">
                            📝 {addr.instructions}
                          </div>
                        )}

                        <div className="addr-hub-info">
                          ⚡ Dark Store: Indiranagar Hub #14 (8-10 Mins)
                        </div>
                      </div>
                    </div>

                    <button 
                      className="addr-delete-btn"
                      onClick={(e) => handleDeleteAddress(addr.id, e)}
                      title="Delete Address"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
