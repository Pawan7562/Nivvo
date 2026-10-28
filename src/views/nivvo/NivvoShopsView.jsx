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

  const filterChips = ['All shops', 'Footwear', 'Clothes & Sarees', 'Laptops & Mobiles', 'Books & Stationery', 'Bags & Accessories'];

  const shopsList = (allShops && allShops.length > 0) ? allShops : NIVVO_SHOPS;
  const filteredShops = shopsList.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchShop.toLowerCase()) ||
                          shop.categories.some(c => c.toLowerCase().includes(searchShop.toLowerCase()));
    
    if (activeFilter === 'Footwear') {
      return matchesSearch && shop.categories.some(c => c.toLowerCase().includes('footwear') || c.toLowerCase().includes('sneakers') || c.toLowerCase().includes('shoes') || c.toLowerCase().includes('sandals'));
    }
    if (activeFilter === 'Clothes & Sarees') {
      return matchesSearch && shop.categories.some(c => c.toLowerCase().includes('t-shirts') || c.toLowerCase().includes('shirts') || c.toLowerCase().includes('clothes') || c.toLowerCase().includes('sarees') || c.toLowerCase().includes('apparel') || c.toLowerCase().includes('ethnic'));
    }
    if (activeFilter === 'Laptops & Mobiles') {
      return matchesSearch && shop.categories.some(c => c.toLowerCase().includes('mobiles') || c.toLowerCase().includes('laptops') || c.toLowerCase().includes('chargers') || c.toLowerCase().includes('audio'));
    }
    if (activeFilter === 'Books & Stationery') {
      return matchesSearch && shop.categories.some(c => c.toLowerCase().includes('books') || c.toLowerCase().includes('pens') || c.toLowerCase().includes('notebooks') || c.toLowerCase().includes('stationery'));
    }
    if (activeFilter === 'Bags & Accessories') {
      return matchesSearch && shop.categories.some(c => c.toLowerCase().includes('bags') || c.toLowerCase().includes('backpacks') || c.toLowerCase().includes('totes') || c.toLowerCase().includes('accessories'));
    }
    return matchesSearch;
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
            >
              <span>{selectedAddress.title}, Bengaluru</span>
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
        <div className="nivvo-search-bar-wrap" style={{ marginBottom: '16px' }}>
          <Search size={18} color="#73796F" />
          <input 
            type="text" 
            className="nivvo-search-input"
            value={searchShop}
            onChange={(e) => setSearchShop(e.target.value)}
            placeholder="Find a shop or a neighbourhood..."
          />
          {searchShop && (
            <button onClick={() => setSearchShop('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#73796F' }}>
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '20px' }}>
          {filterChips.map(chip => (
            <button
              key={chip}
              onClick={() => { playClickSound(); setActiveFilter(chip); }}
              style={{
                padding: '8px 16px',
                borderRadius: '999px',
                fontSize: '13px',
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

        {/* Count and Sort */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', fontSize: '13px' }}>
          <span style={{ color: '#73796F', fontWeight: 500 }}>
            {filteredShops.length} shops within 3 km of {selectedAddress.area}
          </span>
          <button style={{ background: 'none', border: 'none', color: '#20251F', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px', cursor: 'pointer' }}>
            <span>Nearest first</span>
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Shop List Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {filteredShops.map((shop) => (
            <div 
              key={shop.id}
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
                  src={shop.image} 
                  alt={shop.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.92)',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#20251F'
                }}>
                  {shop.eta}
                </div>
              </div>

              {/* Title & Rating */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#20251F', margin: 0 }}>
                  {shop.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '14px', fontWeight: 700, color: '#20251F' }}>
                  <span>★</span>
                  <span>{shop.rating}</span>
                  <span style={{ color: '#73796F', fontWeight: 400 }}>({shop.reviewsCount})</span>
                </div>
              </div>

              {/* Tags */}
              <div style={{ fontSize: '13px', color: '#73796F', marginBottom: '4px' }}>
                {shop.categories.join(' · ')}
              </div>

              {/* Distance and Status */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#20251F' }}>
                <span>{shop.distance}</span>
                <span style={{ color: '#238636', fontWeight: 600 }}>{shop.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
