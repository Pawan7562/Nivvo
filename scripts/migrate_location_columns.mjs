import { pool } from '../server/db.js';

async function migrate() {
  console.log('⚡ Running location columns migration on Neon PostgreSQL...');
  try {
    // 1. Add latitude and longitude to shop_partners
    await pool.query(`
      ALTER TABLE shop_partners 
      ADD COLUMN IF NOT EXISTS latitude NUMERIC,
      ADD COLUMN IF NOT EXISTS longitude NUMERIC,
      ADD COLUMN IF NOT EXISTS delivery_radius_km NUMERIC DEFAULT 10;
    `);
    console.log('✓ Added latitude, longitude, delivery_radius_km to shop_partners');

    // 2. Add latitude and longitude to addresses
    await pool.query(`
      ALTER TABLE addresses 
      ADD COLUMN IF NOT EXISTS latitude NUMERIC,
      ADD COLUMN IF NOT EXISTS longitude NUMERIC,
      ADD COLUMN IF NOT EXISTS city VARCHAR(100),
      ADD COLUMN IF NOT EXISTS state VARCHAR(100);
    `);
    console.log('✓ Added latitude, longitude, city, state to addresses');

    // 3. Populate default verified shops with real coordinates in Indiranagar/Bengaluru
    const defaultShopsCoords = [
      { id: 'sole-street', name: 'Sole Street', lat: 12.9716, lng: 77.6412, address: '12th Main Road, Indiranagar', pincode: '560038' },
      { id: 'circuit-house', name: 'Circuit House', lat: 12.9730, lng: 77.6398, address: '100ft Road, Indiranagar', pincode: '560038' },
      { id: 'thread-form', name: 'Thread & Form', lat: 12.9785, lng: 77.6380, address: 'CMH Road, Indiranagar', pincode: '560038' },
      { id: 'meenakshi-silks', name: 'Meenakshi Silks & Sarees', lat: 12.9740, lng: 77.6440, address: 'Double Road, Indiranagar', pincode: '560038' },
      { id: 'apex-tech', name: 'Apex Laptops & Mobiles', lat: 12.9722, lng: 77.6405, address: '100ft Road, Indiranagar', pincode: '560038' },
      { id: 'scholar-books', name: 'Scholar Book House', lat: 12.9750, lng: 77.6050, address: 'Church Street, Bengaluru', pincode: '560001' },
      { id: 'tote-atelier', name: 'The Tote Atelier', lat: 12.9705, lng: 77.5980, address: 'Lavelle Road, Bengaluru', pincode: '560001' },
      { id: 'urban-trendz', name: 'Urban Trendz', lat: 12.9340, lng: 77.6250, address: 'Koramangala 4th Block, Bengaluru', pincode: '560034' },
      { id: 'namrata-creations', name: 'Namrata Creations', lat: 12.9250, lng: 77.5930, address: 'Jayanagar 4th Block, Bengaluru', pincode: '560011' },
      { id: 'sprint-athletics', name: 'Sprint Athletics & Gym', lat: 12.9120, lng: 77.6510, address: 'HSR Layout Sector 1, Bengaluru', pincode: '560102' }
    ];

    for (const s of defaultShopsCoords) {
      // Upsert into shop_partners
      const exists = await pool.query('SELECT shop_id FROM shop_partners WHERE shop_id = $1', [s.id]);
      if (exists.rows.length === 0) {
        await pool.query(`
          INSERT INTO shop_partners (
            shop_id, shop_name, owner_name, phone, email, category, address, pincode, city, latitude, longitude,
            is_open, status, rating, total_orders, today_revenue, fulfillment_model, verification_status
          ) VALUES ($1, $2, $3, $4, $5, 'Retail Store', $6, $7, 'Bengaluru', $8, $9, true, 'ACTIVE', 4.8, 120, 24500, 'HYPERLOCAL_DISPATCH', 'VERIFIED')
        `, [
          s.id,
          s.name,
          `${s.name} Manager`,
          `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
          `${s.id}@nivvostore.in`,
          s.address,
          s.pincode,
          s.lat,
          s.lng
        ]);
        console.log(`✓ Inserted shop ${s.name} (${s.id}) with coordinates`);
      } else {
        await pool.query(`
          UPDATE shop_partners 
          SET latitude = $1, longitude = $2, address = $3, pincode = $4, is_open = true, status = 'ACTIVE'
          WHERE shop_id = $5
        `, [s.lat, s.lng, s.address, s.pincode, s.id]);
        console.log(`✓ Updated shop ${s.name} (${s.id}) coordinates`);
      }
    }

    // Also update any existing shops in DB without lat/lng
    await pool.query(`
      UPDATE shop_partners 
      SET latitude = 12.9716, longitude = 77.6412 
      WHERE latitude IS NULL OR longitude IS NULL;
    `);

    console.log('🎉 Location database migration completed successfully!');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
