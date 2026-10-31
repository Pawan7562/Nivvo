// ============================================================================
// NIVVO HYPERLOCAL LOCATION & GEOLOCATION SERVICE
// Handles GPS Detection, Permission Negotiation, Reverse Geocoding,
// Distance Calculation (Haversine), and Real-Time ETA Matrix
// ============================================================================

export const METRO_DELIVERY_HUBS = [
  // ─── Delhi NCR Corridors ───
  {
    id: 'hub-connaught-place',
    tag: 'Connaught Place Hub',
    title: 'Connaught Place',
    area: 'Connaught Place',
    street: 'Radial Road 3, Inner Circle',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110001',
    fullAddress: 'Inner Circle, Connaught Place, New Delhi, Delhi 110001',
    darkStore: 'CP Central Dark Store #02 (0.3 km away)',
    eta: '7–10 mins',
    latitude: 28.6315,
    longitude: 77.2167
  },
  {
    id: 'hub-saket',
    tag: 'Saket Hub',
    title: 'Saket',
    area: 'Saket',
    street: 'Press Enclave Marg, District Centre',
    city: 'New Delhi',
    state: 'Delhi',
    pincode: '110017',
    fullAddress: 'District Centre, Sector 6, Saket, New Delhi 110017',
    darkStore: 'South Delhi Express Hub #06 (0.5 km away)',
    eta: '8–12 mins',
    latitude: 28.5245,
    longitude: 77.2066
  },
  {
    id: 'hub-cyber-city',
    tag: 'Cyber City Hub',
    title: 'Cyber City & DLF Phase 2',
    area: 'DLF Phase 2',
    street: 'DLF Cyber Hub, Sector 24',
    city: 'Gurugram',
    state: 'Haryana',
    pincode: '122002',
    fullAddress: 'DLF Cyber Hub, DLF Phase 2, Gurugram, Haryana 122002',
    darkStore: 'Gurugram Tech Micro-Store #09 (0.4 km away)',
    eta: '7–11 mins',
    latitude: 28.4950,
    longitude: 77.0895
  },
  {
    id: 'hub-noida-sec18',
    tag: 'Sector 18 Hub',
    title: 'Sector 18 & Atta Market',
    area: 'Sector 18',
    street: 'Atta Market Road, Sector 18',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201301',
    fullAddress: 'Sector 18 Commercial Hub, Noida, Uttar Pradesh 201301',
    darkStore: 'Noida Central Hub #11 (0.5 km away)',
    eta: '8–12 mins',
    latitude: 28.5708,
    longitude: 77.3261
  },

  // ─── Mumbai MMR Corridors ───
  {
    id: 'hub-bandra',
    tag: 'Bandra West Hub',
    title: 'Bandra West',
    area: 'Bandra West',
    street: 'Pali Hill, Off Linking Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    fullAddress: 'Pali Hill, Bandra West, Mumbai, Maharashtra 400050',
    darkStore: 'Bandra Fashion Fulfilment Hub #03 (0.4 km away)',
    eta: '7–10 mins',
    latitude: 19.0596,
    longitude: 72.8295
  },
  {
    id: 'hub-bkc',
    tag: 'BKC Hub',
    title: 'Bandra Kurla Complex (BKC)',
    area: 'BKC',
    street: 'G Block, BKC Road',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400051',
    fullAddress: 'G Block, Bandra Kurla Complex, Mumbai, Maharashtra 400051',
    darkStore: 'BKC Express Pod #07 (0.5 km away)',
    eta: '8–11 mins',
    latitude: 19.0688,
    longitude: 72.8687
  },
  {
    id: 'hub-lower-parel',
    tag: 'Lower Parel Hub',
    title: 'Lower Parel & Worli',
    area: 'Lower Parel',
    street: 'Senapati Bapat Marg',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400013',
    fullAddress: 'Senapati Bapat Marg, Lower Parel, Mumbai, Maharashtra 400013',
    darkStore: 'High Street Phoenix Dark Store #04 (0.4 km away)',
    eta: '7–10 mins',
    latitude: 18.9986,
    longitude: 72.8311
  },
  {
    id: 'hub-andheri',
    tag: 'Andheri West Hub',
    title: 'Andheri West & Lokhandwala',
    area: 'Lokhandwala',
    street: 'Lokhandwala Complex, Andheri West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400053',
    fullAddress: 'Lokhandwala Complex, Andheri West, Mumbai 400053',
    darkStore: 'Andheri Hyper Hub #15 (0.6 km away)',
    eta: '8–12 mins',
    latitude: 19.1363,
    longitude: 72.8277
  },

  // ─── Bengaluru Corridors ───
  {
    id: 'hub-indiranagar',
    tag: 'Indiranagar Hub',
    title: 'Indiranagar',
    area: 'Indiranagar',
    street: '100 Feet Road, Near Metro Pillar #82',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560038',
    fullAddress: '100 Feet Road, Indiranagar, Bengaluru, Karnataka 560038',
    darkStore: 'Indiranagar Micro-Hub #14 (0.4 km away)',
    eta: '7–10 mins',
    latitude: 12.9716,
    longitude: 77.6412
  },
  {
    id: 'hub-koramangala',
    tag: 'Koramangala Hub',
    title: 'Koramangala',
    area: 'Koramangala',
    street: '80 Feet Road, 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560034',
    fullAddress: '80 Feet Road, 4th Block, Koramangala, Bengaluru, Karnataka 560034',
    darkStore: 'Koramangala Central Hub #08 (0.5 km away)',
    eta: '8–12 mins',
    latitude: 12.9340,
    longitude: 77.6250
  },
  {
    id: 'hub-hsr',
    tag: 'HSR Layout Hub',
    title: 'HSR Layout',
    area: 'HSR Layout',
    street: '27th Main, Sector 1',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560102',
    fullAddress: '27th Main Road, Sector 1, HSR Layout, Bengaluru, Karnataka 560102',
    darkStore: 'HSR Sector-1 Dark Store #22 (0.6 km away)',
    eta: '8–12 mins',
    latitude: 12.9120,
    longitude: 77.6510
  },
  {
    id: 'hub-whitefield',
    tag: 'Whitefield Hub',
    title: 'Whitefield',
    area: 'Whitefield',
    street: 'ITPL Main Road, Prestige Shantiniketan',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560066',
    fullAddress: 'ITPL Main Road, Whitefield, Bengaluru, Karnataka 560066',
    darkStore: 'Whitefield Tech Corridor Hub #05 (0.7 km away)',
    eta: '10–14 mins',
    latitude: 12.9698,
    longitude: 77.7500
  },
  {
    id: 'hub-jayanagar',
    tag: 'Jayanagar Hub',
    title: 'Jayanagar',
    area: 'Jayanagar',
    street: '11th Main, 4th Block',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560011',
    fullAddress: '11th Main Road, 4th Block, Jayanagar, Bengaluru, Karnataka 560011',
    darkStore: 'Jayanagar Heritage Hub #19 (0.5 km away)',
    eta: '8–12 mins',
    latitude: 12.9250,
    longitude: 77.5930
  },
  {
    id: 'hub-church-street',
    tag: 'Church St Hub',
    title: 'Church Street & MG Road',
    area: 'Central Bengaluru',
    street: 'Church Street, Off Brigade Road',
    city: 'Bengaluru',
    state: 'Karnataka',
    pincode: '560001',
    fullAddress: 'Church Street, Shanthala Nagar, Ashok Nagar, Bengaluru 560001',
    darkStore: 'CBD Metro Dark Store #01 (0.3 km away)',
    eta: '6–9 mins',
    latitude: 12.9750,
    longitude: 77.6050
  },

  // ─── Hyderabad Corridors ───
  {
    id: 'hub-jubilee-hills',
    tag: 'Jubilee Hills Hub',
    title: 'Jubilee Hills & Madhapur',
    area: 'Jubilee Hills',
    street: 'Road No. 36, Jubilee Hills',
    city: 'Hyderabad',
    state: 'Telangana',
    pincode: '500033',
    fullAddress: 'Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
    darkStore: 'Hyderabad Fashion Hub #12 (0.5 km away)',
    eta: '7–11 mins',
    latitude: 17.4326,
    longitude: 78.4071
  },

  // ─── Pune Corridors ───
  {
    id: 'hub-koregaon-park',
    tag: 'Koregaon Park Hub',
    title: 'Koregaon Park',
    area: 'Koregaon Park',
    street: 'North Main Road, Lane 6',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
    fullAddress: 'North Main Road, Koregaon Park, Pune, Maharashtra 411001',
    darkStore: 'KP Quick Pod #18 (0.4 km away)',
    eta: '8–12 mins',
    latitude: 18.5362,
    longitude: 73.8940
  },

  // ─── Chennai Corridors ───
  {
    id: 'hub-t-nagar',
    tag: 'T Nagar Hub',
    title: 'T Nagar & Nungambakkam',
    area: 'T Nagar',
    street: 'Usman Road, T Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    pincode: '600017',
    fullAddress: 'Usman Road, T Nagar, Chennai, Tamil Nadu 600017',
    darkStore: 'Chennai Central Micro-Hub #10 (0.5 km away)',
    eta: '8–12 mins',
    latitude: 13.0418,
    longitude: 80.2341
  },

  // ─── Kolkata Corridors ───
  {
    id: 'hub-park-street',
    tag: 'Park Street Hub',
    title: 'Park Street',
    area: 'Park Street',
    street: 'Park Street, Near Camac Street',
    city: 'Kolkata',
    state: 'West Bengal',
    pincode: '700016',
    fullAddress: 'Park Street, Kolkata, West Bengal 700016',
    darkStore: 'Kolkata Heritage Pod #05 (0.4 km away)',
    eta: '8–12 mins',
    latitude: 22.5510,
    longitude: 88.3530
  }
];

