import React, { useState } from 'react';
import { 
  X, 
  Clock, 
  Star, 
  ShieldCheck, 
  Layers, 
  MapPin, 
  Sparkles, 
  Truck, 
  Plus, 
  CheckCircle2 
} from 'lucide-react';

export default function QuickViewModal({ 
  product, 
  onClose, 
  onAddToCart, 
  globalPreferredSize,
  onOpenTrialModal 
}) {
  if (!product) return null;

  const initialSize = product.sizes && product.sizes.length > 0 
    ? (product.sizes.includes(globalPreferredSize) ? globalPreferredSize : product.sizes[0])
    : 'Free Size';

  const [selectedSize, setSelectedSize] = useState(initialSize);
  const [selectedColor, setSelectedColor] = useState(product.colors ? product.colors[0] : null);
  const [doorstepTrialEnabled, setDoorstepTrialEnabled] = useState(product.trialSupported);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, doorstepTrialEnabled);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ 
              background: '#0C831F', 
              color: '#FFFFFF', 
              fontSize: '11px', 
              fontWeight: 800, 
              padding: '2px 8px', 
              borderRadius: '4px' 
            }}>
              ⚡ 10 MIN DISPATCH
            </span>
            <span style={{ fontSize: '13px', color: '#6B7280', fontWeight: 600 }}>
              {product.darkStore || 'Indiranagar Dark Store Hub'}
            </span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {/* Image */}
            <div style={{ flex: '1 1 240px', position: 'relative' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ 
                  width: '100%', 
                  height: '280px', 
                  objectFit: 'cover', 
                  borderRadius: '12px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)' 
                }} 
              />
              {product.discount && (
                <span style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  background: '#2563EB',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '11px',
                  padding: '3px 8px',
                  borderRadius: '4px'
                }}>
                  {product.discount}
                </span>
              )}
            </div>

            {/* Details */}
            <div style={{ flex: '1 1 280px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize: '11px', fontWeight: 800, color: '#6B7280', textTransform: 'uppercase' }}>
                {product.brand || 'Nivvo Prime'}
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#111827', margin: '4px 0 6px 0', lineHeight: 1.25 }}>
                {product.name}
              </h2>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#D97706', fontWeight: 800, fontSize: '13px' }}>
                  <Star size={14} fill="#D97706" />
                  <span>{product.rating}</span>
                </div>
                <span style={{ color: '#9CA3AF', fontSize: '12px' }}>• {product.reviewCount} verified buyers</span>
                <span style={{ color: '#0C831F', fontWeight: 700, fontSize: '12px' }}>⚡ In Stock Nearby</span>
              </div>

              {/* Price */}
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '14px' }}>
                <span style={{ fontSize: '24px', fontWeight: 900, color: '#111827' }}>₹{product.price}</span>
                {product.originalPrice && (
                  <span style={{ fontSize: '14px', color: '#9CA3AF', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
                )}
                <span style={{ fontSize: '12px', color: '#0C831F', fontWeight: 800, background: '#DCFCE7', padding: '2px 6px', borderRadius: '4px' }}>
                  Taxes Included
                </span>
              </div>

              {/* Color options */}
              {product.colors && product.colors.length > 0 && (
                <div style={{ marginBottom: '14px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563', display: 'block', marginBottom: '6px' }}>
                    Color: <span style={{ color: '#111827' }}>{selectedColor ? selectedColor.name : ''}</span>
                  </label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {product.colors.map((c, i) => (
                      <div 
                        key={i}
                        onClick={() => setSelectedColor(c)}
                        style={{
                          width: '26px',
                          height: '26px',
                          borderRadius: '50%',
                          backgroundColor: c.hex,
                          border: selectedColor?.name === c.name ? '3px solid #0C831F' : '1px solid #D1D5DB',
                          cursor: 'pointer',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Size selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#4B5563' }}>Select Size:</label>
                    <span style={{ fontSize: '11px', color: '#0C831F', fontWeight: 700, cursor: 'pointer' }} onClick={onOpenTrialModal}>
                      Confused? Doorstep 2-Size Trial available
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: 700,
                          border: selectedSize === sz ? '2px solid #111827' : '1px solid #E2E8F0',
                          background: selectedSize === sz ? '#111827' : '#F8FAFC',
                          color: selectedSize === sz ? '#FFFFFF' : '#334155',
                          cursor: 'pointer'
                        }}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Doorstep 2-size trial opt-in */}
              {product.trialSupported && (
                <div 
                  onClick={() => setDoorstepTrialEnabled(!doorstepTrialEnabled)}
                  style={{
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: doorstepTrialEnabled ? '#F0FDF4' : '#F9FAFB',
                    border: doorstepTrialEnabled ? '1.5px solid #0C831F' : '1px solid #E5E7EB',
                    marginBottom: '16px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    backgroundColor: doorstepTrialEnabled ? '#0C831F' : '#FFFFFF',
                    border: doorstepTrialEnabled ? 'none' : '1.5px solid #9CA3AF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF'
                  }}>
                    {doorstepTrialEnabled && <CheckCircle2 size={14} />}
                  </div>
                  <div style={{ fontSize: '11px', color: '#166534', flex: 1 }}>
                    <strong>Doorstep 2-Size Trial (FREE)</strong>
                    <div>Rider brings adjacent size. Try for 2 mins & return extra size!</div>
                  </div>
                </div>
              )}

              {/* Add to Cart button */}
              <button 
                onClick={handleAdd}
                style={{
                  width: '100%',
                  backgroundColor: '#0C831F',
                  color: '#FFFFFF',
                  padding: '12px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(12,131,31,0.25)',
                  cursor: 'pointer'
                }}
              >
                <span>ADD TO CART • ₹{product.price}</span>
              </button>
            </div>
          </div>

          {/* Description & Fabric Specs */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #E5E7EB' }}>
            <h4 style={{ fontSize: '13px', fontWeight: 800, color: '#111827', marginBottom: '6px' }}>Fabric & Construction</h4>
            <p style={{ fontSize: '12px', color: '#4B5563', lineHeight: 1.5, marginBottom: '8px' }}>
              {product.description}
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', fontSize: '11px', color: '#6B7280' }}>
              <div><strong>Material:</strong> {product.fabric || 'Premium Blended Cotton'}</div>
              <div><strong>Packaging:</strong> Pre-steamed, anti-crease zipper sleeve</div>
              <div><strong>Delivery Hub:</strong> {product.darkStore}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
