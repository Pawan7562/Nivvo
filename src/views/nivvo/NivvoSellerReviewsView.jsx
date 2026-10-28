import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Star, MessageSquare, ThumbsUp, Check, ShieldCheck, 
  Search, Filter, Send, X, CornerDownRight, Sparkles, AlertCircle,
  TrendingUp, Award, Zap
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';
import SellerLayout from '../../components/nivvo/SellerLayout';

export default function NivvoSellerReviewsView({ onBack }) {
  const { 
    shopReviews, 
    setShopReviews, 
    replyToCustomerReview, 
    showToast 
  } = useNivvo();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeReplyId, setActiveReplyId] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  const quickReplyTemplates = [
    { label: "Appreciation", text: "Thank you for choosing Sole Street! We take great pride in local craftsmanship." },
    { label: "Fit & Sizing", text: "Glad the doorstep try-on service helped you find the perfect fit." },
    { label: "Service", text: "Thank you for your feedback. We look forward to serving you again soon." }
  ];

  const handleOpenReply = (reviewId) => {
    playClickSound();
    setActiveReplyId(reviewId);
    setReplyInput('');
  };

  const handlePostReply = (reviewId) => {
    if (!replyInput.trim()) {
      showToast('Please type a response before posting');
      return;
    }
    playTrialSound();
    replyToCustomerReview(reviewId, replyInput.trim());
    setActiveReplyId(null);
    setReplyInput('');
  };

  const filteredReviews = (shopReviews || []).filter(r => {
    if (activeFilter === '5star' && r.rating !== 5) return false;
    if (activeFilter === '4star' && r.rating !== 4) return false;
    if (activeFilter === 'unreplied' && r.merchant_reply) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.customer_name.toLowerCase().includes(q) ||
        r.product_name.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const starDistribution = [
    { star: '5', pct: '86%', count: 213 },
    { star: '4', pct: '11%', count: 27 },
    { star: '3', pct: '2%', count: 5 },
    { star: '2', pct: '1%', count: 2 },
    { star: '1', pct: '0%', count: 1 }
  ];

  const getBarColor = (star) => {
    if (star === '5') return '#1E3827';
    if (star === '4') return '#2D6A4F';
    if (star === '3') return '#74C69D';
    return '#D4E6CF';
  };

  const unrepliedCount = (shopReviews || []).filter(r => !r.merchant_reply).length;

  return (
    <SellerLayout currentTab="reviews" breadcrumb="Customer Reviews" onBack={onBack}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '26px' }}>

        {/* ─── 1. Page Header ─── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#14281C', margin: '0 0 6px 0', letterSpacing: '-0.03em' }}>
              Customer Reviews
            </h1>
            <p style={{ fontSize: '15px', color: '#687163', margin: 0, lineHeight: 1.6 }}>
              Manage customer reviews, feedback, and replies for your store.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {unrepliedCount > 0 && (
              <span style={{
                backgroundColor: '#FEF3C7',
                color: '#D97706',
                border: '1.5px solid #FDE68A',
                fontSize: '13px',
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: '999px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <AlertCircle size={14} />
                {unrepliedCount} pending {unrepliedCount === 1 ? 'reply' : 'replies'}
              </span>
            )}
            <span style={{
              backgroundColor: '#EDFDF0',
              color: '#15803D',
              border: '1.5px solid #BBF7D0',
              fontSize: '13px',
              fontWeight: 700,
              padding: '6px 14px',
              borderRadius: '999px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={15} />
              Verified Purchases
            </span>
          </div>
        </div>

        {/* ─── 2. Rating Overview Banner ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E4E9DD',
          borderRadius: '20px',
          padding: '28px',
          display: 'grid',
          gridTemplateColumns: 'auto 1fr auto',
          gap: '32px',
          alignItems: 'center',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          flexWrap: 'wrap'
        }}>
          {/* Left: Big Score */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '24px',
              backgroundColor: '#0F2618',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(15,38,24,0.25)'
            }}>
              <span style={{ fontSize: '34px', fontWeight: 900, letterSpacing: '-0.04em', color: '#C6F432', lineHeight: 1 }}>
                4.8
              </span>
              <div style={{ display: 'flex', gap: '2px', marginTop: '6px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={10} fill="#C6F432" color="#C6F432" />
                ))}
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#687163', fontWeight: 600, textAlign: 'center' }}>
              out of 5.0
            </div>
          </div>

          {/* Center: Store summary */}
          <div>
            <div style={{ fontSize: '20px', fontWeight: 800, color: '#14281C', marginBottom: '6px', letterSpacing: '-0.01em' }}>
              Store Rating & Sentiment
            </div>
            <div style={{ fontSize: '14px', color: '#687163', marginBottom: '14px', lineHeight: 1.5 }}>
              Based on 248 verified customer orders
            </div>

            {/* Keyword chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {[
                { label: 'Fast Delivery', icon: <Zap size={12} /> },
                { label: 'Doorstep Try-On', icon: <ThumbsUp size={12} /> },
                { label: 'Accurate Sizing', icon: <Award size={12} /> },
                { label: 'Top Seller', icon: <TrendingUp size={12} /> }
              ].map(chip => (
                <span key={chip.label} style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '5px 12px',
                  borderRadius: '999px',
                  backgroundColor: '#EFF5EE',
                  color: '#1F4230',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  {chip.icon}
                  {chip.label}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Star distribution bars */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '200px' }}>
            {starDistribution.map((row) => (
              <div key={row.star} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '34px', color: '#687163', fontWeight: 700, fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '3px', flexShrink: 0 }}>
                  {row.star} <Star size={11} fill="#E5A50A" color="#E5A50A" />
                </span>
                <div style={{ flex: 1, height: '8px', backgroundColor: '#F0F2EC', borderRadius: '999px', overflow: 'hidden' }}>
                  <div style={{
                    width: row.pct,
                    height: '100%',
                    backgroundColor: getBarColor(row.star),
                    borderRadius: '999px',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
                <span style={{ width: '36px', textAlign: 'right', color: '#687163', fontSize: '12px', fontWeight: 600, flexShrink: 0 }}>
                  {row.pct}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* ─── 3. Filter & Search Bar ─── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Filter Tabs */}
          <div style={{
            display: 'flex',
            backgroundColor: '#EFF1EC',
            padding: '4px',
            borderRadius: '12px',
            gap: '4px'
          }}>
            {[
              { id: 'all', label: `All (${shopReviews?.length || 3})` },
              { id: '5star', label: '5 Stars' },
              { id: '4star', label: '4 Stars' },
              { id: 'unreplied', label: `Needs Reply${unrepliedCount > 0 ? ` (${unrepliedCount})` : ''}` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { playClickSound(); setActiveFilter(tab.id); }}
                style={{
                  border: 'none',
                  backgroundColor: activeFilter === tab.id ? '#1F4230' : 'transparent',
                  color: activeFilter === tab.id ? '#FFFFFF' : '#687163',
                  fontWeight: activeFilter === tab.id ? 700 : 500,
                  fontSize: '13px',
                  padding: '8px 16px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  whiteSpace: 'nowrap'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #D4DEC8',
            borderRadius: '12px',
            padding: '9px 14px',
            gap: '10px',
            minWidth: '260px'
          }}>
            <Search size={16} color="#687163" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: '13px',
                outline: 'none',
                width: '100%',
                color: '#14281C'
              }}
            />
            {searchQuery && (
              <X size={15} color="#687163" style={{ cursor: 'pointer', flexShrink: 0 }} onClick={() => setSearchQuery('')} />
            )}
          </div>
        </div>

        {/* ─── 4. Reviews List ─── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredReviews.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '64px 24px',
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              border: '1.5px dashed #D4DEC8'
            }}>
              <MessageSquare size={40} color="#C8D4BF" style={{ margin: '0 auto 14px auto' }} />
              <div style={{ fontSize: '17px', fontWeight: 800, color: '#14281C', marginBottom: '6px' }}>No reviews found</div>
              <div style={{ fontSize: '14px', color: '#687163' }}>Try switching filter tabs or clearing your search.</div>
            </div>
          ) : (
            filteredReviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #E4E9DD',
                  borderRadius: '18px',
                  padding: '24px',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}
              >
                {/* ── Header Row: Avatar + Name + Stars ── */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    {/* Avatar */}
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: '#EFF5EE',
                      color: '#1F4230',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 900,
                      fontSize: '16px',
                      flexShrink: 0,
                      boxShadow: '0 1px 3px rgba(0,0,0,0.06)'
                    }}>
                      {rev.customer_name.slice(0, 2)}
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '16px', fontWeight: 800, color: '#14281C' }}>
                          {rev.customer_name}
                        </span>
                        <span style={{
                          backgroundColor: '#EDFDF0',
                          color: '#15803D',
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 9px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <Check size={11} />
                          Verified Purchase
                        </span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#687163', lineHeight: 1.4 }}>
                        {rev.product_name}
                        <span style={{ margin: '0 6px', opacity: 0.4 }}>·</span>
                        {rev.created_at}
                      </div>
                    </div>
                  </div>

                  {/* Stars + numeric */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < rev.rating ? '#E5A50A' : '#E8EDE3'}
                          color={i < rev.rating ? '#E5A50A' : '#E8EDE3'}
                        />
                      ))}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#E5A50A' }}>
                      {rev.rating}.0 rating
                    </span>
                  </div>
                </div>

                {/* ── Divider ── */}
                <div style={{ borderTop: '1px solid #F0F2EC' }} />

                {/* ── Review Comment ── */}
                <p style={{
                  fontSize: '14px',
                  color: '#2D3A2E',
                  margin: 0,
                  lineHeight: 1.7
                }}>
                  "{rev.comment}"
                </p>

                {/* ── Tags ── */}
                {rev.tags && rev.tags.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {rev.tags.map(t => (
                      <span key={t} style={{
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#1F4230',
                        backgroundColor: '#EFF5EE',
                        padding: '4px 12px',
                        borderRadius: '999px',
                        border: '1px solid #C8DABB'
                      }}>
                        {t}
                      </span>
                    ))}
                  </div>
                )}

                {/* ── Merchant Reply ── */}
                {rev.merchant_reply ? (
                  <div style={{
                    backgroundColor: '#F5F9F4',
                    borderLeft: '4px solid #1F4230',
                    borderRadius: '0 12px 12px 0',
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        color: '#1F4230',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <ShieldCheck size={13} />
                        Store Response · Sole Street Originals
                      </span>
                      <button
                        onClick={() => handleOpenReply(rev.id)}
                        style={{
                          border: 'none',
                          background: 'none',
                          color: '#687163',
                          fontSize: '12px',
                          cursor: 'pointer',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '6px'
                        }}
                      >
                        Edit
                      </button>
                    </div>
                    <div style={{ fontSize: '13px', color: '#2D3A2E', lineHeight: 1.6 }}>
                      {rev.merchant_reply}
                    </div>
                  </div>
                ) : (
                  activeReplyId !== rev.id && (
                    <div>
                      <button
                        onClick={() => handleOpenReply(rev.id)}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1.5px solid #C8D4BF',
                          borderRadius: '10px',
                          padding: '9px 18px',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#1F4230',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '7px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF5EE'; e.currentTarget.style.borderColor = '#1F4230'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#C8D4BF'; }}
                      >
                        <CornerDownRight size={15} />
                        Reply to review
                      </button>
                    </div>
                  )
                )}

                {/* ── Inline Reply Editor ── */}
                {activeReplyId === rev.id && (
                  <div style={{
                    backgroundColor: '#F5F9F4',
                    borderRadius: '14px',
                    padding: '18px',
                    border: '1.5px solid #1F4230'
                  }}>
                    {/* Reply header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#14281C', display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <CornerDownRight size={16} color="#1F4230" />
                        Reply to {rev.customer_name}
                      </span>
                      <button
                        onClick={() => setActiveReplyId(null)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#687163', borderRadius: '6px', padding: '2px' }}
                      >
                        <X size={16} />
                      </button>
                    </div>

                    {/* Quick reply suggestion pills */}
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: '#687163', marginBottom: '8px', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                        Response templates
                      </div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {quickReplyTemplates.map((template, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setReplyInput(template.text)}
                            style={{
                              fontSize: '12px',
                              fontWeight: 600,
                              backgroundColor: '#FFFFFF',
                              border: '1.5px solid #C8D4BF',
                              borderRadius: '999px',
                              padding: '5px 12px',
                              color: '#1F4230',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'all 0.15s'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#EFF5EE'; e.currentTarget.style.borderColor = '#1F4230'; }}
                            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#C8D4BF'; }}
                          >
                            {template.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Textarea */}
                    <textarea
                      rows={3}
                      placeholder="Write a response to this customer review..."
                      value={replyInput}
                      onChange={(e) => setReplyInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '12px 14px',
                        borderRadius: '10px',
                        border: '1.5px solid #C8D4BF',
                        fontSize: '14px',
                        outline: 'none',
                        boxSizing: 'border-box',
                        marginBottom: '12px',
                        fontFamily: 'inherit',
                        lineHeight: 1.6,
                        resize: 'vertical',
                        backgroundColor: '#FFFFFF'
                      }}
                    />

                    {/* Action buttons */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button
                        type="button"
                        onClick={() => setActiveReplyId(null)}
                        style={{
                          padding: '10px 18px',
                          border: '1.5px solid #D4DEC8',
                          borderRadius: '10px',
                          backgroundColor: '#FFFFFF',
                          fontSize: '13px',
                          fontWeight: 600,
                          color: '#687163',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={() => handlePostReply(rev.id)}
                        style={{
                          padding: '10px 20px',
                          border: 'none',
                          borderRadius: '10px',
                          backgroundColor: '#1F4230',
                          color: '#FFFFFF',
                          fontSize: '13px',
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '7px',
                          boxShadow: '0 2px 8px rgba(31,66,48,0.25)'
                        }}
                      >
                        <Send size={14} color="#C6F432" />
                        Send Reply
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </SellerLayout>
  );
}