// Spherical Haversine formula converted into actual urban route distance in kilometers
// Accounts for urban street circuity (~1.28x factor) and real-world door-to-door access baseline
export function calculateDistance(lat1, lon1, lat2, lon2) {
  if (lat1 === undefined || lat1 === null || lon1 === undefined || lon1 === null ||
      lat2 === undefined || lat2 === null || lon2 === undefined || lon2 === null) return null;
  const nLat1 = parseFloat(lat1);
  const nLon1 = parseFloat(lon1);
  const nLat2 = parseFloat(lat2);
  const nLon2 = parseFloat(lon2);
  if (isNaN(nLat1) || isNaN(nLon1) || isNaN(nLat2) || isNaN(nLon2)) return null;

  const R = 6371; // Earth's radius in kilometers
  const dLat = (nLat2 - nLat1) * (Math.PI / 180);
  const dLon = (nLon2 - nLon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(nLat1 * (Math.PI / 180)) * Math.cos(nLat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const straightLineKm = R * c;

  // Real-world urban street network circuity factor (~1.28x) + street dispatch baseline
  // Prevents inaccurate "0 km" readings and matches realistic courier GPS routes
  if (straightLineKm < 0.25) {
    return Math.round((0.4 + straightLineKm * 0.4) * 10) / 10;
  }
  return Math.round((straightLineKm * 1.28 + 0.15) * 10) / 10;
}

// Professional distance text formatter
export function formatDistanceText(distanceKm) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) return '1.2 km away';
  const d = Math.max(0.4, Math.round(parseFloat(distanceKm) * 10) / 10);
  return `${d.toFixed(1)} km away`;
}

