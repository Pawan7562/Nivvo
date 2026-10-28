import React, { useState, useMemo } from "react";
import { useNivvo } from "../../context/NivvoAppContext";
import {
  Search, ShoppingBag, Plus, Minus, ChevronRight, Star,
  Clock, X, ArrowLeft, ShieldCheck, Flame, Info, Filter,
  Check, Store
} from "lucide-react";
import { playClickSound, playAddSound } from "../../utils/audioEffects";
import ShoppingModeSwitcher from "../../components/ShoppingModeSwitcher";

const CUISINES = [
  { id: "all", name: "All Cuisines" },
  { id: "pizza", name: "Artisan Pizza" },
  { id: "burger", name: "Gourmet Burgers" },
  { id: "momos", name: "Authentic Momos" },
  { id: "biryani", name: "Dum Biryani" },
  { id: "chinese", name: "Pan-Asian & Bowls" },
  { id: "desserts", name: "Desserts & Bakes" }
];

const RESTAURANTS = [
  {
    id: "r-1",
    name: "Pizza Palace Originals",
    cuisine: "Italian & Wood-Fired Pizza",
    rating: 4.7,
    reviewCount: "1.2k",
    eta: "25–35 min",
    distance: "1.2 km",
    offer: "Flat 20% OFF",
    hygieneRating: "4.9/5 Excellent",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
    category: "pizza",
    speciality: "Slow-fermented sourdough crusts & San Marzano tomatoes"
  },
  {
    id: "r-2",
    name: "The Burger Barn",
    cuisine: "American Smash Burgers & Fries",
    rating: 4.8,
    reviewCount: "890",
    eta: "20–30 min",
    distance: "0.8 km",
    offer: "Combos from ₹249",
    hygieneRating: "4.8/5 Certified",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    category: "burger",
    speciality: "Double smash patties with house-made brioche buns"
  },
  {
    id: "r-3",
    name: "Himalayan Momo House",
    cuisine: "Tibetan & Darjeeling Dumplings",
    rating: 4.9,
    reviewCount: "2.1k",
    eta: "15–25 min",
    distance: "0.5 km",
    offer: "Free dipping sauce",
    hygieneRating: "5.0/5 Super Clean",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8596ddcd8?w=600&auto=format&fit=crop&q=80",
    category: "momos",
    speciality: "Freshly handmade dim sums steamed on order"
  },
  {
    id: "r-4",
    name: "Nizam Dum Biryani",
    cuisine: "Hyderabadi & Awadhi Dum Biryani",
    rating: 4.6,
    reviewCount: "3.4k",
    eta: "30–40 min",
    distance: "1.8 km",
    offer: "Free Raita & Salan",
    hygieneRating: "4.7/5 Certified",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80",
    category: "biryani",
    speciality: "Traditional copper handi slow dum cooking"
  },
  {
    id: "r-5",
    name: "Dragon Wok Kitchen",
    cuisine: "Wok-Tossed Noodles & Dim Sums",
    rating: 4.5,
    reviewCount: "640",
    eta: "25–35 min",
    distance: "1.4 km",
    offer: "Flat ₹50 OFF",
    hygieneRating: "4.8/5 Certified",
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80",
    category: "chinese",
    speciality: "High-heat wok hei flavors & craft sauces"
  },
  {
    id: "r-6",
    name: "Artisan Sweet Symphony",
    cuisine: "French Patisserie & Gelato",
    rating: 4.9,
    reviewCount: "920",
    eta: "20–30 min",
    distance: "0.9 km",
    offer: "Complimentary Macaron",
    hygieneRating: "5.0/5 Super Clean",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&auto=format&fit=crop&q=80",
    category: "desserts",
    speciality: "70% Belgian chocolate molten bakes"
  }
];

