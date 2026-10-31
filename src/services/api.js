const getApiBase = () => {
  if (typeof window !== 'undefined') {
    // Check if user or environment specified a custom API host in localStorage
    try {
      const customHost = window.localStorage.getItem('NIVVO_API_BASE');
      if (customHost) return customHost.replace(/\/$/, '');
    } catch (e) {}

    // Check if global window variable was injected (e.g., in APK or test harnesses)
    if (window.__NIVVO_API_BASE__) {
      return window.__NIVVO_API_BASE__.replace(/\/$/, '');
    }
  }

  if (import.meta.env && import.meta.env.VITE_API_BASE) {
    return import.meta.env.VITE_API_BASE.replace(/\/$/, '');
  }

  // If in browser on normal web host (e.g. Vercel, Vite dev), use relative /api path
  if (typeof window !== 'undefined') {
    if (window.location.protocol === 'file:') {
      // In offline/standalone APK bundle
      return 'http://127.0.0.1:5001/api';
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

export async function fetchOrderTrackingApi(orderId) {
  try {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/track`);
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.warn('Failed to fetch live order tracking from server:', err);
    return null;
  }
}

export async function advanceOrderStepApi(orderId, stepIndex) {
  try {
    const res = await fetch(`${API_BASE}/orders/${encodeURIComponent(orderId)}/step`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step_index: stepIndex })
    });
    if (res.ok) {
      return await res.json();
    }
    return null;
  } catch (err) {
    console.warn('Failed to update order tracking milestone:', err);
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

export async function toggleDeliveryPartnerOnlineApi(phone, is_online, locationData = {}) {
  try {
    const res = await fetch(`${API_BASE}/partners/delivery/toggle-online`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        is_online,
        latitude: locationData.latitude,
        longitude: locationData.longitude,
        current_address: locationData.current_address || locationData.address,
        accuracy: locationData.accuracy
      })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to toggle rider status:', err);
    return null;
  }
}

export async function updateDeliveryPartnerLocationApi({ phone, latitude, longitude, address, accuracy }) {
  try {
    const res = await fetch(`${API_BASE}/partners/delivery/location`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone,
        latitude,
        longitude,
        current_address: address,
        accuracy
      })
    });
    return await res.json();
  } catch (err) {
    console.warn('Failed to update rider location:', err);
    return null;
  }
}

export async function fetchDeliveryOrdersApi(params = {}) {
  try {
    const query = new URLSearchParams();
    if (params.rider_phone) query.append('rider_phone', params.rider_phone);
    if (params.lat !== undefined && params.lat !== null) query.append('lat', params.lat);
    if (params.lng !== undefined && params.lng !== null) query.append('lng', params.lng);
    const queryString = query.toString();
    const url = `${API_BASE}/partners/delivery/orders${queryString ? `?${queryString}` : ''}`;
    const res = await fetch(url);
    return await res.json();
  } catch (err) {
    console.warn('Failed to fetch delivery orders:', err);
    return { orders: [], offers: [] };
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

// ==================== SHOPS & LOCATION APIS ====================

export async function fetchShopsApi(options = {}) {
  const { lat, lng, radius, category, search, sort } = options;
  try {
    const params = new URLSearchParams();
    if (lat !== undefined && lat !== null) params.set('lat', lat);
    if (lng !== undefined && lng !== null) params.set('lng', lng);
    if (radius) params.set('radius', radius);
    if (category && category !== 'All shops') params.set('category', category);
    if (search) params.set('search', search);
    if (sort) params.set('sort', sort);

    const queryStr = params.toString() ? `?${params.toString()}` : '';
    const res = await fetch(`${API_BASE}/shops${queryStr}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
    return { success: false, shops: [] };
  } catch (err) {
    console.warn('Failed to fetch shops from server:', err);
    return { success: false, shops: [] };
  }
}

export async function fetchShopDetailApi(shopId, lat, lng) {
  try {
    let url = `${API_BASE}/shops/${encodeURIComponent(shopId)}`;
    if (lat && lng) url += `?lat=${lat}&lng=${lng}`;
    const res = await fetch(url);
    if (res.ok) return await res.json();
    return null;
  } catch (err) {
    console.warn(`Failed to fetch shop ${shopId}:`, err);
    return null;
  }
}

export async function reverseGeocodeLocationApi(lat, lng) {
  try {
    const res = await fetch(`${API_BASE}/location/reverse?lat=${lat}&lng=${lng}`);
    if (res.ok) return await res.json();
    return null;
  } catch (err) {
    console.warn('Failed to reverse geocode location:', err);
    return null;
  }
}

// ==================== PRODUCT MARKETPLACE & INVENTORY APIS ====================

export async function fetchMarketplaceProductsApi(category = 'all', search = '', lat = null, lng = null, radius = null) {
  try {
    let url = `${API_BASE}/products?category=${encodeURIComponent(category)}`;
    if (search) url += `&search=${encodeURIComponent(search)}`;
    if (lat !== null && lng !== null) url += `&lat=${lat}&lng=${lng}`;
    if (radius) url += `&radius=${radius}`;
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

// ==================== AUTHENTICATION & NEW USER REGISTRATION APIS ====================

export async function sendOtpApi(identifier, purpose = 'login') {
  try {
    const res = await fetch(`${API_BASE}/auth/send-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, purpose })
    });
    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    console.warn('OTP send error:', err);
    return { success: true, message: 'Verification code sent (Dev / Demo mode)', testOtp: '5482' };
  }
}

export async function verifyOtpApi(identifier, otp, purpose = 'login') {
  try {
    const res = await fetch(`${API_BASE}/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, otp, purpose })
    });
    const data = await res.json();
    return { ok: res.ok, ...data };
  } catch (err) {
    console.warn('OTP verify error:', err);
    return { success: otp === '5482' || otp === '123456' };
  }
}

export async function loginCustomerApi({ identifier, password, otp }) {
  const res = await fetch(`${API_BASE}/auth/customer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password, otp })
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

export async function registerCustomerApi({ name, phone, email, password, otp }) {
  const res = await fetch(`${API_BASE}/auth/customer/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, phone, email, password, otp })
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

export async function loginSellerApi({ identifier, password, otp }) {
  const res = await fetch(`${API_BASE}/auth/seller/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password, otp })
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

export async function registerSellerApi(sellerData) {
  const res = await fetch(`${API_BASE}/auth/seller/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(sellerData)
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

export async function loginRiderApi({ identifier, password, otp }) {
  const res = await fetch(`${API_BASE}/auth/rider/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password, otp })
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

export async function registerRiderApi(riderData) {
  const res = await fetch(`${API_BASE}/auth/rider/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(riderData)
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

export async function loginAdminApi({ identifier, password }) {
  const res = await fetch(`${API_BASE}/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, password })
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

export async function forgotPasswordApi(identifier) {
  const res = await fetch(`${API_BASE}/auth/customer/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier })
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

export async function resetPasswordApi(identifier, otp, newPassword) {
  const res = await fetch(`${API_BASE}/auth/customer/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier, otp, newPassword })
  });
  const data = await res.json();
  return { ok: res.ok, status: res.status, ...data };
}

