import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { ArrowUpRight, ChevronDown, RefreshCw } from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';
import AdminLayout from '../../components/nivvo/AdminLayout';

export default function NivvoAdminOverviewView({ onBack, onNavigateSellers }) {
  const { showToast, navigateTo } = useNivvo();
  const [selectedZone, setSelectedZone] = useState('All 12 zones');

  const bars = [
    { time: '08:00', orders: 90, height: '32%', color: '#254530' },
    { time: '09:00', orders: 130, height: '46%', color: '#254530' },
    { time: '10:00', orders: 128, height: '45%', color: '#254530' },
    { time: '11:00', orders: 190, height: '66%', color: '#254530' },
    { time: '12:00', orders: 165, height: '58%', color: '#254530' },
    { time: '13:00', orders: 260, height: '91%', color: '#254530' },
    { time: '14:00', orders: 285, height: '100%', color: '#B8F135' }
  ];

  const zones = [
    { name: 'Indiranagar', orders: 284, gmv: '₹2.12L', eta: '12–30 min', ontime: '97.8%', capacity: 'Healthy · 18 free', isWatch: false },
    { name: 'Koramangala', orders: 312, gmv: '₹2.46L', eta: '25–40 min', ontime: '93.4%', capacity: 'Watch · 4 free', isWatch: true },
    { name: 'HSR Layout', orders: 198, gmv: '₹1.24L', eta: '18–30 min', ontime: '96.5%', capacity: 'Healthy · 14 free', isWatch: false },
    { name: 'Jayanagar', orders: 166, gmv: '₹0.98L', eta: '20–35 min', ontime: '96.9%', capacity: 'Healthy · 11 free', isWatch: false }
  ];

  return (
    <AdminLayout currentTab="overview" breadcrumb="Overview" onBack={onBack}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
        
        {/* Title & Actions Row matching Figma */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 4px 0',
              fontSize: '30px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              color: '#14281C'
            }}>
              Marketplace at a glance
            </h1>
            <p style={{ margin: 0, fontSize: '13px', color: '#73796F' }}>
              Bengaluru · Live health across local shops, customers and delivery partners.
            </p>
          </div>

          <button
            onClick={() => {
              playClickSound();
              showToast('Generating comprehensive marketplace PDF report...');
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E5DC',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#14281C',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
            }}
          >
            <span>Export report</span>
            <ArrowUpRight size={14} />
          </button>
        </div>

        {/* Filter Pills Row matching Figma */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#1E3827',
              color: '#FFFFFF',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <span>Bengaluru</span>
              <ChevronDown size={14} />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              color: '#14281C',
              border: '1px solid #E5E7DE',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <span>All 12 zones</span>
              <ChevronDown size={14} color="#73796F" />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#FFFFFF',
              color: '#14281C',
              border: '1px solid #E5E7DE',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}>
              <span>Today, 25 Oct</span>
              <ChevronDown size={14} color="#73796F" />
            </div>
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            color: '#14281C',
            fontWeight: 500
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1E3827' }} />
            <span>Live · 2:46 pm IST</span>
          </div>
        </div>

        {/* Top KPI Cards matching Figma with Company 10% Commission Tracking */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '16px'
        }}>
          {/* Metric 1 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '12px', color: '#73796F', marginBottom: '8px' }}>
              Gross merchandise value
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#14281C', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              ₹8.42L
            </div>
            <div style={{ fontSize: '12px', color: '#1C7532', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>↗ 14.2% vs last Sunday</span>
            </div>
          </div>

          {/* Metric 2: Company 10% Commission Revenue */}
          <div style={{
            backgroundColor: '#F5FAF3',
            border: '1.5px solid #C8DEC3',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '12px', color: '#24452D', fontWeight: 700, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Company 10% Commission</span>
              <span style={{ backgroundColor: '#24452D', color: '#B7F34A', fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>Automated</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#166534', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              ₹84,200
            </div>
            <div style={{ fontSize: '12px', color: '#166534', fontWeight: 600 }}>
              ₹10 per ₹100 product value earned on customer orders
            </div>
          </div>

          {/* Metric 3 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '12px', color: '#73796F', marginBottom: '8px' }}>
              Orders placed
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#14281C', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              1,248
            </div>
            <div style={{ fontSize: '12px', color: '#1C7532', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>Free delivery on orders ₹200+</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div 
            onClick={() => {
              playClickSound();
              if (onNavigateSellers) onNavigateSellers();
              else navigateTo('admin-sellers');
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECEEE7',
              borderRadius: '14px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
              cursor: 'pointer'
            }}
          >
            <div style={{ fontSize: '12px', color: '#73796F', marginBottom: '8px' }}>
              Live sellers / approved
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#14281C', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              186 / 214
            </div>
            <div style={{ fontSize: '12px', color: '#1C7532', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>↑ 8 sellers onboarded this week</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '14px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ fontSize: '12px', color: '#73796F', marginBottom: '8px' }}>
              Within quoted window
            </div>
            <div style={{ fontSize: '28px', fontWeight: 600, color: '#14281C', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              96.2%
            </div>
            <div style={{ fontSize: '12px', color: '#1C7532', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>↗ 1.4 percentage points</span>
            </div>
          </div>
        </div>

        {/* Two Column Grid: Order Demand Bar Chart + Delivery Capacity */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
          gap: '16px'
        }}>
          {/* Left: Order Demand Hourly Chart */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#14281C' }}>
                  Order demand
                </h3>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 600,
                  color: '#14281C',
                  cursor: 'pointer'
                }}>
                  <span>Hourly</span>
                  <ChevronDown size={14} />
                  <ArrowUpRight size={13} style={{ marginLeft: '2px' }} />
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#73796F' }}>
                <span>All orders · Today</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#14281C' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#1E3827' }} />
                  Orders per hour
                </span>
              </div>
            </div>

            {/* Bar Chart Graphics matching Figma */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '12px',
              height: '180px',
              paddingTop: '28px',
              borderBottom: '1px solid #F0F2ED'
            }}>
              {bars.map((b) => (
                <div key={b.time} style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    color: '#14281C',
                    marginBottom: '6px'
                  }}>
                    {b.orders}
                  </span>
                  <div style={{
                    width: '100%',
                    maxWidth: '56px',
                    height: b.height,
                    backgroundColor: b.color,
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.4s ease'
                  }} />
                  <span style={{
                    fontSize: '11px',
                    color: '#73796F',
                    marginTop: '8px'
                  }}>
                    {b.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Delivery Capacity Breakdown matching Figma */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '16px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#14281C' }}>
                  Delivery capacity
                </h3>
                <span style={{ fontSize: '12px', fontWeight: 600, color: '#14281C', cursor: 'pointer' }}>
                  Live ↗
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: '#73796F' }}>Available riders</span>
                  <span style={{ fontWeight: 600, color: '#14281C' }}>84</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: '#73796F' }}>On active jobs</span>
                  <span style={{ fontWeight: 600, color: '#14281C' }}>168</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: '#73796F' }}>Median delivery time</span>
                  <span style={{ fontWeight: 600, color: '#14281C' }}>24 min</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px' }}>
                  <span style={{ color: '#73796F' }}>Stock accuracy</span>
                  <span style={{ fontWeight: 600, color: '#14281C' }}>98.6%</span>
                </div>
              </div>

              <div style={{
                borderTop: '1px solid #F0F2ED',
                paddingTop: '14px',
                fontSize: '11px',
                color: '#73796F',
                lineHeight: '1.4',
                marginBottom: '14px'
              }}>
                ~10 min enabled only on eligible routes with confirmed stock and spare capacity.
              </div>
            </div>

            <div style={{
              backgroundColor: '#F6F4DC',
              color: '#736814',
              fontSize: '11px',
              fontWeight: 600,
              padding: '6px 12px',
              borderRadius: '999px',
              textAlign: 'center'
            }}>
              Koramangala · Capacity watch
            </div>
          </div>
        </div>

        {/* Neighbourhood Performance Table matching Figma 1:1 */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #ECEEE7',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#14281C' }}>
              Neighbourhood performance
            </h3>
            <button
              onClick={() => {
                playClickSound();
                if (onNavigateSellers) onNavigateSellers();
                else navigateTo('admin-sellers');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#14281C',
                fontWeight: 600,
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}
            >
              <span>View operations</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ECEEE7', color: '#73796F', fontSize: '12px', fontWeight: 500, backgroundColor: '#FAFBF8' }}>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Zone</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Orders</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>GMV</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Quoted ETA</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>On-time</th>
                  <th style={{ padding: '12px 16px', fontWeight: 500 }}>Capacity</th>
                </tr>
              </thead>
              <tbody>
                {zones.map((z, idx) => (
                  <tr key={z.name} style={{
                    borderBottom: idx === zones.length - 1 ? 'none' : '1px solid #F0F2ED',
                    backgroundColor: '#FFFFFF'
                  }}>
                    <td style={{ padding: '16px', fontWeight: 600, color: '#14281C' }}>
                      {z.name}
                    </td>
                    <td style={{ padding: '16px', color: '#14281C' }}>
                      {z.orders}
                    </td>
                    <td style={{ padding: '16px', color: '#14281C' }}>
                      {z.gmv}
                    </td>
                    <td style={{ padding: '16px', color: '#73796F' }}>
                      {z.eta}
                    </td>
                    <td style={{ padding: '16px', color: '#14281C' }}>
                      {z.ontime}
                    </td>
                    <td style={{ padding: '16px', color: z.isWatch ? '#736814' : '#14281C' }}>
                      {z.capacity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Meta Note */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#73796F',
          padding: '0 4px',
          marginTop: '4px'
        }}>
          <span>Live estimates reflect stock, preparation and rider capacity.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => showToast('Refreshed cluster metrics')}>
            Last synced 14:46 IST <RefreshCw size={11} />
          </span>
        </div>

      </div>
    </AdminLayout>
  );
}