// Quick commerce delivery ETA calculation in minutes
// Comprises:
// 1. Merchant packing & staging SLA (2.5 mins)
// 2. Courier EV/bike transit speed in city traffic (2.7 mins / km)
// 3. Doorstep try-on / OTP verification SLA (1.5 mins)
export function calculateEtaMinutes(distanceKm) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) return 14;
  const d = Math.max(0.4, parseFloat(distanceKm));
  return Math.max(8, Math.min(60, Math.round(4.0 + d * 2.7)));
}

// Quick commerce delivery ETA text formula
export function calculateEta(distanceKm) {
  if (distanceKm === null || distanceKm === undefined || isNaN(distanceKm)) return '12–16 min';
  const d = Math.max(0.4, parseFloat(distanceKm));
  if (d <= 0.8) return '7–10 min';
  if (d <= 1.6) return '9–13 min';
  if (d <= 2.5) return '12–16 min';
  if (d <= 4.0) return '15–20 min';
  if (d <= 6.0) return '20–26 min';
  if (d <= 8.5) return '26–34 min';
  const minTime = Math.round(4.0 + d * 2.7 - 3);
  const maxTime = Math.round(4.0 + d * 2.7 + 5);
  return `${minTime}–${maxTime} min`;
}

// Query browser geolocation permission status
export async function checkLocationPermission() {
  if (typeof window === 'undefined' || !navigator.permissions || !navigator.permissions.query) {
    return 'unknown';
  }
  try {
    const status = await navigator.permissions.query({ name: 'geolocation' });
    return status.state; // 'granted', 'prompt', 'denied'
  } catch (err) {
    return 'unknown';
  }
}

