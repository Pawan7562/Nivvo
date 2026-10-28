import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowUpRight, Info, Check, RefreshCw, X, ShieldCheck, Printer, 
  Clock, AlertTriangle, User, MapPin, Phone, Bike, Plus, HelpCircle, CheckCircle2, RotateCcw, Star
} from 'lucide-react';
import { playClickSound, playTrialSound, playAddSound } from '../../utils/audioEffects';
import SellerLayout from '../../components/nivvo/SellerLayout';

export default function NivvoSellerOrdersView({ onBack }) {
  const { 
    showToast, 
    acceptMerchantOrder,
    dispatchMerchantOrder,
    verifyMerchantHandoverPin,
    rejectMerchantOrder,
    shopIncomingOrders
  } = useNivvo();

  const [activeFilter, setActiveFilter] = useState('active'); // 'active' | 'picked_up' | 'completed' | 'cancelled' | 'returns'
  const [countdownSeconds, setCountdownSeconds] = useState(102);
  const [simulatedCount, setSimulatedCount] = useState(0);

  // Modals state
  const [showHandoverModal, setShowHandoverModal] = useState(false);
  const [activeHandoverOrder, setActiveHandoverOrder] = useState(null);
  const [handoverPinInput, setHandoverPinInput] = useState('');
  
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectOrderId, setRejectOrderId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Out of physical stock');

  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);

  const [showPrintSlipModal, setShowPrintSlipModal] = useState(false);
  const [printSlipOrder, setPrintSlipOrder] = useState(null);

  // 10-Minute Doorstep Try-On Returns State
  const [tryOnReturns, setTryOnReturns] = useState([
    {
      id: 'RET-8812',
      orderId: 'NV-1048',
      customer: 'Aarav S.',
      phone: '+91 98112 34567',
      item: 'Everyday court sneaker',
      sizeReturned: 'UK 7 (Trial size)',
      sizeKept: 'UK 8 (Purchased)',
      reason: '10-minute trial: UK 8 fit like a glove',
      riderName: 'Ravi Kumar (DP-042)',
      riderPhone: '+91 98765 43210',
      pouchCondition: 'Tamper Seal Intact',
      time: '12 min ago',
      restocked: false
    },
    {
      id: 'RET-8809',
      orderId: 'NV-1045',
      customer: 'Ishita D.',
      phone: '+91 99008 77654',
      item: 'Cloud slide slipper',
      sizeReturned: 'Charcoal Foam · UK 6 (Trial size)',
      sizeKept: 'UK 5 (Purchased)',
      reason: 'Customer kept UK 5 after doorstep try-on',
      riderName: 'Kiran M. (DP-031)',
      riderPhone: '+91 99008 12345',
      pouchCondition: 'Tamper Seal Intact',
      time: '35 min ago',
      restocked: true
    }
  ]);

  const handleRestockReturn = (retId) => {
    playTrialSound();
    setTryOnReturns(prev => prev.map(r => {
      if (r.id === retId) {
        return { ...r, restocked: true };
      }
      return r;
    }));
    showToast('Trial pair inspected and restocked to shelf inventory (+1).');
  };

  const handleOpenPrintSlip = (order) => {
    playClickSound();
    setPrintSlipOrder(order);
    setShowPrintSlipModal(true);
  };

  // Countdown timer for incoming order (Figma 01:42 left)
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSeconds(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatCountdown = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // State-tracked active orders
  const [ordersState, setOrdersState] = useState({
    'NV-1052': {
      id: 'NV-1052',
      stage: 'new',
      customer: 'Meera N.',
      phone: '+91 98450 12849',
      address: 'Apartment 402, Prestige Palms, 12th Main Indiranagar',
      receivedTime: '2:45 pm',
      item: 'Two-strap leather sandal',
      variant: 'Tan · UK 7 · Qty 1',
      price: '₹899',
      image: '/assets/figma/product_sandals.png',
      prepTime: 'Target prep 4–6 min',
      stockNote: 'Stock available: 5 units',
      riderName: 'Assigning nearest partner...',
      riderPhone: '+91 98765 43210',
      riderVehicle: 'EV 2W',
      pin: '4812'
    },
    'NV-1051': {
      id: 'NV-1051',
      stage: 'preparing',
      customer: 'Aditya K.',
      phone: '+91 99801 44520',
      address: 'Villa 18, 100ft Road Defence Colony, Indiranagar',
      receivedTime: '2:42 pm',
      item: 'Canvas weekend sneaker',
      variant: 'Ivory · UK 9 · Qty 1',
      price: '₹999',
      image: '/assets/figma/product_weekend_sneaker.png',
      dueTime: 'Due 2:49 pm',
      riderNote: 'Rider Sanjay is 0.4 km away · ETA 3 min',
      riderName: 'Sanjay Rawat',
      riderPhone: '+91 91234 56789',
      riderVehicle: 'Ather 450X · KA-03-JJ-4421',
      pin: '4812'
    },
    'NV-1049': {
      id: 'NV-1049',
      stage: 'ready',
      customer: 'Nisha P.',
      phone: '+91 97410 33902',
      address: 'Flat 3B, Cambridge Layout, Near Shanthi Sagar',
      receivedTime: '2:37 pm',
      item: 'Everyday court sneaker',
      variant: 'Sage / Ivory · UK 6 · Qty 1',
      price: '₹1,299',
      image: '/assets/figma/product_court_sneaker.png',
      readyTime: 'Ready at 2:43 pm',
      riderNote: 'Rider Priya has arrived at storefront · Verify handover PIN',
      riderName: 'Priya Sharma',
      riderPhone: '+91 98451 99201',
      riderVehicle: 'Ola S1 Pro · KA-01-HA-9821',
      pin: '4812'
    }
  });

  // Recently handed over table rows
  const [handedOverList, setHandedOverList] = useState([
    {
      order: 'NV-1048',
      desc: 'Aarav S. · Court sneaker, UK 8',
      val: '₹1,299',
      rider: 'Ravi Kumar · DP-042',
      handover: '2:39 pm',
      customer: 'Aarav S.',
      phone: '+91 98112 34567',
      address: 'House 88, 4th Cross, Indiranagar 1st Stage',
      item: 'Everyday court sneaker',
      variant: 'Sage / Ivory · UK 8 · Qty 1',
      price: '₹1,299',
      image: '/assets/figma/product_court_sneaker.png'
    },
    {
      order: 'NV-1045',
      desc: 'Ishita D. · Cloud slide, UK 5',
      val: '₹599',
      rider: 'Kiran M. · DP-031',
      handover: '2:24 pm',
      customer: 'Ishita D.',
      phone: '+91 99008 77654',
      address: 'Sobha Lavender, Indiranagar BDA Complex',
      item: 'Cloud slide slipper',
      variant: 'Charcoal Foam · UK 5 · Qty 1',
      price: '₹599',
      image: '/assets/figma/cat_footwear.png'
    }
  ]);

  // Cancelled orders log
  const [cancelledList, setCancelledList] = useState([]);

  // Sync live incoming orders from context
  useEffect(() => {
    if (!shopIncomingOrders || shopIncomingOrders.length === 0) return;
    setOrdersState(prev => {
      const next = { ...prev };
      shopIncomingOrders.forEach(o => {
        if (!next[o.id] && o.status !== 'picked_up' && o.status !== 'rejected') {
          next[o.id] = {
            id: o.id,
            stage: o.status || 'new',
            customer: o.customer || o.customer_name || 'Customer',
            phone: o.phone || o.customer_phone || '+91 98450 12849',
            address: o.deliveryAddress || 'Apartment 402, Prestige Palms, Indiranagar',
            receivedTime: o.time || 'Just now',
            item: (o.fullItems && o.fullItems[0]?.name) || o.item_name || (o.items && o.items[0]) || 'Two-strap leather sandal',
            variant: (o.fullItems && `${o.fullItems[0]?.color || 'Tan'} · ${o.fullItems[0]?.size || 'UK 7'} · Qty ${o.fullItems[0]?.quantity || 1}`) || o.variant || 'Standard',
            price: o.amount || '₹899',
            image: (o.fullItems && o.fullItems[0]?.image) || o.image || '/assets/figma/product_sandals.png',
            prepTime: 'Target prep 4–6 min',
            stockNote: 'Stock verified in Indiranagar',
            riderName: o.courier?.name || 'Ravi Kumar',
            riderPhone: o.courier?.phone || '+91 98450 12345',
            riderVehicle: o.courier?.vehicle || 'Ather 450X',
            pin: o.handoverOtp || o.pickup_pin || '4812'
          };
        } else if (next[o.id] && o.status && next[o.id].stage !== o.status && o.status !== 'picked_up') {
          next[o.id] = { ...next[o.id], stage: o.status };
        }
      });
      return next;
    });
  }, [shopIncomingOrders]);

  // Accept incoming order handler
  const handleAcceptOrder = (orderId) => {
    playTrialSound();
    acceptMerchantOrder(orderId);
    setOrdersState(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        stage: 'preparing',
        dueTime: 'Due in 5 mins',
        riderNote: 'Rider Sanjay is 0.4 km away · ETA 3 min',
        riderName: 'Sanjay Rawat',
        riderPhone: '+91 91234 56789',
        riderVehicle: 'Ather 450X · KA-03-JJ-4421'
      }
    }));
    showToast(`Order ${orderId} accepted. 5-minute prep timer running.`);
  };

  // Reject modal opener
  const handleOpenReject = (orderId) => {
    playClickSound();
    setRejectOrderId(orderId);
    setShowRejectModal(true);
  };

  // Reject confirmation
  const handleConfirmReject = () => {
    playClickSound();
    if (!rejectOrderId) return;
    const target = ordersState[rejectOrderId];
    setCancelledList(prev => [
      {
        order: target.id,
        desc: `${target.customer} · ${target.item}`,
        reason: rejectReason,
        time: 'Just now'
      },
      ...prev
    ]);

    setOrdersState(prev => {
      const copy = { ...prev };
      delete copy[rejectOrderId];
      return copy;
    });

    if (rejectMerchantOrder) {
      rejectMerchantOrder(rejectOrderId, rejectReason);
    }

    setShowRejectModal(false);
    showToast(`Order ${rejectOrderId} declined: "${rejectReason}". Customer alerted.`);
  };

  // Mark ready for pickup handler
  const handleMarkReady = (orderId) => {
    playTrialSound();
    dispatchMerchantOrder(orderId);
    setOrdersState(prev => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        stage: 'ready',
        readyTime: 'Ready now',
        riderNote: 'Rider Priya has arrived at storefront · Verify handover PIN',
        riderName: 'Priya Sharma',
        riderPhone: '+91 98451 99201',
        riderVehicle: 'Ola S1 Pro · KA-01-HA-9821',
        pin: '4812'
      }
    }));
    showToast(`Order ${orderId} packed and sealed. Ready for courier.`);
  };

  // Open Handover PIN verification modal
  const handleOpenVerifyPin = (orderId) => {
    playClickSound();
    const ord = ordersState[orderId];
    setActiveHandoverOrder(ord);
    setHandoverPinInput('');
    setShowHandoverModal(true);
  };

  // Confirm Handover PIN
  const handleConfirmHandoverPin = (e) => {
    e?.preventDefault();
    if (!activeHandoverOrder) return;
    
    // Check PIN (default demo PIN is 4812)
    if (handoverPinInput.trim() !== '4812' && handoverPinInput.trim() !== activeHandoverOrder.pin) {
      showToast('Incorrect Delivery Partner PIN. Please enter 4812 or ask rider.');
      return;
    }

    playTrialSound();
    const completedObj = {
      order: activeHandoverOrder.id,
      desc: `${activeHandoverOrder.customer} · ${activeHandoverOrder.item.split(' ')[0]} sneaker, ${activeHandoverOrder.variant.split('·')[1]?.trim() || 'UK 8'}`,
      val: activeHandoverOrder.price,
      rider: `${activeHandoverOrder.riderName || 'Priya Sharma'} · DP-${Math.floor(10 + Math.random() * 80)}`,
      handover: 'Just now',
      customer: activeHandoverOrder.customer,
      phone: activeHandoverOrder.phone,
      address: activeHandoverOrder.address,
      item: activeHandoverOrder.item,
      variant: activeHandoverOrder.variant,
      price: activeHandoverOrder.price,
      image: activeHandoverOrder.image
    };

    setHandedOverList(prev => [completedObj, ...prev]);

    // Remove from active Kanban
    setOrdersState(prev => {
      const copy = { ...prev };
      delete copy[activeHandoverOrder.id];
      return copy;
    });

    if (verifyMerchantHandoverPin) {
      verifyMerchantHandoverPin(activeHandoverOrder.id);
    }

    setShowHandoverModal(false);
    showToast(`Handover verified. Order ${activeHandoverOrder.id} dispatched with courier.`);
  };

  // Simulate new incoming order
  const handleSimulateOrder = () => {
    playAddSound();
    const newIdx = 1053 + simulatedCount;
    setSimulatedCount(prev => prev + 1);
    const newId = `NV-${newIdx}`;
    
    const mockCustomers = ['Pooja V.', 'Vikram R.', 'Rhea Menon', 'Tarun S.', 'Divya Bose'];
    const chosenCust = mockCustomers[simulatedCount % mockCustomers.length];

    setOrdersState(prev => ({
      ...prev,
      [newId]: {
        id: newId,
        stage: 'new',
        customer: chosenCust,
        phone: '+91 98450 ' + Math.floor(10000 + Math.random() * 89999),
        address: 'Villa 44, Indiranagar 12th Main Road, Bengaluru',
        receivedTime: 'Just now',
        item: 'Everyday court sneaker',
        variant: 'Sage / Ivory · UK 8 · Qty 1',
        price: '₹1,299',
        image: '/assets/figma/product_court_sneaker.png',
        prepTime: 'Target prep 4–6 min',
        stockNote: 'Stock available: 3 units',
        riderName: 'Assigning partner...',
        riderPhone: '+91 98765 43210',
        riderVehicle: 'EV 2W',
        pin: '4812'
      }
    }));

    setCountdownSeconds(120);
    showToast(`New incoming order ${newId} received for ${chosenCust}.`);
  };

  // Add 2 min buffer to active preps
  const handleAddBuffer = () => {
    playTrialSound();
    setOrdersState(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(k => {
        if (updated[k].stage === 'preparing') {
          updated[k].dueTime = 'Due in 7 mins (+2m buffer)';
        }
      });
      return updated;
    });
    showToast('+2 min preparation buffer added to active orders.');
  };

  const newOrders = Object.values(ordersState).filter(o => o.stage === 'new');
  const preparingOrders = Object.values(ordersState).filter(o => o.stage === 'preparing');
  const readyOrders = Object.values(ordersState).filter(o => o.stage === 'ready');
  const totalActive = newOrders.length + preparingOrders.length + readyOrders.length;

  return (
    <SellerLayout currentTab="orders" breadcrumb="Incoming orders" onBack={onBack}>
      <div className="nivvo-seller-screen" style={{ display: 'flex', flexDirection: 'column', gap: '28px', position: 'relative' }}>
        
        {/* 1. Header Title & Actions matching Figma */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 6px 0',
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#14281C'
            }}>
              Incoming orders
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#56634F', lineHeight: '1.5' }}>
              Manage, prepare, and handover orders for instant delivery.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={handleSimulateOrder}
              style={{
                backgroundColor: '#1E3827',
                border: 'none',
                borderRadius: '11px',
                padding: '11px 18px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#B8F135',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
              }}
            >
              <Plus size={16} />
              <span>Simulate order</span>
            </button>

            <button
              onClick={() => showToast('Auto-accept rules: Orders within 5 km auto-confirmed if stock > 2')}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D8DCD2',
                borderRadius: '11px',
                padding: '11px 18px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#14281C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
              }}
            >
              <span>Order settings</span>
            </button>
          </div>
        </div>

        {/* 2. Filter Pills & Auto-refresh status */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '4px' }}>
            <button
              onClick={() => { playClickSound(); setActiveFilter('active'); }}
              style={{
                backgroundColor: activeFilter === 'active' ? '#1E3827' : '#FFFFFF',
                color: activeFilter === 'active' ? '#FFFFFF' : '#14281C',
                border: activeFilter === 'active' ? 'none' : '1px solid #D8DCD2',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Active ({totalActive})
            </button>

            <button
              onClick={() => { playClickSound(); setActiveFilter('picked_up'); }}
              style={{
                backgroundColor: activeFilter === 'picked_up' ? '#1E3827' : '#FFFFFF',
                color: activeFilter === 'picked_up' ? '#FFFFFF' : '#14281C',
                border: activeFilter === 'picked_up' ? 'none' : '1px solid #D8DCD2',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Picked up ({handedOverList.length})
            </button>

            <button
              onClick={() => { playClickSound(); setActiveFilter('completed'); }}
              style={{
                backgroundColor: activeFilter === 'completed' ? '#1E3827' : '#FFFFFF',
                color: activeFilter === 'completed' ? '#FFFFFF' : '#14281C',
                border: activeFilter === 'completed' ? 'none' : '1px solid #D8DCD2',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Completed (17)
            </button>

            <button
              onClick={() => { playClickSound(); setActiveFilter('cancelled'); }}
              style={{
                backgroundColor: activeFilter === 'cancelled' ? '#1E3827' : '#FFFFFF',
                color: activeFilter === 'cancelled' ? '#FFFFFF' : '#14281C',
                border: activeFilter === 'cancelled' ? 'none' : '1px solid #D8DCD2',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Declined ({cancelledList.length})
            </button>

            <button
              onClick={() => { playClickSound(); setActiveFilter('returns'); }}
              style={{
                backgroundColor: activeFilter === 'returns' ? '#1E3827' : '#FFF7ED',
                color: activeFilter === 'returns' ? '#FFFFFF' : '#C2410C',
                border: activeFilter === 'returns' ? 'none' : '1px solid #FED7AA',
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <RotateCcw size={14} />
              <span>Returns ({tryOnReturns.filter(r => !r.restocked).length})</span>
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#14281C',
            fontWeight: 600
          }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#15803D' }} />
            <span>Live sync active</span>
          </div>
        </div>

        {/* 3. Conditional View: Active Kanban OR History Tables */}
        {activeFilter === 'active' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
            gap: '20px'
          }}>
            {/* Column 1: New */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '0 4px'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#14281C' }}>
                  New ({newOrders.length})
                </span>
              </div>

              {newOrders.length === 0 ? (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px dashed #DCE0D5',
                  borderRadius: '16px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  color: '#73796F',
                  fontSize: '13px'
                }}>
                  No new orders waiting. Click "Simulate order" to test.
                </div>
              ) : (
                newOrders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #ECEEE7',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      marginBottom: '14px'
                    }}
                  >
                    <div 
                      onClick={() => { playClickSound(); setSelectedOrderDetails(ord); setShowOrderDetailsModal(true); }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#14281C' }}>
                          {ord.id}
                        </span>
                        <span style={{ fontSize: '11px', color: '#855700', fontWeight: 600 }}>
                          New · {formatCountdown(countdownSeconds)} left
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#73796F', marginBottom: '14px' }}>
                        {ord.customer} · Received {ord.receivedTime}
                      </div>

                      {/* Product Lockup */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '10px',
                          backgroundColor: '#EBE5D8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img src={ord.image} alt={ord.item} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#14281C' }}>
                            {ord.item}
                          </div>
                          <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px' }}>
                            {ord.variant}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C', marginTop: '4px' }}>
                            Payout: {ord.price || ord.amount}
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #F0F2ED', paddingTop: '12px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#14281C' }}>
                          {ord.stockNote} · {ord.prepTime}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                      <button
                        onClick={() => handleAcceptOrder(ord.id)}
                        style={{
                          flex: 1,
                          padding: '11px',
                          backgroundColor: '#B8F135',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#14281C',
                          cursor: 'pointer'
                        }}
                      >
                        Accept & start preparing
                      </button>
                      <button
                        onClick={() => handleOpenPrintSlip(ord)}
                        title="Print thermal packing slip"
                        style={{
                          padding: '11px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D4DEC8',
                          borderRadius: '10px',
                          color: '#14281C',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Printer size={14} />
                      </button>
                    </div>

                    <div style={{ textAlign: 'left' }}>
                      <button
                        onClick={() => handleOpenReject(ord.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          padding: 0,
                          fontSize: '11px',
                          color: '#73796F',
                          cursor: 'pointer'
                        }}
                      >
                        Decline order
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Column 2: Preparing */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '0 4px'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#14281C' }}>
                  Preparing ({preparingOrders.length})
                </span>
              </div>

              {preparingOrders.length === 0 ? (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px dashed #DCE0D5',
                  borderRadius: '16px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  color: '#73796F',
                  fontSize: '13px'
                }}>
                  No orders currently in preparation.
                </div>
              ) : (
                preparingOrders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #ECEEE7',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      marginBottom: '14px'
                    }}
                  >
                    <div 
                      onClick={() => { playClickSound(); setSelectedOrderDetails(ord); setShowOrderDetailsModal(true); }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#14281C' }}>
                          {ord.id}
                        </span>
                        <span style={{ fontSize: '11px', color: '#1E3827', fontWeight: 600 }}>
                          {ord.dueTime}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#73796F', marginBottom: '14px' }}>
                        {ord.customer} · Received {ord.receivedTime}
                      </div>

                      {/* Product Lockup */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '10px',
                          backgroundColor: '#EBE5D8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img src={ord.image} alt={ord.item} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#14281C' }}>
                            {ord.item}
                          </div>
                          <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px' }}>
                            {ord.variant}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C', marginTop: '4px' }}>
                            Payout: {ord.price || ord.amount}
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #F0F2ED', paddingTop: '12px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#14281C' }}>
                          {ord.riderNote}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleMarkReady(ord.id)}
                        style={{
                          flex: 1,
                          padding: '11px',
                          backgroundColor: '#B8F135',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#14281C',
                          cursor: 'pointer'
                        }}
                      >
                        Mark ready for pickup
                      </button>
                      <button
                        onClick={() => handleOpenPrintSlip(ord)}
                        title="Print thermal packing slip"
                        style={{
                          padding: '11px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D4DEC8',
                          borderRadius: '10px',
                          color: '#14281C',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Printer size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Column 3: Ready for pickup */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '0 4px'
              }}>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#14281C' }}>
                  Ready for pickup ({readyOrders.length})
                </span>
              </div>

              {readyOrders.length === 0 ? (
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px dashed #DCE0D5',
                  borderRadius: '16px',
                  padding: '30px 20px',
                  textAlign: 'center',
                  color: '#73796F',
                  fontSize: '13px'
                }}>
                  No packages currently waiting for courier pickup.
                </div>
              ) : (
                readyOrders.map((ord) => (
                  <div
                    key={ord.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #ECEEE7',
                      borderRadius: '16px',
                      padding: '20px',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      marginBottom: '14px'
                    }}
                  >
                    <div 
                      onClick={() => { playClickSound(); setSelectedOrderDetails(ord); setShowOrderDetailsModal(true); }}
                      style={{ cursor: 'pointer' }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 700, color: '#14281C' }}>
                          {ord.id}
                        </span>
                        <span style={{ fontSize: '11px', color: '#73796F' }}>
                          {ord.readyTime}
                        </span>
                      </div>

                      <div style={{ fontSize: '12px', color: '#73796F', marginBottom: '14px' }}>
                        {ord.customer} · Received {ord.receivedTime}
                      </div>

                      {/* Product Lockup */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                        <div style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '10px',
                          backgroundColor: '#EBE5D8',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          flexShrink: 0
                        }}>
                          <img src={ord.image} alt={ord.item} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                        </div>
                        <div>
                          <div style={{ fontSize: '13px', fontWeight: 600, color: '#14281C' }}>
                            {ord.item}
                          </div>
                          <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px' }}>
                            {ord.variant}
                          </div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C', marginTop: '4px' }}>
                            Payout: {ord.price || ord.amount}
                          </div>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #F0F2ED', paddingTop: '12px', marginBottom: '14px' }}>
                        <div style={{ fontSize: '11px', color: '#14281C' }}>
                          {ord.riderNote}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleOpenVerifyPin(ord.id)}
                        style={{
                          flex: 1,
                          padding: '11px',
                          backgroundColor: '#B8F135',
                          border: 'none',
                          borderRadius: '10px',
                          fontSize: '13px',
                          fontWeight: 700,
                          color: '#14281C',
                          cursor: 'pointer'
                        }}
                      >
                        Verify handover PIN
                      </button>
                      <button
                        onClick={() => handleOpenPrintSlip(ord)}
                        title="Print thermal packing slip"
                        style={{
                          padding: '11px 12px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D4DEC8',
                          borderRadius: '10px',
                          color: '#14281C',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <Printer size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Picked Up Orders View */}
        {activeFilter === 'picked_up' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '16px',
            overflow: 'hidden',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '16px', fontWeight: 600, color: '#14281C' }}>
              Orders Out for Doorstep Delivery
            </h3>
            <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
              <table style={{ width: '100%', minWidth: '560px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ECEEE7', color: '#73796F', fontSize: '12px' }}>
                  <th style={{ padding: '10px 14px' }}>Order</th>
                  <th style={{ padding: '10px 14px' }}>Customer & Item</th>
                  <th style={{ padding: '10px 14px' }}>Value</th>
                  <th style={{ padding: '10px 14px' }}>Assigned Courier</th>
                  <th style={{ padding: '10px 14px' }}>Handover Status</th>
                </tr>
              </thead>
              <tbody>
                {handedOverList.map((row, idx) => (
                  <tr 
                    key={idx} 
                    onClick={() => { playClickSound(); setSelectedOrderDetails(row); setShowOrderDetailsModal(true); }}
                    style={{ borderBottom: '1px solid #F0F2ED', cursor: 'pointer' }}
                  >
                    <td style={{ padding: '14px', fontWeight: 600, color: '#14281C' }}>{row.order}</td>
                    <td style={{ padding: '14px', color: '#14281C' }}>{row.desc}</td>
                    <td style={{ padding: '14px', color: '#14281C' }}>{row.val}</td>
                    <td style={{ padding: '14px', color: '#14281C' }}>{row.rider}</td>
                    <td style={{ padding: '14px', color: '#1E3827', fontWeight: 600 }}>{row.handover}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}

        {/* Tab 3: Completed Orders View */}
        {activeFilter === 'completed' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '16px',
            overflow: 'hidden',
            padding: '24px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#14281C' }}>
              Completed & Settled Deliveries (Today)
            </h3>
            <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#73796F' }}>
              17 orders delivered to customer doorsteps in under 10 minutes. ICICI Bank settlement scheduled for tonight 23:59 IST.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              <div style={{ padding: '16px', border: '1px solid #ECEEE7', borderRadius: '12px', backgroundColor: '#FAFBF8' }}>
                <div style={{ fontSize: '12px', color: '#73796F' }}>Gross Merchant Sales</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#14281C', marginTop: '4px' }}>₹18,483</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid #ECEEE7', borderRadius: '12px', backgroundColor: '#FAFBF8' }}>
                <div style={{ fontSize: '12px', color: '#73796F' }}>Average Prep Time</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#14281C', marginTop: '4px' }}>4.2 mins</div>
              </div>
              <div style={{ padding: '16px', border: '1px solid #ECEEE7', borderRadius: '12px', backgroundColor: '#FAFBF8' }}>
                <div style={{ fontSize: '12px', color: '#73796F' }}>Doorstep Try-On Retention</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: '#14281C', marginTop: '4px' }}>94.1%</div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Cancelled Orders View */}
        {activeFilter === 'cancelled' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '16px',
            overflow: 'hidden',
            padding: '24px'
          }}>
            <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 600, color: '#14281C' }}>
              Cancelled / Declined Orders ({cancelledList.length})
            </h3>
            {cancelledList.length === 0 ? (
              <p style={{ margin: 0, fontSize: '13px', color: '#73796F' }}>
                No cancelled orders today. 100% fulfilment rate maintained!
              </p>
            ) : (
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: '560px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #ECEEE7', color: '#73796F', fontSize: '12px' }}>
                      <th style={{ padding: '10px 14px' }}>Order</th>
                      <th style={{ padding: '10px 14px' }}>Customer & Item</th>
                      <th style={{ padding: '10px 14px' }}>Decline Reason</th>
                      <th style={{ padding: '10px 14px' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cancelledList.map((c, idx) => (
                      <tr key={idx} style={{ borderBottom: '1px solid #F0F2ED' }}>
                        <td style={{ padding: '12px 14px', fontWeight: 600, color: '#C92A2A' }}>{c.order}</td>
                        <td style={{ padding: '12px 14px', color: '#14281C' }}>{c.desc}</td>
                        <td style={{ padding: '12px 14px', color: '#73796F' }}>{c.reason}</td>
                        <td style={{ padding: '12px 14px', color: '#73796F' }}>{c.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* 4. Bottom Table: Recently Handed Over matching Figma (Always visible in Active view) */}
        {activeFilter === 'active' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            marginTop: '8px'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #ECEEE7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#14281C' }}>
                Recently handed over
              </h3>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ECEEE7', color: '#73796F', fontSize: '12px', fontWeight: 500, backgroundColor: '#FAFBF8' }}>
                    <th style={{ padding: '12px 24px', fontWeight: 500 }}>Order</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Customer / product</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Seller item value</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Delivery partner</th>
                    <th style={{ padding: '12px 24px', fontWeight: 500 }}>Handover</th>
                  </tr>
                </thead>
                <tbody>
                  {handedOverList.map((row, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => { playClickSound(); setSelectedOrderDetails(row); setShowOrderDetailsModal(true); }}
                      style={{ 
                        borderBottom: idx === handedOverList.length - 1 ? 'none' : '1px solid #F0F2ED',
                        cursor: 'pointer'
                      }}
                    >
                      <td style={{ padding: '16px 24px', fontWeight: 600, color: '#14281C' }}>{row.order}</td>
                      <td style={{ padding: '16px 16px', color: '#14281C' }}>{row.desc}</td>
                      <td style={{ padding: '16px 16px', color: '#14281C' }}>{row.val}</td>
                      <td style={{ padding: '16px 16px', color: '#14281C' }}>{row.rider}</td>
                      <td style={{ padding: '16px 24px', color: '#14281C' }}>{row.handover}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4D. Doorstep Try-On Returns & Restock Hub Table */}
        {activeFilter === 'returns' && (
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
          }}>
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #ECEEE7', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: 600, color: '#14281C' }}>
                  Doorstep Returns & Restock
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#73796F' }}>
                  Returned trial pairs inspected and returned to store counter by delivery partners.
                </p>
              </div>
              <span style={{ fontSize: '12px', fontWeight: 700, backgroundColor: '#FFF7ED', color: '#C2410C', padding: '4px 10px', borderRadius: '6px' }}>
                {tryOnReturns.filter(r => !r.restocked).length} Pending Restock
              </span>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ECEEE7', color: '#73796F', backgroundColor: '#FAFAF7' }}>
                    <th style={{ padding: '12px 24px', fontWeight: 500 }}>Return ID & Order</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Customer</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Returned Item & Trial Size</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Courier Partner</th>
                    <th style={{ padding: '12px 16px', fontWeight: 500 }}>Tamper Bag Check</th>
                    <th style={{ padding: '12px 24px', fontWeight: 500, textAlign: 'right' }}>Shelf Restock Action</th>
                  </tr>
                </thead>
                <tbody>
                  {tryOnReturns.map((ret, idx) => (
                    <tr key={ret.id} style={{ borderBottom: idx === tryOnReturns.length - 1 ? 'none' : '1px solid #F0F2ED' }}>
                      <td style={{ padding: '16px 24px' }}>
                        <div style={{ fontWeight: 700, color: '#14281C' }}>{ret.id}</div>
                        <div style={{ fontSize: '11px', color: '#73796F' }}>Order {ret.orderId} · {ret.time}</div>
                      </td>
                      <td style={{ padding: '16px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#14281C' }}>{ret.customer}</div>
                        <div style={{ fontSize: '11px', color: '#73796F' }}>{ret.phone}</div>
                      </td>
                      <td style={{ padding: '16px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#14281C' }}>{ret.item}</div>
                        <div style={{ fontSize: '11px', color: '#C2410C', fontWeight: 600 }}>Returned: {ret.sizeReturned}</div>
                        <div style={{ fontSize: '10px', color: '#15803D' }}>Kept: {ret.sizeKept}</div>
                      </td>
                      <td style={{ padding: '16px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#14281C' }}>{ret.riderName}</div>
                        <div style={{ fontSize: '11px', color: '#73796F' }}>{ret.riderPhone}</div>
                      </td>
                      <td style={{ padding: '16px 16px' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#EDFDF0', color: '#15803D', padding: '3px 8px', borderRadius: '4px', fontWeight: 700, fontSize: '11px' }}>
                          <Check size={12} />
                          <span>{ret.pouchCondition}</span>
                        </span>
                      </td>
                      <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                        {ret.restocked ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', color: '#166534', fontWeight: 700, fontSize: '12px' }}>
                            <CheckCircle2 size={15} />
                            <span>Restocked to Shelf</span>
                          </span>
                        ) : (
                          <button
                            onClick={() => handleRestockReturn(ret.id)}
                            style={{
                              backgroundColor: '#1E3827',
                              color: '#FFFFFF',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '7px 14px',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}
                          >
                            <span>+ Restock to Shelf (+1)</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. Info Banner below table with interactive Buffer trigger */}
        <div style={{
          backgroundColor: '#EFF5EE',
          border: '1px solid #E2ECE0',
          borderRadius: '12px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          fontSize: '12px',
          color: '#14281C'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              border: '1.5px solid #14281C',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: '11px',
              flexShrink: 0
            }}>
              i
            </span>
            <div>
              Need more prep time? Add a buffer to automatically update delivery estimates.
            </div>
          </div>

          <button
            onClick={handleAddBuffer}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #14281C',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '11px',
              fontWeight: 600,
              color: '#14281C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span>+2 min buffer</span>
          </button>
        </div>

        {/* Footer Meta Note */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          color: '#73796F',
          padding: '0 4px',
          marginTop: '6px'
        }}>
          <span>Orders and rider assignments sync in real time.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => showToast('Order telemetry updated')}>
            Synced just now <RefreshCw size={11} />
          </span>
        </div>

      </div>

      {/* =========================================================================
          MODAL 1: VERIFY PICKUP PIN (HANDOVER)
          ========================================================================= */}
      {showHandoverModal && activeHandoverOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(20, 40, 28, 0.45)',
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
            width: '100%',
            maxWidth: '440px',
            border: '1px solid #E2E5DC',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid #ECEEE7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FAFBF8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck size={20} color="#1E3827" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#14281C' }}>
                  Verify Courier Handover PIN
                </h3>
              </div>
              <button 
                onClick={() => setShowHandoverModal(false)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer', padding: '4px' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '22px' }}>
              {/* Courier Lockup */}
              <div style={{
                backgroundColor: '#FAFBF8',
                border: '1px solid #ECEEE7',
                borderRadius: '12px',
                padding: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '18px'
              }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: '#E5EFE2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1E3827',
                  fontWeight: 700,
                  fontSize: '15px'
                }}>
                  PS
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#14281C' }}>
                    {activeHandoverOrder.riderName || 'Priya Sharma'} (Delivery Partner)
                  </div>
                  <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>{activeHandoverOrder.riderVehicle || 'Ola S1 Pro · KA-01-HA-9821'}</span>
                    <span>·</span>
                    <Star size={11} fill="#15803D" color="#15803D" />
                    <span>4.9</span>
                  </div>
                </div>
              </div>

              {/* Order Item Verification */}
              <div style={{ fontSize: '12px', color: '#73796F', marginBottom: '6px' }}>
                Order #{activeHandoverOrder.id} Item to Handover:
              </div>
              <div style={{
                fontSize: '13px',
                fontWeight: 600,
                color: '#14281C',
                padding: '10px 14px',
                backgroundColor: '#F7F8F5',
                borderRadius: '8px',
                marginBottom: '18px',
                display: 'flex',
                justifyContent: 'space-between'
              }}>
                <span>{activeHandoverOrder.item} ({activeHandoverOrder.variant})</span>
                <span>{activeHandoverOrder.price}</span>
              </div>

              <form onSubmit={handleConfirmHandoverPin}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#14281C', marginBottom: '8px' }}>
                  Ask courier for their 4-digit pickup OTP:
                </label>
                
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    maxLength={4}
                    placeholder="e.g. 4812"
                    value={handoverPinInput}
                    onChange={(e) => setHandoverPinInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '10px',
                      border: '1.5px solid #14281C',
                      fontSize: '18px',
                      fontWeight: 700,
                      letterSpacing: '6px',
                      textAlign: 'center',
                      color: '#14281C',
                      outline: 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => { playClickSound(); setHandoverPinInput('4812'); }}
                    style={{
                      backgroundColor: '#EFF5EE',
                      border: '1px solid #1E3827',
                      borderRadius: '10px',
                      padding: '0 14px',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#1E3827',
                      cursor: 'pointer'
                    }}
                  >
                    Demo PIN (4812)
                  </button>
                </div>

                <div style={{ fontSize: '11px', color: '#73796F', marginBottom: '18px', lineHeight: '1.4' }}>
                  Enter the 4-digit PIN provided by the delivery partner to confirm handover.
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowHandoverModal(false)}
                    style={{
                      flex: 1,
                      padding: '11px',
                      borderRadius: '10px',
                      border: '1px solid #DCE0D5',
                      backgroundColor: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#73796F',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      padding: '11px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: '#B8F135',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#14281C',
                      cursor: 'pointer'
                    }}
                  >
                    Confirm Handover
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 2: REJECT WITH REASON
          ========================================================================= */}
      {showRejectModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(20, 40, 28, 0.45)',
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
            width: '100%',
            maxWidth: '420px',
            border: '1px solid #E2E5DC',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 22px',
              borderBottom: '1px solid #ECEEE7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FAFBF8'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={18} color="#C92A2A" />
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#14281C' }}>
                  Decline Order #{rejectOrderId}
                </h3>
              </div>
              <button 
                onClick={() => setShowRejectModal(false)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ padding: '22px' }}>
              <p style={{ margin: '0 0 14px 0', fontSize: '13px', color: '#73796F' }}>
                Select a reason for declining. The customer will be refunded immediately and offered alternate styles.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
                {[
                  'Out of physical stock / inventory mismatch',
                  'Counter peak rush (capacity limit reached)',
                  'Item defective / damaged packaging',
                  'Store closing early today'
                ].map((reason) => (
                  <label
                    key={reason}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: rejectReason === reason ? '1.5px solid #14281C' : '1px solid #ECEEE7',
                      backgroundColor: rejectReason === reason ? '#FAFBF8' : '#FFFFFF',
                      fontSize: '12px',
                      color: '#14281C',
                      cursor: 'pointer'
                    }}
                  >
                    <input
                      type="radio"
                      name="rejectReason"
                      checked={rejectReason === reason}
                      onChange={() => setRejectReason(reason)}
                    />
                    <span>{reason}</span>
                  </label>
                ))}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowRejectModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #DCE0D5',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#73796F',
                    cursor: 'pointer'
                  }}
                >
                  Keep Order
                </button>
                <button
                  type="button"
                  onClick={handleConfirmReject}
                  style={{
                    flex: 1.5,
                    padding: '10px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#FFF0F0',
                    color: '#C92A2A',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Confirm Decline
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 3: ORDER DETAILS INSPECTOR & RECEIPT
          ========================================================================= */}
      {showOrderDetailsModal && selectedOrderDetails && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(20, 40, 28, 0.45)',
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
            width: '100%',
            maxWidth: '480px',
            border: '1px solid #E2E5DC',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '18px 24px',
              borderBottom: '1px solid #ECEEE7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FAFBF8'
            }}>
              <div>
                <h3 style={{ margin: '0 0 2px 0', fontSize: '16px', fontWeight: 700, color: '#14281C' }}>
                  Order #{selectedOrderDetails.id || selectedOrderDetails.order}
                </h3>
                <span style={{ fontSize: '11px', color: '#73796F' }}>
                  Received today · Sole Street Indiranagar Hub
                </span>
              </div>
              <button 
                onClick={() => setShowOrderDetailsModal(false)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Customer Section */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Customer Details
                </div>
                <div style={{ backgroundColor: '#FAFBF8', border: '1px solid #ECEEE7', borderRadius: '10px', padding: '12px' }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#14281C' }}>
                    {selectedOrderDetails.customer}
                  </div>
                  <div style={{ fontSize: '12px', color: '#73796F', marginTop: '2px' }}>
                    {selectedOrderDetails.phone || '+91 98450 12849'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#73796F', marginTop: '4px', lineHeight: '1.4' }}>
                    {selectedOrderDetails.address || 'Indiranagar 100ft Road, Bengaluru'}
                  </div>
                </div>
              </div>

              {/* Items Section */}
              <div>
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '6px' }}>
                  Items in Package
                </div>
                <div style={{ border: '1px solid #ECEEE7', borderRadius: '10px', padding: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#14281C' }}>
                      {selectedOrderDetails.item || selectedOrderDetails.desc}
                    </div>
                    <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px' }}>
                      {selectedOrderDetails.variant || 'Standard Packaging · Tamper Tape Applied'}
                    </div>
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C' }}>
                    {selectedOrderDetails.price || selectedOrderDetails.val}
                  </div>
                </div>
              </div>

              {/* Payout breakdown */}
              {(() => {
                const sellerBase = Number((selectedOrderDetails.price || selectedOrderDetails.val || selectedOrderDetails.amount)?.toString().replace(/[^0-9]/g, '')) || 0;
                const companyFee = Math.round(sellerBase * 0.10);
                const custPaid = sellerBase + companyFee;
                return (
                  <div style={{ backgroundColor: '#F7F8F5', borderRadius: '10px', padding: '12px 14px', fontSize: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#73796F' }}>Item Price</span>
                      <span style={{ fontWeight: 600, color: '#14281C' }}>₹{sellerBase.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: '#73796F' }}>Buyer Total (incl. platform fee)</span>
                      <span style={{ fontWeight: 600, color: '#14281C' }}>₹{custPaid.toLocaleString('en-IN')}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #E2E5DC', paddingTop: '6px', marginTop: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#14281C' }}>Net Store Settlement</span>
                      <span style={{ fontWeight: 800, color: '#1E3827', fontSize: '14px' }}>
                        ₹{sellerBase.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Actions */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => {
                    setShowOrderDetailsModal(false);
                    handleOpenPrintSlip(selectedOrderDetails);
                  }}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '10px',
                    border: '1px solid #E2E5DC',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#14281C',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Printer size={14} />
                  <span>Print Thermal Slip</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowOrderDetailsModal(false)}
                  style={{
                    flex: 1,
                    padding: '11px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#1E3827',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#FFFFFF',
                    cursor: 'pointer'
                  }}
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL 4: THERMAL PACKING SLIP & GST DISPATCH LABEL
          ========================================================================= */}
      {showPrintSlipModal && printSlipOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(20,40,28,0.5)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '420px',
            width: '100%',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            fontFamily: 'monospace, "Courier New", Courier'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px dashed #D4DEC8', paddingBottom: '12px', marginBottom: '14px' }}>
              <div>
                <div style={{ fontWeight: 900, fontSize: '16px', color: '#14281C' }}>SOLE STREET ORIGINALS</div>
                <div style={{ fontSize: '11px', color: '#687163' }}>Indiranagar Hub #14 · Bengaluru</div>
                <div style={{ fontSize: '10px', color: '#687163' }}>GSTIN: 29AABCU9603R1ZM</div>
              </div>
              <button 
                onClick={() => setShowPrintSlipModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ textAlign: 'center', margin: '14px 0', borderBottom: '1px dashed #D4DEC8', paddingBottom: '14px' }}>
              <div style={{ fontSize: '11px', color: '#687163', letterSpacing: '2px' }}>DISPATCH TICKET</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: '#14281C', letterSpacing: '1px', margin: '4px 0' }}>
                {printSlipOrder.id || printSlipOrder.order}
              </div>
              <div style={{ display: 'inline-block', backgroundColor: '#F0FDF4', border: '1px solid #86EFAC', color: '#166534', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
                HANDOVER PIN: 4812
              </div>
            </div>

            <div style={{ fontSize: '12px', borderBottom: '1px dashed #D4DEC8', paddingBottom: '14px', marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#687163' }}>Customer:</span>
                <span style={{ fontWeight: 700, color: '#14281C' }}>{printSlipOrder.customer}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#687163' }}>Phone:</span>
                <span style={{ fontWeight: 600 }}>{printSlipOrder.phone}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#687163' }}>Delivery:</span>
                <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '240px' }}>{printSlipOrder.address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#687163' }}>Rider:</span>
                <span style={{ fontWeight: 700, color: '#15803D' }}>{printSlipOrder.riderName || 'Sanjay Rawat'}</span>
              </div>
            </div>

            <div style={{ fontSize: '12px', borderBottom: '2px dashed #D4DEC8', paddingBottom: '14px', marginBottom: '16px' }}>
              <div style={{ fontWeight: 700, marginBottom: '8px' }}>ITEMS TO PACK:</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>1x {printSlipOrder.item || printSlipOrder.desc}</span>
                <span style={{ fontWeight: 700 }}>{printSlipOrder.price || printSlipOrder.val}</span>
              </div>
              <div style={{ fontSize: '11px', color: '#687163' }}>Variant: {printSlipOrder.variant || 'Standard Size'}</div>
              <div style={{ marginTop: '8px', fontSize: '10px', backgroundColor: '#FEF3C7', color: '#92400E', padding: '4px 8px', borderRadius: '4px', fontWeight: 600 }}>
                Doorstep trial active · Delivery partner waits 10 mins for fit check.
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', fontFamily: 'Inter, sans-serif' }}>
              <button
                onClick={() => {
                  window.print();
                }}
                style={{
                  flex: 1,
                  padding: '11px',
                  backgroundColor: '#1E3827',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={15} />
                <span>Print Thermal Slip</span>
              </button>
              <button
                onClick={() => setShowPrintSlipModal(false)}
                style={{
                  padding: '11px 18px',
                  backgroundColor: '#FFFFFF',
                  color: '#14281C',
                  border: '1px solid #D4DEC8',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer'
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
