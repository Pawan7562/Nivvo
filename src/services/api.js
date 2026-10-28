const getApiBase = () => {
  if (import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE.replace(/\/$/, '');
  }
  // If in browser and on standard web host (e.g. Vercel), use relative /api path
  // which will be handled by Vite proxy in dev and vercel.json rewrites in production
  if (typeof window !== 'undefined') {
    // If running directly on a file:// protocol or standalone APK WebView, allow custom config
    if (window.location.protocol === 'file:') {
      return 'https://nivvo-backend.onrender.com/api';
    }
    return '/api';
  }
  return 'http://127.0.0.1:5001/api';
};

const API_BASE = getApiBase();

export async function fetchHealth() {
  try {
    const res = await fetch(`${API_BASE}/health`);
    return await res.json();
  } catch (err) {
    console.warn('Backend offline, using local state:', err);
    return null;
  }
}

// ==================== USER PROFILE ====================
export async function fetchProfile(phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/profile?phone=${encodeURIComponent(phone)}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch profile:', err);
    return null;
  }
}

export async function updateProfile(profileData) {
  try {
    const res = await fetch(`${API_BASE}/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to update profile:', err);
    return null;
  }
}

// ==================== PAYMENT GATEWAY & REFUNDS ====================
export async function processPaymentApi(paymentPayload) {
  try {
    const res = await fetch(`${API_BASE}/payments/process`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentPayload)
    });
    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    console.warn('Payment processing network error:', err);
    return { ok: false, success: false, message: 'Network connection failed' };
  }
}

export async function refundPaymentApi(refundPayload) {
  try {
    const res = await fetch(`${API_BASE}/payments/refund`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(refundPayload)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to trigger refund API:', err);
    return null;
  }
}

// ==================== ORDERS & AFTER-SALES ====================
export async function fetchOrders(phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/orders?phone=${encodeURIComponent(phone)}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch orders:', err);
    return null;
  }
}

export async function createOrder(orderPayload) {
  try {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderPayload)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to create order on server:', err);
    return null;
  }
}

export async function cancelOrderApi(orderId, reason) {
  try {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/cancel`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to cancel order on server:', err);
    return null;
  }
}

export async function returnOrderApi(orderId, reason) {
  try {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/return`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to request return on server:', err);
    return null;
  }
}

export async function exchangeOrderApi(orderId, newSize, reason) {
  try {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/exchange`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newSize, reason })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to request exchange on server:', err);
    return null;
  }
}

// ==================== SAVED ADDRESSES ====================
export async function fetchAddressesApi(phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/addresses?phone=${encodeURIComponent(phone)}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch addresses:', err);
    return null;
  }
}

export async function saveAddressApi(addressData) {
  try {
    const res = await fetch(`${API_BASE}/addresses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to save address:', err);
    return null;
  }
}

export async function deleteAddressApi(id) {
  try {
    const res = await fetch(`${API_BASE}/addresses/${id}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to delete address:', err);
    return null;
  }
}

// ==================== WISHLIST ====================
export async function fetchWishlist(phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/wishlist?phone=${encodeURIComponent(phone)}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch wishlist:', err);
    return null;
  }
}

export async function toggleWishlistApi(productId, phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/wishlist/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ product_id: productId, user_phone: phone })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to toggle wishlist on server:', err);
    return null;
  }
}

// ==================== HELP & SUPPORT CENTER ====================
export async function fetchHelpTickets(phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/help?phone=${encodeURIComponent(phone)}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch help tickets:', err);
    return null;
  }
}

export async function submitHelpTicket(ticketData) {
  try {
    const res = await fetch(`${API_BASE}/help`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ticketData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to submit ticket:', err);
    return null;
  }
}

// ==================== DELIVERY PARTNER (RIDER) APIS ====================
export async function fetchDeliveryPartnerProfile(phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/partners/delivery/profile?phone=${encodeURIComponent(phone)}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch delivery partner profile:', err);
    return { registered: false, partner: null };
  }
}

