import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export default function AppStatusBar() {
  const [timeStr, setTimeStr] = useState('9:41');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="app-status-bar">
      <div className="status-bar-time">{timeStr}</div>
      <div className="status-bar-notch">
        <div className="dynamic-island-pill">
          <div className="island-camera" />
          <div className="island-sensor" />
        </div>
      </div>
      <div className="status-bar-icons">
        <Signal size={13} strokeWidth={2.5} />
        <span className="status-network-type">5G</span>
        <Wifi size={13} strokeWidth={2.5} />
        <div className="battery-indicator">
          <div className="battery-level" />
        </div>
      </div>
    </div>
  );
}
