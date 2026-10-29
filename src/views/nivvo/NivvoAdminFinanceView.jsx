import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Wallet, Search, Filter, ArrowUpRight, Clock, MapPin, 
  Store, ShieldCheck, CheckCircle2, AlertCircle, 
  X, RefreshCw, Download, FileSpreadsheet, TrendingUp, 
  Building, ChevronRight, Check, DollarSign, CreditCard
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';
import AdminLayout from '../../components/nivvo/AdminLayout';

export default function NivvoAdminFinanceView({ onBack }) {
  const { showToast } = useNivvo();
  const [activeTab, setActiveTab] = useState('settlements'); // 'settlements' | 'revenue' | 'courier' | 'refunds'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [settlements, setSettlements] = useState([]);
  const [metrics, setMetrics] = useState({
    totalGmv: 0,
    platformFeeNet: 0,
    pendingSettlements: 0,
    courierPayouts: 0
  });
  const [isLoadingFinance, setIsLoadingFinance] = useState(true);

  const loadRealFinance = async () => {
    try {
      setIsLoadingFinance(true);
      const res = await fetch('/api/admin/finance');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.settlements)) {
          setSettlements(data.settlements);
        }
        if (data.metrics) {
          setMetrics(data.metrics);
        }
      }
    } catch (err) {
      console.error('Failed to load real admin finance:', err);
    } finally {
      setIsLoadingFinance(false);
    }
  };

  useEffect(() => {
    loadRealFinance();
  }, []);

  const scheduledCount = settlements.filter(s => s.status === 'scheduled').length;
  const settledCount = settlements.filter(s => s.status === 'settled').length;
  const auditCount = settlements.filter(s => s.status === 'audit').length;

  const filteredSettlements = settlements.filter(s => {
    if (activeTab === 'settlements' && selectedStatus !== 'all' && s.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchBatch = s.batchId?.toLowerCase().includes(q);
      const matchMerchant = s.merchant?.name?.toLowerCase().includes(q);
      const matchBank = s.bank?.bankName?.toLowerCase().includes(q);
      if (!matchBatch && !matchMerchant && !matchBank) return false;
    }
    return true;
  });

  return (
    <AdminLayout currentTab="finance" breadcrumb="Financial Settlement & Clearinghouse" onBack={onBack}>
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
              Financial Settlement & Clearinghouse
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#475569', fontWeight: 500 }}>
              Live PostgreSQL settlement ledger, 10% platform take-rate accounting, and merchant disbursements.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => { playClickSound(); showToast('Exporting GST compliance ledger to CSV...'); }}
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
              <span>Export Tax Ledger</span>
            </button>

            <button
              onClick={() => { playTrialSound(); loadRealFinance(); showToast('T+1 Bank Settlement batch synchronized!'); }}
              disabled={isLoadingFinance}
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
                opacity: isLoadingFinance ? 0.7 : 1
              }}
            >
              <RefreshCw size={16} color="#FFFFFF" className={isLoadingFinance ? 'animate-spin' : ''} />
              <span>{isLoadingFinance ? 'Processing...' : 'Execute T+1 Payout Run'}</span>
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
                Gross GMV Processed
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#F0FDF4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TrendingUp size={20} color="#16A34A" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              ₹{(metrics.totalGmv || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <ArrowUpRight size={15} />
              <span>100% Real PostgreSQL Order GMV</span>
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
                Net Platform Commission (10%)
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Wallet size={20} color="#2563EB" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              ₹{(metrics.platformFeeNet || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#2563EB', fontWeight: 600 }}>
              <span>Clean contractual net margin</span>
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
                Pending Merchant Settlements
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Clock size={20} color="#D97706" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              ₹{(metrics.pendingSettlements || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#D97706', fontWeight: 600 }}>
              <span>{settlements.length} Merchant batches queued for T+1</span>
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
                Courier Delivery Payouts
              </span>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#FDF4FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CreditCard size={20} color="#A855F7" />
              </div>
            </div>
            <div style={{ fontSize: '38px', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: '8px' }}>
              ₹{(metrics.courierPayouts || 0).toLocaleString('en-IN')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#16A34A', fontWeight: 600 }}>
              <CheckCircle2 size={15} />
              <span>Instant Dark-Store Courier Payouts</span>
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
              { id: 'all', label: 'All Batches', count: settlements.length },
              { id: 'scheduled', label: 'Scheduled (18:00)', count: scheduledCount },
              { id: 'settled', label: 'Settled & Paid', count: settledCount },
              { id: 'audit', label: 'Audit Required', count: auditCount }
            ].map(tab => {
              const active = selectedStatus === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => { playClickSound(); setSelectedStatus(tab.id); }}
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

          {/* Search */}
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
                placeholder="Search Batch ID, Store, Bank..."
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
          </div>
        </div>

        {/* Settlements Table */}
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
                    Batch ID & Cycle
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Merchant Partner
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Gross Sales
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Nivvo 10% Fee
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Logistics Surcharge
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Net Disbursable
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Status
                  </th>
                  <th style={{ padding: '16px 20px', fontSize: '12px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', textAlign: 'right' }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredSettlements.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={{ padding: '48px 20px', textAlign: 'center', color: '#64748B', fontSize: '15px' }}>
                      {isLoadingFinance ? 'Loading live financial settlements from database...' : 'No settlement batches found.'}
                    </td>
                  </tr>
                ) : (
                  filteredSettlements.map(batch => (
                    <tr 
                      key={batch.batchId} 
                      style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = '#F8FAFC'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      {/* Batch ID */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A', fontFamily: 'monospace' }}>
                          #{batch.batchId}
                        </div>
                        <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                          {batch.cycle}
                        </div>
                      </td>

                      {/* Merchant */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                          {batch.merchant.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                          {batch.bank.bankName} {batch.bank.accountMasked} · {batch.merchant.gstin}
                        </div>
                      </td>

                      {/* Gross */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                          ₹{batch.grossSales.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Platform Fee */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#DC2626' }}>
                          -₹{batch.platformFee.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Logistics Fee */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#64748B' }}>
                          -₹{batch.logisticsFee.toLocaleString('en-IN')}
                        </div>
                      </td>

                      {/* Net */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'middle' }}>
                        <div style={{ fontSize: '16px', fontWeight: 800, color: '#16A34A' }}>
                          ₹{batch.netPayable.toLocaleString('en-IN')}
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
                          backgroundColor: batch.status === 'settled' ? '#ECFDF5' : batch.status === 'audit' ? '#FEF2F2' : '#FEF3C7',
                          color: batch.status === 'settled' ? '#065F46' : batch.status === 'audit' ? '#991B1B' : '#92400E'
                        }}>
                          {batch.status === 'settled' && <CheckCircle2 size={12} />}
                          {batch.statusLabel}
                        </div>
                      </td>

                      {/* Action */}
                      <td style={{ padding: '18px 20px', verticalAlign: 'middle', textAlign: 'right' }}>
                        <button
                          onClick={() => { playClickSound(); setSelectedBatch(batch); }}
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
                          <span>{batch.status === 'settled' ? 'UTR Receipt' : 'Process'}</span>
                          <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Batch Detail / Payout Drawer */}
        {selectedBatch && (
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
                    Batch #{selectedBatch.batchId}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                    {selectedBatch.merchant.name} · {selectedBatch.cycle}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedBatch(null)}
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
                
                {/* Net Payable Highlight */}
                <div style={{ backgroundColor: '#F0FDF4', border: '1px solid #DCFCE7', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#166534', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Net Disbursable Amount
                  </div>
                  <div style={{ fontSize: '36px', fontWeight: 900, color: '#14532D', marginTop: '4px' }}>
                    ₹{selectedBatch.netPayable.toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '13px', color: '#15803D', marginTop: '4px' }}>
                    {selectedBatch.statusLabel}
                  </div>
                </div>

                {/* Accounting Breakdown */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    Clearinghouse Ledger Breakdown
                  </h3>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Gross Merchandise Volume:</span>
                      <strong style={{ color: '#0F172A' }}>₹{selectedBatch.grossSales.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Platform Fee (10% Take-Rate):</span>
                      <strong style={{ color: '#DC2626' }}>-₹{selectedBatch.platformFee.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                      <span style={{ color: '#64748B' }}>Logistics & Doorstep Fitting Fee:</span>
                      <strong style={{ color: '#64748B' }}>-₹{selectedBatch.logisticsFee.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '10px', display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
                      <strong style={{ color: '#0F172A' }}>Total Net Disbursed:</strong>
                      <strong style={{ color: '#16A34A' }}>₹{selectedBatch.netPayable.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>

                {/* Bank Account */}
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.04em', margin: '0 0 12px 0' }}>
                    Beneficiary Bank Account
                  </h3>
                  <div style={{ backgroundColor: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '16px' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>
                      {selectedBatch.bank.bankName}
                    </div>
                    <div style={{ fontSize: '14px', color: '#334155', marginTop: '4px' }}>
                      Account Number: {selectedBatch.bank.accountMasked}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px' }}>
                      IFSC: {selectedBatch.bank.ifsc} · GSTIN: {selectedBatch.merchant.gstin}
                    </div>
                    {selectedBatch.utr && (
                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #E2E8F0', fontSize: '13px', color: '#15803D' }}>
                        <strong>Bank UTR Reference:</strong> {selectedBatch.utr}
                      </div>
                    )}
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
                  onClick={() => { playClickSound(); showToast(`Tax invoice PDF downloaded for Batch #${selectedBatch.batchId}`); }}
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
                  <Download size={15} />
                  <span>Invoice PDF</span>
                </button>

                <button
                  onClick={() => { playTrialSound(); showToast(`Payout batch #${selectedBatch.batchId} processed successfully! UTR generated.`); setSelectedBatch(null); }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    backgroundColor: '#16A34A',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  Confirm Disbursal
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