// Query IP Geolocation for desktop or devices without GPS hardware
export async function detectIpCoordinates() {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 2600);
    const res = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client?localityLanguage=en', {
      signal: controller.signal
    });
    clearTimeout(timer);
    if (res.ok) {
      const d = await res.json();
      if (d && typeof d.latitude === 'number' && typeof d.longitude === 'number' && (d.latitude !== 0 || d.longitude !== 0)) {
        return {
          latitude: d.latitude,
          longitude: d.longitude,
          city: d.city || d.principalSubdivision || 'New Delhi',
          locality: d.locality || d.city || 'Central Metro',
          accuracy: 1000,
          isFallback: true,
          fallbackReason: `IP Geolocation (${d.locality || d.city || 'Metro Hub'})`
        };
      }
    }
  } catch (e) {
    // try fallback
  }

  try {
    const controller2 = new AbortController();
    const timer2 = setTimeout(() => controller2.abort(), 2000);
    const res2 = await fetch('https://ipapi.co/json/', { signal: controller2.signal });
    clearTimeout(timer2);
    if (res2.ok) {
      const d2 = await res2.json();
      if (d2 && d2.latitude && d2.longitude) {
        return {
          latitude: parseFloat(d2.latitude),
          longitude: parseFloat(d2.longitude),
          city: d2.city || 'Delhi',
          locality: d2.region || 'Metro',
          accuracy: 1500,
          isFallback: true,
          fallbackReason: `IP Geolocation (${d2.city || 'Metro'})`
        };
      }
    }
  } catch (e) {
    // fallback to closest corridor
  }
  return null;
}

// Detect User's Real Device / Browser GPS Position with Automated Resilience
export function detectDeviceCoordinates(options = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 8000,
    maximumAge = 60000
  } = options;

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      detectIpCoordinates().then((ipPos) => {
        if (ipPos) return resolve(ipPos);
        return resolve({
          latitude: 28.6315,
          longitude: 77.2167,
          accuracy: 200,
          isFallback: true,
          fallbackReason: 'Geolocation API not supported, default to Connaught Place Central'
        });
      });
      return;
    }

    // Tier 1: Try High-Accuracy GPS
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          timestamp: position.timestamp,
          isFallback: false
        });
      },
      (firstError) => {
        // If permission explicitly denied, reject immediately with clear instruction
        if (firstError.code === firstError.PERMISSION_DENIED) {
          const err = new Error('Location permission was denied. Please allow location access in your browser or device settings.');
          err.code = firstError.code;
          return reject(err);
        }

        // Tier 2: Low-Accuracy (WiFi / Cellular / IP Triangulation) fallback
        navigator.geolocation.getCurrentPosition(
          (pos2) => {
            resolve({
              latitude: pos2.coords.latitude,
              longitude: pos2.coords.longitude,
              accuracy: pos2.coords.accuracy,
              altitude: pos2.coords.altitude,
              timestamp: pos2.timestamp,
              isFallback: false
            });
          },
          async (secondError) => {
            if (secondError.code === secondError.PERMISSION_DENIED) {
              const err = new Error('Location permission was denied. Please allow location access in your browser or device settings.');
              err.code = secondError.code;
              return reject(err);
            }

            // Tier 3: Automated IP-Based Geolocation for Desktop / Laptop devices
            try {
              const ipCoords = await detectIpCoordinates();
              if (ipCoords) {
                return resolve(ipCoords);
              }
            } catch (ipErr) {
              // fallback below
            }

            // Tier 4: Seamless Metropolitan Corridor Fallback (Connaught Place Central Hub)
            resolve({
              latitude: 28.6315,
              longitude: 77.2167,
              accuracy: 500,
              isFallback: true,
              fallbackReason: 'GPS hardware timeout, localized to central Connaught Place corridor'
            });
          },
          {
            enableHighAccuracy: false,
            timeout: 5000,
            maximumAge: 120000
          }
        );
      },
      {
        enableHighAccuracy,
        timeout,
        maximumAge
      }
    );
  });
}

// Find closest hub for fallback
export function getClosestMetroHub(lat, lng) {
  let closest = METRO_DELIVERY_HUBS[0];
  let minDistance = Infinity;

  for (const hub of METRO_DELIVERY_HUBS) {
    const dist = calculateDistance(lat, lng, hub.latitude, hub.longitude);
    if (dist !== null && dist < minDistance) {
      minDistance = dist;
      closest = hub;
    }
  }

  return { hub: closest, distance: minDistance };
}

