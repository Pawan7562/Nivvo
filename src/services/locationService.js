// ============================================================================
// NIVVO HYPERLOCAL LOCATION & GEOLOCATION SERVICE
// Handles GPS Detection, Permission Negotiation, Reverse Geocoding,
// Distance Calculation (Haversine), and Real-Time ETA Matrix
// ============================================================================

export const METRO_DELIVERY_HUBS = [
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

// Detect User's Real Device / Browser GPS Position with Automated Resilience
export function detectDeviceCoordinates(options = {}) {
  const {
    enableHighAccuracy = true,
    timeout = 8000,
    maximumAge = 60000
  } = options;

  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      return resolve({
        latitude: 12.9716,
        longitude: 77.6412,
        accuracy: 100,
        isFallback: true,
        fallbackReason: 'Geolocation API not supported'
      });
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
          (secondError) => {
            if (secondError.code === secondError.PERMISSION_DENIED) {
              const err = new Error('Location permission was denied. Please allow location access in your browser or device settings.');
              err.code = secondError.code;
              return reject(err);
            }

            // Tier 3: Seamless Metropolitan Corridor Fallback (Indiranagar Central Hub)
            resolve({
              latitude: 12.9716,
              longitude: 77.6412,
              accuracy: 500,
              isFallback: true,
              fallbackReason: 'GPS hardware timeout, localized to central Indiranagar corridor'
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

// Reverse Geocode (lat, lng) into readable address using backend or OpenStreetMap
export async function reverseGeocodeCoords(latitude, longitude, apiBase = '') {
  const nLat = parseFloat(latitude);
  const nLng = parseFloat(longitude);
  const { hub: closestHub, distance: distToHub } = getClosestMetroHub(nLat, nLng);

  // 1. Try Backend API first if available
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
            state: a.state || 'Karnataka',
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

  // 2. Direct client-side Nominatim lookup with timeout
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
        const state = addr.state || 'Karnataka';
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

  // 3. Fallback to closest metro corridor
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

