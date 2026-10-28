import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  HelpCircle, Phone, MessageSquare, Send, Plus, Search, 
  CheckCircle2, Clock, AlertTriangle, ShieldCheck, ChevronDown, 
  ChevronRight, ArrowUpRight, X, User, ExternalLink, Headphones,
  FileText, Camera, Check, RefreshCw, MessageCircle
} from 'lucide-react';
import { playClickSound, playTrialSound, playAddSound } from '../../utils/audioEffects';
import SellerLayout from '../../components/nivvo/SellerLayout';

export default function NivvoSellerSupportView({ onBack }) {
  const { 
    sellerTickets, 
    createSellerTicket, 
    replyToSellerTicket, 
    shopProfile, 
    showToast 
  } = useNivvo();

  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'active' | 'resolved'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [replyInput, setReplyInput] = useState('');

  // Modals state
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [showCallHubModal, setShowCallHubModal] = useState(false);

  // New Ticket Form State
  const [ticketCategory, setTicketCategory] = useState('Rider / Delivery Partner Issue');
  const [ticketOrderId, setTicketOrderId] = useState('NV-1052');
  const [ticketPriority, setTicketPriority] = useState('HIGH');
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDescription, setTicketDescription] = useState('');
  const [ticketAttachedFile, setTicketAttachedFile] = useState(null);

  // Callback modal state
  const [callbackPhone, setCallbackPhone] = useState(shopProfile?.phone || '+91 98765 43210');
  const [callbackTopic, setCallbackTopic] = useState('Urgent rider dispatch assistance');

  // FAQ Accordion State
  const [expandedFaq, setExpandedFaq] = useState(0);

  const categories = [
    { id: 'rider', label: 'Courier & Pickup Issue', desc: 'Pickup delays, partner assignment, or handover PIN verification' },
    { id: 'return', label: 'Try-On Return Dispute', desc: 'Item condition discrepancy, missing packaging, or return issue' },
    { id: 'payout', label: 'Payout & Settlement', desc: 'Transfer verification, UTR reference, or balance inquiry' },
    { id: 'catalog', label: 'Catalog & Inventory', desc: 'SKU listing, size chart update, or barcode verification' },
    { id: 'account', label: 'Store Operations', desc: 'Operating hours, temporary pause, or store details' }
  ];

  const handleOpenTicket = (ticket) => {
    playClickSound();
    setSelectedTicket(ticket);
    setReplyInput('');
  };

  const handleSendTicketReply = (e) => {
    e?.preventDefault();
    if (!replyInput.trim() || !selectedTicket) return;
    replyToSellerTicket(selectedTicket.id, replyInput.trim());
    setReplyInput('');
    // Update local selected ticket
    setSelectedTicket(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          id: `m-${Date.now()}`,
          sender: 'merchant',
          senderName: 'Rohan (Sole Street)',
          text: replyInput.trim(),
          time: 'Just now'
        }
      ]
    }));
  };

  const handleSubmitNewTicket = (e) => {
    e?.preventDefault();
    if (!ticketSubject.trim() || !ticketDescription.trim()) {
      showToast('Please fill in both the subject and problem description');
      return;
    }

    const newTicketId = createSellerTicket({
      category: ticketCategory,
      subject: ticketSubject.trim(),
      description: ticketDescription.trim(),
      orderId: ticketOrderId.trim() || null,
      priority: ticketPriority
    });

    setShowNewTicketModal(false);
    setTicketSubject('');
    setTicketDescription('');
    setTicketAttachedFile(null);

    // Auto open newly created ticket
    const newlyCreated = {
      id: newTicketId,
      category: ticketCategory,
      subject: ticketSubject.trim(),
      orderId: ticketOrderId.trim() || null,
      priority: ticketPriority,
      status: 'IN PROGRESS',
      createdAt: 'Just now',
      lastUpdate: 'Just now',
      messages: [
        {
          id: `m-${Date.now()}`,
          sender: 'merchant',
          senderName: 'Rohan (Sole Street)',
          text: ticketDescription.trim(),
          time: 'Just now'
        },
        {
          id: `m-${Date.now() + 1}`,
          sender: 'support',
          senderName: 'Nivvo Partner Ops (Auto-Ack)',
          text: `Ticket ${newTicketId} received. The operations team has been notified and will reply shortly.`,
          time: 'Just now'
        }
      ]
    };
    setSelectedTicket(newlyCreated);
  };

  const handleRequestCallback = (e) => {
    e?.preventDefault();
    playTrialSound();
    showToast(`Callback requested. An operations specialist will call ${callbackPhone} shortly.`);
    setShowCallbackModal(false);
  };

  // Filter tickets
  const filteredTickets = (sellerTickets || []).filter(t => {
    if (activeFilter === 'active' && t.status === 'RESOLVED') return false;
    if (activeFilter === 'resolved' && t.status !== 'RESOLVED') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.subject.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        (t.orderId && t.orderId.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const faqs = [
    {
      q: 'How do I claim reimbursement for a damaged try-on return?',
      a: 'If a customer tests an item during doorstep try-on and returns it damaged, stained, or missing packaging, go to Orders > Returns and select "Report Return Dispute". Attach photo documentation, and our team will review and process reimbursement to your settlement account within 4 hours.'
    },
    {
      q: 'What should I do if a courier partner is delayed for pickup?',
      a: 'If an order does not have an assigned courier partner within the preparation window, use the Call Hub Desk button or request a phone callback. Dispatch controllers will manually assign the nearest available partner.'
    },
    {
      q: 'How does the daily settlement schedule work?',
      a: 'All delivered order payouts are deposited automatically via IMPS to your linked bank account daily at 06:00 AM (T+1). Instant withdrawals can also be requested from the Payouts tab.'
    },
    {
      q: 'Can I temporarily pause incoming orders during store rush hours?',
      a: 'Yes. Use the store status toggle in the navigation bar to temporarily pause incoming orders. Store listings will appear unavailable on customer apps, protecting your fulfillment metrics.'
    },
    {
      q: 'How do I update bank account details or UPI ID?',
      a: 'Go to the Payouts section and select "Edit Bank / UPI Details". Any updated bank account or UPI ID is verified instantly without interrupting store operations.'
    }
  ];

  return (
    <SellerLayout currentTab="support" breadcrumb="Help & Support" onBack={onBack}>
      <div style={{ maxWidth: '1160px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* ─── 1. Page Header ─── */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 800, color: '#14281C', margin: 0, letterSpacing: '-0.03em' }}>
                Merchant Support
              </h1>
              <span style={{
                backgroundColor: '#EDFDF0',
                color: '#15803D',
                border: '1.5px solid #BBF7D0',
                fontSize: '12px',
                fontWeight: 700,
                padding: '4px 12px',
                borderRadius: '999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap'
              }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#16A34A', flexShrink: 0 }} />
                Support Desk · Active
              </span>
            </div>
            <p style={{ fontSize: '15px', color: '#687163', margin: 0, lineHeight: 1.6, maxWidth: '640px' }}>
              Direct operational support for store inquiries, fulfillment escalations, and return disputes.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                playClickSound();
                setShowCallHubModal(true);
              }}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1.5px solid #D4DEC8',
                borderRadius: '10px',
                padding: '11px 18px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#14281C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)'
              }}
            >
              <Phone size={16} color="#15803D" />
              <span>Call Hub Desk</span>
            </button>

            <button
              onClick={() => {
                playClickSound();
                setShowNewTicketModal(true);
              }}
              style={{
                backgroundColor: '#1E3827',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                padding: '11px 20px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 2px 8px rgba(30, 56, 39, 0.28)'
              }}
            >
              <Plus size={16} />
              <span>Create Ticket</span>
            </button>
          </div>
        </div>

        {/* ─── 2. Three Rapid Contact Channels ─── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '18px'
        }}>
          {/* Card 1: Hub Dispatch Controller */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E4E9DD',
            borderRadius: '18px',
            padding: '26px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#EDFDF0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Phone size={22} color="#15803D" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#EDFDF0', color: '#166534', padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.03em' }}>
                Phone Support
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#14281C', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                Hub Operations Desk
              </h3>
              <p style={{ fontSize: '13px', color: '#687163', margin: 0, lineHeight: 1.6 }}>
                Direct telephone line to hub supervisors for dispatch delays, order routing, and courier verification.
              </p>
            </div>
            <button
              onClick={() => {
                playTrialSound();
                showToast('Connecting to Hub Operations Desk (+91 80 4912 8820)...');
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F5F7F2',
                border: '1.5px solid #DCE2D5',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#14281C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>+91 80 4912 8820</span>
              <ArrowUpRight size={15} />
            </button>
          </div>

          {/* Card 2: Priority WhatsApp */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E4E9DD',
            borderRadius: '18px',
            padding: '26px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: '#EFF6FF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <MessageCircle size={22} color="#2563EB" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1D4ED8', padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.03em' }}>
                Direct Messaging
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#14281C', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                Partner Messaging Desk
              </h3>
              <p style={{ fontSize: '13px', color: '#687163', margin: 0, lineHeight: 1.6 }}>
                Send photos of return discrepancies or operational inquiries directly to your account manager.
              </p>
            </div>
            <button
              onClick={() => {
                playTrialSound();
                showToast('Opening Partner Support WhatsApp (+91 98765 01010)...');
              }}
              style={{
                width: '100%',
                padding: '12px 16px',
                backgroundColor: '#F5F7F2',
                border: '1.5px solid #DCE2D5',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#14281C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <span>+91 98765 01010</span>
              <ExternalLink size={15} />
            </button>
          </div>

          {/* Card 3: Premium Callback (dark treatment) */}
          <div style={{
            backgroundColor: '#0F2618',
            border: 'none',
            borderRadius: '18px',
            padding: '26px',
            boxShadow: '0 4px 16px rgba(15,38,24,0.28)',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '14px',
                backgroundColor: 'rgba(198,244,50,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Clock size={22} color="#C6F432" />
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'rgba(198,244,50,0.14)', color: '#C6F432', padding: '4px 10px', borderRadius: '6px', letterSpacing: '0.03em' }}>
                Callback Service
              </span>
            </div>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#FFFFFF', margin: '0 0 6px 0', letterSpacing: '-0.01em' }}>
                Request Callback
              </h3>
              <p style={{ fontSize: '13px', color: '#A5B89E', margin: 0, lineHeight: 1.6 }}>
                Request a direct callback from an operations specialist to your registered store phone number.
              </p>
            </div>
            <button
              onClick={() => {
                playClickSound();
                setShowCallbackModal(true);
              }}
              style={{
                width: '100%',
                padding: '13px 16px',
                backgroundColor: '#C6F432',
                border: 'none',
                borderRadius: '10px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#0F2618',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <Phone size={15} />
              <span>Request Callback</span>
            </button>
          </div>
        </div>

        {/* ─── 3. Support Tickets Console ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E4E9DD',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          {/* Section header */}
          <div style={{
            padding: '24px 28px',
            borderBottom: '1px solid #ECEEE7',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px',
            backgroundColor: '#FAFBF8'
          }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#14281C', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
                Support Tickets
              </h2>
              <p style={{ fontSize: '13px', color: '#687163', margin: 0 }}>
                Track and manage support inquiries, return disputes, and store requests.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Search */}
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#73796F" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search tickets or order ID..."
                  style={{
                    padding: '9px 14px 9px 36px',
                    borderRadius: '10px',
                    border: '1.5px solid #D4DEC8',
                    fontSize: '13px',
                    color: '#14281C',
                    outline: 'none',
                    width: '220px',
                    backgroundColor: '#FFFFFF'
                  }}
                />
              </div>

              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '4px', backgroundColor: '#EFF1EC', padding: '4px', borderRadius: '10px' }}>
                {[
                  { id: 'all', label: `All (${sellerTickets?.length || 0})` },
                  { id: 'active', label: `Open (${(sellerTickets || []).filter(t => t.status !== 'RESOLVED').length})` },
                  { id: 'resolved', label: `Resolved (${(sellerTickets || []).filter(t => t.status === 'RESOLVED').length})` }
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => { playClickSound(); setActiveFilter(f.id); }}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '7px',
                      border: 'none',
                      backgroundColor: activeFilter === f.id ? '#FFFFFF' : 'transparent',
                      color: activeFilter === f.id ? '#14281C' : '#687163',
                      fontWeight: activeFilter === f.id ? 700 : 500,
                      fontSize: '13px',
                      cursor: 'pointer',
                      boxShadow: activeFilter === f.id ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Ticket List */}
          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredTickets.length === 0 ? (
              <div style={{
                padding: '56px 20px',
                textAlign: 'center',
                backgroundColor: '#FAFBF8',
                borderRadius: '14px',
                border: '1.5px dashed #D4DEC8'
              }}>
                <CheckCircle2 size={40} color="#15803D" style={{ margin: '0 auto 12px' }} />
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#14281C', marginBottom: '4px' }}>No support tickets found</div>
                <div style={{ fontSize: '14px', color: '#687163' }}>There are currently no active support tickets or open disputes.</div>
              </div>
            ) : (
              filteredTickets.map((ticket) => (
                <div 
                  key={ticket.id}
                  onClick={() => handleOpenTicket(ticket)}
                  style={{
                    padding: '20px 22px',
                    borderRadius: '14px',
                    border: '1.5px solid #ECEEE7',
                    backgroundColor: '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#1E3827'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.06)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#ECEEE7'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.03)'; }}
                >
                  {/* Row 1: Meta tags + Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#14281C' }}>{ticket.id}</span>
                      <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#F3F4EE', color: '#4B5563', padding: '3px 10px', borderRadius: '6px' }}>
                        {ticket.category}
                      </span>
                      {ticket.orderId && (
                        <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#EFF6FF', color: '#1E40AF', padding: '3px 10px', borderRadius: '6px' }}>
                          Order {ticket.orderId}
                        </span>
                      )}
                      <span style={{
                        fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px',
                        backgroundColor: ticket.priority === 'HIGH' ? '#FEF2F2' : (ticket.priority === 'MEDIUM' ? '#FEF3C7' : '#F3F4F6'),
                        color: ticket.priority === 'HIGH' ? '#DC2626' : (ticket.priority === 'MEDIUM' ? '#D97706' : '#6B7280')
                      }}>
                        {ticket.priority === 'HIGH' ? 'High Priority' : ticket.priority === 'MEDIUM' ? 'Medium Priority' : 'Low Priority'}
                      </span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '999px',
                        backgroundColor: ticket.status === 'RESOLVED' ? '#EDFDF0' : (ticket.status === 'IN PROGRESS' ? '#EFF6FF' : '#FFF7ED'),
                        color: ticket.status === 'RESOLVED' ? '#15803D' : (ticket.status === 'IN PROGRESS' ? '#1D4ED8' : '#C2410C')
                      }}>
                        {ticket.status === 'RESOLVED' ? 'Resolved' : (ticket.status === 'IN PROGRESS' ? 'In Progress' : 'Awaiting Reply')}
                      </span>
                      <ChevronRight size={16} color="#73796F" />
                    </div>
                  </div>

                  {/* Row 2: Subject */}
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                    {ticket.subject}
                  </div>

                  {/* Row 3: Last message preview */}
                  <div style={{ fontSize: '13px', color: '#687163', lineHeight: 1.5, marginBottom: '12px' }}>
                    {ticket.messages && ticket.messages[ticket.messages.length - 1]?.text}
                  </div>

                  {/* Row 4: Footer */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F0F2EC', paddingTop: '10px' }}>
                    <span style={{ fontSize: '12px', color: '#73796F', fontWeight: 500 }}>Opened: {ticket.createdAt}</span>
                    <span style={{ fontSize: '13px', color: '#1E3827', fontWeight: 700 }}>View Thread</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ─── 4. FAQ & Knowledge Base ─── */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E4E9DD',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
        }}>
          <div style={{ padding: '24px 28px', borderBottom: '1px solid #ECEEE7', backgroundColor: '#FAFBF8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', backgroundColor: '#EFF5EE', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <FileText size={20} color="#1E3827" />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#14281C', margin: 0, letterSpacing: '-0.01em' }}>
                Frequently Asked Questions
              </h2>
            </div>
            <p style={{ fontSize: '13px', color: '#687163', margin: '8px 0 0 52px' }}>
              Operational guidelines for fulfillment, try-on returns, delivery SLAs, and payouts.
            </p>
          </div>

          <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {faqs.map((faq, idx) => {
              const isOpen = expandedFaq === idx;
              return (
                <div 
                  key={idx}
                  style={{
                    border: isOpen ? '1.5px solid #1E3827' : '1.5px solid #ECEEE7',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    transition: 'border-color 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => { playClickSound(); setExpandedFaq(isOpen ? null : idx); }}
                    style={{
                      width: '100%',
                      padding: '18px 20px',
                      backgroundColor: isOpen ? '#F5F9F4' : '#FFFFFF',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left',
                      gap: '16px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <span style={{
                        width: '24px', height: '24px', borderRadius: '50%',
                        backgroundColor: isOpen ? '#1E3827' : '#EFF1EC',
                        color: isOpen ? '#C6F432' : '#5A6553',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 800, flexShrink: 0, marginTop: '1px'
                      }}>
                        {idx + 1}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#14281C', lineHeight: 1.4 }}>
                        {faq.q}
                      </span>
                    </div>
                    <ChevronDown 
                      size={18} 
                      color={isOpen ? '#1E3827' : '#5A6553'} 
                      style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease', flexShrink: 0 }} 
                    />
                  </button>
                  {isOpen && (
                    <div style={{
                      padding: '6px 20px 20px 56px',
                      fontSize: '14px',
                      color: '#4A5A44',
                      lineHeight: 1.7,
                      backgroundColor: '#FAFBF8',
                      borderTop: '1px solid #E8EDE3'
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* =========================================================================
          MODAL 1: REPORT A PROBLEM / RAISE NEW SUPPORT TICKET
          ========================================================================= */}
      {showNewTicketModal && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(15,38,24,0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '580px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 24px 60px rgba(0,0,0,0.22)'
          }}>
            {/* Modal Header */}
            <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #ECEEE7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14281C', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
                    Create Support Ticket
                  </h3>
                  <p style={{ fontSize: '13px', color: '#687163', margin: 0 }}>
                    Submit an operational inquiry or dispute to the hub support team.
                  </p>
                </div>
                <button 
                  onClick={() => setShowNewTicketModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#73796F', borderRadius: '8px' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmitNewTicket} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#5A6553', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Category
                </label>
                <select
                  value={ticketCategory}
                  onChange={(e) => setTicketCategory(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #D4DEC8',
                    fontSize: '14px',
                    color: '#14281C',
                    backgroundColor: '#FAFBF8',
                    outline: 'none'
                  }}
                >
                  <option value="Rider / Delivery Partner Issue">Courier & Pickup Issue</option>
                  <option value="Try-On Return Dispute">Try-On Return Dispute</option>
                  <option value="Payout & Settlement">Payout & Bank Settlement</option>
                  <option value="Catalog / Stock Sync">Catalog & Stock Sync</option>
                  <option value="Store Operations">Store Operations & Hours</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#5A6553', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Order ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={ticketOrderId}
                    onChange={(e) => setTicketOrderId(e.target.value)}
                    placeholder="e.g. NV-1052"
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #D4DEC8',
                      fontSize: '14px',
                      boxSizing: 'border-box',
                      backgroundColor: '#FAFBF8',
                      outline: 'none'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#5A6553', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                    Priority
                  </label>
                  <select
                    value={ticketPriority}
                    onChange={(e) => setTicketPriority(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '10px',
                      border: '1.5px solid #D4DEC8',
                      fontSize: '14px',
                      color: '#14281C',
                      backgroundColor: '#FAFBF8',
                      outline: 'none'
                    }}
                  >
                    <option value="HIGH">High (Impacting Live Order)</option>
                    <option value="MEDIUM">Medium (Standard)</option>
                    <option value="LOW">Low (General Query)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#5A6553', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Subject
                </label>
                <input
                  type="text"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  placeholder="e.g. Returned trial sneaker missing barcode tag"
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #D4DEC8',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#5A6553', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Description
                </label>
                <textarea
                  rows={4}
                  value={ticketDescription}
                  onChange={(e) => setTicketDescription(e.target.value)}
                  placeholder="Provide details regarding the issue and requested resolution..."
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '10px',
                    border: '1.5px solid #D4DEC8',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    lineHeight: 1.6,
                    backgroundColor: '#FAFBF8',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Attachment */}
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#5A6553', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Attachment (Optional)
                </label>
                <div
                  style={{
                    border: '1.5px dashed #C8D4BF',
                    borderRadius: '10px',
                    padding: '18px',
                    textAlign: 'center',
                    backgroundColor: '#FAFBF8',
                    cursor: 'pointer'
                  }}
                  onClick={() => { setTicketAttachedFile('return_shoe_cctv_proof.jpg'); showToast('Photo proof attached: return_shoe_cctv_proof.jpg'); }}
                >
                  <Camera size={20} color="#73796F" style={{ margin: '0 auto 8px' }} />
                  <div style={{ fontSize: '13px', color: '#14281C', fontWeight: 600 }}>
                    {ticketAttachedFile ? `Attached: ${ticketAttachedFile}` : 'Click to attach photo or receipt document'}
                  </div>
                  <div style={{ fontSize: '12px', color: '#687163', marginTop: '3px' }}>JPG, PNG or PDF up to 10 MB</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '13px',
                    backgroundColor: '#1E3827',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Submit Ticket
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  style={{
                    padding: '13px 20px',
                    backgroundColor: '#FFFFFF',
                    color: '#14281C',
                    border: '1.5px solid #D4DEC8',
                    borderRadius: '12px',
                    fontSize: '14px',
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: TICKET CONVERSATION THREAD (COMMUNICATE WITH COMPANY)
          ========================================================================= */}
      {selectedTicket && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(20,40,28,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            maxWidth: '620px',
            width: '100%',
            height: '80vh',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            overflow: 'hidden'
          }}>
            {/* Thread Header */}
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #EAECE5',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FAFBF8'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 800, color: '#14281C' }}>{selectedTicket.id}</span>
                  <span style={{ fontSize: '11px', backgroundColor: '#EDFDF0', color: '#15803D', padding: '1px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {selectedTicket.status}
                  </span>
                </div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#4B5563' }}>
                  {selectedTicket.subject}
                </div>
              </div>

              <button 
                onClick={() => setSelectedTicket(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div style={{
              flex: 1,
              padding: '20px 24px',
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              backgroundColor: '#FAFBF8'
            }}>
              {selectedTicket.messages && selectedTicket.messages.map((msg) => {
                const isMerchant = msg.sender === 'merchant';
                return (
                  <div 
                    key={msg.id}
                    style={{
                      alignSelf: isMerchant ? 'flex-end' : 'flex-start',
                      maxWidth: '80%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMerchant ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div style={{ fontSize: '10px', color: '#73796F', marginBottom: '4px', fontWeight: 600 }}>
                      {msg.senderName} · {msg.time}
                    </div>
                    <div style={{
                      padding: '12px 16px',
                      borderRadius: isMerchant ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                      backgroundColor: isMerchant ? '#1E3827' : '#FFFFFF',
                      color: isMerchant ? '#FFFFFF' : '#14281C',
                      border: isMerchant ? 'none' : '1px solid #EAECE5',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
                    }}>
                      {msg.text}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Reply Input Box */}
            <form 
              onSubmit={handleSendTicketReply}
              style={{
                padding: '16px 20px',
                borderTop: '1px solid #EAECE5',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                gap: '10px',
                alignItems: 'center'
              }}
            >
              <input
                type="text"
                value={replyInput}
                onChange={(e) => setReplyInput(e.target.value)}
                placeholder="Type your reply..."
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #D4DEC8',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
              <button
                type="submit"
                style={{
                  backgroundColor: '#1E3827',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Send</span>
                <Send size={13} />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: REQUEST COUNTER CALLBACK
          ========================================================================= */}
      {showCallbackModal && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(15,38,24,0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 24px 60px rgba(0,0,0,0.22)'
          }}>
            <div style={{ padding: '26px 28px 20px', borderBottom: '1px solid #ECEEE7' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: 800, color: '#14281C', margin: '0 0 4px 0', letterSpacing: '-0.01em' }}>
                    Request Callback
                  </h3>
                  <p style={{ fontSize: '13px', color: '#687163', margin: 0 }}>
                    An operations specialist will call your registered phone number shortly.
                  </p>
                </div>
                <button 
                  onClick={() => setShowCallbackModal(false)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#73796F' }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <form onSubmit={handleRequestCallback} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#5A6553', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Phone Number
                </label>
                <input
                  type="text"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px',
                    borderRadius: '10px', border: '1.5px solid #D4DEC8',
                    fontSize: '14px', boxSizing: 'border-box',
                    backgroundColor: '#FAFBF8', outline: 'none'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '11px', fontWeight: 800, color: '#5A6553', marginBottom: '6px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Reason
                </label>
                <select
                  value={callbackTopic}
                  onChange={(e) => setCallbackTopic(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px',
                    borderRadius: '10px', border: '1.5px solid #D4DEC8',
                    fontSize: '14px', backgroundColor: '#FAFBF8', outline: 'none'
                  }}
                >
                  <option value="Urgent courier pickup assistance (Live Order)">Courier pickup or dispatch issue</option>
                  <option value="Doorstep try-on damaged return dispute">Try-on return dispute</option>
                  <option value="Payout or settlement discrepancy">Payout and settlement inquiry</option>
                  <option value="Store settings or emergency pause">Store operational hours or status</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                <button
                  type="submit"
                  style={{
                    flex: 1, padding: '13px',
                    backgroundColor: '#1E3827', color: '#FFFFFF',
                    border: 'none', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Request Callback
                </button>
                <button
                  type="button"
                  onClick={() => setShowCallbackModal(false)}
                  style={{
                    padding: '13px 20px',
                    backgroundColor: '#FFFFFF', color: '#14281C',
                    border: '1.5px solid #D4DEC8', borderRadius: '12px',
                    fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: EMERGENCY HUB HOTLINE CALL
          ========================================================================= */}
      {showCallHubModal && (
        <div style={{
          position: 'fixed', inset: 0,
          backgroundColor: 'rgba(15,38,24,0.55)',
          backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            maxWidth: '440px',
            width: '100%',
            padding: '36px 32px',
            textAlign: 'center',
            boxShadow: '0 24px 60px rgba(0,0,0,0.22)'
          }}>
            <div style={{
              width: '64px', height: '64px', borderRadius: '50%',
              backgroundColor: '#EDFDF0',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 18px'
            }}>
              <Phone size={28} color="#15803D" />
            </div>

            <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#14281C', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>
              Hub Support Desk
            </h3>
            <p style={{ fontSize: '14px', color: '#687163', margin: '0 0 22px 0', lineHeight: 1.6 }}>
              Direct telephone line for courier pickup delays, delivery reassignment, and dispatch escalations.
            </p>

            <div style={{
              backgroundColor: '#F5F7F2',
              borderRadius: '14px', padding: '18px', marginBottom: '22px',
              fontSize: '24px', fontWeight: 800, color: '#1E3827', letterSpacing: '2px'
            }}>
              +91 80 4912 8820
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => { playTrialSound(); showToast('Dialing Hub Support Desk (+91 80 4912 8820)...'); setShowCallHubModal(false); }}
                style={{
                  flex: 1, padding: '13px',
                  backgroundColor: '#1E3827', color: '#FFFFFF',
                  border: 'none', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                }}
              >
                <Phone size={16} />
                Call Support
              </button>
              <button
                onClick={() => setShowCallHubModal(false)}
                style={{
                  padding: '13px 20px',
                  backgroundColor: '#FFFFFF', color: '#14281C',
                  border: '1.5px solid #D4DEC8', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </SellerLayout>
  );
}
