import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowUpRight, ChevronDown, RefreshCw, TrendingUp, Percent, 
  PackageCheck, Store, Clock, Activity, FileSpreadsheet, Layers, ShieldCheck, MapPin
} from 'lucide-react';
import { playClickSound } from '../../utils/audioEffects';
import AdminLayout from '../../components/nivvo/AdminLayout';

export default function NivvoAdminOverviewView({ onBack, onNavigateSellers }) {
  const { showToast, navigateTo } = useNivvo();
  const [selectedZone, setSelectedZone] = useState('All 12 Zones');
  const [timeRange, setTimeRange] = useState('Today (Real-time)');
  const [isLoading, setIsLoading] = useState(false);

  const [metrics, setMetrics] = useState({
    totalGmv: 0,
    commissionNet: 0,
    totalOrders: 0,
    activeShops: 0,
    totalShops: 0,
    onlineRiders: 0,
    totalRiders: 0,
    liveOrders: 0
  });

  const [bars, setBars] = useState([]);
  const [zones, setZones] = useState([]);

  const loadRealOverview = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/admin/overview');
      if (res.ok) {
        const data = await res.json();
        if (data.metrics) setMetrics(data.metrics);
        if (Array.isArray(data.bars) && data.bars.length > 0) setBars(data.bars);
        if (Array.isArray(data.zones) && data.zones.length > 0) setZones(data.zones);
      }
    } catch (err) {
      console.error('Failed to load admin overview:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRealOverview();
  }, []);

  return (
    <AdminLayout currentTab="overview" breadcrumb="Operations Overview" onBack={onBack}>
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
              margin: '0 0 6px 0',
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#0F172A'
            }}>
              Operations Overview
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#475569', fontWeight: 500 }}>
              Live marketplace health across retail merchants, customer orders, and dispatch fleet.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => {
                playClickSound();
                loadRealOverview();
                showToast('Refreshed real-time marketplace metrics');
              }}
              disabled={isLoading}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#334155',
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
                opacity: isLoading ? 0.7 : 1
              }}
            >
              <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
              <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                showToast('Generating official marketplace PDF audit report...');
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 18px',
                backgroundColor: '#0F172A',
                border: '1px solid #0F172A',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#FFFFFF',
                cursor: 'pointer',
                boxShadow: '0 2px 4px rgba(15,23,42,0.1)'
              }}
            >
              <FileSpreadsheet size={16} />
              <span>Export Audit Report</span>
            </button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '14px',
          padding: '12px 20px',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#0F172A',
              color: '#FFFFFF',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <MapPin size={16} color="#A3E635" />
              <span>Bengaluru Metro</span>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F8FAFC',
              color: '#0F172A',
              border: '1px solid #CBD5E1',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <Layers size={16} color="#64748B" />
              <span>{selectedZone}</span>
              <ChevronDown size={15} color="#64748B" />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: '#F8FAFC',
              color: '#0F172A',
              border: '1px solid #CBD5E1',
              padding: '8px 16px',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <Clock size={16} color="#64748B" />
              <span>{timeRange}</span>
              <ChevronDown size={15} color="#64748B" />
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#0F172A',
            fontWeight: 600,
            backgroundColor: '#DCFCE7',
            padding: '6px 14px',
            borderRadius: '20px'
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
            <span>Live Telemetry Connected</span>
          </div>
        </div>

        {/* Top 4 KPI Executive Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px'
        }}>
          {/* Metric 1: GMV */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Gross Merchandise Value</span>
              <span style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>GMV</span>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: '10px' }}>
              ₹{metrics.totalGmv.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '14px', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <TrendingUp size={16} />
              <span>Real-time settled sales in Neon DB</span>
            </div>
          </div>

          {/* Metric 2: Net Commission (10%) */}
          <div style={{
            backgroundColor: '#F0FDF4',
            border: '1.5px solid #BBF7D0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#166534' }}>Platform Commission (10%)</span>
              <span style={{ backgroundColor: '#DCFCE7', color: '#15803D', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>Automated</span>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#15803D', letterSpacing: '-0.03em', marginBottom: '10px' }}>
              ₹{metrics.commissionNet.toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '14px', color: '#166534', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Percent size={16} />
              <span>Real 10% take-rate on fulfilled orders</span>
            </div>
          </div>

          {/* Metric 3: Orders */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Fulfillment Volume</span>
              <span style={{ backgroundColor: '#F1F5F9', color: '#0F172A', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 700 }}>Orders</span>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: '10px' }}>
              {metrics.totalOrders}
            </div>
            <div style={{ fontSize: '14px', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <PackageCheck size={16} />
              <span>{metrics.liveOrders} active orders in transit</span>
            </div>
          </div>

          {/* Metric 4: Merchant Network */}
          <div 
            onClick={() => {
              playClickSound();
              if (onNavigateSellers) onNavigateSellers();
              else navigateTo('admin-sellers');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#64748B' }}>Active Merchant Network</span>
              <ArrowUpRight size={18} color="#0F172A" />
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', marginBottom: '10px' }}>
              {metrics.activeShops} / {metrics.totalShops}
            </div>
            <div style={{ fontSize: '14px', color: '#16A34A', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Store size={16} />
              <span>Verified local merchant storefronts</span>
            </div>
          </div>
        </div>

        {/* Main Content Grid: Order Demand Hourly Chart + Capacity Status */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '20px'
        }}>
          {/* Left: Hourly Demand Chart */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                  Hourly Order Volume
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#475569',
                  backgroundColor: '#F1F5F9',
                  padding: '6px 12px',
                  borderRadius: '6px'
                }}>
                  <span>Today's Cadence</span>
                  <ChevronDown size={14} />
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#64748B', display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span>Real-time dispatch distribution</span>
                {bars.some(b => b.isPeak) && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#0F172A', fontWeight: 600 }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16A34A' }} />
                    Peak: {bars.find(b => b.isPeak)?.time} ({bars.find(b => b.isPeak)?.orders} Orders)
                  </span>
                )}
              </div>
            </div>

            {/* Clean, Large Bar Chart Graphics */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '16px',
              height: '240px',
              paddingTop: '32px',
              borderBottom: '1px solid #E2E8F0'
            }}>
              {bars.length === 0 ? (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                  {isLoading ? 'Loading order distribution from database...' : 'No hourly order distribution recorded yet'}
                </div>
              ) : (
                bars.map((b) => (
                  <div key={b.time} style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    height: '100%',
                    justifyContent: 'flex-end'
                  }}>
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 700,
                      color: b.isPeak ? '#16A34A' : '#0F172A',
                      marginBottom: '8px'
                    }}>
                      {b.orders}
                    </span>
                    <div style={{
                      width: '100%',
                      maxWidth: '64px',
                      height: b.height,
                      backgroundColor: b.color,
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.4s ease'
                    }} />
                    <span style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#64748B',
                      marginTop: '10px'
                    }}>
                      {b.time}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Fleet Capacity Panel */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                  Fleet Logistics Capacity
                </h3>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#16A34A',
                  backgroundColor: '#DCFCE7',
                  padding: '4px 10px',
                  borderRadius: '20px'
                }}>
                  Active Dispatch
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
                  <span style={{ color: '#64748B', fontWeight: 500 }}>Active Fleet Status</span>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '16px' }}>{metrics.onlineRiders} / {metrics.totalRiders} Couriers Online</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
                  <span style={{ color: '#64748B', fontWeight: 500 }}>Live Active Orders</span>
                  <span style={{ fontWeight: 800, color: '#2563EB', fontSize: '16px' }}>{metrics.liveOrders} In Transit</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
                  <span style={{ color: '#64748B', fontWeight: 500 }}>Average Delivery SLA</span>
                  <span style={{ fontWeight: 800, color: '#16A34A', fontSize: '16px' }}>8–10 Minutes</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
                  <span style={{ color: '#64748B', fontWeight: 500 }}>Catalog Stock Accuracy</span>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '16px' }}>99.2%</span>
                </div>
              </div>

              <div style={{
                backgroundColor: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '14px',
                fontSize: '13px',
                color: '#475569',
                lineHeight: 1.5
              }}>
                10-Minute guaranteed delivery routes are active across Indiranagar, HSR Layout, and Jayanagar.
              </div>
            </div>

            <div style={{
              backgroundColor: '#FEF3C7',
              border: '1px solid #FCD34D',
              color: '#92400E',
              fontSize: '13px',
              fontWeight: 700,
              padding: '10px 16px',
              borderRadius: '8px',
              textAlign: 'center',
              marginTop: '16px'
            }}>
              Koramangala Hub: Capacity Monitoring Active
            </div>
          </div>
        </div>

        {/* Neighbourhood Logistics Hub Performance Table */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: '16px',
          padding: '28px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700, color: '#0F172A' }}>
                Logistics Cluster Performance
              </h3>
              <p style={{ margin: 0, fontSize: '14px', color: '#64748B' }}>
                Real-time delivery fulfillment and merchant throughput by micro-hub.
              </p>
            </div>

            <button
              onClick={() => {
                playClickSound();
                if (onNavigateSellers) onNavigateSellers();
                else navigateTo('admin-sellers');
              }}
              style={{
                background: '#F1F5F9',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                color: '#0F172A',
                fontWeight: 600,
                fontSize: '14px',
                padding: '8px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer'
              }}
            >
              <span>Manage Merchants</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E2E8F0', color: '#475569', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#F8FAFC' }}>
                  <th style={{ padding: '14px 18px' }}>Logistics Hub</th>
                  <th style={{ padding: '14px 18px' }}>Orders Today</th>
                  <th style={{ padding: '14px 18px' }}>Gross GMV</th>
                  <th style={{ padding: '14px 18px' }}>Fulfillment ETA</th>
                  <th style={{ padding: '14px 18px' }}>SLA Adherence</th>
                  <th style={{ padding: '14px 18px' }}>Dispatch Status</th>
                </tr>
              </thead>
              <tbody>
                {zones.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ padding: '36px 18px', textAlign: 'center', color: '#64748B' }}>
                      {isLoading ? 'Loading logistics hub telemetry from database...' : 'No active hubs recorded.'}
                    </td>
                  </tr>
                ) : (
                  zones.map((z, idx) => (
                  <tr key={z.name} style={{
                    borderBottom: idx === zones.length - 1 ? 'none' : '1px solid #F1F5F9',
                    backgroundColor: '#FFFFFF',
                    transition: 'background-color 0.15s ease'
                  }}>
                    <td style={{ padding: '18px', fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>
                      {z.name}
                    </td>
                    <td style={{ padding: '18px', color: '#0F172A', fontWeight: 600 }}>
                      {z.orders} Orders
                    </td>
                    <td style={{ padding: '18px', color: '#0F172A', fontWeight: 700 }}>
                      {z.gmv}
                    </td>
                    <td style={{ padding: '18px', color: '#475569' }}>
                      {z.eta}
                    </td>
                    <td style={{ padding: '18px', color: '#16A34A', fontWeight: 700 }}>
                      {z.ontime}
                    </td>
                    <td style={{ padding: '18px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        fontSize: '13px',
                        fontWeight: 600,
                        backgroundColor: z.status === 'optimal' ? '#DCFCE7' : '#FEF3C7',
                        color: z.status === 'optimal' ? '#166534' : '#92400E'
                      }}>
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: z.status === 'optimal' ? '#16A34A' : '#D97706'
                        }} />
                        {z.capacity}
                      </span>
                    </td>
                  </tr>
                ))
              )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
