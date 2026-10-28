import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ChevronLeft, 
  Package, 
  Store, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  DollarSign, 
  Truck, 
  Layers, 
  RotateCw,
  PlusCircle, 
  ShieldCheck, 
  Check, 
  ShoppingBag, 
  SlidersHorizontal, 
  ArrowRight,
  Search,
  Edit2,
  Trash2,
  X,
  ExternalLink,
  AlertTriangle,
  FileText,
  Sparkles,
  Plus,
  Minus,
  Info,
  Eye,
  RefreshCw,
  Lock,
  UploadCloud,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  Tag,
  Box,
  FileSpreadsheet
} from 'lucide-react';
import { 
  fetchShopPartnerProfile, 
  registerShopPartnerApi, 
  toggleShopOpenApi, 
  fetchShopOrdersApi, 
  acceptShopOrderApi,
  rejectShopOrderApi,
  dispatchShopOrderApi,
  fetchShopProductsApi,
  createShopProductApi,
  updateShopProductApi,
  updateShopProductStockApi,
  deleteShopProductApi,
  fetchShopEarningsApi,
  updateShopVerificationApi,
  updateShopProfileApi
} from '../services/api';
import { playClickSound, playAddSound } from '../utils/audioEffects';

// Default categories supported by Nivvo Marketplace
const SELLER_CATEGORIES = [
  'Clothing & Apparel',
  'Footwear & Shoes',
  'Electronics & Gadgets',
  'Groceries & Daily Needs',
  'Beauty & Personal Care',
  'Stationery & Books',
  'Gifts, Toys & Florals',
  'Home, Kitchen & Living',
  'Bags, Belts & Accessories'
];

