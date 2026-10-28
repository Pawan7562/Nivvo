import React, { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { 
  Crosshair, Compass, MapPin, Navigation, 
  Maximize2, Minimize2, CornerUpRight, CornerUpLeft, 
  ArrowUp, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { useNivvo } from '../context/NivvoAppContext';
import { playClickSound } from '../utils/audioEffects';

// Spherical Haversine formula for distance calculation in kilometers
function calculateHaversineDistance([lat1, lon1], [lat2, lon2]) {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return +(R * c).toFixed(2);
}

// Crisp Lucide SVG icons for Leaflet custom HTML DivIcons (Zero emojis)
const storeSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/></svg>`;
const doorstepSvg = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>`;
const bikeSvg = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/></svg>`;

export default function LiveGpsMapTracker({ 
  mode = 'customer', // 'customer' | 'rider'
  address = 'Maple Court, A-302, 12th Main Road, Indiranagar',
  darkStoreName,
  storeName = 'Sole Street Originals',
  storeAddress = '100ft Road, Indiranagar',
  customerName = 'Aarav Shah',
  riderName = 'Ravi Kumar',
  riderVehicle = 'Ather 450X',
  activeStep = 2, // 0: accepted, 1: at shop, 2: on the way, 3: at doorstep, 4: delivered
  onRiderArrived,
  isNavigating = false,
  onToggleNavigation,
  height = '230px'
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const riderMarkerRef = useRef(null);
  const routeLineRef = useRef(null);

  // App context sync
  const nivvoContext = useNivvo();
  const setLiveLocationTracking = nivvoContext?.setLiveLocationTracking;
  const liveLocationTracking = nivvoContext?.liveLocationTracking;

  const [liveDistanceKm, setLiveDistanceKm] = useState(liveLocationTracking?.distanceKm ?? 1.15);
  const [speedKmh, setSpeedKmh] = useState(liveLocationTracking?.speedKmph ?? 24);
  const [etaMinutes, setEtaMinutes] = useState(liveLocationTracking?.etaMinutes ?? 7);
  const [currentWaypointIdx, setCurrentWaypointIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const displayStoreName = darkStoreName || storeName || 'Sole Street Originals';
  const isPickupLeg = activeStep === 0 || activeStep === 1;

  // Real-world coordinates based on Indiranagar Bengaluru corridor
  const getDefaultCoordinates = (addr) => {
    const text = (addr || '').toLowerCase();
    if (text.includes('delhi') || text.includes('connaught') || text.includes('ncr')) {
      return { 
        user: [28.6315, 77.2167], 
        store: [28.6402, 77.2270],
        riderStart: [28.6360, 77.2210] 
      };
    }
    if (text.includes('mumbai') || text.includes('bandra')) {
      return { 
        user: [19.0596, 72.8295], 
        store: [19.0680, 72.8390],
        riderStart: [19.0640, 72.8340] 
      };
    }
    // Indiranagar, Bengaluru default corridor
    return { 
      user: [12.9784, 77.6408], // Maple Court, 12th Main Road
      store: [12.9716, 77.6412], // Sole Street Originals, 100ft Road
      riderStart: [12.9692, 77.6415] // 100ft Road South
    };
  };

  const [positions, setPositions] = useState(() => getDefaultCoordinates(address));

  // Request browser geolocation if available
  useEffect(() => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userLat = pos.coords.latitude;
          const userLng = pos.coords.longitude;
          const storeLat = userLat - 0.0055;
          const storeLng = userLng + 0.0035;
          const riderLat = storeLat - 0.0030;
          const riderLng = storeLng + 0.0010;

          setPositions({
            user: [userLat, userLng],
            store: [storeLat, storeLng],
            riderStart: [riderLat, riderLng]
          });
        },
        () => {},
        { enableHighAccuracy: false, timeout: 6000, maximumAge: 60000 }
      );
    }
  }, [address]);

  // Turn-by-turn street navigation instructions
  const pickupInstructions = [
    { instruction: 'Head North on 100ft Road towards 10th Cross', distance: '150 m', icon: 'straight' },
    { instruction: 'Continue straight past CMH Road Junction', distance: '120 m', icon: 'straight' },
    { instruction: 'Turn right into Sole Street storefront parking', distance: '50 m', icon: 'right' },
    { instruction: 'Arrived at Sole Street Originals · Show PIN 4812', distance: '0 m', icon: 'arrive' }
  ];

  const dropoffInstructions = [
    { instruction: 'Head North on 100ft Road towards 12th Main', distance: '350 m', icon: 'straight' },
    { instruction: 'In 100m, turn right onto 12th Main Road', distance: '280 m', icon: 'right' },
    { instruction: 'Continue on 12th Main past Maple Park', distance: '160 m', icon: 'straight' },
    { instruction: 'Turn left into Maple Court (Gate 2)', distance: '80 m', icon: 'left' },
    { instruction: 'Arrived at Maple Court · A-302 (Customer Doorstep)', distance: '0 m', icon: 'arrive' }
  ];

  const activeTurnList = isPickupLeg ? pickupInstructions : dropoffInstructions;
  const currentTurn = activeTurnList[Math.min(currentWaypointIdx, activeTurnList.length - 1)] || activeTurnList[0];

  // Generate realistic route waypoints along Indiranagar street grid
  const generateStreetRoute = (start, end) => {
    const [lat1, lng1] = start;
    const [lat2, lng2] = end;
    
    return [
      [lat1, lng1],
      [lat1 + (lat2 - lat1) * 0.20, lng1 + (lng2 - lng1) * 0.08],
      [lat1 + (lat2 - lat1) * 0.40, lng1 + (lng2 - lng1) * 0.35],
      [lat1 + (lat2 - lat1) * 0.60, lng1 + (lng2 - lng1) * 0.65],
      [lat1 + (lat2 - lat1) * 0.80, lng1 + (lng2 - lng1) * 0.85],
      [lat1 + (lat2 - lat1) * 0.92, lng1 + (lng2 - lng1) * 0.95],
      [lat2, lng2]
    ];
  };

  // Initialize and manage Leaflet Map lifecycle
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const { user, store, riderStart } = positions;
    const routeStart = isPickupLeg ? riderStart : store;
    const routeEnd = isPickupLeg ? store : user;

    const initialCenter = mode === 'rider' ? (isPickupLeg ? store : user) : user;

    const map = L.map(mapContainerRef.current, {
      center: initialCenter,
      zoom: 15,
      zoomControl: false,
      attributionControl: false
    });

    // High performance CartoDB Voyager map tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd'
    }).addTo(map);

    // 1. Store Pickup Marker
    const storeIcon = L.divIcon({
      className: 'leaflet-custom-div-icon',
      html: `
        <div style="
          background: #FFFFFF;
          border: 2px solid #1F4230;
          color: #14281C;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <span style="color:#1F4230">${storeSvg}</span>
          <span>${displayStoreName}</span>
        </div>
      `,
      iconSize: [130, 28],
      iconAnchor: [65, 14]
    });
    L.marker(store, { icon: storeIcon }).addTo(map);

    // 2. Customer Doorstep Marker
    const doorstepIcon = L.divIcon({
      className: 'leaflet-custom-div-icon',
      html: `
        <div style="
          background: #E8F5E9;
          border: 2px solid #15803D;
          color: #14281C;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 8px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 4px;
        ">
          <span style="color:#15803D">${doorstepSvg}</span>
          <span>${mode === 'rider' ? customerName : 'Your Doorstep'}</span>
        </div>
      `,
      iconSize: [120, 28],
      iconAnchor: [60, 14]
    });
    L.marker(user, { icon: doorstepIcon }).addTo(map);

    // 3. Street Polyline Route
    const waypoints = generateStreetRoute(routeStart, routeEnd);
    const polyline = L.polyline(waypoints, {
      color: '#1F4230',
      weight: 5,
      opacity: 0.85,
      dashArray: '6, 6',
      lineCap: 'round'
    }).addTo(map);
    routeLineRef.current = polyline;

    // 4. Delivery Partner Marker
    const riderLabel = mode === 'rider' ? 'You (Rider)' : `${riderName} (${riderVehicle})`;
    const riderIcon = L.divIcon({
      className: 'leaflet-custom-div-icon',
      html: `
        <div style="
          position: relative;
          background: #1F4230;
          border: 2px solid #C6F432;
          color: #FFFFFF;
          font-size: 11px;
          font-weight: 800;
          padding: 3px 8px;
          border-radius: 12px;
          box-shadow: 0 3px 8px rgba(0,0,0,0.25);
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 5px;
        ">
          <span style="color:#C6F432">${bikeSvg}</span>
          <span>${riderLabel}</span>
        </div>
      `,
      iconSize: [130, 28],
      iconAnchor: [65, 14]
    });

    let initialRiderCoord = waypoints[0];
    if (activeStep === 1) initialRiderCoord = store;
    if (activeStep === 3 || activeStep === 4) initialRiderCoord = user;

    const riderMarker = L.marker(initialRiderCoord, { icon: riderIcon }).addTo(map);
    riderMarkerRef.current = riderMarker;

    map.fitBounds(L.latLngBounds([routeStart, routeEnd]), { padding: [30, 30] });
    mapInstanceRef.current = map;

    // Fix container size on mount
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 400);

    // Real-Time GPS Movement Loop
    let wpIdx = (activeStep === 3 || activeStep === 4) ? waypoints.length - 1 : 0;
    
    const moveTimer = setInterval(() => {
      if (activeStep === 1 || activeStep === 3 || activeStep === 4) {
        if (activeStep >= 3) {
          setLiveDistanceKm(0);
          setEtaMinutes(0);
        }
        return;
      }

      wpIdx += 1;
      if (wpIdx >= waypoints.length) {
        wpIdx = waypoints.length - 1;
        setLiveDistanceKm(0);
        setEtaMinutes(0);
        if (onRiderArrived) onRiderArrived();
      }

      setCurrentWaypointIdx(wpIdx);
      const nextCoord = waypoints[wpIdx];
      if (riderMarkerRef.current) {
        riderMarkerRef.current.setLatLng(nextCoord);
      }

      // If in active in-app navigation mode, auto-follow rider
      if (mode === 'rider' && (isNavigating || isExpanded) && mapInstanceRef.current) {
        mapInstanceRef.current.panTo(nextCoord, { animate: true, duration: 0.8 });
      }

      const remainingDist = calculateHaversineDistance(nextCoord, routeEnd);
      const remainingTime = Math.max(1, Math.round((remainingDist / 26) * 60));
      const currSpeed = Math.floor(22 + Math.random() * 6);

      setLiveDistanceKm(remainingDist);
      setEtaMinutes(remainingTime);
      setSpeedKmh(currSpeed);

      if (setLiveLocationTracking) {
        setLiveLocationTracking(prev => ({
          ...prev,
          distanceKm: remainingDist,
          etaMinutes: remainingTime,
          speedKmph: currSpeed,
          riderLat: nextCoord[0],
          riderLng: nextCoord[1]
        }));
      }
    }, 3200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(moveTimer);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [positions, activeStep, mode]);

  // Trigger Leaflet resize whenever expanded state changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => mapInstanceRef.current.invalidateSize(), 200);
    }
  }, [isExpanded, isNavigating, height]);

  // Center on Rider GPS
  const handleCenterRider = () => {
    if (mapInstanceRef.current && riderMarkerRef.current) {
      mapInstanceRef.current.flyTo(riderMarkerRef.current.getLatLng(), 16, { duration: 0.6 });
    }
  };

  // Center on Destination
  const handleCenterDestination = () => {
    if (mapInstanceRef.current) {
      const dest = isPickupLeg ? positions.store : positions.user;
      mapInstanceRef.current.flyTo(dest, 16, { duration: 0.6 });
    }
  };

  // Fit Entire Path
  const handleFitRoute = () => {
    if (mapInstanceRef.current) {
      const start = isPickupLeg ? positions.riderStart : positions.store;
      const end = isPickupLeg ? positions.store : positions.user;
      mapInstanceRef.current.fitBounds(L.latLngBounds([start, end]), { padding: [30, 30] });
    }
  };

  const currentHeight = isExpanded ? '380px' : (isNavigating ? '320px' : height);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: currentHeight,
      borderRadius: '16px',
      overflow: 'hidden',
      border: (mode === 'rider' && (isNavigating || isExpanded)) ? '2px solid #1F4230' : '1.5px solid #E5E7DE',
      boxShadow: (mode === 'rider' && (isNavigating || isExpanded)) 
        ? '0 6px 20px rgba(31,66,48,0.18)' 
        : '0 2px 8px rgba(0, 0, 0, 0.04)',
      backgroundColor: '#F4F5EE',
      transition: 'height 0.25s ease'
    }}>

      {/* ─── Top In-App Turn-By-Turn HUD (Delivery Partner Mode) ─── */}
      {mode === 'rider' && activeStep < 4 && (
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '54px',
          zIndex: 400,
          backgroundColor: '#1F4230',
          color: '#FFFFFF',
          borderRadius: '12px',
          padding: '8px 12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          {/* Direction Turn Icon */}
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            backgroundColor: '#C6F432',
            color: '#14281C',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {currentTurn.icon === 'right' && <CornerUpRight size={17} strokeWidth={2.5} />}
            {currentTurn.icon === 'left' && <CornerUpLeft size={17} strokeWidth={2.5} />}
            {currentTurn.icon === 'straight' && <ArrowUp size={17} strokeWidth={2.5} />}
            {currentTurn.icon === 'arrive' && <MapPin size={17} strokeWidth={2.5} />}
          </div>

          {/* Turn Text & Distance */}
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{
              fontSize: '12px',
              fontWeight: 800,
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentTurn.instruction}
            </div>
            <div style={{ fontSize: '10px', color: '#C6F432', marginTop: '1px', fontWeight: 700 }}>
              {isPickupLeg 
                ? `Store: ${displayStoreName} · PIN ${activeStep === 1 ? '4812 (Show Store)' : '4812'}`
                : `Dropoff: ${customerName} · ${address.slice(0, 24)}...`}
            </div>
          </div>
        </div>
      )}

      {/* Map DOM Container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />

      {/* Floating Action Controls on Right */}
      <div style={{
        position: 'absolute',
        top: mode === 'rider' ? '56px' : '10px',
        right: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
        zIndex: 400
      }}>
        {/* Re-center GPS */}
        <button 
          type="button" 
          onClick={handleCenterRider}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7DE',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1F4230'
          }}
          title={mode === 'rider' ? 'Center My Location' : 'Focus on Delivery Partner'}
        >
          <Crosshair size={15} />
        </button>

        {/* Focus Destination */}
        <button 
          type="button" 
          onClick={handleCenterDestination}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7DE',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1F4230'
          }}
          title="Focus on Destination"
        >
          <MapPin size={15} />
        </button>

        {/* View Full Route */}
        <button 
          type="button" 
          onClick={handleFitRoute}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7DE',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1F4230'
          }}
          title="View Full Route"
        >
          <Compass size={15} />
        </button>

        {/* Expand / Minimize In-App View */}
        {mode === 'rider' && (
          <button 
            type="button" 
            onClick={() => {
              playClickSound();
              setIsExpanded(prev => !prev);
              if (onToggleNavigation) onToggleNavigation();
            }}
            style={{
              backgroundColor: isExpanded ? '#1F4230' : '#FFFFFF',
              color: isExpanded ? '#C6F432' : '#1F4230',
              border: '1px solid #E5E7DE',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isExpanded ? 'Collapse Navigation' : 'Expand In-App Navigation Map'}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        )}
      </div>

      {/* Real-time Telemetry Pill at Bottom */}
      <div style={{
        position: 'absolute',
        bottom: '8px',
        left: '8px',
        right: '8px',
        backgroundColor: 'rgba(20, 40, 28, 0.94)',
        backdropFilter: 'blur(6px)',
        color: '#FFFFFF',
        fontSize: '11px',
        fontWeight: 600,
        padding: '7px 12px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 400,
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ 
            width: '7px', 
            height: '7px', 
            borderRadius: '50%', 
            backgroundColor: '#C6F432',
            boxShadow: '0 0 0 2px rgba(198, 244, 50, 0.3)'
          }} />
          <span>
            {activeStep >= 3 
              ? (mode === 'rider' ? 'Arrived at Customer Doorstep' : 'Arrived at your door') 
              : isPickupLeg
                ? (activeStep === 1 ? 'At store · Ready for pickup' : `Navigating to ${displayStoreName}`)
                : `In-App Navigation · ${speedKmh} km/h`}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#C6F432', fontWeight: 800 }}>
            {activeStep >= 3 ? '0 km' : `${liveDistanceKm} km`}
          </span>
          <span style={{ opacity: 0.6 }}>·</span>
          <span>{activeStep >= 3 ? 'Arrived' : `${etaMinutes} min`}</span>
        </div>
      </div>
    </div>
  );
}
