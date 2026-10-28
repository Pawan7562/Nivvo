import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  RotateCcw, 
  Bike, 
  Receipt, 
  ArrowRight, 
  ShieldCheck, 
  ChevronLeft,
  AlertTriangle,
  RefreshCw,
  FileText,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { fetchOrders, cancelOrderApi, returnOrderApi, exchangeOrderApi } from '../services/api';
import { playAddSound, playClickSound } from '../utils/audioEffects';
import { downloadReceiptPdf } from '../utils/receiptGenerator';

export default function OrdersView({ 
  activeOrder, 
  onOpenActiveOrderTracker, 
  onNavigateHome, 
  onReorder,
  user,
  onOpenSupport
}) {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'delivered', 'cancelled'
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState(null);

  // Cancellation state
  const [cancellingOrderId, setCancellingOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState('Ordered wrong size / color');
  const [cancelMessage, setCancelMessage] = useState(null);

  // Return state
  const [returningOrderId, setReturningOrderId] = useState(null);
  const [returnReason, setReturnReason] = useState('Fabric / style preference');
  const [returnMessage, setReturnMessage] = useState(null);

  // Exchange state
  const [exchangingOrderId, setExchangingOrderId] = useState(null);
  const [exchangeSize, setExchangeSize] = useState('XL');
  const [exchangeMessage, setExchangeMessage] = useState(null);

  useEffect(() => {
    loadOrders();
  }, [activeOrder]);

  const loadOrders = async () => {
    const data = await fetchOrders(user?.phone || '+91 9876543210');
    if (data && data.orders && data.orders.length > 0) {
      setOrders(data.orders);
    } else {
      // Default fallback mock history if Neon DB is empty
      setOrders([
        {
          order_id: 'BW-948124',
          created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
          status: 'Delivered in 9 Mins',
          grand_total: 1299,
          payment_method: 'UPI (GPay)',
          payment_id: 'PAY-BW-948124-9128',
          address: 'B-42 Indiranagar, Bengaluru',
          dark_store: 'Indiranagar Hub #14',
          doorstep_trial_active: true,
          items: [
            {
              id: 'cas-1',
              name: 'Heavyweight 240 GSM Boxy Tee',
              price: 799,
              qty: 1,
              selectedSize: 'L',
              image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80'
            },
            {
              id: 'acc-1',
              name: 'Full-Grain Italian Leather Belt',
              price: 500,
              qty: 1,
              selectedSize: '34',
              image: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=300&auto=format&fit=crop&q=80'
            }
          ]
        }
      ]);
    }
  };

  const handleCancelOrder = async (orderId) => {
    playClickSound();
    const res = await cancelOrderApi(orderId, cancelReason);
    setCancelMessage(`Order ${orderId} cancelled. ₹${res?.refund?.amount || '499'} refunded instantly to ${res?.refund?.destination || 'UPI'}.`);
    loadOrders();
    setTimeout(() => {
      setCancellingOrderId(null);
      setCancelMessage(null);
    }, 3000);
  };

  const handleReturnOrder = async (orderId) => {
    playClickSound();
    await returnOrderApi(orderId, returnReason);
    setReturnMessage(`Return scheduled for ${orderId}. Dark store rider arrives in 10 mins to collect.`);
    loadOrders();
    setTimeout(() => {
      setReturningOrderId(null);
      setReturnMessage(null);
    }, 3000);
  };

  const handleExchangeOrder = async (orderId) => {
    playClickSound();
    await exchangeOrderApi(orderId, exchangeSize, 'Size adjustment');
    setExchangeMessage(`Exchange dispatched for ${orderId}! New size ${exchangeSize} arriving in 8-10 mins.`);
    loadOrders();
    setTimeout(() => {
      setExchangingOrderId(null);
      setExchangeMessage(null);
    }, 3000);
  };

  const filteredOrders = orders.filter(o => {
    if (activeTab === 'active') return o.status.toLowerCase().includes('out') || o.status.toLowerCase().includes('delivery') || o.status.toLowerCase().includes('progress');
    if (activeTab === 'delivered') return o.status.toLowerCase().includes('delivered');
    if (activeTab === 'cancelled') return o.status.toLowerCase().includes('cancel') || o.refund_status;
    return true;
  });

  return (
    <div className="blinkit-orders-page" style={{ paddingBottom: '96px', background: '#F4F6FB', minHeight: '100%' }}>
      {/* Native Toolbar */}
      <div className="apk-profile-toolbar">
        <button 
          className="apk-toolbar-back-btn" 
          onClick={() => { playClickSound(); if (onNavigateHome) onNavigateHome(); }}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#293142" />
        </button>
        <h1 className="apk-toolbar-title">Your Orders</h1>
      </div>

      <div style={{ padding: '14px' }}>
        {/* Active In-Flight Order Live Hero Banner */}
        {activeOrder && (
          <div 
            onClick={onOpenActiveOrderTracker}
            style={{
              background: 'linear-gradient(135deg, #0C831F 0%, #064E11 100%)',
              color: '#FFFFFF',
              borderRadius: '16px',
              padding: '18px 20px',
              marginBottom: '16px',
              boxShadow: '0 4px 16px rgba(12, 131, 31, 0.25)',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="order-pulse-dot" />
                <span style={{ fontSize: '11px', fontWeight: 800, background: 'rgba(255,255,255,0.2)', padding: '2px 8px', borderRadius: '99px' }}>
                  ⚡ LIVE 10-MIN DISPATCH
                </span>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#FEF08A' }}>Track Live →</span>
            </div>

            <div style={{ fontSize: '18px', fontWeight: 900, marginTop: '8px' }}>
              Order {activeOrder.order_id || activeOrder.orderId}
            </div>
            <div style={{ fontSize: '12.5px', color: '#E2E8F0', marginTop: '2px' }}>
              Arriving in 8 mins • Indiranagar Hub #14 • Total: ₹{activeOrder.grand_total || activeOrder.grandTotal}
            </div>
          </div>
        )}

        {/* Status Filter Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', paddingBottom: '4px' }}>
          {[
            { id: 'all', label: `All (${orders.length})` },
            { id: 'active', label: 'Live (10-Mins)' },
            { id: 'delivered', label: 'Delivered' },
            { id: 'cancelled', label: 'Cancelled & Refunds' }
          ].map(t => (
            <button
              key={t.id}
              className={`filter-pill ${activeTab === t.id ? 'active' : ''}`}
              onClick={() => { playClickSound(); setActiveTab(t.id); }}
              style={{ fontSize: '12px', padding: '6px 14px' }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Global Feedback Banners */}
        {cancelMessage && (
          <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
            ✓ {cancelMessage}
          </div>
        )}
        {returnMessage && (
          <div style={{ background: '#DCFCE7', border: '1px solid #86EFAC', color: '#15803D', padding: '12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
            ✓ {returnMessage}
          </div>
        )}
        {exchangeMessage && (
          <div style={{ background: '#F3E8FF', border: '1px solid #D8B4FE', color: '#7E22CE', padding: '12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700, marginBottom: '14px' }}>
            ⚡ {exchangeMessage}
          </div>
        )}

        {/* Orders List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
              <Package size={44} color="#94A3B8" style={{ margin: '0 auto 12px auto' }} />
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>No orders in this category</h3>
              <p style={{ fontSize: '12.5px', color: '#64748B', marginTop: '4px' }}>
                Your fast 10-minute wardrobe deliveries will appear here.
              </p>
              <button 
                onClick={onNavigateHome}
                style={{ marginTop: '16px', background: '#0C831F', color: '#FFFFFF', border: 'none', padding: '9px 18px', borderRadius: '8px', fontSize: '12.5px', fontWeight: 800, cursor: 'pointer' }}
              >
                Browse Storefront
              </button>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const isOrderActive = order.status?.toLowerCase().includes('out') || order.status?.toLowerCase().includes('progress');
              const isOrderDelivered = order.status?.toLowerCase().includes('delivered');
              const isOrderCancelled = order.status?.toLowerCase().includes('cancel');

              let itemsList = [];
              try {
                itemsList = typeof order.items === 'string' ? JSON.parse(order.items) : (order.items || []);
              } catch (e) {
                itemsList = [];
              }

              return (
                <div key={order.order_id || order.id} className="order-card-card">
                  {/* Order Top Bar */}
                  <div className="order-card-header">
                    <div>
                      <div className="order-card-id">Order {order.order_id}</div>
                      <div className="order-card-date">
                        {new Date(order.created_at || Date.now()).toLocaleString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span className={`order-status-badge ${isOrderActive ? 'active' : (isOrderCancelled ? 'cancelled' : 'delivered')}`}>
                        {order.status}
                      </span>
                      {order.refund_status && (
                        <div style={{ fontSize: '10px', color: '#0C831F', fontWeight: 800, marginTop: '3px' }}>
                          ✓ {order.refund_status}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order Items Preview */}
                  <div className="order-card-items-wrap">
                    {itemsList.map((item, idx) => (
                      <div key={idx} className="order-card-item-row">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {item.image && (
                            <img src={item.image} alt={item.name} style={{ width: '42px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                          )}
                          <div>
                            <div style={{ fontSize: '12.5px', fontWeight: 700, color: '#0F172A' }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: '11px', color: '#64748B' }}>
                              Size: <strong>{item.selectedSize || 'L'}</strong> • Qty: {item.qty || item.quantity || 1}
                            </div>
                          </div>
                        </div>
                        <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
                          ₹{(item.price || 499) * (item.qty || item.quantity || 1)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Payment and Hub Meta */}
                  <div className="order-card-meta-bar">
                    <div>
                      <span style={{ fontSize: '11px', color: '#64748B' }}>Paid via </span>
                      <strong style={{ fontSize: '11.5px', color: '#1E293B' }}>{order.payment_method || 'UPI'}</strong>
                      {order.payment_id && (
                        <span style={{ fontSize: '10.5px', color: '#94A3B8', marginLeft: '6px' }}>({order.payment_id})</span>
                      )}
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: 900, color: '#0F172A' }}>
                      Total: ₹{order.grand_total}
                    </div>
                  </div>

                  {/* Interactive Action Buttons per Order */}
                  <div className="order-card-action-bar">
                    {isOrderActive && (
                      <>
                        <button 
                          className="order-btn-primary"
                          onClick={onOpenActiveOrderTracker}
                        >
                          <Bike size={14} />
                          <span>Track Live Order</span>
                        </button>
                        <button 
                          className="order-btn-secondary danger"
                          onClick={() => setCancellingOrderId(order.order_id)}
                        >
                          <AlertTriangle size={13} />
                          <span>Cancel & Refund</span>
                        </button>
                      </>
                    )}

                    {isOrderDelivered && (
                      <>
                        <button 
                          className="order-btn-primary"
                          onClick={() => setExchangingOrderId(order.order_id)}
                        >
                          <RefreshCw size={13} />
                          <span>10-Min Exchange</span>
                        </button>
                        <button 
                          className="order-btn-secondary"
                          onClick={() => setReturningOrderId(order.order_id)}
                        >
                          <RotateCcw size={13} />
                          <span>Return Item</span>
                        </button>
                        <button 
                          className="order-btn-secondary"
                          onClick={() => {
                            if (onReorder) onReorder(order);
                          }}
                        >
                          <span>Reorder</span>
                        </button>
                      </>
                    )}

                    <button 
                      className="order-btn-secondary"
                      onClick={() => setSelectedOrderForInvoice(order)}
                    >
                      <FileText size={13} />
                      <span>Invoice</span>
                    </button>

                    <button 
                      className="order-btn-secondary"
                      onClick={() => {
                        if (onOpenSupport) onOpenSupport();
                      }}
                      title="Contact 24x7 Support"
                    >
                      <HelpCircle size={13} />
                      <span>Help</span>
                    </button>
                  </div>

                  {/* INLINE CANCEL FORM */}
                  {cancellingOrderId === order.order_id && (
                    <div className="order-inline-action-box">
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#991B1B', marginBottom: '6px' }}>
                        Confirm Cancellation of {order.order_id}
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '8px' }}>
                        Instant refund of ₹{order.grand_total} will be transferred to your {order.payment_method || 'UPI'}.
                      </p>
                      <select 
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="order-action-select"
                      >
                        <option value="Ordered wrong size / style">Ordered wrong size / style</option>
                        <option value="Need different delivery location">Need different delivery location</option>
                        <option value="Emergency resolved">Emergency resolved</option>
                        <option value="Ordered by mistake">Ordered by mistake</option>
                      </select>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button 
                          className="order-btn-secondary"
                          onClick={() => setCancellingOrderId(null)}
                        >
                          Dismiss
                        </button>
                        <button 
                          className="order-btn-primary danger"
                          onClick={() => handleCancelOrder(order.order_id)}
                        >
                          Confirm & Refund Instantly
                        </button>
                      </div>
                    </div>
                  )}

                  {/* INLINE RETURN FORM */}
                  {returningOrderId === order.order_id && (
                    <div className="order-inline-action-box">
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                        Schedule 10-Min Doorstep Return
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '8px' }}>
                        Our rider will pick up the garment in its original sleeve. Instant full refund of ₹{order.grand_total} credited on pickup.
                      </p>
                      <select 
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="order-action-select"
                      >
                        <option value="Fabric / fit preference">Fabric / fit preference</option>
                        <option value="Color looks different">Color looks different</option>
                        <option value="Does not suit occasion">Does not suit occasion</option>
                      </select>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                        <button 
                          className="order-btn-secondary"
                          onClick={() => setReturningOrderId(null)}
                        >
                          Dismiss
                        </button>
                        <button 
                          className="order-btn-primary"
                          onClick={() => handleReturnOrder(order.order_id)}
                        >
                          Confirm Return Pickup
                        </button>
                      </div>
                    </div>
                  )}

                  {/* INLINE EXCHANGE FORM */}
                  {exchangingOrderId === order.order_id && (
                    <div className="order-inline-action-box">
                      <div style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A', marginBottom: '6px' }}>
                        Request 10-Minute Dark Store Size Swap
                      </div>
                      <p style={{ fontSize: '11.5px', color: '#64748B', marginBottom: '8px' }}>
                        Select the new size you want. An EV delivery partner will bring it to your door in 10 minutes and swap it for ₹0 fee.
                      </p>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                        {['S', 'M', 'L', 'XL', 'XXL'].map(sz => (
                          <button
                            key={sz}
                            onClick={() => setExchangeSize(sz)}
                            className={`apk-size-chip ${exchangeSize === sz ? 'active' : ''}`}
                            style={{ padding: '6px 12px' }}
                          >
                            {sz}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          className="order-btn-secondary"
                          onClick={() => setExchangingOrderId(null)}
                        >
                          Dismiss
                        </button>
                        <button 
                          className="order-btn-primary"
                          onClick={() => handleExchangeOrder(order.order_id)}
                        >
                          Dispatch Size {exchangeSize} (8 Mins)
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Tax Invoice Modal */}
      {selectedOrderForInvoice && (
        <div className="modal-overlay" onClick={() => setSelectedOrderForInvoice(null)}>
          <div className="modal-card" style={{ maxWidth: '420px', padding: '20px' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #E2E8F0', paddingBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Receipt size={18} color="#0C831F" />
                <h4 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A' }}>Tax Invoice & HSN Receipt</h4>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedOrderForInvoice(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '11.5px', color: '#64748B', lineHeight: 1.5, marginBottom: '14px' }}>
              <div><strong>Nivvo Technologies Pvt. Ltd.</strong></div>
              <div>GSTIN: 29AABCU9603R1ZX • Indiranagar Hub #14</div>
              <div>Invoice No: INV-{selectedOrderForInvoice.order_id}</div>
              <div>Payment Reference: {selectedOrderForInvoice.payment_id || 'PAY-NV-SUCCESS'}</div>
            </div>

            <div className="gst-invoice-box" style={{ margin: 0 }}>
              <div className="invoice-lines">
                <div className="inv-row"><span>Items Net Value</span><span>₹{selectedOrderForInvoice.grand_total - 40}</span></div>
                <div className="inv-row"><span>GST (5% Apparel HSN 6205)</span><span>₹{Math.round(selectedOrderForInvoice.grand_total * 0.05)}</span></div>
                <div className="inv-row"><span>Delivery Partner Fee</span><span>₹35 (Waived FREE)</span></div>
                <div className="inv-row"><span>Doorstep 2-Size Trial Fee</span><span>₹0 (Complimentary)</span></div>
                <div className="inv-row total"><span>Total Invoiced & Paid</span><span>₹{selectedOrderForInvoice.grand_total}</span></div>
              </div>
            </div>

            <button 
              onClick={() => {
                downloadReceiptPdf({
                  id: selectedOrderForInvoice.order_id,
                  total: selectedOrderForInvoice.grand_total,
                  subtotal: selectedOrderForInvoice.subtotal,
                  items: selectedOrderForInvoice.items,
                  date: selectedOrderForInvoice.created_at
                }, { name: 'Aarav Shah', phone: '+91 98765 43210' });
                setSelectedOrderForInvoice(null);
              }}
              style={{
                width: '100%',
                marginTop: '16px',
                background: '#0C831F',
                color: '#FFFFFF',
                padding: '10px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '12.5px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Download PDF Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
