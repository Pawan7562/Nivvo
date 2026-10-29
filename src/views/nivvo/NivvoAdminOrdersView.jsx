import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Package, Search, Filter, ArrowUpRight, Clock, MapPin, 
  Store, Bike, ChevronRight, User, CheckCircle2, AlertCircle, 
  X, RefreshCw, Download, SlidersHorizontal, ShieldCheck, Phone
} from 'lucide-react';
import { playClickSound } from '../../utils/audioEffects';
import AdminLayout from '../../components/nivvo/AdminLayout';

export default function NivvoAdminOrdersView({ onBack }) {
  const { showToast, navigateTo } = useNivvo();
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'live' | 'tryon' | 'delivered' | 'returns'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedHub, setSelectedHub] = useState('all');
  const [inspectOrder, setInspectOrder] = useState(null);

  // Live Operations Orders Dataset
  const initialOrders = [
    {
      id: 'NV-8921',
      time: '14:32 (8m ago)',
      customer: { name: 'Aarav Shah', phone: '+91 98765 43210', address: 'A-302, Maple Court, 12th Main Road, Indiranagar' },
      store: { name: 'Sole Street Indiranagar', category: 'Sneakers & Streetwear' },
      hub: 'Indiranagar Flagship',
      rider: { name: 'Kiran Murthy', phone: '+91 99008 12345', vehicle: 'EV Ather 450X · KA-04-EV-2104' },
      items: [
        { name: 'Air Jordan 1 Retro High OG', size: 'UK 9', color: 'Chicago White/Red', qty: 1, price: 16999, isTryOn: true },
        { name: 'Air Jordan 1 Retro High OG', size: 'UK 8.5', color: 'Chicago White/Red', qty: 1, price: 16999, isTryOn: true, tryOnOption: true }
      ],
      amount: 16999,
      paymentMode: 'Prepaid UPI',
      stage: 'in_transit', // 'dispatching' | 'in_transit' | 'tryon' | 'delivered' | 'returned'
      statusLabel: 'In Transit',
      slaCountdown: '3m 18s left',
      slaOnTime: true
    },
    {
      id: 'NV-8920',
      time: '14:26 (14m ago)',
      customer: { name: 'Meera Nambiar', phone: '+91 98450 11234', address: 'Villa 14, Palm Grove, 100ft Road, Indiranagar' },
      store: { name: 'Elegance Couture', category: 'Designer Kurtis & Silks' },
      hub: 'Indiranagar Flagship',
      rider: { name: 'Arjun Gowda', phone: '+91 98451 99001', vehicle: 'Ola S1 Pro · KA-03-JJ-9901' },
      items: [
        { name: 'Mulberry Silk Anarkali Suit', size: 'M', color: 'Emerald Green', qty: 1, price: 4899, isTryOn: false }
      ],
      amount: 4899,
      paymentMode: 'Credit Card',
      stage: 'tryon',
      statusLabel: 'Doorstep Try-On Active',
      slaCountdown: 'Rider at Doorstep (6m left)',
      slaOnTime: true
    },
    {
      id: 'NV-8919',
      time: '14:21 (19m ago)',
      customer: { name: 'Rohit Varma', phone: '+91 97410 55678', address: '4th Floor, Tech Hive, 80 Feet Road, Koramangala' },
      store: { name: 'Apex Electronics', category: 'Audio & Wearables' },
      hub: 'Koramangala Hyper-Pod',
      rider: { name: 'Siddharth Rao', phone: '+91 98860 33421', vehicle: 'TVS iQube · KA-01-EE-4402' },
      items: [
        { name: 'Sony WH-1000XM5 Headphones', size: 'Universal', color: 'Silver', qty: 1, price: 29990, isTryOn: false }
      ],
      amount: 29990,
      paymentMode: 'Net Banking',
      stage: 'delivered',
      statusLabel: 'Delivered in 7m 40s',
      slaCountdown: 'Completed on-time',
      slaOnTime: true
    },
    {
      id: 'NV-8918',
      time: '14:15 (25m ago)',
      customer: { name: 'Pooja Hegde', phone: '+91 99801 88923', address: 'Flat 502, Prestige Enclave, 27th Main, HSR Layout' },
      store: { name: 'Urban Chic Studio', category: 'Western Apparel' },
      hub: 'HSR Layout Micro-Hub',
      rider: { name: 'Manoj Kumar', phone: '+91 99450 77123', vehicle: 'Honda Activa 6G · KA-05-MK-1120' },
      items: [
        { name: 'Oversized Linen Blazer', size: 'S', color: 'Beige Sand', qty: 1, price: 3499, isTryOn: true },
        { name: 'Oversized Linen Blazer', size: 'M', color: 'Beige Sand', qty: 1, price: 3499, isTryOn: true, tryOnOption: true }
      ],
      amount: 3499,
      paymentMode: 'Prepaid UPI',
      stage: 'delivered',
      statusLabel: 'Delivered (Size S Kept)',
      slaCountdown: 'Completed on-time',
      slaOnTime: true
    },
    {
      id: 'NV-8917',
      time: '14:02 (38m ago)',
      customer: { name: 'Kavita Menon', phone: '+91 98440 22910', address: '18th Cross, 3rd Block, Jayanagar' },
      store: { name: 'Meenakshi Silks', category: 'Ethnic Wear' },
      hub: 'Indiranagar Flagship',
      rider: { name: 'Pradeep Gowda', phone: '+91 97400 99812', vehicle: 'Bajaj Chetak EV · KA-04-EV-9021' },
      items: [
        { name: 'Kanjivaram Silk Saree', size: 'Free Size', color: 'Crimson Gold', qty: 1, price: 12450, isTryOn: false }
      ],
      amount: 12450,
      paymentMode: 'Prepaid UPI',
      stage: 'returns',
      statusLabel: 'Doorstep Returned to Store',
      slaCountdown: 'Restocked at Boutique',
      slaOnTime: true
    },
    {
      id: 'NV-8922',
      time: 'Just now (1m ago)',
      customer: { name: 'Vikram Joshi', phone: '+91 98800 66211', address: 'Plot 77, Defense Colony, Indiranagar' },
      store: { name: 'Sole Street Indiranagar', category: 'Sneakers & Streetwear' },
      hub: 'Indiranagar Flagship',
      rider: { name: 'Rajesh N', phone: '+91 99010 44231', vehicle: 'Ather 450S · KA-03-EV-8812' },
      items: [
        { name: 'Nike Dunk Low Retro', size: 'UK 10', color: 'Panda Black/White', qty: 1, price: 9695, isTryOn: true }
      ],
      amount: 9695,
      paymentMode: 'Prepaid UPI',
      stage: 'dispatching',
      statusLabel: 'Dispatching from Store',
      slaCountdown: '9m 10s left',
      slaOnTime: true
    }
  ];

  const filteredOrders = initialOrders.filter(order => {
    if (activeTab === 'live' && !['dispatching', 'in_transit', 'tryon'].includes(order.stage)) return false;
    if (activeTab === 'tryon' && order.stage !== 'tryon') return false;
    if (activeTab === 'delivered' && order.stage !== 'delivered') return false;
    if (activeTab === 'returns' && order.stage !== 'returns') return false;
    if (selectedHub !== 'all' && !order.hub.toLowerCase().includes(selectedHub.toLowerCase())) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = order.id.toLowerCase().includes(q);
      const matchCustomer = order.customer.name.toLowerCase().includes(q);
      const matchStore = order.store.name.toLowerCase().includes(q);
      const matchRider = order.rider.name.toLowerCase().includes(q);
      if (!matchId && !matchCustomer && !matchStore && !matchRider) return false;
    }
    return true;
  });

  return (
    <AdminLayout currentTab="orders" breadcrumb="Orders & Live Dispatch" onBack={onBack}>
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
              Orders & Live Dispatch
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#475569', fontWeight: 500 }}>
              Real-time dispatch telemetry, 10-minute delivery SLA monitoring, and doorstep trial fulfillment.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => { playClickSound(); showToast('Exporting active dispatch manifest to CSV...'); }}
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
              <span>Export Manifest</span>
            </button>

            <button
              onClick={() => { playClickSound(); showToast('Dispatch telemetry refreshed'); }}
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
                boxShadow: '0 2px 4px rgba(15,23,42,0.15)'
              }}
            >
              <RefreshCw size={16} color="#FFFFFF" />
              <span>Refresh SLA Radar</span>
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
                Today's Orders
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Package size={20} color="#0F172A" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              1,248
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <ArrowUpRight size={15} />
              <span>+14.2% vs yesterday</span>
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
                Active in Flight
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Bike size={20} color="#2563EB" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              42
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563EB', fontWeight: 600 }}>
              <Clock size={15} />
              <span>18 In Transit · 24 Doorstep Trials</span>
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
                Average Delivery Speed
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#16A34A" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              8.2 min
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <ShieldCheck size={15} />
              <span>98.9% 10-Minute SLA Adherence</span>
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
                Average Basket Value
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Store size={20} color="#A855F7" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              ₹2,840
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#475569', fontWeight: 600 }}>
              <span>2.4 multi-size trial items / basket</span>
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
              { id: 'all', label: 'All Orders', count: 1248 },
              { id: 'live', label: 'Live Dispatch', count: 42 },
              { id: 'tryon', label: 'Doorstep Try-On', count: 24 },
              { id: 'delivered', label: 'Delivered', count: 1167 },
              { id: 'returns', label: 'Returns', count: 15 }
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
                    gap: '8px',
                    transition: 'all 0.15s ease'
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
                placeholder="Search Order ID, Customer, Store..."
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
              value={selectedHub}
              onChange={e => setSelectedHub(e.target.value)}
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
              <option value="all">All Logistics Hubs</option>
              <option value="indiranagar">Indiranagar Flagship</option>
              <option value="koramangala">Koramangala Hyper-Pod</option>
              <option value="hsr">HSR Layout Micro-Hub</option>
            </select>
          </div>
        </div>

        {/* Orders Table Container */}
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
                    Order ID & Time
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Customer & Destination
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Merchant Boutique
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Assigned Courier
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    SLA & Stage
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Amount
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B', fontSize: '15px' }}>
                      No orders found matching the filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map(order => {
                    const isLive = ['dispatching', 'in_transit', 'tryon'].includes(order.stage);
                    return (
                      <tr 
                        key={order.id} 
                        style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {/* Order ID */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
                              #{order.id}
                            </span>
                            {order.items.some(i => i.isTryOn) && (
                              <span style={{
                                fontSize: '11px',
                                fontWeight: 700,
                                backgroundColor: '#FEF3C7',
                                color: '#92400E',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>
                                Try-On
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                            {order.time}
                          </div>
                        </td>

                        {/* Customer */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '15px', fontWeight: 600, color: '#0F172A' }}>
                            {order.customer.name}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {order.customer.address}
                          </div>
                        </td>

                        {/* Store */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                            {order.store.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {order.hub}
                          </div>
                        </td>

                        {/* Rider */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Bike size={15} color="#2563EB" />
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#0F172A' }}>
                              {order.rider.name}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {order.rider.vehicle}
                          </div>
                        </td>

                        {/* SLA Stage */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            borderRadius: '6px',
                            fontSize: '12px',
                            fontWeight: 700,
                            backgroundColor: isLive ? '#ECFDF5' : order.stage === 'returns' ? '#FEF2F2' : '#F1F5F9',
                            color: isLive ? '#065F46' : order.stage === 'returns' ? '#991B1B' : '#334155'
                          }}>
                            {isLive && <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10B981' }} />}
                            {order.statusLabel}
                          </div>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: isLive ? '#2563EB' : '#64748B', marginTop: '4px' }}>
                            {order.slaCountdown}
                          </div>
                        </td>

                        {/* Amount */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                            ₹{order.amount.toLocaleString('en-IN')}
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                            {order.paymentMode}
                          </div>
                        </td>

                        {/* Actions */}
                        <td style={{ padding: '18px 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                          <button
                            onClick={() => { playClickSound(); setInspectOrder(order); }}
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
                            <span>Inspect</span>
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

        {/* Order Inspector Modal / Drawer */}
        {inspectOrder && (
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
              maxWidth: '560px',
              backgroundColor: '#FFFFFF',
              height: '100vh',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '-4px 0 24px rgba(0,0,0,0.15)'
            }}>
              {/* Drawer Header */}
              <div style={{
                padding: '24px',
                borderBottom: '1px solid #E2E8F0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#F8FAFC'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '20px', fontWeight: 800, color: '#0F172A' }}>
                      Order #{inspectOrder.id}
                    </span>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      backgroundColor: '#EFF6FF',
                      color: '#1D4ED8',
                      padding: '3px 8px',
                      borderRadius: '6px'
                    }}>
                      {inspectOrder.statusLabel}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '4px' }}>
                    Placed {inspectOrder.time} · {inspectOrder.hub}
                  </div>
                </div>

                <button
                  onClick={() => setInspectOrder(null)}
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

              {/* Drawer Content */}
              <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px', flex: 1 }}>
                
                {/* SLA Radar Status Card */}
                <div style={{
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #DCFCE7',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={22} color="#16A34A" />
                  </div>
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#166534' }}>
                      10-Minute Ultra-Fast SLA Active
                    </div>
                    <div style={{ fontSize: '13px', color: '#15803D', marginTop: '2px' }}>
                      {inspectOrder.slaCountdown}
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    Customer Contact & Address
                  </h3>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
                      {inspectOrder.customer.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#334155', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                      <Phone size={14} color="#64748B" />
                      <span>{inspectOrder.customer.phone}</span>
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', display: 'flex', alignItems: 'flex-start', gap: '6px', lineHeight: 1.4 }}>
                      <MapPin size={14} color="#64748B" style={{ flexShrink: 0, marginTop: '2px' }} />
                      <span>{inspectOrder.customer.address}</span>
                    </div>
                  </div>
                </div>

                {/* Items in Basket */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    Order Items ({inspectOrder.items.length})
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {inspectOrder.items.map((item, idx) => (
                      <div key={idx} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '14px 16px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        borderRadius: '10px'
                      }}>
                        <div>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                            {item.name}
                          </div>
                          <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                            Size: {item.size} · Color: {item.color} · Qty: {item.qty}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                            ₹{item.price.toLocaleString('en-IN')}
                          </div>
                          {item.tryOnOption && (
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#B45309' }}>
                              Alternate Fit
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned Courier */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    Assigned Delivery Courier
                  </h3>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                        {inspectOrder.rider.name}
                      </div>
                      <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                        {inspectOrder.rider.vehicle} · {inspectOrder.rider.phone}
                      </div>
                    </div>
                    <button
                      onClick={() => { playClickSound(); showToast(`Calling courier ${inspectOrder.rider.name}...`); }}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '8px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0F172A',
                        cursor: 'pointer'
                      }}
                    >
                      Call Courier
                    </button>
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
                  onClick={() => { playClickSound(); showToast(`Courier reassigned for Order #${inspectOrder.id}`); setInspectOrder(null); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #CBD5E1',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#334155',
                    cursor: 'pointer'
                  }}
                >
                  Reassign Courier
                </button>
                <button
                  onClick={() => { playClickSound(); showToast(`Order #${inspectOrder.id} marked as priority`); setInspectOrder(null); }}
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
                  Prioritize Dispatch
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
