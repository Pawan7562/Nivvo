import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Users, Search, Filter, ArrowUpRight, Clock, MapPin, 
  Store, ShieldCheck, CheckCircle2, AlertCircle, 
  X, RefreshCw, Download, Heart, ShoppingBag, 
  Phone, Mail, ChevronRight, Gift, Sliders, Star
} from 'lucide-react';
import { playClickSound } from '../../utils/audioEffects';
import AdminLayout from '../../components/nivvo/AdminLayout';

export default function NivvoAdminCustomersView({ onBack }) {
  const { showToast } = useNivvo();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'vip' | 'frequent' | 'new'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTier, setSelectedTier] = useState('all');
  const [inspectCustomer, setInspectCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

  const loadRealCustomers = async () => {
    try {
      setIsLoadingCustomers(true);
      const res = await fetch('/api/admin/customers');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.customers)) {
          setCustomers(data.customers);
        }
      }
    } catch (err) {
      console.error('Failed to load real customer profiles:', err);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  useEffect(() => {
    loadRealCustomers();
    const interval = setInterval(loadRealCustomers, 12000);
    return () => clearInterval(interval);
  }, []);

  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.tier?.toLowerCase().includes('vip')).length;
  const frequentCustomers = customers.filter(c => (c.ordersCount || 0) > 0).length;
  const newCustomers = customers.filter(c => (c.ordersCount || 0) === 0).length;
  const totalSpendAll = customers.reduce((sum, c) => sum + (Number(c.totalSpend) || 0), 0);
  const avgSpend = totalCustomers > 0 ? Math.round(totalSpendAll / totalCustomers) : 0;

  const filteredCustomers = customers.filter(customer => {
    if (activeTab === 'vip' && !customer.tier?.toLowerCase().includes('vip')) return false;
    if (activeTab === 'frequent' && (customer.ordersCount || 0) === 0) return false;
    if (activeTab === 'new' && (customer.ordersCount || 0) > 0) return false;
    if (selectedTier !== 'all' && !customer.tier?.toLowerCase().includes(selectedTier.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = customer.name?.toLowerCase().includes(q);
      const matchEmail = customer.email?.toLowerCase().includes(q);
      const matchPhone = customer.phone?.toLowerCase().includes(q);
      const matchArea = customer.area?.toLowerCase().includes(q);
      if (!matchName && !matchEmail && !matchPhone && !matchArea) return false;
    }
    return true;
  });

  return (
    <AdminLayout currentTab="customers" breadcrumb="Customer Base & CRM" onBack={onBack}>
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
              Customer Base & CRM
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#475569', fontWeight: 500 }}>
              Live PostgreSQL registered shoppers, aggregate purchase telemetry, and fit intelligence.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => { playClickSound(); showToast('Exporting customer registry to CSV...'); }}
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
              <span>Export Shopper List</span>
            </button>

            <button
              onClick={() => { playClickSound(); loadRealCustomers(); showToast('Customer analytics refreshed'); }}
              disabled={isLoadingCustomers}
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
                opacity: isLoadingCustomers ? 0.7 : 1
              }}
            >
              <RefreshCw size={16} color="#FFFFFF" className={isLoadingCustomers ? 'animate-spin' : ''} />
              <span>{isLoadingCustomers ? 'Syncing...' : 'Sync CRM Directory'}</span>
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
                Total Shoppers
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} color="#2563EB" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              {totalCustomers}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <ArrowUpRight size={15} />
              <span>Registered shopper profiles</span>
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
                Active Buyers
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingBag size={20} color="#16A34A" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              {frequentCustomers}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <span>{totalCustomers - frequentCustomers} registered profile accounts</span>
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
                Average Shopper Spend
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={20} color="#A855F7" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              ₹{avgSpend.toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <span>Total spend ₹{totalSpendAll.toLocaleString('en-IN')}</span>
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
                VIP Shoppers
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Heart size={20} color="#D97706" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              {customers.filter(c => c.tier?.includes('VIP')).length}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <ShieldCheck size={15} />
              <span>Loyalty & repeat members</span>
            </div>
          </div>
        </div>

        {/* Filter Navigation & Search Bar */}
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
            {[
              { id: 'all', label: 'All Customers', count: totalCustomers },
              { id: 'vip', label: 'VIP Shoppers', count: vipCustomers },
              { id: 'frequent', label: 'Frequent Buyers', count: frequentCustomers },
              { id: 'new', label: 'New Members', count: newCustomers }
            ].map(tab => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { playClickSound(); setActiveTab(tab.id); }}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: active ? 700 : 600,
                    backgroundColor: active ? '#0F172A' : '#F8FAFC',
                    color: active ? '#FFFFFF' : '#475569',
                    border: active ? '1px solid #0F172A' : '1px solid #E2E8F0',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '12px',
                    padding: '2px 7px',
                    borderRadius: '12px',
                    backgroundColor: active ? 'rgba(255,255,255,0.2)' : '#E2E8F0',
                    color: active ? '#FFFFFF' : '#334155'
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search & Tier Selector */}
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
                placeholder="Search Customer Name, Email, Phone..."
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
              value={selectedTier}
              onChange={e => setSelectedTier(e.target.value)}
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
              <option value="all">All VIP Tiers</option>
              <option value="vip">Indiranagar Club VIP</option>
              <option value="frequent">Frequent Buyer</option>
              <option value="standard">Standard Shopper</option>
            </select>
          </div>
        </div>

        {/* Customer Directory Table */}
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
                    Shopper Name & ID
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Contact & Cluster
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    VIP Loyalty Tier
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Size Locker Profile
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Lifetime Spend
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Try-On Keep Rate
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B', fontSize: '15px' }}>
                      {isLoadingCustomers ? 'Loading live customer profiles from database...' : 'No customers found matching search criteria.'}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map(customer => {
                    const isVip = customer.tier?.includes('VIP');
                    return (
                      <tr 
                        key={customer.id} 
                        style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Name & ID */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                            {customer.name}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                            {customer.id} · Member since {customer.memberSince}
                          </div>
                        </td>

                        {/* Contact */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                            {customer.phone}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {customer.area}
                          </div>
                        </td>

                        {/* VIP Tier */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            backgroundColor: isVip ? '#FEF3C7' : '#EFF6FF',
                            color: isVip ? '#92400E' : '#1E40AF'
                          }}>
                            {isVip && <Star size={12} fill="#92400E" color="#92400E" />}
                            {customer.tier}
                          </div>
                        </td>

                        {/* Size Locker */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 6px', borderRadius: '4px' }}>
                              Top: {customer.fittingProfile.top}
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 6px', borderRadius: '4px' }}>
                              Waist: {customer.fittingProfile.bottom}
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#F1F5F9', color: '#334155', padding: '2px 6px', borderRadius: '4px' }}>
                              Shoe: {customer.fittingProfile.shoe}
                            </span>
                          </div>
                        </td>

                        {/* Spend */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                            ₹{customer.totalSpend.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {customer.ordersCount} Total Orders
                          </div>
                        </td>

                        {/* Try-On Keep Rate */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#16A34A' }}>
                            {customer.tryOnKeepRate}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            Retention Score
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                          <button
                            onClick={() => { playClickSound(); setInspectCustomer(customer); }}
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
                            <span>CRM Profile</span>
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

        {/* Customer Profile & CRM Drawer */}
        {inspectCustomer && (
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
                    {inspectCustomer.name}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                    ID: {inspectCustomer.id} · {inspectCustomer.tier}
                  </div>
                </div>

                <button
                  onClick={() => setInspectCustomer(null)}
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
                
                {/* Contact Card */}
                <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Phone size={14} color="#64748B" />
                    <strong>{inspectCustomer.phone}</strong>
                  </div>
                  <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Mail size={14} color="#64748B" />
                    <span>{inspectCustomer.email}</span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                    <MapPin size={14} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
                    <span>{inspectCustomer.area}, {inspectCustomer.city}</span>
                  </div>
                </div>

                {/* Size Locker Profile */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    Verified Size Locker Profile
                  </h3>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '14px' }}>
                    <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>PREFERRED FIT / SIZE</div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginTop: '4px' }}>
                      {inspectCustomer.fittingProfile?.top || 'Standard Fit'}
                    </div>
                  </div>
                </div>

                {/* Lifetime Metrics */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    Customer Value & Engagement
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Total Spent</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#0F172A', marginTop: '4px' }}>
                        ₹{inspectCustomer.totalSpend.toLocaleString('en-IN')}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        {inspectCustomer.ordersCount} Completed Orders
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                      <div style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>Try-On Retention</div>
                      <div style={{ fontSize: '22px', fontWeight: 800, color: '#16A34A', marginTop: '4px' }}>
                        {inspectCustomer.tryOnKeepRate}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                        Doorstep Trial Keep Score
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    Recent Order
                  </h3>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#0F172A' }}>
                      {inspectCustomer.lastOrder}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                      Preferred Boutique: {inspectCustomer.favoriteCategory}
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
                  onClick={() => { playClickSound(); showToast(`₹500 VIP Courtesy Voucher granted to ${inspectCustomer.name}!`); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#0F172A',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Gift size={16} />
                  <span>Send Voucher</span>
                </button>

                <button
                  onClick={() => { playClickSound(); showToast(`Opening support channel with ${inspectCustomer.name}...`); }}
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
                  Direct CRM Message
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
