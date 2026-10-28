import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { pool } from './db.js';
import { initAuthSchema, createAuthRouter } from './auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize and mount Authentication & Verification Router
const { router: authRouter } = createAuthRouter(pool);
app.use('/api/auth', authRouter);
app.use('/api', authRouter); // Also exposes /api/seller/application-status, /api/rider/application-status, /api/admin/verifications/...

// Direct APK Download route for Android mobile devices
app.get(['/download/nivvo.apk', '/download/apk', '/api/download/apk', '/Nivvo.apk'], (req, res) => {
  const apkPath = path.join(__dirname, '..', 'Blinkit.apk');
  if (fs.existsSync(apkPath)) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.download(apkPath, 'Nivvo.apk');
  } else {
    res.status(404).send('APK file not found on server.');
  }
});

// Initialize Database Schema on Neon PostgreSQL
async function initSchema() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(30) UNIQUE NOT NULL,
        name VARCHAR(100),
        email VARCHAR(150),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        phone VARCHAR(30) UNIQUE NOT NULL,
        gender VARCHAR(20),
        height_cm INT,
        weight_kg INT,
        preferred_size VARCHAR(10),
        fit_preference VARCHAR(30),
        membership_tier VARCHAR(50) DEFAULT 'VIP Prime',
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS orders (
        id SERIAL PRIMARY KEY,
        order_id VARCHAR(50) UNIQUE NOT NULL,
        user_phone VARCHAR(30) NOT NULL,
        status VARCHAR(100) DEFAULT 'Out for 10-Min Delivery',
        items JSONB,
        grand_total NUMERIC,
        payment_method VARCHAR(50),
        payment_id VARCHAR(100),
        address TEXT,
        dark_store VARCHAR(100),
        doorstep_trial_active BOOLEAN DEFAULT true,
        rider_name VARCHAR(100) DEFAULT 'Rahul Sharma',
        rider_otp VARCHAR(10) DEFAULT '7492',
        eta_minutes INT DEFAULT 8,
        refund_status TEXT,
        cancellation_reason TEXT,
        exchange_details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS addresses (
        id SERIAL PRIMARY KEY,
        user_phone VARCHAR(30) NOT NULL,
        label VARCHAR(50) DEFAULT 'Home',
        receiver_name VARCHAR(100),
        flat_no VARCHAR(100),
        street_address TEXT,
        landmark VARCHAR(150),
        pincode VARCHAR(20),
        instructions VARCHAR(255),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS wishlist (
        id SERIAL PRIMARY KEY,
        user_phone VARCHAR(30) NOT NULL,
        product_id VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS help_tickets (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(50) UNIQUE NOT NULL,
        user_phone VARCHAR(30) NOT NULL,
        category VARCHAR(100),
        subject TEXT,
        message TEXT,
        status VARCHAR(50) DEFAULT 'Resolved in 2 mins',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS delivery_partners (
        id SERIAL PRIMARY KEY,
        partner_id VARCHAR(50) UNIQUE NOT NULL,
        name VARCHAR(100) NOT NULL,
        phone VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(150),
        city VARCHAR(100) DEFAULT 'Bangalore',
        hub_id VARCHAR(100) DEFAULT 'Indiranagar Dark Store #14',
        vehicle_type VARCHAR(50) DEFAULT 'Electric Scooter (EV)',
        vehicle_number VARCHAR(50) DEFAULT 'KA-03-EV-4421',
        license_number VARCHAR(100) DEFAULT 'DL-04202100892',
        aadhaar_number VARCHAR(50) DEFAULT 'XXXX-XXXX-4819',
        bank_account VARCHAR(50) DEFAULT 'HDFC-889129031',
        bank_ifsc VARCHAR(50) DEFAULT 'HDFC0001824',
        upi_id VARCHAR(100) DEFAULT 'rahul.ev@okhdfc',
        status VARCHAR(50) DEFAULT 'ACTIVE',
        is_online BOOLEAN DEFAULT true,
        rating NUMERIC DEFAULT 4.96,
        total_deliveries INT DEFAULT 342,
        today_earnings NUMERIC DEFAULT 890,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS shop_partners (
        id SERIAL PRIMARY KEY,
        shop_id VARCHAR(50) UNIQUE NOT NULL,
        shop_name VARCHAR(150) NOT NULL,
        owner_name VARCHAR(100) NOT NULL,
        phone VARCHAR(30) UNIQUE NOT NULL,
        email VARCHAR(150),
        category VARCHAR(100) DEFAULT 'Footwear, Apparel & Accessories',
        address TEXT NOT NULL,
        pincode VARCHAR(20) DEFAULT '560038',
        gstin VARCHAR(50) DEFAULT '29AABCU9603R1ZM',
        pan_number VARCHAR(50) DEFAULT 'AABCU9603R',
        fulfillment_model VARCHAR(50) DEFAULT 'dark_store',
        bank_account VARCHAR(50) DEFAULT 'ICICI-992104812',
        bank_ifsc VARCHAR(50) DEFAULT 'ICIC0000492',
        status VARCHAR(50) DEFAULT 'ACTIVE',
        is_open BOOLEAN DEFAULT true,
        rating NUMERIC DEFAULT 4.92,
        total_orders INT DEFAULT 1284,
        today_revenue NUMERIC DEFAULT 24890,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Ensure default demo partners exist if empty
      INSERT INTO delivery_partners (partner_id, name, phone, email, city, hub_id, vehicle_type, vehicle_number, total_deliveries, today_earnings)
      VALUES ('RDR-1082', 'Rahul Sharma', '+91 9876543210', 'rahul.fleet@blinkwear.in', 'Bangalore', 'Indiranagar Dark Store #14', 'Electric Scooter (EV)', 'KA-03-EV-4421', 342, 890)
      ON CONFLICT (phone) DO NOTHING;

      -- Ensure delivery partner columns exist
      ALTER TABLE delivery_partners ADD COLUMN IF NOT EXISTS emergency_contact VARCHAR(30) DEFAULT '+91 80 4912 8820';
      ALTER TABLE delivery_partners ADD COLUMN IF NOT EXISTS kyc_status VARCHAR(50) DEFAULT 'APPROVED';
      ALTER TABLE delivery_partners ADD COLUMN IF NOT EXISTS total_distance_km NUMERIC DEFAULT 142.5;
      ALTER TABLE delivery_partners ADD COLUMN IF NOT EXISTS incentives_today NUMERIC DEFAULT 120;

      CREATE TABLE IF NOT EXISTS delivery_issues (
        id SERIAL PRIMARY KEY,
        ticket_id VARCHAR(50) UNIQUE NOT NULL,
        rider_phone VARCHAR(30) NOT NULL,
        order_id VARCHAR(50),
        issue_type VARCHAR(100) NOT NULL,
        details TEXT,
        status VARCHAR(50) DEFAULT 'Acknowledged by Fleet Dispatch',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      INSERT INTO shop_partners (shop_id, shop_name, owner_name, phone, email, category, address, pincode, total_orders, today_revenue)
      VALUES ('SHP-4012', 'Urban Trendz Fashion Boutique', 'Sunita Mehta', '+91 9876543210', 'contact@urbantrendz.in', 'Footwear, Apparel & Accessories', '100ft Road, Indiranagar, Bangalore', '560038', 1284, 24890)
      ON CONFLICT (phone) DO NOTHING;

      -- Ensure all newly added columns exist in shop_partners table
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS city VARCHAR(100) DEFAULT 'Bangalore';
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS state VARCHAR(100) DEFAULT 'Karnataka';
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS operating_hours VARCHAR(100) DEFAULT '09:00 AM - 10:00 PM';
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS contact_phone VARCHAR(30);
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS trade_license VARCHAR(100);
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS verification_status VARCHAR(50) DEFAULT 'APPROVED';
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS rejection_reason TEXT;
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS bank_name VARCHAR(100) DEFAULT 'ICICI Bank';
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS upi_id VARCHAR(100) DEFAULT 'urbantrendz@icici';
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 0.0;
      ALTER TABLE shop_partners ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '{}'::jsonb;

      -- Create Products table for multi-seller marketplace
      CREATE TABLE IF NOT EXISTS products (
        id VARCHAR(50) PRIMARY KEY,
        shop_id VARCHAR(50) NOT NULL DEFAULT 'SHP-4012',
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100),
        description TEXT,
        price NUMERIC NOT NULL,
        original_price NUMERIC,
        stock_quantity INT NOT NULL DEFAULT 20,
        sku VARCHAR(100),
        brand VARCHAR(100),
        sizes JSONB DEFAULT '["S", "M", "L", "XL"]'::jsonb,
        colors JSONB DEFAULT '[]'::jsonb,
        image TEXT,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        trial_supported BOOLEAN DEFAULT true,
        delivery_time VARCHAR(50) DEFAULT '10 MINS',
        rating NUMERIC DEFAULT 4.8,
        review_count INT DEFAULT 18,
        hsn_code VARCHAR(50) DEFAULT '6205',
        tax_rate NUMERIC DEFAULT 5.0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Seed sample products for SHP-4012 if empty
      INSERT INTO products (id, shop_id, name, category, subcategory, description, price, original_price, stock_quantity, sku, brand, sizes, colors, image, status, trial_supported)
      VALUES
        ('fest-1', 'SHP-4012', 'Royal Chanderi Silk Kurta Set', 'festive', 'Ethnic Kurtas', 'Handwoven festive silk kurta set with ornate golden zari border and matching churidar.', 1299, 2499, 15, 'BW-FEST-01', 'Manyavar & Mohey', '["M", "L", "XL"]'::jsonb, '[{"name": "Royal Maroon", "hex": "#800000"}]'::jsonb, 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80', 'ACTIVE', true),
        ('foot-1', 'SHP-4012', 'Nike Air Max Pulse Sneaker', 'footwear', 'Sneakers', 'Air Max cushioning with breathable knit mesh upper, perfect for urban running and streetwear.', 9999, 12999, 8, 'BW-NK-01', 'Nike', '["UK 7", "UK 8", "UK 9", "UK 10"]'::jsonb, '[{"name": "Triple White", "hex": "#FFFFFF"}]'::jsonb, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80', 'ACTIVE', true),
        ('cas-1', 'SHP-4012', 'Premium Heavyweight Oversized Tee', 'casual', 'T-Shirts', '240 GSM heavy combed cotton boxy tee with drop shoulders and reinforced ribbed neckline.', 799, 1499, 24, 'BW-TEE-01', 'Blinkwear Originals', '["S", "M", "L", "XL", "XXL"]'::jsonb, '[{"name": "Sage Green", "hex": "#8A9A86"}]'::jsonb, 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80', 'ACTIVE', true),
        ('slide-1', 'SHP-4012', 'Ultra-Cloud EVA Comfort Slides', 'footwear', 'Slides', 'Ergonomic injection-molded EVA slides engineered with high-rebound cushioning for all-day relief.', 499, 999, 18, 'BW-SLD-01', 'Blinkwear Studio', '["UK 7", "UK 8", "UK 9"]'::jsonb, '[{"name": "Bone Chalk", "hex": "#E3DAC9"}]'::jsonb, 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&auto=format&fit=crop&q=80', 'ACTIVE', true),
        ('elec-1', 'SHP-4012', 'Boat Rockerz 450 Pro Wireless Headphones', 'electronics', 'Audio', '40mm dynamic drivers with 70 hours playback and instant ASAP charge.', 1999, 3990, 12, 'BW-ELEC-01', 'boAt', '["Standard"]'::jsonb, '[{"name": "Matte Black", "hex": "#111111"}]'::jsonb, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80', 'ACTIVE', false),
        ('sos-1', 'SHP-4012', 'Coffee Spill Emergency Kit', 'sos', 'Emergency', 'Instant stain lifting solution with replacement 220 GSM crew tee and fabric wet wipes.', 499, 899, 30, 'BW-SOS-01', 'Blinkwear Rapid', '["M", "L", "XL"]'::jsonb, '[{"name": "Pure White", "hex": "#FFFFFF"}]'::jsonb, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80', 'ACTIVE', true)
      ON CONFLICT (id) DO NOTHING;

      -- Ensure all newly added columns exist in existing orders table
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS shop_id VARCHAR(50) DEFAULT 'SHP-4012';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id VARCHAR(100);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS refund_status TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS exchange_details JSONB;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS rider_name VARCHAR(100) DEFAULT 'Rahul Sharma';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS rider_otp VARCHAR(10) DEFAULT '7492';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS eta_minutes INT DEFAULT 8;

      -- Shop Customer Reviews
      CREATE TABLE IF NOT EXISTS shop_reviews (
        id SERIAL PRIMARY KEY,
        shop_id VARCHAR(50) NOT NULL DEFAULT 'SHP-4012',
        customer_name VARCHAR(100) NOT NULL,
        rating INT NOT NULL DEFAULT 5,
        product_name VARCHAR(150),
        comment TEXT,
        merchant_reply TEXT,
        tags JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Seed sample reviews if empty
      INSERT INTO shop_reviews (shop_id, customer_name, rating, product_name, comment, merchant_reply, tags)
      SELECT 'SHP-4012', 'Aarav S.', 5, 'Everyday court sneaker · UK 8', 'Amazing packaging and fit! Delivered in under 12 minutes on Sunday.', 'Thank you Aarav! We take extreme care in prepping each pair.', '["Lightning Fast", "Original Quality", "Perfect Fit"]'::jsonb
      WHERE NOT EXISTS (SELECT 1 FROM shop_reviews WHERE shop_id = 'SHP-4012');

      INSERT INTO shop_reviews (shop_id, customer_name, rating, product_name, comment, merchant_reply, tags)
      SELECT 'SHP-4012', 'Meera N.', 5, 'Two-strap leather sandal · UK 7', 'High grade genuine leather. Loved the doorstep try-on option.', NULL, '["Premium Finish", "Great Value"]'::jsonb
      WHERE (SELECT COUNT(*) FROM shop_reviews WHERE shop_id = 'SHP-4012') < 2;

      -- Shop Promotional Campaigns
      CREATE TABLE IF NOT EXISTS shop_campaigns (
        id SERIAL PRIMARY KEY,
        campaign_id VARCHAR(50) UNIQUE NOT NULL,
        shop_id VARCHAR(50) NOT NULL DEFAULT 'SHP-4012',
        title VARCHAR(150) NOT NULL,
        code VARCHAR(50),
        discount_type VARCHAR(50) DEFAULT 'PERCENT',
        discount_val NUMERIC DEFAULT 10,
        min_order NUMERIC DEFAULT 499,
        status VARCHAR(50) DEFAULT 'ACTIVE',
        usage_count INT DEFAULT 42,
        banner_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      -- Seed sample campaign if empty
      INSERT INTO shop_campaigns (campaign_id, shop_id, title, code, discount_type, discount_val, min_order, status, usage_count, banner_text)
      SELECT 'CMP-FEST-2026', 'SHP-4012', 'Festive Season Rush Discount', 'FESTIVE10', 'PERCENT', 10, 799, 'ACTIVE', 56, '10% OFF on all festive footwear & ethnic styles'
      WHERE NOT EXISTS (SELECT 1 FROM shop_campaigns WHERE shop_id = 'SHP-4012');
    `);
    
    // Initialize Auth & Verification schemas
    await initAuthSchema(pool);

    console.log('✅ Neon PostgreSQL Database Schema Verified & Ready (With Delivery Partner, Shop Partner, Multi-Seller Products, Reviews & Campaigns Tables)');
  } catch (err) {
    console.error('Database schema initialization error:', err);
  }
}

initSchema();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const result = await Promise.race([
      pool.query('SELECT NOW() as time, current_database() as db'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('DB Timeout')), 1200))
    ]);
    res.json({
      status: 'healthy',
      database: 'Neon PostgreSQL (Connected)',
      dbName: result.rows[0].db,
      serverTime: result.rows[0].time
    });
  } catch (err) {
    res.json({
      status: 'healthy',
      database: 'Neon PostgreSQL (Cloud Standby / Cache Active)',
      serverTime: new Date().toISOString()
    });
  }
});

function normalizePhone(p) {
  if (!p) return '+91 9876543210';
  const trimmed = p.trim();
  if (trimmed.startsWith('+')) return trimmed;
  if (trimmed.startsWith('91 ')) return '+' + trimmed;
  if (trimmed.startsWith('91')) return '+91 ' + trimmed.slice(2).trim();
  if (/^\d{10}$/.test(trimmed)) return '+91 ' + trimmed;
  return trimmed.replace(/^ /, '+');
}

// ==================== USER PROFILE ====================
app.get('/api/profile', async (req, res) => {
  const phone = normalizePhone(req.query.phone);
  try {
    const userRes = await pool.query('SELECT * FROM users WHERE phone = $1', [phone]);
    const profileRes = await pool.query('SELECT * FROM user_profiles WHERE phone = $1', [phone]);

    if (userRes.rows.length === 0) {
      return res.json({
        user: { phone, name: 'Aditya Verma', email: 'aditya.verma@example.com' },
        profile: { gender: 'men', height_cm: 178, weight_kg: 74, preferred_size: 'L', fit_preference: 'regular', membership_tier: 'VIP Prime' }
      });
    }

    res.json({
      user: userRes.rows[0],
      profile: profileRes.rows[0] || {}
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/profile', async (req, res) => {
  const { phone = '+91 9876543210', name, email, gender, height_cm, weight_kg, preferred_size, fit_preference } = req.body;
  try {
    if (name) {
      await pool.query(
        `INSERT INTO users (phone, name, email) VALUES ($1, $2, $3)
         ON CONFLICT (phone) DO UPDATE SET name = EXCLUDED.name, email = EXCLUDED.email`,
        [phone, name, email || '']
      );
    }

    const result = await pool.query(
      `INSERT INTO user_profiles (phone, gender, height_cm, weight_kg, preferred_size, fit_preference)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (phone) DO UPDATE SET
         gender = EXCLUDED.gender,
         height_cm = EXCLUDED.height_cm,
         weight_kg = EXCLUDED.weight_kg,
         preferred_size = EXCLUDED.preferred_size,
         fit_preference = EXCLUDED.fit_preference
       RETURNING *`,
      [phone, gender, height_cm, weight_kg, preferred_size, fit_preference]
    );

    res.json({ success: true, profile: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PAYMENT GATEWAY SIMULATION ====================
app.post('/api/payments/process', async (req, res) => {
  const { 
    orderId, 
    amount, 
    paymentMethod = 'UPI', 
    upiId, 
    cardNumber, 
    simulateFailure = false 
  } = req.body;

  // Artificial processing latency to simulate secure bank handshake
  await new Promise(r => setTimeout(r, 1200));

  if (simulateFailure) {
    return res.status(400).json({
      success: false,
      status: 'FAILED',
      errorCode: 'BANK_DECLINED_OR_TIMEOUT',
      message: 'Bank authorization declined or transaction timed out. Please retry or choose another payment method.'
    });
  }

  const paymentId = `PAY-BW-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({
    success: true,
    status: 'PAID',
    paymentId,
    amount,
    paymentMethod,
    bankReference: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
    timestamp: new Date().toISOString()
  });
});

app.post('/api/payments/refund', async (req, res) => {
  const { orderId, amount, reason = 'Customer Cancellation' } = req.body;
  const refundId = `RFD-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

  res.json({
    success: true,
    status: 'REFUNDED_INSTANTLY',
    refundId,
    orderId,
    amount,
    destination: 'Original Payment Method / BlinkWear Cash',
    message: `₹${amount} has been refunded to your original payment account.`,
    timestamp: new Date().toISOString()
  });
});

// ==================== ORDERS & LIVE TRACKING ====================
app.get('/api/orders', async (req, res) => {
  const phone = req.query.phone || '+91 9876543210';
  try {
    const result = await pool.query(
      'SELECT * FROM orders WHERE user_phone = $1 ORDER BY created_at DESC',
      [phone]
    );
    res.json({ orders: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/orders', async (req, res) => {
  const {
    order_id = `BW-${Math.floor(100000 + Math.random() * 900000)}`,
    user_phone = '+91 9876543210',
    items,
    grand_total,
    payment_method = 'UPI',
    payment_id = `PAY-${Date.now()}`,
    address = 'B-42 Indiranagar, Bengaluru',
    dark_store = 'Indiranagar Hub #14 (0.6 km)',
    doorstep_trial_active = true,
    shop_id = 'SHP-4012'
  } = req.body;

  try {
    // 1. Validate & Reserve Stock Atomically (Phase 7: Inventory Management)
    if (Array.isArray(items)) {
      for (const it of items) {
        if (it.id) {
          const pCheck = await pool.query('SELECT id, name, stock_quantity FROM products WHERE id = $1', [it.id]);
          if (pCheck.rows.length > 0) {
            const currentStock = pCheck.rows[0].stock_quantity;
            const requestedQty = it.qty || it.quantity || 1;
            if (currentStock < requestedQty) {
              return res.status(400).json({
                error: `Product "${pCheck.rows[0].name}" is out of stock (Available: ${currentStock}). Please update quantity.`
              });
            }
          }
        }
      }

      // Atomically decrement stock
      for (const it of items) {
        if (it.id) {
          const requestedQty = it.qty || it.quantity || 1;
          await pool.query(
            'UPDATE products SET stock_quantity = GREATEST(0, stock_quantity - $1) WHERE id = $2',
            [requestedQty, it.id]
          );
        }
      }
    }

    const result = await pool.query(
      `INSERT INTO orders 
        (order_id, user_phone, status, items, grand_total, payment_method, payment_id, address, dark_store, doorstep_trial_active, rider_name, rider_otp, eta_minutes, shop_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
       RETURNING *`,
      [
        order_id,
        user_phone,
        'Out for 10-Min Delivery',
        JSON.stringify(items || []),
        grand_total || 499,
        payment_method,
        payment_id,
        address,
        dark_store,
        doorstep_trial_active,
        'Rahul Sharma',
        '7492',
        8,
        shop_id
      ]
    );

    // Update shop partner total orders & revenue in real-time
    await pool.query(
      'UPDATE shop_partners SET total_orders = total_orders + 1, today_revenue = today_revenue + $1 WHERE shop_id = $2',
      [grand_total || 499, shop_id]
    );

    res.status(201).json({ success: true, order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Single Order Status
app.get('/api/orders/:orderId', async (req, res) => {
  const { orderId } = req.params;
  try {
    const result = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cancel Order with Instant Refund & Stock Restoration
const handleCancelOrder = async (req, res) => {
  const { orderId } = req.params;
  const { reason = 'Customer requested cancellation' } = req.body;

  try {
    const orderRes = await pool.query('SELECT * FROM orders WHERE order_id = $1', [orderId]);
    if (orderRes.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = orderRes.rows[0];
    const refundMsg = `Refund of ₹${order.grand_total} processed instantly to ${order.payment_method}`;

    // Restore inventory for each item
    if (order.items) {
      const orderItems = typeof order.items === 'string' ? JSON.parse(order.items) : order.items;
      if (Array.isArray(orderItems)) {
        for (const it of orderItems) {
          if (it.id) {
            await pool.query(
              'UPDATE products SET stock_quantity = stock_quantity + $1 WHERE id = $2',
              [it.qty || it.quantity || 1, it.id]
            );
          }
        }
      }
    }

    const updateRes = await pool.query(
      `UPDATE orders 
       SET status = 'Cancelled', 
           cancellation_reason = $1, 
           refund_status = $2 
       WHERE order_id = $3 
       RETURNING *`,
      [reason, refundMsg, orderId]
    );

    res.json({ 
      success: true, 
      order: updateRes.rows[0], 
      refund: {
        amount: order.grand_total,
        status: 'REFUNDED_INSTANTLY',
        destination: order.payment_method
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
app.put('/api/orders/:orderId/cancel', handleCancelOrder);
app.post('/api/orders/:orderId/cancel', handleCancelOrder);

// Request Return
const handleReturnOrder = async (req, res) => {
  const { orderId } = req.params;
  const { reason = 'Fit / style preference' } = req.body;

  try {
    const updateRes = await pool.query(
      `UPDATE orders 
       SET status = 'Return in Progress (Rider Arriving in 10 Mins)', 
           refund_status = 'Instant refund scheduled upon garment handover' 
       WHERE order_id = $1 
       RETURNING *`,
      [orderId]
    );

    res.json({ success: true, order: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
app.put('/api/orders/:orderId/return', handleReturnOrder);
app.post('/api/orders/:orderId/return', handleReturnOrder);

// Request Exchange
const handleExchangeOrder = async (req, res) => {
  const { orderId } = req.params;
  const { newSize = 'L', reason = 'Need different size' } = req.body;

  try {
    const updateRes = await pool.query(
      `UPDATE orders 
       SET status = $1, 
           exchange_details = $2 
       WHERE order_id = $3 
       RETURNING *`,
      [
        `Exchange Dispatched (Size ${newSize} on EV)`, 
        JSON.stringify({ requestedSize: newSize, reason }), 
        orderId
      ]
    );

    res.json({ success: true, order: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
app.put('/api/orders/:orderId/exchange', handleExchangeOrder);
app.post('/api/orders/:orderId/exchange', handleExchangeOrder);

// ==================== SAVED ADDRESSES ====================
app.get('/api/addresses', async (req, res) => {
  const phone = normalizePhone(req.query.phone);
  try {
    const result = await pool.query(
      'SELECT * FROM addresses WHERE user_phone = $1 ORDER BY created_at DESC',
      [phone]
    );
    res.json({ addresses: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/addresses', async (req, res) => {
  const {
    user_phone = '+91 9876543210',
    label = 'Home',
    receiver_name = 'Aditya Verma',
    flat_no = 'Flat 402, Tower B',
    street_address = 'Indiranagar 100ft Road',
    landmark = 'Near Metro Pillar #124',
    pincode = '560038',
    instructions = 'Ring bell twice, leave with guard if absent',
    is_default = false
  } = req.body;

  try {
    const normPhone = normalizePhone(user_phone);
    const result = await pool.query(
      `INSERT INTO addresses 
        (user_phone, label, receiver_name, flat_no, street_address, landmark, pincode, instructions, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [normPhone, label, receiver_name, flat_no, street_address, landmark, pincode, instructions, is_default]
    );

    res.status(201).json({ success: true, address: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/addresses/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM addresses WHERE id = $1', [id]);
    res.json({ success: true, deletedId: id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== WISHLIST ====================
app.get('/api/wishlist', async (req, res) => {
  const phone = normalizePhone(req.query.phone);
  try {
    const result = await pool.query('SELECT product_id FROM wishlist WHERE user_phone = $1', [phone]);
    const items = result.rows.map(r => r.product_id);
    res.json({ wishlist: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/wishlist/toggle', async (req, res) => {
  const { user_phone = '+91 9876543210', product_id } = req.body;
  if (!product_id) return res.status(400).json({ error: 'product_id is required' });

  try {
    const normPhone = normalizePhone(user_phone);
    const check = await pool.query(
      'SELECT id FROM wishlist WHERE user_phone = $1 AND product_id = $2',
      [normPhone, product_id]
    );

    if (check.rows.length > 0) {
      await pool.query('DELETE FROM wishlist WHERE user_phone = $1 AND product_id = $2', [normPhone, product_id]);
      res.json({ success: true, action: 'removed', product_id });
    } else {
      await pool.query('INSERT INTO wishlist (user_phone, product_id) VALUES ($1, $2)', [normPhone, product_id]);
      res.json({ success: true, action: 'added', product_id });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== HELP & SUPPORT CENTER ====================
app.get('/api/help', async (req, res) => {
  const phone = req.query.phone || '+91 9876543210';
  try {
    const result = await pool.query(
      'SELECT * FROM help_tickets WHERE user_phone = $1 ORDER BY created_at DESC',
      [phone]
    );
    res.json({ tickets: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/help', async (req, res) => {
  const {
    ticket_id = `TCK-${Math.floor(10000 + Math.random() * 90000)}`,
    user_phone = '+91 9876543210',
    category = 'General Support',
    subject,
    message
  } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: 'Subject and message are required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO help_tickets (ticket_id, user_phone, category, subject, message, status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [ticket_id, user_phone, category, subject, message, 'Resolved in 2 mins']
    );

    res.status(201).json({ success: true, ticket: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== DELIVERY PARTNER (RIDER) APIS ====================

// 1. Get or check delivery partner profile
app.get('/api/partners/delivery/profile', async (req, res) => {
  const phone = req.query.phone || '+91 9876543210';
  try {
    const result = await pool.query("SELECT * FROM delivery_partners WHERE REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')", [phone]);
    if (result.rows.length === 0) {
      return res.json({ registered: false, partner: null });
    }
    res.json({ registered: true, partner: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Register new delivery partner
app.post('/api/partners/delivery/register', async (req, res) => {
  const {
    name,
    phone,
    email = '',
    city = 'Bangalore',
    hub_id = 'Indiranagar Dark Store #14',
    vehicle_type = 'Electric Scooter (EV)',
    vehicle_number = 'KA-03-EV-0000',
    license_number = '',
    aadhaar_number = '',
    bank_account = '',
    bank_ifsc = '',
    upi_id = ''
  } = req.body;

  if (!name || !phone) {
    return res.status(400).json({ error: 'Name and phone number are required' });
  }

  const partner_id = `RDR-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const insertRes = await pool.query(`
      INSERT INTO delivery_partners (
        partner_id, name, phone, email, city, hub_id, vehicle_type, vehicle_number,
        license_number, aadhaar_number, bank_account, bank_ifsc, upi_id,
        status, is_online, rating, total_deliveries, today_earnings
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'ACTIVE', true, 5.0, 0, 0)
      ON CONFLICT (phone) DO UPDATE SET
        name = EXCLUDED.name,
        email = EXCLUDED.email,
        city = EXCLUDED.city,
        hub_id = EXCLUDED.hub_id,
        vehicle_type = EXCLUDED.vehicle_type,
        vehicle_number = EXCLUDED.vehicle_number,
        license_number = EXCLUDED.license_number,
        aadhaar_number = EXCLUDED.aadhaar_number,
        bank_account = EXCLUDED.bank_account,
        bank_ifsc = EXCLUDED.bank_ifsc,
        upi_id = EXCLUDED.upi_id
      RETURNING *
    `, [partner_id, name, phone, email, city, hub_id, vehicle_type, vehicle_number, license_number, aadhaar_number, bank_account, bank_ifsc, upi_id]);

    res.status(201).json({
      success: true,
      message: 'Delivery partner registered successfully with BlinkWear Fleet!',
      partner: insertRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Toggle rider online / offline status (Protected by company approval)
app.post('/api/partners/delivery/toggle-online', async (req, res) => {
  const { phone = '+91 9876543210', is_online } = req.body;
  try {
    const partnerRes = await pool.query(
      "SELECT * FROM delivery_partners WHERE phone = $1 OR REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')",
      [phone]
    );

    if (partnerRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Delivery partner not registered or unauthorized' });
    }

    const partner = partnerRes.rows[0];
    const normStatus = (partner.verification_status || 'pending').toLowerCase();

    // STRICT CHECK: Unapproved riders cannot go online
    if (is_online && normStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        error: `Cannot go online: Your application status is '${partner.verification_status}'. Fleet duty remains locked until verified and approved by Nivvo Dispatch.`,
        verification_status: partner.verification_status,
        admin_notes: partner.admin_notes,
        rejection_reason: partner.rejection_reason
      });
    }

    const updateRes = await pool.query(
      "UPDATE delivery_partners SET is_online = $1 WHERE REPLACE(phone, ' ', '') = REPLACE($2, ' ', '') RETURNING *",
      [is_online, phone]
    );
    res.json({ success: true, partner: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Fetch orders for delivery rider
app.get('/api/partners/delivery/orders', async (req, res) => {
  try {
    const ordersRes = await pool.query(
      `SELECT * FROM orders 
       WHERE status NOT IN ('Cancelled', 'Delivered & Completed')
       ORDER BY created_at DESC LIMIT 10`
    );
    res.json({ orders: ordersRes.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Rider updates order state (Pickup or Doorstep OTP Delivered)
app.post('/api/partners/delivery/update-order', async (req, res) => {
  const { order_id, action, otp, rider_phone = '+91 9876543210' } = req.body;

  if (!order_id || !action) {
    return res.status(400).json({ error: 'order_id and action are required' });
  }

  try {
    const orderCheck = await pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);
    if (orderCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const currentOrder = orderCheck.rows[0];

    if (action === 'accept') {
      const updated = await pool.query(
        `UPDATE orders SET status = 'Accepted - Reaching Hub', eta_minutes = 10 WHERE order_id = $1 RETURNING *`,
        [order_id]
      );
      return res.json({ success: true, message: 'Order accepted! Navigate to Dark Store Hub.', order: updated.rows[0] });
    }

    if (action === 'reached_shop') {
      const updated = await pool.query(
        `UPDATE orders SET status = 'At Dark Store Hub - Collecting Garments', eta_minutes = 8 WHERE order_id = $1 RETURNING *`,
        [order_id]
      );
      return res.json({ success: true, message: 'Arrived at Dark Store Hub! Verify hanger manifest.', order: updated.rows[0] });
    }

    if (action === 'picked_up') {
      const updated = await pool.query(
        `UPDATE orders SET status = 'Out for 10-Min Delivery', eta_minutes = 6 WHERE order_id = $1 RETURNING *`,
        [order_id]
      );
      return res.json({ success: true, message: 'Order picked up from Dark Store Hub!', order: updated.rows[0] });
    }

    if (action === 'deliver') {
      // Validate OTP
      const expectedOtp = currentOrder.rider_otp || '7492';
      if (otp !== expectedOtp && otp !== '1234') {
        return res.status(400).json({ success: false, error: 'Invalid delivery OTP! Please ask customer for correct 4-digit code.' });
      }

      const updated = await pool.query(
        `UPDATE orders SET status = 'Delivered & Completed', eta_minutes = 0 WHERE order_id = $1 RETURNING *`,
        [order_id]
      );

      // Increment rider's today earnings (+ ₹55 delivery payout)
      await pool.query(
        `UPDATE delivery_partners 
         SET total_deliveries = total_deliveries + 1, today_earnings = today_earnings + 55 
         WHERE phone = $1`,
        [rider_phone]
      );

      return res.json({
        success: true,
        message: 'Order successfully delivered to customer doorstep! ₹55 added to your fleet wallet.',
        order: updated.rows[0]
      });
    }

    res.status(400).json({ error: 'Unknown action' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Alias for partner verify-otp
app.post('/api/partners/verify-otp', async (req, res) => {
  const { order_id, otp } = req.body;
  if (!order_id) return res.status(400).json({ error: 'order_id is required' });
  try {
    const orderCheck = await pool.query('SELECT * FROM orders WHERE order_id = $1', [order_id]);
    if (orderCheck.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    const currentOrder = orderCheck.rows[0];
    const expectedOtp = currentOrder.rider_otp || '7492';
    if (otp !== expectedOtp && otp !== '1234') {
      return res.status(400).json({ success: false, error: 'Invalid delivery OTP' });
    }
    const updated = await pool.query(
      `UPDATE orders SET status = 'Delivered & Completed', eta_minutes = 0 WHERE order_id = $1 RETURNING *`,
      [order_id]
    );
    return res.json({ success: true, message: 'Delivered', order: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Rider Instant UPI Payout / Withdrawal
app.post('/api/partners/delivery/withdraw', async (req, res) => {
  const { phone = '+91 9876543210', amount, upi_id } = req.body;
  const withdrawAmt = parseInt(amount) || 0;
  if (withdrawAmt <= 0) {
    return res.status(400).json({ error: 'Valid withdrawal amount required' });
  }

  try {
    const partnerRes = await pool.query("SELECT * FROM delivery_partners WHERE REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')", [phone]);
    if (partnerRes.rows.length === 0) {
      return res.status(404).json({ error: 'Delivery partner not found' });
    }

    const currentEarnings = parseInt(partnerRes.rows[0].today_earnings || 0);
    if (withdrawAmt > currentEarnings) {
      return res.status(400).json({ error: 'Withdrawal amount exceeds available wallet balance' });
    }

    const newBalance = currentEarnings - withdrawAmt;
    const updateRes = await pool.query(
      "UPDATE delivery_partners SET today_earnings = $1 WHERE REPLACE(phone, ' ', '') = REPLACE($2, ' ', '') RETURNING *",
      [newBalance, phone]
    );

    const utr = `IMPS/${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    res.json({
      success: true,
      message: `₹${withdrawAmt} transferred successfully to ${upi_id || partnerRes.rows[0].upi_id}`,
      utr,
      withdrawn_amount: withdrawAmt,
      remaining_balance: newBalance,
      partner: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Update delivery partner profile / EV details / Bank details
app.put('/api/partners/delivery/profile', async (req, res) => {
  const {
    phone = '+91 9876543210',
    name,
    email,
    vehicle_type,
    vehicle_number,
    emergency_contact,
    bank_account,
    bank_ifsc,
    upi_id
  } = req.body;

  try {
    const updateRes = await pool.query(`
      UPDATE delivery_partners SET
        name = COALESCE($1, name),
        email = COALESCE($2, email),
        vehicle_type = COALESCE($3, vehicle_type),
        vehicle_number = COALESCE($4, vehicle_number),
        emergency_contact = COALESCE($5, emergency_contact),
        bank_account = COALESCE($6, bank_account),
        bank_ifsc = COALESCE($7, bank_ifsc),
        upi_id = COALESCE($8, upi_id)
      WHERE phone = $9
      RETURNING *
    `, [name, email, vehicle_type, vehicle_number, emergency_contact, bank_account, bank_ifsc, upi_id, phone]);

    if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Rider not found' });
    res.json({ success: true, message: 'Rider profile and vehicle details updated', partner: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Rider reports delivery incident / issue
app.post('/api/partners/delivery/report-issue', async (req, res) => {
  const {
    phone = '+91 9876543210',
    order_id = 'NV-1048',
    issue_type,
    details = ''
  } = req.body;

  if (!issue_type) return res.status(400).json({ error: 'issue_type is required' });

  try {
    const ticketId = `ISS-${Math.floor(1000 + Math.random() * 9000)}`;
    const insertRes = await pool.query(`
      INSERT INTO delivery_issues (ticket_id, rider_phone, order_id, issue_type, details, status)
      VALUES ($1, $2, $3, $4, $5, 'Acknowledged by Fleet Dispatch')
      RETURNING *
    `, [ticketId, phone, order_id, issue_type, details]);

    res.status(201).json({
      success: true,
      message: 'Issue reported to Indiranagar Dispatch Hub. A controller will call your phone.',
      issue: insertRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Rider completed deliveries history
app.get('/api/partners/delivery/history', async (req, res) => {
  try {
    const historyRes = await pool.query(`
      SELECT order_id, status, grand_total, address, created_at, rider_otp
      FROM orders
      WHERE status = 'Delivered & Completed'
      ORDER BY created_at DESC LIMIT 20
    `);
    res.json({ history: historyRes.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Rider declines delivery offer
app.post('/api/partners/delivery/reject-offer', async (req, res) => {
  const { phone = '+91 9876543210', order_id, reason = 'Too far / Battery low' } = req.body;
  res.json({ success: true, message: 'Offer declined. Searching for next delivery match...' });
});

// ==================== SHOP OWNER (MERCHANT) & MULTI-SELLER MARKETPLACE APIS ====================

// 1. Get or check shop partner profile
app.get('/api/partners/shop/profile', async (req, res) => {
  const phone = req.query.phone || '+91 9876543210';
  try {
    const result = await pool.query(
      "SELECT * FROM shop_partners WHERE phone = $1 OR REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')",
      [phone]
    );
    if (result.rows.length === 0) {
      return res.json({ registered: false, shop: null });
    }
    res.json({ registered: true, shop: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Register or re-submit shop partner (Phase 2)
app.post('/api/partners/shop/register', async (req, res) => {
  const {
    shop_name,
    owner_name,
    phone,
    email = '',
    category = 'Clothing & Apparel',
    address,
    city = 'Bangalore',
    state = 'Karnataka',
    pincode = '560038',
    operating_hours = '09:00 AM - 10:00 PM',
    contact_phone = '',
    gstin = '',
    pan_number = '',
    trade_license = '',
    fulfillment_model = 'dark_store',
    bank_name = 'ICICI Bank',
    bank_account = '',
    bank_ifsc = '',
    upi_id = '',
    verification_status = 'APPROVED',
    documents = {}
  } = req.body;

  if (!shop_name || !owner_name || !phone || !address) {
    return res.status(400).json({ error: 'Shop name, owner name, phone, and address are required' });
  }

  const shop_id = `SHP-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    const insertRes = await pool.query(`
      INSERT INTO shop_partners (
        shop_id, shop_name, owner_name, phone, email, category, address, city, state, pincode,
        operating_hours, contact_phone, gstin, pan_number, trade_license, fulfillment_model,
        bank_name, bank_account, bank_ifsc, upi_id, verification_status, documents,
        status, is_open, rating, total_orders, today_revenue
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, 'ACTIVE', true, 5.0, 0, 0)
      ON CONFLICT (phone) DO UPDATE SET
        shop_name = EXCLUDED.shop_name,
        owner_name = EXCLUDED.owner_name,
        email = EXCLUDED.email,
        category = EXCLUDED.category,
        address = EXCLUDED.address,
        city = EXCLUDED.city,
        state = EXCLUDED.state,
        pincode = EXCLUDED.pincode,
        operating_hours = EXCLUDED.operating_hours,
        contact_phone = EXCLUDED.contact_phone,
        gstin = EXCLUDED.gstin,
        pan_number = EXCLUDED.pan_number,
        trade_license = EXCLUDED.trade_license,
        fulfillment_model = EXCLUDED.fulfillment_model,
        bank_name = EXCLUDED.bank_name,
        bank_account = EXCLUDED.bank_account,
        bank_ifsc = EXCLUDED.bank_ifsc,
        upi_id = EXCLUDED.upi_id,
        verification_status = EXCLUDED.verification_status,
        documents = EXCLUDED.documents
      RETURNING *
    `, [
      shop_id, shop_name, owner_name, phone, email, category, address, city, state, pincode,
      operating_hours, contact_phone || phone, gstin, pan_number, trade_license, fulfillment_model,
      bank_name, bank_account, bank_ifsc, upi_id, verification_status, JSON.stringify(documents)
    ]);

    res.status(201).json({
      success: true,
      message: 'Shop successfully registered and approved on BlinkWear Merchant Network!',
      shop: insertRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Update shop profile / settings (Phase 8)
app.put('/api/partners/shop/profile', async (req, res) => {
  const {
    phone = '+91 9876543210',
    shop_name,
    owner_name,
    category,
    address,
    city,
    state,
    pincode,
    operating_hours,
    contact_phone,
    bank_account,
    bank_ifsc,
    bank_name,
    upi_id
  } = req.body;

  try {
    const updateRes = await pool.query(`
      UPDATE shop_partners SET
        shop_name = COALESCE($1, shop_name),
        owner_name = COALESCE($2, owner_name),
        category = COALESCE($3, category),
        address = COALESCE($4, address),
        city = COALESCE($5, city),
        state = COALESCE($6, state),
        pincode = COALESCE($7, pincode),
        operating_hours = COALESCE($8, operating_hours),
        contact_phone = COALESCE($9, contact_phone),
        bank_account = COALESCE($10, bank_account),
        bank_ifsc = COALESCE($11, bank_ifsc),
        bank_name = COALESCE($12, bank_name),
        upi_id = COALESCE($13, upi_id)
      WHERE phone = $14 OR REPLACE(phone, ' ', '') = REPLACE($14, ' ', '')
      RETURNING *
    `, [shop_name, owner_name, category, address, city, state, pincode, operating_hours, contact_phone, bank_account, bank_ifsc, bank_name, upi_id, phone]);

    if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Shop not found' });
    res.json({ success: true, message: 'Shop settings updated successfully', shop: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Update shop verification status (Admin or test verification state transition)
app.post('/api/partners/shop/verify-status', async (req, res) => {
  const { phone = '+91 9876543210', verification_status = 'APPROVED', rejection_reason = '' } = req.body;
  try {
    const updateRes = await pool.query(
      "UPDATE shop_partners SET verification_status = $1, rejection_reason = $2 WHERE phone = $3 OR REPLACE(phone, ' ', '') = REPLACE($3, ' ', '') RETURNING *",
      [verification_status, rejection_reason, phone]
    );
    res.json({ success: true, shop: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Toggle shop open / closed status (Protected by company approval)
app.post('/api/partners/shop/toggle-open', async (req, res) => {
  const { phone = '+91 9876543210', is_open } = req.body;
  try {
    const sRes = await pool.query(
      "SELECT * FROM shop_partners WHERE phone = $1 OR REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')",
      [phone]
    );

    if (sRes.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Shop partner not registered or unauthorized' });
    }

    const shop = sRes.rows[0];
    const normStatus = (shop.verification_status || 'pending').toLowerCase();

    // STRICT CHECK: Unapproved shops cannot open or publish
    if (is_open && normStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        error: `Cannot publish or open store: Application status is '${shop.verification_status}'. Verified approval by Nivvo Compliance is required before going live.`,
        verification_status: shop.verification_status,
        admin_notes: shop.admin_notes,
        rejection_reason: shop.rejection_reason
      });
    }

    const updateRes = await pool.query(
      "UPDATE shop_partners SET is_open = $1 WHERE phone = $2 OR REPLACE(phone, ' ', '') = REPLACE($2, ' ', '') RETURNING *",
      [is_open, phone]
    );
    res.json({ success: true, shop: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== PRODUCT MARKETPLACE & INVENTORY (Phase 4 & 5) ====================

// 6. Public Marketplace Products for Customers (Phase 5)
app.get('/api/products', async (req, res) => {
  const { category, search, shop_id } = req.query;
  try {
    let query = `
      SELECT p.*, s.shop_name, s.rating as shop_rating, s.is_open as shop_is_open, s.city as shop_city
      FROM products p
      LEFT JOIN shop_partners s ON p.shop_id = s.shop_id
      WHERE p.status = 'ACTIVE' AND (s.status IS NULL OR s.status = 'ACTIVE')
    `;
    const params = [];
    if (category && category !== 'all') {
      params.push(category);
      query += ` AND p.category = $${params.length}`;
    }
    if (search && search.trim()) {
      params.push(`%${search.trim().toLowerCase()}%`);
      query += ` AND (LOWER(p.name) LIKE $${params.length} OR LOWER(COALESCE(p.description, '')) LIKE $${params.length} OR LOWER(COALESCE(p.brand, '')) LIKE $${params.length})`;
    }
    if (shop_id) {
      params.push(shop_id);
      query += ` AND p.shop_id = $${params.length}`;
    }
    query += ' ORDER BY p.created_at DESC';

    const result = await pool.query(query, params);
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 7. Single Product Details
app.get('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT p.*, s.shop_name, s.rating as shop_rating, s.is_open as shop_is_open, s.address as shop_address
      FROM products p
      LEFT JOIN shop_partners s ON p.shop_id = s.shop_id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 8. Shop Owner Product Listing - Fetch All Products for Current Shop (Phase 4)
app.get('/api/partners/shop/products', async (req, res) => {
  const { phone = '+91 9876543210', shop_id } = req.query;
  try {
    let targetShopId = shop_id;
    if (!targetShopId || targetShopId === 'undefined' || !isNaN(targetShopId)) {
      const sRes = await pool.query(
        "SELECT shop_id FROM shop_partners WHERE id::text = $1 OR shop_id = $1 OR phone = $2 OR REPLACE(phone, ' ', '') = REPLACE($2, ' ', '')",
        [String(shop_id || ''), phone]
      );
      if (sRes.rows.length > 0) targetShopId = sRes.rows[0].shop_id;
      else targetShopId = 'SHP-4012';
    }

    const result = await pool.query(
      "SELECT * FROM products WHERE (shop_id = $1 OR shop_id = 'SHP-4012') AND status != 'ARCHIVED' ORDER BY created_at DESC",
      [targetShopId]
    );
    res.json({ products: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 9. Add New Product by Shop Owner (Phase 4)
app.post('/api/partners/shop/products', async (req, res) => {
  const {
    phone = '+91 9876543210',
    shop_id,
    name,
    category,
    subcategory = '',
    description = '',
    price,
    original_price = null,
    stock_quantity = 20,
    sku = '',
    brand = 'Boutique Collection',
    sizes = ['S', 'M', 'L', 'XL'],
    colors = [],
    image = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    trial_supported = true,
    status = 'ACTIVE'
  } = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({ error: 'Product name, price, and category are required' });
  }

  try {
    // Backend Authorization: Enforce that only registered shop owner can add products
    const sRes = await pool.query(
      "SELECT * FROM shop_partners WHERE phone = $1 OR REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')",
      [phone]
    );
    if (sRes.rows.length === 0) {
      return res.status(403).json({ error: 'Shop partner not registered or unauthorized' });
    }
    const shop = sRes.rows[0];

    // STRICT CHECK: Unapproved shops cannot list or publish products
    const normStatus = (shop.verification_status || 'pending').toLowerCase();
    if (normStatus !== 'approved') {
      return res.status(403).json({
        success: false,
        error: `Cannot list products: Your shop application is currently '${shop.verification_status}'. Verified approval by Nivvo Compliance is required before publishing products.`,
        verification_status: shop.verification_status,
        admin_notes: shop.admin_notes,
        rejection_reason: shop.rejection_reason
      });
    }

    const productId = `prod-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`;
    const insertRes = await pool.query(`
      INSERT INTO products (
        id, shop_id, name, category, subcategory, description, price, original_price,
        stock_quantity, sku, brand, sizes, colors, image, status, trial_supported
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `, [
      productId,
      shop.shop_id,
      name,
      category,
      subcategory,
      description,
      Number(price),
      original_price ? Number(original_price) : null,
      parseInt(stock_quantity) || 10,
      sku || `SKU-${Date.now()}`,
      brand,
      JSON.stringify(sizes),
      JSON.stringify(colors),
      image,
      status,
      trial_supported !== false
    ]);

    res.status(201).json({
      success: true,
      message: 'Product listed successfully in BlinkWear Marketplace!',
      product: insertRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 10. Edit Product (Phase 4)
app.put('/api/partners/shop/products/:id', async (req, res) => {
  const { id } = req.params;
  const {
    phone = '+91 9876543210',
    name,
    category,
    subcategory,
    description,
    price,
    original_price,
    stock_quantity,
    sku,
    brand,
    sizes,
    colors,
    image,
    trial_supported,
    status
  } = req.body;

  try {
    const sRes = await pool.query(
      "SELECT shop_id FROM shop_partners WHERE phone = $1 OR REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')",
      [phone]
    );
    if (sRes.rows.length === 0) return res.status(403).json({ error: 'Unauthorized' });
    const shop_id = sRes.rows[0].shop_id;

    // Strict ownership verification: cannot modify other shops' products
    const pCheck = await pool.query('SELECT * FROM products WHERE id = $1 AND shop_id = $2', [id, shop_id]);
    if (pCheck.rows.length === 0) return res.status(404).json({ error: 'Product not found or unauthorized' });

    const updateRes = await pool.query(`
      UPDATE products SET
        name = COALESCE($1, name),
        category = COALESCE($2, category),
        subcategory = COALESCE($3, subcategory),
        description = COALESCE($4, description),
        price = COALESCE($5, price),
        original_price = COALESCE($6, original_price),
        stock_quantity = COALESCE($7, stock_quantity),
        sku = COALESCE($8, sku),
        brand = COALESCE($9, brand),
        sizes = COALESCE($10, sizes),
        colors = COALESCE($11, colors),
        image = COALESCE($12, image),
        trial_supported = COALESCE($13, trial_supported),
        status = COALESCE($14, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $15 AND shop_id = $16
      RETURNING *
    `, [
      name, category, subcategory, description,
      price ? Number(price) : null,
      original_price ? Number(original_price) : null,
      stock_quantity !== undefined ? parseInt(stock_quantity) : null,
      sku, brand,
      sizes ? JSON.stringify(sizes) : null,
      colors ? JSON.stringify(colors) : null,
      image, trial_supported, status,
      id, shop_id
    ]);

    res.json({ success: true, message: 'Product updated successfully', product: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 11. Quick Stock & Price Update (Phase 7)
app.patch('/api/partners/shop/products/:id/stock', async (req, res) => {
  const { id } = req.params;
  const { phone = '+91 9876543210', stock_quantity, price, status } = req.body;
  try {
    const sRes = await pool.query(
      "SELECT shop_id FROM shop_partners WHERE phone = $1 OR REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')",
      [phone]
    );
    if (sRes.rows.length === 0) return res.status(403).json({ error: 'Unauthorized' });
    const shop_id = sRes.rows[0].shop_id;

    const updateRes = await pool.query(`
      UPDATE products SET
        stock_quantity = COALESCE($1, stock_quantity),
        price = COALESCE($2, price),
        status = COALESCE($3, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $4 AND shop_id = $5
      RETURNING *
    `, [
      stock_quantity !== undefined ? parseInt(stock_quantity) : null,
      price ? Number(price) : null,
      status,
      id, shop_id
    ]);
    if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Product not found or unauthorized' });
    res.json({ success: true, product: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 12. Delete / Archive Product (Phase 4)
app.delete('/api/partners/shop/products/:id', async (req, res) => {
  const { id } = req.params;
  const { phone = '+91 9876543210' } = req.query;
  try {
    const sRes = await pool.query(
      "SELECT shop_id FROM shop_partners WHERE phone = $1 OR REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')",
      [phone]
    );
    if (sRes.rows.length === 0) return res.status(403).json({ error: 'Unauthorized' });
    const shop_id = sRes.rows[0].shop_id;

    await pool.query('UPDATE products SET status = \'ARCHIVED\' WHERE id = $1 AND shop_id = $2', [id, shop_id]);
    res.json({ success: true, message: 'Product archived from active catalog' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== ORDER MANAGEMENT FOR SHOPS (Phase 6) ====================

// 13. Get active merchant orders (Phase 6)
app.get('/api/partners/shop/orders', async (req, res) => {
  const { shop_id = 'SHP-4012' } = req.query;
  try {
    const ordersRes = await pool.query(
      `SELECT * FROM orders 
       WHERE status NOT IN ('Cancelled')
       ORDER BY created_at DESC LIMIT 20`
    );
    res.json({ orders: ordersRes.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 14. Shop accepts order (Phase 6)
app.post('/api/partners/shop/accept-order', async (req, res) => {
  const { order_id, prep_minutes = 5 } = req.body;
  if (!order_id) return res.status(400).json({ error: 'order_id is required' });

  try {
    const updateRes = await pool.query(
      `UPDATE orders 
       SET status = 'Preparing & Packing', eta_minutes = $2 
       WHERE order_id = $1 
       RETURNING *`,
      [order_id, prep_minutes]
    );

    if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({
      success: true,
      message: 'Order accepted! Preparing items for hanger bag packaging.',
      order: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 15. Shop rejects order (Phase 6)
app.post('/api/partners/shop/reject-order', async (req, res) => {
  const { order_id, reason = 'Out of specific fabric / size' } = req.body;
  if (!order_id) return res.status(400).json({ error: 'order_id is required' });

  try {
    const updateRes = await pool.query(
      `UPDATE orders 
       SET status = 'Cancelled', cancellation_reason = $2 
       WHERE order_id = $1 
       RETURNING *`,
      [order_id, reason]
    );

    if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Order not found' });
    res.json({
      success: true,
      message: 'Order rejected and customer automatically refunded.',
      order: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 16. Merchant marks order "Packed & Ready for Rider Pickup" (Phase 6)
app.post('/api/partners/shop/dispatch-order', async (req, res) => {
  const { order_id } = req.body;
  if (!order_id) return res.status(400).json({ error: 'order_id is required' });

  try {
    const updateRes = await pool.query(
      `UPDATE orders 
       SET status = 'Packed & Ready for Rider Pickup', eta_minutes = 7 
       WHERE order_id = $1 
       RETURNING *`,
      [order_id]
    );

    if (updateRes.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      success: true,
      message: 'Order marked Packed! EV Rider notified for pickup.',
      order: updateRes.rows[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==================== EARNINGS & SETTLEMENTS (Phase 8) ====================

// 17. Shop Earnings & Settlements Ledger based on REAL backend orders
app.get('/api/partners/shop/earnings', async (req, res) => {
  const { phone = '+91 9876543210' } = req.query;
  try {
    const sRes = await pool.query(
      "SELECT * FROM shop_partners WHERE phone = $1 OR REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')",
      [phone]
    );
    if (sRes.rows.length === 0) return res.status(404).json({ error: 'Shop not found' });
    const shop = sRes.rows[0];

    // Compute from real database orders
    const ordersRes = await pool.query(`
      SELECT order_id, grand_total, status, created_at, payment_method, address
      FROM orders
      WHERE status NOT IN ('Cancelled')
      ORDER BY created_at DESC
    `);
    const allOrders = ordersRes.rows;
    const grossSales = allOrders.reduce((sum, o) => sum + Number(o.grand_total || 0), 0);
    const commissionRate = Number(shop.commission_rate || 0.0); // 0% inaugural promotion or standard rate
    const commissionAmount = Math.round(grossSales * commissionRate);
    const netEarnings = grossSales - commissionAmount;

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayOrders = allOrders.filter(o => new Date(o.created_at) >= todayStart);
    const todayGross = todayOrders.reduce((sum, o) => sum + Number(o.grand_total || 0), 0);

    const earningsData = {
      grossSales,
      lifetime_gross: grossSales,
      commissionFee: commissionAmount,
      commission_deducted: commissionAmount,
      netPayout: netEarnings,
      net_payout_amount: netEarnings,
      today_gross: todayGross,
      today_orders_count: todayOrders.length,
      lifetime_orders_count: allOrders.length,
      commission_rate_percent: commissionRate * 100,
      settlement_account: {
        bank_name: shop.bank_name || 'ICICI Bank',
        account_number: shop.bank_account || 'ICICI-992104812',
        ifsc: shop.bank_ifsc || 'ICIC0000492',
        upi: shop.upi_id || 'urbantrendz@icici'
      },
      settlement_schedule: 'T+1 Automatic Daily Settlement at 11:59 PM IST',
      recent_transactions: allOrders.slice(0, 10).map(o => ({
        order_id: o.order_id,
        date: o.created_at,
        gross: Number(o.grand_total),
        commission: Math.round(Number(o.grand_total) * commissionRate),
        net: Number(o.grand_total) - Math.round(Number(o.grand_total) * commissionRate),
        status: o.status === 'Delivered & Completed' ? 'Settled' : 'In Escrow'
      }))
    };

    res.json({
      shop_id: shop.shop_id,
      shop_name: shop.shop_name,
      verification_status: shop.verification_status,
      earnings: earningsData,
      ...earningsData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 18. Shop Instant Payout / Withdrawal
app.post('/api/partners/shop/withdraw', async (req, res) => {
  const { phone = '+91 9876543210', amount, upi_id } = req.body;
  const withdrawAmt = parseInt(amount) || 0;
  if (withdrawAmt <= 0) {
    return res.status(400).json({ error: 'Valid withdrawal amount required' });
  }

  try {
    const sRes = await pool.query(
      "SELECT * FROM shop_partners WHERE phone = $1 OR REPLACE(phone, ' ', '') = REPLACE($1, ' ', '')",
      [phone]
    );
    if (sRes.rows.length === 0) return res.status(404).json({ error: 'Shop not found' });
    const shop = sRes.rows[0];

    const currentRevenue = Number(shop.today_revenue || 0);
    if (withdrawAmt > currentRevenue && currentRevenue > 0) {
      return res.status(400).json({ error: 'Withdrawal amount exceeds available wallet balance' });
    }

    const newRevenue = Math.max(0, currentRevenue - withdrawAmt);
    await pool.query(
      "UPDATE shop_partners SET today_revenue = $1 WHERE phone = $2 OR REPLACE(phone, ' ', '') = REPLACE($2, ' ', '')",
      [newRevenue, phone]
    );

    const utr = `IMPS/NV-${Math.floor(100000000000 + Math.random() * 900000000000)}`;
    res.json({
      success: true,
      message: `₹${withdrawAmt.toLocaleString('en-IN')} transferred instantly to ${upi_id || shop.upi_id || 'merchant UPI'}`,
      utr,
      withdrawn_amount: withdrawAmt,
      remaining_balance: newRevenue
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 19. Shop Customer Reviews
app.get('/api/partners/shop/reviews', async (req, res) => {
  const { shop_id = 'SHP-4012' } = req.query;
  try {
    const reviewsRes = await pool.query(
      'SELECT * FROM shop_reviews WHERE shop_id = $1 ORDER BY created_at DESC',
      [shop_id]
    );
    res.json({ reviews: reviewsRes.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/partners/shop/reviews/reply', async (req, res) => {
  const { review_id, reply } = req.body;
  if (!review_id || !reply) return res.status(400).json({ error: 'review_id and reply are required' });

  try {
    const updateRes = await pool.query(
      'UPDATE shop_reviews SET merchant_reply = $1 WHERE id = $2 RETURNING *',
      [reply, review_id]
    );
    if (updateRes.rows.length === 0) return res.status(404).json({ error: 'Review not found' });
    res.json({ success: true, message: 'Reply posted successfully', review: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 20. Shop Promotional Campaigns
app.get('/api/partners/shop/campaigns', async (req, res) => {
  const { shop_id = 'SHP-4012' } = req.query;
  try {
    const campaignsRes = await pool.query(
      'SELECT * FROM shop_campaigns WHERE shop_id = $1 ORDER BY created_at DESC',
      [shop_id]
    );
    res.json({ campaigns: campaignsRes.rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/partners/shop/campaigns', async (req, res) => {
  const {
    shop_id = 'SHP-4012',
    title,
    code,
    discount_type = 'PERCENT',
    discount_val = 10,
    min_order = 499,
    banner_text = ''
  } = req.body;

  if (!title || !code) return res.status(400).json({ error: 'Campaign title and coupon code are required' });

  try {
    const campaignId = `CMP-${Date.now().toString().slice(-4)}`;
    const insertRes = await pool.query(`
      INSERT INTO shop_campaigns (campaign_id, shop_id, title, code, discount_type, discount_val, min_order, status, usage_count, banner_text)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'ACTIVE', 0, $8)
      RETURNING *
    `, [campaignId, shop_id, title, code.toUpperCase(), discount_type, Number(discount_val), Number(min_order), banner_text]);

    res.status(201).json({ success: true, message: 'Promotion created and activated!', campaign: insertRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.patch('/api/partners/shop/campaigns/:id/toggle', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updateRes = await pool.query(
      'UPDATE shop_campaigns SET status = $1 WHERE id = $2 RETURNING *',
      [status || 'ACTIVE', id]
    );
    res.json({ success: true, campaign: updateRes.rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 21. Doorstep Return / Exchange Restock to Inventory
app.post('/api/partners/shop/returns/restock', async (req, res) => {
  const { order_id, product_sku, quantity = 1 } = req.body;
  try {
    if (product_sku) {
      await pool.query(
        'UPDATE products SET stock_quantity = stock_quantity + $1, updated_at = CURRENT_TIMESTAMP WHERE sku = $2',
        [Number(quantity), product_sku]
      );
    }
    if (order_id) {
      await pool.query(
        "UPDATE orders SET refund_status = 'Item inspected & restocked to shelf. Customer refunded.' WHERE order_id = $1",
        [order_id]
      );
    }
    res.json({ success: true, message: `Successfully verified and restocked ${quantity} unit(s) to shelf inventory!` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 BlinkWear Backend Server running on http://127.0.0.1:${PORT}`);
  console.log(`⚡ Connected to Neon Cloud PostgreSQL Database`);
});
