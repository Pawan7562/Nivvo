import React, { useState } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { ArrowLeft, ShoppingBag, Search, ChevronDown, MapPin, Star, X } from 'lucide-react';
import { NIVVO_SHOPS } from '../../data/nivvoData';
import { playClickSound } from '../../utils/audioEffects';

export default function NivvoShopsView({
  onBack,
  onOpenCart,
  onSelectShop
}) {
  const { totalCartCount, selectedAddress, setActiveModal, allShops } = useNivvo();
  const [activeFilter, setActiveFilter] = useState('All shops');
  const [searchShop, setSearchShop] = useState('');
  const [sortBy, setSortBy] = useState('nearest'); // 'nearest' | 'rating' | 'speed'
  const [radiusFilter, setRadiusFilter] = useState('all'); // 'all' | '2' | '5' | '10'

  const filterChips = ['All shops', 'Footwear', 'Clothes & Sarees', 'Laptops & Mobiles', 'Books & Stationery', 'Bags & Accessories'];

  const shopsList = (allShops && allShops.length > 0) ? allShops : NIVVO_SHOPS;
  let filteredShops = shopsList.filter(shop => {
    const sName = shop.name || shop.shop_name || '';
    const sCats = shop.categories || (shop.category ? [shop.category] : []);
    const matchesSearch = sName.toLowerCase().includes(searchShop.toLowerCase()) ||
                          sCats.some(c => c.toLowerCase().includes(searchShop.toLowerCase())) ||
                          (shop.address && shop.address.toLowerCase().includes(searchShop.toLowerCase()));
    
    // Category filtering
    let matchesCategory = true;
    if (activeFilter === 'Footwear') {
      matchesCategory = sCats.some(c => c.toLowerCase().includes('footwear') || c.toLowerCase().includes('sneakers') || c.toLowerCase().includes('shoes') || c.toLowerCase().includes('sandals'));
    } else if (activeFilter === 'Clothes & Sarees') {
      matchesCategory = sCats.some(c => c.toLowerCase().includes('t-shirts') || c.toLowerCase().includes('shirts') || c.toLowerCase().includes('clothes') || c.toLowerCase().includes('sarees') || c.toLowerCase().includes('apparel') || c.toLowerCase().includes('ethnic'));
    } else if (activeFilter === 'Laptops & Mobiles') {
      matchesCategory = sCats.some(c => c.toLowerCase().includes('mobiles') || c.toLowerCase().includes('laptops') || c.toLowerCase().includes('chargers') || c.toLowerCase().includes('audio'));
    } else if (activeFilter === 'Books & Stationery') {
      matchesCategory = sCats.some(c => c.toLowerCase().includes('books') || c.toLowerCase().includes('pens') || c.toLowerCase().includes('notebooks') || c.toLowerCase().includes('stationery'));
    } else if (activeFilter === 'Bags & Accessories') {
      matchesCategory = sCats.some(c => c.toLowerCase().includes('bags') || c.toLowerCase().includes('backpacks') || c.toLowerCase().includes('totes') || c.toLowerCase().includes('accessories'));
    }

    // Distance Radius filtering
    let matchesRadius = true;
    if (radiusFilter !== 'all' && shop.distance_km !== null && shop.distance_km !== undefined) {
      matchesRadius = shop.distance_km <= parseFloat(radiusFilter);
    }

    return matchesSearch && matchesCategory && matchesRadius;
  });

  // Dynamic Proximity & Rating Sorting
  filteredShops.sort((a, b) => {
    if (sortBy === 'rating') {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'speed') {
      const aMin = a.eta_minutes ?? 20;
      const bMin = b.eta_minutes ?? 20;
      return aMin - bMin;
    }
    // Default: 'nearest'
    if (a.distance_km === null && b.distance_km === null) return 0;
    if (a.distance_km === null) return 1;
    if (b.distance_km === null) return -1;
    return a.distance_km - b.distance_km;
  });

  return (
    <div className="nivvo-shops-screen" style={{ minHeight: '100%', paddingBottom: '40px' }}>
      {/* Header matching Screen 2 */}
      <div className="nivvo-nav-header">
        <div className="nivvo-nav-header-left">
          <button className="nivvo-back-btn" onClick={onBack}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="nivvo-nav-header-title">Shops around you</div>
            <div 
              className="nivvo-nav-header-subtitle"
              onClick={() => setActiveModal('location')}
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px' }}
              title="Click to detect or change delivery location"
            >
              <span>{selectedAddress?.title || selectedAddress?.area || 'Indiranagar'}, Bengaluru</span>
              <ChevronDown size={12} />
            </div>
          </div>
        </div>
        <button className="nivvo-bag-trigger" onClick={onOpenCart}>
          <ShoppingBag size={22} strokeWidth={1.8} />
          {totalCartCount > 0 && <span className="nivvo-bag-count-badge">{totalCartCount}</span>}
        </button>
      </div>

      <div style={{ padding: '16px 20px' }}>
        {/* Search */}
        <div className="nivvo-search-bar-wrap" style={{ marginBottom: '14px' }}>
          <Search size={18} color="#73796F" />
          <input 
            type="text" 
            className="nivvo-search-input"
            value={searchShop}
            onChange={(e) => setSearchShop(e.target.value)}
            placeholder="Search verified shops, street or products..."
          />
          {searchShop && (
            <button onClick={() => setSearchShop('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#73796F' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px', scrollbarWidth: 'none' }}>
          {filterChips.map(chip => (
            <button
              key={chip}
              onClick={() => { playClickSound(); setActiveFilter(chip); }}
              style={{
                padding: '7px 15px',
                borderRadius: '999px',
                fontSize: '12.5px',
                fontWeight: activeFilter === chip ? 700 : 500,
                backgroundColor: activeFilter === chip ? '#20251F' : '#FFFFFF',
                color: activeFilter === chip ? '#FFFFFF' : '#20251F',
                border: activeFilter === chip ? 'none' : '1px solid #E7EAE3',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Distance Radius Filter Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          <span style={{ fontSize: '11px', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', marginRight: '4px' }}>
            Radius:
          </span>
          {[
            { id: 'all', label: 'All distances' },
            { id: '2', label: '< 2 km (Fastest)' },
            { id: '5', label: '< 5 km' },
            { id: '10', label: '< 10 km' }
          ].map(r => (
            <button
              key={r.id}
              onClick={() => { playClickSound(); setRadiusFilter(r.id); }}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: radiusFilter === r.id ? 700 : 500,
                backgroundColor: radiusFilter === r.id ? '#DCFCE7' : '#F3F4F6',
                color: radiusFilter === r.id ? '#15803D' : '#4B5563',
                border: radiusFilter === r.id ? '1px solid #86EFAC' : '1px solid transparent',
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}
            >
              {r.label}
            </button>
          ))}
        </div>

        {/* Count and Interactive Sort */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
          <span style={{ color: '#73796F', fontWeight: 500 }}>
            {filteredShops.length} shops near {selectedAddress?.area || 'you'}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span style={{ fontSize: '11px', color: '#6B7280' }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => { playClickSound(); setSortBy(e.target.value); }}
              style={{
                border: '1px solid #E7EAE3',
                borderRadius: '6px',
                padding: '3px 6px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#20251F',
                backgroundColor: '#FFFFFF',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              <option value="nearest">Nearest first (GPS)</option>
              <option value="speed">Fastest ETA</option>
              <option value="rating">Highest rated ★</option>
            </select>
          </div>
        </div>

        {/* Shop List Cards */}
        <div className="nivvo-shops-grid" style={{ display: 'grid', gap: '24px' }}>
          {filteredShops.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '36px 16px',
              backgroundColor: '#F8FAFC',
              borderRadius: '16px',
              border: '1px dashed #CBD5E1'
            }}>
              <MapPin size={32} color="#94A3B8" style={{ margin: '0 auto 8px' }} />
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                No shops found within this distance
              </div>
              <div style={{ fontSize: '12.5px', color: '#64748B', marginBottom: '14px' }}>
                Try selecting "All distances" or change your delivery location.
              </div>
              <button
                onClick={() => { setRadiusFilter('all'); setActiveFilter('All shops'); }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  backgroundColor: '#20251F',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Reset Distance Filter
              </button>
            </div>
          ) : (
            filteredShops.map((shop) => (
              <div 
                key={shop.id || shop.shop_id}
                onClick={() => {
                  playClickSound();
                  onSelectShop(shop);
                }}
                style={{ cursor: 'pointer' }}
              >
                {/* Storefront Image with ETA Badge */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '16/9',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  backgroundColor: '#EAECE6',
                  marginBottom: '12px'
                }}>
                  <img 
                    src={shop.image || '/assets/figma/cat_fashion.png'} 
                    alt={shop.name || shop.shop_name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(255, 255, 255, 0.94)',
                    backdropFilter: 'blur(4px)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '12px',
                    fontWeight: 800,
                    color: '#20251F',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                  }}>
                    ⚡ {shop.eta || '12–18 min'}
                  </div>

                  {shop.distance && (
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      backgroundColor: 'rgba(36, 69, 45, 0.88)',
                      backdropFilter: 'blur(4px)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 700,
                      color: '#B7F34A'
                    }}>
                      📍 {shop.distance}
                    </div>
                  )}
                </div>

                {/* Title & Rating */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#20251F', margin: 0 }}>
                    {shop.name || shop.shop_name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '14px', fontWeight: 700, color: '#20251F' }}>
                    <span style={{ color: '#EAB308' }}>★</span>
                    <span>{shop.rating}</span>
                    <span style={{ color: '#73796F', fontWeight: 400 }}>({shop.reviewsCount || 120})</span>
                  </div>
                </div>

                {/* Tags */}
                <div style={{ fontSize: '13px', color: '#73796F', marginBottom: '4px' }}>
                  {(shop.categories || (shop.category ? [shop.category] : ['Local Store'])).join(' · ')}
                </div>

                {/* Distance and Status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#20251F' }}>
                  <span style={{ fontWeight: 600 }}>📍 {shop.address}</span>
                  <span style={{ color: shop.is_open === false ? '#DC2626' : '#238636', fontWeight: 700 }}>
                    {shop.status || 'Open · Stock synced'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
