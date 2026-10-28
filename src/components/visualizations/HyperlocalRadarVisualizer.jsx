import React, { useState, useEffect } from 'react';
import { Compass, MapPin, Store, Bike, Sparkles, Radio, Zap, ArrowRight, Clock } from 'lucide-react';
import { playClickSound } from '../../utils/audioEffects';

export default function HyperlocalRadarVisualizer({
  activeHub = { name: 'Indiranagar', pincode: '560038' },
  onSelectShop
}) {
  const [selectedBeacon, setSelectedBeacon] = useState(null);
  const [courierPosition, setCourierPosition] = useState(0); // 0% to 100% along path

  // Simulated beacon shops situated at relative percentage coordinates around center hub
  const beacons = [
    {
      id: 'sole-street',
      name: 'Sole Street',
      category: 'Footwear & Streetwear',
      distance: '0.6 km',
      eta: '12 min',
      x: 32, // % from left
      y: 28, // % from top
      color: '#C49752',
      tag: '10-Min Trial'
    },
    {
      id: 'pizza-palace',
      name: 'Pizza Palace Originals',
      category: 'Wood-Fired Pizza',
      distance: '0.8 km',
      eta: '20 min',
      x: 74,
      y: 34,
      color: '#D97706',
      tag: 'Hot Oven'
    },
    {
      id: 'fresh-basket',
      name: 'Fresh Basket Organics',
      category: 'Farm Direct Grocery',
      distance: '0.5 km',
      eta: '10 min',
      x: 68,
      y: 72,
      color: '#059669',
      tag: 'Daily Harvest'
    },
    {
      id: 'circuit-house',
      name: 'Circuit House',
      category: 'Audio & Tech Retail',
      distance: '1.1 km',
      eta: '16 min',
      x: 24,
      y: 68,
      color: '#2563EB',
      tag: 'Tech Hub'
    }
  ];

  // Animate courier smoothly along the vector route from beacon 0 (Sole Street) to center doorstep
  useEffect(() => {
    let frameId;
    let start = performance.now();
    const duration = 7000; // 7 seconds loop

    const step = (now) => {
      const elapsed = (now - start) % duration;
      const progress = elapsed / duration;
      setCourierPosition(progress);
      frameId = requestAnimationFrame(step);
    };

    frameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameId);
  }, []);

  // Compute courier (x, y) interpolating from Sole Street (32, 28) to Customer Hub (50, 50)
  const courierX = 32 + (50 - 32) * courierPosition;
  const courierY = 28 + (50 - 28) * courierPosition;

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '380px',
      borderRadius: '20px',
      overflow: 'hidden',
      backgroundColor: '#071610',
      border: '1px solid rgba(196, 151, 82, 0.25)',
      boxShadow: '0 20px 50px rgba(7, 22, 16, 0.35)',
      display: 'flex',
      flexDirection: 'column',
      userSelect: 'none'
    }}>
      {/* ─── RADAR GRID BACKGROUND SVG ─── */}
      <svg
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      >
        <defs>
          {/* Subtle green grid pattern */}
          <pattern id="radar-grid" width="30" height="30" patternUnits="userSpaceOnUse">
            <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(196, 151, 82, 0.05)" strokeWidth="0.8" />
          </pattern>

          {/* Sweeping angular gradient for rotating radar beam */}
          <linearGradient id="scanner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(196, 151, 82, 0.28)" />
            <stop offset="100%" stopColor="rgba(196, 151, 82, 0)" />
          </linearGradient>

          {/* Glowing trajectory line gradient */}
          <linearGradient id="route-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C49752" />
            <stop offset="100%" stopColor="#22C55E" />
          </linearGradient>
        </defs>

        {/* Grid Fill */}
        <rect width="100%" height="100%" fill="url(#radar-grid)" />

        {/* Concentric Radar Distance Rings (3.5 km radius) */}
        <circle cx="50%" cy="50%" r="40" fill="none" stroke="rgba(196, 151, 82, 0.2)" strokeWidth="1" strokeDasharray="3 3" />
        <circle cx="50%" cy="50%" r="85" fill="none" stroke="rgba(196, 151, 82, 0.15)" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="130" fill="none" stroke="rgba(196, 151, 82, 0.12)" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="50%" cy="50%" r="175" fill="none" stroke="rgba(196, 151, 82, 0.08)" strokeWidth="1" />

        {/* Axis Crosshairs */}
        <line x1="50%" y1="0" x2="50%" y2="100%" stroke="rgba(196, 151, 82, 0.12)" strokeWidth="1" strokeDasharray="2 4" />
        <line x1="0" y1="50%" x2="100%" y2="50%" stroke="rgba(196, 151, 82, 0.12)" strokeWidth="1" strokeDasharray="2 4" />

        {/* Dispatch Vector Trajectory (Sole Street to Doorstep) */}
        <line
          x1="32%"
          y1="28%"
          x2="50%"
          y2="50%"
          stroke="url(#route-gradient)"
          strokeWidth="2"
          strokeDasharray="4 4"
        />

        {/* Rotating Radar Scanner Sweep */}
        <g style={{ transformOrigin: '50% 50%', animation: 'nivvo-radar-spin 8s linear infinite' }}>
          <path
            d="M 50% 50% L 100% 50% A 175 175 0 0 1 50% 100% Z"
            fill="url(#scanner-gradient)"
            style={{ transformOrigin: '50% 50%' }}
          />
        </g>
      </svg>

      {/* ─── TOP METADATA HUD ─── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(7, 22, 16, 0.95), rgba(7, 22, 16, 0))'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: '#22C55E',
            boxShadow: '0 0 10px #22C55E',
            animation: 'nivvo-ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
          }} />
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#C49752', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            HYPERLOCAL RADAR · {activeHub.name.toUpperCase()}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>
          <span>Radius: <strong style={{ color: '#FFFFFF' }}>3.5 km</strong></span>
          <span>Lat/Lon: <strong style={{ color: '#FFFFFF' }}>12.978°N, 77.640°E</strong></span>
        </div>
      </div>

      {/* ─── CENTER HUB: CUSTOMER DOORSTEP BEACON ─── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        {/* Pulsing Concentric Wave Rings */}
        <div style={{
          position: 'absolute',
          width: '54px',
          height: '54px',
          borderRadius: '50%',
          border: '1.5px solid #22C55E',
          animation: 'nivvo-pulse-ring 2.4s ease-out infinite'
        }} />
        <div style={{
          position: 'absolute',
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          border: '1.5px solid #22C55E',
          animation: 'nivvo-pulse-ring 2.4s ease-out infinite',
          animationDelay: '0.8s'
        }} />

        {/* Center Node */}
        <div style={{
          width: '26px',
          height: '26px',
          borderRadius: '50%',
          backgroundColor: '#0C291E',
          border: '2px solid #22C55E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#22C55E',
          boxShadow: '0 0 16px rgba(34, 197, 94, 0.6)'
        }}>
          <MapPin size={13} />
        </div>

        {/* Hub Label */}
        <div style={{
          marginTop: '6px',
          backgroundColor: 'rgba(7, 22, 16, 0.9)',
          border: '1px solid rgba(34, 197, 94, 0.4)',
          borderRadius: '4px',
          padding: '2px 7px',
          fontSize: '10px',
          fontWeight: 800,
          color: '#22C55E',
          whiteSpace: 'nowrap'
        }}>
          Your Doorstep · {activeHub.name}
        </div>
      </div>

      {/* ─── ANIMATED COURIER DISPATCH MARKER ─── */}
      <div style={{
        position: 'absolute',
        left: `${courierX}%`,
        top: `${courierY}%`,
        transform: 'translate(-50%, -50%)',
        zIndex: 25,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '6px'
      }}>
        <div style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          backgroundColor: '#C49752',
          border: '2px solid #FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#071610',
          boxShadow: '0 0 14px #C49752'
        }}>
          <Bike size={12} strokeWidth={2.6} />
        </div>
        <div style={{
          backgroundColor: 'rgba(7, 22, 16, 0.85)',
          border: '1px solid #C49752',
          padding: '2px 6px',
          borderRadius: '4px',
          fontSize: '9px',
          fontWeight: 800,
          color: '#C49752',
          whiteSpace: 'nowrap'
        }}>
          Courier En Route · {Math.max(1, Math.round(12 * (1 - courierPosition)))}m
        </div>
      </div>

      {/* ─── REAL LOCAL MERCHANT BEACONS ─── */}
      {beacons.map((beacon) => {
        const isHovered = selectedBeacon?.id === beacon.id;
        return (
          <div
            key={beacon.id}
            onMouseEnter={() => setSelectedBeacon(beacon)}
            onMouseLeave={() => setSelectedBeacon(null)}
            onClick={() => onSelectShop && onSelectShop(beacon)}
            style={{
              position: 'absolute',
              left: `${beacon.x}%`,
              top: `${beacon.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 30,
              cursor: 'pointer'
            }}
          >
            {/* Beacon Pulse Ring */}
            <div style={{
              position: 'absolute',
              inset: '-6px',
              borderRadius: '50%',
              border: `1px solid ${beacon.color}`,
              opacity: 0.6,
              animation: 'nivvo-ping 2.6s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />

            {/* Beacon Icon Node */}
            <div style={{
              width: '22px',
              height: '22px',
              borderRadius: '50%',
              backgroundColor: isHovered ? beacon.color : '#071610',
              border: `1.5px solid ${beacon.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isHovered ? '#071610' : beacon.color,
              transition: 'all 0.15s ease',
              boxShadow: `0 0 12px ${beacon.color}66`
            }}>
              <Store size={11} />
            </div>

            {/* Beacon Label Badge */}
            <div style={{
              position: 'absolute',
              top: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'rgba(7, 22, 16, 0.95)',
              border: `1px solid ${isHovered ? beacon.color : 'rgba(255,255,255,0.15)'}`,
              borderRadius: '5px',
              padding: '3px 8px',
              fontSize: '10px',
              fontWeight: 700,
              color: '#FFFFFF',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
              transition: 'all 0.15s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>{beacon.name}</span>
                <span style={{ color: beacon.color }}>· {beacon.distance}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* ─── BOTTOM HUD TELEMETRY BAR ─── */}
      <div style={{
        marginTop: 'auto',
        position: 'relative',
        zIndex: 10,
        padding: '12px 20px',
        borderTop: '1px solid rgba(196, 151, 82, 0.15)',
        background: 'linear-gradient(to top, rgba(7, 22, 16, 0.95), rgba(7, 22, 16, 0.6))',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: 'rgba(255,255,255,0.75)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Radio size={13} color="#C49752" />
          <span>Active Hyperlocal Dispatches: <strong style={{ color: '#FFFFFF' }}>14 Local Fleet Partners</strong></span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#C49752' }}>
          <Clock size={12} />
          <span>Average Arrival Window: <strong>10–18 Minutes</strong></span>
        </div>
      </div>
    </div>
  );
}
