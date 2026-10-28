import React, { useState, useRef, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowLeft, PhoneCall, Headphones, Check, CheckCircle2, 
  Send, X, Clock, MessageSquare, ChevronRight,
  MapPin, BatteryCharging, DollarSign, Package, Phone
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';

export default function NivvoRiderSupportView({ onBack }) {
  const { 
    riderProfile, 
    riderChatMessages, 
    sendRiderChatMessage, 
    riderCallbackRequest, 
    requestRiderCallback, 
    cancelRiderCallback, 
    showToast 
  } = useNivvo();

  const [isChatActive, setIsChatActive] = useState(false);
  const [chatInputText, setChatInputText] = useState('');
  const [showCallbackModal, setShowCallbackModal] = useState(false);
  const [callbackPhone, setCallbackPhone] = useState(riderProfile?.phone || '+91 98765 43210');
  const [callbackTopic, setCallbackTopic] = useState('Customer unreachable at door');
  const [callbackLang, setCallbackLang] = useState('English');
  const [callbackNotes, setCallbackNotes] = useState('');
  const [resolvedMessageIds, setResolvedMessageIds] = useState([]);

  const chatEndRef = useRef(null);

  // Auto-scroll on new messages when chat is active
  useEffect(() => {
    if (isChatActive) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [riderChatMessages, isChatActive]);

  const handleStartChat = (initialTopic) => {
    playClickSound();
    setIsChatActive(true);
    if (initialTopic) {
      sendRiderChatMessage(initialTopic, initialTopic);
    }
  };

  const handleSendMessage = (text, category) => {
    const msgText = (text || chatInputText).trim();
    if (!msgText) return;
    sendRiderChatMessage(msgText, category || 'Support Query');
    setChatInputText('');
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    if (!callbackPhone.trim()) {
      showToast('Please enter a valid phone number');
      return;
    }
    requestRiderCallback({
      phone: callbackPhone.trim(),
      topic: callbackTopic,
      notes: callbackNotes
    });
    setShowCallbackModal(false);
  };

  const commonIssues = [
    {
      title: 'Customer not answering door',
      icon: <Clock size={16} color="#1F4230" />,
      category: 'Customer Unreachable'
    },
    {
      title: 'Wrong delivery address / Gate locked',
      icon: <MapPin size={16} color="#1F4230" />,
      category: 'Address Guidance'
    },
    {
      title: 'EV battery swap station',
      icon: <BatteryCharging size={16} color="#1F4230" />,
      category: 'EV Battery'
    },
    {
      title: 'Payout or trip fee question',
      icon: <DollarSign size={16} color="#1F4230" />,
      category: 'Payout Inquiry'
    },
    {
      title: 'Damaged item or return issue',
      icon: <Package size={16} color="#1F4230" />,
      category: 'Packaging / Return'
    }
  ];

  return (
    <div style={{
      backgroundColor: '#F4F5EE',
      minHeight: '100%',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      paddingBottom: isChatActive ? '120px' : '96px'
    }}>
      
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
              onClick={() => {
                if (isChatActive) {
                  playClickSound();
                  setIsChatActive(false);
                } else {
                  onBack();
                }
              }} 
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#14281C',
                display: 'flex',
                alignItems: 'center',
                padding: '4px'
              }}
              title={isChatActive ? 'Back to Support Overview' : 'Back to Duty'}
              aria-label="Back"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>
                {isChatActive ? 'Dispatch Chat' : 'Delivery Support'}
              </div>
              <div style={{ fontSize: '11px', color: '#15803D', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803D' }} />
                <span>Live Dispatch · 24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Quick Call Action */}
          <button
            onClick={() => { playClickSound(); setShowCallbackModal(true); }}
            style={{
              backgroundColor: '#1F4230',
              color: '#FFFFFF',
              border: 'none',
              padding: '7px 12px',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
            title="Request a Call from Dispatch"
          >
            <PhoneCall size={12} color="#C6F432" />
            <span>Request Call</span>
          </button>
        </div>
      </div>

      {/* ─── Active Callback Status Alert ─── */}
      {riderCallbackRequest && (
        <div style={{
          backgroundColor: '#ECFDF5',
          borderBottom: '1px solid #A7F3D0',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
            <PhoneCall size={14} color="#059669" />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#065F46' }}>
                Dispatch calling {riderCallbackRequest.phone} (~2 mins)
              </div>
              <div style={{ fontSize: '10px', color: '#047857' }}>
                Topic: {riderCallbackRequest.topic}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            {!isChatActive && (
              <button
                onClick={() => handleStartChat()}
                style={{
                  backgroundColor: '#FFFFFF',
                  color: '#059669',
                  border: '1px solid #6EE7B7',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Chat
              </button>
            )}
            <button
              onClick={cancelRiderCallback}
              style={{
                background: 'none',
                border: 'none',
                color: '#DC2626',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ===================================================================
         VIEW 1: CLEAN SUPPORT OVERVIEW (When Chat is not active)
         =================================================================== */}
      {!isChatActive && (
        <div style={{
          padding: '14px 16px',
          maxWidth: '520px',
          margin: '0 auto',
          width: '100%',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          
          {/* Support Channel Cards: Chat & Call */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {/* Live Chat Card */}
            <div 
              onClick={() => handleStartChat()}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E7DE',
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                minHeight: '110px'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#1F4230',
                color: '#C6F432',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <MessageSquare size={16} />
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>
                  Live Chat
                </div>
                <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '2px' }}>
                  Instant messaging
                </div>
              </div>
            </div>

            {/* Request Callback Card */}
            <div 
              onClick={() => { playClickSound(); setShowCallbackModal(true); }}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '14px',
                border: '1px solid #E5E7DE',
                padding: '14px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                minHeight: '110px'
              }}
            >
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: '10px',
                backgroundColor: '#E8F5E9',
                color: '#15803D',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}>
                <Phone size={16} />
              </div>

              <div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#14281C' }}>
                  Request Call
                </div>
                <div style={{ fontSize: '11px', color: '#6B7265', marginTop: '2px' }}>
                  Callback in &lt; 2 mins
                </div>
              </div>
            </div>
          </div>

          {/* Common Issues Section */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E5E7DE',
            padding: '14px 16px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{
              fontSize: '11px',
              fontWeight: 800,
              color: '#6B7265',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              marginBottom: '10px'
            }}>
              Common Issues
            </div>

            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {commonIssues.map((issue, idx) => (
                <div
                  key={idx}
                  onClick={() => handleStartChat(issue.title)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '11px 0',
                    borderBottom: idx !== commonIssues.length - 1 ? '1px solid #F4F5EE' : 'none',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '8px',
                      backgroundColor: '#F4F5EE',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      {issue.icon}
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#14281C' }}>
                      {issue.title}
                    </span>
                  </div>
                  <ChevronRight size={15} color="#9CA3AF" />
                </div>
              ))}
            </div>
          </div>

          {/* Footer Note */}
          <div style={{
            textAlign: 'center',
            fontSize: '11px',
            color: '#8A9285',
            padding: '4px',
            fontWeight: 500
          }}>
            Indiranagar Hub #14 · 24/7 Dedicated Partner Dispatch
          </div>

        </div>
      )}

      {/* ===================================================================
         VIEW 2: CLEAN IN-CHAT CONVERSATION (When Chat is active)
         =================================================================== */}
      {isChatActive && (
        <>
          <div style={{
            padding: '12px 16px',
            maxWidth: '520px',
            margin: '0 auto',
            width: '100%',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            flex: 1
          }}>

            {/* Quick Topic Chips */}
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '4px', scrollbarWidth: 'none' }}>
              {[
                { label: 'Customer not answering', cat: 'Customer' },
                { label: 'Wrong address', cat: 'Address' },
                { label: 'EV battery station', cat: 'EV Battery' },
                { label: 'Payout inquiry', cat: 'Payout' },
                { label: 'Request Call', cat: 'Call Request', isCall: true }
              ].map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    if (chip.isCall) {
                      setShowCallbackModal(true);
                    } else {
                      handleSendMessage(chip.label, chip.cat);
                    }
                  }}
                  style={{
                    whiteSpace: 'nowrap',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E7DE',
                    padding: '6px 12px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: '#14281C',
                    cursor: 'pointer',
                    flexShrink: 0
                  }}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            {/* Message Stream */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
              {riderChatMessages?.map((msg) => {
                if (msg.sender === 'system') {
                  return (
                    <div
                      key={msg.id}
                      style={{
                        backgroundColor: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        textAlign: 'center',
                        fontSize: '12px',
                        color: '#065F46',
                        fontWeight: 600
                      }}
                    >
                      {msg.text}
                    </div>
                  );
                }

                const isRider = msg.sender === 'rider';

                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isRider ? 'flex-end' : 'flex-start',
                      gap: '3px'
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-end',
                      gap: '6px',
                      maxWidth: '85%'
                    }}>
                      {!isRider && (
                        <div style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '8px',
                          backgroundColor: '#1F4230',
                          color: '#C6F432',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0
                        }}>
                          <Headphones size={12} />
                        </div>
                      )}

                      <div style={{
                        backgroundColor: isRider ? '#1F4230' : '#FFFFFF',
                        color: isRider ? '#FFFFFF' : '#14281C',
                        padding: '10px 14px',
                        borderRadius: isRider ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                        border: isRider ? 'none' : '1px solid #E5E7DE',
                        fontSize: '13px',
                        lineHeight: 1.5,
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        whiteSpace: 'pre-line'
                      }}>
                        {msg.text}

                        {/* Resolution options */}
                        {msg.showCallbackPrompt && (
                          <div style={{
                            marginTop: '10px',
                            paddingTop: '8px',
                            borderTop: '1px solid #EAECE5',
                            display: 'flex',
                            gap: '8px'
                          }}>
                            {resolvedMessageIds.includes(msg.id) ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#15803D', fontSize: '11px', fontWeight: 700 }}>
                                <CheckCircle2 size={13} color="#15803D" />
                                <span>Resolved</span>
                              </div>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    playClickSound();
                                    setResolvedMessageIds(prev => [...prev, msg.id]);
                                    showToast('Issue marked as resolved');
                                  }}
                                  style={{
                                    backgroundColor: '#F4F5EE',
                                    color: '#15803D',
                                    border: '1px solid #C8E6C9',
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    cursor: 'pointer'
                                  }}
                                >
                                  Resolved
                                </button>

                                <button
                                  onClick={() => {
                                    playClickSound();
                                    setCallbackTopic(msg.topic || 'Support Chat Follow-up');
                                    setShowCallbackModal(true);
                                  }}
                                  style={{
                                    backgroundColor: '#1F4230',
                                    color: '#C6F432',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '6px',
                                    fontSize: '11px',
                                    fontWeight: 800,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px'
                                  }}
                                >
                                  <PhoneCall size={11} />
                                  <span>Request Call</span>
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <span style={{ fontSize: '10px', color: '#9CA3AF', paddingLeft: isRider ? 0 : '30px' }}>
                      {msg.time}
                    </span>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>

          </div>

          {/* Fixed Bottom Chat Input Bar */}
          <div style={{
            position: 'fixed',
            bottom: '56px',
            left: 0,
            right: 0,
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E5E7DE',
            padding: '8px 16px',
            zIndex: 35
          }}>
            <div style={{ maxWidth: '520px', margin: '0 auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input
                type="text"
                placeholder="Type your message..."
                value={chatInputText}
                onChange={(e) => setChatInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  borderRadius: '999px',
                  border: '1px solid #E5E7DE',
                  backgroundColor: '#F9FAF7',
                  fontSize: '13px',
                  color: '#14281C',
                  outline: 'none'
                }}
              />

              <button
                type="button"
                onClick={() => { playClickSound(); setShowCallbackModal(true); }}
                style={{
                  backgroundColor: '#F4F5EE',
                  border: '1px solid #E5E7DE',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1F4230',
                  cursor: 'pointer',
                  flexShrink: 0
                }}
                title="Request Callback"
              >
                <PhoneCall size={15} />
              </button>

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={!chatInputText.trim()}
                style={{
                  backgroundColor: chatInputText.trim() ? '#1F4230' : '#EAECE5',
                  color: chatInputText.trim() ? '#C6F432' : '#9CA3AF',
                  border: 'none',
                  borderRadius: '50%',
                  width: '38px',
                  height: '38px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: chatInputText.trim() ? 'pointer' : 'default',
                  flexShrink: 0
                }}
                aria-label="Send"
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Request Callback Modal ─── */}
      {showCallbackModal && (
        <div className="nivvo-modal-overlay" onClick={() => setShowCallbackModal(false)}>
          <div className="nivvo-modal-sheet" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <div className="nivvo-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#E8F5E9',
                  color: '#15803D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PhoneCall size={16} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 800, color: '#14281C' }}>
                    Request Callback
                  </h3>
                  <div style={{ fontSize: '11px', color: '#6B7265' }}>
                    A dispatcher will call your phone in &lt; 2 minutes
                  </div>
                </div>
              </div>
              <button className="nivvo-modal-close-btn" onClick={() => setShowCallbackModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCallbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7265', display: 'block', marginBottom: '4px' }}>
                  PHONE NUMBER
                </label>
                <input
                  type="tel"
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  placeholder="+91 98765 43210"
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #1F4230',
                    backgroundColor: '#F9FAF7',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#14281C',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7265', display: 'block', marginBottom: '4px' }}>
                  ISSUE CATEGORY
                </label>
                <select
                  value={callbackTopic}
                  onChange={(e) => setCallbackTopic(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7DE',
                    backgroundColor: '#F9FAF7',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#14281C',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="Customer unreachable at door">Customer unreachable at door</option>
                  <option value="Wrong delivery address / Gate locked">Wrong delivery address / Gate locked</option>
                  <option value="EV battery swap issue">EV battery swap issue</option>
                  <option value="Payout or tip discrepancy">Payout or tip discrepancy</option>
                  <option value="Damaged or rejected item">Damaged or rejected item</option>
                  <option value="Other urgent delivery issue">Other urgent delivery issue</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7265', display: 'block', marginBottom: '4px' }}>
                  PREFERRED LANGUAGE
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                  {['English', 'Kannada', 'Hindi'].map((lang) => (
                    <button
                      type="button"
                      key={lang}
                      onClick={() => setCallbackLang(lang)}
                      style={{
                        padding: '8px',
                        borderRadius: '8px',
                        border: callbackLang === lang ? '1.5px solid #1F4230' : '1px solid #E5E7DE',
                        backgroundColor: callbackLang === lang ? '#E8F5E9' : '#FFFFFF',
                        color: callbackLang === lang ? '#1F4230' : '#4B5563',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#6B7265', display: 'block', marginBottom: '4px' }}>
                  OPTIONAL NOTE
                </label>
                <textarea
                  rows="2"
                  placeholder="Briefly describe what happened..."
                  value={callbackNotes}
                  onChange={(e) => setCallbackNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #E5E7DE',
                    backgroundColor: '#F9FAF7',
                    fontSize: '12px',
                    color: '#14281C',
                    outline: 'none',
                    boxSizing: 'border-box',
                    fontFamily: 'inherit'
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: '#1F4230',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  padding: '12px',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(31,66,48,0.2)',
                  minHeight: '44px',
                  marginTop: '4px'
                }}
              >
                <PhoneCall size={15} color="#C6F432" />
                <span>Call Me Now</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
