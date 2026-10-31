const http = require('http');

const testCases = [
  { name: 'Landran, Mohali / Chandigarh', lat: 30.6826, lng: 76.6183, item: { name: 'Waxed Canvas Everyday Backpack', shop: 'The Carry Co.', price: 1899 } },
  { name: 'Connaught Place, New Delhi', lat: 28.6315, lng: 77.2167, item: { name: 'Waxed Canvas Everyday Backpack', shop: 'The Carry Co.', price: 1899 } },
  { name: 'Bandra Linking Road, Mumbai', lat: 19.0596, lng: 72.8295, item: { name: 'Everyday Court Sneaker', shop: 'Sole Street', price: 1429 } },
  { name: 'Indiranagar 100ft Road', lat: 12.9716, lng: 77.6412, item: { name: 'Air Court Low Sneaker', shop: 'Sole Street', price: 2499 } },
  { name: 'Koramangala 4th Block', lat: 12.9352, lng: 77.6245, item: { name: 'Graphic Oversized Tee', shop: 'Urban Trendz', price: 999 } },
  { name: 'HSR Layout Sector 1', lat: 12.9121, lng: 77.6446, item: { name: 'Gym Training Tee', shop: 'Sprint Athletics', price: 899 } },
  { name: 'Malleshwaram 8th Cross', lat: 13.0031, lng: 77.5643, item: { name: 'Handcrafted Canvas Tote', shop: 'The Tote Atelier', price: 1299 } }
];

async function runTests() {
  console.log('=== VERIFYING ORDER ROUTING & ACCURATE DISTANCE/ETA ===\n');

  for (const tc of testCases) {
    const payload = JSON.stringify({
      customer_name: 'Test Customer',
      customer_phone: '+919876543210',
      address: `${tc.name}`,
      latitude: tc.lat,
      longitude: tc.lng,
      items: [tc.item],
      grand_total: tc.item.price,
      payment_method: 'UPI'
    });

    const res = await fetch('http://127.0.0.1:5001/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: payload
    });

    const data = await res.json();
    if (data.success && data.order) {
      console.log(`[PASS] ${tc.name.padEnd(30)} -> Routed Shop: "${data.order.shop_name}" (${data.order.shop_id})`);
      console.log(`       Distance: ${data.order.distance_km} km | ETA: ${data.order.eta_minutes} mins`);
      console.log(`       Dark Store: "${data.order.dark_store}"`);
      console.log(`       Selection Reason: ${data.shop?.selection_reason || data.order.selection_reason}\n`);
    } else {
      console.log(`[FAIL] ${tc.name}:`, data);
    }
  }
}

runTests().catch(console.error);

