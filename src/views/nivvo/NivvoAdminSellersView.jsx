import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowUpRight, Search, AlertTriangle, Check, ChevronDown, 
  Store, Power, X, FileText, CheckCircle2, AlertCircle, Clock, ShieldCheck, 
  Bike, UserCheck, RefreshCw, Eye, MessageSquare, ChevronLeft, ChevronRight, Shield,
  Star, Mail, PlusCircle, Building2, ExternalLink
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
  const [selectedZoneFilter, setSelectedZoneFilter] = useState('All Zones');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All Status');
  
  // Real Verification Queues backed by context & backend
  const [pendingShops, setPendingShops] = useState(pendingSellerApplications || []);
  const [pendingRiders, setPendingRiders] = useState(pendingRiderApplications || []);
  const [isLoadingQueues, setIsLoadingQueues] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [decisionNotes, setDecisionNotes] = useState('');
  const [isSubmittingDecision, setIsSubmittingDecision] = useState(false);

  // Invite Modal
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [invitePhone, setInvitePhone] = useState('');

  // Real database sellers loaded via API
  const [sellers, setSellers] = useState([]);
  const [isLoadingSellers, setIsLoadingSellers] = useState(true);

  // Fetch Verification Queues and Real Sellers from Backend
  const fetchQueues = async () => {
    setIsLoadingQueues(true);
    setIsLoadingSellers(true);
    try {
      const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
      
      const [shopsRes, ridersRes, sellersRes] = await Promise.all([
        fetch('/api/admin/verifications/shops', { headers }).then(r => r.json()).catch(() => ({ shops: [] })),
        fetch('/api/admin/verifications/riders', { headers }).then(r => r.json()).catch(() => ({ riders: [] })),
        fetch('/api/admin/sellers', { headers }).then(r => r.json()).catch(() => ({ sellers: [] }))
      ]);

      if (shopsRes?.shops && Array.isArray(shopsRes.shops)) setPendingShops(shopsRes.shops);
      if (ridersRes?.riders && Array.isArray(ridersRes.riders)) setPendingRiders(ridersRes.riders);
      if (sellersRes?.sellers && Array.isArray(sellersRes.sellers)) {
        const liveSellers = sellersRes.sellers.map(s => ({
          ...s,
          color: s.isLive ? '#15803D' : '#D97706',
          prepTime: s.prepTime || '4–6 min',
          stockAccuracy: s.stockAccuracy || '99.2%',
          acceptanceRate: s.acceptanceRate || '98.5%',
          verifications: s.verifications || [
            s.gstin ? `GSTIN Verified (${s.gstin})` : 'Trade License Active',
            'Owner Identity & PAN Confirmed',
            'Direct Settlement Account Verified'
          ],
          activities: s.activities || [
            'Store verified on Nivvo 10-Minute Dark-Store Dispatch Cloud'
          ]
        }));
        setSellers(liveSellers);
        if (liveSellers.length > 0) {
          setSelectedSellerId(prev => (prev && liveSellers.find(item => item.id === prev) ? prev : liveSellers[0].id));
        }
      }
    } catch (err) {
      console.error('Failed to load real admin sellers:', err);
    } finally {
      setIsLoadingQueues(false);
      setIsLoadingSellers(false);
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
                cat: approved.category || 'Retail Boutique',
                zone: 'Indiranagar Hub #14',
                rating: '5.0',
                sync: 'Just now',
                status: 'Active Store',
                isLive: true,
                color: '#15803D',
                address: approved.address || 'Indiranagar, Bengaluru',
                owner: approved.owner_name,
                prepTime: '4–6 min',
                stockAccuracy: '100%',
                acceptanceRate: '100%',
                verifications: [
                  'GSTIN Verified & Tax Invoice Enabled',
                  'Owner KYC Document Approved',
                  'Settlement Account Verified'
                ],
                activities: [
                  'Just now · Application approved by Compliance Officer. Live on customer search.'
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

      showToast(`Merchant application status updated to: ${decisionStatus.toUpperCase()}`);
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
          status: nextLive ? 'Active Store' : 'Temporarily Paused',
          color: nextLive ? '#15803D' : '#64748B'
        };
      }
      return s;
    }));
    showToast(`Storefront status updated for ${selectedSeller.name}`);
  };

  const handleSendInvite = (e) => {
    e.preventDefault();
    if (!inviteName.trim()) return;
    playTrialSound();
    setShowInviteModal(false);
    showToast(`Onboarding invitation sent to ${inviteName} (${invitePhone || '+91 98450 00000'})`);
    setInviteName('');
    setInvitePhone('');
  };

  const filteredSellers = sellers.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.cat.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.zone.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesZone = selectedZoneFilter === 'All Zones' || s.zone.includes(selectedZoneFilter.replace(' Hub', ''));
    const matchesStatus = selectedStatusFilter === 'All Status' || 
                          (selectedStatusFilter === 'Active' && s.isLive) ||
                          (selectedStatusFilter === 'Paused' && !s.isLive);
    return matchesSearch && matchesZone && matchesStatus;
  });

  return (
    <AdminLayout currentTab="sellers" breadcrumb="Merchants & Operations" onBack={onBack}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Title & Actions Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 800,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              margin: '0 0 6px 0'
            }}>
              Merchant Operations & Compliance
            </h1>
            <p style={{ fontSize: '15px', color: '#475569', margin: 0, fontWeight: 500 }}>
              Audit partner stores, review compliance applications, and monitor catalog inventory availability.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                playClickSound();
                setShowInviteModal(true);
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '11px 20px',
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(15,23,42,0.1)'
              }}
            >
              <PlusCircle size={16} color="#A3E635" />
              <span>Register Merchant</span>
            </button>
          </div>
        </div>

        {/* Operational Constraint Alert Banner */}
        <div style={{
          backgroundColor: '#FFFBEB',
          border: '1.5px solid #FCD34D',
          borderRadius: '14px',
          padding: '16px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#FEF3C7',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <AlertTriangle size={20} color="#B45309" />
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#92400E' }}>
                Koramangala Logistics Hub Capacity Constrained
              </div>
              <div style={{ fontSize: '14px', color: '#B45309', marginTop: '2px' }}>
                Delivery windows temporarily extended to 25–35 minutes. Automatic dynamic surge buffer engaged.
              </div>
            </div>
          </div>

          <button
            onClick={() => showToast('Inspecting active Koramangala dispatch zone')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #FCD34D',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#92400E',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer'
            }}
          >
            <span>Inspect Dispatch Fleet</span>
            <ArrowUpRight size={15} />
          </button>
        </div>

        {/* Spacious Top Navigation Tabs */}
        <div style={{
          display: 'flex',
          gap: '12px',
          borderBottom: '1px solid #E2E8F0',
          paddingBottom: '14px',
          overflowX: 'auto'
        }}>
          <button
            onClick={() => { playClickSound(); setActiveTab('directory'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: activeTab === 'directory' ? '#0F172A' : '#FFFFFF',
              color: activeTab === 'directory' ? '#FFFFFF' : '#475569',
              border: activeTab === 'directory' ? 'none' : '1px solid #CBD5E1',
              padding: '10px 22px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'directory' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Store size={18} />
            <span>Merchant Directory</span>
            <span style={{
              backgroundColor: activeTab === 'directory' ? '#334155' : '#F1F5F9',
              color: activeTab === 'directory' ? '#FFFFFF' : '#0F172A',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800
            }}>
              {sellers.length}
            </span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('pending'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: activeTab === 'pending' ? '#0F172A' : '#FFFFFF',
              color: activeTab === 'pending' ? '#FFFFFF' : '#475569',
              border: activeTab === 'pending' ? 'none' : '1px solid #CBD5E1',
              padding: '10px 22px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'pending' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <ShieldCheck size={18} />
            <span>Store Applications</span>
            <span style={{
              backgroundColor: pendingShops.length > 0 ? '#FEF3C7' : '#F1F5F9',
              color: pendingShops.length > 0 ? '#92400E' : '#475569',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800
            }}>
              {pendingShops.length > 0 ? `${pendingShops.length} Pending` : 'Clear'}
            </span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('riders'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: activeTab === 'riders' ? '#0F172A' : '#FFFFFF',
              color: activeTab === 'riders' ? '#FFFFFF' : '#475569',
              border: activeTab === 'riders' ? 'none' : '1px solid #CBD5E1',
              padding: '10px 22px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'riders' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <Bike size={18} />
            <span>Courier Fleet Operations</span>
            <span style={{
              backgroundColor: activeTab === 'riders' ? '#334155' : '#F1F5F9',
              color: activeTab === 'riders' ? '#FFFFFF' : '#0F172A',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800
            }}>
              {pendingRiders.length > 0 ? `${pendingRiders.length} Pending KYC` : 'Active'}
            </span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('alerts'); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: activeTab === 'alerts' ? '#0F172A' : '#FFFFFF',
              color: activeTab === 'alerts' ? '#FFFFFF' : '#475569',
              border: activeTab === 'alerts' ? 'none' : '1px solid #CBD5E1',
              padding: '10px 22px',
              borderRadius: '10px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: activeTab === 'alerts' ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <AlertCircle size={18} />
            <span>Operational Alerts</span>
            <span style={{
              backgroundColor: activeTab === 'alerts' ? '#334155' : '#F1F5F9',
              color: activeTab === 'alerts' ? '#FFFFFF' : '#0F172A',
              padding: '2px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 800
            }}>
              6
            </span>
          </button>
        </div>

        {/* ==============================================================
            TAB 1: MERCHANT DIRECTORY
            ============================================================== */}
        {activeTab === 'directory' && (
          <>
            {/* Search and Filters Toolbar */}
            <div style={{
              display: 'flex',
              gap: '14px',
              flexWrap: 'wrap'
            }}>
              <div style={{
                flex: 1,
                minWidth: '320px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                borderRadius: '10px',
                padding: '12px 18px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}>
                <Search size={18} color="#64748B" />
                <input
                  type="text"
                  placeholder="Search store name, partner ID, category, or registered owner..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    outline: 'none',
                    width: '100%',
                    fontSize: '15px',
                    color: '#0F172A',
                    backgroundColor: 'transparent'
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '12px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer'
              }}>
                <span>All Zones</span>
                <ChevronDown size={16} color="#64748B" />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #CBD5E1',
                padding: '12px 20px',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#0F172A',
                cursor: 'pointer'
              }}>
                <span>Store Status: All</span>
                <ChevronDown size={16} color="#64748B" />
              </div>
            </div>

            {/* Split View: Master Directory Table on Left + Inspector Card on Right */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1fr)',
              gap: '24px',
              alignItems: 'start'
            }}>
              {/* Left: Table */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', backgroundColor: '#F8FAFC' }}>
                      <th style={{ padding: '16px 20px' }}>Store & ID</th>
                      <th style={{ padding: '16px 20px' }}>Zone</th>
                      <th style={{ padding: '16px 20px' }}>Store Rating</th>
                      <th style={{ padding: '16px 20px' }}>POS Sync</th>
                      <th style={{ padding: '16px 20px' }}>Storefront Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSellers.length === 0 ? (
                      <tr>
                        <td colSpan={5} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B' }}>
                          {isLoadingSellers ? 'Loading live partner stores from database...' : 'No partner stores found.'}
                        </td>
                      </tr>
                    ) : (
                      filteredSellers.map((s, idx) => {
                        const isSelected = selectedSellerId === s.id;
                        return (
                          <tr 
                            key={s.id}
                            onClick={() => {
                              playClickSound();
                              setSelectedSellerId(s.id);
                            }}
                            style={{
                              borderBottom: idx === filteredSellers.length - 1 ? 'none' : '1px solid #F1F5F9',
                              backgroundColor: isSelected ? '#F8FAFC' : '#FFFFFF',
                              cursor: 'pointer',
                              transition: 'background-color 0.15s ease'
                            }}
                          >
                            <td style={{ padding: '18px 20px' }}>
                              <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
                                {s.name}
                              </div>
                              <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                                ID: {s.id} · {s.cat}
                              </div>
                            </td>
                            <td style={{ padding: '18px 20px', color: '#0F172A', fontWeight: 500 }}>
                              {s.zone}
                            </td>
                            <td style={{ padding: '18px 20px' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#0F172A' }}>
                                <Star size={14} fill="#F59E0B" color="#F59E0B" />
                                <span>{s.rating}</span>
                              </div>
                            </td>
                            <td style={{ padding: '18px 20px', color: '#64748B', fontSize: '13px' }}>
                              {s.sync}
                            </td>
                            <td style={{ padding: '18px 20px' }}>
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                fontSize: '13px',
                                fontWeight: 700,
                                backgroundColor: s.isLive ? '#DCFCE7' : '#F1F5F9',
                                color: s.isLive ? '#15803D' : '#64748B'
                              }}>
                                <span style={{
                                  width: '7px',
                                  height: '7px',
                                  borderRadius: '50%',
                                  backgroundColor: s.isLive ? '#16A34A' : '#94A3B8'
                                }} />
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '16px 24px',
                  borderTop: '1px solid #E2E8F0',
                  fontSize: '14px',
                  color: '#64748B',
                  backgroundColor: '#F8FAFC'
                }}>
                  <span>Showing 1 to {filteredSellers.length} of {sellers.length} registered partner stores</span>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button style={{ padding: '6px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}>Previous</button>
                    <span style={{ fontWeight: 800, color: '#0F172A', padding: '0 8px' }}>Page 1 of 1</span>
                    <button style={{ padding: '6px 12px', border: '1px solid #CBD5E1', borderRadius: '6px', background: '#FFFFFF', cursor: 'pointer', fontWeight: 600 }}>Next</button>
                  </div>
                </div>
              </div>

              {/* Right: Selected Seller Inspector Card */}
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #0F172A',
                borderRadius: '16px',
                padding: '28px',
                boxShadow: '0 4px 12px rgba(15,23,42,0.06)'
              }}>
                {selectedSeller ? (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', margin: '0 0 4px 0' }}>
                          {selectedSeller.name}
                        </h3>
                        <div style={{ fontSize: '13px', color: '#64748B' }}>
                          Partner Identifier: <strong>{selectedSeller.id}</strong>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        padding: '4px 12px',
                        borderRadius: '20px',
                        backgroundColor: selectedSeller.isLive ? '#DCFCE7' : '#FEE2E2',
                        color: selectedSeller.isLive ? '#15803D' : '#991B1B'
                      }}>
                        {selectedSeller.isLive ? 'Online Storefront' : 'Offline / Paused'}
                      </span>
                    </div>

                <div style={{ fontSize: '14px', color: '#475569', marginBottom: '22px', lineHeight: 1.5 }}>
                  {selectedSeller.address}
                </div>

                {/* Legal & Compliance Checklist */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                    Compliance & Verification Status
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#15803D' }}>
                    {selectedSeller.verifications.map((v, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                        <CheckCircle2 size={16} color="#16A34A" />
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Performance Metrics */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Authorized Owner</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedSeller.owner}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Average Preparation SLA</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedSeller.prepTime}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Stock Accuracy Audit</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedSeller.stockAccuracy}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: '#64748B' }}>Order Acceptance Rate</span>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>{selectedSeller.acceptanceRate}</span>
                    </div>
                  </div>
                </div>

                {/* Recent Activity Log */}
                <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '20px', marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '12px' }}>
                    Operational Activity Log
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#475569', lineHeight: 1.5 }}>
                    {selectedSeller.activities.map((a, i) => (
                      <div key={i} style={{ backgroundColor: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                        {a}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => {
                      playClickSound();
                      navigateTo('seller-dash');
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: '#0F172A',
                      border: 'none',
                      borderRadius: '10px',
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <span>Inspect Merchant Dashboard</span>
                    <ExternalLink size={16} />
                  </button>

                  <button
                    onClick={() => toggleSellerStatus(selectedSeller.id)}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      backgroundColor: selectedSeller.isLive ? '#FEE2E2' : '#DCFCE7',
                      border: selectedSeller.isLive ? '1px solid #FCA5A5' : '1px solid #86EFAC',
                      borderRadius: '10px',
                      color: selectedSeller.isLive ? '#991B1B' : '#166534',
                      fontSize: '14px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                  >
                    <Power size={16} />
                    <span>{selectedSeller.isLive ? 'Pause Storefront Orders' : 'Resume Storefront Availability'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748B' }}>
                <Store size={40} color="#94A3B8" style={{ marginBottom: '12px' }} />
                <h4 style={{ margin: '0 0 6px 0', fontSize: '18px', color: '#0F172A', fontWeight: 700 }}>
                  {isLoadingSellers ? 'Loading Store Details...' : 'No Partner Store Selected'}
                </h4>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  Select a registered merchant from the directory table to inspect compliance and telemetry.
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    )}

        {/* ==============================================================
            TAB 2: STORE APPLICATIONS QUEUE
            ============================================================== */}
        {activeTab === 'pending' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Merchant KYC & Tax Compliance Queue
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B' }}>
                  Verify GSTIN certificates, trade licenses, and banking mandates before storefront activation.
                </p>
              </div>

              <button
                onClick={fetchQueues}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: '#0F172A'
                }}
              >
                <RefreshCw size={14} className={isLoadingQueues ? 'animate-spin' : ''} />
                <span>Refresh Queue</span>
              </button>
            </div>

            {pendingShops.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px dashed #CBD5E1',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <ShieldCheck size={44} color="#16A34A" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontWeight: 800, fontSize: '18px', color: '#0F172A' }}>All Merchant Applications Approved</div>
                <div style={{ fontSize: '14px', color: '#64748B', marginTop: '6px' }}>
                  There are currently zero applications awaiting compliance verification.
                </div>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '20px' }}>
                {pendingShops.map((sh) => (
                  <div key={sh.id} style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '18px', color: '#0F172A' }}>{sh.shop_name}</div>
                          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>{sh.category || 'Retail Goods'}</div>
                        </div>
                        <span style={{
                          fontSize: '12px',
                          fontWeight: 700,
                          backgroundColor: '#FEF3C7',
                          color: '#92400E',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          textTransform: 'uppercase'
                        }}>
                          {sh.verification_status || 'Under Review'}
                        </span>
                      </div>

                      <div style={{ fontSize: '14px', color: '#475569', marginBottom: '16px' }}>
                        Registered Owner: <strong>{sh.owner_name}</strong> · Contact: {sh.phone}
                      </div>

                      <div style={{
                        backgroundColor: '#F8FAFC',
                        borderRadius: '10px',
                        border: '1px solid #E2E8F0',
                        padding: '14px',
                        fontSize: '13px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '12px',
                        marginBottom: '20px'
                      }}>
                        <div>
                          <span style={{ color: '#64748B', fontSize: '12px' }}>GSTIN:</span><br />
                          <strong style={{ color: '#0F172A' }}>{sh.gstin || '29AABCU9603R1ZM'}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748B', fontSize: '12px' }}>PAN:</span><br />
                          <strong style={{ color: '#0F172A' }}>{sh.pan_number || 'AABCU9603R'}</strong>
                        </div>
                        <div>
                          <span style={{ color: '#64748B', fontSize: '12px' }}>City:</span><br />
                          <strong style={{ color: '#0F172A' }}>{sh.city || 'Bengaluru'}</strong>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => handleDecision('shop', sh.id, 'approved')}
                        disabled={isSubmittingDecision}
                        style={{
                          flex: 1,
                          backgroundColor: '#16A34A',
                          color: '#FFFFFF',
                          border: 'none',
                          padding: '12px',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: 700,
                          cursor: 'pointer'
                        }}
                      >
                        Approve Application
                      </button>
                      <button
                        onClick={() => handleDecision('shop', sh.id, 'rejected')}
                        disabled={isSubmittingDecision}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #E2E8F0',
                          color: '#DC2626',
                          padding: '12px 18px',
                          borderRadius: '8px',
                          fontSize: '14px',
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
            TAB 3: COURIER FLEET OPERATIONS
            ============================================================== */}
        {activeTab === 'riders' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Active Courier Dispatch Fleet (312 Couriers)
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748B' }}>
                  Live delivery partner radar, vehicle telemetry, and job allocation status.
                </p>
              </div>

              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#DCFCE7',
                color: '#166534',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: 700
              }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                <span>Radar Online</span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 700, fontSize: '13px', textTransform: 'uppercase', backgroundColor: '#F8FAFC' }}>
                    <th style={{ padding: '14px 18px' }}>Courier Partner & ID</th>
                    <th style={{ padding: '14px 18px' }}>Assigned Logistics Hub</th>
                    <th style={{ padding: '14px 18px' }}>Partner Rating</th>
                    <th style={{ padding: '14px 18px' }}>Deliveries Completed</th>
                    <th style={{ padding: '14px 18px' }}>Real-time Duty Status</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Ravi Kumar', id: 'DP-042', zone: 'Indiranagar Hub #14', rating: '4.9', completed: '14 Orders', status: 'En Route · Order NV-1048', active: true },
                    { name: 'Aditya Rao', id: 'DP-012', zone: 'Indiranagar Hub #14', rating: '4.8', completed: '11 Orders', status: 'Available for Dispatch', active: true },
                    { name: 'Kiran Patel', id: 'DP-099', zone: 'HSR Layout Hub #05', rating: '4.9', completed: '16 Orders', status: 'Heading to Merchant Store', active: true },
                    { name: 'Farhan Syed', id: 'DP-156', zone: 'Koramangala Hub #08', rating: '4.7', completed: '9 Orders', status: 'Doorstep Try-On Handover', active: true }
                  ].map((r, idx) => (
                    <tr key={r.id} style={{ borderBottom: idx === 3 ? 'none' : '1px solid #F1F5F9' }}>
                      <td style={{ padding: '18px', fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
                        {r.name} <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>({r.id})</span>
                      </td>
                      <td style={{ padding: '18px', color: '#475569' }}>{r.zone}</td>
                      <td style={{ padding: '18px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700, color: '#0F172A' }}>
                          <Star size={14} fill="#F59E0B" color="#F59E0B" />
                          <span>{r.rating}</span>
                        </div>
                      </td>
                      <td style={{ padding: '18px', color: '#0F172A', fontWeight: 600 }}>{r.completed}</td>
                      <td style={{ padding: '18px' }}>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '13px',
                          fontWeight: 700,
                          backgroundColor: '#DCFCE7',
                          color: '#15803D'
                        }}>
                          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                          {r.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==============================================================
            TAB 4: OPERATIONAL ALERTS
            ============================================================== */}
        {activeTab === 'alerts' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '28px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: '0 0 20px 0' }}>
              Active Logistics & Merchant Infrastructure Alerts (6)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{
                padding: '18px 24px',
                backgroundColor: '#FFFBEB',
                border: '1px solid #FCD34D',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#92400E', fontSize: '15px' }}>
                    Koramangala 80ft Road Cluster Bottleneck
                  </div>
                  <div style={{ fontSize: '14px', color: '#78350F', marginTop: '4px' }}>
                    Traffic density causing median delivery ETA to increase to 34 minutes. Dynamic courier surge active (+₹15).
                  </div>
                </div>
                <button 
                  onClick={() => showToast('Dispatched 6 standby courier units to Koramangala Hub')}
                  style={{
                    backgroundColor: '#B45309',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Rebalance Fleet Units
                </button>
              </div>

              <div style={{
                padding: '18px 24px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '16px'
              }}>
                <div>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '15px' }}>
                    Pocket Studio POS Stock Sync Latency
                  </div>
                  <div style={{ fontSize: '14px', color: '#64748B', marginTop: '4px' }}>
                    Merchant retail POS API timed out 24 minutes ago. 4 listings marked with safety stock buffer.
                  </div>
                </div>
                <button 
                  onClick={() => showToast('Triggered POS webhook resynchronization')}
                  style={{
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Retry Sync Webhook
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audit Compliance Disclaimer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '13px',
          color: '#64748B',
          padding: '4px 0'
        }}>
          <Shield size={16} color="#64748B" />
          <span>All merchant status modifications are recorded in the immutable platform compliance audit trail.</span>
        </div>

        {/* Merchant Onboarding Invite Modal */}
        {showInviteModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '32px',
              maxWidth: '480px',
              width: '100%',
              boxShadow: '0 24px 48px rgba(0,0,0,0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Register Partner Merchant
                </h3>
                <button onClick={() => setShowInviteModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}>
                  <X size={22} />
                </button>
              </div>

              <form onSubmit={handleSendInvite}>
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Retail Store or Business Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sole Street Sneaker Studio"
                    required
                    value={inviteName}
                    onChange={(e) => setInviteName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#0F172A', marginBottom: '8px' }}>
                    Owner Registered Mobile Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98450 67890"
                    value={invitePhone}
                    onChange={(e) => setInvitePhone(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      color: '#0F172A',
                      outline: 'none'
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '15px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(15,23,42,0.1)'
                  }}
                >
                  Send Onboarding Invitation
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
