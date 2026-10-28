async function runAuthTests() {
  console.log('🧪 Starting End-to-End Nivvo Auth & Approval Security Test Suite...\n');
  const baseUrl = 'http://localhost:5001';

  let customerToken = '';
  let sellerToken = '';
  let riderToken = '';
  let adminToken = '';
  let testShopId = '';
  let testRiderId = '';

  const testPhoneCust = '+91 91111 22222';
  const testPhoneSeller = '+91 93333 44444';
  const testPhoneRider = '+91 95555 66666';

  // 1. Send OTP test
  console.log('1️⃣ Testing OTP Dispatch...');
  const otpRes = await fetch(`${baseUrl}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: testPhoneCust, purpose: 'register' })
  });
  const otpData = await otpRes.json();
  console.log('   Send OTP result:', otpData.message, '| Test OTP:', otpData.testOtp);
  if (!otpData.success) throw new Error('OTP send failed');

  // 2. Customer Registration
  console.log('\n2️⃣ Testing Customer Registration...');
  const regCustRes = await fetch(`${baseUrl}/api/auth/customer/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Priya Sharma',
      phone: testPhoneCust,
      email: 'priya.sharma@example.com',
      password: 'CustomerPass2026!',
      otp: otpData.testOtp
    })
  });
  const regCustData = await regCustRes.json();
  console.log('   Customer Register result:', regCustData.message, '| Role:', regCustData.user?.role);
  if (!regCustData.success && !regCustData.error?.includes('already exists')) {
    throw new Error('Customer registration failed');
  }

  // 3. Customer Password Login
  console.log('\n3️⃣ Testing Customer Password Login...');
  const loginCustRes = await fetch(`${baseUrl}/api/auth/customer/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: testPhoneCust,
      password: 'CustomerPass2026!'
    })
  });
  const loginCustData = await loginCustRes.json();
  console.log('   Customer Login result:', loginCustData.message, '| User:', loginCustData.user?.name);
  customerToken = loginCustData.token;

  // 4. Shop Owner Registration (Must default to 'pending')
  console.log('\n4️⃣ Testing Shop Owner Registration (Expecting Pending Verification)...');
  const regSellerRes = await fetch(`${baseUrl}/api/auth/seller/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      owner_name: 'Vikram Sethi',
      shop_name: 'Sethi Artisan Leatherworks',
      phone: testPhoneSeller,
      email: 'vikram.sethi@artisanleather.in',
      password: 'SellerPass2026!',
      category: 'Footwear & Leather',
      address: 'Shop 12, 100ft Road, Indiranagar',
      city: 'Bengaluru',
      pincode: '560038',
      gstin: '29AABCS1429B1Z8',
      pan_number: 'AABCS1429B',
      trade_license: 'TL-BLR-2026-9921',
      documents: {
        gst_certificate: 'gst_cert_sethi.pdf',
        shop_exterior: 'sethi_shopfront.jpg',
        pan_card: 'sethi_pan.pdf'
      }
    })
  });
  const regSellerData = await regSellerRes.json();
  console.log('   Seller Register result:', regSellerData.message);
  console.log('   Verification Status:', regSellerData.verification_status, '| Shop ID:', regSellerData.shop?.shop_id);
  sellerToken = regSellerData.token;
  testShopId = regSellerData.shop?.shop_id;

  if (regSellerData.verification_status !== 'pending') {
    throw new Error(`FAIL: Shop status is ${regSellerData.verification_status}, expected 'pending'`);
  }
  console.log('   ✅ PASS: Shop Owner correctly assigned PENDING verification status!');

  // 5. Test Backend Enforcement: Unapproved shop tries to add a product
  console.log('\n5️⃣ Testing Backend Enforcement: Pending Shop listing a product...');
  const addProdRes = await fetch(`${baseUrl}/api/partners/shop/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sellerToken}`
    },
    body: JSON.stringify({
      phone: testPhoneSeller,
      name: 'Handcrafted Oxford Shoe',
      price: 2499,
      category: 'footwear'
    })
  });
  const addProdData = await addProdRes.json();
  console.log('   Add Product Response Status:', addProdRes.status);
  console.log('   Add Product Message:', addProdData.error);
  if (addProdRes.status !== 403) {
    throw new Error(`FAIL: Expected 403 Forbidden for pending shop, got ${addProdRes.status}`);
  }
  console.log('   ✅ PASS: Backend strictly blocked product listing for unapproved shop (403 Forbidden)!');

  // 6. Delivery Partner Registration (Must default to 'pending')
  console.log('\n6️⃣ Testing Delivery Partner Registration (Expecting Pending Verification)...');
  const regRiderRes = await fetch(`${baseUrl}/api/auth/rider/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Karan Patel',
      phone: testPhoneRider,
      email: 'karan.patel@nivvofleet.in',
      password: 'RiderPass2026!',
      city: 'Bangalore',
      vehicle_type: 'Electric Scooter (EV)',
      vehicle_number: 'KA-04-EV-8821',
      license_number: 'DL-042022001928',
      aadhaar_number: 'XXXX-XXXX-9912',
      emergency_contact: '+91 98888 77777',
      documents: {
        driving_license: 'karan_dl_front.jpg',
        aadhaar_card: 'karan_aadhaar.pdf'
      }
    })
  });
  const regRiderData = await regRiderRes.json();
  console.log('   Rider Register result:', regRiderData.message);
  console.log('   Verification Status:', regRiderData.verification_status, '| Partner ID:', regRiderData.rider?.partner_id);
  riderToken = regRiderData.token;
  testRiderId = regRiderData.rider?.partner_id;

  if (regRiderData.verification_status !== 'pending') {
    throw new Error(`FAIL: Rider status is ${regRiderData.verification_status}, expected 'pending'`);
  }
  console.log('   ✅ PASS: Delivery Partner correctly assigned PENDING verification status!');

  // 7. Test Backend Enforcement: Unapproved rider tries to go online
  console.log('\n7️⃣ Testing Backend Enforcement: Pending Rider going online...');
  const onlineRes = await fetch(`${baseUrl}/api/partners/delivery/toggle-online`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${riderToken}`
    },
    body: JSON.stringify({
      phone: testPhoneRider,
      is_online: true
    })
  });
  const onlineData = await onlineRes.json();
  console.log('   Toggle Online Response Status:', onlineRes.status);
  console.log('   Toggle Online Message:', onlineData.error);
  if (onlineRes.status !== 403) {
    throw new Error(`FAIL: Expected 403 Forbidden for pending rider, got ${onlineRes.status}`);
  }
  console.log('   ✅ PASS: Backend strictly blocked duty/going online for unapproved rider (403 Forbidden)!');

  // 8. Company Admin Login
  console.log('\n8️⃣ Testing Company Administrator Login...');
  const adminLoginRes = await fetch(`${baseUrl}/api/auth/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      identifier: 'admin@nivvo.in',
      password: 'Admin@Nivvo2026!'
    })
  });
  const adminLoginData = await adminLoginRes.json();
  console.log('   Admin Login result:', adminLoginData.message, '| Role:', adminLoginData.user?.role);
  adminToken = adminLoginData.token;
  if (!adminLoginData.success) throw new Error('Admin login failed');

  // 9. Company Admin Approves Shop Application
  console.log('\n9️⃣ Testing Company Admin Approval of Shop Application...');
  const approveShopRes = await fetch(`${baseUrl}/api/admin/verifications/shops/${testShopId}/decision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      decision: 'approved',
      notes: 'GSTIN, PAN and physical trade license verified. Shop approved for live marketplace operations.'
    })
  });
  const approveShopData = await approveShopRes.json();
  console.log('   Admin Decision result:', approveShopData.message);
  console.log('   New Shop Verification Status:', approveShopData.shop?.verification_status);
  if (approveShopData.shop?.verification_status !== 'approved') {
    throw new Error('Shop approval failed');
  }
  console.log('   ✅ PASS: Shop verified and approved by Nivvo Compliance!');

  // 10. Approved Shop Now Successfully Adds Product
  console.log('\n🔟 Testing Approved Shop Adding Product...');
  const addProdAfterApprove = await fetch(`${baseUrl}/api/partners/shop/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${sellerToken}`
    },
    body: JSON.stringify({
      phone: testPhoneSeller,
      name: 'Handcrafted Derby Leather Shoe',
      price: 2499,
      category: 'footwear'
    })
  });
  const addProdAfterApproveData = await addProdAfterApprove.json();
  console.log('   Add Product Response Status:', addProdAfterApprove.status);
  console.log('   Add Product Message:', addProdAfterApproveData.message);
  if (addProdAfterApprove.status !== 201) {
    throw new Error('Approved shop failed to add product');
  }
  console.log('   ✅ PASS: Approved shop successfully published product!');

  // 11. Company Admin Approves Delivery Partner
  console.log('\n1️⃣1️⃣ Testing Company Admin Approval of Delivery Partner...');
  const approveRiderRes = await fetch(`${baseUrl}/api/admin/verifications/riders/${testRiderId}/decision`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminToken}`
    },
    body: JSON.stringify({
      decision: 'approved',
      notes: 'Driving license and Aadhaar verified. EV onboarding completed.'
    })
  });
  const approveRiderData = await approveRiderRes.json();
  console.log('   Admin Decision result:', approveRiderData.message);
  console.log('   New Rider Verification Status:', approveRiderData.rider?.verification_status);
  if (approveRiderData.rider?.verification_status !== 'approved') {
    throw new Error('Rider approval failed');
  }
  console.log('   ✅ PASS: Delivery Partner verified and approved by Nivvo Fleet Dispatch!');

  // 12. Approved Rider Now Successfully Goes Online
  console.log('\n1️⃣2️⃣ Testing Approved Rider Going Online...');
  const onlineAfterApprove = await fetch(`${baseUrl}/api/partners/delivery/toggle-online`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${riderToken}`
    },
    body: JSON.stringify({
      phone: testPhoneRider,
      is_online: true
    })
  });
  const onlineAfterApproveData = await onlineAfterApprove.json();
  console.log('   Toggle Online Response Status:', onlineAfterApprove.status);
  console.log('   Rider Online State:', onlineAfterApproveData.partner?.is_online);
  if (onlineAfterApprove.status !== 200 || !onlineAfterApproveData.partner?.is_online) {
    throw new Error('Approved rider failed to go online');
  }
  console.log('   ✅ PASS: Approved delivery partner is now online and receiving delivery offers!');

  console.log('\n🎉 ALL 12 END-TO-END AUTH & APPROVAL SECURITY TESTS PASSED WITH 100% SUCCESS!');
}

runAuthTests().catch(err => {
  console.error('\n❌ Test failed:', err.message);
  process.exit(1);
});