const DISHES = [
  {
    id: "fd-1",
    name: "Classic Margherita Pizza",
    restaurant: "Pizza Palace Originals",
    restaurantId: "r-1",
    category: "pizza",
    price: 249,
    originalPrice: 320,
    isVeg: true,
    rating: 4.7,
    ratingCount: "540",
    portion: "Serves 1–2 (10 inch)",
    spiceLevel: "Mild",
    description: "San Marzano tomato sauce, fresh buffalo mozzarella, aromatic sweet basil on hand-stretched sourdough crust.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "fd-2",
    name: "Smoky Barbecue Chicken Pizza",
    restaurant: "Pizza Palace Originals",
    restaurantId: "r-1",
    category: "pizza",
    price: 349,
    originalPrice: 420,
    isVeg: false,
    rating: 4.8,
    ratingCount: "680",
    portion: "Serves 1–2 (10 inch)",
    spiceLevel: "Medium",
    description: "Tender grilled chicken tossed in hickory barbecue sauce with red onions, bell peppers and smoked gouda.",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "fd-3",
    name: "Gourmet Double Smash Burger",
    restaurant: "The Burger Barn",
    restaurantId: "r-2",
    category: "burger",
    price: 219,
    originalPrice: 269,
    isVeg: false,
    rating: 4.8,
    ratingCount: "740",
    portion: "Serves 1 (Includes seasoned fries)",
    spiceLevel: "Medium",
    description: "Double caramelized smash patties, aged sharp cheddar, dill pickles and secret house sauce on toasted brioche.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "fd-4",
    name: "Crispy Herb Falafel Burger",
    restaurant: "The Burger Barn",
    restaurantId: "r-2",
    category: "burger",
    price: 169,
    originalPrice: 210,
    isVeg: true,
    rating: 4.6,
    ratingCount: "310",
    portion: "Serves 1 (Includes seasoned fries)",
    spiceLevel: "Mild",
    description: "Golden spiced chickpea patty, tahini crema, crisp lettuce and sun-dried tomatoes on seeded wholewheat bun.",
    image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "fd-5",
    name: "Steamed Vegetable Momos (8 pcs)",
    restaurant: "Himalayan Momo House",
    restaurantId: "r-3",
    category: "momos",
    price: 119,
    originalPrice: 149,
    isVeg: true,
    rating: 4.9,
    ratingCount: "1.4k",
    portion: "8 Pieces (Serves 1)",
    spiceLevel: "Spicy Dip",
    description: "Delicate steamed dumplings filled with finely chopped cabbage, ginger, scallions and served with spicy tomato-garlic chutney.",
    image: "https://images.unsplash.com/photo-1534422298391-e4f8596ddcd8?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "fd-6",
    name: "Pan-Fried Chicken Kothey Momos",
    restaurant: "Himalayan Momo House",
    restaurantId: "r-3",
    category: "momos",
    price: 159,
    originalPrice: 199,
    isVeg: false,
    rating: 4.8,
    ratingCount: "920",
    portion: "8 Pieces (Serves 1)",
    spiceLevel: "Spicy Dip",
    description: "Crisp pan-seared base dumplings with seasoned minced chicken, fresh herbs and roasted chili dip.",
    image: "https://images.unsplash.com/photo-1625398407796-82650a8c135f?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "fd-7",
    name: "Hyderabadi Dum Chicken Biryani",
    restaurant: "Nizam Dum Biryani",
    restaurantId: "r-4",
    category: "biryani",
    price: 329,
    originalPrice: 390,
    isVeg: false,
    rating: 4.7,
    ratingCount: "2.8k",
    portion: "Serves 1–2 (Includes Mirchi ka Salan & Raita)",
    spiceLevel: "Medium-Hot",
    description: "Fragrant long-grain aged basmati rice cooked on slow dum with marinated chicken, saffron, fried onions and whole spices.",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "fd-8",
    name: "Royal Subz Dum Biryani",
    restaurant: "Nizam Dum Biryani",
    restaurantId: "r-4",
    category: "biryani",
    price: 249,
    originalPrice: 299,
    isVeg: true,
    rating: 4.6,
    ratingCount: "860",
    portion: "Serves 1–2 (Includes Raita)",
    spiceLevel: "Medium",
    description: "Seasonal garden vegetables, golden paneer cubes and aromatic saffron rice slow-cooked in sealed clay handi.",
    image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "fd-9",
    name: "Wok-Tossed Hakka Noodles",
    restaurant: "Dragon Wok Kitchen",
    restaurantId: "r-5",
    category: "chinese",
    price: 159,
    originalPrice: 195,
    isVeg: true,
    rating: 4.5,
    ratingCount: "430",
    portion: "Serves 1–2 (500g)",
    spiceLevel: "Mild",
    description: "Fresh eggless noodles wok-tossed with shredded cabbage, bell peppers and mild ginger-scallion reduction.",
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&auto=format&fit=crop&q=80"
  },
  {
    id: "fd-10",
    name: "Warm Belgian Chocolate Lava Cake",
    restaurant: "Artisan Sweet Symphony",
    restaurantId: "r-6",
    category: "desserts",
    price: 179,
    originalPrice: 220,
    isVeg: true,
    rating: 4.9,
    ratingCount: "810",
    portion: "Serves 1 (Single Cake)",
    spiceLevel: "Sweet",
    description: "Rich dark cocoa cake with a molten center of 70% Belgian chocolate, dusted with powdered sugar.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&auto=format&fit=crop&q=80"
  }
];

