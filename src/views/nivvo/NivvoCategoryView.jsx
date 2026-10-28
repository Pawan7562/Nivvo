import React, { useState, useEffect } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  ArrowLeft, ShoppingBag, Search, ChevronDown, Plus, X, Heart, 
  Star, SlidersHorizontal, Check, Sparkles, LayoutGrid, CheckCircle2 
} from 'lucide-react';
import { NIVVO_PRODUCTS, NIVVO_CATEGORIES } from '../../data/nivvoData';
import { playClickSound, playAddSound } from '../../utils/audioEffects';

const SUB_CHIPS = {
  all: ['All Finds', 'Under ₹500', 'Top Rated ★', 'Fastest 12m', 'Sellers Near You'],
  footwear: ['All Footwear', 'Sneakers', 'Sandals', 'Slippers', 'Trainers'],
  fashion: ['All Fashion', 'Shirts', 'Sarees', 'Ethnic Silks', 'Casuals'],
  computing: ['All Computing', 'Laptops', 'Keyboards', 'Monitors', 'Mouse'],
  mobiles: ['All Mobiles', 'Smartphones', 'Tablets', 'Fast Chargers', 'Cases'],
  accessories: ['All Chargers', '65W Fast Charger', 'Type-C Cables', 'Power Banks'],
  bags: ['All Bags', 'Backpacks', 'Travel Totes', 'Laptop Sleeves'],
  stationery: ['All Stationery', 'Notebooks', 'Pens', 'Desk Planners'],
  audio: ['All Audio', 'Headphones', 'Earbuds', 'Wireless ANC']
};

