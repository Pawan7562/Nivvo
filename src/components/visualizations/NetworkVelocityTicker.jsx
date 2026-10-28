import React, { useState, useEffect } from 'react';
import { Radio, Sparkles, MapPin, CheckCircle, Clock } from 'lucide-react';

const VELOCITY_EVENTS = [
  {
    id: 1,
    hub: 'Indiranagar 560038',
    store: 'Sole Street',
    action: 'Dispatched for 10-Min Doorstep Try-On',
    item: 'Everyday Court Sneaker (UK 8 + UK 9)',
    timeAgo: 'Just now',
    category: 'fashion'
  },
  {
    id: 2,
    hub: '100ft Road',
    store: 'Pizza Palace Originals',
    action: 'Cooked fresh from wood-fired oven',
    item: 'Artisan Truffle Mushroom Pizza (14-inch)',
    timeAgo: '2m ago',
    category: 'food'
  },
  {
    id: 3,
    hub: 'Double Road',
    store: 'Fresh Basket Organics',
    action: 'Handpicked from morning farm crate',
    item: 'Ratnagiri Alphonso Mangoes (1 kg)',
    timeAgo: '4m ago',
    category: 'grocery'
  },
  {
    id: 4,
    hub: 'CMH Road',
    store: 'Thread & Form',
    action: 'Handover complete: Customer kept S (returned M)',
    item: 'Heavyweight Combed Boxy Tee',
    timeAgo: '7m ago',
    category: 'fashion'
  },
  {
    id: 5,
    hub: '12th Main Road',
    store: 'Himalayan Momo House',
    action: 'Dispatched with hot chili chutney',
    item: 'Steamed Himalayan Chicken Momos (8 pcs)',
    timeAgo: '9m ago',
    category: 'food'
  }
];

export default function NetworkVelocityTicker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % VELOCITY_EVENTS.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const current = VELOCITY_EVENTS[currentIndex];

  return (
    <div style={{
      maxWidth: '1360px',
      margin: '0 auto',
      padding: '0 24px',
      marginBottom: '16px'
    }}>
      <div style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '10px',
        border: '1px solid rgba(19, 24, 21, 0.08)',
        padding: '8px 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
      }}>
        {/* Left: Live Pulse Tag */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            backgroundColor: '#0C291E',
            color: '#FFFFFF',
            fontSize: '10px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            padding: '2px 8px',
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}>
            <Radio size={11} color="#C49752" />
            <span>LIVE LOCAL NETWORK</span>
          </span>

          <span style={{ color: '#717A74', fontSize: '11px' }}>
            Bengaluru Micro-Hub Feed
          </span>
        </div>

        {/* Center: Sliding Event */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          overflow: 'hidden',
          transition: 'all 0.3s ease'
        }}>
          <span style={{ fontWeight: 700, color: '#0C291E' }}>{current.store}</span>
          <span style={{ color: '#717A74' }}>·</span>
          <span style={{ color: '#525A54' }}>{current.action}:</span>
          <strong style={{ color: '#0C291E' }}>{current.item}</strong>
          <span style={{
            fontSize: '10px',
            backgroundColor: '#F3F4EE',
            color: '#717A74',
            padding: '1px 6px',
            borderRadius: '4px',
            marginLeft: '4px'
          }}>
            {current.timeAgo}
          </span>
        </div>

        {/* Right: Guarantee */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#0C291E', fontWeight: 600 }}>
          <CheckCircle size={13} color="#22C55E" />
          <span>Real-time shop counter dispatches</span>
        </div>
      </div>
    </div>
  );
}
