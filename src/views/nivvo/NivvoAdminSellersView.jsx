import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowUpRight, Search, AlertTriangle, Check, ChevronDown, 
  Store, Power, X, FileText, CheckCircle2, AlertCircle, Clock, ShieldCheck, 
  Bike, UserCheck, RefreshCw, Eye, MessageSquare, ChevronLeft, ChevronRight, Shield
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';
import AdminLayout from '../../components/nivvo/AdminLayout';

export default function NivvoAdminSellersView({ onBack }) {
  const { 
    showToast, 
    authToken, 
    navigateTo,
    pendingSellerApplications,
    pendingRiderApplications,
    approveSellerApplication,
    rejectSellerApplication,
    approveRiderApplication,
    rejectRiderApplication
  } = useNivvo();
  const [activeTab, setActiveTab] = useState('directory'); // 'directory' | 'pending' | 'alerts' | 'riders'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSellerId, setSelectedSellerId] = useState('SS-018');
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('All zones');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All status');
  
  // Real Verification Queues backed by context & backend
  const [pendingShops, setPendingShops] = useState(pendingSellerApplications || []);
  const [pendingRiders, setPendingRiders] = useState(pendingRiderApplications || []);
  const [isLoadingQueues, setIsLoadingQueues] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null); // for inspection drawer/modal
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');

  // Default directory sellers matching figma frame admin_2_sellers
  const [sellers, setSellers] = useState([
    { 
      id: 'SS-018', 
      name: 'Sole Street', 
      cat: 'Footwear', 
      zone: 'Indiranagar', 
      rating: '★ 4.8', 
      sync: '2 min ago', 
      status: 'Live ✓', 
      isLive: true, 
      color: '#1C7532', 
      address: 'Indiranagar, Bengaluru',
      owner: 'Rohan Sethi',
      prepTime: '4–6 min',
      stockAccuracy: '99.2%',
      acceptanceRate: '98.4%',
      verifications: [
        'GSTIN verified · GST invoice enabled',
        'Owner KYC approved',
        'Settlement account verified'
      ],
      activities: [
        '2:39 pm · Order NV-1048 picked up by Ravi Kumar (DP-042).',
        '2:45 pm · New order NV-1052 received. Awaiting shop acceptance.'
      ]
    },
    { 
      id: 'CH-024', 
      name: 'Circuit House', 
      cat: 'Electronics', 
      zone: 'Indiranagar', 
      rating: '★ 4.7', 
      sync: '1 min ago', 
      status: 'Live ✓', 
      isLive: true, 
      color: '#1C7532', 
      address: '100ft Road, Indiranagar',
      owner: 'Kavita Nair',
      prepTime: '3–5 min',
      stockAccuracy: '98.8%',
      acceptanceRate: '99.1%',
      verifications: [
        'GSTIN verified · GST invoice enabled',
        'Owner KYC approved',
        'Settlement account verified'
      ],
      activities: [
        '2:31 pm · Fast cable dispatched on bike DP-012.',
        '2:41 pm · Restocked Anker GaN charger 65W.'
      ]
    },
    { 
      id: 'TF-032', 
      name: 'Thread & Form', 
      cat: 'Fashion', 
      zone: 'Indiranagar', 
      rating: '★ 4.6', 
      sync: '3 min ago', 
      status: 'Live ✓', 
      isLive: true, 
      color: '#1C7532', 
      address: 'CMH Road, Indiranagar',
      owner: 'Ananya Roy',
      prepTime: '5–7 min',
      stockAccuracy: '97.5%',
      acceptanceRate: '97.9%',
      verifications: [
        'GSTIN verified · GST invoice enabled',
        'Owner KYC approved',
        'Settlement account verified'
      ],
      activities: [
        '2:20 pm · Linen overshirt packaged and handed to rider.'
      ]
    },
    { 
      id: 'PS-061', 
      name: 'Pocket Studio', 
      cat: 'Mobile accessories', 
      zone: 'Koramangala', 
      rating: '★ 4.5', 
      sync: '24 min ago', 
      status: 'Review sync', 
      isLive: true, 
      color: '#855700', 
      address: '80ft Road, Koramangala',
      owner: 'Devendra Patil',
      prepTime: '6–8 min',
      stockAccuracy: '94.2%',
      acceptanceRate: '96.0%',
      verifications: [
        'GSTIN verified · GST invoice enabled',
        'Owner KYC approved'
      ],
      activities: [
        '2:15 pm · Automated stock sync delayed by 24 min.'
      ]
    },
    { 
      id: 'WL-048', 
      name: 'Walk Local', 
      cat: 'Footwear', 
      zone: 'HSR Layout', 
      rating: '★ 4.6', 
      sync: '1 min ago', 
      status: 'Live ✓', 
      isLive: true, 
      color: '#1C7532', 
      address: '27th Main, HSR Layout',
      owner: 'Vikram Joshi',
      prepTime: '4–5 min',
      stockAccuracy: '99.0%',
      acceptanceRate: '98.7%',
      verifications: [
        'GSTIN verified · GST invoice enabled',
        'Owner KYC approved',
        'Settlement account verified'
      ],
      activities: [
        '2:40 pm · Slide sandals prepared for DP-099.'
      ]
    },
    { 
      id: 'DE-078', 
      name: 'Daily Edit', 
      cat: 'Lifestyle', 
      zone: 'Jayanagar', 
      rating: '—', 
      sync: 'Not synced', 
      status: 'KYC review', 
      isLive: false, 
      color: '#6B7265', 
      address: '4th Block, Jayanagar',
      owner: 'Megha Sharma',
      prepTime: '—',
      stockAccuracy: '—',
      acceptanceRate: '—',
      verifications: [
        'Awaiting GST certificate review',
        'Bank mandate under test deposit'
      ],
      activities: [
        'Yesterday · Merchant uploaded trade license and bank mandate.'
      ]
    },
    { 
      id: 'BC-027', 
      name: 'Byte Corner', 
      cat: 'Computing', 
      zone: 'Koramangala', 
      rating: '★ 4.3', 
      sync: '48 min ago', 
      status: 'Paused', 
      isLive: false, 
      color: '#14281C', 
      address: '5th Block, Koramangala',
      owner: 'Siddharth Sen',
      prepTime: '8–12 min',
      stockAccuracy: '91.0%',
      acceptanceRate: '92.4%',
      verifications: [
        'GSTIN verified',
        'Temporary pause due to local renovation'
      ],
      activities: [
        '1:50 pm · Store paused by merchant until tomorrow.'
      ]
    }
  ]);

  // Fetch Verification Queues from Backend
  const fetchQueues = async () => {
    setIsLoadingQueues(true);
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      
      const [shopsRes, ridersRes] = await Promise.all([
        fetch('/api/admin/verifications/shops', { headers }).then(r => r.json()).catch(() => ({ shops: [] })),
        fetch('/api/admin/verifications/riders', { headers }).then(r => r.json()).catch(() => ({ riders: [] }))
      ]);

      if (shopsRes?.shops) setPendingShops(shopsRes.shops);
      if (ridersRes?.riders) setPendingRiders(ridersRes.riders);
    } catch {
      // Graceful fallback
    } finally {
      setIsLoadingQueues(false);
    }
  };

  useEffect(() => {
    fetchQueues();
  }, [authToken]);

  // Admin Verification Decision Handler
  const handleDecision = async (appType, id, decisionStatus) => {
    setIsSubmittingDecision(true);
    playTrialSound();
    try {
      if (appType === 'shop') {
        if (decisionStatus === 'approved') {
          approveSellerApplication(id, decisionNotes);
          const approved = pendingShops.find(s => s.id === id);
          if (approved) {
            setSellers(prev => [
              {
                id: `SH-${Math.floor(100 + Math.random() * 900)}`,
                name: approved.shop_name,
                cat: approved.category || 'Apparel & Sarees',
                zone: 'Indiranagar',
                rating: '★ 5.0',
                sync: 'Just now',
                status: 'Live ✓',
                isLive: true,
                color: '#1C7532',
                address: approved.address || 'Indiranagar, Bengaluru',
                owner: approved.owner_name,
                prepTime: '4–6 min',
                stockAccuracy: '100%',
                acceptanceRate: '100%',
                verifications: [
                  'GSTIN verified · GST invoice enabled',
                  'Owner KYC approved',
                  'Settlement account verified'
                ],
                activities: [
                  'Just now · Store approved by Compliance Officer. Discoverable on consumer app.'
                ]
              },
              ...prev
            ]);
          }
        } else {
          rejectSellerApplication(id, decisionNotes || 'Incomplete business documents');
        }
        setPendingShops(prev => prev.filter(s => s.id !== id));
      } else if (appType === 'rider') {
        if (decisionStatus === 'approved') {
          approveRiderApplication(id, decisionNotes);
        } else {
          rejectRiderApplication(id, decisionNotes || 'Document verification pending');
        }
        setPendingRiders(prev => prev.filter(r => r.id !== id));
      }

      showToast(`Application marked as ${decisionStatus.toUpperCase()}! ✓`);
      setSelectedApplication(null);
      setDecisionNotes('');
    } catch (err) {
      showToast(`Error: ${err.message}`);
    } finally {
      setIsSubmittingDecision(false);
    }
  };

  const selectedSeller = sellers.find(s => s.id === selectedSellerId) || sellers[0];

  const toggleSellerStatus = (sellerId) => {
    playTrialSound();
    setSellers(prev => prev.map(s => {
      if (s.id === sellerId) {
        const nextLive = !s.isLive;
        return {
          ...s,
          isLive: nextLive,
          status: nextLive ? 'Live ✓' : 'Paused',
          color: nextLive ? '#1C7532' : '#C92A2A'
        };
      }
      return s;
    }));
    showToast(`Updated store status for ${selectedSeller.name}`);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteName.trim()) return;
    playTrialSound();
    setShowInviteModal(false);
    showToast(`Onboarding invite sent to ${inviteName} (${invitePhone || '+91 98XXX'})! 📩`);
    setInviteName('');
    setInvitePhone('');
  };

  const filteredSellers = sellers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZoneFilter === 'All zones' || s.zone === selectedZoneFilter;
    const matchesStatus = selectedStatusFilter === 'All status' || 
                          (selectedStatusFilter === 'Live' && s.isLive) ||
                          (selectedStatusFilter === 'Paused' && !s.isLive);
    return matchesSearch && matchesZone && matchesStatus;
  });

  return (
    <AdminLayout currentTab="sellers" breadcrumb="Sellers & operations" onBack={onBack}>
      {/* Title & Actions Row */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{
            fontSize: '30px',
            fontWeight: 700,
            color: '#14281C',
            letterSpacing: '-0.03em',
            margin: '0 0 4px 0'
          }}>
            Sellers & operations
          </h1>
          <p style={{ fontSize: '14px', color: '#6B7265', margin: 0 }}>
            Keep neighbourhood retail dependable, discoverable and ready to deliver.
          </p>
        </div>

        <button
          onClick={() => {
            playClickSound();
            setShowInviteModal(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7DE',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: 600,
            color: '#14281C',
            cursor: 'pointer',
            transition: 'background-color 0.15s ease'
          }}
        >
          <span>+ Invite seller</span>
          <ArrowUpRight size={14} />
        </button>
      </div>

      {/* Capacity Constraint Alert Banner */}
      <div style={{
        backgroundColor: '#EFF5EA',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <AlertTriangle size={18} color="#14281C" />
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
              Koramangala capacity is constrained
            </div>
            <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '2px' }}>
              Delivery windows extended to 25–40 min. ~10 min eligibility paused until capacity recovers.
            </div>
          </div>
        </div>

        <button
          onClick={() => showToast('Inspecting Koramangala active dispatch zone')}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '13px',
            fontWeight: 600,
            color: '#14281C',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer'
          }}
        >
          <span>Review zone</span>
          <ArrowUpRight size={13} />
        </button>
      </div>

      {/* Filter Tabs Row matching Figma */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px', overflowX: 'auto' }}>
        <button
          onClick={() => { playClickSound(); setActiveTab('directory'); }}
          style={{
            backgroundColor: activeTab === 'directory' ? '#1F3526' : '#FFFFFF',
            color: activeTab === 'directory' ? '#FFFFFF' : '#14281C',
            border: activeTab === 'directory' ? 'none' : '1px solid #E5E7DE',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: activeTab === 'directory' ? 600 : 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Seller directory 214
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('pending'); }}
          style={{
            backgroundColor: activeTab === 'pending' ? '#1F3526' : '#FFFFFF',
            color: activeTab === 'pending' ? '#FFFFFF' : '#14281C',
            border: activeTab === 'pending' ? 'none' : '1px solid #E5E7DE',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: activeTab === 'pending' ? 600 : 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Pending approval {pendingShops.length > 0 ? pendingShops.length : 8}
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('alerts'); }}
          style={{
            backgroundColor: activeTab === 'alerts' ? '#1F3526' : '#FFFFFF',
            color: activeTab === 'alerts' ? '#FFFFFF' : '#14281C',
            border: activeTab === 'alerts' ? 'none' : '1px solid #E5E7DE',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: activeTab === 'alerts' ? 600 : 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Operations alerts 6
        </button>

        <button
          onClick={() => { playClickSound(); setActiveTab('riders'); }}
          style={{
            backgroundColor: activeTab === 'riders' ? '#1F3526' : '#FFFFFF',
            color: activeTab === 'riders' ? '#FFFFFF' : '#14281C',
            border: activeTab === 'riders' ? 'none' : '1px solid #E5E7DE',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: '13px',
            fontWeight: activeTab === 'riders' ? 600 : 500,
            cursor: 'pointer',
            whiteSpace: 'nowrap'
          }}
        >
          Delivery partners 312
        </button>
      </div>

      {/* ==============================================================
          TAB 1: SELLER DIRECTORY (Matching figma admin_2_sellers 1:1)
          ============================================================== */}
      {activeTab === 'directory' && (
        <>
          {/* Search & Filter Controls */}
          <div style={{
            display: 'flex',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            <div style={{
              flex: 1,
              minWidth: '280px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              borderRadius: '10px',
              padding: '10px 16px'
            }}>
              <Search size={16} color="#6B7265" />
              <input
                type="text"
                placeholder="Search seller, ID or contact"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  width: '100%',
                  fontSize: '13px',
                  color: '#14281C',
                  backgroundColor: 'transparent'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#14281C',
              cursor: 'pointer'
            }}>
              <span>All zones</span>
              <span style={{ fontSize: '11px', color: '#6B7265' }}>⌄</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7DE',
              padding: '10px 20px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 500,
              color: '#14281C',
              cursor: 'pointer'
            }}>
              <span>Status</span>
              <span style={{ fontSize: '11px', color: '#6B7265' }}>⌄</span>
            </div>
          </div>

          {/* Split View: Table on Left + Inspector Card on Right */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.85fr) minmax(0, 1fr)',
            gap: '24px',
            alignItems: 'start',
            marginBottom: '24px'
          }}>
            {/* Left: Table */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #EAECE5',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #EAECE5', color: '#6B7265', fontWeight: 500, fontSize: '12px' }}>
                    <th style={{ padding: '14px 20px' }}>Seller / category</th>
                    <th style={{ padding: '14px 20px' }}>Zone</th>
                    <th style={{ padding: '14px 20px' }}>Rating</th>
                    <th style={{ padding: '14px 20px' }}>Stock sync</th>
                    <th style={{ padding: '14px 20px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSellers.map((s, idx) => {
                    const isSelected = selectedSellerId === s.id;
                    return (
                      <tr 
                        key={s.id}
                        onClick={() => {
                          playClickSound();
                          setSelectedSellerId(s.id);
                        }}
                        style={{
                          borderBottom: idx === filteredSellers.length - 1 ? 'none' : '1px solid #EAECE5',
                          backgroundColor: isSelected ? '#FAFBF8' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease'
                        }}
                      >
                        <td style={{ padding: '14px 20px' }}>
                          <div style={{ fontWeight: 600, color: '#14281C', fontSize: '13px' }}>
                            {s.name} · {s.id}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '2px' }}>
                            {s.cat}
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#14281C', fontSize: '13px' }}>
                          {s.zone}
                        </td>
                        <td style={{ padding: '14px 20px', color: '#14281C', fontSize: '13px' }}>
                          {s.rating}
                        </td>
                        <td style={{ padding: '14px 20px', color: '#6B7265', fontSize: '13px' }}>
                          {s.sync}
                        </td>
                        <td style={{ padding: '14px 20px' }}>
                          <span style={{
                            color: s.color,
                            fontWeight: 500,
                            fontSize: '13px'
                          }}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* Pagination Controls */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '14px 20px',
                borderTop: '1px solid #EAECE5',
                fontSize: '12px',
                color: '#6B7265'
              }}>
                <span>Showing 1–{filteredSellers.length} of 214 sellers</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ cursor: 'pointer', color: '#6B7265' }}>←</span>
                  <span style={{ fontWeight: 700, color: '#14281C' }}>1</span>
                  <span style={{ cursor: 'pointer', color: '#6B7265' }}>2</span>
                  <span style={{ cursor: 'pointer', color: '#6B7265' }}>3</span>
                  <span style={{ color: '#6B7265' }}>...</span>
                  <span style={{ cursor: 'pointer', color: '#6B7265' }}>31</span>
                  <span style={{ cursor: 'pointer', color: '#6B7265' }}>→</span>
                </div>
              </div>
            </div>

            {/* Right: Selected Seller Inspector Card */}
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #14281C',
              borderRadius: '14px',
              padding: '24px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 700, color: '#14281C', margin: 0 }}>
                  {selectedSeller.name}
                </h3>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 500,
                  padding: '3px 8px',
                  borderRadius: '999px',
                  backgroundColor: selectedSeller.isLive ? '#EFF7ED' : '#FDE8E8',
                  color: selectedSeller.isLive ? '#1C7532' : '#C92A2A'
                }}>
                  {selectedSeller.isLive ? 'Live' : 'Paused'}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: '#6B7265', marginBottom: '20px' }}>
                {selectedSeller.id} · {selectedSeller.address}
              </div>

              <div style={{ borderTop: '1px solid #F0F2ED', paddingTop: '18px', marginBottom: '18px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#14281C', marginBottom: '12px' }}>
                  Business verification
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#1C7532' }}>
                  {selectedSeller.verifications.map((v, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>✓</span>
                      <span>{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #F0F2ED', paddingTop: '18px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7265' }}>Owner</span>
                    <span style={{ fontWeight: 600, color: '#14281C' }}>{selectedSeller.owner}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7265' }}>Shop preparation</span>
                    <span style={{ fontWeight: 600, color: '#14281C' }}>{selectedSeller.prepTime}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7265' }}>Stock accuracy</span>
                    <span style={{ fontWeight: 600, color: '#14281C' }}>{selectedSeller.stockAccuracy}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#6B7265' }}>Acceptance rate</span>
                    <span style={{ fontWeight: 600, color: '#14281C' }}>{selectedSeller.acceptanceRate}</span>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #F0F2ED', paddingTop: '18px', marginBottom: '22px' }}>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#14281C', marginBottom: '12px' }}>
                  Latest activity
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: '#6B7265', lineHeight: '1.5' }}>
                  {selectedSeller.activities.map((a, i) => (
                    <div key={i}>
                      {a}
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  playClickSound();
                  navigateTo('seller-dash');
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7DE',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#14281C',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  marginBottom: '16px'
                }}
              >
                <span>View seller profile</span>
                <ArrowUpRight size={14} />
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  onClick={() => toggleSellerStatus(selectedSeller.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: selectedSeller.isLive ? '#C92A2A' : '#1C7532',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                >
                  {selectedSeller.isLive ? 'Pause seller availability' : 'Resume seller availability'}
                </button>
              </div>
            </div>
          </div>

          {/* Audit Disclaimer Note matching Figma */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#6B7265',
            marginTop: '8px',
            marginBottom: '28px'
          }}>
            <Shield size={14} color="#6B7265" />
            <span>All operational changes are recorded in the audit log. Pausing a seller removes new orders, not active deliveries.</span>
          </div>

          {/* Bottom Live Sync Status matching Figma */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: '#6B7265',
            paddingTop: '16px',
            borderTop: '1px solid #EAECE5',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <span>Live estimates reflect stock, preparation and rider capacity.</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Last synced 14:46 IST <RefreshCw size={11} style={{ cursor: 'pointer' }} />
            </span>
          </div>
        </>
      )}

      {/* ==============================================================
          TAB 2: PENDING APPROVAL (Shop & Rider KYC Verification Queue)
          ============================================================== */}
      {activeTab === 'pending' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#14281C', margin: 0 }}>
              Onboarding & KYC Compliance Queue
            </h3>
            <button
              onClick={fetchQueues}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E5E7DE',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <RefreshCw size={13} className={isLoadingQueues ? 'animate-spin' : ''} />
              <span>Refresh applications</span>
            </button>
          </div>

          {pendingShops.length === 0 ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px dashed #E5E7DE',
              borderRadius: '16px',
              padding: '36px',
              textAlign: 'center'
            }}>
              <ShieldCheck size={36} color="#1C7532" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#14281C' }}>All Merchant Applications Processed</div>
              <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '4px' }}>
                Currently 0 merchant queues pending verification.
              </div>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '16px' }}>
              {pendingShops.map((sh) => (
                <div key={sh.id} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #EAECE5',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 800, fontSize: '16px', color: '#14281C' }}>{sh.shop_name}</div>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 800,
                        backgroundColor: '#FFF8E6',
                        color: '#855700',
                        padding: '3px 8px',
                        borderRadius: '6px',
                        textTransform: 'uppercase'
                      }}>
                        {sh.verification_status || 'Pending'}
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#6B7265', marginBottom: '12px' }}>
                      Owner: <strong>{sh.owner_name}</strong> · {sh.phone}
                    </div>

                    <div style={{
                      backgroundColor: '#F9FAF7',
                      borderRadius: '10px',
                      padding: '10px',
                      fontSize: '11px',
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3, 1fr)',
                      gap: '8px',
                      marginBottom: '16px'
                    }}>
                      <div>
                        <span style={{ color: '#6B7265' }}>GSTIN:</span><br />
                        <strong style={{ color: '#14281C' }}>{sh.gstin || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#6B7265' }}>PAN:</span><br />
                        <strong style={{ color: '#14281C' }}>{sh.pan_number || '—'}</strong>
                      </div>
                      <div>
                        <span style={{ color: '#6B7265' }}>City:</span><br />
                        <strong style={{ color: '#14281C' }}>{sh.city || 'Bengaluru'}</strong>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleDecision('shop', sh.id, 'approved')}
                      disabled={isSubmittingDecision}
                      style={{
                        flex: 1,
                        backgroundColor: '#1E3827',
                        color: '#C6F432',
                        border: 'none',
                        padding: '9px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      Approve Shop
                    </button>
                    <button
                      onClick={() => handleDecision('shop', sh.id, 'rejected')}
                      disabled={isSubmittingDecision}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #E5E7DE',
                        color: '#C92A2A',
                        padding: '9px 14px',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==============================================================
          TAB 3: OPERATIONS ALERTS
          ============================================================== */}
      {activeTab === 'alerts' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAECE5',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#14281C', marginBottom: '16px' }}>
            Active Cluster Capacity & Operations Alerts (6)
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ padding: '14px', backgroundColor: '#FFF8E6', border: '1px solid #F9E29D', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#855700', fontSize: '13px' }}>Koramangala 80ft Road Cluster Bottleneck</strong>
                <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '2px' }}>High traffic congestion causing median ETAs to reach 34 mins. Dynamic delivery fee engaged (+₹15).</div>
              </div>
              <button onClick={() => showToast('Dispatched 6 spare riders to Koramangala')} style={{ backgroundColor: '#855700', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                Rebalance Fleet
              </button>
            </div>

            <div style={{ padding: '14px', backgroundColor: '#F9FAF7', border: '1px solid #EAECE5', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ color: '#14281C', fontSize: '13px' }}>Pocket Studio · Stock Sync Timeout</strong>
                <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '2px' }}>Store POS API timed out 24 mins ago. 4 listings marked with cautionary stock buffer.</div>
              </div>
              <button onClick={() => showToast('Triggered immediate POS webhook sync')} style={{ backgroundColor: '#1E3827', color: '#FFFFFF', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                Retry Sync
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==============================================================
          TAB 4: DELIVERY PARTNERS (Riders Fleet Management)
          ============================================================== */}
      {activeTab === 'riders' && (
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAECE5',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#14281C', marginBottom: '16px' }}>
            Delivery Fleet Network (312 Active Riders)
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #EAECE5', color: '#6B7265', fontWeight: 600, backgroundColor: '#FAFBF8' }}>
                  <th style={{ padding: '12px 16px' }}>Rider / ID</th>
                  <th style={{ padding: '12px 16px' }}>Zone</th>
                  <th style={{ padding: '12px 16px' }}>Rating</th>
                  <th style={{ padding: '12px 16px' }}>Completed Today</th>
                  <th style={{ padding: '12px 16px' }}>Duty Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { name: 'Ravi Kumar', id: 'DP-042', zone: 'Indiranagar', rating: '★ 4.9', completed: '14 orders', status: 'On Delivery · NV-1048' },
                  { name: 'Aditya Rao', id: 'DP-012', zone: 'Indiranagar', rating: '★ 4.8', completed: '11 orders', status: 'Available Radar' },
                  { name: 'Kiran Patel', id: 'DP-099', zone: 'HSR Layout', rating: '★ 4.9', completed: '16 orders', status: 'Heading to Store' },
                  { name: 'Farhan Syed', id: 'DP-156', zone: 'Koramangala', rating: '★ 4.7', completed: '9 orders', status: 'On Delivery' }
                ].map((r, idx) => (
                  <tr key={r.id} style={{ borderBottom: idx === 3 ? 'none' : '1px solid #F0F2ED' }}>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: '#14281C' }}>
                      {r.name} <span style={{ fontSize: '11px', color: '#6B7265' }}>({r.id})</span>
                    </td>
                    <td style={{ padding: '14px 16px', color: '#4B5563' }}>{r.zone}</td>
                    <td style={{ padding: '14px 16px', fontWeight: 600 }}>{r.rating}</td>
                    <td style={{ padding: '14px 16px', color: '#14281C' }}>{r.completed}</td>
                    <td style={{ padding: '14px 16px', color: '#1C7532', fontWeight: 700 }}>{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log Disclaimer */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        color: '#6B7265',
        marginBottom: '16px',
        padding: '0 4px'
      }}>
        <Shield size={14} color="#6B7265" />
        <span>All operational changes are recorded in the audit log. Pausing a seller removes new orders, not active deliveries.</span>
      </div>

      {/* Footer Meta */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        color: '#848C7E',
        padding: '0 4px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <span>Live estimates reflect stock, preparation and rider capacity.</span>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => showToast('Refreshed cluster metrics')}>
          Last synced 14:46 IST <RefreshCw size={12} />
        </span>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '24px',
            maxWidth: '440px',
            width: '100%',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14281C', margin: 0 }}>
                Invite New Merchant
              </h3>
              <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSendInvite}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                  Merchant / Store Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Blue Tokai Roasters"
                  required
                  value={inviteName}
                  onChange={(e) => setInviteName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7DE',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                  Owner Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={invitePhone}
                  onChange={(e) => setInvitePhone(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7DE',
                    fontSize: '13px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#1E3827',
                  color: '#C6F432',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Send Onboarding Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
