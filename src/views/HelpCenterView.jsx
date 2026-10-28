import React, { useState, useEffect } from 'react';
import { HelpCircle, MessageSquare, Send, CheckCircle2, Clock, PhoneCall, ShieldCheck, Zap, ChevronLeft } from 'lucide-react';
import { fetchHelpTickets, submitHelpTicket } from '../services/api';
import { playAddSound, playClickSound } from '../utils/audioEffects';

export default function HelpCenterView({ user, onNavigateHome }) {
  const [tickets, setTickets] = useState([]);
  const [category, setCategory] = useState('2-Size Trial Question');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    const data = await fetchHelpTickets(user?.phone || '+91 9876543210');
    if (data && data.tickets) {
      setTickets(data.tickets);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    playAddSound();

    const payload = {
      ticket_id: `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
      user_phone: user?.phone || '+91 9876543210',
      category,
      subject,
      message
    };

    const res = await submitHelpTicket(payload);
    setIsSubmitting(false);

    if (res && res.ticket) {
      setTickets([res.ticket, ...tickets]);
      setSubject('');
      setMessage('');
      setSubmittedSuccess(true);
      setTimeout(() => setSubmittedSuccess(false), 4000);
    }
  };

  return (
    <div className="blinkit-help-page" style={{ paddingBottom: '90px' }}>
      {/* Native Toolbar */}
      <div className="apk-profile-toolbar">
        <button 
          className="apk-toolbar-back-btn" 
          onClick={() => { playClickSound(); if (onNavigateHome) onNavigateHome(); }}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#293142" />
        </button>
        <h1 className="apk-toolbar-title">24x7 Customer Support</h1>
      </div>

      <div style={{ padding: '14px' }}>
        <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
          Real-time assistance for 10-minute orders, doorstep size exchanges, and garment care. All tickets synced to Neon DB.
        </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Support Ticket Submission Form */}
        <div style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1.5px solid #E5E7EB',
          padding: '24px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <MessageSquare size={20} color="#0C831F" />
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#111827' }}>
              Create a Support Ticket
            </h3>
          </div>

          {submittedSuccess && (
            <div style={{
              background: '#DCFCE7',
              border: '1px solid #86EFAC',
              color: '#15803D',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '12px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '16px'
            }}>
              <CheckCircle2 size={16} />
              <span>Ticket logged into Neon DB! Executive assigned in under 2 minutes.</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Inquiry Category
              </label>
              <select 
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '13px',
                  background: '#FFFFFF'
                }}
              >
                <option value="2-Size Trial Question">Doorstep 2-Size Trial Question</option>
                <option value="Live Rider Location">Where is my 10-min rider?</option>
                <option value="Garment Steam & Packing">Garment Steaming & Hanger Inquiry</option>
                <option value="Payment & Refund">UPI / Payment & Instant Refund</option>
                <option value="Other">Other Fashion Assistance</option>
              </select>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Subject
              </label>
              <input 
                type="text" 
                placeholder="e.g. Can rider wait 5 minutes while I try jeans?"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '13px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '6px' }}>
                Message Details
              </label>
              <textarea 
                rows={4}
                placeholder="Describe your issue or order inquiry..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '8px',
                  border: '1px solid #D1D5DB',
                  fontSize: '13px',
                  fontFamily: 'inherit'
                }}
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                backgroundColor: '#0C831F',
                color: '#FFFFFF',
                padding: '12px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <Send size={15} />
              <span>{isSubmitting ? 'Logging into Neon DB...' : 'Submit Support Ticket'}</span>
            </button>
          </form>
        </div>

        {/* Live Support Hotline & Active Tickets */}
        <div>
          {/* Quick Hotline Card */}
          <div style={{
            background: 'linear-gradient(135deg, #0C831F 0%, #064E11 100%)',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 16px rgba(12,131,31,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <Zap size={16} color="#F8CB46" />
              <strong style={{ fontSize: '14px' }}>Instant 10-Min Rider Hotline</strong>
            </div>
            <p style={{ fontSize: '12px', color: '#E2E8F0', lineHeight: 1.4, marginBottom: '14px' }}>
              Have an urgent emergency order in flight right now? Connect directly to dispatch control.
            </p>
            <a 
              href="tel:1800100999" 
              onClick={(e) => { e.preventDefault(); alert("Calling Nivvo Priority Dispatch Control: 1800-100-999"); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F8CB46',
                color: '#111827',
                padding: '8px 16px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '12px',
                textDecoration: 'none'
              }}
            >
              <PhoneCall size={14} />
              <span>Call Priority Line (Toll Free)</span>
            </a>
          </div>

          {/* Your Logged Tickets */}
          <div style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            border: '1.5px solid #E5E7EB',
            padding: '20px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#111827', marginBottom: '12px' }}>
              Your Support History (Neon DB)
            </h3>

            {tickets.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#6B7280', fontSize: '13px' }}>
                No open tickets. All systems running smooth!
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {tickets.map((t, idx) => (
                  <div 
                    key={t.ticket_id || idx}
                    style={{
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      padding: '12px',
                      background: '#F8FAFC'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '13px', color: '#111827' }}>#{t.ticket_id}</strong>
                      <span style={{
                        background: '#DCFCE7',
                        color: '#15803D',
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px'
                      }}>
                        {t.status || 'Resolved in 2 mins'}
                      </span>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#374151', marginTop: '4px' }}>
                      {t.subject}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6B7280', marginTop: '2px' }}>
                      {t.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
