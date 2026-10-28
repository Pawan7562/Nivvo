import React, { useState, useEffect, useMemo } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Clock, Plus, Minus, Store, Zap, Sparkles, 
  ShieldCheck, ArrowRight, Star, Heart, Check, ChevronRight, 
  ShoppingBag, X, CheckCircle, CheckCircle2, RotateCcw,
  Apple, UtensilsCrossed
} from 'lucide-react';
import { playClickSound, playAddSound, playTrialSound } from '../../utils/audioEffects';

// ─── 1. RESTORED SQUIRCLE PHOTOGRAPHIC CATEGORY RAIL ───
const HOME_CATEGORY_RAIL = [
  { id: 'footwear', name: 'Shoes & Footwear', image: '/assets/figma/cat_footwear.png', badge: '12m' },
  { id: 'fashion', name: 'Clothes', image: '/assets/figma/cat_fashion.png', badge: 'NEW' },
  { id: 'beauty', name: 'Beauty & Cosmetics', image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=200&auto=format&fit=crop&q=80', badge: 'HOT' },
  { id: 'jewellery', name: 'Jewellery & Watches', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=200&auto=format&fit=crop&q=80' },
  { id: 'household', name: 'Household Essentials', image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=200&auto=format&fit=crop&q=80' },
  { id: 'accessories', name: 'Chargers & Cables', image: '/assets/figma/cat_accessories.png' },
  { id: 'audio', name: 'Headphones & Audio', image: '/assets/figma/cat_audio.png', badge: 'TOP' },
  { id: 'wearables', name: 'Smart Watches', image: '/assets/figma/cat_wearables.png' },
  { id: 'computing', name: 'Laptops & Computing', image: '/assets/figma/cat_computing.png' },
  { id: 'mobiles', name: 'Mobile Phones', image: '/assets/figma/cat_mobiles.png' },
  { id: 'lifestyle', name: 'Books & Living', image: '/assets/figma/cat_lifestyle.png' }
];

// ─── 2. CLEAN BESTSELLER SHOWCASE (Single Packshot Visual Cards) ───
const BESTSELLER_SHOWCASE = [
  {
    id: 'bs-footwear',
    category: 'footwear',
    title: 'Shoes & Sneakers',
    count: '140+ items',
    image: '/assets/figma/cat_footwear.png'
  },
  {
    id: 'bs-clothing',
    category: 'clothing',
    title: 'Apparel & Fits',
    count: '250+ items',
    image: '/assets/figma/cat_fashion.png'
  },
  {
    id: 'bs-beauty',
    category: 'beauty',
    title: 'Beauty & Skincare',
    count: '180+ items',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'bs-jewellery',
    category: 'jewellery',
    title: 'Jewellery & Gold',
    count: '120+ items',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'bs-tech',
    category: 'accessories',
    title: 'Audio & Gadgets',
    count: '95+ items',
    image: '/assets/figma/cat_audio.png'
  },
  {
    id: 'bs-household',
    category: 'household',
    title: 'Home & Living',
    count: '160+ items',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop&q=80'
  }
];

// ─── 3. CURATED BEAUTY & PERSONAL CARE ───
const BEAUTY_CATEGORIES = [
  { name: 'Skincare & Serums', category: 'beauty', img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80' },
  { name: 'Cosmetics & Lips', category: 'beauty', img: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=300&auto=format&fit=crop&q=80' },
  { name: 'Luxury Fragrance', category: 'beauty', img: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&auto=format&fit=crop&q=80' },
  { name: 'Haircare & Oils', category: 'beauty', img: 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=300&auto=format&fit=crop&q=80' }
];

// ─── 4. CURATED HOUSEHOLD ESSENTIALS ───
const HOUSEHOLD_CATEGORIES = [
  { name: 'Scented Candles', category: 'household', img: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop&q=80' },
  { name: 'Aroma Diffusers', category: 'household', img: 'https://images.unsplash.com/photo-1602928321679-560bb453f190?w=300&auto=format&fit=crop&q=80' },
  { name: 'Organizers & Storage', category: 'household', img: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=300&auto=format&fit=crop&q=80' },
  { name: 'Kitchen & Dining', category: 'household', img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&auto=format&fit=crop&q=80' }
];

// ─── 5. CURATED CLOTHING, JEWELLERY & ACCESSORIES ───
const FASHION_JEWEL_CATEGORIES = [
  { name: 'Oversized Tees', category: 'clothing', img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=80' },
  { name: 'Formal Shirts', category: 'clothing', img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=300&auto=format&fit=crop&q=80' },
  { name: 'Gold Chains', category: 'jewellery', img: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80' },
  { name: 'Leather Wallets', category: 'accessories', img: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=300&auto=format&fit=crop&q=80' }
];

// ─── 6. STORES IN THE SPOTLIGHT (With Genuine Boutique Imagery) ───
const SPOTLIGHT_STORES = [
  {
    id: 'sole-street',
    name: 'Sole Street Originals',
    sub: 'Footwear & Streetwear Drops',
    category: 'footwear',
    rating: '4.8',
    eta: '12–18 min',
    distance: '0.6 km',
    image: '/assets/figma/shop_sole_street.png'
  },
  {
    id: 'thread-form',
    name: 'Thread & Form Studio',
    sub: 'Linens & Crisp Fits',
    category: 'clothing',
    rating: '4.9',
    eta: '14–20 min',
    distance: '1.1 km',
    image: '/assets/figma/shop_thread_form.png'
  },
  {
    id: 'glow-aura',
    name: 'Glow & Aura Boutique',
    sub: 'Clean Skincare & Scent',
    category: 'beauty',
    rating: '4.8',
    eta: '10–15 min',
    distance: '0.8 km',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'jewel-atelier',
    name: 'The Jewel Atelier',
    sub: '18K Gold Plated & Sterling',
    category: 'jewellery',
    rating: '4.9',
    eta: '15–20 min',
    distance: '1.4 km',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'artisan-home',
    name: 'Artisan Home Indiranagar',
    sub: 'Hand-poured Candles & Decor',
    category: 'household',
    rating: '4.7',
    eta: '12–18 min',
    distance: '0.9 km',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=300&auto=format&fit=crop&q=80'
  }
];

// ─── 7. PICKS FOR YOUR LIFESTYLE (Shop by Aesthetic) ───
const LIFESTYLE_PICKS = [
  { name: 'Minimalist', sub: 'Clean silhouettes', category: 'clothing' },
  { name: 'Streetwear', sub: 'Oversized & sneakers', category: 'clothing' },
  { name: 'Boardroom', sub: 'Crisp & tailored', category: 'clothing' },
  { name: 'Festive', sub: 'Silks & handcrafted', category: 'festive' },
  { name: 'Activewear', sub: 'Performance fits', category: 'footwear' },
  { name: 'Weekend Cozy', sub: 'Slides & soft cotton', category: 'accessories' }
];

// ─── 8. COMBINED MULTI-CATEGORY PRODUCTS ───
const COMBINED_PRODUCTS = [
  {
    id: 'comb-1',
    name: 'Everyday Court Sneaker',
    category: 'footwear',
    shopName: 'Sole Street Originals',
    price: 1429,
    originalPrice: 1699,
    discount: 'Save ₹270',
    pack: 'UK 6–10',
    deliveryTime: '12–18 min',
    image: '/assets/figma/product_court_sneaker.png',
    trialSupported: true,
    rating: 4.8
  },
  {
    id: 'comb-2',
    name: '220 GSM Oversized Heavyweight Tee',
    category: 'clothing',
    shopName: 'Thread & Form Studio',
    price: 699,
    originalPrice: 999,
    discount: '30% OFF',
    pack: 'Size S–XXL',
    deliveryTime: '10–14 min',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=500&auto=format&fit=crop&q=80',
    trialSupported: true,
    rating: 4.9
  },
  {
    id: 'comb-3',
    name: 'Vitamin C Radiance Glow Serum',
    category: 'beauty',
    shopName: 'Glow & Aura Boutique',
    price: 549,
    originalPrice: 799,
    discount: '31% OFF',
    pack: '30 ml bottle',
    deliveryTime: '10–12 min',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500&auto=format&fit=crop&q=80',
    trialSupported: false,
    rating: 4.8
  },
  {
    id: 'comb-4',
    name: '18K Gold Plated Herringbone Chain',
    category: 'jewellery',
    shopName: 'The Jewel Atelier',
    price: 899,
    originalPrice: 1499,
    discount: '40% OFF',
    pack: 'Anti-Tarnish',
    deliveryTime: '14–18 min',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
    trialSupported: false,
    rating: 4.9
  },
  {
    id: 'comb-5',
    name: 'Two-Strap Leather Sandal',
    category: 'footwear',
    shopName: 'Sole Street Originals',
    price: 899,
    originalPrice: 1199,
    discount: 'Save ₹300',
    pack: 'UK 6–10',
    deliveryTime: '12–18 min',
    image: '/assets/figma/product_sandals.png',
    trialSupported: true,
    rating: 4.7
  },
  {
    id: 'comb-6',
    name: 'Wrinkle-Free Semi-Spread Shirt',
    category: 'clothing',
    shopName: 'Thread & Form Studio',
    price: 1199,
    originalPrice: 1799,
    discount: '33% OFF',
    pack: 'Size 38–44',
    deliveryTime: '12–16 min',
    image: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=500&auto=format&fit=crop&q=80',
    trialSupported: true,
    rating: 4.8
  },
  {
    id: 'comb-7',
    name: 'Velvet Matte Longwear Lip Color',
    category: 'beauty',
    shopName: 'Glow & Aura Boutique',
    price: 399,
    originalPrice: 599,
    discount: '33% OFF',
    pack: 'Rose Petal',
    deliveryTime: '10–12 min',
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500&auto=format&fit=crop&q=80',
    trialSupported: false,
    rating: 4.7
  },
  {
    id: 'comb-8',
    name: 'Freshwater Pearl Drop Earrings',
    category: 'jewellery',
    shopName: 'The Jewel Atelier',
    price: 649,
    originalPrice: 999,
    discount: '35% OFF',
    pack: 'Sterling Silver',
    deliveryTime: '12–16 min',
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=500&auto=format&fit=crop&q=80',
    trialSupported: false,
    rating: 4.9
  },
  {
    id: 'comb-9',
    name: 'Amber & Sandalwood Soy Candle',
    category: 'household',
    shopName: 'Artisan Home Indiranagar',
    price: 499,
    originalPrice: 750,
    discount: '33% OFF',
    pack: '250g Jar',
    deliveryTime: '12–16 min',
    image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=500&auto=format&fit=crop&q=80',
    trialSupported: false,
    rating: 4.8
  },
  {
    id: 'comb-10',
    name: 'Minimalist Genuine Leather Wallet',
    category: 'accessories',
    shopName: 'The Leather Craft',
    price: 599,
    originalPrice: 899,
    discount: '33% OFF',
    pack: 'RFID Safe',
    deliveryTime: '10–14 min',
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80',
    trialSupported: false,
    rating: 4.8
  }
];

export default function NivvoHomeView({
  onSelectCategory,
  onSelectProduct,
  onNavigateToShops,
  onExploreFootwear
}) {
  const { cart, addToCart, updateCartQuantity, totalCartCount, cartTotal, navigateTo, showToast } = useNivvo();

  // Combined product section active filter
  const [selectedCombCategory, setSelectedCombCategory] = useState('all');

  // Modal State
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [selectedQuickSize, setSelectedQuickSize] = useState('UK 8');
  const [includeSecondSize, setIncludeSecondSize] = useState(true);

  const getItemQuantity = (productId) => {
    const cartItem = cart.find(i => i.productId === productId);
    return cartItem ? cartItem.quantity : 0;
  };

  const filteredCombinedProducts = useMemo(() => {
    if (selectedCombCategory === 'all') return COMBINED_PRODUCTS;
    return COMBINED_PRODUCTS.filter(p => p.category === selectedCombCategory);
  }, [selectedCombCategory]);

  const handleOpenQuickView = (prod, e) => {
    if (e) e.stopPropagation();
    playClickSound();
    setQuickViewProduct(prod);
    setSelectedQuickSize(prod.sizes ? prod.sizes[1] || prod.sizes[0] : 'UK 8');
  };

  const handleQuickAdd = () => {
    if (!quickViewProduct) return;
    playAddSound();
    addToCart(quickViewProduct, selectedQuickSize);
    showToast(`Added ${quickViewProduct.name} (${selectedQuickSize}) to bag`);
    if (includeSecondSize && quickViewProduct.sizes && quickViewProduct.sizes.length > 1) {
      const secondSize = quickViewProduct.sizes.find(s => s !== selectedQuickSize) || 'UK 9';
      setTimeout(() => {
        addToCart(quickViewProduct, `${secondSize} (Trial Pair)`);
      }, 150);
    }
    setQuickViewProduct(null);
  };

  const handleDirectAdd = (prod, e) => {
    if (e) e.stopPropagation();
    if (prod.trialSupported) {
      handleOpenQuickView(prod, e);
    } else {
      playAddSound();
      addToCart(prod, prod.pack || 'Standard');
      showToast(`Added ${prod.name} to bag`);
    }
  };

  return (
    <div className="nivvo-home-screen" style={{ paddingBottom: totalCartCount > 0 ? '110px' : '40px', backgroundColor: '#FFFFFF' }}>
      
      {/* ─── 1. Restored Signature Delivery Status Beacon Bar (Original Forest Green) ─── */}
      <div style={{
        backgroundColor: '#24452D',
        color: '#FFFFFF',
        padding: '10px 18px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '12px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="nivvo-pulse-dot" style={{ backgroundColor: '#B7F34A' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ fontWeight: 800, letterSpacing: '0.04em', fontSize: '11px', textTransform: 'uppercase', color: '#FFFFFF' }}>
              12–18 Min Delivery
            </span>
            <span style={{ opacity: 0.6, color: '#FFFFFF' }}>·</span>
            <span style={{ color: '#C5D7C0', fontSize: '11px', fontWeight: 600 }}>Indiranagar</span>
          </div>
        </div>
        <div 
          onClick={() => { playClickSound(); navigateTo('shops'); }}
          style={{ color: '#B7F34A', fontWeight: 700, fontSize: '11.5px', display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}
        >
          <Store size={13} strokeWidth={2.4} color="#B7F34A" />
          <span>42 Verified Stores</span>
          <ChevronRight size={13} color="#B7F34A" />
        </div>
      </div>

      {/* ─── 2. SQUIRCLE CATEGORY RAIL (Matching Reference Image) ─── */}
      <div className="nivvo-blinkit-cat-rail">
        {HOME_CATEGORY_RAIL.map((cat) => (
          <div 
            key={cat.id} 
            className="nivvo-cat-rail-item"
            onClick={() => {
              playClickSound();
              if (onSelectCategory) {
                onSelectCategory(cat.id);
              } else {
                navigateTo('categories');
              }
            }}
          >
            <div className="nivvo-cat-rail-icon-box">
              <img src={cat.image} alt={cat.name} className="nivvo-cat-rail-img" />
              {cat.badge && (
                <span className="nivvo-cat-rail-badge">
                  {cat.badge.includes('m') && <Zap size={8} fill="#24452D" color="#24452D" strokeWidth={2.5} />}
                  {cat.badge}
                </span>
              )}
            </div>
            <span className="nivvo-cat-rail-label">{cat.name}</span>
          </div>
        ))}
      </div>

      {/* ─── QUICK PORTAL: GROCERY & FOOD DINING ─── */}
      <div style={{ padding: '8px 18px 4px 18px', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
        <div 
          onClick={() => { playClickSound(); navigateTo('grocery'); }}
          style={{
            cursor: 'pointer',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E7EAE3',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#EEF2E8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#24452D' }}>
                <Apple size={13} strokeWidth={2.4} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#24452D' }}>Grocery</span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#0C831F', fontWeight: 600, marginTop: '3px' }}>
              10m • Daily Mart
            </div>
          </div>
          <ChevronRight size={15} color="#73796F" />
        </div>

        <div 
          onClick={() => { playClickSound(); navigateTo('food'); }}
          style={{
            cursor: 'pointer',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E7EAE3',
            borderRadius: '14px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
            transition: 'all 0.15s ease'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '22px', height: '22px', borderRadius: '6px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#B45309' }}>
                <UtensilsCrossed size={13} strokeWidth={2.4} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: 800, color: '#20251F' }}>Food</span>
            </div>
            <div style={{ fontSize: '10.5px', color: '#B45309', fontWeight: 600, marginTop: '3px' }}>
              25m • Kitchens
            </div>
          </div>
          <ChevronRight size={15} color="#73796F" />
        </div>
      </div>

      {/* ─── 3. BESTSELLERS SHOWCASE ─── */}
      <section style={{ padding: '18px 18px 8px 18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#24452D', margin: 0, letterSpacing: '-0.02em' }}>
              Bestsellers
            </h2>
            <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', fontWeight: 500 }}>
              Top ordered essentials around you
            </div>
          </div>
          <button 
            onClick={() => {
              playClickSound();
              if (onSelectCategory) onSelectCategory('all');
              else navigateTo('categories');
            }}
            style={{ background: 'none', border: 'none', color: '#24452D', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span>See all</span>
            <ChevronRight size={14} strokeWidth={2.4} />
          </button>
        </div>

        {/* 3-Column Clean Visual Category Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
          {BESTSELLER_SHOWCASE.map((item) => (
            <div 
              key={item.id} 
              onClick={() => {
                playClickSound();
                if (onSelectCategory) onSelectCategory(item.category);
                else navigateTo('categories');
              }}
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7EAE3',
                borderRadius: '16px',
                padding: '10px 8px 12px 8px',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                boxShadow: '0 1px 4px rgba(0, 0, 0, 0.03)'
              }}
            >
              <div style={{
                width: '100%',
                aspectRatio: '1',
                borderRadius: '12px',
                backgroundColor: '#F7F8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <img 
                  src={item.image} 
                  alt={item.title}
                  loading="lazy"
                  style={{ width: '82%', height: '82%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/assets/figma/cat_footwear.png';
                  }}
                />
              </div>

              <div style={{ fontSize: '11.5px', fontWeight: 700, color: '#24452D', textAlign: 'center', lineHeight: 1.25 }}>
                {item.title}
              </div>
              <div style={{ fontSize: '9.5px', fontWeight: 600, color: '#73796F', marginTop: '2px' }}>
                {item.count}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 4. BEAUTY & PERSONAL CARE (Clean 4-Item Showcase) ─── */}
      <section style={{ padding: '16px 18px 8px 18px', borderTop: '1px solid #E7EAE3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#24452D', margin: 0, letterSpacing: '-0.02em' }}>
              Beauty & Personal Care
            </h2>
            <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', fontWeight: 500 }}>
              Serums, cosmetics & luxury fragrance
            </div>
          </div>
          <button 
            onClick={() => {
              playClickSound();
              if (onSelectCategory) onSelectCategory('beauty');
              else navigateTo('categories');
            }}
            style={{ background: 'none', border: 'none', color: '#24452D', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span>See all</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {BEAUTY_CATEGORIES.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                playClickSound();
                if (onSelectCategory) onSelectCategory(item.category);
                else navigateTo('categories');
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#F7F8F5',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                border: '1px solid #E7EAE3',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <img 
                  src={item.img} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                  loading="lazy"
                />
              </div>
              <span style={{
                marginTop: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#24452D',
                textAlign: 'center',
                lineHeight: 1.25
              }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 5. HOUSEHOLD ESSENTIALS (Clean 4-Item Showcase) ─── */}
      <section style={{ padding: '16px 18px 8px 18px', borderTop: '1px solid #E7EAE3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#24452D', margin: 0, letterSpacing: '-0.02em' }}>
              Household Essentials
            </h2>
            <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', fontWeight: 500 }}>
              Diffusers, candles & organizers
            </div>
          </div>
          <button 
            onClick={() => {
              playClickSound();
              if (onSelectCategory) onSelectCategory('household');
              else navigateTo('categories');
            }}
            style={{ background: 'none', border: 'none', color: '#24452D', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span>See all</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {HOUSEHOLD_CATEGORIES.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                playClickSound();
                if (onSelectCategory) onSelectCategory(item.category);
                else navigateTo('categories');
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#F7F8F5',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                border: '1px solid #E7EAE3',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <img 
                  src={item.img} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                  loading="lazy"
                />
              </div>
              <span style={{
                marginTop: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#24452D',
                textAlign: 'center',
                lineHeight: 1.25
              }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 6. CLOTHING, JEWELLERY & ACCESSORIES (Clean 4-Item Showcase) ─── */}
      <section style={{ padding: '16px 18px 8px 18px', borderTop: '1px solid #E7EAE3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#24452D', margin: 0, letterSpacing: '-0.02em' }}>
              Fashion & Accessories
            </h2>
            <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', fontWeight: 500 }}>
              Streetwear, gold chains & fine leather
            </div>
          </div>
          <button 
            onClick={() => {
              playClickSound();
              if (onSelectCategory) onSelectCategory('clothing');
              else navigateTo('categories');
            }}
            style={{ background: 'none', border: 'none', color: '#24452D', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span>See all</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {FASHION_JEWEL_CATEGORIES.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                playClickSound();
                if (onSelectCategory) onSelectCategory(item.category);
                else navigateTo('categories');
              }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}
            >
              <div style={{
                width: '100%',
                aspectRatio: '1',
                backgroundColor: '#F7F8F5',
                borderRadius: '16px',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '6px',
                border: '1px solid #E7EAE3',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
              }}>
                <img 
                  src={item.img} 
                  alt={item.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
                  loading="lazy"
                />
              </div>
              <span style={{
                marginTop: '6px',
                fontSize: '11px',
                fontWeight: 600,
                color: '#24452D',
                textAlign: 'center',
                lineHeight: 1.25
              }}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 7. COMBINED PRODUCT SECTION (Trending Products) ─── */}
      <section style={{ padding: '20px 18px 12px 18px', borderTop: '1px solid #E7EAE3', backgroundColor: '#FFFFFF' }}>
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#24452D', margin: 0, letterSpacing: '-0.02em' }}>
            Trending Across Categories
          </h2>
          <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', fontWeight: 500 }}>
            Popular quick delivery items across all categories
          </div>
        </div>

        {/* Clean Category Filter Chips */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '12px',
          scrollbarWidth: 'none'
        }}>
          {[
            { id: 'all', label: 'All Picks' },
            { id: 'footwear', label: 'Footwear' },
            { id: 'clothing', label: 'Clothing' },
            { id: 'beauty', label: 'Beauty' },
            { id: 'jewellery', label: 'Jewellery' },
            { id: 'accessories', label: 'Accessories' },
            { id: 'household', label: 'Household' }
          ].map(tab => {
            const isActive = selectedCombCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound();
                  setSelectedCombCategory(tab.id);
                }}
                style={{
                  border: isActive ? '1px solid #24452D' : '1px solid #E7EAE3',
                  backgroundColor: isActive ? '#24452D' : '#F7F8F5',
                  color: isActive ? '#FFFFFF' : '#24452D',
                  fontSize: '11.5px',
                  fontWeight: isActive ? 800 : 600,
                  padding: '6px 14px',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 2-Column Clean Product Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
          {filteredCombinedProducts.map((prod) => {
            const qty = getItemQuantity(prod.id);
            const cartItem = cart.find(i => i.productId === prod.id);

            return (
              <div
                key={prod.id}
                onClick={() => {
                  playClickSound();
                  if (onSelectProduct) onSelectProduct(prod);
                  else navigateTo('categories');
                }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7EAE3',
                  borderRadius: '16px',
                  padding: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  cursor: 'pointer',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                  position: 'relative'
                }}
              >
                {/* Product Thumbnail */}
                <div style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: '12px',
                  backgroundColor: '#F7F8F5',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '8px'
                }}>
                  <img 
                    src={prod.image} 
                    alt={prod.name}
                    loading="lazy"
                    style={{ width: '85%', height: '85%', objectFit: 'contain' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/figma/product_court_sneaker.png';
                    }}
                  />

                  {/* Delivery ETA */}
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    left: '6px',
                    backgroundColor: '#24452D',
                    color: '#FFFFFF',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '9px',
                    fontWeight: 800
                  }}>
                    {prod.deliveryTime}
                  </div>

                  {/* Discount Badge */}
                  {prod.discount && (
                    <div style={{
                      position: 'absolute',
                      bottom: '6px',
                      left: '6px',
                      backgroundColor: '#B7F34A',
                      color: '#24452D',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontSize: '8.5px',
                      fontWeight: 800
                    }}>
                      {prod.discount}
                    </div>
                  )}

                  {/* Trial Tag */}
                  {prod.trialSupported && (
                    <div style={{
                      position: 'absolute',
                      top: '6px',
                      right: '6px',
                      backgroundColor: '#EEF4EC',
                      color: '#24452D',
                      padding: '2px 5px',
                      borderRadius: '4px',
                      fontSize: '8.5px',
                      fontWeight: 800,
                      border: '1px solid #E7EAE3'
                    }}>
                      TRIAL
                    </div>
                  )}
                </div>

                {/* Shop Name */}
                <div style={{ fontSize: '10px', color: '#73796F', fontWeight: 600, marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {prod.shopName}
                </div>

                {/* Title */}
                <div style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: '#24452D',
                  lineHeight: 1.3,
                  marginBottom: '4px',
                  minHeight: '30px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {prod.name}
                </div>

                {/* Price & Add Button Row */}
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '4px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 800, color: '#24452D' }}>
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      {prod.originalPrice && (
                        <span style={{ fontSize: '10px', color: '#73796F', textDecoration: 'line-through' }}>
                          ₹{prod.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Add Button or Stepper */}
                  {qty === 0 ? (
                    <button
                      onClick={(e) => handleDirectAdd(prod, e)}
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1.5px solid #24452D',
                        color: '#24452D',
                        borderRadius: '8px',
                        padding: '4px 12px',
                        fontSize: '11px',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                    >
                      ADD
                    </button>
                  ) : (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      style={{
                        backgroundColor: '#24452D',
                        borderRadius: '8px',
                        padding: '3px 7px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 800
                      }}
                    >
                      <button
                        onClick={() => updateCartQuantity(cartItem?.id, -1)}
                        style={{ background: 'none', border: 'none', color: '#FFFFFF', cursor: 'pointer', padding: 0 }}
                        aria-label="Decrease"
                      >
                        <Minus size={11} strokeWidth={2.6} />
                      </button>
                      <span>{qty}</span>
                      <button
                        onClick={() => updateCartQuantity(cartItem?.id, 1)}
                        style={{ background: 'none', border: 'none', color: '#B7F34A', cursor: 'pointer', padding: 0 }}
                        aria-label="Increase"
                      >
                        <Plus size={11} strokeWidth={2.6} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── 8. STORES IN THE SPOTLIGHT (Curated Boutique Cards) ─── */}
      <section style={{ padding: '16px 18px 8px 18px', borderTop: '1px solid #E7EAE3' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div>
            <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#24452D', margin: 0, letterSpacing: '-0.02em' }}>
              Stores in the Spotlight
            </h2>
            <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', fontWeight: 500 }}>
              Curated neighbourhood boutiques & studios
            </div>
          </div>
          <button 
            onClick={() => { playClickSound(); navigateTo('shops'); }}
            style={{ background: 'none', border: 'none', color: '#24452D', fontSize: '12.5px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px' }}
          >
            <span>All Stores</span>
            <ChevronRight size={14} />
          </button>
        </div>

        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '8px',
          scrollbarWidth: 'none'
        }}>
          {SPOTLIGHT_STORES.map((st) => (
            <div
              key={st.id}
              onClick={() => {
                playClickSound();
                if (st.id === 'sole-street') navigateTo('shop-detail');
                else navigateTo('shops');
              }}
              style={{
                flex: '0 0 170px',
                backgroundColor: '#FFFFFF',
                border: '1px solid #E7EAE3',
                borderRadius: '16px',
                padding: '10px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
              }}
            >
              <div>
                <div style={{
                  width: '100%',
                  height: '74px',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  backgroundColor: '#F7F8F5',
                  marginBottom: '8px'
                }}>
                  <img 
                    src={st.image} 
                    alt={st.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/assets/figma/shop_sole_street.png';
                    }}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontSize: '9.5px', fontWeight: 800, color: '#24452D', backgroundColor: '#EEF4EC', padding: '2px 6px', borderRadius: '4px' }}>
                    {st.eta}
                  </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontWeight: 800, color: '#24452D' }}>
                    <Star size={11} fill="#F59E0B" color="#F59E0B" />
                    <span>{st.rating}</span>
                  </div>
                </div>
                <div style={{ fontSize: '12.5px', fontWeight: 800, color: '#24452D', lineHeight: 1.3, marginBottom: '2px' }}>
                  {st.name}
                </div>
                <div style={{ fontSize: '10.5px', color: '#73796F', lineHeight: 1.3 }}>
                  {st.sub}
                </div>
              </div>

              <div style={{ fontSize: '10px', fontWeight: 700, color: '#73796F', marginTop: '10px' }}>
                {st.distance} away
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 9. PICKS FOR YOUR LIFESTYLE (Shop by Aesthetic) ─── */}
      <section style={{ padding: '16px 18px 8px 18px', borderTop: '1px solid #E7EAE3' }}>
        <div style={{ marginBottom: '12px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#24452D', margin: 0, letterSpacing: '-0.02em' }}>
            Pick Your Lifestyle
          </h2>
          <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', fontWeight: 500 }}>
            Shop curated collections tailored to your aesthetic
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
          {LIFESTYLE_PICKS.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                playClickSound();
                if (onSelectCategory) onSelectCategory(item.category);
                else navigateTo('categories');
              }}
              style={{
                backgroundColor: '#F7F8F5',
                border: '1px solid #E7EAE3',
                borderRadius: '12px',
                padding: '12px 8px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#24452D' }}>
                {item.name}
              </div>
              <div style={{ fontSize: '9.5px', fontWeight: 600, color: '#73796F', marginTop: '2px' }}>
                {item.sub}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── 10. UNIFIED MINIMALIST TRUST STRIP ─── */}
      <section style={{ padding: '16px 18px 24px 18px', borderTop: '1px solid #E7EAE3' }}>
        <div style={{
          backgroundColor: '#F7F8F5',
          border: '1px solid #E7EAE3',
          borderRadius: '16px',
          padding: '16px 18px',
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '14px 16px'
        }}>
          <div 
            onClick={() => { playTrialSound(); setShowTrialModal(true); }}
            style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EEF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Sparkles size={15} color="#24452D" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#24452D' }}>10-Min Doorstep Trial</div>
              <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', lineHeight: 1.35 }}>Try 2 sizes at home before you pay</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EEF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Clock size={15} color="#24452D" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#24452D' }}>12–18 Min Delivery</div>
              <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', lineHeight: 1.35 }}>Fast dispatch from local Indiranagar stores</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EEF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <RotateCcw size={15} color="#24452D" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#24452D' }}>Instant Return</div>
              <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', lineHeight: 1.35 }}>Hand unneeded pair right back on spot</div>
            </div>
          </div>

          <div 
            onClick={() => { playClickSound(); navigateTo('shops'); }}
            style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', cursor: 'pointer' }}
          >
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', backgroundColor: '#EEF4EC', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={15} color="#24452D" />
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 800, color: '#24452D' }}>42 Verified Boutiques</div>
              <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px', lineHeight: 1.35 }}>100% verified local storefronts</div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 11. Sticky Floating Cart Bar ─── */}
      {totalCartCount > 0 && (
        <div 
          className="nivvo-floating-cart-bar"
          onClick={() => {
            playClickSound();
            navigateTo('bag');
          }}
          style={{
            position: 'fixed',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: 'calc(100% - 32px)',
            maxWidth: '430px',
            backgroundColor: '#24452D',
            color: '#FFFFFF',
            borderRadius: '16px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 8px 24px rgba(36, 69, 45, 0.35)',
            zIndex: 1000,
            cursor: 'pointer'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#B7F34A', color: '#24452D', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ShoppingBag size={16} strokeWidth={2.4} />
            </div>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFFFFF' }}>
                {totalCartCount} item{totalCartCount > 1 ? 's' : ''} in Bag
              </div>
              <div style={{ fontSize: '11px', color: '#C5D7C0' }}>
                Total: ₹{cartTotal.toLocaleString('en-IN')}
              </div>
            </div>
          </div>

          <div style={{
            backgroundColor: '#B7F34A',
            color: '#24452D',
            fontWeight: 800,
            fontSize: '12px',
            padding: '7px 14px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}>
            <span>View Bag</span>
            <ArrowRight size={14} />
          </div>
        </div>
      )}

      {/* ─── 12. Quick View Size Selector Modal ─── */}
      {quickViewProduct && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'center',
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setQuickViewProduct(null)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '430px',
              borderRadius: '24px 24px 0 0',
              padding: '24px',
              boxShadow: '0 -8px 30px rgba(0,0,0,0.15)',
              animation: 'slideUp 0.25s ease'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '14px' }}>
                <img 
                  src={quickViewProduct.image} 
                  alt={quickViewProduct.name}
                  style={{ width: '64px', height: '64px', borderRadius: '12px', objectFit: 'cover' }}
                />
                <div>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#73796F', textTransform: 'uppercase' }}>
                    {quickViewProduct.shopName}
                  </span>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#24452D', margin: '2px 0 4px 0' }}>
                    {quickViewProduct.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 900, color: '#24452D' }}>
                      ₹{quickViewProduct.price.toLocaleString('en-IN')}
                    </span>
                    {quickViewProduct.originalPrice && (
                      <span style={{ fontSize: '11.5px', color: '#73796F', textDecoration: 'line-through' }}>
                        ₹{quickViewProduct.originalPrice}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setQuickViewProduct(null)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer', padding: '4px' }}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            {/* Size Selector */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                <span style={{ color: '#24452D' }}>Select Size: {selectedQuickSize}</span>
                <span style={{ color: '#238636' }}>In stock at shop</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(quickViewProduct.sizes || ['UK 7', 'UK 8', 'UK 9', 'UK 10']).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => { playClickSound(); setSelectedQuickSize(sz); }}
                    style={{
                      border: selectedQuickSize === sz ? '2px solid #24452D' : '1px solid #E7EAE3',
                      backgroundColor: selectedQuickSize === sz ? '#24452D' : '#FFFFFF',
                      color: selectedQuickSize === sz ? '#FFFFFF' : '#24452D',
                      padding: '8px 14px',
                      borderRadius: '10px',
                      fontSize: '12.5px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* 10-Minute Doorstep Trial inclusion toggle */}
            <div style={{
              backgroundColor: '#EEF4EC',
              border: '1px solid #E7EAE3',
              borderRadius: '12px',
              padding: '12px 14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px'
            }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#24452D' }}>
                  Include 2nd Size for 10-Min Trial
                </div>
                <div style={{ fontSize: '11px', color: '#73796F' }}>
                  Try both pairs at home. Zero return fee.
                </div>
              </div>
              <input 
                type="checkbox"
                checked={includeSecondSize}
                onChange={(e) => setIncludeSecondSize(e.target.checked)}
                style={{ width: '18px', height: '18px', accentColor: '#24452D', cursor: 'pointer' }}
              />
            </div>

            <button
              onClick={handleQuickAdd}
              style={{
                width: '100%',
                backgroundColor: '#B7F34A',
                color: '#24452D',
                border: 'none',
                borderRadius: '12px',
                padding: '14px',
                fontSize: '14px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 14px rgba(183, 243, 74, 0.35)',
                transition: 'all 0.15s ease'
              }}
            >
              <span>Add to Bag</span>
              <ArrowRight size={16} color="#24452D" />
            </button>
          </div>
        </div>
      )}

      {/* ─── 13. How Trial Works Modal ─── */}
      {showTrialModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setShowTrialModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              width: '100%',
              maxWidth: '380px',
              borderRadius: '20px',
              padding: '24px',
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="#24452D" />
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#24452D', margin: 0 }}>
                  10-Minute Doorstep Trial
                </h3>
              </div>
              <button 
                onClick={() => setShowTrialModal(false)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EEF4EC', color: '#24452D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>
                  1
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#24452D' }}>Select two sizes</div>
                  <div style={{ fontSize: '11.5px', color: '#73796F', lineHeight: 1.35 }}>Order two adjacent sizes (e.g. UK 8 & UK 9) for footwear or apparel.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EEF4EC', color: '#24452D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>
                  2
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#24452D' }}>10-Minute try-on</div>
                  <div style={{ fontSize: '11.5px', color: '#73796F', lineHeight: 1.35 }}>Your delivery partner arrives in 10–15 mins and waits while you test fit.</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#EEF4EC', color: '#24452D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '11px', flexShrink: 0 }}>
                  3
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#24452D' }}>Instant return, zero forms</div>
                  <div style={{ fontSize: '11.5px', color: '#73796F', lineHeight: 1.35 }}>Keep what fits. Hand the unneeded pair right back to the courier.</div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowTrialModal(false)}
              style={{
                width: '100%',
                backgroundColor: '#B7F34A',
                color: '#24452D',
                border: 'none',
                borderRadius: '12px',
                padding: '13px',
                fontSize: '13.5px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(183, 243, 74, 0.3)',
                transition: 'all 0.15s ease'
              }}
            >
              Got It
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
