import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowLeft, ArrowUpRight, CheckCircle2, 
  CreditCard, X
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';

export default function NivvoRiderEarningsView({ onBack }) {
  const { 
    riderProfile, 
    riderTripsHistory, 
    showToast 
  } = useNivvo();

  const [activeTab, setActiveTab] = useState('Today'); // 'Today' | 'This Week' | 'This Month'
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState(riderProfile.today_earnings || 980);
  const [isWithdrawn, setIsWithdrawn] = useState(false);

  const tipsAmount = 60;
  const basePay = Math.max(0, (riderProfile.today_earnings || 980) - (riderProfile.incentives_today || 180) - tipsAmount);

  const stats = {
    Today: { 
      amount: `₹${riderProfile.today_earnings || 980}`, 
      trips: riderProfile.today_deliveries || 14, 
      deliveryEarned: `₹${basePay}`, 
      incentives: `₹${riderProfile.incentives_today || 180}`,
      tips: `₹${tipsAmount}` 
    },
    'This Week': { 
      amount: '₹4,620', 
      trips: 72, 
      deliveryEarned: '₹3,920', 
      incentives: '₹450',
      tips: '₹250' 
    },
    'This Month': { 
      amount: '₹18,740', 
      trips: 296, 
      deliveryEarned: '₹15,840', 
      incentives: '₹1,750',
      tips: '₹1,150' 
    }
  };

  const currentStat = stats[activeTab] || stats['Today'];

  const handleWithdrawSubmit = (e) => {
    e.preventDefault();
    if (!withdrawAmount || Number(withdrawAmount) <= 0) return;
    playTrialSound();
    setIsWithdrawn(true);
    showToast(`Instant transfer of ₹${withdrawAmount} sent to linked bank account.`);
    setTimeout(() => {
      setShowWithdrawModal(false);
      setIsWithdrawn(false);
    }, 1500);
  };

  return (
    <div style={{ backgroundColor: '#F4F5EE', minHeight: '100%', paddingBottom: '96px', position: 'relative' }}>
      
      {/* ─── Top Header Bar ─── */}
      <div style={{
        backgroundColor: '#FFFFFF',
        padding: '12px 16px',
        borderBottom: '1px solid #E5E7DE',
        position: 'sticky',
        top: 0,
        zIndex: 40,
        boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button 
              onClick={onBack} 
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#14281C',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              title="Back"
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>
            <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>
              Earnings & Payouts
            </div>
          </div>

          <span style={{
            backgroundColor: '#E8F5E9',
            color: '#15803D',
            padding: '4px 10px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <CheckCircle2 size={12} />
            <span>Instant UPI/IMPS</span>
          </span>
        </div>
      </div>

      <div style={{ padding: '14px 16px', maxWidth: '520px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        
        {/* ─── 1. Available Balance Hero Card ─── */}
        <div style={{
          backgroundColor: '#1F4230',
          borderRadius: '16px',
          color: '#FFFFFF',
          padding: '20px',
          boxShadow: '0 4px 16px rgba(31, 66, 48, 0.12)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div>
            <div style={{ 
              fontSize: '11px', 
              color: '#A7BDB0', 
              fontWeight: 700, 
              letterSpacing: '0.04em',
              textTransform: 'uppercase'
            }}>
              Available for Withdrawal
            </div>
            <div style={{ 
              fontSize: '34px', 
              fontWeight: 800, 
              color: '#B7F34A', 
              marginTop: '4px', 
              letterSpacing: '-0.02em',
              lineHeight: 1
            }}>
              {currentStat.amount}
            </div>
            <div style={{ fontSize: '12px', color: '#D4DEC9', marginTop: '6px' }}>
              {currentStat.trips} completed trips · Auto-settles nightly at 11:59 PM
            </div>
          </div>

          {/* Transfer Button */}
          <button
            onClick={() => {
              playClickSound();
              setWithdrawAmount(riderProfile.today_earnings || 980);
              setShowWithdrawModal(true);
            }}
            style={{
              width: '100%',
              backgroundColor: '#B7F34A',
              color: '#14281C',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              minHeight: '44px'
            }}
          >
            <span>Withdraw to Bank</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* ─── 2. Timeframe Segmented Control ─── */}
        <div style={{
          display: 'flex',
          backgroundColor: '#EAECE5',
          borderRadius: '12px',
          padding: '3px',
          gap: '3px'
        }}>
          {['Today', 'This Week', 'This Month'].map(t => {
            const isSelected = activeTab === t;
            return (
              <button 
                key={t}
                onClick={() => { playClickSound(); setActiveTab(t); }}
                style={{
                  flex: 1,
                  padding: '8px 12px',
                  borderRadius: '9px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 800 : 600,
                  backgroundColor: isSelected ? '#FFFFFF' : 'transparent',
                  color: isSelected ? '#14281C' : '#6B7265',
                  border: 'none',
                  boxShadow: isSelected ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {t}
              </button>
            );
          })}
        </div>

        {/* ─── 3. Earnings Breakdown Card ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{
            fontSize: '11px',
            fontWeight: 800,
            color: '#6B7265',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '12px'
          }}>
            Breakdown · {activeTab}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6B7265' }}>Base Delivery Pay</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>{currentStat.deliveryEarned}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6B7265' }}>Peak Surge & Incentives</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803D' }}>+{currentStat.incentives}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: '#6B7265' }}>Customer Tips</span>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#15803D' }}>+{currentStat.tips}</span>
            </div>

            <div style={{
              borderTop: '1px solid #EAECE5',
              paddingTop: '10px',
              marginTop: '2px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>Total Earned</span>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#15803D' }}>{currentStat.amount}</span>
            </div>
          </div>
        </div>

        {/* ─── 4. Linked Settlement Account ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '14px 16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: '#F4F5EE',
              color: '#1F4230',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <CreditCard size={18} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                HDFC Bank · **4829
              </div>
              <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '1px' }}>
                UPI: aarav.shah@okhdfcbank
              </div>
            </div>
          </div>

          <span style={{
            backgroundColor: '#E8F5E9',
            color: '#15803D',
            padding: '3px 8px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '3px'
          }}>
            <CheckCircle2 size={12} />
            <span>Verified</span>
          </span>
        </div>

        {/* ─── 5. Recent Delivery Settlements ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #E5E7DE',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B7265',
              textTransform: 'uppercase',
              letterSpacing: '0.04em'
            }}>
              Recent Deliveries
            </div>
            <span style={{ fontSize: '11px', color: '#8A9285', fontWeight: 600 }}>
              {riderTripsHistory.length} completed
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {riderTripsHistory.slice(0, 4).map((trip, idx) => {
              const totalPayout = Number(trip.fee) + Number(trip.tip || 0);
              return (
                <div
                  key={trip.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: idx !== Math.min(riderTripsHistory.length, 4) - 1 ? '1px solid #F4F5EE' : 'none'
                  }}
                >
                  <div style={{ minWidth: 0, paddingRight: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>
                        {trip.id}
                      </span>
                      <span style={{ fontSize: '11px', color: '#8A9285' }}>
                        · {trip.time}
                      </span>
                    </div>
                    <div style={{ 
                      fontSize: '11px', 
                      color: '#6B7265', 
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '240px'
                    }}>
                      {trip.desc} ({trip.distance})
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: '14px', fontWeight: 800, color: '#15803D' }}>
                      ₹{totalPayout}
                    </div>
                    {trip.tip > 0 && (
                      <div style={{ fontSize: '10px', color: '#15803D', fontWeight: 700 }}>
                        incl. ₹{trip.tip} tip
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* ─── Instant Withdrawal Modal ─── */}
      {showWithdrawModal && (
        <div className="nivvo-modal-overlay" onClick={() => setShowWithdrawModal(false)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="nivvo-modal-header">
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                Withdraw to Bank
              </h3>
              <button 
                className="nivvo-modal-close-btn" 
                onClick={() => setShowWithdrawModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {isWithdrawn ? (
              <div style={{ textAlign: 'center', padding: '24px 10px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: '#E8F5E9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px auto'
                }}>
                  <CheckCircle2 size={26} color="#15803D" />
                </div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#15803D' }}>
                  Transfer Initiated
                </div>
                <div style={{ fontSize: '12px', color: '#6B7265', marginTop: '4px' }}>
                  ₹{withdrawAmount} sent to HDFC Bank (**4829). Reference: TXN-{Date.now().toString().slice(-6)}.
                </div>
              </div>
            ) : (
              <form onSubmit={handleWithdrawSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingTop: '8px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#6B7265', letterSpacing: '0.02em', textTransform: 'uppercase' }}>
                      Withdrawal Amount
                    </label>
                    <span style={{ fontSize: '11px', color: '#6B7265' }}>
                      Available: <strong style={{ color: '#14281C' }}>₹{riderProfile.today_earnings || 980}</strong>
                    </span>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <span style={{
                      position: 'absolute',
                      left: '14px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      fontSize: '18px',
                      fontWeight: 800,
                      color: '#14281C'
                    }}>
                      ₹
                    </span>
                    <input
                      type="number"
                      min="1"
                      max={riderProfile.today_earnings || 980}
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px 12px 30px',
                        fontSize: '18px',
                        fontWeight: 800,
                        borderRadius: '10px',
                        border: '1.5px solid #1F4230',
                        backgroundColor: '#F9FAF7',
                        outline: 'none',
                        color: '#14281C',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                {/* Quick Presets */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[200, 500, riderProfile.today_earnings || 980].map((amt) => {
                    const isFull = amt === (riderProfile.today_earnings || 980);
                    return (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setWithdrawAmount(amt)}
                        style={{
                          flex: 1,
                          padding: '8px',
                          borderRadius: '8px',
                          border: '1px solid #E5E7DE',
                          backgroundColor: Number(withdrawAmount) === Number(amt) ? '#1F4230' : '#FFFFFF',
                          color: Number(withdrawAmount) === Number(amt) ? '#B7F34A' : '#14281C',
                          fontWeight: 700,
                          fontSize: '12px',
                          cursor: 'pointer'
                        }}
                      >
                        {isFull ? `All (₹${amt})` : `₹${amt}`}
                      </button>
                    );
                  })}
                </div>

                {/* Linked Account Card */}
                <div style={{ 
                  backgroundColor: '#F9FAF7', 
                  padding: '12px', 
                  borderRadius: '10px', 
                  border: '1px solid #EAECE5', 
                  fontSize: '12px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, color: '#14281C' }}>Receiving Account</span>
                    <span style={{ fontSize: '11px', color: '#15803D', fontWeight: 700 }}>Instant IMPS</span>
                  </div>
                  <div style={{ color: '#6B7265', marginTop: '3px' }}>
                    HDFC Bank · A/C **4829
                  </div>
                  <div style={{ color: '#8A9285', fontSize: '11px', marginTop: '1px' }}>
                    aarav.shah@okhdfcbank
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!withdrawAmount || Number(withdrawAmount) <= 0}
                  style={{
                    backgroundColor: '#B7F34A',
                    color: '#14281C',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '13px',
                    fontWeight: 800,
                    fontSize: '13px',
                    cursor: 'pointer',
                    minHeight: '44px'
                  }}
                >
                  Confirm Withdrawal (₹{withdrawAmount})
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