export default function FoodView({ onBack, onNavigateMode }) {
  const { cart, addToCart, updateCartQuantity, totalCartCount, showToast, navigateTo } = useNivvo();
  const [activeCuisine, setActiveCuisine] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewTab, setViewTab] = useState("dishes"); // "dishes" | "restaurants"
  const [vegOnly, setVegOnly] = useState(false);
  const [selectedDishModal, setSelectedDishModal] = useState(null);
  const [activeRestaurantFilter, setActiveRestaurantFilter] = useState(null);

  const getItemQuantity = (productId) => {
    const item = cart.find((i) => i.productId === productId);
    return item ? item.quantity : 0;
  };

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  }, [cart]);

  const filteredDishes = useMemo(() => {
    let list = DISHES;
    if (activeRestaurantFilter) {
      list = list.filter((d) => d.restaurantId === activeRestaurantFilter.id);
    }
    if (activeCuisine !== "all") {
      list = list.filter((d) => d.category === activeCuisine);
    }
    if (vegOnly) {
      list = list.filter((d) => d.isVeg);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.restaurant.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeRestaurantFilter, activeCuisine, vegOnly, searchQuery]);

  const filteredRestaurants = useMemo(() => {
    let list = RESTAURANTS;
    if (activeCuisine !== "all") {
      list = list.filter((r) => r.category === activeCuisine);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.cuisine.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeCuisine, searchQuery]);

  const handleAdd = (dish) => {
    playAddSound();
    addToCart(
      {
        ...dish,
        productId: dish.id,
        shopName: dish.restaurant
      },
      "1 portion"
    );
    showToast(`Added ${dish.name} to bag`);
  };

  const handleIncrease = (dish) => {
    playClickSound();
    const cartItem = cart.find((i) => i.productId === dish.id);
    if (cartItem) {
      updateCartQuantity(cartItem.cartItemId, cartItem.quantity + 1);
    }
  };

  const handleDecrease = (dish) => {
    playClickSound();
    const cartItem = cart.find((i) => i.productId === dish.id);
    if (cartItem) {
      updateCartQuantity(cartItem.cartItemId, cartItem.quantity - 1);
    }
  };

  const freeDeliveryThreshold = 249;
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
                <span>Nivvo Food Dining</span>
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
                  <span>20–35 mins</span>
                </div>
                <span>• Live cloud kitchens</span>
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
            placeholder="Search pizza, momos, burger, biryani, kitchens..."
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
      </div>

      {/* 2. Unified Shopping Mode Switcher */}
      <ShoppingModeSwitcher
        activeMode="food"
        onModeChange={(mode) => {
          if (mode === "shop") {
            if (onNavigateMode) onNavigateMode("shop");
            else onBack();
          } else if (mode === "grocery") {
            if (onNavigateMode) onNavigateMode("grocery");
            else navigateTo("grocery");
          }
        }}
      />

      {/* 3. Kitchen Quality Assurance Strip */}
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
          <span>FSSAI Hygiene 4.9/5</span>
        </div>
        <span>•</span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Clock size={13} color="#0C831F" />
          <span>Cooked fresh to order</span>
        </div>
        <span>•</span>
        <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
          <Store size={13} color="#0C831F" />
          <span>Insulated delivery</span>
        </div>
      </div>

      {/* Active Restaurant Filter Banner */}
      {activeRestaurantFilter && (
        <div
          style={{
            backgroundColor: "#24452D",
            color: "#FFFFFF",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}
        >
          <div>
            <div style={{ fontSize: "12.5px", fontWeight: 700 }}>
              Viewing Menu: {activeRestaurantFilter.name}
            </div>
            <div style={{ fontSize: "10.5px", color: "#B7F34A" }}>
              {activeRestaurantFilter.speciality}
            </div>
          </div>
          <button
            type="button"
            onClick={() => setActiveRestaurantFilter(null)}
            style={{
              background: "rgba(255,255,255,0.2)",
              border: "none",
              color: "#FFFFFF",
              padding: "4px 8px",
              borderRadius: "6px",
              fontSize: "11px",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            Show All Kitchens
          </button>
        </div>
      )}

      {/* 4. Section Segment Tabs (Dishes vs Restaurants) + Pure Veg Toggle */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "10px 16px",
          borderBottom: "1px solid #E7EAE3",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "8px"
        }}
      >
        <div
          style={{
            display: "flex",
            backgroundColor: "#F7F8F5",
            padding: "3px",
            borderRadius: "8px",
            border: "1px solid #E7EAE3"
          }}
        >
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setViewTab("dishes");
            }}
            style={{
              padding: "5px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: viewTab === "dishes" ? "#24452D" : "transparent",
              color: viewTab === "dishes" ? "#FFFFFF" : "#555E50",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            Curated Dishes
          </button>
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setViewTab("restaurants");
            }}
            style={{
              padding: "5px 14px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: viewTab === "restaurants" ? "#24452D" : "transparent",
              color: viewTab === "restaurants" ? "#FFFFFF" : "#555E50",
              fontSize: "12px",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            Kitchens ({RESTAURANTS.length})
          </button>
        </div>

        {/* Veg-Only Filter Toggle */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            setVegOnly(!vegOnly);
          }}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 10px",
            borderRadius: "8px",
            border: vegOnly ? "1.5px solid #0C831F" : "1px solid #E7EAE3",
            backgroundColor: vegOnly ? "#F0FDF4" : "#FFFFFF",
            color: vegOnly ? "#0C831F" : "#555E50",
            fontSize: "11.5px",
            fontWeight: 700,
            cursor: "pointer"
          }}
        >
          <span
            style={{
              width: "12px",
              height: "12px",
              border: "1.5px solid #0C831F",
              borderRadius: "3px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            <span
              style={{
                width: "5px",
                height: "5px",
                borderRadius: "50%",
                backgroundColor: "#0C831F"
              }}
            />
          </span>
          <span>Veg only</span>
        </button>
      </div>

      {/* 5. Cuisine Horizontal Filter Rail */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          padding: "10px 16px 12px",
          borderBottom: "1px solid #E7EAE3",
          display: "flex",
          gap: "8px",
          overflowX: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch"
        }}
      >
        {CUISINES.map((c) => {
          const isSelected = activeCuisine === c.id;
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => {
                playClickSound();
                setActiveCuisine(c.id);
              }}
              style={{
                padding: "6px 14px",
                borderRadius: "9999px",
                border: isSelected ? "1.5px solid #24452D" : "1px solid #E7EAE3",
                backgroundColor: isSelected ? "#24452D" : "#F7F8F5",
                color: isSelected ? "#FFFFFF" : "#4A5245",
                fontSize: "12px",
                fontWeight: isSelected ? 700 : 500,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.15s ease"
              }}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* 6. Content Section */}
      {viewTab === "dishes" ? (
        /* Dishes List View */
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#24452D" }}>
              {filteredDishes.length} curated meals
            </span>
            <span style={{ fontSize: "11px", color: "#73796F" }}>
              Delivered hot in tamper-proof boxes
            </span>
          </div>

          {filteredDishes.map((dish) => {
            const qty = getItemQuantity(dish.id);
            return (
              <div
                key={dish.id}
                style={{
                  backgroundColor: "#FFFFFF",
                  border: "1px solid #E7EAE3",
                  borderRadius: "14px",
                  padding: "14px",
                  display: "flex",
                  gap: "14px",
                  alignItems: "flex-start",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.03)"
                }}
              >
                {/* Left: Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Veg / Non-Veg Indicator & Restaurant Name */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        border: dish.isVeg ? "1.5px solid #0C831F" : "1.5px solid #BD3838",
                        borderRadius: "3px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <div
                        style={{
                          width: "6px",
                          height: "6px",
                          borderRadius: "50%",
                          backgroundColor: dish.isVeg ? "#0C831F" : "#BD3838"
                        }}
                      />
                    </div>
                    <span style={{ fontSize: "11px", fontWeight: 600, color: "#73796F" }}>
                      {dish.restaurant}
                    </span>
                  </div>

                  {/* Title with click to detail */}
                  <div
                    onClick={() => {
                      playClickSound();
                      setSelectedDishModal(dish);
                    }}
                    style={{
                      fontSize: "14.5px",
                      fontWeight: 700,
                      color: "#20251F",
                      lineHeight: 1.3,
                      marginBottom: "4px",
                      cursor: "pointer"
                    }}
                  >
                    {dish.name}
                  </div>

                  {/* Price & Rating */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginBottom: "6px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "15px",
                        fontWeight: 800,
                        color: "#24452D"
                      }}
                    >
                      ₹{dish.price}
                    </span>
                    {dish.originalPrice > dish.price && (
                      <span
                        style={{
                          fontSize: "11px",
                          color: "#94A3B8",
                          textDecoration: "line-through"
                        }}
                      >
                        ₹{dish.originalPrice}
                      </span>
                    )}
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "2px",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        color: "#B45309",
                        backgroundColor: "#FEF3C7",
                        padding: "1px 6px",
                        borderRadius: "4px",
                        marginLeft: "4px"
                      }}
                    >
                      <Star size={10} fill="#B45309" color="#B45309" />
                      <span>{dish.rating}</span>
                    </span>
                  </div>

                  <div
                    style={{
                      fontSize: "11.5px",
                      color: "#64748B",
                      lineHeight: 1.4,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden"
                    }}
                  >
                    {dish.description}
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      marginTop: "6px"
                    }}
                  >
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#475569",
                        backgroundColor: "#F1F5F9",
                        padding: "2px 6px",
                        borderRadius: "4px"
                      }}
                    >
                      {dish.portion}
                    </span>
                    <span
                      style={{
                        fontSize: "10px",
                        fontWeight: 600,
                        color: "#475569",
                        backgroundColor: "#F1F5F9",
                        padding: "2px 6px",
                        borderRadius: "4px"
                      }}
                    >
                      {dish.spiceLevel}
                    </span>
                  </div>
                </div>

                {/* Right: Dish Photo & Add Stepper */}
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "110px",
                    flexShrink: 0
                  }}
                >
                  <div
                    onClick={() => {
                      playClickSound();
                      setSelectedDishModal(dish);
                    }}
                    style={{
                      width: "110px",
                      height: "95px",
                      borderRadius: "12px",
                      overflow: "hidden",
                      backgroundColor: "#F7F8F5",
                      border: "1px solid #E7EAE3",
                      cursor: "pointer"
                    }}
                  >
                    <img
                      src={dish.image}
                      alt={dish.name}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover"
                      }}
                      loading="lazy"
                    />
                  </div>

                  <div style={{ marginTop: "-14px", position: "relative", zIndex: 2 }}>
                    {qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleAdd(dish)}
                        style={{
                          backgroundColor: "#FFFFFF",
                          color: "#24452D",
                          border: "1.5px solid #24452D",
                          borderRadius: "8px",
                          padding: "6px 20px",
                          fontSize: "12px",
                          fontWeight: 800,
                          cursor: "pointer",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
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
                          overflow: "hidden",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.15)"
                        }}
                      >
                        <button
                          type="button"
                          onClick={() => handleDecrease(dish)}
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
                          onClick={() => handleIncrease(dish)}
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

          {filteredDishes.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 16px",
                color: "#73796F",
                backgroundColor: "#FFFFFF",
                borderRadius: "14px",
                border: "1px solid #E7EAE3"
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
                No dishes match your filter
              </div>
              <div style={{ fontSize: "12px" }}>
                Try changing the cuisine selection or toggle off pure veg filter.
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Restaurants View */
        <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#24452D" }}>
              {filteredRestaurants.length} verified cloud kitchens
            </span>
            <span style={{ fontSize: "11px", color: "#73796F" }}>
              Tap to view full kitchen menu
            </span>
          </div>

          {filteredRestaurants.map((res) => (
            <div
              key={res.id}
              onClick={() => {
                playClickSound();
                setActiveRestaurantFilter(res);
                setViewTab("dishes");
              }}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #E7EAE3",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                transition: "transform 0.15s ease"
              }}
            >
              <div
                style={{
                  height: "145px",
                  position: "relative",
                  backgroundColor: "#F7F8F5"
                }}
              >
                <img
                  src={res.image}
                  alt={res.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
                  }}
                  loading="lazy"
                />

                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    backgroundColor: "#FFFFFF",
                    color: "#20251F",
                    borderRadius: "6px",
                    padding: "3px 8px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "11px",
                    fontWeight: 700,
                    boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
                  }}
                >
                  <Star size={11} fill="#F59E0B" color="#F59E0B" />
                  <span>{res.rating}</span>
                  <span style={{ color: "#94A3B8", fontWeight: 500 }}>({res.reviewCount})</span>
                </div>

                {res.offer && (
                  <div
                    style={{
                      position: "absolute",
                      bottom: "10px",
                      left: "10px",
                      backgroundColor: "#24452D",
                      color: "#B7F34A",
                      fontSize: "10.5px",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "6px"
                    }}
                  >
                    {res.offer}
                  </div>
                )}
              </div>

              <div style={{ padding: "12px 14px" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "3px"
                  }}
                >
                  <div
                    style={{
                      fontSize: "15.5px",
                      fontWeight: 800,
                      color: "#20251F"
                    }}
                  >
                    {res.name}
                  </div>
                  <ChevronRight size={16} color="#73796F" />
                </div>

                <div
                  style={{
                    fontSize: "12px",
                    color: "#64748B",
                    marginBottom: "6px"
                  }}
                >
                  {res.cuisine}
                </div>

                <div
                  style={{
                    fontSize: "11px",
                    color: "#0C831F",
                    fontWeight: 600,
                    marginBottom: "8px"
                  }}
                >
                  ★ {res.hygieneRating} • {res.speciality}
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    fontSize: "11px",
                    color: "#73796F",
                    borderTop: "1px solid #F1F5F9",
                    paddingTop: "8px"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                    <Clock size={11} color="#0C831F" />
                    <span style={{ fontWeight: 600, color: "#24452D" }}>{res.eta}</span>
                  </div>
                  <span>•</span>
                  <span>{res.distance}</span>
                  <span>•</span>
                  <span style={{ color: "#0C831F", fontWeight: 600 }}>Open Now</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 7. Dish Quick View Modal */}
      {selectedDishModal && (
        <div
          onClick={() => setSelectedDishModal(null)}
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
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div
                  style={{
                    width: "14px",
                    height: "14px",
                    border: selectedDishModal.isVeg ? "1.5px solid #0C831F" : "1.5px solid #BD3838",
                    borderRadius: "3px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: selectedDishModal.isVeg ? "#0C831F" : "#BD3838"
                    }}
                  />
                </div>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569" }}>
                  {selectedDishModal.restaurant}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedDishModal(null)}
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
                src={selectedDishModal.image}
                alt={selectedDishModal.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ fontSize: "17px", fontWeight: 800, color: "#20251F", lineHeight: 1.25 }}>
              {selectedDishModal.name}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "8px", margin: "10px 0" }}>
              <span style={{ fontSize: "20px", fontWeight: 800, color: "#24452D" }}>
                ₹{selectedDishModal.price}
              </span>
              {selectedDishModal.originalPrice > selectedDishModal.price && (
                <span style={{ fontSize: "13px", color: "#94A3B8", textDecoration: "line-through" }}>
                  ₹{selectedDishModal.originalPrice}
                </span>
              )}
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "2px",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "#B45309",
                  backgroundColor: "#FEF3C7",
                  padding: "2px 7px",
                  borderRadius: "4px"
                }}
              >
                <Star size={10} fill="#B45309" color="#B45309" />
                <span>{selectedDishModal.rating}</span>
              </span>
            </div>

            <div style={{ fontSize: "12.5px", color: "#475569", lineHeight: 1.5, marginBottom: "14px" }}>
              {selectedDishModal.description}
            </div>

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
                <span style={{ color: "#73796F" }}>Portion:</span>
                <span style={{ fontWeight: 600, color: "#20251F" }}>{selectedDishModal.portion}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#73796F" }}>Spice Level:</span>
                <span style={{ fontWeight: 600, color: "#20251F" }}>{selectedDishModal.spiceLevel}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#73796F" }}>Packaging:</span>
                <span style={{ fontWeight: 600, color: "#24452D" }}>Food-grade insulated container</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleAdd(selectedDishModal);
                setSelectedDishModal(null);
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
              Add to Bag • ₹{selectedDishModal.price}
            </button>
          </div>
        </div>
      )}

      {/* 8. Sticky Floating Bag Summary Bar with Delivery Progress */}
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
