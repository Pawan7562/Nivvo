import React from 'react';
import { TrendingUp, ArrowUpRight, DollarSign } from 'lucide-react';

export default function MerchantRevenueVisualizer({
  monthlyOfflineSales = 650000,
  onSliderChange
}) {
  const offlineLakhs = monthlyOfflineSales / 100000;
  const incrementalBoost = Math.round(monthlyOfflineSales * 0.38);
  const totalCombined = monthlyOfflineSales + incrementalBoost;
  const boostLakhs = (incrementalBoost / 100000).toFixed(2);
  const totalLakhs = (totalCombined / 100000).toFixed(2);

  // Generate 6-month projected points for the SVG curve
  // Month 1 to Month 6 with progressive growth curve
  const points = [
    { month: 'M1', offline: offlineLakhs, boost: offlineLakhs * 0.12 },
    { month: 'M2', offline: offlineLakhs, boost: offlineLakhs * 0.20 },
    { month: 'M3', offline: offlineLakhs, boost: offlineLakhs * 0.28 },
    { month: 'M4', offline: offlineLakhs, boost: offlineLakhs * 0.33 },
    { month: 'M5', offline: offlineLakhs, boost: offlineLakhs * 0.36 },
    { month: 'M6', offline: offlineLakhs, boost: offlineLakhs * 0.38 }
  ];

  // SVG Chart Geometry (width: 380, height: 160)
  const width = 380;
  const height = 150;
  const padding = 20;

  // Max value for scaling
  const maxVal = offlineLakhs * 1.55;

  const getCoordinates = (p, idx) => {
    const x = padding + (idx * (width - 2 * padding)) / (points.length - 1);
    const combinedYVal = p.offline + p.boost;
    const y = height - padding - ((combinedYVal / maxVal) * (height - 2 * padding));
    const baseY = height - padding - ((p.offline / maxVal) * (height - 2 * padding));
    return { x, y, baseY };
  };

  const coords = points.map((p, i) => getCoordinates(p, i));

  // Build SVG Path strings
  const combinedPath = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`, '');
  const areaPath = `${combinedPath} L ${coords[coords.length - 1].x} ${height - padding} L ${coords[0].x} ${height - padding} Z`;
  const basePath = coords.reduce((acc, c, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${c.x} ${c.baseY}`, '');

  return (
    <div style={{
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px',
      color: '#FFFFFF'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 800, letterSpacing: '0.04em', color: '#C49752', textTransform: 'uppercase', marginBottom: '2px' }}>
            Interactive Revenue Projection
          </div>
          <h4 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#FFFFFF' }}>
            Incremental Sales Trajectory
          </h4>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'rgba(34, 197, 94, 0.18)', color: '#22C55E', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>
          <TrendingUp size={12} />
          <span>+38% Uplift</span>
        </div>
      </div>

      {/* Slider Control */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px', color: 'rgba(255,255,255,0.85)' }}>
          <span>Current In-Store Monthly Sales:</span>
          <strong style={{ color: '#C49752', fontSize: '13px' }}>₹{offlineLakhs.toFixed(1)} Lakhs</strong>
        </div>
        <input 
          type="range"
          min="200000"
          max="2500000"
          step="50000"
          value={monthlyOfflineSales}
          onChange={(e) => onSliderChange && onSliderChange(Number(e.target.value))}
          style={{ width: '100%', accentColor: '#C49752', cursor: 'pointer' }}
        />
      </div>

      {/* Interactive SVG Chart */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        backgroundColor: 'rgba(0, 0, 0, 0.25)',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '14px'
      }}>
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <linearGradient id="boostAreaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C49752" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#C49752" stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
          <line x1={padding} y1={(height - padding) / 2} x2={width - padding} y2={(height - padding) / 2} stroke="rgba(255,255,255,0.08)" strokeDasharray="2 4" strokeWidth="1" />

          {/* Area Fill for Incremental Boost */}
          <path d={areaPath} fill="url(#boostAreaGradient)" />

          {/* Offline Baseline Path (Dashed) */}
          <path d={basePath} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeDasharray="4 4" />

          {/* Total Combined Revenue Line (Solid Copper) */}
          <path d={combinedPath} fill="none" stroke="#C49752" strokeWidth="2.5" />

          {/* Target Milestone Nodes */}
          {coords.map((c, idx) => (
            <g key={idx}>
              <circle cx={c.x} cy={c.y} r="3.5" fill="#C49752" stroke="#FFFFFF" strokeWidth="1.5" />
              <text x={c.x} y={height - 6} fill="rgba(255,255,255,0.5)" fontSize="9" textAnchor="middle">
                {points[idx].month}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* Numerical Summary Counters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <div style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          borderRadius: '8px',
          padding: '10px 12px'
        }}>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.65)' }}>Monthly In-Store Baseline</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFFFFF', marginTop: '2px' }}>
            ₹{offlineLakhs.toFixed(1)} Lakhs
          </div>
        </div>

        <div style={{
          backgroundColor: 'rgba(196, 151, 82, 0.12)',
          border: '1px solid rgba(196, 151, 82, 0.3)',
          borderRadius: '8px',
          padding: '10px 12px'
        }}>
          <div style={{ fontSize: '11px', color: '#C49752', fontWeight: 700 }}>+ Nivvo Hyperlocal Boost</div>
          <div style={{ fontSize: '16px', fontWeight: 800, color: '#C49752', marginTop: '2px' }}>
            +₹{incrementalBoost.toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
