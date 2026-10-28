import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Wallet, ArrowUpRight, Download, CheckCircle2, Clock, 
  Building2, CreditCard, ShieldCheck, ChevronRight, RefreshCw, 
  AlertCircle, Search, Filter, X, Check, DollarSign, Calendar
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';
import SellerLayout from '../../components/nivvo/SellerLayout';

export default function NivvoSellerPayoutsView({ onBack }) {
  const { 
    shopEarnings, 
    setShopEarnings, 
    requestShopPayout, 
    shopProfile, 
    showToast 
  } = useNivvo();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'settled' | 'processing'
  const [searchQuery, setSearchQuery] = useState('');
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('24870');
  const [withdrawMethod, setWithdrawMethod] = useState('upi'); // 'upi' | 'bank'
  const [showBankModal, setShowBankModal] = useState(false);

  // Bank Form State
  const [bankName, setBankName] = useState(shopProfile?.bank_name || 'ICICI Bank');
  const [accountNumber, setAccountNumber] = useState(shopProfile?.bank_account || 'ICICI-992104812');
  const [ifscCode, setIfscCode] = useState(shopProfile?.bank_ifsc || 'ICIC0000492');
  const [upiId, setUpiId] = useState(shopProfile?.upi_id || 'solestreet@icici');

  // Settlement history rows
  const [settlementRows, setSettlementRows] = useState([
    {
      id: 'SET-99021',
      utr: 'UTR-20261025-ICIC-8491',
      date: 'Today, 06:00 AM',
      cycle: 'Daily Settlement · 24 Oct',
      ordersCount: 24,
      gross: 21450,
      deductions: 0,
      net: 21450,
      status: 'Settled',
      method: 'IMPS Direct Deposit',
      account: 'ICICI Bank (**** 4812)'
    },
    {
      id: 'SET-98944',
      utr: 'UTR-20261024-ICIC-7712',
      date: '24 Oct, 06:00 AM',
      cycle: 'Daily Settlement · 23 Oct',
      ordersCount: 27,
      gross: 22400,
      deductions: 0,
      net: 22400,
      status: 'Settled',
      method: 'IMPS Direct Deposit',
      account: 'ICICI Bank (**** 4812)'
    },
    {
      id: 'SET-98891',
      utr: 'UTR-20261023-ICIC-6640',
      date: '23 Oct, 06:00 AM',
      cycle: 'Daily Settlement · 22 Oct',
      ordersCount: 22,
      gross: 18800,
      deductions: 0,
      net: 18800,
      status: 'Settled',
      method: 'IMPS Direct Deposit',
      account: 'ICICI Bank (**** 4812)'
    },
    {
      id: 'SET-98810',
      utr: 'UTR-20261022-ICIC-5521',
      date: '22 Oct, 06:00 AM',
      cycle: 'Daily Settlement · 21 Oct',
      ordersCount: 25,
      gross: 21500,
      deductions: 0,
      net: 21500,
      status: 'Settled',
      method: 'IMPS Direct Deposit',
      account: 'ICICI Bank (**** 4812)'
    },
    {
      id: 'SET-98762',
      utr: 'UTR-20261021-ICIC-4418',
      date: '21 Oct, 06:00 AM',
      cycle: 'Daily Settlement · 20 Oct',
      ordersCount: 23,
      gross: 19200,
      deductions: 0,
      net: 19200,
      status: 'Settled',
      method: 'IMPS Direct Deposit',
      account: 'ICICI Bank (**** 4812)'
    }
  ]);

  const handleConfirmWithdraw = (e) => {
    e.preventDefault();
    const amt = parseFloat(withdrawAmount);
    if (!amt || amt <= 0 || amt > (shopEarnings?.netPayout || 24870)) {
      showToast('Please enter a valid amount within available balance');
      return;
    }

    playTrialSound();
    requestShopPayout(amt, withdrawMethod === 'upi' ? upiId : accountNumber);

    const newSettlement = {
      id: `SET-${Math.floor(10000 + Math.random() * 90000)}`,
      utr: `UTR-${Date.now().toString().slice(-8)}`,
      date: 'Just now',
      cycle: 'Instant On-Demand Payout',
      ordersCount: shopEarnings?.today_orders_count || 28,
      gross: amt,
      deductions: 0,
      net: amt,
      status: 'Processing',
      method: withdrawMethod === 'upi' ? `Instant UPI (${upiId})` : `IMPS to ${bankName}`,
      account: withdrawMethod === 'upi' ? upiId : `${bankName} (**** ${accountNumber.slice(-4)})`
    };

    setSettlementRows(prev => [newSettlement, ...prev]);
    setShowWithdrawModal(false);
    showToast(`Instant payout request of ₹${amt.toLocaleString('en-IN')} initiated.`);
  };

  const handleSaveBankDetails = (e) => {
    e.preventDefault();
    playTrialSound();
    setShowBankModal(false);
    showToast('Settlement bank account details updated and verified.');
  };

  const downloadSettlementsCSV = () => {
    playTrialSound();
    const rows = [
      ['Sole Street Originals - Settlements & Payouts Ledger'],
      ['GSTIN', shopProfile?.gstin || '29AABCU9603R1ZM', 'Export Date', new Date().toLocaleString('en-IN')],
      [],
      ['Settlement ID', 'Bank UTR', 'Settlement Date', 'Cycle', 'Orders Count', 'Gross GMV (₹)', 'Commission / Fee', 'Net Credited (₹)', 'Payment Method', 'Account Reference'],
      ...settlementRows.map(r => [
        r.id,
        r.utr,
        r.date,
        r.cycle,
        r.ordersCount,
        r.gross,
        '₹0 (0% Platform Fee)',
        r.net,
        r.method,
        r.account
      ]),
      [],
      ['Total Settlements Credited', `₹${settlementRows.reduce((sum, r) => sum + r.net, 0).toLocaleString('en-IN')}`]
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sole_street_payouts_ledger.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Settlement ledger CSV downloaded.');
  };

  const filteredRows = settlementRows.filter(r => {
    if (activeFilter === 'settled' && !r.status.includes('Settled')) return false;
    if (activeFilter === 'processing' && !r.status.includes('Processing')) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.id.toLowerCase().includes(q) || r.utr.toLowerCase().includes(q) || r.cycle.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <SellerLayout currentTab="payouts" breadcrumb="Payouts & Settlements" onBack={onBack}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* ─── Top Header Bar ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#14281C', margin: '0 0 6px 0', letterSpacing: '-0.03em' }}>
              Payouts & Settlements
            </h1>
            <p style={{ fontSize: '15px', color: '#687163', margin: 0, lineHeight: 1.5 }}>
              Manage bank settlements, track daily payouts, and view transaction history.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={downloadSettlementsCSV}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D4DEC8',
                borderRadius: '10px',
                padding: '11px 18px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#14281C',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <Download size={16} />
              <span>Export Ledger</span>
            </button>

            <button
              onClick={() => { playClickSound(); setShowWithdrawModal(true); }}
              style={{
                backgroundColor: '#1F4230',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '11px 20px',
                fontSize: '14px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(31, 66, 48, 0.2)'
              }}
            >
              <Wallet size={17} color="#C6F432" />
              <span>Withdraw Funds</span>
            </button>
          </div>
        </div>

        {/* ─── Financial KPI Cards ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          
          {/* Card 1: Available for Payout */}
          <div style={{
            backgroundColor: '#0F2618',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 4px 14px rgba(15, 38, 24, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#B7F34A' }}>
                Available Balance
              </span>
              <span style={{ backgroundColor: 'rgba(183, 243, 74, 0.2)', color: '#B7F34A', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                Instant Transfer
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: '8px' }}>
              ₹{(shopEarnings?.netPayout || 24870).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#D2E8C4', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Ready for immediate payout</span>
            </div>
          </div>

          {/* Card 2: Today's Net Sales */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EAECE5',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#687163' }}>
                Today's Earnings
              </span>
              <span style={{ backgroundColor: '#E8F5E9', color: '#15803D', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                +18.4%
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#14281C', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              ₹{(shopEarnings?.today_gross || 24870).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#687163' }}>
              Scheduled deposit: Tomorrow at 06:00 AM IST
            </div>
          </div>

          {/* Card 3: Platform Commission Rate */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EAECE5',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#687163' }}>
                Platform Commission
              </span>
              <span style={{ backgroundColor: '#E8F5E9', color: '#15803D', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                0% Fee
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#15803D', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              0%
            </div>
            <div style={{ fontSize: '12px', color: '#687163' }}>
              Zero merchant commission on listed price
            </div>
          </div>

          {/* Card 4: Lifetime Gross GMV */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #EAECE5',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#687163' }}>
                Total Settled
              </span>
              <span style={{ backgroundColor: '#EEF4EC', color: '#1F4230', padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                312 Orders
              </span>
            </div>
            <div style={{ fontSize: '32px', fontWeight: 900, color: '#14281C', letterSpacing: '-0.03em', marginBottom: '8px' }}>
              ₹{(shopEarnings?.lifetime_gross || 184520).toLocaleString('en-IN')}
            </div>
            <div style={{ fontSize: '12px', color: '#687163' }}>
              Lifetime fulfilled volume
            </div>
          </div>

        </div>

        {/* ─── Settlement Bank Account & GST Compliance Card ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAECE5',
          borderRadius: '16px',
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              backgroundColor: '#EEF4EC',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1F4230'
            }}>
              <Building2 size={24} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                  {bankName} · {accountNumber}
                </span>
                <span style={{ backgroundColor: '#E8F5E9', color: '#15803D', fontSize: '10px', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  Primary Account
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#687163', marginTop: '2px' }}>
                IFSC: <strong>{ifscCode}</strong> · UPI ID: <strong>{upiId}</strong> · GSTIN: <strong>{shopProfile?.gstin || '29AABCU9603R1ZM'}</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => { playClickSound(); setShowBankModal(true); }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D4DEC8',
              borderRadius: '10px',
              padding: '8px 16px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#14281C',
              cursor: 'pointer'
            }}
          >
            Edit Account
          </button>
        </div>

        {/* ─── Settlement Ledger Table ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #EAECE5',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          {/* Table Header Controls */}
          <div style={{
            padding: '16px 20px',
            borderBottom: '1px solid #EAECE5',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>
                Settlement History
              </span>
              <span style={{ backgroundColor: '#EEF4EC', color: '#1F4230', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '999px' }}>
                {filteredRows.length} transactions
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {/* Filter Tabs */}
              <div style={{ display: 'flex', backgroundColor: '#F3F4EE', padding: '3px', borderRadius: '8px' }}>
                {['all', 'settled', 'processing'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => { playClickSound(); setActiveFilter(tab); }}
                    style={{
                      border: 'none',
                      backgroundColor: activeFilter === tab ? '#FFFFFF' : 'transparent',
                      color: activeFilter === tab ? '#14281C' : '#687163',
                      fontWeight: activeFilter === tab ? 700 : 500,
                      fontSize: '12px',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      textTransform: 'capitalize'
                    }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Search Box */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#F9FAF7',
                border: '1px solid #EAECE5',
                borderRadius: '8px',
                padding: '6px 10px',
                gap: '6px'
              }}>
                <Search size={14} color="#687163" />
                <input
                  type="text"
                  placeholder="Search UTR / ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '12px',
                    outline: 'none',
                    width: '130px',
                    color: '#14281C'
                  }}
                />
              </div>
            </div>
          </div>

          {/* Table Element */}
          <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
            <table style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#F9FAF7', borderBottom: '1px solid #EAECE5', color: '#687163', fontSize: '12px', fontWeight: 600 }}>
                  <th style={{ padding: '12px 20px' }}>Settlement ID</th>
                  <th style={{ padding: '12px 16px' }}>Cycle / Date</th>
                  <th style={{ padding: '12px 16px' }}>Orders</th>
                  <th style={{ padding: '12px 16px' }}>Gross amount</th>
                  <th style={{ padding: '12px 16px' }}>Net payout</th>
                  <th style={{ padding: '12px 16px' }}>Account destination</th>
                  <th style={{ padding: '12px 20px', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRows.map((row) => (
                  <tr key={row.id} style={{ borderBottom: '1px solid #F3F4EE' }}>
                    <td style={{ padding: '14px 20px' }}>
                      <div style={{ fontWeight: 800, color: '#14281C' }}>{row.id}</div>
                      <div style={{ fontSize: '11px', color: '#687163', fontFamily: 'monospace' }}>{row.utr}</div>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#14281C' }}>{row.cycle}</div>
                      <div style={{ fontSize: '11px', color: '#687163' }}>{row.date}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 600, color: '#14281C' }}>
                      {row.ordersCount} orders
                    </td>
                    <td style={{ padding: '14px 16px', color: '#687163' }}>
                      ₹{row.gross.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 800, color: '#15803D' }}>
                      ₹{row.net.toLocaleString('en-IN')}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: '12px', fontWeight: 600, color: '#14281C' }}>{row.method}</div>
                      <div style={{ fontSize: '11px', color: '#687163' }}>{row.account}</div>
                    </td>
                    <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                      <span style={{
                        backgroundColor: row.status.includes('Settled') ? '#E8F5E9' : '#FEF3C7',
                        color: row.status.includes('Settled') ? '#15803D' : '#B45309',
                        padding: '4px 10px',
                        borderRadius: '999px',
                        fontSize: '11px',
                        fontWeight: 700
                      }}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* ─── MODAL 1: WITHDRAW FUNDS ─── */}
      {showWithdrawModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20, 40, 28, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '460px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={20} color="#1F4230" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14281C', margin: 0 }}>
                  Instant Payout Request
                </h3>
              </div>
              <button onClick={() => setShowWithdrawModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#687163' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmWithdraw}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#687163', marginBottom: '6px' }}>
                  Withdrawal amount (₹)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '14px', top: '12px', fontSize: '18px', fontWeight: 800, color: '#14281C' }}>₹</span>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={shopEarnings?.netPayout || 24870}
                    style={{
                      width: '100%',
                      padding: '12px 14px 12px 32px',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#14281C',
                      border: '1.5px solid #D4DEC8',
                      borderRadius: '12px',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#687163', marginTop: '6px' }}>
                  <span>Available balance: ₹{(shopEarnings?.netPayout || 24870).toLocaleString('en-IN')}</span>
                  <button
                    type="button"
                    onClick={() => setWithdrawAmount(String(shopEarnings?.netPayout || 24870))}
                    style={{ border: 'none', background: 'none', color: '#15803D', fontWeight: 700, cursor: 'pointer', padding: 0 }}
                  >
                    Withdraw All
                  </button>
                </div>
              </div>

              {/* Destination method */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#687163', marginBottom: '8px' }}>
                  Payout destination
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: withdrawMethod === 'upi' ? '2px solid #1F4230' : '1px solid #EAECE5',
                    backgroundColor: withdrawMethod === 'upi' ? '#EEF4EC' : '#FFFFFF',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="payout_method"
                      checked={withdrawMethod === 'upi'}
                      onChange={() => setWithdrawMethod('upi')}
                      style={{ accentColor: '#1F4230' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                        Instant UPI ({upiId})
                      </div>
                      <div style={{ fontSize: '11px', color: '#687163' }}>
                        Instant transfer to store UPI ID
                      </div>
                    </div>
                  </label>

                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    border: withdrawMethod === 'bank' ? '2px solid #1F4230' : '1px solid #EAECE5',
                    backgroundColor: withdrawMethod === 'bank' ? '#EEF4EC' : '#FFFFFF',
                    cursor: 'pointer'
                  }}>
                    <input
                      type="radio"
                      name="payout_method"
                      checked={withdrawMethod === 'bank'}
                      onChange={() => setWithdrawMethod('bank')}
                      style={{ accentColor: '#1F4230' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                        Direct IMPS Bank Transfer ({bankName})
                      </div>
                      <div style={{ fontSize: '11px', color: '#687163' }}>
                        Account {accountNumber} · IFSC {ifscCode}
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowWithdrawModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #D4DEC8',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#687163',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#C6F432',
                    color: '#14281C',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Confirm withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: EDIT BANK DETAILS ─── */}
      {showBankModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20, 40, 28, 0.65)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '500px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building2 size={20} color="#1F4230" />
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#14281C', margin: 0 }}>
                  Update Settlement Bank Details
                </h3>
              </div>
              <button onClick={() => setShowBankModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#687163' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveBankDetails}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#687163', marginBottom: '4px' }}>
                  Bank name
                </label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D4DEC8', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#687163', marginBottom: '4px' }}>
                  Account number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D4DEC8', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#687163', marginBottom: '4px' }}>
                  IFSC code
                </label>
                <input
                  type="text"
                  value={ifscCode}
                  onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D4DEC8', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#687163', marginBottom: '4px' }}>
                  UPI ID (VPA)
                </label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #D4DEC8', borderRadius: '8px', fontSize: '13px', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    border: '1px solid #D4DEC8',
                    borderRadius: '10px',
                    backgroundColor: '#FFFFFF',
                    fontWeight: 700,
                    fontSize: '13px',
                    color: '#687163',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '12px',
                    border: 'none',
                    borderRadius: '10px',
                    backgroundColor: '#1F4230',
                    color: '#FFFFFF',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  Save details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}
