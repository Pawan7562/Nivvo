import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowUpRight, ChevronDown, RefreshCw, X, Download, 
  FileText, CheckCircle2, Star, Clock, MapPin, Phone, 
  User, Package, Printer, Check, Lock, ShieldCheck
} from 'lucide-react';
import { playClickSound, playTrialSound } from '../../utils/audioEffects';
import SellerLayout from '../../components/nivvo/SellerLayout';

export default function NivvoSellerDashboard({ onBack }) {
  const { 
    navigateTo, 
    showToast, 
    shopProfile, 
    toggleShopAvailability,
    shopEarnings,
    shopIncomingOrders,
    sellerProducts,
    acceptMerchantOrder,
    dispatchMerchantOrder,
    currentUser
  } = useNivvo();

  const [activeTab, setActiveTab] = useState('overview');
  const [timeframe, setTimeframe] = useState('today'); // 'today' | 'yesterday' | 'week'
  const [timeframeDropdownOpen, setTimeframeDropdownOpen] = useState(false);
  const [hoveredBar, setHoveredBar] = useState(null);
  const [selectedBar, setSelectedBar] = useState(6);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('csv'); // 'csv' | 'pdf' | 'excel'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [showPrepModal, setShowPrepModal] = useState(false);

  const ownerName = shopProfile?.owner_name || currentUser?.name || 'Partner';
  const ownerFirstName = ownerName.trim().split(' ')[0] || 'Partner';
  const shopName = shopProfile?.shop_name || 'Sole Street Originals';

  const currentHour = new Date().getHours();
  const greeting = currentHour < 12 ? 'Good morning' : currentHour < 17 ? 'Good afternoon' : 'Good evening';
  const todayDateStr = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const dynamicTodaySales = shopEarnings?.today_gross ? `₹${Number(shopEarnings.today_gross).toLocaleString('en-IN')}` : '₹24,870';
  const dynamicOrdersCount = (shopIncomingOrders && shopIncomingOrders.length > 0) ? shopIncomingOrders.length.toString() : '28';
  const dynamicPrepTime = shopProfile?.prep_time_minutes || '4.2 min';

  // Timeframe-specific data
  const chartDataByTimeframe = {
    today: {
      sales: dynamicTodaySales,
      salesDiff: '+18.4% vs last week',
      orders: dynamicOrdersCount,
      ordersDiff: '+6 more than average',
      prep: dynamicPrepTime,
      prepDiff: '0.8 min faster this week',
      subtitle: "Today's store performance and order metrics.",
      bars: [
        { time: '08:00', label: '₹1.45k', height: '26%', isHighlight: false, orders: 2, topItem: 'Cloud slide slipper (UK 8)' },
        { time: '09:00', label: '₹2.55k', height: '46%', isHighlight: false, orders: 3, topItem: 'Everyday court sneaker (UK 7)' },
        { time: '10:00', label: '₹2.38k', height: '42%', isHighlight: false, orders: 3, topItem: 'Two-strap leather sandal (UK 7)' },
        { time: '11:00', label: '₹4.09k', height: '72%', isHighlight: false, orders: 5, topItem: 'Canvas weekend sneaker (UK 9)' },
        { time: '12:00', label: '₹3.30k', height: '58%', isHighlight: false, orders: 4, topItem: 'Everyday court sneaker (UK 8)' },
        { time: '13:00', label: '₹5.55k', height: '96%', isHighlight: false, orders: 6, topItem: 'City knit trainer (UK 9)' },
        { time: '14:00', label: '₹5.55k', height: '96%', isHighlight: true, orders: 5, topItem: 'Everyday court sneaker (UK 8)' }
      ]
    },
    yesterday: {
      sales: '₹21,450',
      salesDiff: '+12.1% vs Saturday',
      orders: '24',
      ordersDiff: '+4 more than avg',
      prep: '4.6 min',
      prepDiff: 'On target (< 5 min)',
      subtitle: 'Yesterday’s store performance and orders.',
      bars: [
        { time: '08:00', label: '₹1.10k', height: '22%', isHighlight: false, orders: 1, topItem: 'Cloud slide slipper (UK 7)' },
        { time: '09:00', label: '₹1.90k', height: '38%', isHighlight: false, orders: 2, topItem: 'Canvas weekend sneaker (UK 8)' },
        { time: '10:00', label: '₹2.10k', height: '42%', isHighlight: false, orders: 3, topItem: 'Two-strap sandal (UK 6)' },
        { time: '11:00', label: '₹3.80k', height: '76%', isHighlight: false, orders: 4, topItem: 'City knit trainer (UK 8)' },
        { time: '12:00', label: '₹3.05k', height: '61%', isHighlight: false, orders: 4, topItem: 'Everyday court sneaker (UK 7)' },
        { time: '13:00', label: '₹4.60k', height: '92%', isHighlight: false, orders: 5, topItem: 'Everyday court sneaker (UK 9)' },
        { time: '14:00', label: '₹4.90k', height: '98%', isHighlight: true, orders: 5, topItem: 'Classic leather loafer (UK 8)' }
      ]
    },
    week: {
      sales: '₹1,58,400',
      salesDiff: '+22.8% vs previous week',
      orders: '186',
      ordersDiff: '+34 more orders',
      prep: '4.4 min',
      prepDiff: 'Avg 4.4 min across 186 orders',
      subtitle: '7-day store performance and orders overview.',
      bars: [
        { time: 'Mon', label: '₹19.2k', height: '68%', isHighlight: false, orders: 23, topItem: 'Canvas sneaker' },
        { time: 'Tue', label: '₹21.5k', height: '76%', isHighlight: false, orders: 25, topItem: 'Everyday court' },
        { time: 'Wed', label: '₹18.8k', height: '66%', isHighlight: false, orders: 22, topItem: 'Two-strap sandal' },
        { time: 'Thu', label: '₹22.4k', height: '79%', isHighlight: false, orders: 27, topItem: 'City knit trainer' },
        { time: 'Fri', label: '₹26.8k', height: '95%', isHighlight: false, orders: 32, topItem: 'Everyday court' },
        { time: 'Sat', label: '₹24.8k', height: '88%', isHighlight: false, orders: 29, topItem: 'Cloud slide' },
        { time: 'Sun', label: '₹24.9k', height: '88%', isHighlight: true, orders: 28, topItem: 'Everyday court' }
      ]
    }
  };

  const currentData = chartDataByTimeframe[timeframe];
  const hourlyBars = currentData.bars;

  // Real CSV Download Generator
  const downloadCSVReport = () => {
    playTrialSound();
    const rows = [
      ['Sole Street Indiranagar (SS-018) - Sales Ledger'],
      ['Period', timeframe.toUpperCase(), 'Export Date', '25 Oct 2026 14:46 IST'],
      [],
      ['Order ID', 'Customer Name', 'Customer Contact', 'Items Ordered', 'Size/Variant', 'Item Amount', 'Status', 'Handover Time'],
      ['NV-1052', 'Meera N.', '+91 98112 34567', 'Two-strap leather sandal', 'Tan · UK 7', '₹899', 'New (In Prep)', '2:45 pm'],
      ['NV-1051', 'Aditya K.', '+91 98451 98765', 'Canvas weekend sneaker', 'Ivory · UK 9', '₹999', 'Preparing', '2:42 pm'],
      ['NV-1049', 'Nisha P.', '+91 99001 22334', 'Everyday court sneaker', 'Sage / Ivory · UK 6', '₹1,299', 'Ready for pickup', '2:37 pm'],
      ['NV-1048', 'Aarav S.', '+91 98765 43210', 'Everyday court sneaker', 'Sage / Ivory · UK 8', '₹1,299', 'Picked up by Ravi Kumar (DP-042)', '2:39 pm'],
      ['NV-1045', 'Ishita D.', '+91 97412 11223', 'Cloud slide slipper', 'Charcoal Foam · UK 5', '₹599', 'Delivered', '2:24 pm'],
      ['NV-1042', 'Kabir V.', '+91 98860 99887', 'City knit trainer', 'Triple Black · UK 9', '₹1,899', 'Delivered', '1:48 pm'],
      [],
      ['Total Orders', currentData.orders],
      ['Gross Merchandise Value', currentData.sales],
      ['Average Preparation SLA', currentData.prep],
      ['GST Invoice Compliance', 'Verified 29AABCU9603R1ZM']
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.map(cell => `"${cell}"`).join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `sole_street_sales_report_${timeframe}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setShowExportModal(false);
    showToast(`Downloaded Sole Street ${timeframe} report (.CSV)`);
  };

  const defaultRecentOrders = [
    {
      id: 'NV-1052',
      customer: 'Meera N.',
      phone: '+91 98112 34567',
      address: 'Flat 402, Embassy Habitat, 80ft Road, Indiranagar',
      item: 'Two-strap sandal · UK 7',
      itemName: 'Two-strap leather sandal',
      variant: 'Tan · UK 7 · Qty 1',
      amount: '₹899',
      status: 'New · Accept in 01:42',
      stage: 'new',
      time: '2:45 pm',
      prepTime: 'Target prep: 4–6 min',
      rider: 'Rider assigning · Indiranagar Dark Hub #14',
      image: '/assets/figma/product_sandals.png'
    },
    {
      id: 'NV-1051',
      customer: 'Aditya K.',
      phone: '+91 98451 98765',
      address: 'Villa 12, Defence Colony, 100ft Road, Indiranagar',
      item: 'Canvas sneaker · UK 9',
      itemName: 'Canvas weekend sneaker',
      variant: 'Ivory / Gum · UK 9 · Qty 1',
      amount: '₹999',
      status: 'Preparing · 3 min left',
      stage: 'preparing',
      time: '2:42 pm',
      prepTime: 'Remaining: 2 min 45 sec',
      rider: 'Sanjay V. (EV Scooter KA-03-EV-2108) · 0.4 km away',
      image: '/assets/figma/product_weekend_sneaker.png'
    },
    {
      id: 'NV-1049',
      customer: 'Nisha P.',
      phone: '+91 99001 22334',
      address: 'Penthouse 5B, Palm Grove, CMH Road, Indiranagar',
      item: 'Everyday court · UK 6',
      itemName: 'Everyday court sneaker',
      variant: 'Sage / Ivory · UK 6 · Qty 1',
      amount: '₹1,299',
      status: 'Ready for pickup',
      stage: 'ready',
      time: '2:37 pm',
      prepTime: 'Sealed & staged at storefront counter',
      rider: 'Priya M. (KA-04-EV-9902) · Arrived at storefront · PIN 4812',
      image: '/assets/figma/product_court_sneaker.png'
    },
    {
      id: 'NV-1048',
      customer: 'Aarav S.',
      phone: '+91 98765 43210',
      address: 'A-302, Maple Court, 12th Main Road, Indiranagar',
      item: 'Everyday court · UK 8',
      itemName: 'Everyday court sneaker',
      variant: 'Sage / Ivory · UK 8 · Qty 1',
      amount: '₹1,299',
      status: 'Picked up · 2:39 pm',
      stage: 'picked_up',
      time: '2:32 pm',
      prepTime: 'Handed over in 4.2 min',
      rider: 'Ravi Kumar (DP-042) · Out for delivery · ETA 4 min',
      image: '/assets/figma/product_court_sneaker.png'
    }
  ];

  const displayOrders = (shopIncomingOrders && shopIncomingOrders.length > 0)
    ? shopIncomingOrders.map(o => {
        const fullItem = (o.fullItems && o.fullItems[0]) || {};
        return {
          id: o.id,
          customer: o.customer || o.customer_name || 'Meera N.',
          phone: o.phone || '+91 98112 34567',
          address: o.deliveryAddress || o.customer_address || o.address || '12th Main, Indiranagar',
          item: fullItem.name || o.item_name || o.item || 'Two-strap leather sandal',
          itemName: fullItem.name || o.item_name || o.item || 'Two-strap leather sandal',
          variant: o.variant || fullItem.variant || 'Standard · Qty 1',
          amount: o.amount || (o.rawAmount ? `₹${o.rawAmount}` : '₹899'),
          status: o.status === 'new' ? 'New · Accept in 01:42' : (o.status === 'preparing' ? 'Preparing · Due in 5 min' : (o.status === 'ready' ? 'Ready for pickup · PIN 4812' : (o.status === 'picked_up' ? 'Picked up by Courier' : (o.status === 'completed' ? 'Delivered' : o.statusLabel || o.status)))),
          stage: o.status || 'new',
          time: o.receivedTime || 'Just now',
          prepTime: o.dueTime || 'Target prep: 4–6 min',
          rider: o.rider?.name ? `${o.rider.name} (${o.rider.vehicle || 'EV'})` : 'Indiranagar Courier',
          image: fullItem.image || o.image || '/assets/figma/product_court_sneaker.png',
          rawOrder: o
        };
      })
    : defaultRecentOrders;

  return (
    <SellerLayout 
      currentTab={activeTab} 
      breadcrumb={activeTab === 'overview' ? 'Overview' : activeTab}
      onBack={onBack}
      onTabChange={(tab) => setActiveTab(tab)}
    >
      <div className="nivvo-seller-dash" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
        
        {/* 1. Header Title & Actions */}
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
              {greeting}, {ownerFirstName}.
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#56634F', lineHeight: '1.5' }}>
              {currentData.subtitle}
            </p>
          </div>

          <button
            onClick={() => {
              playClickSound();
              setShowExportModal(true);
            }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D8DCD2',
              borderRadius: '11px',
              padding: '11px 20px',
              fontSize: '14px',
              fontWeight: 700,
              color: '#14281C',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F5F6F2'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
          >
            <span>Export report</span>
            <ArrowUpRight size={16} />
          </button>
        </div>

        {/* 2. Store Live / Under Review Status Banner */}
        {(!shopProfile?.verification_status || shopProfile.verification_status.toLowerCase() !== 'approved') ? (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '14px',
            padding: '16px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                backgroundColor: '#FEF3C7',
                padding: '8px',
                borderRadius: '10px',
                color: '#D97706',
                display: 'flex',
                alignItems: 'center'
              }}>
                <Clock size={20} />
              </div>
              <div>
                <span style={{ fontSize: '15px', fontWeight: 700, color: '#92400E', display: 'block' }}>
                  Store Application Under Review
                </span>
                <span style={{ fontSize: '13px', color: '#B45309', marginTop: '2px', display: 'block' }}>
                  Your merchant boutique registration is currently being verified by Nivvo Administration. Once approved, live orders and product listing will be activated.
                </span>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#FEF3C7',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 700,
              color: '#B45309'
            }}>
              <Lock size={14} />
              <span>Awaiting Admin Approval</span>
            </div>
          </div>
        ) : (
          <div style={{
            backgroundColor: shopProfile.is_open ? '#EFF5EE' : '#FDF2F2',
            borderRadius: '14px',
            padding: '16px 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            border: shopProfile.is_open ? '1px solid #D5E5D2' : '1px solid #F5C6C6'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                width: '9px',
                height: '9px',
                borderRadius: '50%',
                backgroundColor: shopProfile.is_open ? '#15803D' : '#DC2626',
                boxShadow: shopProfile.is_open ? '0 0 0 3px rgba(22, 163, 74, 0.2)' : 'none'
              }} />
              <span style={{ fontSize: '15px', fontWeight: 600, color: '#14281C' }}>
                {shopProfile.is_open 
                  ? 'Store is online · Accepting orders' 
                  : 'Store is paused · Offline for orders'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px', color: '#14281C' }}>
              <span style={{ color: '#56634F', fontWeight: 500 }}>Target prep: <strong>4–6 min</strong></span>
              <span style={{ color: '#B5BAC0' }}>·</span>
              <button
                onClick={() => {
                  playClickSound();
                  toggleShopAvailability();
                }}
                style={{
                  background: 'none',
                  border: '1px solid #CCD2C6',
                  borderRadius: '8px',
                  padding: '6px 14px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: shopProfile.is_open ? '#B91C1C' : '#15803D',
                  backgroundColor: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  transition: 'all 0.15s ease'
                }}
              >
                <span>{shopProfile.is_open ? 'Pause store' : 'Resume store'}</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. Four Top Metric Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '18px'
        }}>
          {/* Card 1: Today's sales -> Opens Payouts */}
          <div 
            onClick={() => {
              playClickSound();
              navigateTo('seller-payouts');
            }}
            title="Click to view Settlements & Payouts"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECEEE7',
              borderRadius: '16px',
              padding: '24px 26px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#5E6A58', marginBottom: '10px' }}>
              {timeframe === 'today' ? "Today’s sales" : (timeframe === 'yesterday' ? "Yesterday’s sales" : "7-Day sales")}
            </div>
            <div style={{ fontSize: '34px', fontWeight: 800, color: '#14281C', letterSpacing: '-0.03em', lineHeight: '1.1', marginBottom: '10px' }}>
              {currentData.sales}
            </div>
            <div style={{ fontSize: '13px', color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '4px' }}>
              <span>{currentData.salesDiff}</span>
              <span style={{ fontSize: '13px', color: '#5E6A58', fontWeight: 600 }}>View settlements</span>
            </div>
          </div>

          {/* Card 2: Orders received */}
          <div 
            onClick={() => navigateTo('seller-orders')}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECEEE7',
              borderRadius: '16px',
              padding: '24px 26px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#5E6A58', marginBottom: '10px' }}>
              Orders received
            </div>
            <div style={{ fontSize: '34px', fontWeight: 800, color: '#14281C', letterSpacing: '-0.03em', lineHeight: '1.1', marginBottom: '10px' }}>
              {currentData.orders}
            </div>
            <div style={{ fontSize: '13px', color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{currentData.ordersDiff}</span>
              <span style={{ fontSize: '13px', color: '#5E6A58', fontWeight: 600 }}>View orders</span>
            </div>
          </div>

          {/* Card 3: Average preparation */}
          <div 
            onClick={() => setShowPrepModal(true)}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECEEE7',
              borderRadius: '16px',
              padding: '24px 26px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#5E6A58', marginBottom: '10px' }}>
              Average preparation
            </div>
            <div style={{ fontSize: '34px', fontWeight: 800, color: '#14281C', letterSpacing: '-0.03em', lineHeight: '1.1', marginBottom: '10px' }}>
              {currentData.prep}
            </div>
            <div style={{ fontSize: '13px', color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>{currentData.prepDiff}</span>
              <span style={{ fontSize: '13px', color: '#5E6A58', fontWeight: 600 }}>View SLA</span>
            </div>
          </div>

          {/* Card 4: Store rating -> Opens Reviews View */}
          <div 
            onClick={() => {
              playClickSound();
              navigateTo('seller-reviews');
            }}
            title="Click to view and manage customer reviews"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECEEE7',
              borderRadius: '16px',
              padding: '24px 26px',
              boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.02)';
            }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#5E6A58', marginBottom: '10px' }}>
              Store rating
            </div>
            <div style={{ fontSize: '34px', fontWeight: 800, color: '#14281C', letterSpacing: '-0.03em', lineHeight: '1.1', marginBottom: '10px' }}>
              4.8 / 5
            </div>
            <div style={{ fontSize: '13px', color: '#15803D', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>248 verified reviews</span>
              <span style={{ fontSize: '13px', color: '#5E6A58', fontWeight: 600 }}>View reviews</span>
            </div>
          </div>
        </div>

        {/* 4. Middle Row: Sales Performance (Left) + Your Next Moves (Right) */}
        <div className="nivvo-seller-dash-grid">
          {/* Left: Sales Performance Chart Card with Tooltip & Timeframe Switcher */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '16px',
            padding: '26px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)',
            position: 'relative'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#14281C' }}>
                  Sales performance
                </h3>

                {/* Timeframe Dropdown */}
                <div style={{ position: 'relative' }}>
                  <div 
                    onClick={() => setTimeframeDropdownOpen(!timeframeDropdownOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#14281C',
                      cursor: 'pointer',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      border: '1px solid #E2E5DC',
                      backgroundColor: '#F7F8F4'
                    }}
                  >
                    <span>{timeframe === 'today' ? 'Today' : (timeframe === 'yesterday' ? 'Yesterday' : 'Last 7 days')}</span>
                    <ChevronDown size={15} />
                  </div>

                  {timeframeDropdownOpen && (
                    <div style={{
                      position: 'absolute',
                      top: '110%',
                      right: 0,
                      backgroundColor: '#FFFFFF',
                      borderRadius: '12px',
                      boxShadow: '0 10px 28px rgba(0,0,0,0.12)',
                      border: '1px solid #EAECE5',
                      zIndex: 30,
                      minWidth: '140px',
                      overflow: 'hidden',
                      marginTop: '4px'
                    }}>
                      {[
                        { id: 'today', label: 'Today' },
                        { id: 'yesterday', label: 'Yesterday' },
                        { id: 'week', label: 'Last 7 days' }
                      ].map(tf => (
                        <div
                          key={tf.id}
                          onClick={() => {
                            playClickSound();
                            setTimeframe(tf.id);
                            setTimeframeDropdownOpen(false);
                            showToast(`Loaded ${tf.label} sales telemetry`);
                          }}
                          style={{
                            padding: '10px 14px',
                            fontSize: '13px',
                            color: timeframe === tf.id ? '#15803D' : '#14281C',
                            fontWeight: timeframe === tf.id ? 700 : 500,
                            backgroundColor: timeframe === tf.id ? '#F2FAF4' : '#FFFFFF',
                            cursor: 'pointer'
                          }}
                        >
                          {tf.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ fontSize: '13px', color: '#687163', display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <span>Revenue (₹) · {timeframe === 'week' ? 'Daily' : 'Hourly breakdown'}</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#14281C', fontWeight: 600 }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#1E3827' }} />
                  {timeframe === 'today' ? 'Today' : (timeframe === 'yesterday' ? 'Yesterday' : 'This Week')}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', color: '#15803D', fontWeight: 600 }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#15803D' }} />
                  Live
                </span>
              </div>
            </div>

            {/* Interactive Bar Chart Visualization */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '14px',
              height: '220px',
              paddingTop: '32px',
              borderBottom: '1px solid #EAECE5',
              position: 'relative'
            }}>
              {hourlyBars.map((b, idx) => {
                const isHovered = hoveredBar === idx;
                const isSelected = selectedBar === idx;
                const isHighlighted = b.isHighlight || isSelected;

                return (
                  <div 
                    key={idx} 
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    onClick={() => {
                      playClickSound();
                      setSelectedBar(idx);
                      showToast(`${b.time}: ${b.label} (${b.orders} orders)`);
                    }}
                    style={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      height: '100%', 
                      justifyContent: 'flex-end',
                      position: 'relative',
                      cursor: 'pointer'
                    }}
                  >
                    {/* Hover Tooltip Popup */}
                    {isHovered && (
                      <div style={{
                        position: 'absolute',
                        bottom: '105%',
                        backgroundColor: '#14281C',
                        color: '#FFFFFF',
                        padding: '8px 12px',
                        borderRadius: '9px',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                        zIndex: 40,
                        boxShadow: '0 6px 16px rgba(0,0,0,0.2)',
                        pointerEvents: 'none',
                        textAlign: 'center'
                      }}>
                        <div style={{ fontWeight: 800, color: '#C6F432', fontSize: '13px' }}>{b.label} · {b.time}</div>
                        <div style={{ fontSize: '11px', color: '#E4ECE2', marginTop: '3px' }}>
                          {b.orders} orders · Top: {b.topItem}
                        </div>
                      </div>
                    )}

                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: isHighlighted ? '#14281C' : '#56634F',
                      marginBottom: '8px'
                    }}>
                      {b.label}
                    </span>

                    <div style={{
                      width: '100%',
                      maxWidth: '56px',
                      height: b.height,
                      backgroundColor: isHighlighted ? '#B8F135' : '#254530',
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 0.3s ease, background-color 0.15s ease',
                      boxShadow: isHovered ? '0 0 12px rgba(184, 241, 53, 0.5)' : 'none'
                    }} />

                    <span style={{
                      fontSize: '12px',
                      color: isHighlighted ? '#14281C' : '#687163',
                      fontWeight: isHighlighted ? 800 : 500,
                      marginTop: '10px'
                    }}>
                      {b.time}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Your Next Moves Card matching Figma */}
          <div style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #ECEEE7',
            borderRadius: '16px',
            padding: '26px 28px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
          }}>
            <div>
              <div style={{
                display: 'inline-block',
                backgroundColor: '#FEF3C7',
                color: '#92400E',
                border: '1px solid #FDE68A',
                fontSize: '12px',
                fontWeight: 700,
                padding: '5px 12px',
                borderRadius: '8px',
                marginBottom: '16px'
              }}>
                Inventory Alert
              </div>

              <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontWeight: 800, color: '#14281C' }}>
                Stock Attention
              </h3>

              <p style={{ margin: '0 0 20px 0', fontSize: '14px', color: '#56634F', lineHeight: '1.6' }}>
                2 variants are low on stock and 1 listing is inactive. Update inventory to maintain uninterrupted order fulfillment.
              </p>

              <button
                onClick={() => {
                  playClickSound();
                  navigateTo('seller-prods');
                }}
                style={{
                  width: '100%',
                  backgroundColor: '#FFFFFF',
                  border: '1.5px solid #1E3827',
                  borderRadius: '11px',
                  padding: '12px 18px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#1E3827',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#1E3827';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#1E3827';
                }}
              >
                <span>Manage Inventory</span>
              </button>
            </div>

            <div 
              onClick={() => {
                playClickSound();
                navigateTo('seller-payouts');
              }}
              title="Click to view detailed payouts and settlements"
              style={{ 
                borderTop: '1px solid #EAECE5', 
                paddingTop: '20px', 
                marginTop: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'opacity 0.15s ease'
              }}
            >
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#14281C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>Next payout · ₹18,420</span>
                  <span style={{ fontSize: '11px', backgroundColor: '#EDFDF0', color: '#15803D', border: '1px solid #BBF7D0', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>Auto-transfer</span>
                </div>
                <div style={{ fontSize: '13px', color: '#687163', marginTop: '4px' }}>
                  Monday, 26 October · ICICI Bank ···04812
                </div>
              </div>
              <ArrowUpRight size={18} color="#14281C" />
            </div>
          </div>

        </div>

        {/* 5. Bottom Table: Recent Orders */}
        <div style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #ECEEE7',
          borderRadius: '16px',
          overflow: 'hidden',
          boxShadow: '0 1px 4px rgba(0,0,0,0.02)'
        }}>
          {/* Table Header Row */}
          <div style={{
            padding: '20px 28px',
            borderBottom: '1px solid #ECEEE7',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 700, color: '#14281C' }}>
              Recent Orders
            </h3>
            <button
              onClick={() => navigateTo('seller-orders')}
              style={{
                background: 'none',
                border: 'none',
                padding: '6px 10px',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#1E3827',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <span>View all</span>
              <ArrowUpRight size={16} />
            </button>
          </div>

          {/* Table Structure */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #ECEEE7', color: '#56634F', fontSize: '13px', fontWeight: 600, backgroundColor: '#FAFBF8' }}>
                  <th style={{ padding: '14px 28px', fontWeight: 600 }}>Order / Customer</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Item & Variant</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Amount</th>
                  <th style={{ padding: '14px 20px', fontWeight: 600 }}>Status</th>
                  <th style={{ padding: '14px 28px', textAlign: 'right', fontWeight: 600 }}>Received</th>
                </tr>
              </thead>
              <tbody>
                {displayOrders.map((row, idx) => (
                  <tr 
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      setSelectedOrder(row);
                    }}
                    style={{
                      borderBottom: idx === displayOrders.length - 1 ? 'none' : '1px solid #F0F2ED',
                      cursor: 'pointer',
                      transition: 'background-color 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#FAFBF8'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#FFFFFF'}
                  >
                    <td style={{ padding: '18px 28px', color: '#14281C' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 800, color: '#14281C', fontSize: '14px' }}>{row.id}</span>
                        <span style={{ color: '#A0A79E' }}>·</span>
                        <span style={{ color: '#374151', fontWeight: 500 }}>{row.customer}</span>
                      </div>
                    </td>
                    <td style={{ padding: '18px 20px', color: '#1E2D24', fontWeight: 500 }}>
                      {row.item}
                    </td>
                    <td style={{ padding: '18px 20px', color: '#14281C', fontWeight: 700, fontSize: '15px' }}>
                      {row.amount}
                    </td>
                    <td style={{ padding: '18px 20px' }}>
                      <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '5px 12px',
                        borderRadius: '999px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: row.stage === 'new' 
                          ? '#FFFBEB' 
                          : row.stage === 'preparing' 
                            ? '#F0FDF4' 
                            : row.stage === 'ready' 
                              ? '#ECFDF5' 
                              : '#F4F5F1',
                        color: row.stage === 'new' 
                          ? '#92400E' 
                          : row.stage === 'preparing' 
                            ? '#15803D' 
                            : row.stage === 'ready' 
                              ? '#047857' 
                              : '#374151',
                        border: row.stage === 'new'
                          ? '1px solid #FDE68A'
                          : row.stage === 'preparing'
                            ? '1px solid #BBF7D0'
                            : row.stage === 'ready'
                              ? '1px solid #A7F3D0'
                              : '1px solid #E5E7DE'
                      }}>
                        <span style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: row.stage === 'new' 
                            ? '#D97706' 
                            : row.stage === 'preparing' 
                              ? '#16A34A' 
                              : row.stage === 'ready' 
                                ? '#059669' 
                                : '#6B7280'
                        }} />
                        <span>{row.status}</span>
                      </span>
                    </td>
                    <td style={{ padding: '18px 28px', textAlign: 'right', color: '#687163', fontWeight: 500, fontSize: '13px' }}>
                      {row.time}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Meta Note */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '13px',
          color: '#56634F',
          padding: '0 4px',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <span>Metrics reflect real-time store inventory, dispatch SLA, and local courier capacity.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }} onClick={() => showToast('Refreshed seller data')}>
            Synced just now <RefreshCw size={13} />
          </span>
        </div>

        {/* ─── MODAL 1: EXPORT REPORT MODAL (Real CSV File Download) ─── */}
        {showExportModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20,40,28,0.45)',
            backdropFilter: 'blur(4px)',
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
              padding: '28px 30px',
              boxShadow: '0 24px 48px rgba(0,0,0,0.18)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#14281C' }}>
                  Export Sales Report & Ledger
                </h3>
                <button 
                  onClick={() => setShowExportModal(false)}
                  style={{ background: 'none', border: 'none', color: '#56634F', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <p style={{ fontSize: '14px', color: '#56634F', margin: '0 0 20px 0', lineHeight: 1.5 }}>
                Export GST compliant order register and dispatch telemetry for Sole Street (SS-018).
              </p>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#14281C', marginBottom: '10px' }}>
                  Date Range
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'today', label: 'Today (25 Oct)' },
                    { id: 'yesterday', label: 'Yesterday' },
                    { id: 'week', label: 'Last 7 Days' }
                  ].map(r => (
                    <button
                      key={r.id}
                      onClick={() => setTimeframe(r.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: timeframe === r.id ? '2px solid #14281C' : '1px solid #EAECE5',
                        backgroundColor: timeframe === r.id ? '#FAFBF8' : '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: timeframe === r.id ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '26px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#14281C', marginBottom: '10px' }}>
                  Export Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {[
                    { id: 'csv', label: 'CSV File (.csv)' },
                    { id: 'excel', label: 'Excel (.xlsx)' },
                    { id: 'pdf', label: 'Tax PDF' }
                  ].map(f => (
                    <button
                      key={f.id}
                      onClick={() => setExportFormat(f.id)}
                      style={{
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: exportFormat === f.id ? '2px solid #14281C' : '1px solid #EAECE5',
                        backgroundColor: exportFormat === f.id ? '#FAFBF8' : '#FFFFFF',
                        fontSize: '13px',
                        fontWeight: exportFormat === f.id ? 700 : 500,
                        cursor: 'pointer'
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => setShowExportModal(false)}
                  style={{
                    flex: 1,
                    padding: '13px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E5DC',
                    borderRadius: '11px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#14281C',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={downloadCSVReport}
                  style={{
                    flex: 1.4,
                    padding: '13px',
                    backgroundColor: '#1E3827',
                    border: 'none',
                    borderRadius: '11px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#B8F135',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <Download size={16} />
                  <span>Download Report</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 2: ORDER DETAILS DRAWER ─── */}
        {selectedOrder && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20,40,28,0.45)',
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
              width: '100%',
              maxWidth: '560px',
              padding: '28px 30px',
              boxShadow: '0 24px 48px rgba(0,0,0,0.18)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '18px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '22px', fontWeight: 800, color: '#14281C' }}>
                      {selectedOrder.id}
                    </h3>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      padding: '4px 10px',
                      borderRadius: '999px',
                      backgroundColor: selectedOrder.stage === 'new' ? '#FFFBEB' : (selectedOrder.stage === 'preparing' ? '#EDFDF0' : '#EAECE5'),
                      color: selectedOrder.stage === 'new' ? '#92400E' : (selectedOrder.stage === 'preparing' ? '#15803D' : '#14281C'),
                      border: selectedOrder.stage === 'new' ? '1px solid #FDE68A' : (selectedOrder.stage === 'preparing' ? '1px solid #BBF7D0' : '1px solid #D8DCD2')
                    }}>
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#56634F', marginTop: '5px' }}>
                    Received at {selectedOrder.time} · Sole Street Indiranagar Counter
                  </div>
                </div>

                <button 
                  onClick={() => setSelectedOrder(null)}
                  style={{ background: 'none', border: 'none', color: '#56634F', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Customer Box */}
              <div style={{
                backgroundColor: '#FAFBF8',
                border: '1px solid #ECEEE7',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px'
              }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#EAECE5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#14281C', flexShrink: 0 }}>
                  <User size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#14281C' }}>{selectedOrder.customer}</div>
                  <div style={{ fontSize: '13px', color: '#56634F', marginTop: '3px' }}>{selectedOrder.phone} · {selectedOrder.address}</div>
                </div>
              </div>

              {/* Items Card */}
              <div style={{
                border: '1px solid #ECEEE7',
                borderRadius: '14px',
                padding: '16px',
                marginBottom: '18px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px'
              }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '10px', backgroundColor: '#EBE5D8', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={selectedOrder.image} alt={selectedOrder.itemName} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#14281C' }}>{selectedOrder.itemName}</div>
                  <div style={{ fontSize: '13px', color: '#56634F', marginTop: '3px' }}>{selectedOrder.variant}</div>
                  <div style={{ fontSize: '16px', fontWeight: 800, color: '#14281C', marginTop: '6px' }}>{selectedOrder.amount}</div>
                </div>
              </div>

              {/* Rider Logistics Info */}
              <div style={{
                backgroundColor: '#F7F8F4',
                border: '1px solid #EAECE5',
                borderRadius: '12px',
                padding: '14px 16px',
                fontSize: '13px',
                color: '#14281C',
                marginBottom: '22px'
              }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>Delivery Partner Logistics</div>
                <div style={{ color: '#56634F' }}>{selectedOrder.rider}</div>
              </div>

              {/* Actions Row */}
              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  onClick={() => {
                    playTrialSound();
                    showToast(`Sent packing slip for ${selectedOrder.id} to Bluetooth printer`);
                  }}
                  style={{
                    flex: 1,
                    padding: '13px',
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E5DC',
                    borderRadius: '11px',
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
                  <Printer size={16} />
                  <span>Print Slip</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedOrder(null);
                    navigateTo('seller-orders');
                  }}
                  style={{
                    flex: 1.4,
                    padding: '13px',
                    backgroundColor: '#1E3827',
                    border: 'none',
                    borderRadius: '11px',
                    fontSize: '14px',
                    fontWeight: 700,
                    color: '#B8F135',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Open in Orders Kanban</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── MODAL 3: STORE REVIEWS MODAL ─── */}
        {showReviewsModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20,40,28,0.45)',
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
              width: '100%',
              maxWidth: '540px',
              padding: '28px 30px',
              boxShadow: '0 24px 48px rgba(0,0,0,0.18)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#14281C', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>Customer Reviews</span>
                    <span style={{ fontSize: '15px', color: '#56634F', fontWeight: 700 }}>· 4.8 / 5</span>
                  </h3>
                  <div style={{ fontSize: '13px', color: '#687163', marginTop: '4px' }}>
                    Based on 248 verified orders delivered in Indiranagar
                  </div>
                </div>
                <button 
                  onClick={() => setShowReviewsModal(false)}
                  style={{ background: 'none', border: 'none', color: '#56634F', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '380px', overflowY: 'auto', marginBottom: '22px' }}>
                {[
                  {
                    name: 'Aarav S.',
                    rating: 5,
                    item: 'Everyday court sneaker · UK 8',
                    text: 'Super fast delivery in 12 mins. The shoe fits like a glove and doorstep try-on gave full confidence!',
                    time: 'Today, 2:39 pm'
                  },
                  {
                    name: 'Meera N.',
                    rating: 5,
                    item: 'Two-strap leather sandal · UK 7',
                    text: 'High grade genuine leather with great sole arch support. Packed securely with tamper seal.',
                    time: 'Yesterday'
                  },
                  {
                    name: 'Aditya K.',
                    rating: 4,
                    item: 'Canvas weekend sneaker · UK 9',
                    text: 'Very clean finish and great silhouette. Size runs true to standard UK charts.',
                    time: '2 days ago'
                  }
                ].map((rev, i) => (
                  <div key={i} style={{ padding: '14px 16px', border: '1px solid #ECEEE7', borderRadius: '12px', backgroundColor: '#FAFBF8' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ fontSize: '14px', fontWeight: 700, color: '#14281C' }}>{rev.name}</span>
                      <div style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
                        {[...Array(rev.rating)].map((_, sIdx) => (
                          <Star key={sIdx} size={13} fill="#15803D" color="#15803D" />
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: '12px', color: '#687163', marginBottom: '8px' }}>{rev.item} · {rev.time}</div>
                    <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>{rev.text}</div>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowReviewsModal(false)}
                style={{
                  width: '100%',
                  padding: '13px',
                  backgroundColor: '#1E3827',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '11px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* ─── MODAL 4: AVERAGE PREP SLA MODAL ─── */}
        {showPrepModal && (
          <div style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(20,40,28,0.45)',
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
              width: '100%',
              maxWidth: '480px',
              padding: '28px 30px',
              boxShadow: '0 24px 48px rgba(0,0,0,0.18)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: '#14281C' }}>
                  Preparation SLA & Efficiency
                </h3>
                <button 
                  onClick={() => setShowPrepModal(false)}
                  style={{ background: 'none', border: 'none', color: '#56634F', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                  aria-label="Close"
                >
                  <X size={20} />
                </button>
              </div>

              <div style={{ padding: '18px 20px', backgroundColor: '#EFF5EE', borderRadius: '14px', marginBottom: '18px' }}>
                <div style={{ fontSize: '34px', fontWeight: 800, color: '#15803D' }}>4.2 min</div>
                <div style={{ fontSize: '14px', color: '#14281C', fontWeight: 700, marginTop: '2px' }}>Avg Handover Time (Sole Street SS-018)</div>
                <div style={{ fontSize: '13px', color: '#56634F', marginTop: '3px' }}>0.8 minutes faster than Indiranagar zone average</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F2ED' }}>
                  <span style={{ color: '#56634F' }}>Under 4 mins</span>
                  <span style={{ fontWeight: 700, color: '#14281C' }}>68% of orders</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #F0F2ED' }}>
                  <span style={{ color: '#56634F' }}>4–6 mins</span>
                  <span style={{ fontWeight: 700, color: '#14281C' }}>28% of orders</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ color: '#56634F' }}>Over 6 mins</span>
                  <span style={{ fontWeight: 700, color: '#14281C' }}>4% (peak rush buffer)</span>
                </div>
              </div>

              <button
                onClick={() => setShowPrepModal(false)}
                style={{
                  width: '100%',
                  padding: '13px',
                  backgroundColor: '#1E3827',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '11px',
                  fontSize: '14px',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </SellerLayout>
  );
}
