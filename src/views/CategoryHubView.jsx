import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../data/fashionData';
import { ArrowUpDown, ChevronLeft, Search, Filter } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function CategoryHubView({ 
  products, 
  onQuickView, 
  cartItems, 
  onAddToCart, 
  onUpdateQuantity, 
  globalPreferredSize,
  wishlist,
  onToggleWishlist,
  onBack
}) {
  const [selectedDept, setSelectedDept] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const [sortBy, setSortBy] = useState('speed');
  const [localSearch, setLocalSearch] = useState('');

  const handleSelectDept = (id) => {
    playClickSound();
    setSelectedDept(id);
  };

  const filtered = products.filter(p => {
    if (selectedDept !== 'all' && p.category !== selectedDept) return false;
    if (genderFilter !== 'all' && p.gender && p.gender !== 'unisex' && p.gender !== genderFilter) return false;
    if (localSearch.trim()) {
      const q = localSearch.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.fabric?.toLowerCase().includes(q);
    }
    return true;
  }).sort((a, b) => {
    if (sortBy === 'speed') return parseInt(a.deliveryTime) - parseInt(b.deliveryTime);
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0;
  });

  const departmentIcons = {
    'all': '🛍️',
    'festive': '🪔',
    'sos': '⚡',
    'formal': '👔',
    'casual': '👕',
    'women': '👗',
    'bottoms': '👖',
    'footwear': '👟',
    'accessories': '🕶️'
  };

  return (
    <div className="blinkit-category-hub-page">
      {/* Native Category Toolbar */}
      <div className="apk-profile-toolbar">
        <button 
          className="apk-toolbar-back-btn" 
          onClick={() => { playClickSound(); if (onBack) onBack(); }}
          aria-label="Back"
        >
          <ChevronLeft size={20} color="#293142" />
        </button>
        <div style={{ flex: 1 }}>
          <h1 className="apk-toolbar-title">All Categories</h1>
        </div>
      </div>

      {/* In-view Search & Filter Bar */}
      <div style={{ padding: '10px 14px 6px 14px', background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: '#F1F5F9',
          padding: '8px 12px',
          borderRadius: '10px'
        }}>
          <Search size={16} color="#64748B" />
          <input 
            type="text"
            placeholder="Search within categories..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              border: 'none',
              background: 'transparent',
              outline: 'none',
              width: '100%',
              fontSize: '13px',
              fontWeight: 600,
              color: '#0F172A'
            }}
          />
        </div>

        {/* Gender Filter Chips */}
        <div style={{ display: 'flex', gap: '6px', marginTop: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
          {['all', 'men', 'women', 'unisex'].map(g => (
            <button
              key={g}
              className={`filter-pill ${genderFilter === g ? 'active' : ''}`}
              onClick={() => { playClickSound(); setGenderFilter(g); }}
              style={{ textTransform: 'capitalize', fontSize: '11px', padding: '4px 10px' }}
            >
              {g === 'all' ? 'All Genders' : g}
            </button>
          ))}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowUpDown size={12} color="#64748B" />
            <select 
              className="sort-select"
              value={sortBy}
              onChange={(e) => { playClickSound(); setSortBy(e.target.value); }}
              style={{ fontSize: '11px', padding: '3px 6px' }}
            >
              <option value="speed">⚡ Fastest (8m)</option>
              <option value="price-low">Price: Low-High</option>
              <option value="price-high">Price: High-Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sidebar + Content 2-Column Native Layout */}
      <div className="category-hub-container">
        {/* Left Sidebar with Department Icons */}
        <aside className="category-hub-sidebar">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`sidebar-category-btn ${selectedDept === cat.id ? 'active' : ''}`}
              onClick={() => handleSelectDept(cat.id)}
            >
              <span className="sidebar-cat-emoji">{departmentIcons[cat.id] || '👕'}</span>
              <span className="sidebar-cat-name">{cat.name}</span>
            </button>
          ))}
        </aside>

        {/* Right Product Grid */}
        <div className="category-hub-content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: '#0F172A' }}>
              {CATEGORIES.find(c => c.id === selectedDept)?.name || 'All Fashion'}
            </span>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748B' }}>{filtered.length} items</span>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#64748B' }}>
              <p style={{ fontSize: '13px', fontWeight: 700 }}>No items found</p>
              <button 
                onClick={() => { setSelectedDept('all'); setGenderFilter('all'); setLocalSearch(''); }}
                style={{ marginTop: '8px', background: '#0C831F', color: '#FFFFFF', padding: '6px 14px', borderRadius: '6px', fontSize: '11.5px', fontWeight: 700, border: 'none', cursor: 'pointer' }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="products-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '10px' }}>
              {filtered.map(item => {
                const cartItem = cartItems.find(c => c.id === item.id);
                const isWishlisted = wishlist.includes(item.id);

                return (
                  <ProductCard 
                    key={item.id}
                    product={item}
                    onQuickView={onQuickView}
                    cartItem={cartItem}
                    onAddToCart={onAddToCart}
                    onUpdateQuantity={onUpdateQuantity}
                    globalPreferredSize={globalPreferredSize}
                    isWishlisted={isWishlisted}
                    onToggleWishlist={onToggleWishlist}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