export default function ShopOwnerView({ 
  user, 
  onNavigateHome, 
  onSwitchRole, 
  products = [],
  onProductListChanged
}) {
  const [shop, setShop] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'orders' | 'products' | 'sales' | 'kyc'
  const [isOpen, setIsOpen] = useState(true);
  
  // Real Backend Data State
  const [orders, setOrders] = useState([]);
  const [shopProducts, setShopProducts] = useState([]);
  const [earnings, setEarnings] = useState(null);

  // Filters & Search
  const [orderFilter, setOrderFilter] = useState('all'); // 'all' | 'needs_packing' | 'packed' | 'out' | 'delivered'
  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState('all');

  // Modals State
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [rejectingOrderId, setRejectingOrderId] = useState(null);
  const [rejectReason, setRejectReason] = useState('Out of requested size / stock');

  // Toast / Feedback State
  const [toastMsg, setToastMsg] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Registration & KYC Form State (Phase 2)
  const [regForm, setRegForm] = useState({
    shop_name: 'Urban Trendz Fashion Boutique',
    owner_name: user?.name || 'Sunita Mehta',
    phone: user?.phone || '+91 9876543210',
    email: 'contact@urbantrendz.in',
    category: 'Clothing & Apparel',
    address: 'Shop #4, 100ft Road, Indiranagar',
    city: 'Bangalore',
    state: 'Karnataka',
    pincode: '560038',
    operating_hours: '09:00 AM - 10:00 PM',
    contact_phone: '+91 9876511223',
    gstin: '29AABCU9603R1ZM',
    pan_number: 'AABCU9603R',
    trade_license: 'TL-BLR-2026-90412',
    fulfillment_model: 'dark_store',
    bank_name: 'ICICI Bank',
    bank_account: 'ICICI-992104812',
    bank_ifsc: 'ICIC0000492',
    upi_id: 'urbantrendz@icici',
    verification_status: 'APPROVED',
    rejection_reason: ''
  });

  // New Product Form State (Phase 4)
  const [newProd, setNewProd] = useState({
    name: '',
    category: 'clothing',
    subcategory: 'Ethnic Wear',
    description: '',
    price: '',
    original_price: '',
    stock_quantity: 20,
    sku: '',
    brand: '',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [{ name: 'Navy Blue', hex: '#000080' }],
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    trial_supported: true,
    hsn_code: '6205'
  });

  const phoneToQuery = user?.phone || '+91 9876543210';

  useEffect(() => {
    loadData();
  }, [phoneToQuery]);

  const showToast = (message, type = 'success') => {
    setToastMsg({ text: message, type });
    setTimeout(() => setToastMsg(null), 3800);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. Fetch Profile
      const profileRes = await fetchShopPartnerProfile(phoneToQuery);
      if (profileRes?.registered && profileRes.shop) {
        setShop(profileRes.shop);
        setIsOpen(profileRes.shop.is_open);
        setRegForm(prev => ({
          ...prev,
          ...profileRes.shop,
          verification_status: profileRes.shop.verification_status || 'APPROVED'
        }));
      }

      // 2. Fetch Orders
      const ordersRes = await fetchShopOrdersApi(profileRes?.shop?.shop_id || 'SHP-4012');
      if (ordersRes?.orders) {
        setOrders(ordersRes.orders);
      }

      // 3. Fetch Seller Products
      const prodsRes = await fetchShopProductsApi(phoneToQuery, profileRes?.shop?.shop_id);
      if (prodsRes?.products) {
        setShopProducts(prodsRes.products);
      }

      // 4. Fetch Real Earnings & Settlement Ledger
      const earnRes = await fetchShopEarningsApi(phoneToQuery);
      if (earnRes) {
        setEarnings(earnRes);
      }
    } catch (err) {
      console.error('Failed to load shop data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle Store Open / Pause
  const handleToggleStoreOpen = async () => {
    playClickSound();
    const nextStatus = !isOpen;
    setIsOpen(nextStatus);
    const res = await toggleShopOpenApi(phoneToQuery, nextStatus);
    if (res?.success) {
      showToast(nextStatus ? 'Store is now LIVE on Nivvo Grid!' : 'Store PAUSED. No new orders will arrive.');
    }
  };

  // Submit / Update KYC & Registration
  const handleSaveRegistration = async (e) => {
    if (e) e.preventDefault();
    setIsSubmitting(true);
    playAddSound();
    
    const res = await registerShopPartnerApi(regForm);
    setIsSubmitting(false);

    if (res?.success && res.shop) {
      setShop(res.shop);
      showToast('Boutique KYC and Merchant Profile Saved Successfully!');
      loadData();
    } else {
      showToast(res?.error || 'Failed to update registration details', 'error');
    }
  };

  // Simulate Verification State Switch (Phase 2 Test Support)
  const handleSwitchVerificationState = async (status, reason = '') => {
    playClickSound();
    const res = await updateShopVerificationApi(phoneToQuery, status, reason);
    if (res?.success && res.shop) {
      setShop(res.shop);
      setRegForm(prev => ({ ...prev, verification_status: status, rejection_reason: reason }));
      showToast(`Verification status updated to: ${status}`);
    }
  };

  // Add Product Form Submit (Phase 4)
  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.category) {
      showToast('Please provide Product Name, Price, and Category.', 'error');
      return;
    }

    setIsSubmitting(true);
    playAddSound();

    const payload = {
      ...newProd,
      phone: phoneToQuery,
      shop_id: shop?.shop_id || 'SHP-4012',
      price: Number(newProd.price),
      original_price: newProd.original_price ? Number(newProd.original_price) : null,
      stock_quantity: parseInt(newProd.stock_quantity) || 10
    };

    const res = await createShopProductApi(payload);
    setIsSubmitting(false);

    if (res?.success && res.product) {
      showToast(`"${res.product.name}" is now listed on Nivvo 10-Min Fashion Marketplace!`);
      setIsAddProductModalOpen(false);
      // Reset form
      setNewProd({
        name: '',
        category: 'clothing',
        subcategory: 'Casual Wear',
        description: '',
        price: '',
        original_price: '',
        stock_quantity: 20,
        sku: '',
        brand: '',
        sizes: ['S', 'M', 'L', 'XL'],
        colors: [{ name: 'Navy Blue', hex: '#000080' }],
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
        trial_supported: true,
        hsn_code: '6205'
      });
      loadData();
      if (onProductListChanged) onProductListChanged();
    } else {
      showToast(res?.error || 'Failed to list product.', 'error');
    }
  };

  // Edit Product Form Submit (Phase 4)
  const handleEditProductSubmit = async (e) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSubmitting(true);
    playClickSound();

    const payload = {
      ...editingProduct,
      phone: phoneToQuery,
      price: Number(editingProduct.price),
      original_price: editingProduct.original_price ? Number(editingProduct.original_price) : null,
      stock_quantity: parseInt(editingProduct.stock_quantity) || 0
    };

    const res = await updateShopProductApi(editingProduct.id, payload);
    setIsSubmitting(false);

    if (res?.success) {
      showToast(`Updated product "${editingProduct.name}"`);
      setEditingProduct(null);
      loadData();
      if (onProductListChanged) onProductListChanged();
    } else {
      showToast(res?.error || 'Failed to update product', 'error');
    }
  };

  // Quick Stock & Availability Toggle (Phase 7)
  const handleQuickStockAdjust = async (productId, delta) => {
    playClickSound();
    const prod = shopProducts.find(p => p.id === productId);
    if (!prod) return;

    const newStock = Math.max(0, parseInt(prod.stock_quantity || 0) + delta);
    const newStatus = newStock === 0 ? 'OUT_OF_STOCK' : 'ACTIVE';

    const res = await updateShopProductStockApi(productId, newStock, prod.price, newStatus, phoneToQuery);
    if (res?.success) {
      setShopProducts(prev => prev.map(p => p.id === productId ? { ...p, stock_quantity: newStock, status: newStatus } : p));
      showToast(`Stock updated to ${newStock} units`);
      if (onProductListChanged) onProductListChanged();
    }
  };

  // Toggle In Stock / Out of Stock
  const handleToggleProductStatus = async (productId) => {
    playClickSound();
    const prod = shopProducts.find(p => p.id === productId);
    if (!prod) return;

    const nextStatus = prod.status === 'ACTIVE' ? 'OUT_OF_STOCK' : 'ACTIVE';
    const nextStock = nextStatus === 'OUT_OF_STOCK' ? 0 : Math.max(5, parseInt(prod.stock_quantity || 0));

    const res = await updateShopProductStockApi(productId, nextStock, prod.price, nextStatus, phoneToQuery);
    if (res?.success) {
      setShopProducts(prev => prev.map(p => p.id === productId ? { ...p, status: nextStatus, stock_quantity: nextStock } : p));
      showToast(nextStatus === 'ACTIVE' ? 'Product marked In Stock' : 'Product marked Out of Stock');
      if (onProductListChanged) onProductListChanged();
    }
  };

  // Delete / Archive Product (Phase 4)
  const handleDeleteProduct = async (productId, name) => {
    if (!window.confirm(`Are you sure you want to archive "${name}" from your active catalog?`)) return;
    playClickSound();

    const res = await deleteShopProductApi(productId, phoneToQuery);
    if (res?.success) {
      setShopProducts(prev => prev.filter(p => p.id !== productId));
      showToast(`Archived "${name}"`);
      if (onProductListChanged) onProductListChanged();
    }
  };

  // Accept Order (Phase 6)
  const handleAcceptOrder = async (orderId) => {
    playAddSound();
    const res = await acceptShopOrderApi(orderId, 5);
    if (res?.success) {
      showToast(`Order ${orderId} accepted! Garments ready for packing.`);
      loadData();
    }
  };

  // Reject Order (Phase 6)
  const handleConfirmRejectOrder = async () => {
    if (!rejectingOrderId) return;
    playClickSound();
    const res = await rejectShopOrderApi(rejectingOrderId, rejectReason);
    if (res?.success) {
      showToast(`Order ${rejectingOrderId} cancelled & customer refunded.`);
      setRejectingOrderId(null);
      loadData();
    }
  };

  // Dispatch / Mark Packed (Phase 6)
  const handleDispatchOrder = async (orderId) => {
    playClickSound();
    const res = await dispatchShopOrderApi(orderId);
    if (res?.success) {
      showToast(`Order ${orderId} marked packed! EV Rider Rahul Sharma dispatched.`);
      loadData();
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter(o => {
    if (orderFilter === 'needs_packing') {
      return !o.status.includes('Packed') && !o.status.includes('Out') && !o.status.includes('Delivered') && o.status !== 'Cancelled';
    }
    if (orderFilter === 'packed') return o.status.includes('Packed');
    if (orderFilter === 'out') return o.status.includes('Out');
    if (orderFilter === 'delivered') return o.status.includes('Delivered');
    return true;
  });

  // Filtered Products for Catalog Management
  const filteredCatalogProducts = shopProducts.filter(p => {
    if (productCatFilter !== 'all' && p.category !== productCatFilter) return false;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchSku = p.sku && p.sku.toLowerCase().includes(q);
      const matchBrand = p.brand && p.brand.toLowerCase().includes(q);
      if (!matchName && !matchSku && !matchBrand) return false;
    }
    return true;
  });

  // Calculate live KPI counts
  const needsPackingCount = orders.filter(o => !o.status.includes('Packed') && !o.status.includes('Out') && !o.status.includes('Delivered') && o.status !== 'Cancelled').length;
  const lowStockProductsCount = shopProducts.filter(p => parseInt(p.stock_quantity || 0) < 5).length;
  const verificationStatus = shop?.verification_status || regForm.verification_status || 'APPROVED';

  return (
    <div className="pro-portal pro-shop-portal">
      
      {/* 1. Sleek Navigation Header */}
      <header className="pro-header">
        <div className="pro-header-row">
          <div className="pro-header-left">
            <button className="pro-back-circle-btn" onClick={onNavigateHome} aria-label="Back">
              <ChevronLeft size={18} />
            </button>
            <div className="pro-header-title-group">
              <div className="pro-brand-chip gold">
                <span className="pro-brand-dot gold" />
                <span className="pro-brand-text">NIVVO MERCHANT NETWORK</span>
              </div>
              <h1 className="pro-page-title">Store & Boutique Console</h1>
            </div>
          </div>

          <div className="pro-header-right">
            <button 
              className={`pro-status-toggle ${isOpen ? 'online' : 'offline'}`}
              onClick={handleToggleStoreOpen}
              title="Toggle store open/closed"
            >
              <span className="pro-status-knob" />
              <span className="pro-status-label">{isOpen ? 'STORE OPEN' : 'STORE PAUSED'}</span>
            </button>
          </div>
        </div>

        {/* Role Navigation Strip */}
        <div className="pro-role-strip">
          <div className="pro-role-label">Switch Workspace:</div>
          <div className="pro-role-pills">
            <button className="pro-role-pill" onClick={() => onSwitchRole('home')}>
              🛍️ Customer
            </button>
            <button className="pro-role-pill" onClick={() => onSwitchRole('delivery-partner')}>
              🛵 Delivery Fleet
            </button>
            <button className="pro-role-pill active">
              🏬 Shop Console
            </button>
          </div>
        </div>

        {/* Shop Summary Strip with Live Verification Badge */}
        <div className="pro-partner-bar gold">
          <div className="pro-partner-avatar-wrap gold">
            <Store size={22} color="#B45309" />
          </div>
          <div className="pro-partner-info">
            <div className="pro-partner-name-row">
              <span className="pro-partner-name">{shop?.shop_name || regForm.shop_name}</span>
              
              {/* Verification Status Badge */}
              {verificationStatus === 'APPROVED' && (
                <span className="pro-badge rating green" title="Approved by Nivvo">
                  <ShieldCheck size={12} /> Verified Merchant
                </span>
              )}
              {verificationStatus === 'VERIFICATION_PENDING' && (
                <span className="pro-badge rating amber" title="Under 2-hour fast review">
                  <Clock size={12} /> Review Pending
                </span>
              )}
              {verificationStatus === 'REJECTED' && (
                <span className="pro-badge rating red" title="Action required">
                  <AlertCircle size={12} /> Rejected
                </span>
              )}

              <span className="pro-badge orders">⭐ {shop?.rating || '4.92'}</span>
              <span className="pro-badge orders">{shop?.total_orders || orders.length} Orders</span>
            </div>
            <div className="pro-partner-sub">
              <span>{shop?.category || regForm.category}</span>
              <span className="pro-divider">•</span>
              <span>{shop?.address || regForm.address} ({shop?.city || 'Bangalore'})</span>
              <span className="pro-divider">•</span>
              <span style={{ color: '#B45309', fontWeight: 700 }}>ID: {shop?.shop_id || 'SHP-4012'}</span>
            </div>
          </div>
        </div>

        {/* 5-Tab Segmented Navigation Bar */}
        <div className="pro-tab-bar gold">
          <button 
            className={`pro-tab-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('dashboard'); }}
          >
            <Layers size={15} />
            <span>Overview</span>
          </button>
          <button 
            className={`pro-tab-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('orders'); }}
          >
            <Package size={15} />
            <span>Orders to Pack ({needsPackingCount})</span>
          </button>
          <button 
            className={`pro-tab-item ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('products'); }}
          >
            <SlidersHorizontal size={15} />
            <span>Products ({shopProducts.length})</span>
          </button>
          <button 
            className={`pro-tab-item ${activeTab === 'sales' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('sales'); }}
          >
            <TrendingUp size={15} />
            <span>Payouts (₹{earnings?.today_gross || shop?.today_revenue || 0})</span>
          </button>
          <button 
            className={`pro-tab-item ${activeTab === 'kyc' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('kyc'); }}
          >
            <Building2 size={15} />
            <span>KYC & Settings</span>
          </button>
        </div>
      </header>

      {/* Global Toast Alert */}
      {toastMsg && (
        <div className={`pro-toast-banner ${toastMsg.type === 'error' ? 'error' : 'success'}`}>
          {toastMsg.type === 'error' ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="pro-main-content">

        {/* ==================== TAB 1: OVERVIEW DASHBOARD (Phase 3) ==================== */}
        {activeTab === 'dashboard' && (
          <div className="pro-tab-pane">

            {/* Verification Alert Banner if Not Approved */}
            {verificationStatus === 'VERIFICATION_PENDING' && (
              <div className="pro-verification-banner amber">
                <Clock size={20} color="#D97706" />
                <div style={{ flex: 1 }}>
                  <h4>Business Verification in Progress (Under 2-Hr Fast-Track)</h4>
                  <p>Our merchant onboarding specialist is validating your GSTIN and trade license. Your products will be visible to 50,000+ local buyers once approved.</p>
                </div>
                <button className="pro-primary-btn sm gold" onClick={() => handleSwitchVerificationState('APPROVED')}>
                  ⚡ Fast-Track Approve
                </button>
              </div>
            )}

            {verificationStatus === 'REJECTED' && (
              <div className="pro-verification-banner red">
                <AlertCircle size={20} color="#DC2626" />
                <div style={{ flex: 1 }}>
                  <h4>Verification Rejected</h4>
                  <p>Reason: {shop?.rejection_reason || regForm.rejection_reason || 'Address mismatch between GST certificate and boutique location. Please upload updated address proof.'}</p>
                </div>
                <button className="pro-primary-btn sm red" onClick={() => setActiveTab('kyc')}>
                  Resubmit Details
                </button>
              </div>
            )}

            {/* 4-Card Real Backend KPI Grid */}
            <div className="pro-kpi-grid">
              <div className="pro-kpi-card gold-border">
                <span className="pro-kpi-label">Today's Store Sales</span>
                <span className="pro-kpi-val">₹{earnings?.today_gross || shop?.today_revenue || 0}</span>
                <span className="pro-kpi-desc">Across {earnings?.today_orders_count || 0} verified orders</span>
              </div>
              <div className="pro-kpi-card">
                <span className="pro-kpi-label">Orders to Pack</span>
                <span className="pro-kpi-val" style={{ color: needsPackingCount > 0 ? '#B45309' : '#166534' }}>
                  {needsPackingCount} Orders
                </span>
                <span className="pro-kpi-desc">Avg dispatch SLA: 3.2 mins</span>
              </div>
              <div className="pro-kpi-card">
                <span className="pro-kpi-label">Active Listed Catalog</span>
                <span className="pro-kpi-val">{shopProducts.length} Items</span>
                <span className="pro-kpi-desc">10-Minute Wardrobe Grid</span>
              </div>
              <div className="pro-kpi-card">
                <span className="pro-kpi-label">Low Stock Alerts</span>
                <span className="pro-kpi-val" style={{ color: lowStockProductsCount > 0 ? '#DC2626' : '#166534' }}>
                  {lowStockProductsCount} Products
                </span>
                <span className="pro-kpi-desc">&lt; 5 units remaining</span>
              </div>
            </div>

            {/* Quick Actions Action Bar */}
            <div className="pro-quick-actions-bar">
              <button 
                className="pro-primary-btn gold"
                onClick={() => { playClickSound(); setIsAddProductModalOpen(true); }}
              >
                <Plus size={16} />
                <span>Add New Product</span>
              </button>
              <button 
                className="pro-secondary-btn"
                onClick={() => { playClickSound(); setActiveTab('orders'); }}
              >
                <Package size={16} />
                <span>Manage Orders ({orders.length})</span>
              </button>
              <button 
                className="pro-secondary-btn"
                onClick={() => { playClickSound(); setActiveTab('products'); }}
              >
                <SlidersHorizontal size={16} />
                <span>Update Stock & Prices</span>
              </button>
              <button 
                className="pro-secondary-btn"
                onClick={() => { playClickSound(); setActiveTab('sales'); }}
              >
                <FileSpreadsheet size={16} />
                <span>View Payout Ledger</span>
              </button>
            </div>

            {/* Live Incoming Orders Preview */}
            <div className="pro-surface-card" style={{ marginTop: '16px' }}>
              <div className="pro-surface-title-row">
                <div className="pro-surface-title">
                  <Package size={17} color="#B45309" />
                  <span>Recent Incoming Customer Orders</span>
                </div>
                <button 
                  className="pro-link-btn" 
                  onClick={() => setActiveTab('orders')}
                >
                  View All ({orders.length}) →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="pro-empty-card sm">
                  <p>No orders received yet today. Keep store status OPEN to receive orders.</p>
                </div>
              ) : (
                <div className="pro-orders-mini-list">
                  {orders.slice(0, 4).map(ord => (
                    <div key={ord.order_id} className="pro-order-mini-row">
                      <div className="mini-col-id">
                        <strong>#{ord.order_id}</strong>
                        <span>{new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <div className="mini-col-items">
                        <span>{Array.isArray(ord.items) ? ord.items.map(it => it.name).join(', ') : 'Garment items'}</span>
                        <small>📍 {ord.address}</small>
                      </div>
                      <div className="mini-col-price">
                        <strong>₹{ord.grand_total}</strong>
                        <span className={`pro-status-tag ${ord.status.includes('Packed') ? 'blue' : ord.status.includes('Delivered') ? 'green' : 'amber'}`}>
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Low-Stock Warning List (if any) */}
            {lowStockProductsCount > 0 && (
              <div className="pro-surface-card alert-amber" style={{ marginTop: '16px' }}>
                <div className="pro-surface-title">
                  <AlertTriangle size={17} color="#D97706" />
                  <span>Immediate Restock Required ({lowStockProductsCount} Products)</span>
                </div>
                <div className="pro-low-stock-list">
                  {shopProducts.filter(p => parseInt(p.stock_quantity || 0) < 5).map(p => (
                    <div key={p.id} className="pro-low-stock-row">
                      <span>{p.name}</span>
                      <span className="stock-count-badge red">{p.stock_quantity} Left</span>
                      <button 
                        className="pro-primary-btn sm gold"
                        onClick={() => handleQuickStockAdjust(p.id, 10)}
                      >
                        + Add 10 Units
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 2: ORDER MANAGEMENT (Phase 6) ==================== */}
        {activeTab === 'orders' && (
          <div className="pro-tab-pane">
            <div className="pro-pane-header">
              <div>
                <h2 className="pro-pane-title">Fulfillment & Order Packaging Deck</h2>
                <p className="pro-pane-desc">Steam-press at 120°C, seal into crease-free hanger bags, and hand over to EV riders</p>
              </div>

              {/* Order Status Filter Buttons */}
              <div className="pro-filter-pills">
                <button 
                  className={`pro-filter-pill ${orderFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('all')}
                >
                  All ({orders.length})
                </button>
                <button 
                  className={`pro-filter-pill ${orderFilter === 'needs_packing' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('needs_packing')}
                >
                  Needs Packing ({needsPackingCount})
                </button>
                <button 
                  className={`pro-filter-pill ${orderFilter === 'packed' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('packed')}
                >
                  Packed & Ready
                </button>
                <button 
                  className={`pro-filter-pill ${orderFilter === 'out' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('out')}
                >
                  Out for Delivery
                </button>
                <button 
                  className={`pro-filter-pill ${orderFilter === 'delivered' ? 'active' : ''}`}
                  onClick={() => setOrderFilter('delivered')}
                >
                  Delivered
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="pro-empty-card">
                <div className="pro-empty-icon gold">
                  <Package size={26} />
                </div>
                <h3>No Orders in this Status</h3>
                <p>New customer wardrobe requests will automatically pop up with audio fanfare.</p>
              </div>
            ) : (
              <div className="pro-orders-stack">
                {filteredOrders.map((ord) => {
                  const isReady = ord.status.includes('Packed') || ord.status.includes('Ready');
                  const isOut = ord.status.includes('Out for');
                  const isDelivered = ord.status.includes('Delivered');
                  const isCancelled = ord.status === 'Cancelled';
                  const itemsList = Array.isArray(ord.items) ? ord.items : (typeof ord.items === 'string' ? JSON.parse(ord.items || '[]') : []);

                  return (
                    <div key={ord.order_id} className={`pro-order-card ${isReady ? 'ready' : isOut ? 'out' : isDelivered ? 'delivered' : 'pending'}`}>
                      {/* Order Header */}
                      <div className="pro-card-header">
                        <div className="pro-card-id-group">
                          <span className="pro-order-id font-mono">#{ord.order_id}</span>
                          <span className="pro-time-chip">
                            <Clock size={12} />
                            <span>{new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </span>
                        </div>
                        <div className="pro-card-status-group">
                          <span className={`pro-status-badge ${isReady ? 'ready' : isOut ? 'out' : isDelivered ? 'delivered' : isCancelled ? 'red' : 'pending'}`}>
                            {ord.status}
                          </span>
                        </div>
                      </div>

                      {/* Customer & Location */}
                      <div className="pro-order-meta-row">
                        <div>
                          <strong>📍 Delivery Location:</strong> {ord.address}
                        </div>
                        <div>
                          <strong>Payment:</strong> {ord.payment_method} ({ord.payment_id || 'Instant'})
                        </div>
                        <div>
                          <strong>Hub Route:</strong> Bay #3, Indiranagar Hub (0.6 km)
                        </div>
                      </div>

                      {/* Items Manifest */}
                      <div className="pro-manifest-box">
                        <div className="pro-manifest-header">
                          <Tag size={13} color="#B45309" />
                          <span>Garment Packing Manifest ({itemsList.length} Items)</span>
                        </div>
                        {itemsList.map((it, idx) => (
                          <div key={idx} className="pro-packing-row">
                            <div className="pro-item-emoji">👔</div>
                            <div className="pro-item-text">
                              <span className="pro-item-title">{it.name}</span>
                              <span className="pro-item-specs">
                                Size: <strong>{it.selectedSize || 'L'}</strong> • Qty: {it.qty || it.quantity || 1}
                                {it.trialSupported && <span className="pro-trial-badge">⚡ 2-Size Trial Bundle</span>}
                              </span>
                            </div>
                            <span className="pro-item-price">₹{it.price || 899}</span>
                          </div>
                        ))}
                      </div>

                      {/* Card Action Controls */}
                      <div className="pro-card-action">
                        {!isReady && !isOut && !isDelivered && !isCancelled && (
                          <div className="pro-action-btn-row">
                            <button 
                              className="pro-primary-btn gold flex-1"
                              onClick={() => handleDispatchOrder(ord.order_id)}
                            >
                              <Package size={15} />
                              <span>Mark Packed & Alert EV Rider</span>
                            </button>
                            <button 
                              className="pro-secondary-btn red"
                              onClick={() => setRejectingOrderId(ord.order_id)}
                            >
                              <span>Reject</span>
                            </button>
                          </div>
                        )}

                        {isReady && (
                          <div className="pro-complete-banner gold">
                            <Truck size={16} />
                            <span>Rider Assigned ({ord.rider_name || 'Rahul Sharma'}) • En route to Dark Store Bay #3</span>
                          </div>
                        )}

                        {isOut && (
                          <div className="pro-complete-banner blue">
                            <CheckCircle2 size={16} />
                            <span>Picked up by EV Rider Rahul Sharma • On 10-Min Delivery Route</span>
                          </div>
                        )}

                        {isDelivered && (
                          <div className="pro-complete-banner green">
                            <Check size={16} />
                            <span>Delivered & Handover Confirmed (OTP Verified)</span>
                          </div>
                        )}

                        {isCancelled && (
                          <div className="pro-complete-banner red">
                            <AlertCircle size={16} />
                            <span>Cancelled ({ord.cancellation_reason || 'Refund Processed'})</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 3: PRODUCT LISTING & INVENTORY (Phase 4 & 7) ==================== */}
        {activeTab === 'products' && (
          <div className="pro-tab-pane">
            <div className="pro-pane-header">
              <div>
                <h2 className="pro-pane-title">Boutique Catalog & Live Stock Management</h2>
                <p className="pro-pane-desc">List fashion products, adjust inventory quantities, and manage pricing visible to local shoppers</p>
              </div>

              <button 
                className="pro-primary-btn gold"
                onClick={() => { playClickSound(); setIsAddProductModalOpen(true); }}
              >
                <Plus size={16} />
                <span>+ List New Product</span>
              </button>
            </div>

            {/* Search and Category Filters */}
            <div className="pro-catalog-filter-bar">
              <div className="pro-search-box">
                <Search size={15} color="#94A3B8" />
                <input 
                  type="text"
                  placeholder="Search by product name, brand, or SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pro-search-input"
                />
              </div>

              <select 
                value={productCatFilter}
                onChange={(e) => setProductCatFilter(e.target.value)}
                className="pro-select-dropdown"
              >
                <option value="all">All Categories</option>
                <option value="clothing">Clothing & Apparel</option>
                <option value="festive">Festive & Ethnic</option>
                <option value="footwear">Footwear & Shoes</option>
                <option value="casual">Casuals & Tees</option>
                <option value="electronics">Electronics & Audio</option>
                <option value="sos">10-Min SOS Kits</option>
                <option value="groceries">Groceries & Daily</option>
                <option value="beauty">Beauty & Cosmetics</option>
              </select>
            </div>

            {/* Catalog Products List */}
            {filteredCatalogProducts.length === 0 ? (
              <div className="pro-empty-card">
                <div className="pro-empty-icon gold">
                  <SlidersHorizontal size={26} />
                </div>
                <h3>No Products Found</h3>
                <p>Add your boutique apparel or adjust your search filter to list products in Nivvo Marketplace.</p>
                <button 
                  className="pro-primary-btn gold" 
                  style={{ margin: '14px auto 0 auto' }}
                  onClick={() => setIsAddProductModalOpen(true)}
                >
                  <Plus size={15} /> Add First Product
                </button>
              </div>
            ) : (
              <div className="pro-catalog-grid">
                {filteredCatalogProducts.map((prod) => {
                  const inStock = prod.status === 'ACTIVE' && parseInt(prod.stock_quantity || 0) > 0;
                  const stockNum = parseInt(prod.stock_quantity || 0);

                  return (
                    <div key={prod.id} className={`pro-catalog-card ${!inStock ? 'out-of-stock' : ''}`}>
                      <div className="pro-catalog-thumb-wrap">
                        <img 
                          src={prod.image || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80'} 
                          alt={prod.name}
                          className="pro-catalog-thumb"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80';
                          }}
                        />
                        <span className={`stock-floating-pill ${stockNum === 0 ? 'red' : stockNum < 5 ? 'amber' : 'green'}`}>
                          {stockNum === 0 ? 'SOLD OUT' : `${stockNum} in stock`}
                        </span>
                      </div>

                      <div className="pro-catalog-details">
                        <div className="pro-catalog-cat-row">
                          <span className="pro-catalog-cat-badge">{prod.category}</span>
                          {prod.trial_supported && <span className="pro-trial-tag">⚡ 2-Size Trial</span>}
                        </div>

                        <h4 className="pro-catalog-title">{prod.name}</h4>
                        <div className="pro-catalog-brand">Brand: {prod.brand || 'Nivvo Partner'} • SKU: {prod.sku || prod.id}</div>

                        <div className="pro-catalog-pricing-row">
                          <span className="pro-catalog-price-val">₹{prod.price}</span>
                          {prod.original_price && (
                            <span className="pro-catalog-mrp-val">₹{prod.original_price}</span>
                          )}
                        </div>

                        {/* Stock Quick Stepper */}
                        <div className="pro-stock-stepper-row">
                          <span className="stepper-label">Quick Stock:</span>
                          <div className="stepper-ctrls">
                            <button 
                              className="stepper-btn minus"
                              onClick={() => handleQuickStockAdjust(prod.id, -1)}
                              title="Decrease stock"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="stepper-val">{stockNum}</span>
                            <button 
                              className="stepper-btn plus"
                              onClick={() => handleQuickStockAdjust(prod.id, 1)}
                              title="Increase stock"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Card Footer Actions */}
                        <div className="pro-catalog-actions-row">
                          <button 
                            className={`pro-stock-switch-btn ${inStock ? 'active' : ''}`}
                            onClick={() => handleToggleProductStatus(prod.id)}
                          >
                            {inStock ? 'Mark Sold Out' : 'Mark In Stock'}
                          </button>
                          <button 
                            className="pro-icon-action-btn edit"
                            onClick={() => setEditingProduct(prod)}
                            title="Edit product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button 
                            className="pro-icon-action-btn delete"
                            onClick={() => handleDeleteProduct(prod.id, prod.name)}
                            title="Archive product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB 4: REVENUE & SETTLEMENTS (Phase 8) ==================== */}
        {activeTab === 'sales' && (
          <div className="pro-tab-pane">
            <div className="pro-hero-wallet gold">
              <div className="pro-wallet-top">
                <span className="pro-wallet-caption">REAL-TIME STORE GROSS REVENUE</span>
                <span className="pro-wallet-badge">T+1 AUTOMATIC SETTLEMENT</span>
              </div>
              <div className="pro-wallet-figure">₹{earnings?.today_gross || shop?.today_revenue || 0}</div>
              <div className="pro-wallet-sub">
                <span>Verified Orders Processed: <strong>{earnings?.lifetime_orders_count || orders.length} orders</strong></span>
                <span className="pro-divider">•</span>
                <span>Platform Commission: <strong>0% (Inaugural Free Launch)</strong></span>
                <span className="pro-divider">•</span>
                <span>Net Transfer Amount: <strong>₹{earnings?.net_payout_amount || shop?.today_revenue || 0}</strong></span>
              </div>
            </div>

            {/* KPI Cards */}
            <div className="pro-kpi-grid">
              <div className="pro-kpi-card">
                <span className="pro-kpi-label">Today's Orders</span>
                <span className="pro-kpi-val">{earnings?.today_orders_count || 0} Orders</span>
                <span className="pro-kpi-desc">Avg dispatch: 2.8 mins</span>
              </div>
              <div className="pro-kpi-card">
                <span className="pro-kpi-label">Commission Deducted</span>
                <span className="pro-kpi-val green" style={{ color: '#166534' }}>₹{earnings?.commission_deducted || 0}</span>
                <span className="pro-kpi-desc">0% Launch Promotion</span>
              </div>
              <div className="pro-kpi-card">
                <span className="pro-kpi-label">Next Bank Settlement</span>
                <span className="pro-kpi-val">Tonight 11:59 PM</span>
                <span className="pro-kpi-desc">Direct IMPS / NEFT Credit</span>
              </div>
            </div>

            {/* Verified Settlement Account */}
            <div className="pro-surface-card" style={{ marginTop: '16px' }}>
              <div className="pro-surface-title">
                <ShieldCheck size={18} color="#B45309" />
                <span>Designated Merchant Payout Account (Verified)</span>
              </div>
              <div className="pro-bank-row">
                <div>
                  <div className="pro-bank-account">{shop?.bank_name || regForm.bank_name}: {shop?.bank_account || regForm.bank_account}</div>
                  <div className="pro-bank-meta">
                    IFSC: <strong>{shop?.bank_ifsc || regForm.bank_ifsc}</strong> • UPI: <strong>{shop?.upi_id || regForm.upi_id}</strong> • GSTIN: <strong>{shop?.gstin || regForm.gstin}</strong>
                  </div>
                </div>
                <button 
                  className="pro-primary-btn gold sm"
                  onClick={() => alert('Official settlement ledger statement exported for accounting & GST filing.')}
                >
                  <FileSpreadsheet size={14} />
                  <span>Export Ledger (.CSV)</span>
                </button>
              </div>
            </div>

            {/* Transaction Ledger Table */}
            <div className="pro-surface-card" style={{ marginTop: '16px' }}>
              <div className="pro-surface-title">
                <CreditCard size={18} color="#B45309" />
                <span>Recent Order Settlement Breakdown</span>
              </div>

              {earnings?.recent_transactions && earnings.recent_transactions.length > 0 ? (
                <div className="pro-ledger-table-wrap">
                  <table className="pro-ledger-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Date & Time</th>
                        <th>Gross Value</th>
                        <th>Nivvo Fee (0%)</th>
                        <th>Net Payout</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {earnings.recent_transactions.map((tx, idx) => (
                        <tr key={idx}>
                          <td className="font-mono">#{tx.order_id}</td>
                          <td>{new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="font-bold">₹{tx.gross}</td>
                          <td style={{ color: '#166534' }}>-₹{tx.commission}</td>
                          <td className="font-bold font-green" style={{ color: '#166534' }}>₹{tx.net}</td>
                          <td>
                            <span className={`pro-ledger-badge ${tx.status === 'Settled' ? 'green' : 'amber'}`}>
                              {tx.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-history-text" style={{ padding: '16px', textAlign: 'center' }}>
                  No settled orders yet today. Orders appear here upon delivery.
                </p>
              )}
            </div>
          </div>
        )}

        {/* ==================== TAB 5: REGISTRATION, KYC & PROFILE (Phase 2 & 8) ==================== */}
        {activeTab === 'kyc' && (
          <div className="pro-tab-pane">
            <div className="pro-surface-card highlight gold">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h2 className="pro-form-title">Boutique Registration & Compliance Dossier</h2>
                  <p className="pro-form-sub">
                    Connect your store to Nivvo's 10-minute instant delivery grid. Receive customer orders within your 3 km hub zone.
                  </p>
                </div>

                {/* State Simulator Switcher for Review/Testing */}
                <div className="pro-state-simulator">
                  <span style={{ fontSize: '11px', fontWeight: 800, color: '#B45309' }}>Test Review State:</span>
                  <button 
                    className={`pro-sim-btn ${verificationStatus === 'APPROVED' ? 'active green' : ''}`}
                    onClick={() => handleSwitchVerificationState('APPROVED')}
                  >
                    ✓ Approved
                  </button>
                  <button 
                    className={`pro-sim-btn ${verificationStatus === 'VERIFICATION_PENDING' ? 'active amber' : ''}`}
                    onClick={() => handleSwitchVerificationState('VERIFICATION_PENDING')}
                  >
                    ⏳ Pending
                  </button>
                  <button 
                    className={`pro-sim-btn ${verificationStatus === 'REJECTED' ? 'active red' : ''}`}
                    onClick={() => handleSwitchVerificationState('REJECTED', 'Trade license expired or GST address mismatched')}
                  >
                    ✕ Rejected
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSaveRegistration} className="pro-surface-card" style={{ marginTop: '16px' }}>
              
              {/* Section 1: Identity */}
              <div className="pro-form-section">
                <h3 className="pro-section-heading">1. Shop Owner & Store Identity</h3>
                <div className="pro-form-grid-2">
                  <div className="pro-field-group">
                    <label>Store / Brand Name *</label>
                    <input 
                      type="text" 
                      value={regForm.shop_name} 
                      onChange={(e) => setRegForm({ ...regForm, shop_name: e.target.value })}
                      required 
                      className="pro-input" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>Owner Full Name *</label>
                    <input 
                      type="text" 
                      value={regForm.owner_name} 
                      onChange={(e) => setRegForm({ ...regForm, owner_name: e.target.value })}
                      required 
                      className="pro-input" 
                    />
                  </div>
                </div>

                <div className="pro-form-grid-3" style={{ marginTop: '10px' }}>
                  <div className="pro-field-group">
                    <label>Primary Phone (OTP Verified) *</label>
                    <input 
                      type="text" 
                      value={regForm.phone} 
                      onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                      required 
                      className="pro-input" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>Official Merchant Email</label>
                    <input 
                      type="email" 
                      value={regForm.email} 
                      onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                      className="pro-input" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>Primary Shop Category *</label>
                    <select 
                      value={regForm.category} 
                      onChange={(e) => setRegForm({ ...regForm, category: e.target.value })}
                      className="pro-input"
                    >
                      {SELLER_CATEGORIES.map((cat, idx) => (
                        <option key={idx} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2: Physical Location & Hours */}
              <div className="pro-form-section">
                <h3 className="pro-section-heading">2. Physical Store Location & Operating Hours</h3>
                <div className="pro-field-group">
                  <label>Complete Boutique Street Address *</label>
                  <input 
                    type="text" 
                    value={regForm.address} 
                    onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                    required 
                    className="pro-input" 
                  />
                </div>

                <div className="pro-form-grid-3" style={{ marginTop: '10px' }}>
                  <div className="pro-field-group">
                    <label>City *</label>
                    <input 
                      type="text" 
                      value={regForm.city} 
                      onChange={(e) => setRegForm({ ...regForm, city: e.target.value })}
                      required 
                      className="pro-input" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>State *</label>
                    <input 
                      type="text" 
                      value={regForm.state} 
                      onChange={(e) => setRegForm({ ...regForm, state: e.target.value })}
                      required 
                      className="pro-input" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>PIN Code *</label>
                    <input 
                      type="text" 
                      value={regForm.pincode} 
                      onChange={(e) => setRegForm({ ...regForm, pincode: e.target.value })}
                      required 
                      className="pro-input" 
                    />
                  </div>
                </div>

                <div className="pro-form-grid-2" style={{ marginTop: '10px' }}>
                  <div className="pro-field-group">
                    <label>Store Operating Hours *</label>
                    <input 
                      type="text" 
                      value={regForm.operating_hours} 
                      onChange={(e) => setRegForm({ ...regForm, operating_hours: e.target.value })}
                      placeholder="e.g. 09:00 AM - 10:00 PM"
                      className="pro-input" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>Order Dispatch Desk Phone</label>
                    <input 
                      type="text" 
                      value={regForm.contact_phone} 
                      onChange={(e) => setRegForm({ ...regForm, contact_phone: e.target.value })}
                      placeholder="+91 98765-XXXXX"
                      className="pro-input" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Business & Tax Verification */}
              <div className="pro-form-section">
                <h3 className="pro-section-heading">3. Business Legal & Tax Identification</h3>
                <div className="pro-form-grid-3">
                  <div className="pro-field-group">
                    <label>GSTIN Number</label>
                    <input 
                      type="text" 
                      value={regForm.gstin} 
                      onChange={(e) => setRegForm({ ...regForm, gstin: e.target.value })}
                      placeholder="29AABCU9603R1ZM"
                      className="pro-input font-mono" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>Permanent Account Number (PAN)</label>
                    <input 
                      type="text" 
                      value={regForm.pan_number} 
                      onChange={(e) => setRegForm({ ...regForm, pan_number: e.target.value })}
                      placeholder="AABCU9603R"
                      className="pro-input font-mono" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>Municipal Trade License / FSSAI</label>
                    <input 
                      type="text" 
                      value={regForm.trade_license} 
                      onChange={(e) => setRegForm({ ...regForm, trade_license: e.target.value })}
                      placeholder="TL-BLR-2026-90412"
                      className="pro-input font-mono" 
                    />
                  </div>
                </div>

                {/* Upload simulation cards */}
                <div className="pro-doc-upload-grid">
                  <div className="pro-doc-upload-card">
                    <UploadCloud size={20} color="#B45309" />
                    <strong>Shop Signboard / Facade Photo</strong>
                    <span>Uploaded: store_facade_indiranagar.jpg</span>
                    <span className="doc-ok-tag">✓ Verified</span>
                  </div>
                  <div className="pro-doc-upload-card">
                    <UploadCloud size={20} color="#B45309" />
                    <strong>GST Registration Certificate</strong>
                    <span>Uploaded: gst_reg_form_06.pdf</span>
                    <span className="doc-ok-tag">✓ Verified</span>
                  </div>
                  <div className="pro-doc-upload-card">
                    <UploadCloud size={20} color="#B45309" />
                    <strong>Cancelled Cheque / Passbook</strong>
                    <span>Uploaded: icici_cancelled_cheque.pdf</span>
                    <span className="doc-ok-tag">✓ Verified</span>
                  </div>
                </div>
              </div>

              {/* Section 4: Bank Details for T+1 Payouts */}
              <div className="pro-form-section">
                <h3 className="pro-section-heading">4. Bank Account for Automated T+1 Settlement</h3>
                <div className="pro-form-grid-2">
                  <div className="pro-field-group">
                    <label>Bank Name *</label>
                    <input 
                      type="text" 
                      value={regForm.bank_name} 
                      onChange={(e) => setRegForm({ ...regForm, bank_name: e.target.value })}
                      className="pro-input" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>Account Number *</label>
                    <input 
                      type="text" 
                      value={regForm.bank_account} 
                      onChange={(e) => setRegForm({ ...regForm, bank_account: e.target.value })}
                      className="pro-input font-mono" 
                    />
                  </div>
                </div>

                <div className="pro-form-grid-2" style={{ marginTop: '10px' }}>
                  <div className="pro-field-group">
                    <label>IFSC Code *</label>
                    <input 
                      type="text" 
                      value={regForm.bank_ifsc} 
                      onChange={(e) => setRegForm({ ...regForm, bank_ifsc: e.target.value })}
                      className="pro-input font-mono" 
                    />
                  </div>
                  <div className="pro-field-group">
                    <label>Instant Settlement UPI ID</label>
                    <input 
                      type="text" 
                      value={regForm.upi_id} 
                      onChange={(e) => setRegForm({ ...regForm, upi_id: e.target.value })}
                      placeholder="store@okaxis"
                      className="pro-input font-mono" 
                    />
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="pro-primary-btn gold w-full"
                >
                  <CheckCircle2 size={16} />
                  <span>{isSubmitting ? 'Validating & Saving...' : 'Save & Update Merchant Profile'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      {/* ==================== MODAL 1: ADD NEW PRODUCT (Phase 4) ==================== */}
      {isAddProductModalOpen && (
        <div className="pro-modal-overlay" onClick={() => setIsAddProductModalOpen(false)}>
          <div className="pro-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Box size={18} color="#B45309" />
                <h3 className="pro-modal-title">List New Product on Nivvo Grid</h3>
              </div>
              <button 
                className="pro-modal-close-btn"
                onClick={() => setIsAddProductModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="pro-modal-body">
              <div className="pro-form-grid-2">
                <div className="pro-field-group">
                  <label>Product Title *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Royal Chanderi Silk Kurta Set"
                    value={newProd.name} 
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    required 
                    className="pro-input" 
                  />
                </div>
                <div className="pro-field-group">
                  <label>Category *</label>
                  <select 
                    value={newProd.category} 
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="pro-input"
                  >
                    <option value="clothing">Clothing & Apparel</option>
                    <option value="festive">Festive & Ethnic Wear</option>
                    <option value="footwear">Footwear & Shoes</option>
                    <option value="casual">Casuals & T-Shirts</option>
                    <option value="electronics">Electronics & Audio</option>
                    <option value="sos">10-Min SOS Outfits</option>
                    <option value="groceries">Groceries & Essentials</option>
                    <option value="beauty">Beauty & Cosmetics</option>
                    <option value="accessories">Bags, Belts & Watches</option>
                  </select>
                </div>
              </div>

              <div className="pro-form-grid-3" style={{ marginTop: '10px' }}>
                <div className="pro-field-group">
                  <label>Selling Price (₹) *</label>
                  <input 
                    type="number" 
                    placeholder="999"
                    value={newProd.price} 
                    onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                    required 
                    className="pro-input font-bold" 
                  />
                </div>
                <div className="pro-field-group">
                  <label>MRP / Original Price (₹)</label>
                  <input 
                    type="number" 
                    placeholder="1999"
                    value={newProd.original_price} 
                    onChange={(e) => setNewProd({ ...newProd, original_price: e.target.value })}
                    className="pro-input" 
                  />
                </div>
                <div className="pro-field-group">
                  <label>Available Stock (Units) *</label>
                  <input 
                    type="number" 
                    placeholder="25"
                    value={newProd.stock_quantity} 
                    onChange={(e) => setNewProd({ ...newProd, stock_quantity: e.target.value })}
                    required 
                    className="pro-input font-bold" 
                  />
                </div>
              </div>

              <div className="pro-form-grid-2" style={{ marginTop: '10px' }}>
                <div className="pro-field-group">
                  <label>Brand / Label</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Manyavar, Nike, Nivvo Studio"
                    value={newProd.brand} 
                    onChange={(e) => setNewProd({ ...newProd, brand: e.target.value })}
                    className="pro-input" 
                  />
                </div>
                <div className="pro-field-group">
                  <label>SKU / Barcode</label>
                  <input 
                    type="text" 
                    placeholder="NV-KURTA-09"
                    value={newProd.sku} 
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    className="pro-input font-mono" 
                  />
                </div>
              </div>

              {/* Dynamic Size Variant Selector for Apparel & Shoes */}
              {(newProd.category === 'clothing' || newProd.category === 'festive' || newProd.category === 'casual' || newProd.category === 'sos') && (
                <div className="pro-field-group" style={{ marginTop: '10px' }}>
                  <label>Available Apparel Sizes (Select Multiple)</label>
                  <div className="pro-size-pill-selector">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((sz) => {
                      const isSelected = newProd.sizes.includes(sz);
                      return (
                        <button 
                          key={sz} 
                          type="button"
                          className={`size-pick-chip ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            if (isSelected) {
                              setNewProd({ ...newProd, sizes: newProd.sizes.filter(s => s !== sz) });
                            } else {
                              setNewProd({ ...newProd, sizes: [...newProd.sizes, sz] });
                            }
                          }}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {newProd.category === 'footwear' && (
                <div className="pro-field-group" style={{ marginTop: '10px' }}>
                  <label>Available Shoe Sizes (UK / India)</label>
                  <div className="pro-size-pill-selector">
                    {['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'].map((sz) => {
                      const isSelected = newProd.sizes.includes(sz);
                      return (
                        <button 
                          key={sz} 
                          type="button"
                          className={`size-pick-chip ${isSelected ? 'selected' : ''}`}
                          onClick={() => {
                            if (isSelected) {
                              setNewProd({ ...newProd, sizes: newProd.sizes.filter(s => s !== sz) });
                            } else {
                              setNewProd({ ...newProd, sizes: [...newProd.sizes, sz] });
                            }
                          }}
                        >
                          {sz}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="pro-field-group" style={{ marginTop: '10px' }}>
                <label>Product Image URL *</label>
                <input 
                  type="url" 
                  value={newProd.image} 
                  onChange={(e) => setNewProd({ ...newProd, image: e.target.value })}
                  required 
                  className="pro-input font-mono" 
                />
                
                {/* Quick Presets */}
                <div className="image-preset-strip">
                  <span style={{ fontSize: '11px', color: '#64748B' }}>Quick Samples:</span>
                  <button 
                    type="button" 
                    className="preset-btn"
                    onClick={() => setNewProd({ 
                      ...newProd, 
                      image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
                      name: newProd.name || 'Festive Silk Kurta Set'
                    })}
                  >
                    🪔 Silk Kurta
                  </button>
                  <button 
                    type="button" 
                    className="preset-btn"
                    onClick={() => setNewProd({ 
                      ...newProd, 
                      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
                      name: newProd.name || 'Nike Air Max Sneaker',
                      category: 'footwear'
                    })}
                  >
                    👟 Sneaker
                  </button>
                  <button 
                    type="button" 
                    className="preset-btn"
                    onClick={() => setNewProd({ 
                      ...newProd, 
                      image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
                      name: newProd.name || 'Heavyweight Drop-Shoulder Tee',
                      category: 'casual'
                    })}
                  >
                    👕 Heavyweight Tee
                  </button>
                </div>
              </div>

              <div className="pro-field-group" style={{ marginTop: '10px' }}>
                <label>Description & Material Specifications</label>
                <textarea 
                  rows={2} 
                  placeholder="e.g. 100% Super-Combed bio-washed cotton, wrinkle-free, steam-pressed at 120°C."
                  value={newProd.description} 
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="pro-input" 
                />
              </div>

              <div className="pro-checkbox-row" style={{ marginTop: '12px' }}>
                <input 
                  type="checkbox" 
                  id="trialCheckbox"
                  checked={newProd.trial_supported}
                  onChange={(e) => setNewProd({ ...newProd, trial_supported: e.target.checked })}
                />
                <label htmlFor="trialCheckbox">
                  <strong>Enable 10-Minute Doorstep 2-Size Trial:</strong> Rider will bring 2 sizes (e.g. M & L) so customer can try on at doorstep. Unwanted size returned immediately with zero paperwork.
                </label>
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="pro-secondary-btn"
                  onClick={() => setIsAddProductModalOpen(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="pro-primary-btn gold"
                >
                  <Plus size={16} />
                  <span>{isSubmitting ? 'Publishing to Marketplace...' : 'Publish Product to Live Grid'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 2: EDIT PRODUCT (Phase 4) ==================== */}
      {editingProduct && (
        <div className="pro-modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="pro-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={18} color="#B45309" />
                <h3 className="pro-modal-title">Edit Product Details & Stock</h3>
              </div>
              <button className="pro-modal-close-btn" onClick={() => setEditingProduct(null)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditProductSubmit} className="pro-modal-body">
              <div className="pro-field-group">
                <label>Product Title *</label>
                <input 
                  type="text" 
                  value={editingProduct.name} 
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  required 
                  className="pro-input" 
                />
              </div>

              <div className="pro-form-grid-3" style={{ marginTop: '10px' }}>
                <div className="pro-field-group">
                  <label>Price (₹) *</label>
                  <input 
                    type="number" 
                    value={editingProduct.price} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    required 
                    className="pro-input font-bold" 
                  />
                </div>
                <div className="pro-field-group">
                  <label>MRP (₹)</label>
                  <input 
                    type="number" 
                    value={editingProduct.original_price || ''} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, original_price: e.target.value })}
                    className="pro-input" 
                  />
                </div>
                <div className="pro-field-group">
                  <label>Live Stock (Units) *</label>
                  <input 
                    type="number" 
                    value={editingProduct.stock_quantity} 
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: e.target.value })}
                    required 
                    className="pro-input font-bold" 
                  />
                </div>
              </div>

              <div className="pro-field-group" style={{ marginTop: '10px' }}>
                <label>Image URL</label>
                <input 
                  type="url" 
                  value={editingProduct.image} 
                  onChange={(e) => setEditingProduct({ ...editingProduct, image: e.target.value })}
                  className="pro-input font-mono" 
                />
              </div>

              <div className="pro-field-group" style={{ marginTop: '10px' }}>
                <label>Description</label>
                <textarea 
                  rows={2}
                  value={editingProduct.description || ''} 
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="pro-input" 
                />
              </div>

              <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button 
                  type="button" 
                  className="pro-secondary-btn"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="pro-primary-btn gold"
                >
                  <span>{isSubmitting ? 'Updating...' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL 3: REJECT ORDER (Phase 6) ==================== */}
      {rejectingOrderId && (
        <div className="pro-modal-overlay" onClick={() => setRejectingOrderId(null)}>
          <div className="pro-modal-card sm" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={18} color="#DC2626" />
                <h3 className="pro-modal-title">Decline Order #{rejectingOrderId}</h3>
              </div>
              <button className="pro-modal-close-btn" onClick={() => setRejectingOrderId(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="pro-modal-body">
              <p style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '12px' }}>
                Declining this order will automatically notify the customer and trigger an instant 100% refund to their original payment method.
              </p>

              <div className="pro-field-group">
                <label>Reason for Cancellation *</label>
                <select 
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="pro-input"
                >
                  <option value="Out of requested size / stock">Out of requested size / stock</option>
                  <option value="Fabric damaged or quality check failed">Fabric damaged or quality check failed</option>
                  <option value="Store closing early / inventory recount">Store closing early / inventory recount</option>
                  <option value="Address outside 10-min delivery perimeter">Address outside 10-min delivery perimeter</option>
                </select>
              </div>

              <div style={{ marginTop: '18px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button className="pro-secondary-btn" onClick={() => setRejectingOrderId(null)}>
                  Keep Order
                </button>
                <button className="pro-primary-btn red" onClick={handleConfirmRejectOrder}>
                  Confirm & Refund Customer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