export default function NivvoCategoryView({
  initialCategory = 'all',
  onBack,
  onOpenCart,
  onSelectProduct
}) {
  const { 
    totalCartCount, 
    addToCart, 
    toggleWishlist, 
    isWishlisted, 
    showToast, 
    allProducts,
    selectedCategory,
    setSelectedCategory
  } = useNivvo();
  
  // Category Selection State
  const [activeCategory, setActiveCategory] = useState(() => initialCategory || selectedCategory || 'all');
  const [activeSubChip, setActiveSubChip] = useState('All Finds');
  const [categorySearch, setCategorySearch] = useState('');
  const [activeFilterPrice, setActiveFilterPrice] = useState(null); // 'under500' | 'under1000' | 'under2000' | 'above2000'
  const [activeFilterStock, setActiveFilterStock] = useState(false); // only in stock
  const [sortBy, setSortBy] = useState('relevance'); // 'relevance' | 'delivery' | 'price_asc' | 'price_desc' | 'rating'
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Sync when initialCategory or context changes
  useEffect(() => {
    if (initialCategory && initialCategory !== activeCategory) {
      setActiveCategory(initialCategory);
      const defaultChip = SUB_CHIPS[initialCategory]?.[0] || 'All Finds';
      setActiveSubChip(defaultChip);
    }
  }, [initialCategory]);

  const handleCategorySwitch = (catId) => {
    playClickSound();
    setActiveCategory(catId);
    if (setSelectedCategory) setSelectedCategory(catId);
    const defaultChip = SUB_CHIPS[catId]?.[0] || 'All Finds';
    setActiveSubChip(defaultChip);
  };

  const productsList = (allProducts && allProducts.length > 0) ? allProducts : NIVVO_PRODUCTS;

  // Filter by Main Category
  let categoryProducts = productsList.filter(p => {
    if (activeCategory === 'all') return true;
    const cat = (p.category || '').toLowerCase();
    const target = activeCategory.toLowerCase();
    if (cat === target) return true;
    if (target === 'fashion' && (cat.includes('apparel') || cat.includes('cloth') || cat.includes('saree') || cat.includes('silk') || cat.includes('fashion'))) return true;
    if (target === 'footwear' && (cat.includes('footwear') || cat.includes('shoe') || cat.includes('sneaker'))) return true;
    if (target === 'computing' && (cat.includes('computing') || cat.includes('laptop'))) return true;
    if (target === 'mobiles' && (cat.includes('mobile') || cat.includes('phone') || cat.includes('tablet'))) return true;
    if (target === 'accessories' && (cat.includes('charger') || cat.includes('cable') || cat.includes('accessor'))) return true;
    if (target === 'bags' && (cat.includes('bag') || cat.includes('backpack') || cat.includes('tote'))) return true;
    if (target === 'stationery' && (cat.includes('stationery') || cat.includes('book') || cat.includes('pen') || cat.includes('notebook'))) return true;
    if (target === 'audio' && (cat.includes('audio') || cat.includes('headphone') || cat.includes('earbud') || cat.includes('sound'))) return true;
    return false;
  });

  // Multi-attribute filtering (Sub-chip, search, price, stock)
  let filteredProducts = categoryProducts.filter(p => {
    // Sub-category chip
    if (activeSubChip && !activeSubChip.startsWith('All')) {
      const q = activeSubChip.toLowerCase();
      if (activeSubChip === 'Under ₹500' && p.price >= 500) return false;
      if (activeSubChip === 'Top Rated ★' && (p.rating || 4.5) < 4.6) return false;
      if (activeSubChip === 'Fastest 12m' && !p.deliveryTime?.includes('12')) return false;
      if (activeSubChip === 'Sellers Near You' && !p.shopName) return false;
      
      // Keyword matching
      if (!['Under ₹500', 'Top Rated ★', 'Fastest 12m', 'Sellers Near You'].includes(activeSubChip)) {
        const nameMatch = p.name.toLowerCase().includes(q);
        const descMatch = (p.description || '').toLowerCase().includes(q);
        const catMatch = (p.category || '').toLowerCase().includes(q);
        if (!nameMatch && !descMatch && !catMatch) return false;
      }
    }

    // Search query
    if (categorySearch.trim()) {
      const q = categorySearch.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchBrand = p.brand && p.brand.toLowerCase().includes(q);
      const matchShop = p.shopName && p.shopName.toLowerCase().includes(q);
      const matchCat = p.category && p.category.toLowerCase().includes(q);
      if (!matchName && !matchBrand && !matchShop && !matchCat) return false;
    }

    // Price filter
    if (activeFilterPrice === 'under500' && p.price >= 500) return false;
    if (activeFilterPrice === 'under1000' && p.price >= 1000) return false;
    if (activeFilterPrice === 'under2000' && (p.price < 1000 || p.price > 2000)) return false;
    if (activeFilterPrice === 'above2000' && p.price <= 2000) return false;

    // Stock filter
    if (activeFilterStock && (p.stockCount <= 0 || p.status?.toLowerCase().includes('out of stock'))) {
      return false;
    }

    return true;
  });

  // Sorting
  filteredProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'rating') return (b.rating || 4.5) - (a.rating || 4.5);
    if (sortBy === 'delivery') {
      const getMin = (s) => parseInt((s || '20').split('–')[0]) || 20;
      return getMin(a.deliveryTime) - getMin(b.deliveryTime);
    }
    return 0; // relevance
  });

  const sortLabels = {
    relevance: 'Relevance',
    delivery: 'Fastest 12m Delivery',
    price_asc: 'Price: Low to High',
    price_desc: 'Price: High to Low',
    rating: 'Top Rated'
  };

  const handleResetFilters = () => {
    playClickSound();
    setActiveCategory('all');
    setActiveSubChip('All Finds');
    setCategorySearch('');
    setActiveFilterPrice(null);
    setActiveFilterStock(false);
    setSortBy('relevance');
    showToast('Filters reset to All Categories');
  };

  const activeCategoryObj = NIVVO_CATEGORIES.find(c => c.id === activeCategory);
  const currentCategoryChips = SUB_CHIPS[activeCategory] || SUB_CHIPS.all;

  return (
    <div className="nivvo-category-screen" style={{ minHeight: '100%', paddingBottom: '90px', width: '100%', boxSizing: 'border-box', overflowX: 'hidden' }}>
      {/* 1. Header with Back button & Bag */}
      <div className="nivvo-nav-header" style={{ position: 'sticky', top: 0, zIndex: 60, backgroundColor: '#FFFFFF' }}>
        <div className="nivvo-nav-header-left">
          <button 
            className="nivvo-back-btn" 
            onClick={() => { playClickSound(); onBack ? onBack() : window.history.back(); }}
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="nivvo-nav-header-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <LayoutGrid size={18} color="#24452D" />
              <span>{activeCategory === 'all' ? 'All Categories' : (activeCategoryObj?.name || 'Category Finds')}</span>
            </div>
            <div className="nivvo-nav-header-subtitle">
              Verified local stock · 12–18 min arrival
            </div>
          </div>
        </div>
        <button 
          className="nivvo-bag-trigger" 
          onClick={() => { playClickSound(); onOpenCart(); }}
          aria-label="View Cart"
        >
          <ShoppingBag size={22} strokeWidth={1.8} />
          {totalCartCount > 0 && <span className="nivvo-bag-count-badge">{totalCartCount}</span>}
        </button>
      </div>

      {/* 2. Visual Horizontal Category Rail (All 8 Categories + "All") */}
      <div style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E7EAE3' }}>
        <div 
          className="nivvo-blinkit-cat-rail" 
          style={{ padding: '12px 16px 12px 16px', gap: '12px' }}
        >
          {/* "All" Category Pill */}
          <div 
            className={`nivvo-cat-rail-item ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => handleCategorySwitch('all')}
          >
            <div 
              className="nivvo-cat-rail-icon-box"
              style={{
                backgroundColor: activeCategory === 'all' ? '#20251F' : '#F7F8F5',
                borderColor: activeCategory === 'all' ? '#20251F' : '#E7EAE3'
              }}
            >
              <LayoutGrid size={24} color={activeCategory === 'all' ? '#B7F34A' : '#24452D'} />
              <span className="nivvo-cat-rail-badge" style={{ backgroundColor: '#B7F34A', color: '#20251F' }}>
                ALL
              </span>
            </div>
            <span 
              className="nivvo-cat-rail-label"
              style={{ fontWeight: activeCategory === 'all' ? 800 : 600, color: activeCategory === 'all' ? '#20251F' : '#73796F' }}
            >
              All Finds
            </span>
          </div>

          {/* 8 Official Categories */}
          {NIVVO_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <div 
                key={cat.id} 
                className={`nivvo-cat-rail-item ${isActive ? 'active' : ''}`}
                onClick={() => handleCategorySwitch(cat.id)}
              >
                <div 
                  className="nivvo-cat-rail-icon-box"
                  style={{
                    borderColor: isActive ? '#24452D' : '#E7EAE3',
                    borderWidth: isActive ? '2px' : '1px'
                  }}
                >
                  <img src={cat.image} alt={cat.name} className="nivvo-cat-rail-img" />
                  {cat.id === 'footwear' && <span className="nivvo-cat-rail-badge">⚡ 12m</span>}
                  {cat.id === 'audio' && <span className="nivvo-cat-rail-badge">TOP</span>}
                  {cat.id === 'fashion' && <span className="nivvo-cat-rail-badge">NEW</span>}
                </div>
                <span 
                  className="nivvo-cat-rail-label"
                  style={{ 
                    fontWeight: isActive ? 800 : 600, 
                    color: isActive ? '#20251F' : '#73796F',
                    maxWidth: '72px',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
                >
                  {cat.name.split(',')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '14px 16px', boxSizing: 'border-box', width: '100%', maxWidth: '100%' }}>
        {/* 3. Real-time Search in Category */}
        <div className="nivvo-search-bar-wrap" style={{ marginBottom: '12px' }}>
          <Search size={18} color="#73796F" />
          <input 
            type="text" 
            className="nivvo-search-input"
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            placeholder={`Search in ${activeCategory === 'all' ? 'all categories' : activeCategoryObj?.name}...`}
          />
          {categorySearch && (
            <button 
              onClick={() => { playClickSound(); setCategorySearch(''); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#73796F' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* 4. Sub-category Chips */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '12px', scrollbarWidth: 'none' }}>
          {currentCategoryChips.map(chip => (
            <button
              key={chip}
              onClick={() => { playClickSound(); setActiveSubChip(chip); }}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                fontSize: '12px',
                fontWeight: activeSubChip === chip ? 700 : 500,
                backgroundColor: activeSubChip === chip ? '#20251F' : '#FFFFFF',
                color: activeSubChip === chip ? '#FFFFFF' : '#20251F',
                border: activeSubChip === chip ? 'none' : '1px solid #E7EAE3',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {chip}
            </button>
          ))}
        </div>

        {/* 5. Filter Pills Bar (Price & In Stock) */}
        <div style={{
          border: '1px solid #E7EAE3',
          borderRadius: '14px',
          padding: '10px 14px',
          backgroundColor: '#FFFFFF',
          marginBottom: '14px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <SlidersHorizontal size={14} color="#20251F" />
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#20251F' }}>
                Quick Price Filters
              </span>
            </div>
            {(activeFilterPrice || activeFilterStock || categorySearch || activeCategory !== 'all') && (
              <span 
                onClick={handleResetFilters}
                style={{ fontSize: '11px', fontWeight: 700, color: '#24452D', cursor: 'pointer' }}
              >
                Reset All
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', scrollbarWidth: 'none' }}>
            {[
              { id: 'under500', label: 'Under ₹500' },
              { id: 'under1000', label: 'Under ₹1,000' },
              { id: 'under2000', label: '₹1,000–₹2,000' },
              { id: 'above2000', label: 'Above ₹2,000' }
            ].map((pr) => (
              <button
                key={pr.id}
                onClick={() => {
                  playClickSound();
                  setActiveFilterPrice(activeFilterPrice === pr.id ? null : pr.id);
                }}
                style={{
                  backgroundColor: activeFilterPrice === pr.id ? '#20251F' : '#F7F8F5',
                  color: activeFilterPrice === pr.id ? '#FFFFFF' : '#20251F',
                  border: activeFilterPrice === pr.id ? 'none' : '1px solid #E7EAE3',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  fontSize: '11px',
                  fontWeight: activeFilterPrice === pr.id ? 800 : 600,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                {pr.label} {activeFilterPrice === pr.id ? '✓' : ''}
              </button>
            ))}

            <button
              onClick={() => {
                playClickSound();
                setActiveFilterStock(!activeFilterStock);
              }}
              style={{
                backgroundColor: activeFilterStock ? '#24452D' : '#F7F8F5',
                color: activeFilterStock ? '#B7F34A' : '#20251F',
                border: activeFilterStock ? 'none' : '1px solid #E7EAE3',
                padding: '4px 10px',
                borderRadius: '8px',
                fontSize: '11px',
                fontWeight: activeFilterStock ? 800 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>In Stock Only</span>
              {activeFilterStock && <Check size={12} />}
            </button>
          </div>
        </div>

        {/* 6. Product Count & Sort Selector */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', fontSize: '13px' }}>
          <span style={{ color: '#73796F', fontWeight: 600 }}>
            {filteredProducts.length} local items available
          </span>

          <button 
            onClick={() => { playClickSound(); setShowSortDropdown(!showSortDropdown); }}
            style={{ 
              background: '#FFFFFF', 
              border: '1px solid #E7EAE3', 
              borderRadius: '8px',
              padding: '5px 10px',
              color: '#20251F', 
              fontWeight: 700, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              cursor: 'pointer',
              fontSize: '12px'
            }}
          >
            <span>{sortLabels[sortBy]}</span>
            <ChevronDown size={14} />
          </button>

          {/* Sort Dropdown */}
          {showSortDropdown && (
            <div style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7EAE3',
              borderRadius: '12px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
              zIndex: 50,
              minWidth: '180px',
              overflow: 'hidden',
              marginTop: '4px'
            }}>
              {Object.entries(sortLabels).map(([key, label]) => (
                <div
                  key={key}
                  onClick={() => {
                    playClickSound();
                    setSortBy(key);
                    setShowSortDropdown(false);
                  }}
                  style={{
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontWeight: sortBy === key ? 800 : 500,
                    color: sortBy === key ? '#24452D' : '#20251F',
                    backgroundColor: sortBy === key ? '#F0F3ED' : '#FFFFFF',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <span>{label}</span>
                  {sortBy === key && <Check size={14} color="#24452D" />}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 7. Product List or Empty State */}
        {filteredProducts.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px 20px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E7EAE3',
            borderRadius: '20px'
          }}>
            <Search size={36} color="#73796F" style={{ margin: '0 auto 12px auto', opacity: 0.6 }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#20251F', margin: '0 0 6px 0' }}>
              No items match your filters
            </h3>
            <p style={{ fontSize: '12px', color: '#73796F', margin: '0 0 16px 0' }}>
              Try switching categories or clearing search to view local verified stock.
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                backgroundColor: '#20251F',
                color: '#FFFFFF',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '10px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* 2-Column Responsive Product Card Grid */
          <div className="nivvo-product-card-grid">
            {filteredProducts.map((prod) => {
              const favorited = isWishlisted(prod.id);

              return (
                <div 
                  key={prod.id}
                  className="nivvo-product-card-master"
                  onClick={() => {
                    playClickSound();
                    onSelectProduct(prod);
                  }}
                  style={{ position: 'relative', minWidth: 0, width: '100%', boxSizing: 'border-box' }}
                >
                  <div className="nivvo-product-thumb-container">
                    <img 
                      src={prod.image} 
                      alt={prod.name} 
                      className="nivvo-product-thumb-img"
                      onError={(e) => {
                        e.target.src = '/assets/figma/cat_footwear.png';
                      }}
                    />

                    {/* Wishlist Heart Icon */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod.id);
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        width: '30px',
                        height: '30px',
                        borderRadius: '50%',
                        backgroundColor: '#FFFFFF',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
                        zIndex: 5
                      }}
                      title={favorited ? 'Remove from wishlist' : 'Save to wishlist'}
                    >
                      <Heart 
                        size={15} 
                        color={favorited ? '#E11D48' : '#73796F'} 
                        fill={favorited ? '#E11D48' : 'none'} 
                      />
                    </button>

                    {/* Delivery Time Badge */}
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      left: '8px',
                      backgroundColor: 'rgba(36, 69, 45, 0.92)',
                      color: '#FFFFFF',
                      padding: '2px 7px',
                      borderRadius: '5px',
                      fontSize: '9px',
                      fontWeight: 800,
                      backdropFilter: 'blur(4px)'
                    }}>
                      ⚡ {(prod.deliveryTime || '15m').split('–')[0]}m
                    </div>

                    {/* Quick Add Button */}
                    <button 
                      className="nivvo-floating-plus-btn"
                      title="Add to bag"
                      onClick={(e) => {
                        e.stopPropagation();
                        playAddSound();
                        const selectedSize = prod.sizes && prod.sizes.length > 0 ? prod.sizes[0] : 'Standard';
                        addToCart(prod, selectedSize);
                        showToast(`Added ${prod.name} to bag`);
                      }}
                    >
                      <Plus size={18} strokeWidth={2.6} />
                    </button>
                  </div>

                  {/* Shop & ETA */}
                  <div className="nivvo-card-shop-line" style={{ display: 'flex', alignItems: 'center', gap: '4px', minWidth: 0, overflow: 'hidden' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>
                      {prod.shopName || 'Local Partner Store'}
                    </span>
                    <span style={{ flexShrink: 0 }}>·</span>
                    <span style={{ color: '#24452D', fontWeight: 700, flexShrink: 0 }}>{prod.deliveryTime || '12–18 min'}</span>
                  </div>

                  {/* Product Title */}
                  <div className="nivvo-card-title" style={{ minWidth: 0 }}>{prod.name}</div>

                  {/* Price & Stock */}
                  <div className="nivvo-card-price-row" style={{ minWidth: 0, gap: '4px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', minWidth: 0, overflow: 'hidden' }}>
                      <span className="nivvo-card-price" style={{ whiteSpace: 'nowrap' }}>₹{prod.price?.toLocaleString('en-IN')}</span>
                      {prod.mrp && prod.mrp > prod.price && (
                        <span style={{ fontSize: '10.5px', color: '#73796F', textDecoration: 'line-through', whiteSpace: 'nowrap' }}>
                          ₹{prod.mrp}
                        </span>
                      )}
                    </div>
                    <span className="nivvo-card-stock" style={{ color: (prod.stockCount || 0) <= 2 ? '#E6A23C' : '#238636', whiteSpace: 'nowrap', flexShrink: 0 }}>
                      {(prod.stockCount || 0) > 0 ? `${prod.stockCount} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