// Reverse Geocode (lat, lng) into readable address using BigDataCloud, backend, or OpenStreetMap
export async function reverseGeocodeCoords(latitude, longitude, apiBase = '') {
  const nLat = parseFloat(latitude);
  const nLng = parseFloat(longitude);
  const { hub: closestHub, distance: distToHub } = getClosestMetroHub(nLat, nLng);

  // 1. Try BigDataCloud instant reverse geocoder (free, instant <400ms, accurate street/locality)
  try {
    const bdcController = new AbortController();
    const bdcTimer = setTimeout(() => bdcController.abort(), 2200);
    const bdcRes = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${nLat}&longitude=${nLng}&localityLanguage=en`,
      { signal: bdcController.signal }
    );
    clearTimeout(bdcTimer);

    if (bdcRes.ok) {
      const bdcData = await bdcRes.json();
      if (bdcData && (bdcData.locality || bdcData.city || bdcData.principalSubdivision)) {
        const area = bdcData.locality || bdcData.city || closestHub.area;
        const city = bdcData.city || bdcData.principalSubdivision || closestHub.city;
        const state = bdcData.principalSubdivision || closestHub.state || 'Delhi';
        const pincode = bdcData.postcode || closestHub.pincode;
        const street = bdcData.localityInfo?.administrative?.[3]?.name || area;

        return {
          id: `gps-${Date.now()}`,
          tag: 'Current GPS',
          title: area,
          area: area,
          street: street,
          city: city,
          state: state,
          pincode: pincode,
          fullAddress: `${street}, ${area}, ${city} ${pincode ? '- ' + pincode : ''}`,
          darkStore: `${area} Quick Fulfillment Pod (${distToHub < 1 ? '0.4 km' : distToHub.toFixed(1) + ' km'})`,
          eta: calculateEta(distToHub),
          latitude: nLat,
          longitude: nLng,
          isLiveGps: true
        };
      }
    }
  } catch (e) {
    // continue to backend/OSM
  }

  // 2. Try Backend API first if available
  if (apiBase) {
    try {
      const res = await fetch(`${apiBase}/location/reverse?lat=${nLat}&lng=${nLng}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.address) {
          const a = data.address;
          return {
            id: `gps-${Date.now()}`,
            tag: 'Current GPS',
            title: a.title || a.area || closestHub.area,
            area: a.area || closestHub.area,
            street: a.street || closestHub.street,
            city: a.city || closestHub.city,
            state: a.state || closestHub.state,
            pincode: a.pincode || closestHub.pincode,
            fullAddress: a.fullAddress || `${a.street || closestHub.street}, ${a.area || closestHub.area}, ${a.city || closestHub.city}`,
            darkStore: a.nearestDarkStore || closestHub.darkStore,
            eta: a.eta || calculateEta(distToHub),
            latitude: nLat,
            longitude: nLng,
            isLiveGps: true
          };
        }
      }
    } catch (e) {
      // Fall through to client OSM or corridor lookup
    }
  }

  // 3. Direct client-side Nominatim lookup with timeout
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    const osmRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${nLat}&lon=${nLng}&zoom=18&addressdetails=1`,
      {
        headers: { 'User-Agent': 'Nivvo-Hyperlocal-Web/1.0' },
        signal: controller.signal
      }
    );
    clearTimeout(timeoutId);

    if (osmRes.ok) {
      const data = await osmRes.json();
      if (data && data.address) {
        const addr = data.address;
        const street = addr.road || addr.pedestrian || addr.suburb || closestHub.street;
        const area = addr.neighbourhood || addr.suburb || addr.residential || addr.commercial || closestHub.area;
        const city = addr.city || addr.town || addr.county || closestHub.city;
        const state = addr.state || closestHub.state;
        const pincode = addr.postcode || closestHub.pincode;

        return {
          id: `gps-${Date.now()}`,
          tag: 'Current GPS',
          title: area,
          area: area,
          street: street,
          city: city,
          state: state,
          pincode: pincode,
          fullAddress: `${street}, ${area}, ${city} - ${pincode}`,
          darkStore: `${area} Quick Fulfillment Hub (${distToHub < 1 ? '0.5 km' : distToHub.toFixed(1) + ' km'})`,
          eta: calculateEta(distToHub),
          latitude: nLat,
          longitude: nLng,
          isLiveGps: true
        };
      }
    }
  } catch (err) {
    // Graceful corridor fallback
  }

  // 4. Fallback to closest metro corridor
  return {
    id: `gps-${Date.now()}`,
    tag: 'Current GPS',
    title: closestHub.area,
    area: closestHub.area,
    street: closestHub.street,
    city: closestHub.city,
    state: closestHub.state,
    pincode: closestHub.pincode,
    fullAddress: closestHub.fullAddress,
    darkStore: closestHub.darkStore,
    eta: calculateEta(distToHub),
    latitude: nLat,
    longitude: nLng,
    isLiveGps: true
  };
}

