import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Bike, Search, Filter, ArrowUpRight, Clock, MapPin, 
  Store, ShieldCheck, CheckCircle2, AlertCircle, 
  X, RefreshCw, Download, UserCheck, Zap, BatteryCharging, 
  Phone, Eye, ChevronRight, Check, Ban
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';
import AdminLayout from '../../components/nivvo/AdminLayout';

export default function NivvoAdminDeliveryView({ onBack }) {
  const { 
    showToast, 
    pendingRiderApplications = [], 
    approveRiderApplication, 
    rejectRiderApplication 
  } = useNivvo();

  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' | 'kyc' | 'hubs'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [inspectCourier, setInspectCourier] = useState(null);
  const [couriers, setCouriers] = useState([]);
  const [isLoadingCouriers, setIsLoadingCouriers] = useState(true);

  const loadRealCouriers = async () => {
    try {
      setIsLoadingCouriers(true);
      const res = await fetch('/api/admin/delivery');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.couriers)) {
          setCouriers(data.couriers);
        }
      }
    } catch (err) {
      console.error('Failed to load live delivery fleet:', err);
    } finally {
      setIsLoadingCouriers(false);
    }
  };

  useEffect(() => {
    loadRealCouriers();
    const interval = setInterval(loadRealCouriers, 10000);
    return () => clearInterval(interval);
  }, []);

  const onlineCouriersCount = couriers.filter(c => c.status !== 'offline').length;
  const totalDeliveriesCount = couriers.reduce((acc, c) => acc + (Number(c.todayDeliveries) || 0), 0);
  const uniqueHubs = Array.from(new Set(couriers.map(c => c.hub || 'Central Pod'))).map(hubName => {
    const hubCouriers = couriers.filter(c => (c.hub || 'Central Pod') === hubName);
    const online = hubCouriers.filter(c => c.status !== 'offline').length;
    return {
      name: hubName,
      address: 'Operational Logistics Micro-Pod',
      couriers: hubCouriers.length,
      onlineCouriers: online,
      status: online > 0 ? 'Active' : 'Standby'
    };
  });

  const filteredCouriers = couriers.filter(courier => {
    if (selectedZone !== 'all' && !courier.hub?.toLowerCase().includes(selectedZone.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = courier.name?.toLowerCase().includes(q);
      const matchId = courier.id?.toLowerCase().includes(q);
      const matchPlate = courier.vehicleNumber?.toLowerCase().includes(q);
      if (!matchName && !matchId && !matchPlate) return false;
    }
    return true;
  });

  return (
    <AdminLayout currentTab="delivery" breadcrumb="Delivery Network & Fleet" onBack={onBack}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
        
        {/* Header Bar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 6px 0',
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0F172A'
            }}>
              Delivery Network & Fleet
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#475569', fontWeight: 500 }}>
              Live delivery fleet telemetry, micro-fulfillment pods, and courier onboarding compliance.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => { playClickSound(); showToast('Exporting fleet telemetry report...'); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 18px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
              }}
            >
              <Download size={16} color="#475569" />
              <span>Export Telemetry</span>
            </button>

            <button
              onClick={() => { playClickSound(); loadRealCouriers(); showToast('Fleet telemetry refreshed'); }}
              disabled={isLoadingCouriers}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 20px',
                backgroundColor: '#0F172A',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(15,23,42,0.15)',
                opacity: isLoadingCouriers ? 0.7 : 1
              }}
            >
              <RefreshCw size={16} color="#FFFFFF" className={isLoadingCouriers ? 'animate-spin' : ''} />
              <span>{isLoadingCouriers ? 'Syncing...' : 'Sync Fleet Radar'}</span>
            </button>
          </div>
        </div>

        {/* 4 Executive Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Metric 1 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Couriers on Duty
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bike size={20} color="#2563EB" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              {couriers.length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <Zap size={15} />
              <span>{onlineCouriersCount} online · 100% EV Electric Fleet</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Online Couriers
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#16A34A" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              {onlineCouriersCount}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <CheckCircle2 size={15} />
              <span>{couriers.length - onlineCouriersCount} couriers on standby</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Completed Deliveries
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <MapPin size={20} color="#A855F7" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              {totalDeliveriesCount}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <ShieldCheck size={15} />
              <span>Direct verified order drop-offs</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Active Fulfillment Pods
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={20} color="#D97706" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              {uniqueHubs.length} Pods
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <span>100% Operational · Connected</span>
            </div>
          </div>
        </div>

        {/* Dark Store Fulfillment Pods Dynamic Status Cards */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0F172A', margin: '0 0 16px 0' }}>
            Fulfillment Pod Telemetry
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: uniqueHubs.length > 0 ? 'repeat(auto-fit, minmax(320px, 1fr))' : '1fr',
            gap: '18px'
          }}>
            {uniqueHubs.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '32px 24px',
                textAlign: 'center',
                color: '#64748B'
              }}>
                <div style={{ fontWeight: 600, color: '#0F172A', marginBottom: '4px' }}>No active couriers assigned to pods</div>
                <div style={{ fontSize: '13px' }}>As delivery riders register and check into dark stores, their live telemetry will appear here.</div>
              </div>
            ) : (
              uniqueHubs.map((hub, i) => (
                <div key={i} style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>
                      {hub.name}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: hub.status === 'Active' ? '#ECFDF5' : '#F1F5F9',
                      color: hub.status === 'Active' ? '#065F46' : '#64748B',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {hub.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginBottom: '16px' }}>
                    {hub.address}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', paddingTop: '12px', borderTop: '1px solid #F1F5F9' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Assigned Couriers</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>{hub.couriers} Fleet</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Online on Duty</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A', marginTop: '2px' }}>{hub.onlineCouriers} Couriers</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Fulfillment Speed</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', marginTop: '2px' }}>Instant Handover</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 500 }}>Fleet Radar</div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#2563EB', marginTop: '2px' }}>Connected</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Navigation Tabs & Controls */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          {/* Tabs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => { playClickSound(); setActiveTab('fleet'); }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: activeTab === 'fleet' ? 700 : 600,
                backgroundColor: activeTab === 'fleet' ? '#0F172A' : '#F8FAFC',
                color: activeTab === 'fleet' ? '#FFFFFF' : '#475569',
                border: activeTab === 'fleet' ? '1px solid #0F172A' : '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Active Fleet Radar</span>
              <span style={{
                fontSize: '12px',
                padding: '2px 7px',
                borderRadius: '12px',
                backgroundColor: activeTab === 'fleet' ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                color: activeTab === 'fleet' ? '#FFFFFF' : '#334155'
              }}>
                {couriers.length}
              </span>
            </button>

            <button
              onClick={() => { playClickSound(); setActiveTab('kyc'); }}
              style={{
                padding: '10px 18px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: activeTab === 'kyc' ? 700 : 600,
                backgroundColor: activeTab === 'kyc' ? '#0F172A' : '#F8FAFC',
                color: activeTab === 'kyc' ? '#FFFFFF' : '#475569',
                border: activeTab === 'kyc' ? '1px solid #0F172A' : '1px solid #E2E8F0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>Courier KYC Approvals</span>
              <span style={{
                fontSize: '12px',
                padding: '2px 7px',
                borderRadius: '12px',
                backgroundColor: activeTab === 'kyc' ? '#DC2626' : '#FEE2E2',
                color: activeTab === 'kyc' ? '#FFFFFF' : '#991B1B',
                fontWeight: 700
              }}>
                {pendingRiderApplications.length}
              </span>
            </button>
          </div>

          {/* Search & Hub Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0 14px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              width: '280px',
              height: '42px'
            }}>
              <Search size={16} color="#64748B" />
              <input
                type="text"
                placeholder="Search Courier Name, ID, Plate..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  width: '100%',
                  fontSize: '14px',
                  color: '#0F172A'
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                  <X size={14} color="#64748B" />
                </button>
              )}
            </div>

            <select
              value={selectedZone}
              onChange={e => setSelectedZone(e.target.value)}
              style={{
                height: '42px',
                padding: '0 14px',
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="all">All Delivery Hubs</option>
              <option value="indiranagar">Indiranagar Flagship</option>
              <option value="koramangala">Koramangala Hyper-Pod</option>
              <option value="hsr">HSR Layout Micro-Hub</option>
            </select>
          </div>
        </div>

        {/* Tab 1: Active Fleet Table */}
        {activeTab === 'fleet' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '1000px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Courier Details
                    </th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      EV / Vehicle Spec
                    </th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Logistics Hub & Zone
                    </th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Status & Active Job
                    </th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Deliveries Today
                    </th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      SLA Rating
                    </th>
                    <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCouriers.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B', fontSize: '15px' }}>
                        {isLoadingCouriers ? 'Loading live delivery fleet from database...' : 'No couriers found matching search parameters.'}
                      </td>
                    </tr>
                  ) : (
                    filteredCouriers.map(courier => {
                      const isBusy = courier.status === 'delivering' || courier.status === 'tryon';
                      return (
                        <tr 
                          key={courier.id} 
                          style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                          onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {/* Courier Details */}
                          <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                              {courier.name}
                            </div>
                            <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                              {courier.id} · {courier.phone}
                            </div>
                          </td>

                          {/* Vehicle Spec */}
                          <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <Zap size={14} color="#16A34A" />
                              <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                                {courier.vehicle}
                              </span>
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                              {courier.vehicleNumber} · Battery: {courier.battery}
                            </div>
                          </td>

                          {/* Hub & Zone */}
                          <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                              {courier.hub}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                              {courier.zone}
                            </div>
                          </td>

                          {/* Status */}
                          <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                            <div style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              fontSize: '12px',
                              fontWeight: 700,
                              backgroundColor: isBusy ? '#EFF6FF' : '#ECFDF5',
                              color: isBusy ? '#1D4ED8' : '#065F46'
                            }}>
                              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: isBusy ? '#2563EB' : '#10B981' }} />
                              {courier.statusLabel}
                            </div>
                            {courier.activeOrder && (
                              <div style={{ fontSize: '12px', fontWeight: 600, color: '#2563EB', marginTop: '4px' }}>
                                Order #{courier.activeOrder}
                              </div>
                            )}
                          </td>

                          {/* Deliveries */}
                          <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                              {courier.todayDeliveries} Orders
                            </div>
                            <div style={{ fontSize: '12px', color: '#16A34A', marginTop: '2px', fontWeight: 600 }}>
                              {courier.onTimeRate} On-Time
                            </div>
                          </td>

                          {/* Rating */}
                          <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                            <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                              ★ {courier.rating}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                              Customer Score
                            </div>
                          </td>

                          {/* Actions */}
                          <td style={{ padding: '18px 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                            <button
                              onClick={() => { playClickSound(); setInspectCourier(courier); }}
                              style={{
                                padding: '8px 14px',
                                backgroundColor: '#F1F5F9',
                                border: '1px solid #E2E8F0',
                                borderRadius: '8px',
                                fontSize: '13px',
                                fontWeight: 600,
                                color: '#0F172A',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <span>Telemetry</span>
                              <ChevronRight size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Courier KYC Approvals */}
        {activeTab === 'kyc' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 600, color: '#475569' }}>
              Pending Delivery Courier Applications awaiting document compliance verification.
            </div>

            {pendingRiderApplications.length === 0 ? (
              <div style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '16px',
                padding: '48px 24px',
                textAlign: 'center'
              }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '16px', backgroundColor: '#F0FDF4', color: '#16A34A', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <CheckCircle2 size={32} />
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' }}>
                  All Courier Applications Cleared
                </h3>
                <p style={{ fontSize: '14px', color: '#64748B', maxWidth: '440px', margin: '0 auto' }}>
                  There are currently no courier KYC applications awaiting review. All delivery partners are actively verified.
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {pendingRiderApplications.map(app => (
                  <div key={app.id} style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '24px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                      <div>
                        <div style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A' }}>
                          {app.name}
                        </div>
                        <div style={{ fontSize: '14px', color: '#64748B', marginTop: '2px' }}>
                          {app.phone} · {app.city}
                        </div>
                      </div>
                      <span style={{
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: '#FEF3C7',
                        color: '#92400E',
                        padding: '4px 10px',
                        borderRadius: '6px'
                      }}>
                        KYC Pending
                      </span>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', borderRadius: '12px', padding: '14px', marginBottom: '18px' }}>
                      <div style={{ fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
                        <strong>Vehicle:</strong> {app.vehicle_type} ({app.vehicle_number})
                      </div>
                      <div style={{ fontSize: '13px', color: '#334155', marginBottom: '6px' }}>
                        <strong>Driving License:</strong> {app.license_number}
                      </div>
                      <div style={{ fontSize: '13px', color: '#334155' }}>
                        <strong>Aadhaar / ID:</strong> {app.aadhaar_number}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button
                        onClick={() => approveRiderApplication(app.id)}
                        style={{
                          flex: 1,
                          padding: '12px',
                          backgroundColor: '#16A34A',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <Check size={16} />
                        <span>Approve Courier</span>
                      </button>

                      <button
                        onClick={() => rejectRiderApplication(app.id, 'License image requires higher clarity')}
                        style={{
                          padding: '12px 18px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #CBD5E1',
                          borderRadius: '10px',
                          fontSize: '14px',
                          fontWeight: 600,
                          color: '#DC2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Ban size={16} />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Courier Telemetry Drawer */}
        {inspectCourier && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            display: 'flex',
            justifyContent: 'flex-end',
            zIndex: 100,
            backdropFilter: 'blur(3px)'
          }}>
            <div style={{
              width: '100%',
              maxWidth: '540px',
              backgroundColor: '#FFFFFF',
              height: '100vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)'
            }}>
              {/* Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#F8FAFC'
              }}>
                <div>
                  <div style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                    {inspectCourier.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                    Courier ID: {inspectCourier.id} · {inspectCourier.phone}
                  </div>
                </div>

                <button
                  onClick={() => setInspectCourier(null)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    border: '1px solid #E2E8F0',
                    backgroundColor: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <X size={18} color="#475569" />
                </button>
              </div>

              {/* Content */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                
                {/* Live Status Card */}
                <div style={{ backgroundColor: '#EFF6FF', border: '1px solid #DBEAFE', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E40AF', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Active Duty Status
                  </div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E3A8A', marginTop: '4px' }}>
                    {inspectCourier.statusLabel}
                  </div>
                  {inspectCourier.activeOrder && (
                    <div style={{ fontSize: '14px', color: '#2563EB', marginTop: '4px', fontWeight: 600 }}>
                      Currently delivering Order #{inspectCourier.activeOrder}
                    </div>
                  )}
                </div>

                {/* Vehicle & Telemetry */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    Vehicle Specifications
                  </h3>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Vehicle Model:</span>
                      <strong style={{ color: '#0F172A' }}>{inspectCourier.vehicle}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Registration Plate:</span>
                      <strong style={{ color: '#0F172A' }}>{inspectCourier.vehicleNumber}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Battery Level:</span>
                      <strong style={{ color: '#16A34A' }}>{inspectCourier.battery}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Assigned Pod:</span>
                      <strong style={{ color: '#0F172A' }}>{inspectCourier.hub}</strong>
                    </div>
                  </div>
                </div>

                {/* Performance SLA Metrics */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    SLA & Performance Record
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Deliveries Today</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                        {inspectCourier.todayDeliveries} Orders
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>On-Time Rate</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>
                        {inspectCourier.onTimeRate}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Drawer Footer Actions */}
              <div style={{
                padding: '20px 24px',
                borderTop: '1px solid #E2E8F0',
                display: 'flex',
                gap: '12px',
                backgroundColor: '#F8FAFC'
              }}>
                <button
                  onClick={() => { playClickSound(); showToast(`Calling courier ${inspectCourier.name}...`); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Phone size={15} />
                  <span>Call Courier</span>
                </button>

                <button
                  onClick={() => { playClickSound(); showToast(`Zone reallocated for ${inspectCourier.name}`); setInspectCourier(null); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#0F172A',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  Reassign Zone
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
