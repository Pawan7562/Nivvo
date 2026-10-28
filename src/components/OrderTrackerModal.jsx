import React, { useState, useEffect } from 'react';
import { 
  X, 
  Clock, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  CheckCircle2, 
  Package, 
  Bike, 
  Layers, 
  Sparkles,
  Home,
  MessageSquare,
  FileText,
  Check,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  HelpCircle,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { cancelOrderApi, returnOrderApi, exchangeOrderApi } from '../services/api';
import { playClickSound, playOrderFanfare } from '../utils/audioEffects';
import LiveGpsMapTracker from './LiveGpsMapTracker';

export default function OrderTrackerModal({ 
  isOpen, 
  onClose, 
  orderDetails, 
  onOrderCancelled,
  onOpenSupport
}) {
  const [secondsRemaining, setSecondsRemaining] = useState(540); // 9 minutes
  const [activeStep, setActiveStep] = useState(2); // 0: placed, 1: packed, 2: dispatched, 3: arrived
  const [trialResolved, setTrialResolved] = useState(false);
  const [selectedKeptSize, setSelectedKeptSize] = useState('L');
  const [showInvoice, setShowInvoice] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([
    { sender: 'rider', text: 'Hi Aditya, your 10-min wardrobe bundle with both sizes is packed and safe. On my way on Hero EV!' }
  ]);

  // After-sales modals
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('Ordered wrong size / style');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelledSuccess, setCancelledSuccess] = useState(false);

  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnReason, setReturnReason] = useState('Fabric / fit preference');
  const [returnSuccess, setReturnSuccess] = useState(false);

  const [showExchangeModal, setShowExchangeModal] = useState(false);
  const [exchangeSize, setExchangeSize] = useState('XL');
  const [exchangeSuccess, setExchangeSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !orderDetails) return;
    try {
      confetti({ particleCount: 75, spread: 70, origin: { y: 0.6 } });
    } catch (e) {}

    // Synchronize active tracking step with real backend / delivery partner status
    if (orderDetails.status === 'Delivered & Completed') {
      setActiveStep(3);
      setSecondsRemaining(0);
    } else if (orderDetails.status === 'At Dark Store Hub - Collecting Garments' || orderDetails.status === 'Accepted - Reaching Hub') {
      setActiveStep(1);
    } else {
      setActiveStep(2);
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, orderDetails?.status]);

  if (!isOpen || !orderDetails) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const handleSimulateArrival = () => {
    playClickSound();
    setActiveStep(3);
    setSecondsRemaining(0);
    setChatHistory(prev => [
      ...prev,
      { sender: 'rider', text: 'I am at your doorstep with sizes M and L. Please take 3 mins to try them on!' }
    ]);
  };

  const handleCompleteTrial = (keptSize) => {
    playOrderFanfare();
    setSelectedKeptSize(keptSize);
    setTrialResolved(true);
    try {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.5 } });
    } catch (e) {}
  };

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    playClickSound();
    const res = await cancelOrderApi(orderDetails.orderId || orderDetails.order_id, cancelReason);
    setIsCancelling(false);
    setCancelledSuccess(true);
    setTimeout(() => {
      setShowCancelModal(false);
      if (onOrderCancelled) {
        onOrderCancelled(orderDetails.orderId || orderDetails.order_id);
      }
      onClose();
    }, 2400);
  };

  const handleConfirmReturn = async () => {
    playClickSound();
    await returnOrderApi(orderDetails.orderId || orderDetails.order_id, returnReason);
    setReturnSuccess(true);
    setTimeout(() => {
      setShowReturnModal(false);
    }, 2000);
  };

  const handleConfirmExchange = async () => {
    playClickSound();
    await exchangeOrderApi(orderDetails.orderId || orderDetails.order_id, exchangeSize, 'Size adjustment');
    setExchangeSuccess(true);
    setTimeout(() => {
      setShowExchangeModal(false);
    }, 2000);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    playClickSound();
    setChatHistory(prev => [
      ...prev,
      { sender: 'user', text: chatMessage.trim() }
    ]);
    setChatMessage('');
    setTimeout(() => {
      setChatHistory(prev => [
        ...prev,
        { sender: 'rider', text: 'Received! I am turning onto your street now, arriving in 2 minutes.' }
      ]);
    }, 1000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card tracker-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header - Timer Banner */}
        <div className="tracker-timer-hero">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '3px 10px', borderRadius: '99px' }}>
              ⚡ 10-MINUTE DOORSTEP FASHION DELIVERY
            </span>
            <button 
              onClick={onClose}
              style={{ color: '#FFFFFF', background: 'rgba(255,255,255,0.2)', borderRadius: '50%', padding: '4px', display: 'flex' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: '#FEF08A' }}>
            {orderDetails.status === 'Delivered & Completed' ? '🎉 Order Delivered & Handed Over' : (activeStep === 3 ? 'Rider Arrived at Doorstep!' : 'Arriving In')}
          </div>
          <div className="tracker-time-big">
            {orderDetails.status === 'Delivered & Completed' ? 'DELIVERED' : (activeStep === 3 ? '00:00' : formattedTime)}
          </div>
          <div className="tracker-subtext">
            Dispatched from <strong>{orderDetails.dark_store || 'Indiranagar Dark Store Hub #14 (0.6 km)'}</strong>
            <span style={{ display: 'block', fontSize: '11px', color: '#E2E8F0', marginTop: '3px' }}>
              📍 Delivering to: <strong>{orderDetails.address || 'B-42 Indiranagar, Bengaluru'}</strong>
            </span>
          </div>
        </div>

        {/* Real Leaflet Live GPS Map & Rider Tracking */}
        <LiveGpsMapTracker 
          address={orderDetails.address}
          darkStoreName={orderDetails.dark_store}
          activeStep={activeStep}
          onRiderArrived={handleSimulateArrival}
        />

        {/* Rider Contact Card */}
        <div className="rider-contact-card" style={{ marginTop: '14px' }}>
          <div className="rider-left">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80" 
              alt="Rider" 
              className="rider-avatar" 
            />
            <div>
              <div className="rider-name">Rahul Sharma (Hero EV)</div>
              <div className="rider-stats">
                <span>⚡ 4.9 ★</span> • <span>1,420 rapid fashion deliveries</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="otp-pill">
              OTP: <strong>{orderDetails.rider_otp || '7492'}</strong>
            </div>
            <a 
              href="tel:9876543210" 
              className="rider-call-btn"
              onClick={(e) => {
                e.preventDefault();
                alert("Calling Rahul Sharma (+91 98765-43210) via Nivvo Masked Line...");
              }}
            >
              <Phone size={13} />
              <span>Call</span>
            </a>
          </div>
        </div>

        {/* Doorstep 2-Size Trial Simulation Control */}
        <div className="trial-interactive-box">
          <div className="trial-interactive-header">
            <Layers size={18} color="#0C831F" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                Doorstep 2-Size Trial Engine
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>
                Rahul carries adjacent sizes (M & L). Try both on the spot for ₹0!
              </div>
            </div>
            {activeStep < 3 && (
              <button className="sim-arrival-btn" onClick={handleSimulateArrival}>
                Simulate Arrival
              </button>
            )}
          </div>

          {activeStep === 3 && !trialResolved && (
            <div className="trial-decision-panel">
              <span className="decision-title">Select which size you wish to keep:</span>
              <div className="decision-pills-row">
                <button 
                  className="decision-size-btn keep" 
                  onClick={() => handleCompleteTrial('Size L (Kept)')}
                >
                  <Check size={14} />
                  <span>Keep Size L (Hand back M)</span>
                </button>
                <button 
                  className="decision-size-btn keep" 
                  onClick={() => handleCompleteTrial('Size M (Kept)')}
                >
                  <Check size={14} />
                  <span>Keep Size M (Hand back L)</span>
                </button>
              </div>
            </div>
          )}

          {trialResolved && (
            <div className="trial-success-stamp">
              <CheckCircle2 size={18} color="#0C831F" />
              <span>{selectedKeptSize} verified & kept. Extra size collected by rider with ₹0 fee!</span>
            </div>
          )}
        </div>

        {/* Rider Quick In-App Chat */}
        <div className="in-app-chat-strip">
          <div className="chat-messages-scroll">
            {chatHistory.map((msg, i) => (
              <div key={i} className={`chat-bubble ${msg.sender}`}>
                <span className="bubble-sender">{msg.sender === 'rider' ? 'Rahul (Rider)' : 'You'}</span>
                <p className="bubble-text">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="chat-input-row">
            <input 
              type="text" 
              placeholder="Message rider (e.g. Leave at gate)..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              className="chat-field"
            />
            <button type="submit" className="chat-send-btn">
              <MessageSquare size={14} />
            </button>
          </form>
        </div>

        {/* Timeline Steps */}
        <div className="tracker-timeline">
          <div className="timeline-step">
            <div className="step-indicator done">
              <CheckCircle2 size={16} />
            </div>
            <div className="step-content">
              <h5>Order Confirmed & Payment Verified</h5>
              <p>Payment ID: {orderDetails.payment_id || orderDetails.paymentId || 'PAY-BW-98218'}</p>
            </div>
          </div>

          <div className="timeline-step">
            <div className="step-indicator done">
              <CheckCircle2 size={16} />
            </div>
            <div className="step-content">
              <h5>Steam-Pressed at 120°C in Crease-Free Bag</h5>
              <p>Fresh & wrinkle-free from Indiranagar Hub rack</p>
            </div>
          </div>

          <div className={`timeline-step ${activeStep >= 2 ? 'done' : ''}`}>
            <div className="step-indicator done">
              <Bike size={16} />
            </div>
            <div className="step-content">
              <h5>Out for Delivery (Hero EV)</h5>
              <p>Rider Rahul navigating with 2-size trial bundle</p>
            </div>
          </div>

          <div className={`timeline-step ${activeStep === 3 ? 'done' : ''}`}>
            <div className={`step-indicator ${activeStep === 3 ? 'done' : ''}`}>
              {activeStep === 3 ? <CheckCircle2 size={16} /> : <span>4</span>}
            </div>
            <div className="step-content">
              <h5>Doorstep 2-Size Trial & Hand-back</h5>
              <p>Try both sizes, hand back unwanted size, zero paperwork</p>
            </div>
          </div>
        </div>

        {/* GST Tax Invoice */}
        {showInvoice && (
          <div className="gst-invoice-box">
            <div className="invoice-header">
              <FileText size={16} color="#0C831F" />
              <strong>Official Tax Invoice & HSN Breakdown</strong>
            </div>
            <div className="invoice-lines">
              <div className="inv-row"><span>Items Total</span><span>₹{orderDetails.grandTotal || 499}</span></div>
              <div className="inv-row"><span>GST (5% Apparel HSN 6205)</span><span>₹{Math.round((orderDetails.grandTotal || 499) * 0.05)}</span></div>
              <div className="inv-row"><span>Dark Store Express Handling</span><span>₹35 (Waived FREE)</span></div>
              <div className="inv-row"><span>Doorstep 2-Size Trial</span><span>₹0 (FREE)</span></div>
              <div className="inv-row total"><span>Total Invoiced</span><span>₹{orderDetails.grandTotal || 499}</span></div>
            </div>
          </div>
        )}

        {/* Customer Actions Strip: Cancel / Return / Exchange / Help */}
        <div className="order-customer-actions-grid">
          {activeStep < 3 && (
            <button 
              className="order-action-pill-btn cancel"
              onClick={() => setShowCancelModal(true)}
            >
              <AlertTriangle size={13} />
              <span>Cancel Order</span>
            </button>
          )}

          {activeStep === 3 && (
            <>
              <button 
                className="order-action-pill-btn return"
                onClick={() => setShowReturnModal(true)}
              >
                <RotateCcw size={13} />
                <span>Return Item (Instant)</span>
              </button>
              <button 
                className="order-action-pill-btn exchange"
                onClick={() => setShowExchangeModal(true)}
              >
                <RefreshCw size={13} />
                <span>10-Min Exchange</span>
              </button>
            </>
          )}

          <button 
            className="order-action-pill-btn help"
            onClick={() => {
              if (onOpenSupport) onOpenSupport();
              onClose();
            }}
          >
            <HelpCircle size={13} />
            <span>Order Help</span>
          </button>
        </div>

        {/* Bottom Actions */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FFFFFF' }}>
          <div>
            <div style={{ fontSize: '10.5px', color: '#64748B' }}>Total Paid ({orderDetails.payment_method || 'UPI'})</div>
            <div style={{ fontSize: '18px', fontWeight: 900, color: '#0F172A' }}>₹{orderDetails.grandTotal || 499}</div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button 
              onClick={() => setShowInvoice(!showInvoice)}
              className="invoice-toggle-btn"
            >
              <FileText size={13} />
              <span>{showInvoice ? 'Hide Bill' : 'View Bill'}</span>
            </button>

            <button 
              onClick={onClose}
              style={{
                backgroundColor: '#0C831F',
                color: '#FFFFFF',
                padding: '9px 18px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: 800,
                cursor: 'pointer',
                border: 'none'
              }}
            >
              Done
            </button>
          </div>
        </div>

        {/* CANCEL MODAL */}
        {showCancelModal && (
          <div className="modal-overlay nested" onClick={() => setShowCancelModal(false)}>
            <div className="modal-card mini-action-dialog" onClick={(e) => e.stopPropagation()}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#991B1B', marginBottom: '8px' }}>
                Cancel 10-Minute Order?
              </h4>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                Your order will be stopped immediately. ₹{orderDetails.grandTotal || 499} will be refunded instantly back to your {orderDetails.payment_method || 'UPI'} account.
              </p>

              <label style={{ fontSize: '11px', fontWeight: 700, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Reason for Cancellation
              </label>
              <select 
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', marginBottom: '16px' }}
              >
                <option value="Ordered wrong size / style">Ordered wrong size / style</option>
                <option value="Need different delivery location">Need different delivery location</option>
                <option value="Wardrobe emergency resolved">Wardrobe emergency resolved</option>
                <option value="Ordered by mistake">Ordered by mistake</option>
              </select>

              {cancelledSuccess && (
                <div style={{ background: '#DCFCE7', color: '#15803D', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
                  ✓ Order Cancelled! Instant Refund of ₹{orderDetails.grandTotal || 499} Credited to your account.
                </div>
              )}

              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  onClick={() => setShowCancelModal(false)}
                  style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '12px', fontWeight: 700 }}
                >
                  Keep Order
                </button>
                <button 
                  onClick={handleConfirmCancel}
                  disabled={isCancelling || cancelledSuccess}
                  style={{ flex: 1, padding: '9px', borderRadius: '6px', border: 'none', background: '#DC2626', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                >
                  {isCancelling ? 'Processing Refund...' : 'Confirm & Refund'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* RETURN MODAL */}
        {showReturnModal && (
          <div className="modal-overlay nested" onClick={() => setShowReturnModal(false)}>
            <div className="modal-card mini-action-dialog" onClick={(e) => e.stopPropagation()}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                Doorstep Return Request
              </h4>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                Rider will arrive in 10 minutes to collect the garment in its original sleeve. Instant full refund of ₹{orderDetails.grandTotal || 499} issued upon pickup.
              </p>

              <select 
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '12px', marginBottom: '16px' }}
              >
                <option value="Fabric / fit preference">Fabric / fit preference</option>
                <option value="Color looks different">Color looks different</option>
                <option value="Does not suit occasion">Does not suit occasion</option>
              </select>

              {returnSuccess ? (
                <div style={{ background: '#DCFCE7', color: '#15803D', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
                  ✓ Return Scheduled! Rider arriving in 8-10 mins.
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setShowReturnModal(false)}
                    style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '12px', fontWeight: 700 }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmReturn}
                    style={{ flex: 1, padding: '9px', borderRadius: '6px', border: 'none', background: '#0C831F', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Schedule Pickup
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* EXCHANGE MODAL */}
        {showExchangeModal && (
          <div className="modal-overlay nested" onClick={() => setShowExchangeModal(false)}>
            <div className="modal-card mini-action-dialog" onClick={(e) => e.stopPropagation()}>
              <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginBottom: '8px' }}>
                10-Minute Dark Store Exchange
              </h4>
              <p style={{ fontSize: '12px', color: '#64748B', marginBottom: '14px' }}>
                Select replacement size. A rider will rush the new size to your door in 10 minutes and swap it on the spot!
              </p>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                {['S', 'M', 'L', 'XL', 'XXL'].map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setExchangeSize(sz)}
                    className={`apk-size-chip ${exchangeSize === sz ? 'active' : ''}`}
                  >
                    {sz}
                  </button>
                ))}
              </div>

              {exchangeSuccess ? (
                <div style={{ background: '#DCFCE7', color: '#15803D', padding: '10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, marginBottom: '12px', textAlign: 'center' }}>
                  ✓ Exchange Dispatched! New Size {exchangeSize} arriving in 8 mins.
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    onClick={() => setShowExchangeModal(false)}
                    style={{ flex: 1, padding: '9px', borderRadius: '6px', border: '1px solid #E2E8F0', background: '#F8FAFC', fontSize: '12px', fontWeight: 700 }}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleConfirmExchange}
                    style={{ flex: 1, padding: '9px', borderRadius: '6px', border: 'none', background: '#0C831F', color: '#FFFFFF', fontSize: '12px', fontWeight: 800, cursor: 'pointer' }}
                  >
                    Dispatch Size {exchangeSize}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