export async function registerDeliveryPartnerApi(partnerData) {
  try {
    const res = await fetch(`${API_BASE}/partners/delivery/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(partnerData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to register delivery partner:', err);
    return { success: false, error: err.message };
  }
}

export async function toggleDeliveryPartnerOnlineApi(phone, is_online) {
  try {
    const res = await fetch(`${API_BASE}/partners/delivery/toggle-online`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, is_online })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to toggle rider status:', err);
    return null;
  }
}

export async function fetchDeliveryOrdersApi() {
  try {
    const res = await fetch(`${API_BASE}/partners/delivery/orders`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch delivery orders:', err);
    return { orders: [] };
  }
}

export async function updateDeliveryOrderApi(orderId, action, otp, riderPhone) {
  try {
    const res = await fetch(`${API_BASE}/partners/delivery/update-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, action, otp, rider_phone: riderPhone })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to update delivery order:', err);
    return { success: false, error: err.message };
  }
}

export async function withdrawDeliveryPartnerApi(phone, amount, upiId) {
  try {
    const res = await fetch(`${API_BASE}/partners/delivery/withdraw`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, amount, upi_id: upiId })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to withdraw earnings:', err);
    return { success: false, error: err.message };
  }
}

// ==================== SHOP OWNER (MERCHANT) APIS ====================
export async function fetchShopPartnerProfile(phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/profile?phone=${encodeURIComponent(phone)}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch shop profile:', err);
    return { registered: false, shop: null };
  }
}

export async function registerShopPartnerApi(shopData) {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to register shop partner:', err);
    return { success: false, error: err.message };
  }
}

export async function toggleShopOpenApi(phone, is_open) {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/toggle-open`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, is_open })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to toggle shop status:', err);
    return null;
  }
}

export async function fetchShopOrdersApi(shopId = 'SHP-4012') {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/orders?shop_id=${encodeURIComponent(shopId)}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch shop orders:', err);
    return { orders: [] };
  }
}

export async function acceptShopOrderApi(orderId, prepMinutes = 5) {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/accept-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, prep_minutes: prepMinutes })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to accept shop order:', err);
    return { success: false, error: err.message };
  }
}

export async function rejectShopOrderApi(orderId, reason) {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/reject-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId, reason })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to reject shop order:', err);
    return { success: false, error: err.message };
  }
}

export async function dispatchShopOrderApi(orderId) {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/dispatch-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_id: orderId })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to dispatch shop order:', err);
    return { success: false, error: err.message };
  }
}

// ==================== PRODUCT MARKETPLACE & INVENTORY APIS ====================

export async function fetchMarketplaceProductsApi(category = 'all', search = '') {
  try {
    let url = `${API_BASE}/products?category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch marketplace products:', err);
    return { products: [] };
  }
}

export async function fetchShopProductsApi(phone = '+91 9876543210', shopId = '') {
  try {
    let url = `${API_BASE}/partners/shop/products?phone=${encodeURIComponent(phone)}`;
    if (shopId) url += `&shop_id=${encodeURIComponent(shopId)}`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch shop products:', err);
    return { products: [] };
  }
}

export async function createShopProductApi(productData) {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to create shop product:', err);
    return { success: false, error: err.message };
  }
}

export async function updateShopProductApi(productId, productData) {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/products/${productId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to update shop product:', err);
    return { success: false, error: err.message };
  }
}

export async function updateShopProductStockApi(productId, stockQuantity, price, status, phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/products/${productId}/stock`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock_quantity: stockQuantity, price, status, phone })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to update shop product stock:', err);
    return { success: false, error: err.message };
  }
}

export async function deleteShopProductApi(productId, phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/products/${productId}?phone=${encodeURIComponent(phone)}`, {
      method: 'DELETE'
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to delete shop product:', err);
    return { success: false, error: err.message };
  }
}

export async function fetchShopEarningsApi(phone = '+91 9876543210') {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/earnings?phone=${encodeURIComponent(phone)}`);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch shop earnings:', err);
    return null;
  }
}

export async function updateShopProfileApi(shopData) {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(shopData)
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to update shop profile:', err);
    return { success: false, error: err.message };
  }
}

export async function updateShopVerificationApi(phone, verificationStatus, rejectionReason = '') {
  try {
    const res = await fetch(`${API_BASE}/partners/shop/verify-status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, verification_status: verificationStatus, rejection_reason: rejectionReason })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to update shop verification:', err);
    return { success: false, error: err.message };
  }
}

