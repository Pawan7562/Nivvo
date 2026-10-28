import React, { useState, useMemo } from "react";
import { useNivvo } from "../../context/NivvoAppContext";
import {
  Search, ShoppingBag, Plus, Minus, ChevronRight,
  Clock, X, ArrowLeft, ShieldCheck, RotateCcw,
  Sparkles, Check, Info, Layers
} from "lucide-react";
import { playClickSound, playAddSound } from "../../utils/audioEffects";
import ShoppingModeSwitcher from "../../components/ShoppingModeSwitcher";

const GROCERY_CATEGORIES = [
  { id: "all", name: "All Items", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=240&auto=format&fit=crop&q=80", count: "48 items" },
  { id: "fruits", name: "Fresh Fruits", image: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=240&auto=format&fit=crop&q=80", count: "12 items" },
  { id: "vegetables", name: "Vegetables", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=240&auto=format&fit=crop&q=80", count: "14 items" },
  { id: "dairy", name: "Dairy & Eggs", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=240&auto=format&fit=crop&q=80", count: "9 items" },
  { id: "staples", name: "Staples & Grains", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=240&auto=format&fit=crop&q=80", count: "11 items" },
  { id: "bakery", name: "Artisan Bakery", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=240&auto=format&fit=crop&q=80", count: "8 items" },
  { id: "beverages", name: "Juices & Drinks", image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=240&auto=format&fit=crop&q=80", count: "7 items" },
  { id: "snacks", name: "Snacks & Nuts", image: "https://images.unsplash.com/photo-1508061252445-535e527a45eb?w=240&auto=format&fit=crop&q=80", count: "10 items" }
];

const SEARCH_SUGGESTIONS = ["Alphonso Mangoes", "Milk", "Eggs", "Atta", "Artisan Bread", "Tomatoes"];

const GROCERY_PRODUCTS = [
  {
    id: "gp-1",
    name: "Alphonso Mangoes Handpicked",
    category: "fruits",
    weight: "1 kg (4–5 pcs)",
    price: 199,
    originalPrice: 250,
    discount: "20% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1553279768-865429fa0078?w=500&auto=format&fit=crop&q=80",
    isTopDeal: true,
    shelfLife: "3–4 days at room temp",
    origin: "Ratnagiri, Maharashtra",
    nutrition: "Calories: 60 kcal • Vitamin C: 60%",
    description: "Naturally ripened GI-tagged Ratnagiri Alphonso mangoes. Rich golden aroma, fiber-less creamy pulp with sweet tropical notes."
  },
  {
    id: "gp-2",
    name: "Organic Baby Spinach",
    category: "vegetables",
    weight: "250 g bunch",
    price: 35,
    originalPrice: 45,
    discount: "22% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=500&auto=format&fit=crop&q=80",
    isTopDeal: true,
    shelfLife: "2 days refrigerated",
    origin: "Hydroponic Farm, Ooty",
    nutrition: "Calories: 23 kcal • Iron: 15% DV",
    description: "Crisp, tender baby spinach leaves harvested at first dawn. Hydroponically grown without chemical pesticides."
  },
  {
    id: "gp-3",
    name: "Farm Fresh Brown Eggs",
    category: "dairy",
    weight: "6 pcs pack",
    price: 75,
    originalPrice: 90,
    discount: "16% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=500&auto=format&fit=crop&q=80",
    isTopDeal: true,
    shelfLife: "14 days refrigerated",
    origin: "Free-range Poultry Farm",
    nutrition: "Protein: 6g per egg • Vitamin D3 rich",
    description: "Free-range, grain-fed brown eggs with vibrant golden yolks. Cleaned and sanitized under strict quality standards."
  },
  {
    id: "gp-4",
    name: "Amul Gold Full Cream Milk",
    category: "dairy",
    weight: "1 L pouch",
    price: 66,
    originalPrice: 72,
    discount: "8% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500&auto=format&fit=crop&q=80",
    isTopDeal: false,
    shelfLife: "Use within 48h of opening",
    origin: "Anand, Gujarat",
    nutrition: "Fat: 6.0% • SNF: 9.0%",
    description: "Pasteurized homogenized full-cream cow and buffalo milk with natural richness, ideal for chai, coffee, and desserts."
  },
  {
    id: "gp-5",
    name: "Fresh Hybrid Red Tomatoes",
    category: "vegetables",
    weight: "1 kg",
    price: 38,
    originalPrice: 50,
    discount: "24% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469?w=500&auto=format&fit=crop&q=80",
    isTopDeal: false,
    shelfLife: "4–5 days cool storage",
    origin: "Nashik Farms",
    nutrition: "Lycopene rich • Vitamin A & C",
    description: "Firm, glossy red hybrid tomatoes with balanced sweetness and acidity. Ideal for gravies, salads, and everyday cooking."
  },
  {
    id: "gp-6",
    name: "Royal Gala Apples",
    category: "fruits",
    weight: "4 pcs (600 g)",
    price: 129,
    originalPrice: 160,
    discount: "19% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=500&auto=format&fit=crop&q=80",
    isTopDeal: false,
    shelfLife: "7 days refrigerated",
    origin: "Kinnaur, Himachal Pradesh",
    nutrition: "Dietary Fiber: 4.4g • Antioxidants",
    description: "Crisp and juicy high-altitude apples with fine aromatic sweetness and thin skin."
  },
  {
    id: "gp-7",
    name: "India Gate Basmati Rice Feast",
    category: "staples",
    weight: "1 kg pack",
    price: 115,
    originalPrice: 145,
    discount: "20% OFF",
    eta: "12 mins",
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&auto=format&fit=crop&q=80",
    isTopDeal: true,
    shelfLife: "24 months shelf life",
    origin: "Terai Foothills, Punjab",
    nutrition: "Non-sticky aged grains",
    description: "Aged 2 years for distinct pearl-white slender grains that elongate up to twice their size when cooked."
  },
  {
    id: "gp-8",
    name: "Aashirvaad Shudh Chakki Atta",
    category: "staples",
    weight: "5 kg bag",
    price: 235,
    originalPrice: 275,
    discount: "14% OFF",
    eta: "15 mins",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    isTopDeal: false,
    shelfLife: "6 months from packaging",
    origin: "Sehore Wheat, Madhya Pradesh",
    nutrition: "100% Whole Wheat • 0% Maida",
    description: "Traditional stone chakki ground from heavy golden grains, absorbing optimum water for fluffy rotis that stay soft longer."
  },
  {
    id: "gp-9",
    name: "Multigrain Artisanal Sourdough Bread",
    category: "bakery",
    weight: "400 g loaf",
    price: 48,
    originalPrice: 55,
    discount: "12% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80",
    isTopDeal: false,
    shelfLife: "3 days fresh",
    origin: "Local Artisan Bakehouse",
    nutrition: "Flaxseed, Oats, Sunflower Seeds",
    description: "Slow-fermented artisan loaf baked at dawn with seven roasted seeds and natural wild sourdough starter."
  },
  {
    id: "gp-10",
    name: "French Butter Croissant Duo",
    category: "bakery",
    weight: "2 pcs pack",
    price: 95,
    originalPrice: 120,
    discount: "20% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80",
    isTopDeal: true,
    shelfLife: "Best enjoyed warm within 24h",
    origin: "French Patisserie Studio",
    nutrition: "Made with 100% Pure Butter",
    description: "Laminated with 27 delicate layers of golden butter for an airy honeycomb crumb and paper-thin flaky crust."
  },
  {
    id: "gp-11",
    name: "Valencia Cold-Pressed Orange Juice",
    category: "beverages",
    weight: "1 L carton",
    price: 110,
    originalPrice: 135,
    discount: "18% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=500&auto=format&fit=crop&q=80",
    isTopDeal: false,
    shelfLife: "Keep refrigerated",
    origin: "Fresh Orchard Press",
    nutrition: "100% Juice • No Added Sugar",
    description: "HPP cold-pressed pure Valencia oranges with gentle pulp. Not from concentrate, preserving essential vitamins."
  },
  {
    id: "gp-12",
    name: "Roasted Sea Salt California Almonds",
    category: "snacks",
    weight: "200 g pouch",
    price: 185,
    originalPrice: 230,
    discount: "19% OFF",
    eta: "10 mins",
    image: "https://images.unsplash.com/photo-1508061252445-535e527a45eb?w=500&auto=format&fit=crop&q=80",
    isTopDeal: false,
    shelfLife: "9 months in airtight pack",
    origin: "California Valley",
    nutrition: "High Vitamin E & Protein",
    description: "Slow dry-roasted nonpareil almonds lightly seasoned with mineral-rich pink Himalayan crystal salt."
  }
];

const CURATED_BUNDLES = [
  {
    id: "bnd-1",
    name: "Morning Breakfast Kit",
    sub: "Amul Full Cream Milk + Farm Brown Eggs + Multigrain Bread",
    originalPrice: 217,
    bundlePrice: 179,
    savings: "Save ₹38",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&auto=format&fit=crop&q=80",
    productIds: ["gp-4", "gp-3", "gp-9"]
  },
  {
    id: "bnd-2",
    name: "Daily Fruit & Veggie Basket",
    sub: "Alphonso Mangoes (1kg) + Red Hybrid Tomatoes (1kg)",
    originalPrice: 249,
    bundlePrice: 215,
    savings: "Save ₹34",
    image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=300&auto=format&fit=crop&q=80",
    productIds: ["gp-1", "gp-5"]
  }
];

export default function GroceryView({ onBack, onNavigateMode }) {
  const { cart, addToCart, updateCartQuantity, totalCartCount, showToast, navigateTo } = useNivvo();
  const [activeCategory, setActiveCategory] = useState("all");
  const [filterTag, setFilterTag] = useState("all"); // "all" | "under99" | "topdeals"
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProductModal, setSelectedProductModal] = useState(null);

  const getItemQuantity = (productId) => {
    const item = cart.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }, [cart]);

  const filteredProducts = useMemo(() => {
    let prods = GROCERY_PRODUCTS;
    if (activeCategory !== "all") {
      prods = prods.filter((p) => p.category === activeCategory);
    }
    if (filterTag === "under99") {
      prods = prods.filter((p) => p.price <= 99);
    } else if (filterTag === "topdeals") {
      prods = prods.filter((p) => p.isTopDeal);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      prods = prods.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.weight.toLowerCase().includes(q)
      );
    }
    return prods;
  }, [activeCategory, filterTag, searchQuery]);

  const handleAdd = (prod) => {
    playAddSound();
    addToCart(
      {
        ...prod,
        productId: prod.id,
        shopName: "Nivvo Grocery Mart"
      },
      prod.weight
    );
    showToast(`Added ${prod.name} to bag`);
  };

  const handleAddBundle = (bundle) => {
    playAddSound();
    bundle.productIds.forEach((pid) => {
      const prod = GROCERY_PRODUCTS.find((p) => p.id === pid);
      if (prod) {
        addToCart(
          {
            ...prod,
            productId: prod.id,
            shopName: "Nivvo Grocery Mart"
          },
          prod.weight
        );
      }
    });
    showToast(`Added ${bundle.name} bundle to bag!`);
  };

  const handleIncrease = (prod) => {
    playClickSound();
    const cartItem = cart.find((i) => i.productId === prod.id);
    if (cartItem) {
      updateCartQuantity(cartItem.cartItemId, cartItem.quantity + 1);
    }
  };

  const handleDecrease = (prod) => {
    playClickSound();
    const cartItem = cart.find((i) => i.productId === prod.id);
    if (cartItem) {
      updateCartQuantity(cartItem.cartItemId, cartItem.quantity - 1);
    }
  };

  const freeDeliveryThreshold = 199;
  const progressPercent = Math.min(100, (cartSubtotal / freeDeliveryThreshold) * 100);

  return (
    <div
      style={{
        backgroundColor: "#F7F8F5",
        minHeight: "100%",
        paddingBottom: totalCartCount > 0 ? "110px" : "36px",
        fontFamily: "var(--nv-font, 'Inter', sans-serif)",
        color: "#20251F"
      }}
    >
      {/* 1. Header Bar */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E7EAE3",
          padding: "12px 16px 14px",
          position: "sticky",
          top: 0,
          zIndex: 40
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button
              type="button"
              onClick={onBack}
              aria-label="Back to store"
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                backgroundColor: "#F7F8F5",
                border: "1px solid #E7EAE3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#24452D",
                cursor: "pointer",
                padding: 0
              }}
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <div
                style={{
                  fontSize: "16px",
                  fontWeight: 800,
                  color: "#24452D",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span>Nivvo Fresh Mart</span>
                <span
                  style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    backgroundColor: "#0C831F",
                    display: "inline-block"
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "11px",
                  color: "#73796F",
                  marginTop: "2px"
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "3px",
                    backgroundColor: "#EEF2E8",
                    color: "#24452D",
                    padding: "1px 6px",
                    borderRadius: "4px",
                    fontWeight: 700
                  }}
                >
                  <Clock size={10} color="#24452D" />
                  <span>10–15 mins</span>
                </div>
                <span>• Local dark store pickup</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              navigateTo("bag");
            }}
            aria-label="Shopping Bag"
            style={{
              position: "relative",
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              backgroundColor: "#F7F8F5",
              border: "1px solid #E7EAE3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#24452D",
              cursor: "pointer",
              padding: 0
            }}
          >
            <ShoppingBag size={17} />
            {totalCartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-3px",
                  right: "-3px",
                  backgroundColor: "#24452D",
                  color: "#B7F34A",
                  fontSize: "10px",
                  fontWeight: 800,
                  borderRadius: "9999px",
                  minWidth: "18px",
                  height: "18px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 4px",
                  border: "2px solid #FFFFFF"
                }}
              >
                {totalCartCount}
              </span>
            )}
          </button>
        </div>

        {/* Minimal Search Bar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#F7F8F5",
            border: "1px solid #E7EAE3",
            borderRadius: "10px",
            padding: "9px 12px"
          }}
        >
          <Search size={15} color="#73796F" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search groceries, milk, vegetables, atta..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              backgroundColor: "transparent",
              fontSize: "13px",
              color: "#20251F",
              fontFamily: "inherit"
            }}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                color: "#73796F",
                display: "flex"
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Search Suggestions when typing */}
        {searchQuery.trim().length > 0 && (
          <div
            style={{
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              scrollbarWidth: "none",
              marginTop: "8px"
            }}
          >
            {SEARCH_SUGGESTIONS.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setSearchQuery(sug)}
                style={{
                  fontSize: "11px",
                  padding: "3px 9px",
                  borderRadius: "9999px",
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E7EAE3",
                  color: "#555E50",
                  cursor: "pointer",
                  whiteSpace: "nowrap"
                }}
              >
                {sug}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Unified Shopping Mode Switcher */}
      <ShoppingModeSwitcher
        activeMode="grocery"
        onModeChange={(mode) => {
          if (mode === "shop") {
            if (onNavigateMode) onNavigateMode("shop");
            else onBack();
          } else if (mode === "food") {
            if (onNavigateMode) onNavigateMode("food");
            else navigateTo("food");
          }
        }}
      />

      {/* 3. Dark Store Quality Strip */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "8px 16px",
          borderBottom: "1px solid #E7EAE3",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "11px",
          color: "#555E50"
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <ShieldCheck size={13} color="#0C831F" />
          <span>Cold-chain guaranteed</span>
        </div>
        <span>•</span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Clock size={13} color="#0C831F" />
          <span>10-min packaging</span>
        </div>
        <span>•</span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <RotateCcw size={13} color="#0C831F" />
          <span>Doorstep check</span>
        </div>
      </div>

      {/* 4. Photographic Category Squircle Rail */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "16px 16px 14px",
          borderBottom: "1px solid #E7EAE3"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px"
          }}
        >
          <span
            style={{
              fontSize: "12.5px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#24452D"
            }}
          >
            Explore Categories
          </span>
          <span style={{ fontSize: "11px", color: "#73796F" }}>8 categories</span>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            overflowX: "auto",
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            paddingBottom: "4px"
          }}
        >
          {GROCERY_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  playClickSound();
                  setActiveCategory(cat.id);
                }}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  background: "none",
                  border: "none",
                  padding: 0,
                  cursor: "pointer",
                  flexShrink: 0,
                  width: "68px"
                }}
              >
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "16px",
                    overflow: "hidden",
                    border: isSelected ? "2px solid #24452D" : "1px solid #E7EAE3",
                    backgroundColor: "#F7F8F5",
                    position: "relative",
                    transition: "all 0.18s ease",
                    boxShadow: isSelected ? "0 4px 10px rgba(36, 69, 45, 0.18)" : "0 1px 3px rgba(0,0,0,0.03)"
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    loading="lazy"
                  />
                  {isSelected && (
                    <div
                      style={{
                        position: "absolute",
                        bottom: "3px",
                        right: "3px",
                        width: "15px",
                        height: "15px",
                        borderRadius: "50%",
                        backgroundColor: "#24452D",
                        color: "#B7F34A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <Check size={9} strokeWidth={3} />
                    </div>
                  )}
                </div>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? "#24452D" : "#4A5245",
                    textAlign: "center",
                    lineHeight: 1.25
                  }}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. Breakfast & Daily Combos */}
      {activeCategory === "all" && !searchQuery && (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            padding: "16px",
            marginTop: "8px",
            borderTop: "1px solid #E7EAE3",
            borderBottom: "1px solid #E7EAE3"
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "12px"
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "15px",
                  fontWeight: 800,
                  color: "#24452D",
                  letterSpacing: "-0.01em"
                }}
              >
                Curated Value Bundles
              </div>
              <div style={{ fontSize: "11px", color: "#73796F", marginTop: "1px" }}>
                1-tap add breakfast & essentials combinations
              </div>
            </div>
            <span
              style={{
                fontSize: "10.5px",
                fontWeight: 700,
                color: "#0C831F",
                backgroundColor: "#F0FDF4",
                padding: "3px 8px",
                borderRadius: "6px",
                border: "1px solid #DCFCE7"
              }}
            >
              Extra 15% OFF
            </span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {CURATED_BUNDLES.map((bnd) => (
              <div
                key={bnd.id}
                style={{
                  backgroundColor: "#F7F8F5",
                  border: "1px solid #E7EAE3",
                  borderRadius: "12px",
                  padding: "12px 14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: 0 }}>
                  <img
                    src={bnd.image}
                    alt={bnd.name}
                    style={{
                      width: "48px",
                      height: "48px",
                      borderRadius: "10px",
                      objectFit: "cover",
                      border: "1px solid #E7EAE3",
                      flexShrink: 0
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#20251F",
                        lineHeight: 1.2
                      }}
                    >
                      {bnd.name}
                    </div>
                    <div
                      style={{
                        fontSize: "10.5px",
                        color: "#64748B",
                        lineHeight: 1.3,
                        marginTop: "2px",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                      }}
                    >
                      {bnd.sub}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "4px" }}>
                      <span style={{ fontSize: "13.5px", fontWeight: 800, color: "#24452D" }}>
                        ₹{bnd.bundlePrice}
                      </span>
                      <span style={{ fontSize: "11px", color: "#94A3B8", textDecoration: "line-through" }}>
                        ₹{bnd.originalPrice}
                      </span>
                      <span style={{ fontSize: "10px", fontWeight: 700, color: "#0C831F" }}>
                        {bnd.savings}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddBundle(bnd)}
                  style={{
                    backgroundColor: "#24452D",
                    color: "#B7F34A",
                    border: "none",
                    borderRadius: "8px",
                    padding: "7px 12px",
                    fontSize: "11.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }}
                >
                  + Add Kit
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Filter Chips & Sort Controls */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "10px 16px",
          marginTop: "8px",
          borderTop: "1px solid #E7EAE3",
          borderBottom: "1px solid #E7EAE3",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          scrollbarWidth: "none"
        }}
      >
        {[
          { id: "all", label: "All Items" },
          { id: "under99", label: "Under ₹99" },
          { id: "topdeals", label: "Top Savings" }
        ].map((tag) => {
          const isActive = filterTag === tag.id;
          return (
            <button
              key={tag.id}
              type="button"
              onClick={() => {
                playClickSound();
                setFilterTag(tag.id);
              }}
              style={{
                padding: "5px 12px",
                borderRadius: "9999px",
                border: isActive ? "1px solid #24452D" : "1px solid #E7EAE3",
                backgroundColor: isActive ? "#24452D" : "#F7F8F5",
                color: isActive ? "#FFFFFF" : "#555E50",
                fontSize: "11.5px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap"
              }}
            >
              {tag.label}
            </button>
          );
        })}
      </div>

      {/* 7. Main Product Catalog Grid */}
      <div style={{ backgroundColor: "#FFFFFF", padding: "16px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "14px"
          }}
        >
          <div>
            <div
              style={{
                fontSize: "15px",
                fontWeight: 800,
                color: "#24452D",
                letterSpacing: "-0.01em"
              }}
            >
              {activeCategory === "all"
                ? "Daily Mart Catalog"
                : GROCERY_CATEGORIES.find((c) => c.id === activeCategory)?.name}
            </div>
            <div style={{ fontSize: "11px", color: "#73796F", marginTop: "1px" }}>
              {filteredProducts.length} items ready to pack
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "11px",
              fontWeight: 600,
              color: "#24452D",
              backgroundColor: "#EEF2E8",
              borderRadius: "6px",
              padding: "3px 8px"
            }}
          >
            <Clock size={11} color="#24452D" />
            <span>ETA: 10 mins</span>
          </div>
        </div>

        {/* 2-Column Clean Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: "12px"
          }}
        >
          {filteredProducts.map((prod) => {
            const qty = getItemQuantity(prod.id);
            return (
              <div
                key={prod.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E7EAE3",
                  borderRadius: "14px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                  transition: "all 0.15s ease"
                }}
              >
                {/* Packshot Image with click for details */}
                <div
                  onClick={() => {
                    playClickSound();
                    setSelectedProductModal(prod);
                  }}
                  style={{
                    position: "relative",
                    backgroundColor: "#F7F8F5",
                    aspectRatio: "1/1",
                    overflow: "hidden",
                    cursor: "pointer"
                  }}
                >
                  <img
                    src={prod.image}
                    alt={prod.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                    loading="lazy"
                  />
                  {prod.discount && (
                    <div
                      style={{
                        position: "absolute",
                        top: "6px",
                        left: "6px",
                        backgroundColor: "#24452D",
                        color: "#FFFFFF",
                        fontSize: "9px",
                        fontWeight: 700,
                        padding: "2px 6px",
                        borderRadius: "4px"
                      }}
                    >
                      {prod.discount}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      playClickSound();
                      setSelectedProductModal(prod);
                    }}
                    aria-label="View product details"
                    style={{
                      position: "absolute",
                      top: "6px",
                      right: "6px",
                      width: "22px",
                      height: "22px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(255, 255, 255, 0.88)",
                      border: "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#73796F",
                      cursor: "pointer"
                    }}
                  >
                    <Info size={12} />
                  </button>

                  <div
                    style={{
                      position: "absolute",
                      bottom: "6px",
                      left: "6px",
                      backgroundColor: "rgba(255, 255, 255, 0.92)",
                      color: "#24452D",
                      fontSize: "9px",
                      fontWeight: 700,
                      padding: "2px 6px",
                      borderRadius: "4px"
                    }}
                  >
                    {prod.eta}
                  </div>
                </div>

                {/* Details */}
                <div
                  style={{
                    padding: "10px",
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    justifyContent: "space-between"
                  }}
                >
                  <div
                    onClick={() => {
                      playClickSound();
                      setSelectedProductModal(prod);
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      style={{
                        fontSize: "12.5px",
                        fontWeight: 600,
                        color: "#20251F",
                        lineHeight: 1.3,
                        minHeight: "33px"
                      }}
                    >
                      {prod.name}
                    </div>
                    <div
                      style={{
                        fontSize: "10.5px",
                        color: "#73796F",
                        marginTop: "2px"
                      }}
                    >
                      {prod.weight}
                    </div>
                  </div>

                  {/* Price & Add Stepper */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "10px"
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 800,
                          color: "#24452D"
                        }}
                      >
                        ₹{prod.price}
                      </div>
                      {prod.originalPrice > prod.price && (
                        <div
                          style={{
                            fontSize: "10.5px",
                            color: "#94A3B8",
                            textDecoration: "line-through"
                          }}
                        >
                          ₹{prod.originalPrice}
                        </div>
                      )}
                    </div>

                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleAdd(prod)}
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#24452D",
                          border: "1.5px solid #24452D",
                          borderRadius: "8px",
                          padding: "6px 14px",
                          fontSize: "11.5px",
                          fontWeight: 700,
                          cursor: "pointer",
                          letterSpacing: "0.02em"
                        }}
                      >
                        ADD
                      </button>
                    ) : (
                      <div
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          backgroundColor: "#24452D",
                          borderRadius: "8px",
                          overflow: "hidden"
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleDecrease(prod)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#B7F34A",
                            width: "28px",
                            height: "28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer"
                          }}
                        >
                          <Minus size={13} />
                        </button>
                        <span
                          style={{
                            fontSize: "12px",
                            fontWeight: 700,
                            color: "#FFFFFF",
                            minWidth: "18px",
                            textAlign: "center"
                          }}
                        >
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrease(prod)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#B7F34A",
                            width: "28px",
                            height: "28px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer"
                          }}
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "48px 16px",
              color: "#73796F"
            }}
          >
            <div
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: "#24452D",
                marginBottom: "4px"
              }}
            >
              No matching items found
            </div>
            <div style={{ fontSize: "12px" }}>
              Try searching with another keyword or reset active category filters.
            </div>
          </div>
        )}
      </div>

      {/* 8. Product Quick-View Sheet / Modal */}
      {selectedProductModal && (
        <div
          onClick={() => setSelectedProductModal(null)}
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(4px)",
            zIndex: 110,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center"
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#FFFFFF",
              width: "100%",
              maxWidth: "440px",
              borderTopLeftRadius: "20px",
              borderTopRightRadius: "20px",
              padding: "18px 20px 24px",
              maxHeight: "85vh",
              overflowY: "auto",
              boxShadow: "0 -8px 30px rgba(0,0,0,0.18)"
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "14px"
              }}
            >
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  color: "#0C831F",
                  backgroundColor: "#F0FDF4",
                  padding: "3px 8px",
                  borderRadius: "4px"
                }}
              >
                10-Min Fast Dispatch
              </span>
              <button
                type="button"
                onClick={() => setSelectedProductModal(null)}
                style={{
                  background: "#F7F8F5",
                  border: "1px solid #E7EAE3",
                  borderRadius: "50%",
                  width: "30px",
                  height: "30px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  color: "#73796F"
                }}
              >
                <X size={15} />
              </button>
            </div>

            {/* Product Image */}
            <div
              style={{
                width: "100%",
                height: "190px",
                borderRadius: "14px",
                overflow: "hidden",
                backgroundColor: "#F7F8F5",
                marginBottom: "14px"
              }}
            >
              <img
                src={selectedProductModal.image}
                alt={selectedProductModal.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            {/* Title & Price */}
            <div style={{ fontSize: "17px", fontWeight: 800, color: "#20251F", lineHeight: 1.25 }}>
              {selectedProductModal.name}
            </div>
            <div style={{ fontSize: "12px", color: "#73796F", marginTop: "3px" }}>
              {selectedProductModal.weight}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "12px 0" }}>
              <span style={{ fontSize: "20px", fontWeight: 800, color: "#24452D" }}>
                ₹{selectedProductModal.price}
              </span>
              {selectedProductModal.originalPrice > selectedProductModal.price && (
                <span style={{ fontSize: "13px", color: "#94A3B8", textDecoration: "line-through" }}>
                  ₹{selectedProductModal.originalPrice}
                </span>
              )}
              {selectedProductModal.discount && (
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "#0C831F",
                    backgroundColor: "#F0FDF4",
                    padding: "2px 7px",
                    borderRadius: "4px"
                  }}
                >
                  {selectedProductModal.discount}
                </span>
              )}
            </div>

            {/* Description */}
            <div style={{ fontSize: "12.5px", color: "#475569", lineHeight: 1.5, marginBottom: "14px" }}>
              {selectedProductModal.description}
            </div>

            {/* Spec Table */}
            <div
              style={{
                backgroundColor: "#F7F8F5",
                borderRadius: "12px",
                padding: "12px",
                fontSize: "11.5px",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginBottom: "16px",
                border: "1px solid #E7EAE3"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#73796F" }}>Farm / Origin:</span>
                <span style={{ fontWeight: 600, color: "#20251F" }}>{selectedProductModal.origin}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#73796F" }}>Shelf Life:</span>
                <span style={{ fontWeight: 600, color: "#20251F" }}>{selectedProductModal.shelfLife}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#73796F" }}>Nutrition Highlights:</span>
                <span style={{ fontWeight: 600, color: "#24452D" }}>{selectedProductModal.nutrition}</span>
              </div>
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => {
                handleAdd(selectedProductModal);
                setSelectedProductModal(null);
              }}
              style={{
                width: "100%",
                backgroundColor: "#24452D",
                color: "#B7F34A",
                border: "none",
                borderRadius: "12px",
                padding: "13px",
                fontSize: "14px",
                fontWeight: 800,
                cursor: "pointer",
                letterSpacing: "-0.01em"
              }}
            >
              Add to Bag • ₹{selectedProductModal.price}
            </button>
          </div>
        </div>
      )}

      {/* 9. Sticky Floating Bag Summary Bar with Delivery Progress */}
      {totalCartCount > 0 && (
        <div
          onClick={() => {
            playClickSound();
            navigateTo("bag");
          }}
          style={{
            position: "fixed",
            bottom: "68px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#24452D",
            color: "#FFFFFF",
            borderRadius: "14px",
            padding: "12px 18px",
            width: "calc(100% - 32px)",
            maxWidth: "400px",
            boxShadow: "0 8px 24px rgba(36, 69, 45, 0.4)",
            cursor: "pointer",
            zIndex: 100
          }}
        >
          {/* Progress toward free delivery */}
          <div style={{ marginBottom: "8px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                fontSize: "10.5px",
                color: "rgba(255, 255, 255, 0.8)",
                marginBottom: "4px"
              }}
            >
              <span>
                {cartSubtotal >= freeDeliveryThreshold
                  ? "✓ FREE Delivery Unlocked"
                  : `Add ₹${freeDeliveryThreshold - cartSubtotal} more for FREE Delivery`}
              </span>
              <span>₹{cartSubtotal}</span>
            </div>
            <div
              style={{
                width: "100%",
                height: "3px",
                borderRadius: "9999px",
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                overflow: "hidden"
              }}
            >
              <div
                style={{
                  width: `${progressPercent}%`,
                  height: "100%",
                  backgroundColor: "#B7F34A",
                  borderRadius: "9999px",
                  transition: "width 0.25s ease"
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  backgroundColor: "#B7F34A",
                  color: "#24452D",
                  borderRadius: "6px",
                  padding: "2px 8px",
                  fontSize: "12px",
                  fontWeight: 800
                }}
              >
                {totalCartCount}
              </div>
              <span style={{ fontSize: "13px", fontWeight: 700 }}>
                {totalCartCount === 1 ? "1 item in bag" : `${totalCartCount} items in bag`}
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "13px",
                fontWeight: 700,
                color: "#B7F34A"
              }}
            >
              <span>View Bag</span>
              <ChevronRight size={15} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
