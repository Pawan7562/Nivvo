import React, { useState, useEffect, useRef } from 'react';
import '../styles/figma-landing.css';
import { 
  ArrowUpRight, MapPin, LocateFixed, Timer, Store, 
  ShieldCheck, ReceiptText, ShoppingBag, Navigation, 
  CheckCircle2, PackageCheck, Bike, RefreshCw, Minus, Plus,
  Instagram, Linkedin, X, Check, QrCode, Download, ChevronRight,
  Utensils, Apple, Star, Smartphone, Sparkles, Flame,
  Menu, Zap, User, ChevronDown, Search
} from 'lucide-react';
import { playClickSound, playTrialSound, playAddSound } from '../utils/audioEffects';
import { useNivvo } from '../context/NivvoAppContext';
import ProfessionalSellerApplicationModal from '../components/ProfessionalSellerApplicationModal';

export default function LandingPageView({ 
  onNavigateHome,
  onNavigateCategory,
  onNavigateGrocery,
  onNavigateFood,
  onNavigateShops,
  onNavigateBag,
  onNavigateCheckout,
  onNavigateTracking,
  onNavigateProfile,
  onNavigateSeller,
  onNavigateRider,
  onNavigateAdmin,
  onOpenAuth,
  onLaunchMobileSimulator
}) {
  const { 
    cart = [], 
    addToCart, 
    totalCartCount = 0, 
    showToast,
    currentUser,
    selectedAddress,
    setSelectedAddress,
    submitSellerApplication
  } = useNivvo();

  // Active Micro-hub & Location Search
  const [heroLocationInput, setHeroLocationInput] = useState('');
  const [closingLocationInput, setClosingLocationInput] = useState('');
  const [activeLocationLabel, setActiveLocationLabel] = useState('Indiranagar, Bengaluru');

  // Pillar Switcher: 'fashion' | 'grocery' | 'food'
  const [activePillar, setActivePillar] = useState('fashion');
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [hubSearchQuery, setHubSearchQuery] = useState('');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [calcHub, setCalcHub] = useState('Indiranagar');

  const BENGALURU_HUBS = [
    { name: 'Indiranagar', pin: '560038', eta: '10–12 min', shops: '340+ shops', landmark: '100ft Road & 12th Main' },
    { name: 'Koramangala', pin: '560034', eta: '10–14 min', shops: '410+ shops', landmark: '4th Block & Sony World' },
    { name: 'HSR Layout', pin: '560102', eta: '10–12 min', shops: '280+ shops', landmark: 'Sector 2 & 27th Main' },
    { name: 'Jayanagar', pin: '560041', eta: '12–15 min', shops: '250+ shops', landmark: '4th Block Complex' },
    { name: 'Whitefield', pin: '560066', eta: '12–16 min', shops: '290+ shops', landmark: 'ITPL Main Road' },
    { name: 'Malleshwaram', pin: '560003', eta: '11–14 min', shops: '210+ shops', landmark: 'Sampige Road' },
    { name: 'Sadashivanagar', pin: '560080', eta: '10–12 min', shops: '160+ shops', landmark: 'Bellary Road' }
  ];

  const DISPATCH_SIMULATION = {
    'Indiranagar': { distance: '0.8 km', darkStoreTime: '120 sec', transitTime: '7 min', trialTime: '2 min', totalEta: '10 min', ridersLive: 28, partnerStores: 48 },
    'Koramangala': { distance: '1.1 km', darkStoreTime: '120 sec', transitTime: '8 min', trialTime: '2 min', totalEta: '11 min', ridersLive: 34, partnerStores: 62 },
    'HSR Layout':  { distance: '0.9 km', darkStoreTime: '120 sec', transitTime: '7 min', trialTime: '2 min', totalEta: '10 min', ridersLive: 22, partnerStores: 38 },
    'Jayanagar':   { distance: '1.4 km', darkStoreTime: '120 sec', transitTime: '9 min', trialTime: '2 min', totalEta: '12 min', ridersLive: 19, partnerStores: 31 },
    'Whitefield':  { distance: '1.6 km', darkStoreTime: '120 sec', transitTime: '10 min', trialTime: '2 min', totalEta: '13 min', ridersLive: 26, partnerStores: 44 }
  };

  const VERIFIED_COMMUNITY_REVIEWS = [
    {
      author: 'Priya Sundaram',
      initials: 'PS',
      location: '100ft Road, Indiranagar',
      rating: 5,
      tag: 'Fashion 2-Size Trial',
      time: 'Delivered in 9 min',
      quote: 'Ordered both Size M and L for an urgent evening event. The rider waited outside while I tried both, kept the Medium, and returned the Large instantly without any return paperwork. Absolute game changer!'
    },
    {
      author: 'Arjun Nambiar',
      initials: 'AN',
      location: '4th Block, Koramangala',
      rating: 5,
      tag: 'Artisan Gourmet Hub',
      time: 'Delivered in 11 min',
      quote: 'Getting fresh warm sourdough and specialty filter roast from local Koramangala bakeries in just 11 minutes beats any national delivery app. Packaging was immaculate with zero spills.'
    },
    {
      author: 'Sneha Hegde',
      initials: 'SH',
      location: 'Sector 2, HSR Layout',
      rating: 5,
      tag: 'Local Electronics & Tech',
      time: 'Delivered in 8 min',
      quote: 'My laptop charger died right before a client presentation. Found an authentic replacement from a verified local tech store on Nivvo, and the rider reached my apartment in 8 minutes flat.'
    }
  ];

  const handlePillarChange = (pillar) => {
    playClickSound();
    setActivePillar(pillar);
    setSelectedSubCategory('all');
    setHubSearchQuery('');
    const el = document.getElementById('hyperlocal-hub');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // FAQ Accordion State (Item 0 open by default as in Figma)
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Modals
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(null);
  const [modalPrimarySize, setModalPrimarySize] = useState('UK 8');
  const [modalQuantity, setModalQuantity] = useState(1);
  const [showMerchantModal, setShowMerchantModal] = useState(false);
  const [showDeliveryPartnerModal, setShowDeliveryPartnerModal] = useState(false);
  const [showHelpCenterModal, setShowHelpCenterModal] = useState(false);
  const [helpCenterTab, setHelpCenterTab] = useState('contact');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [ticketForm, setTicketForm] = useState({ name: '', email: '', category: '', message: '' });
  const [navScrolled, setNavScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSelectQuickHub = (hubName, pin) => {
    playClickSound();
    setHeroLocationInput(`${hubName}, Bengaluru (${pin})`);
    setActiveLocationLabel(`${hubName}, Bengaluru`);
    if (setSelectedAddress) {
      setSelectedAddress({
        id: `hub-${pin}`,
        title: hubName,
        area: hubName,
        pincode: pin
      });
    }
    showToast(`Active delivery hub switched to ${hubName} (${pin})`);
  };

  // Scroll-aware navbar
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Merchant Application Form
  const [merchantForm, setMerchantForm] = useState({
    shopName: '',
    ownerName: '',
    phone: '',
    category: 'Fashion & footwear',
    pincode: '560038'
  });
  const [merchantSubmitted, setMerchantSubmitted] = useState(false);

  // Location Handlers
  const handleUseCurrentLocation = () => {
    playClickSound();
    setHeroLocationInput('100ft Road, Indiranagar, Bengaluru (560038)');
    setActiveLocationLabel('Indiranagar, Bengaluru');
    if (setSelectedAddress) {
      setSelectedAddress({
        id: 'current-hub',
        title: 'Current Location',
        area: 'Indiranagar',
        pincode: '560038'
      });
    }
    showToast('Location set to Indiranagar, Bengaluru (Verified Hub)');
  };

  const handleHeroLocationSubmit = (e) => {
    e?.preventDefault();
    playClickSound();
    const target = heroLocationInput.trim() || 'Indiranagar, Bengaluru';
    setActiveLocationLabel(target);
    const el = document.getElementById('nearby-shopping');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    showToast(`Showing independent shops near ${target}`);
  };

  const handleClosingLocationSubmit = (e) => {
    e?.preventDefault();
    playClickSound();
    const target = closingLocationInput.trim() || 'Indiranagar, Bengaluru';
    setActiveLocationLabel(target);
    const el = document.getElementById('nearby-shopping');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    showToast(`Showing independent shops near ${target}`);
  };

  const handleMerchantSubmit = (e) => {
    e.preventDefault();
    playTrialSound();
    if (submitSellerApplication) {
      submitSellerApplication({
        shop_name: merchantForm.shopName,
        owner_name: merchantForm.ownerName,
        phone: merchantForm.phone,
        category: merchantForm.category,
        pincode: merchantForm.pincode
      });
    }
    setMerchantSubmitted(true);
    setTimeout(() => {
      setShowMerchantModal(false);
      setMerchantSubmitted(false);
      setMerchantForm({
        shopName: '',
        ownerName: '',
        phone: '',
        category: 'Fashion & footwear',
        pincode: '560038'
      });
    }, 2000);
  };

  // FAQ Items from Figma Node 13:3604
  const FAQ_ITEMS = [
    {
      q: "Can I really get my order in 10 minutes?",
      a: "Sometimes. About 10 minutes is possible for eligible nearby items when stock is confirmed, the shop is ready and a delivery partner is available. Your order shows its own estimate; arrival times are not guaranteed."
    },
    {
      q: "Is Nivvo available in my neighbourhood?",
      a: "Enter your area or PIN code to check local coverage. Shops, products and delivery options vary by address and opening hours."
    },
    {
      q: "Can I shop from more than one seller?",
      a: "Yes, you can discover multiple local sellers on Nivvo. Orders from different shops may arrive separately, with their own delivery estimates and charges shown before payment."
    },
    {
      q: "What if an item is unavailable or I need a return?",
      a: "If a shop cannot confirm your item, we’ll share the available resolution or refund options. Return eligibility and timelines vary by product and seller; check the terms on the item page."
    },
    {
      q: "How much does delivery cost?",
      a: "Delivery fees depend on your address and order. You’ll see the delivery charge and any other applicable fees in the total before you pay."
    }
  ];

  // =========================================================================
  // THREE HYPERLOCAL PILLARS: DATASETS & SUB-CATEGORIES
  // =========================================================================

  const PILLAR_CATEGORIES = {
    fashion: [
      { id: 'all', name: 'All Fashion', count: '450+ items' },
      { id: 'Sneakers & Kicks', name: 'Sneakers & Kicks', count: '120+ pairs' },
      { id: 'Streetwear & Tees', name: 'Streetwear & Tees', count: '85+ designs' },
      { id: 'Crisp Formal Shirts', name: 'Formal Shirts', count: '64+ shirts' },
      { id: 'Bags & Backpacks', name: 'Bags & Packs', count: '42+ styles' },
      { id: 'Studio Audio & Wearables', name: 'Audio & Tech', count: '38+ models' },
      { id: 'Minimalist Accessories', name: 'Accessories', count: '70+ items' }
    ],
    grocery: [
      { id: 'all', name: 'All Grocery', count: '600+ essentials' },
      { id: 'Fresh Fruits & Mangoes', name: 'Fresh Fruits', count: '45+ varieties' },
      { id: 'Farm-Fresh Veggies', name: 'Organic Veggies', count: '80+ greens' },
      { id: 'Organic Dairy & Eggs', name: 'Dairy & Eggs', count: '55+ farm packs' },
      { id: 'Cold-Pressed & Pure Oils', name: 'Oils & Ghee', count: '30+ cold-press' },
      { id: 'Artisanal Bakery', name: 'Bakery & Bread', count: '25+ loaves' }
    ],
    food: [
      { id: 'all', name: 'All Kitchens', count: '140+ dishes' },
      { id: 'Wood-Fired Pizza', name: 'Artisan Pizza', count: '18 pizzerias' },
      { id: 'Gourmet Smash Burgers', name: 'Smash Burgers', count: '14 burger bars' },
      { id: 'Authentic Momos', name: 'Tibetan Momos', count: '22 varieties' },
      { id: 'Specialty Brews & Cafes', name: 'Specialty Coffee', count: '16 roasters' },
      { id: 'Healthy Greens & Bowls', name: 'Salads & Bowls', count: '28 bowls' },
      { id: 'Artisan Desserts', name: 'Patisserie', count: '32 pastries' }
    ]
  };

  // 1. Fashion & Lifestyle Products (8 Curated Items)
  const FASHION_PRODUCTS = [
    {
      id: 'f-1',
      pillar: 'fashion',
      img: '/assets/figma/abdf1e74aa30dce13dcddd3c45d128bfdc84cd4f.png',
      eta: '12–18 min',
      proximity: 'Sole Street · 0.8 km',
      title: 'Everyday Court Sneaker',
      price: '₹1,299',
      priceNum: 1299,
      originalPrice: '₹2,199',
      discount: '41% OFF',
      stock: '4 in stock',
      category: 'Sneakers & Kicks',
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
      description: 'Handcrafted vegan leather upper with breathable perforation and shock-absorbing crepe rubber cupsole. Free 10-minute doorstep 2-size trial.'
    },
    {
      id: 'f-2',
      pillar: 'fashion',
      img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
      eta: '10–15 min',
      proximity: 'The Cotton Loom · 0.5 km',
      title: 'Heavyweight Oversized Tee',
      price: '₹799',
      priceNum: 799,
      originalPrice: '₹1,299',
      discount: '38% OFF',
      stock: '9 in stock',
      category: 'Streetwear & Tees',
      sizes: ['S', 'M', 'L', 'XL'],
      description: '240 GSM organic loopknit cotton with pre-shrunk bio-wash finish and dropped shoulders. Eligible for 2-size doorstep trial.'
    },
    {
      id: 'f-3',
      pillar: 'fashion',
      img: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80',
      eta: '10–14 min',
      proximity: 'Stitch & Co. · 0.9 km',
      title: 'Crisp Egyptian Cotton Shirt',
      price: '₹1,499',
      priceNum: 1499,
      originalPrice: '₹2,499',
      discount: '40% OFF',
      stock: '6 in stock',
      category: 'Crisp Formal Shirts',
      sizes: ['38', '40', '42', '44'],
      description: '100% long-staple Egyptian cotton with mother-of-pearl buttons. Pre-steamed at 120°C and hung inside an anti-crease garment sleeve.'
    },
    {
      id: 'f-4',
      pillar: 'fashion',
      img: '/assets/figma/ea4e88f9ab906769fcc94cdab374ebe7c4be3b20.png',
      eta: '15–20 min',
      proximity: 'The Carry Co. · 1.1 km',
      title: 'Waxed Canvas Everyday Backpack',
      price: '₹1,899',
      priceNum: 1899,
      originalPrice: '₹2,999',
      discount: '37% OFF',
      stock: '3 in stock',
      category: 'Bags & Backpacks',
      sizes: ['20 Litre', '26 Litre'],
      description: 'Heavyweight waxed organic cotton canvas with genuine brass hardware and padded 16-inch laptop pocket.'
    },
    {
      id: 'f-5',
      pillar: 'fashion',
      img: '/assets/figma/c09943dc18b9fd94ea548217fc6535163d66105b.png',
      eta: '15–22 min',
      proximity: 'Circuit House · 1.4 km',
      title: 'Studio Wireless Headphones',
      price: '₹2,499',
      priceNum: 2499,
      originalPrice: '₹3,999',
      discount: '37% OFF',
      stock: '6 in stock',
      category: 'Studio Audio & Wearables',
      sizes: ['Matte Black', 'Sand Grey', 'Forest'],
      description: '40mm custom titanium drivers with hybrid active noise cancellation, transparency mode, and 36-hour continuous battery life.'
    },
    {
      id: 'f-6',
      pillar: 'fashion',
      img: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
      eta: '12–16 min',
      proximity: 'Shade Lab · 0.6 km',
      title: 'Classic Acetate Polarized Sunglasses',
      price: '₹999',
      priceNum: 999,
      originalPrice: '₹1,899',
      discount: '47% OFF',
      stock: '8 in stock',
      category: 'Minimalist Accessories',
      sizes: ['Medium', 'Large'],
      description: 'Handcrafted Italian acetate frames with UV400 polarized scratch-resistant lenses and brass spring hinges.'
    },
    {
      id: 'f-7',
      pillar: 'fashion',
      img: 'https://images.unsplash.com/photo-1638247025967-b4e38f787b76?w=600&auto=format&fit=crop&q=80',
      eta: '15–20 min',
      proximity: 'Sole Street · 0.8 km',
      title: 'Full-Grain Leather Chelsea Boots',
      price: '₹2,899',
      priceNum: 2899,
      originalPrice: '₹4,499',
      discount: '35% OFF',
      stock: '5 in stock',
      category: 'Sneakers & Kicks',
      sizes: ['UK 7', 'UK 8', 'UK 9', 'UK 10'],
      description: 'Supple full-grain oiled pull-up leather with Goodyear-welted rubber lug sole. Rider brings both sizes for doorstep fitting.'
    },
    {
      id: 'f-8',
      pillar: 'fashion',
      img: '/assets/figma/ab30e49ad697ca0a698fae5cf254a0aa951ca0d1.png',
      eta: '10–14 min',
      proximity: 'Circuit House · 1.4 km',
      title: 'Braided Fast-Charging USB-C Cable',
      price: '₹399',
      priceNum: 399,
      originalPrice: '₹699',
      discount: '43% OFF',
      stock: '14 in stock',
      category: 'Studio Audio & Wearables',
      sizes: ['1 Metre', '2 Metre'],
      description: 'Reinforced aramid core with dual-shade nylon braiding, supporting 100W Power Delivery and high-speed data transfer.'
    }
  ];

  // 2. Fresh Grocery Products (8 Curated Items)
  const GROCERY_PRODUCTS = [
    {
      id: 'g-1',
      pillar: 'grocery',
      img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=600&auto=format&fit=crop&q=80',
      eta: '10 min',
      proximity: 'Green Farm Mandi · 0.4 km',
      title: 'Ratnagiri Alphonso Mangoes (GI Tag)',
      weight: '1 kg box (4–5 pcs)',
      price: '₹199',
      priceNum: 199,
      originalPrice: '₹260',
      discount: '23% OFF',
      stock: '18 in stock',
      category: 'Fresh Fruits & Mangoes',
      description: 'Naturally tree-ripened GI-tagged Ratnagiri Alphonso mangoes. Golden aroma, fiber-less creamy pulp with sweet tropical notes.'
    },
    {
      id: 'g-2',
      pillar: 'grocery',
      img: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80',
      eta: '10 min',
      proximity: 'Indiranagar Daily Mart · 0.6 km',
      title: 'Hydroponic Baby Spinach Leaves',
      weight: '250 g bunch',
      price: '₹35',
      priceNum: 35,
      originalPrice: '₹50',
      discount: '30% OFF',
      stock: '12 in stock',
      category: 'Farm-Fresh Veggies',
      description: 'Crisp baby spinach harvested at first dawn from pesticide-free hydroponic farms. Triple-washed and chilled.'
    },
    {
      id: 'g-3',
      pillar: 'grocery',
      img: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=600&auto=format&fit=crop&q=80',
      eta: '10 min',
      proximity: 'Nature Basket Corner · 0.9 km',
      title: 'Free-Range Brown Eggs (Pack of 6)',
      weight: '6 eggs pack',
      price: '₹75',
      priceNum: 75,
      originalPrice: '₹95',
      discount: '21% OFF',
      stock: '20 in stock',
      category: 'Organic Dairy & Eggs',
      description: 'Free-range, grain-fed brown eggs with vibrant rich yolks. Cleaned, graded and packed under strict hygiene standards.'
    },
    {
      id: 'g-4',
      pillar: 'grocery',
      img: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
      eta: '10 min',
      proximity: 'Amul Depot Store · 0.5 km',
      title: 'Amul Gold Full Cream Milk 1L',
      weight: '1 Litre pouch',
      price: '₹66',
      priceNum: 66,
      originalPrice: '₹72',
      discount: '8% OFF',
      stock: '30 in stock',
      category: 'Organic Dairy & Eggs',
      description: 'Pasteurized homogenized cow milk with 6.0% fat and 9.0% SNF. Fresh morning batch kept strictly under 4°C.'
    },
    {
      id: 'g-5',
      pillar: 'grocery',
      img: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=600&auto=format&fit=crop&q=80',
      eta: '10 min',
      proximity: 'Green Farm Mandi · 0.4 km',
      title: 'Ripe Hass Avocados (Pack of 2)',
      weight: '2 pcs (approx 350g)',
      price: '₹180',
      priceNum: 180,
      originalPrice: '₹240',
      discount: '25% OFF',
      stock: '14 in stock',
      category: 'Fresh Fruits & Mangoes',
      description: 'Creamy, nutty Hass avocados ready to eat. Perfect for sourdough guacamole, smoothies, and salads.'
    },
    {
      id: 'g-6',
      pillar: 'grocery',
      img: 'https://images.unsplash.com/photo-1589367920969-ab8e050bbb04?w=600&auto=format&fit=crop&q=80',
      eta: '10 min',
      proximity: 'Baker\'s Pride · 0.7 km',
      title: 'Artisanal Country Sourdough Loaf',
      weight: '400 g loaf',
      price: '₹120',
      priceNum: 120,
      originalPrice: '₹160',
      discount: '25% OFF',
      stock: '8 in stock',
      category: 'Artisanal Bakery',
      description: 'Naturally leavened with wild yeast starter, cold-fermented for 36 hours. Open airy crumb and blistered golden crust.'
    },
    {
      id: 'g-7',
      pillar: 'grocery',
      img: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
      eta: '10 min',
      proximity: 'Organic Root · 1.1 km',
      title: 'Cold-Pressed Virgin Coconut Oil',
      weight: '500 ml glass bottle',
      price: '₹240',
      priceNum: 240,
      originalPrice: '₹320',
      discount: '25% OFF',
      stock: '11 in stock',
      category: 'Cold-Pressed & Pure Oils',
      description: 'Traditional wood-pressed from fresh coconut milk without chemical processing or heat. Multi-use for cooking and hair.'
    },
    {
      id: 'g-8',
      pillar: 'grocery',
      img: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80',
      eta: '10 min',
      proximity: 'Amul Depot Store · 0.5 km',
      title: 'Fresh Malai Paneer (Vacuum Packed)',
      weight: '200 g pack',
      price: '₹90',
      priceNum: 90,
      originalPrice: '₹110',
      discount: '18% OFF',
      stock: '25 in stock',
      category: 'Organic Dairy & Eggs',
      description: 'Super soft, melt-in-mouth cottage cheese crafted from pure milk. Sealed fresh with zero water additives.'
    }
  ];

  // 3. Local Food & Kitchens (8 Curated Items)
  const FOOD_PRODUCTS = [
    {
      id: 'fd-1',
      pillar: 'food',
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80',
      eta: '20–30 min',
      proximity: '12th Main Indiranagar · 1.2 km',
      title: 'Pizza Palace Originals',
      cuisine: 'Italian & Wood-Fired Pizza',
      rating: '4.8',
      price: '₹420 avg',
      priceNum: 420,
      originalPrice: '₹550',
      discount: '23% OFF',
      stock: 'Kitchen Active',
      category: 'Wood-Fired Pizza',
      offer: 'Flat 20% OFF',
      description: 'Slow-fermented 48-hour sourdough crusts baked at 450°C in a stone oven with San Marzano tomatoes and fior di latte mozzarella.'
    },
    {
      id: 'fd-2',
      pillar: 'food',
      img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80',
      eta: '15–25 min',
      proximity: '100ft Road · 0.8 km',
      title: 'The Double Smash Burger',
      cuisine: 'Gourmet Burgers & Crisp Fries',
      rating: '4.9',
      price: '₹280 avg',
      priceNum: 280,
      originalPrice: '₹350',
      discount: '20% OFF',
      stock: 'Kitchen Active',
      category: 'Gourmet Smash Burgers',
      offer: 'Combos from ₹249',
      description: 'Crisp seared double smash patties tucked inside freshly toasted house brioche buns with sharp cheddar and caramelized onions.'
    },
    {
      id: 'fd-3',
      pillar: 'food',
      img: 'https://images.unsplash.com/photo-1534422298391-e4f8596ddcd8?w=600&auto=format&fit=crop&q=80',
      eta: '12–18 min',
      proximity: 'Double Road Corner · 0.5 km',
      title: 'Himalayan Steamed Momos',
      cuisine: 'Tibetan & Darjeeling Dumplings',
      rating: '4.9',
      price: '₹190 avg',
      priceNum: 190,
      originalPrice: '₹240',
      discount: '20% OFF',
      stock: 'Kitchen Active',
      category: 'Authentic Momos',
      offer: 'Free red chili dip',
      description: 'Thin hand-rolled translucent wrappers filled with minced chicken or organic herbs, steamed fresh over bamboo baskets.'
    },
    {
      id: 'fd-4',
      pillar: 'food',
      img: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80',
      eta: '25–35 min',
      proximity: 'CMH Road Hub · 1.8 km',
      title: 'Nizam Dum Biryani & Kebabs',
      cuisine: 'Hyderabadi Slow Coal Dum',
      rating: '4.7',
      price: '₹360 avg',
      priceNum: 360,
      originalPrice: '₹450',
      discount: '20% OFF',
      stock: 'Kitchen Active',
      category: 'Healthy Greens & Bowls',
      offer: 'Free Mirchi Ka Salan',
      description: 'Aromatic long-grain basmati rice and tender spiced cuts slow-cooked in hand-sealed copper degs over gentle coal heat.'
    },
    {
      id: 'fd-5',
      pillar: 'food',
      img: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=600&auto=format&fit=crop&q=80',
      eta: '10–15 min',
      proximity: 'Blue Tokai Corner · 0.7 km',
      title: 'Cold Brew Reserve & Croissants',
      cuisine: 'Specialty Artisan Roasters',
      rating: '4.9',
      price: '₹180 avg',
      priceNum: 180,
      originalPrice: '₹220',
      discount: '18% OFF',
      stock: 'Barista Ready',
      category: 'Specialty Brews & Cafes',
      offer: 'Single-Estate Beans',
      description: '18-hour cold steeped single-estate Arabica with bold cacao notes, served chilled with flaky butter pastries.'
    },
    {
      id: 'fd-6',
      pillar: 'food',
      img: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80',
      eta: '15–20 min',
      proximity: 'Green Fork Cafe · 1.0 km',
      title: 'Mediterranean Mezze & Falafel Bowl',
      cuisine: 'Healthy Mediterranean Bowls',
      rating: '4.8',
      price: '₹260 avg',
      priceNum: 260,
      originalPrice: '₹320',
      discount: '19% OFF',
      stock: 'Kitchen Active',
      category: 'Healthy Greens & Bowls',
      offer: 'Extra Tahini Free',
      description: 'Crisp herbed falafels, smoked paprika hummus, pickled kalamata olives, tabbouleh and warm pita bread.'
    },
    {
      id: 'fd-7',
      pillar: 'food',
      img: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      eta: '12–18 min',
      proximity: 'Baker\'s Pride · 0.7 km',
      title: 'Belgian Dark Truffle Cake Slice',
      cuisine: 'French Patisserie & Desserts',
      rating: '4.9',
      price: '₹310 avg',
      priceNum: 310,
      originalPrice: '₹380',
      discount: '18% OFF',
      stock: 'Fresh Batch',
      category: 'Artisan Desserts',
      offer: 'Made with 70% Callebaut',
      description: 'Dense dark chocolate sponge layered with 70% Belgian chocolate ganache and dusted with Dutch cocoa powder.'
    },
    {
      id: 'fd-8',
      pillar: 'food',
      img: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600&auto=format&fit=crop&q=80',
      eta: '10–15 min',
      proximity: 'Cafe Kissa · 0.9 km',
      title: 'Ceremonial Iced Matcha Latte',
      cuisine: 'Japanese Teas & Specialty Cafes',
      rating: '4.8',
      price: '₹210 avg',
      priceNum: 210,
      originalPrice: '₹260',
      discount: '19% OFF',
      stock: 'Barista Ready',
      category: 'Specialty Brews & Cafes',
      offer: 'Oat Milk Available',
      description: 'Whisked ceremonial Uji matcha layered over chilled creamy oat milk with a hint of natural Madagascar vanilla.'
    }
  ];

  // Active items for Section 2 based on pillar and optional subcategory
  const currentPillarProducts = activePillar === 'fashion' 
    ? FASHION_PRODUCTS 
    : (activePillar === 'grocery' ? GROCERY_PRODUCTS : FOOD_PRODUCTS);

  const activeProducts = currentPillarProducts
    .filter(p => selectedSubCategory === 'all' || p.category === selectedSubCategory)
    .filter(p => {
      if (!hubSearchQuery.trim()) return true;
      const q = hubSearchQuery.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.category && p.category.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.proximity && p.proximity.toLowerCase().includes(q))
      );
    });

  const activeCategories = PILLAR_CATEGORIES[activePillar] || PILLAR_CATEGORIES.fashion;

  // Hero Card Data based on Active Pillar
  const HERO_SHOWCASE = {
    fashion: {
      img: '/assets/figma/311dc7aa90e42be8259e331fab46398d84d04f16.png',
      tag: '10-Min Doorstep Trial · Sole Street · 0.8 km',
      title: 'A fresh pair. A local affair.',
      sub: 'Sole Street · Indiranagar · 12–18 min · 2-Size Trial Eligible',
      product: FASHION_PRODUCTS[0]
    },
    grocery: {
      img: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=800&auto=format&fit=crop&q=80',
      tag: '10-Min Farm Dispatch · Green Farm Mandi · 0.4 km',
      title: 'Harvested at 5 AM. On your table in 10m.',
      sub: 'Green Farm Mandi · Indiranagar · 10 min · Temperature Controlled',
      product: GROCERY_PRODUCTS[0]
    },
    food: {
      img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80',
      tag: 'Stone-Baked Sourdough · Pizza Palace · 1.2 km',
      title: 'Blistered crust at 450°C. Sizzling at your door.',
      sub: '12th Main Indiranagar · 20 min · Insulated Thermal Delivery',
      product: FOOD_PRODUCTS[0]
    }
  };

  const currentHeroShowcase = HERO_SHOWCASE[activePillar] || HERO_SHOWCASE.fashion;

  return (
    <div className="figma-landing-root">
      <div className="figma-container">

        {/* ==================================================================
            SECTION 0: NAVIGATION — Premium Glassmorphic Hyperlocal Navbar
            ================================================================== */}
        <header className={`figma-nav${navScrolled ? ' scrolled' : ''}`}>
          {/* Left: Brand Identity & Active Hub Pill */}
          <div className="figma-nav-brand-group">
            <div 
              className="figma-brand-lockup" 
              onClick={() => { playClickSound(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              title="Nivvo — Hyperlocal 10-Min Commerce"
            >
              <div className="figma-brand-symbol">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div className="figma-brand-text-block">
                <span className="figma-brand-wordmark">nivvo</span>
                <span className="figma-brand-micro-tag">HYPERLOCAL</span>
              </div>
            </div>

            {/* Hyperlocal Live Location Context Pill */}
            <button 
              className="figma-nav-location-pill"
              onClick={() => { playClickSound(); setShowLocationModal(true); }}
              title="Change Delivery Neighbourhood"
            >
              <span className="figma-nav-location-pulse">
                <span className="figma-pulse-ring" />
                <span className="figma-pulse-dot" />
              </span>
              <MapPin size={13} className="figma-loc-pin-icon" />
              <span className="figma-nav-location-text">{activeLocationLabel.split(',')[0]}</span>
              <span className="figma-nav-location-badge">10m Hub</span>
              <ChevronDown size={12} className="figma-loc-chevron" />
            </button>
          </div>

          {/* Center: Page Navigation Tabs */}
          <nav className="figma-nav-links">
            <button
              className={`figma-nav-link${activePillar === 'fashion' ? ' active' : ''}`}
              onClick={() => handlePillarChange('fashion')}
            >
              <span>Fashion &amp; Lifestyle</span>
            </button>
            <button
              className={`figma-nav-link${activePillar === 'grocery' ? ' active' : ''}`}
              onClick={() => handlePillarChange('grocery')}
            >
              <span>Grocery</span>
              <span className="figma-nav-link-badge">10 min</span>
            </button>
            <button
              className={`figma-nav-link${activePillar === 'food' ? ' active' : ''}`}
              onClick={() => handlePillarChange('food')}
            >
              <span>Food &amp; Cafes</span>
            </button>
            <button
              className="figma-nav-link"
              onClick={() => { playClickSound(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <span>How It Works</span>
            </button>
            <button
              className="figma-nav-link"
              onClick={() => { playClickSound(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}
            >
              <span>Reviews</span>
            </button>
            <button
              className="figma-nav-link figma-nav-link-merchant"
              onClick={() => { playClickSound(); setShowMerchantModal(true); }}
            >
              <Store size={13} />
              <span>For Shops</span>
            </button>
          </nav>

          {/* Right: Actions — Note: Seller Login is placed in the footer, NOT here */}
          <div className="figma-nav-actions">
            {/* Bag trigger if items in cart */}
            {totalCartCount > 0 && (
              <button
                className="figma-nav-cart-btn"
                onClick={() => { playClickSound(); if (onNavigateBag) onNavigateBag(); }}
                title="View Bag"
              >
                <ShoppingBag size={16} />
                <span className="figma-nav-cart-badge">{totalCartCount}</span>
              </button>
            )}

            {/* User Profile or Sign In */}
            {currentUser ? (
              <button
                className="figma-nav-user-btn"
                onClick={() => { playClickSound(); if (onNavigateProfile) onNavigateProfile(); }}
                title="Your Account"
              >
                <div className="figma-nav-avatar">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="figma-nav-username">{currentUser.name || 'Account'}</span>
              </button>
            ) : (
              <button
                className="figma-nav-signin"
                onClick={() => { playClickSound(); if (onOpenAuth) onOpenAuth('customer'); }}
                title="Customer Login"
              >
                <User size={14} />
                <span>Customer Login</span>
              </button>
            )}

            {/* Primary Action Button */}
            <button
              className="figma-btn-primary"
              onClick={() => { playClickSound(); setShowLocationModal(true); }}
            >
              <span>Find My Neighbourhood</span>
              <ArrowUpRight size={16} />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button 
              className="figma-nav-mobile-toggle"
              onClick={() => { playClickSound(); setMobileMenuOpen(!mobileMenuOpen); }}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </header>

        {/* Mobile Slide-down Menu Drawer */}
        {mobileMenuOpen && (
          <div className="figma-nav-mobile-drawer">
            <div className="figma-mobile-nav-inner">
              <div className="figma-mobile-location-row" onClick={() => { setShowLocationModal(true); setMobileMenuOpen(false); }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={16} color="#24452D" />
                  <span style={{ fontWeight: 700, color: '#1a3622' }}>{activeLocationLabel}</span>
                </div>
                <span className="figma-mobile-loc-change">Change</span>
              </div>

              <div className="figma-mobile-links">
                <button 
                  className={`figma-mobile-link${activePillar === 'fashion' ? ' active' : ''}`}
                  onClick={() => { handlePillarChange('fashion'); setMobileMenuOpen(false); }}
                >
                  <ShoppingBag size={16} />
                  <span>Fashion &amp; Lifestyle (2-Size Trial)</span>
                </button>
                <button 
                  className={`figma-mobile-link${activePillar === 'grocery' ? ' active' : ''}`}
                  onClick={() => { handlePillarChange('grocery'); setMobileMenuOpen(false); }}
                >
                  <Apple size={16} />
                  <span>Grocery</span>
                  <span className="figma-nav-link-badge">10 min</span>
                </button>
                <button 
                  className={`figma-mobile-link${activePillar === 'food' ? ' active' : ''}`}
                  onClick={() => { handlePillarChange('food'); setMobileMenuOpen(false); }}
                >
                  <Utensils size={16} />
                  <span>Food &amp; Cafes</span>
                </button>
                <button 
                  className="figma-mobile-link"
                  onClick={() => { setMobileMenuOpen(false); playClickSound(); if (onOpenAuth) onOpenAuth('customer'); }}
                >
                  <User size={16} />
                  <span>Customer Login</span>
                </button>
                <button 
                  className="figma-mobile-link"
                  onClick={() => { setMobileMenuOpen(false); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <Sparkles size={16} />
                  <span>How Local Delivery Works</span>
                </button>
                <button 
                  className="figma-mobile-link"
                  onClick={() => { setMobileMenuOpen(false); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  <Star size={16} />
                  <span>Customer Reviews</span>
                </button>
                <button 
                  className="figma-mobile-link"
                  onClick={() => { setMobileMenuOpen(false); setShowMerchantModal(true); }}
                >
                  <Store size={16} />
                  <span>Partner with Nivvo (For Shops)</span>
                </button>
              </div>

              <div className="figma-mobile-actions">
                <button 
                  className="figma-btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => { setShowLocationModal(true); setMobileMenuOpen(false); }}
                >
                  <span>Explore {activeLocationLabel.split(',')[0]}</span>
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================
            SECTION 0: HERO — Adaptive Hyperlocal Showcase
            ================================================================== */}
        <section className="figma-hero">
          {/* Left Column: Hero Copy */}
          <div className="figma-hero-copy">

            {/* Live trust pill */}
            <div className="figma-hero-trust-pill">
              <div className="figma-hero-trust-pill-dot" />
              <span>Instant 10-Minute Dispatch · Live in 14 Bengaluru Hubs</span>
            </div>

            <h1 className="figma-hero-headline">
              {"Your neighbourhood.\n"}<span className="accent">Delivered in 10 mins.</span>
            </h1>

            <p className="figma-hero-intro">
              Trending sneakers, steam-pressed fashion with 2-size trial, farm-fresh grocery, and artisan cafes — all sourced from local stores within 2 km.
            </p>

            {/* Location Discovery Form */}
            <div className="figma-location-discovery" style={{ position: 'relative' }}>
              <form className="figma-location-field" onSubmit={handleHeroLocationSubmit}>
                <div className="figma-location-prompt">
                  <MapPin size={18} />
                  <input
                    type="text"
                    className="figma-location-input"
                    placeholder="Enter your area or PIN code (e.g. Indiranagar)"
                    value={heroLocationInput}
                    onFocus={() => setShowLocationDropdown(true)}
                    onChange={(e) => {
                      setHeroLocationInput(e.target.value);
                      setShowLocationDropdown(true);
                    }}
                  />
                </div>
                <button type="submit" className="figma-btn-primary">
                  <span>Discover nearby</span>
                  <ArrowUpRight size={16} />
                </button>
              </form>

              {/* Autocomplete Dropdown */}
              {showLocationDropdown && (
                <div className="figma-location-dropdown">
                  <div className="figma-location-dropdown-header">
                    <span>Verified 10-Minute Dark Store Hubs</span>
                  </div>
                  {BENGALURU_HUBS.filter(h => 
                    !heroLocationInput.trim() || 
                    h.name.toLowerCase().includes(heroLocationInput.toLowerCase()) || 
                    h.pin.includes(heroLocationInput)
                  ).map((hub) => (
                    <div
                      key={hub.name}
                      className="figma-location-dropdown-item"
                      onClick={() => {
                        handleSelectQuickHub(hub.name, hub.pin);
                        setShowLocationDropdown(false);
                      }}
                    >
                      <div className="figma-location-item-main">
                        <MapPin size={15} color="#24452D" />
                        <div>
                          <span className="figma-location-item-name">{hub.name}</span>
                          <span className="figma-location-item-pin">({hub.pin}) · {hub.landmark}</span>
                        </div>
                      </div>
                      <span className="figma-location-item-eta">{hub.eta}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Location Assistance Row */}
              <div className="figma-location-assistance">
                <button type="button" className="figma-use-current-location" onClick={handleUseCurrentLocation}>
                  <LocateFixed size={13} />
                  <span>Use my current location</span>
                </button>
                <span
                  className="figma-availability-text"
                  onClick={() => { playClickSound(); document.getElementById('hyperlocal-hub')?.scrollIntoView({ behavior: 'smooth' }); }}
                >
                  Explore {activeLocationLabel}
                </span>
              </div>

              {/* Quick Area Filter Pills */}
              <div className="figma-hero-quick-hubs">
                <span className="figma-quick-hubs-label">Popular Hubs:</span>
                {[
                  { name: 'Indiranagar', pin: '560038' },
                  { name: 'Koramangala', pin: '560034' },
                  { name: 'HSR Layout', pin: '560102' },
                  { name: 'Jayanagar', pin: '560041' },
                  { name: 'Whitefield', pin: '560066' }
                ].map((hub) => (
                  <button
                    key={hub.name}
                    type="button"
                    className={`figma-quick-hub-chip ${activeLocationLabel.includes(hub.name) ? 'active' : ''}`}
                    onClick={() => handleSelectQuickHub(hub.name, hub.pin)}
                  >
                    {hub.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Delivery note */}
            <div className="figma-responsible-delivery">
              <Timer size={16} />
              <p>
                From ~10 min on eligible nearby finds. Free 2-size trial: try both sizes at home, keep what fits!
              </p>
            </div>
          </div>

          {/* Right Column: Dynamic Editorial Showcase Card based on Active Pillar */}
          <div className="figma-hero-editorial-feature">
            <img 
              src={currentHeroShowcase.img} 
              alt={currentHeroShowcase.title} 
            />

            {/* Top Proximity Tag */}
            <div className="figma-hero-feature-tag">
              <MapPin size={14} />
              <span>{currentHeroShowcase.tag}</span>
            </div>

            {/* Bottom Caption Card */}
            <div 
              className="figma-hero-product-caption"
              onClick={() => {
                playClickSound();
                setShowProductModal(currentHeroShowcase.product);
              }}
            >
              <div className="figma-hero-product-caption-row">
                <h3>{currentHeroShowcase.title}</h3>
                <ArrowUpRight size={24} />
              </div>
              <p>{currentHeroShowcase.sub}</p>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 0: SHOPPING REASSURANCE (13:3365) — 1440x72
            ================================================================== */}
        <div className="figma-reassurance-bar">
          <div className="figma-reassurance-item">
            <div className="figma-reassurance-item-icon"><Store size={18} /></div>
            <div className="figma-reassurance-item-text">
              <span className="figma-reassurance-item-title">2,400+ Local Stores</span>
              <span className="figma-reassurance-item-sub">Curated boutiques &amp; local shops</span>
            </div>
          </div>
          <div className="figma-reassurance-item">
            <div className="figma-reassurance-item-icon" style={{ background: 'linear-gradient(135deg, #DCFCE7, #BBF7D0)' }}><Zap size={18} color="#0C831F" /></div>
            <div className="figma-reassurance-item-text">
              <span className="figma-reassurance-item-title">10-Minute Dark Dispatch</span>
              <span className="figma-reassurance-item-sub">Pre-steamed &amp; garment sealed</span>
            </div>
          </div>
          <div className="figma-reassurance-item">
            <div className="figma-reassurance-item-icon" style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}><RefreshCw size={18} color="#92400E" /></div>
            <div className="figma-reassurance-item-text">
              <span className="figma-reassurance-item-title">Doorstep 2-Size Trial</span>
              <span className="figma-reassurance-item-sub">Try both sizes free at your door</span>
            </div>
          </div>
          <div className="figma-reassurance-item">
            <div className="figma-reassurance-item-icon"><ReceiptText size={18} /></div>
            <div className="figma-reassurance-item-text">
              <span className="figma-reassurance-item-title">Direct Store Invoicing</span>
              <span className="figma-reassurance-item-sub">Authentic MRP, GST &amp; FSSAI bill</span>
            </div>
          </div>
        </div>

        {/* ==================================================================
            SECTION 1: HYPERLOCAL THREE-PILLAR STUDIO (Grocery, Food, Fashion)
            Dedicated Interactive Experience with Dynamic Content Switcher
            ================================================================== */}
        <section className="figma-hub-section" id="hyperlocal-hub">
          <div className="figma-hub-header">
            <span className="figma-eyebrow">HYPERLOCAL THREE-PILLAR DISCOVERY</span>
            <h2 className="figma-section-headline">
              {activePillar === 'fashion' && "Fashion & Lifestyle. Ready to Wear in 10 Mins."}
              {activePillar === 'grocery' && "Fresh Farm Grocery. Cold-Chain at Your Door."}
              {activePillar === 'food' && "Sizzling Local Kitchens. Delivered Fresh & Hot."}
            </h2>
            <p className="figma-hub-subtitle">
              {activePillar === 'fashion' && "Steam-ironed shirts, trending sneakers, and accessories with free doorstep 2-size trial from boutiques near you."}
              {activePillar === 'grocery' && "Handpicked Alphonso mangoes, organic greens, dairy, and farm eggs sourced at 5 AM and delivered in 10 minutes."}
              {activePillar === 'food' && "Wood-fired stone pizzas, smash burgers, dumplings, and single-estate cold brews dispatched in thermal packs."}
            </p>

            {/* Master 3-Pillar Segmented Switcher */}
            <div className="figma-hub-tabs-container">
              <div className="figma-hub-tabs">
                <button
                  className={`figma-hub-tab ${activePillar === 'fashion' ? 'active' : ''}`}
                  onClick={() => handlePillarChange('fashion')}
                >
                  <ShoppingBag size={17} />
                  <span>Fashion &amp; Lifestyle</span>
                  <span className="figma-hub-tab-badge">2-Size Trial</span>
                </button>
                <button
                  className={`figma-hub-tab ${activePillar === 'grocery' ? 'active' : ''}`}
                  onClick={() => handlePillarChange('grocery')}
                >
                  <Apple size={17} />
                  <span>Grocery</span>
                  <span className="figma-hub-tab-badge lime">10 min</span>
                </button>
                <button
                  className={`figma-hub-tab ${activePillar === 'food' ? 'active' : ''}`}
                  onClick={() => handlePillarChange('food')}
                >
                  <Utensils size={17} />
                  <span>Food &amp; Cafes</span>
                  <span className="figma-hub-tab-badge amber">Fresh &amp; Hot</span>
                </button>
              </div>
            </div>

            {/* Live Search Bar for Current Pillar */}
            <div className="figma-hub-search-container">
              <div className="figma-hub-search-input-wrap">
                <Search size={16} className="figma-hub-search-icon" />
                <input
                  type="text"
                  className="figma-hub-search-input"
                  placeholder={
                    activePillar === 'fashion' 
                      ? 'Search sneakers, shirts, streetwear in Indiranagar...' 
                      : (activePillar === 'grocery' 
                          ? 'Search fresh fruits, veggies, dairy, cold-pressed oils...' 
                          : 'Search artisan pizza, smash burgers, momos, specialty coffee...')
                  }
                  value={hubSearchQuery}
                  onChange={(e) => setHubSearchQuery(e.target.value)}
                />
                {hubSearchQuery && (
                  <button 
                    type="button" 
                    className="figma-hub-search-clear"
                    onClick={() => setHubSearchQuery('')}
                    title="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
              {hubSearchQuery && (
                <div className="figma-hub-search-results-info">
                  <span>Found <strong>{activeProducts.length}</strong> items matching "{hubSearchQuery}"</span>
                  <button 
                    type="button" 
                    style={{ background: 'none', border: 'none', color: '#15803D', fontWeight: 600, cursor: 'pointer', fontSize: '12px' }}
                    onClick={() => setHubSearchQuery('')}
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Dynamic Sub-Category Pills for Active Pillar */}
            <div className="figma-subcat-pills-row">
              {activeCategories.map(cat => (
                <button
                  key={cat.id}
                  className={`figma-subcat-pill ${selectedSubCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    playClickSound();
                    setSelectedSubCategory(cat.id);
                  }}
                >
                  <span className="figma-subcat-name">{cat.name}</span>
                  {cat.count && <span className="figma-subcat-count">{cat.count.split(' ')[0]}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic 4-Column Responsive Product Grid */}
          <div className="figma-product-grid">
            {activeProducts.length === 0 ? (
              <div className="figma-hub-empty-state">
                <Search size={32} color="#71826E" />
                <h4 className="figma-hub-empty-title">No products found matching "{hubSearchQuery}"</h4>
                <p className="figma-hub-empty-desc">
                  Try checking your spelling or explore one of our popular categories above.
                </p>
                <button
                  type="button"
                  className="figma-btn-primary"
                  style={{ height: '38px', padding: '0 18px', fontSize: '13px' }}
                  onClick={() => { setHubSearchQuery(''); setSelectedSubCategory('all'); }}
                >
                  <span>View All {activePillar === 'fashion' ? 'Fashion' : (activePillar === 'grocery' ? 'Grocery' : 'Food')} Items</span>
                </button>
              </div>
            ) : (
              activeProducts.map((prod) => {
                const inBagItem = cart.find(c => c.id === prod.id);
                return (
                  <div 
                    key={prod.id} 
                    className="figma-product-card"
                    onClick={() => {
                      playClickSound();
                      setShowProductModal(prod);
                    }}
                  >
                    {inBagItem && (
                      <div className="figma-in-bag-indicator">
                        <Check size={11} />
                        <span>In Bag ({inBagItem.quantity || 1})</span>
                      </div>
                    )}
                    <div className="figma-product-image-wrap">
                      <img src={prod.img} alt={prod.title} loading="lazy" />
                      
                      {/* Delivery ETA Badge */}
                      <div className="figma-product-eta-tag">
                        <Timer size={13} />
                        <span>{prod.eta}</span>
                      </div>

                      {/* Discount or Rating Badge */}
                      {prod.discount && (
                        <div className="figma-product-discount-tag">
                          {prod.discount}
                        </div>
                      )}

                      {prod.rating && (
                        <div className="figma-product-rating-tag">
                          <Star size={12} />
                          <span>{prod.rating}</span>
                        </div>
                      )}

                      {/* Stock Tag */}
                      <div className="figma-product-stock-pill">
                        {prod.stock}
                      </div>
                    </div>

                    <div className="figma-product-info">
                      <div className="figma-product-proximity">
                        <MapPin size={12} />
                        <span>{prod.proximity}</span>
                      </div>
                      <h3 className="figma-product-title">{prod.title}</h3>
                      
                      <div className="figma-product-price-row">
                        <div className="figma-price-group">
                          <span className="figma-product-price">{prod.price}</span>
                          {prod.originalPrice && (
                            <span className="figma-product-orig-price">{prod.originalPrice}</span>
                          )}
                        </div>
                        {prod.weight && (
                          <span className="figma-product-weight-badge">{prod.weight}</span>
                        )}
                      </div>

                      {/* Instant Action Row */}
                      <div className="figma-product-card-actions" onClick={e => e.stopPropagation()}>
                        {activePillar === 'fashion' && (
                          <button
                            className="figma-card-trial-btn"
                            onClick={() => {
                              playTrialSound();
                              addToCart({ ...prod, size: prod.sizes ? prod.sizes[0] : 'Free Size', isTrial: true });
                              showToast(`Added 2-Size Trial for ${prod.title} to bag!`);
                            }}
                          >
                            <RefreshCw size={13} />
                            <span>Try 2 Sizes</span>
                          </button>
                        )}

                        <button
                          className={`figma-card-add-btn${inBagItem ? ' in-cart' : ''}`}
                          onClick={() => {
                            playAddSound();
                            addToCart({ ...prod, size: prod.sizes ? prod.sizes[0] : 'Standard' });
                            showToast(`Added ${prod.title} to bag!`);
                          }}
                          title="Add to Bag"
                        >
                          {inBagItem ? <Check size={14} /> : <Plus size={15} />}
                          <span>{inBagItem ? 'In Bag' : (activePillar === 'fashion' ? 'Bag' : (activePillar === 'grocery' ? 'Add to Cart' : 'Order'))}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Pillar Spotlight Feature Banner */}
          {activePillar === 'fashion' && (
            <div className="figma-spotlight-card fashion">
              <div className="figma-spotlight-copy">
                <span className="figma-spotlight-tag">EXCLUSIVE 10-MIN WARDROBE</span>
                <h3>The 2-Minute Doorstep Trial Studio</h3>
                <p>Never guess whether you're an M or an L. Your rider carries both sizes in anti-crease garment bags. Try them on in comfort at your door, keep the perfect fit, and hand back the other with zero return paperwork!</p>
                <div className="figma-spotlight-highlights">
                  <span><Check size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} /> 120°C Steam Ironed</span>
                  <span><Check size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} /> Zero Return Fees</span>
                  <span><Check size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} /> 40+ Dark Stores in Bengaluru</span>
                </div>
              </div>
              <button 
                className="figma-btn-primary"
                onClick={() => {
                  playClickSound();
                  document.getElementById('hyperlocal-hub')?.scrollIntoView({ behavior: 'smooth' });
                  showToast('Showing all 450+ styles eligible for 2-size trial');
                }}
              >
                <span>Browse Trial Outfits</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}

          {activePillar === 'grocery' && (
            <div className="figma-spotlight-card grocery">
              <div className="figma-spotlight-copy">
                <span className="figma-spotlight-tag">FARM MANDI TO DOORSTEP</span>
                <h3>Harvested at 5 AM. On Your Table in 10 Minutes.</h3>
                <p>We skip the central distribution warehouse. Your produce is picked from local farmer mandis and hydroponic centers in the morning, cold-chain packaged in 120 seconds, and dispatched immediately to keep crispness locked in.</p>
                <div className="figma-spotlight-highlights">
                  <span><Check size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} /> 100% Unadulterated Produce</span>
                  <span><Check size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} /> Strict 4°C Cold Chain</span>
                  <span><Check size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} /> Verified Mandi Wholesale Rates</span>
                </div>
              </div>
              <button 
                className="figma-btn-primary"
                onClick={() => {
                  playClickSound();
                  if (onNavigateGrocery) onNavigateGrocery();
                  else showToast('Opening Full 600+ Mandi Catalogue');
                }}
              >
                <span>Explore Full Mandi</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}

          {activePillar === 'food' && (
            <div className="figma-spotlight-card food">
              <div className="figma-spotlight-copy">
                <span className="figma-spotlight-tag">ARTISAN KITCHENS &amp; CAFES</span>
                <h3>Thermal-Insulated Delivery from Local Chefs</h3>
                <p>Enjoy piping-hot sourdough pizzas, crisp smash burgers, and fresh Himalayan momos direct from certified local kitchens. Custom thermal transport containers ensure pizzas don't turn soggy and cold brews stay frost-chilled.</p>
                <div className="figma-spotlight-highlights">
                  <span><Check size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} /> 5-Star FSSAI Hygiene Certified</span>
                  <span><Check size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} /> Direct Kitchen Dispatch (No Multiple Drops)</span>
                  <span><Check size={13} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-1px' }} /> Sourdoughs, Burgers &amp; Specialty Brews</span>
                </div>
              </div>
              <button 
                className="figma-btn-primary"
                onClick={() => {
                  playClickSound();
                  if (onNavigateFood) onNavigateFood();
                  else showToast('Opening Food & Cafe Menus');
                }}
              >
                <span>Explore Neighbourhood Kitchens</span>
                <ArrowUpRight size={16} />
              </button>
            </div>
          )}
        </section>

        {/* ==================================================================
            SECTION 2: HOW NIVVO WORKS — Streamlined 3-Step Process
            ================================================================== */}
        <section className="figma-section-how-it-works" id="how-it-works">
          <div className="figma-section-how-intro">
            <div className="figma-section-intro-copy">
              <span className="figma-eyebrow">HYPERLOCAL PRECISION</span>
              <h2 className="figma-section-headline">How 10-Minute Delivery Actually Works</h2>
            </div>
            <span className="figma-section-note">Speed without compromise. Honest estimates.</span>
          </div>

          <div className="figma-steps-row">
            <div className="figma-step-card">
              <div className="figma-step-marker">
                <div className="figma-step-icon-box">
                  <MapPin size={22} />
                </div>
                <span className="figma-step-number">01</span>
              </div>
              <h3 className="figma-step-title">Discover Stores Within 2 KM</h3>
              <p className="figma-step-description">
                Your feed only shows in-stock garments, fresh mandi produce, and active kitchens located right in your neighbourhood.
              </p>
            </div>

            <div className="figma-step-card">
              <div className="figma-step-marker">
                <div className="figma-step-icon-box">
                  <PackageCheck size={22} />
                </div>
                <span className="figma-step-number">02</span>
              </div>
              <h3 className="figma-step-title">120-Second Swift Dispatch</h3>
              <p className="figma-step-description">
                Fashion items are steam-ironed at 120°C, groceries packed in cold bags, and food packed in thermal insulated boxes.
              </p>
            </div>

            <div className="figma-step-card">
              <div className="figma-step-marker">
                <div className="figma-step-icon-box">
                  <Bike size={22} />
                </div>
                <span className="figma-step-number">03</span>
              </div>
              <h3 className="figma-step-title">Doorstep Arrival &amp; 2-Size Trial</h3>
              <p className="figma-step-description">
                Local riders reach your doorstep in minutes. Try both sizes, inspect produce freshness, and hand back what you don't need!
              </p>
            </div>
          </div>

          {/* Real-time Dispatch Simulator */}
          {DISPATCH_SIMULATION[calcHub] && (
            <div className="figma-dispatch-simulator">
              <div className="figma-dispatch-sim-header">
                <div className="figma-dispatch-sim-title">
                  <h3>Live Dark-Dispatch Route Simulator</h3>
                  <p>Select your Bengaluru micro-hub to inspect real-time dispatch parameters and transit breakdown.</p>
                </div>
                <div className="figma-dispatch-sim-hubs">
                  {Object.keys(DISPATCH_SIMULATION).map((hub) => (
                    <button
                      key={hub}
                      type="button"
                      className={`figma-dispatch-hub-pill ${calcHub === hub ? 'active' : ''}`}
                      onClick={() => {
                        playClickSound();
                        setCalcHub(hub);
                      }}
                    >
                      {hub}
                    </button>
                  ))}
                </div>
              </div>

              <div className="figma-dispatch-pipeline">
                <div className="figma-pipeline-step">
                  <span className="figma-pipeline-step-time">T + 00:00</span>
                  <h4 className="figma-pipeline-step-title">Order Assigned</h4>
                  <p className="figma-pipeline-step-desc">
                    Matched to nearest merchant ({DISPATCH_SIMULATION[calcHub].distance}) via automated route planner.
                  </p>
                </div>

                <div className="figma-pipeline-step">
                  <span className="figma-pipeline-step-time">T + 02:00</span>
                  <h4 className="figma-pipeline-step-title">Dark Dispatch Pack</h4>
                  <p className="figma-pipeline-step-desc">
                    Steam-ironed / cold-packed at store in {DISPATCH_SIMULATION[calcHub].darkStoreTime}. Handed to rider.
                  </p>
                </div>

                <div className="figma-pipeline-step active">
                  <span className="figma-pipeline-step-time">T + 08:00</span>
                  <h4 className="figma-pipeline-step-title">Electric Transit</h4>
                  <p className="figma-pipeline-step-desc">
                    GPS-tracked transit in {DISPATCH_SIMULATION[calcHub].transitTime} through dedicated neighbourhood routes.
                  </p>
                </div>

                <div className="figma-pipeline-step">
                  <span className="figma-pipeline-step-time">T + {DISPATCH_SIMULATION[calcHub].totalEta}</span>
                  <h4 className="figma-pipeline-step-title">Doorstep Handover</h4>
                  <p className="figma-pipeline-step-desc">
                    Instant handover with {DISPATCH_SIMULATION[calcHub].trialTime} optional 2-size trial right at your door.
                  </p>
                </div>
              </div>

              <div className="figma-dispatch-metric-banner">
                <div className="figma-dispatch-metric-item">
                  <span className="figma-dispatch-metric-label">Estimated Delivery</span>
                  <span className="figma-dispatch-metric-val">{DISPATCH_SIMULATION[calcHub].totalEta}</span>
                </div>
                <div className="figma-dispatch-metric-item">
                  <span className="figma-dispatch-metric-label">Average Transit Radius</span>
                  <span className="figma-dispatch-metric-val">{DISPATCH_SIMULATION[calcHub].distance}</span>
                </div>
                <div className="figma-dispatch-metric-item">
                  <span className="figma-dispatch-metric-label">Active Electric Fleet</span>
                  <span className="figma-dispatch-metric-val">{DISPATCH_SIMULATION[calcHub].ridersLive} Riders Live</span>
                </div>
                <div className="figma-dispatch-metric-item">
                  <span className="figma-dispatch-metric-label">Verified Local Merchants</span>
                  <span className="figma-dispatch-metric-val">{DISPATCH_SIMULATION[calcHub].partnerStores} Stores Online</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ==================================================================
            SECTION 3: WHY LOCAL BEATS 3-DAY E-COMMERCE (Comparison Matrix)
            ================================================================== */}
        <section className="figma-comparison-section">
          <div className="figma-hub-header" style={{ marginBottom: '32px' }}>
            <span className="figma-eyebrow">THE HYPERLOCAL ADVANTAGE</span>
            <h2 className="figma-section-headline">Why Shopping on Nivvo Feels Different</h2>
            <p className="figma-hub-subtitle">
              Traditional e-commerce ships from distant warehouses 1,000 km away. Nivvo connects you to the heartbeat of your city.
            </p>
          </div>

          <div className="figma-comparison-grid">
            {/* Nivvo Hyperlocal Card */}
            <div className="figma-comparison-card nivvo-highlight">
              <div className="figma-comparison-badge">The Nivvo Standard</div>
              <h3>Hyperlocal 10-Min Commerce</h3>
              <ul className="figma-comparison-list">
                <li>
                  <CheckCircle2 size={18} color="#15803D" />
                  <div>
                    <strong>10 to 18 Minute Delivery:</strong> Dispatched from nearby micro-hubs and independent local retailers.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={18} color="#15803D" />
                  <div>
                    <strong>Doorstep 2-Size Trial:</strong> Try both sizes in private before you pay. Never guess fit charts again.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={18} color="#15803D" />
                  <div>
                    <strong>Freshness &amp; Authenticity:</strong> Direct store bills, FSSAI certified kitchens, farm-picked morning produce.
                  </div>
                </li>
                <li>
                  <CheckCircle2 size={18} color="#15803D" />
                  <div>
                    <strong>Zero Packaging Waste:</strong> Anti-crease reusable garment sleeves and paper mandi totes.
                  </div>
                </li>
              </ul>
            </div>

            {/* Traditional E-Commerce Card */}
            <div className="figma-comparison-card traditional">
              <div className="figma-comparison-badge gray">Traditional Delivery</div>
              <h3>3 to 5 Day Courier Shipping</h3>
              <ul className="figma-comparison-list">
                <li>
                  <X size={18} color="#9CA3AF" />
                  <div>
                    <strong>3 to 5 Days Waiting:</strong> Sits in long-haul regional logistics hubs and transit sorting centers.
                  </div>
                </li>
                <li>
                  <X size={18} color="#9CA3AF" />
                  <div>
                    <strong>Tedious Return Hassles:</strong> Wrong size? Wait 7 days for pickup and another 5 days for refund.
                  </div>
                </li>
                <li>
                  <X size={18} color="#9CA3AF" />
                  <div>
                    <strong>Warehouse Stored Goods:</strong> Packed months in advance with synthetic chemical preservatives.
                  </div>
                </li>
                <li>
                  <X size={18} color="#9CA3AF" />
                  <div>
                    <strong>Excessive Plastic Waste:</strong> Piles of cardboard boxes, bubble wrap, and plastic tape.
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION 4: GROW WITH NIVVO (Shop Owners & Delivery Fleet)
            ================================================================== */}
        <section className="figma-section-grow" id="for-shop-owners">
          <div className="figma-section-intro-copy" style={{ textAlign: 'center', margin: '0 auto 40px', maxWidth: '640px' }}>
            <span className="figma-eyebrow">LOCAL PARTNERSHIPS</span>
            <h2 className="figma-section-headline">A Neighbourhood Works Better, Together.</h2>
            <p style={{ color: '#56634F', fontSize: '15px', marginTop: '8px' }}>
              We empower independent shop owners and local delivery partners with technology, verified order flow, and fair payouts.
            </p>
          </div>

          <div className="figma-partner-opportunities">
            {/* Card 1: For Shop Owners */}
            <div className="figma-partner-card">
              <div className="figma-partner-photo">
                <img 
                  src="/assets/figma/06778b3c2166239613804455c9dfbb11d42b6190.png" 
                  alt="Shop owners partner" 
                />
              </div>
              <div className="figma-partner-copy">
                <span className="figma-eyebrow">FOR LOCAL MERCHANTS</span>
                <h3 className="figma-partner-heading">Bring Your Shop Shelves Online in 10 Mins</h3>
                <p className="figma-partner-desc">
                  Join 2,400+ fashion boutiques, farm mandis, and artisan kitchens. Zero onboarding fee, instant UPI settlements, and dedicated last-mile dark store routing.
                </p>
                <div className="figma-partner-benefits">
                  <span className="figma-partner-benefit-pill"><Check size={13} /> 0% Commission for 30 Days</span>
                  <span className="figma-partner-benefit-pill"><Check size={13} /> Instant Order Notifications</span>
                  <span className="figma-partner-benefit-pill"><Check size={13} /> Same-Day Invoicing</span>
                </div>
                <button 
                  className="figma-btn-primary"
                  onClick={() => {
                    playClickSound();
                    setShowMerchantModal(true);
                  }}
                >
                  <span>Apply as Shop Partner</span>
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>

            {/* Card 2: For Delivery Fleet Partners */}
            <div className="figma-partner-card" id="deliver-with-us">
              <div className="figma-partner-photo">
                <img 
                  src="/assets/figma/18741e2cd6b0c816413f21d67448a0c8070e4279.png" 
                  alt="Delivery partner fleet" 
                />
              </div>
              <div className="figma-partner-copy">
                <span className="figma-eyebrow">FOR FLEET PARTNERS</span>
                <h3 className="figma-partner-heading">Deliver in Your Neighbourhood with Pride</h3>
                <p className="figma-partner-desc">
                  Flexible local routes strictly under 2.5 km. Real-time GPS navigation, daily payouts, accidental insurance coverage, and respectful customer interactions.
                </p>
                <div className="figma-partner-benefits">
                  <span className="figma-partner-benefit-pill"><Check size={13} /> Up to ₹35,000/month</span>
                  <span className="figma-partner-benefit-pill"><Check size={13} /> Daily UPI Payouts</span>
                  <span className="figma-partner-benefit-pill"><Check size={13} /> Free Insurance &amp; Electric Bike Lease</span>
                </div>
                <button 
                  className="figma-btn-outline"
                  onClick={() => {
                    playClickSound();
                    setShowDeliveryPartnerModal(true);
                  }}
                >
                  <span>Join as Delivery Partner</span>
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================
            SECTION: VERIFIED NEIGHBOURHOOD REVIEWS
            ================================================================== */}
        <section className="figma-section-reviews" id="reviews">
          <div className="figma-hub-header" style={{ marginBottom: '24px' }}>
            <span className="figma-eyebrow">VERIFIED NEIGHBOURHOOD EXPERIENCES</span>
            <h2 className="figma-section-headline">Loved by Shoppers Across Bengaluru</h2>
            <p className="figma-hub-subtitle">
              Real people, real orders, real hyper-local speed. See how 10-minute delivery transforms everyday shopping.
            </p>
          </div>

          <div className="figma-reviews-grid">
            {VERIFIED_COMMUNITY_REVIEWS.map((rev, idx) => (
              <div key={idx} className="figma-review-card">
                <div>
                  <div className="figma-review-header">
                    <div className="figma-review-avatar">{rev.initials}</div>
                    <div>
                      <h4 className="figma-review-author">{rev.author}</h4>
                      <span className="figma-review-location">{rev.location}</span>
                    </div>
                    <div className="figma-review-rating">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} size={14} fill="#F59E0B" color="#F59E0B" />
                      ))}
                    </div>
                  </div>
                  <p className="figma-review-quote" style={{ marginTop: '14px' }}>
                    "{rev.quote}"
                  </p>
                </div>

                <div className="figma-review-footer">
                  <div className="figma-review-tag">
                    <ShieldCheck size={13} color="#15803D" />
                    <span>{rev.tag}</span>
                  </div>
                  <span className="figma-review-time">{rev.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================================================================
            SECTION 5: FREQUENTLY ASKED QUESTIONS
            ================================================================== */}
        <section className="figma-section-faq" id="faq">
          <div className="figma-faq-intro">
            <span className="figma-eyebrow">COMMON QUESTIONS</span>
            <h2 className="figma-faq-heading">
              {"Clear Answers.\nZero Surprises."}
            </h2>
            <p className="figma-faq-desc">
              Everything you need to know about our 10-minute delivery, doorstep 2-size trial, and local store partnerships.
            </p>
            <button 
              className="figma-text-action"
              onClick={() => {
                playClickSound();
                setShowHelpCenterModal(true);
              }}
            >
              <span>Visit 24x7 Help Centre</span>
              <ArrowUpRight size={18} />
            </button>
          </div>

          <div className="figma-faq-list">
            {FAQ_ITEMS.map((item, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="figma-faq-item">
                  <div 
                    className="figma-faq-question-row"
                    onClick={() => {
                      playClickSound();
                      setOpenFaqIndex(isOpen ? -1 : idx);
                    }}
                  >
                    <h3 className="figma-faq-question">{item.q}</h3>
                    {isOpen ? <Minus size={17} /> : <Plus size={17} />}
                  </div>
                  {isOpen && (
                    <p className="figma-faq-answer">{item.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================================================================
            SECTION 6: CLOSING NEIGHBOURHOOD CTA BANNER
            ================================================================== */}
        <section className="figma-section-closing-cta">
          <div className="figma-closing-copy">
            <span className="figma-eyebrow" style={{ color: '#B7F34A' }}>GET STARTED TODAY</span>
            <h2 className="figma-closing-heading">
              {"Your neighbourhood is\njust 10 minutes away."}
            </h2>
            <p className="figma-closing-desc">
              Check live delivery coverage for Indiranagar, Koramangala, HSR Layout and 11 other Bengaluru areas.
            </p>
          </div>

          <div className="figma-closing-action">
            <form 
              className="figma-closing-location-field" 
              onSubmit={handleClosingLocationSubmit}
            >
              <div className="figma-location-prompt">
                <MapPin size={20} />
                <input 
                  type="text"
                  className="figma-location-input"
                  placeholder="Enter your area or PIN code"
                  value={closingLocationInput}
                  onChange={(e) => setClosingLocationInput(e.target.value)}
                />
              </div>
              <button type="submit" className="figma-btn-primary">
                <span>Discover nearby</span>
                <ArrowUpRight size={18} />
              </button>
            </form>
            <p className="figma-closing-note">
              Live stock, doorstep 2-size trial, and delivery estimates calibrated automatically to your address.
            </p>
          </div>
        </section>
      </div>

      {/* ==================================================================
          SECTION 9: FOOTER — Premium Professional Redesign
          ================================================================== */}
      <footer className="figma-footer">
        <div className="figma-footer-container">

          {/* ── Newsletter / App Download Banner ── */}
          <div className="figma-footer-top-banner">
            <div className="figma-footer-banner-copy">
              <h3>Stay in the loop with your neighbourhood</h3>
              <p>Get hyperlocal deals, new shop openings, and exclusive member offers.</p>
            </div>
            <form 
              className="figma-footer-newsletter-form"
              onSubmit={(e) => {
                e.preventDefault();
                if (newsletterEmail.trim()) {
                  showToast(`Subscribed! We'll send local finds to ${newsletterEmail}`);
                  setNewsletterEmail('');
                }
              }}
            >
              <input
                type="email"
                className="figma-footer-newsletter-input"
                placeholder="Your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
              />
              <button type="submit" className="figma-footer-newsletter-btn">Subscribe</button>
            </form>
            <div className="figma-footer-app-badges">
              <div 
                className="figma-footer-app-badge"
                onClick={() => { playClickSound(); showToast('Opening Play Store — Nivvo v2.4.1'); }}
              >
                <div className="figma-footer-app-badge-icon"><Smartphone size={18} /></div>
                <div className="figma-footer-app-badge-text">
                  <span className="figma-footer-app-badge-sub">Get it on</span>
                  <span className="figma-footer-app-badge-name">Google Play</span>
                </div>
              </div>
              <div 
                className="figma-footer-app-badge"
                onClick={() => { playClickSound(); showToast('App Store — Coming to iOS soon!'); }}
              >
                <div className="figma-footer-app-badge-icon"><Apple size={18} /></div>
                <div className="figma-footer-app-badge-text">
                  <span className="figma-footer-app-badge-sub">Download on</span>
                  <span className="figma-footer-app-badge-name">App Store</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Metrics Strip ── */}
          <div className="figma-footer-metrics-strip">
            <div className="figma-footer-metric">
              <span className="figma-footer-metric-value">2,400+</span>
              <span className="figma-footer-metric-label">Local shops onboarded</span>
            </div>
            <div className="figma-footer-metric">
              <span className="figma-footer-metric-value">18 min</span>
              <span className="figma-footer-metric-label">Avg. delivery time</span>
            </div>
            <div className="figma-footer-metric">
              <span className="figma-footer-metric-value">14</span>
              <span className="figma-footer-metric-label">Bengaluru neighbourhoods</span>
            </div>
            <div className="figma-footer-metric">
              <span className="figma-footer-metric-value" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                4.8 <Star size={18} fill="#6EB964" color="#6EB964" />
              </span>
              <span className="figma-footer-metric-label">Customer satisfaction</span>
            </div>
          </div>

          {/* ── Main Navigation ── */}
          <div className="figma-footer-nav">

            {/* Brand Column */}
            <div className="figma-footer-brand-col">
              <div 
                className="figma-brand-lockup" 
                onClick={() => { playClickSound(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              >
                <div className="figma-brand-symbol">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M7 17L17 7M17 7H9M17 7V15" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span className="figma-brand-wordmark" style={{ color: '#FFFFFF' }}>nivvo</span>
              </div>

              <p className="figma-footer-brand-desc">
                Your neighbourhood, delivered. Fashion, fresh groceries, everyday food — from independent shops nearby.
              </p>

              {/* Trust Badges */}
              <div className="figma-footer-trust-badges">
                <div className="figma-footer-trust-badge">
                  <div className="figma-footer-trust-badge-icon"><ShieldCheck size={14} /></div>
                  <span><strong>100% Secure</strong> payments — UPI, card &amp; COD</span>
                </div>
                <div className="figma-footer-trust-badge">
                  <div className="figma-footer-trust-badge-icon"><PackageCheck size={14} /></div>
                  <span><strong>Easy returns</strong> within 7 days, no questions</span>
                </div>
                <div className="figma-footer-trust-badge">
                  <div className="figma-footer-trust-badge-icon"><Store size={14} /></div>
                  <span><strong>Verified shops</strong> with FSSAI &amp; GST compliance</span>
                </div>
              </div>

              {/* Social Buttons */}
              <div className="figma-footer-socials">
                <a 
                  href="https://instagram.com" target="_blank" rel="noreferrer" 
                  aria-label="Instagram" className="figma-footer-social-btn"
                >
                  <Instagram size={16} />
                </a>
                <a 
                  href="https://linkedin.com" target="_blank" rel="noreferrer" 
                  aria-label="LinkedIn" className="figma-footer-social-btn"
                >
                  <Linkedin size={16} />
                </a>
                <a 
                  href="https://twitter.com" target="_blank" rel="noreferrer" 
                  aria-label="Twitter / X" className="figma-footer-social-btn"
                >
                  <X size={16} />
                </a>
              </div>
            </div>

            {/* Discover Column */}
            <div className="figma-footer-group">
              <h4 className="figma-footer-group-title">Discover</h4>
              <div className="figma-footer-links">
                <a className="figma-footer-link" onClick={() => { playClickSound(); setActivePillar('fashion'); document.getElementById('nearby-shopping')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Shop nearby
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); setActivePillar('grocery'); document.getElementById('nearby-shopping')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Fresh Grocery
                  <span className="figma-footer-link-badge">10 min</span>
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); setActivePillar('food'); document.getElementById('nearby-shopping')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Neighbourhood Food
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); document.getElementById('collections')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Explore categories
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); if (onOpenAuth) onOpenAuth('customer'); }}>
                  Customer Login
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  How Nivvo works
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); document.getElementById('reviews')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Customer Reviews
                </a>
              </div>
            </div>

            {/* Grow Column */}
            <div className="figma-footer-group">
              <h4 className="figma-footer-group-title">Grow with us</h4>
              <div className="figma-footer-links">
                <a className="figma-footer-link" onClick={() => { playClickSound(); setShowMerchantModal(true); }}>
                  For shop owners
                  <span className="figma-footer-link-badge">NEW</span>
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); setShowDeliveryPartnerModal(true); }}>
                  For delivery partners
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); if (onOpenAuth) onOpenAuth('seller'); }}>
                  Seller Login
                  <span className="figma-footer-link-badge">→</span>
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); if (onNavigateSeller) onNavigateSeller(); }}>
                  Seller dashboard
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); showToast('Nivvo Franchise & White-Label Programme — Contact partnerships@nivvo.in'); }}>
                  Franchise / Expand
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); showToast('Careers at Nivvo — careers@nivvo.in'); }}>
                  Careers at Nivvo
                </a>
              </div>
            </div>

            {/* Help Column */}
            <div className="figma-footer-group">
              <h4 className="figma-footer-group-title">Here to help</h4>
              <div className="figma-footer-links">
                <a className="figma-footer-link" onClick={() => { playClickSound(); setHelpCenterTab('contact'); setShowHelpCenterModal(true); }}>
                  Help centre
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); setHelpCenterTab('ticket'); setShowHelpCenterModal(true); }}>
                  Raise a ticket
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); document.getElementById('honest-trust')?.scrollIntoView({ behavior: 'smooth' }); }}>
                  Delivery &amp; returns
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); setHelpCenterTab('contact'); setShowHelpCenterModal(true); }}>
                  Contact us
                </a>
                <a className="figma-footer-link" onClick={() => { playClickSound(); showToast('Nivvo Safety Guidelines — FSSAI compliant &amp; hygienic packaging guaranteed'); }}>
                  Safety &amp; hygiene
                </a>
              </div>
            </div>

          </div>{/* end footer-nav */}

          {/* ── Divider ── */}
          <div className="figma-footer-divider" />

          {/* ── Legal Bottom Row ── */}
          <div className="figma-footer-legal-row">
            <div className="figma-footer-legal-brand">
              <div className="figma-footer-legal-brand-dot" />
              <span>© 2026 Nivvo Technologies Pvt. Ltd. — A new kind of local.</span>
            </div>

            <div className="figma-footer-legal-links">
              <span onClick={() => showToast('Nivvo Privacy Policy — DPDP Act 2023 Compliant')}>Privacy Policy</span>
              <span className="figma-footer-legal-sep">·</span>
              <span onClick={() => showToast('Nivvo Hyperlocal Marketplace Terms of Service')}>Terms of Service</span>
              <span className="figma-footer-legal-sep">·</span>
              <span onClick={() => showToast('Nivvo Merchant Terms & Fair Trade Policy')}>Seller Terms</span>
              <span className="figma-footer-legal-sep">·</span>
              <span onClick={() => showToast('Cookie Policy — We only use essential cookies')}>Cookie Policy</span>
              <span className="figma-footer-legal-sep">·</span>
              <span onClick={() => { playClickSound(); if (onOpenAuth) onOpenAuth('admin'); }} style={{ cursor: 'pointer', opacity: 0.85 }} title="Internal Administration">Admin Console</span>
            </div>

            <div className="figma-footer-compliance-badges">
              <span className="figma-footer-compliance-chip">DPDP 2023</span>
              <span className="figma-footer-compliance-chip">FSSAI</span>
              <span className="figma-footer-compliance-chip">GST Reg.</span>
            </div>
          </div>

        </div>{/* end figma-footer-container */}
      </footer>

      {/* ==================================================================
          INTERACTIVE MODALS
          ================================================================== */}

      {/* 1. Location Selection Modal */}
      {showLocationModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowLocationModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '480px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#24452D', margin: 0 }}>
                Select Delivery Neighbourhood
              </h3>
              <button 
                onClick={() => setShowLocationModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#56634F' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { name: 'Indiranagar', pin: '560038', sub: '100ft Road / 12th Main', stores: '28 local shops · 14 restaurants · 8 mandis' },
                { name: 'Koramangala', pin: '560034', sub: 'Sony World / 80ft Road', stores: '32 local shops · 18 restaurants · 9 mandis' },
                { name: 'HSR Layout', pin: '560102', sub: 'Sector 4 / 27th Main', stores: '24 local shops · 12 restaurants · 6 mandis' },
                { name: 'Lavelle Road', pin: '560001', sub: 'CBD / UB City Hub', stores: '18 local shops · 10 cafes · 4 marts' }
              ].map(hub => (
                <div 
                  key={hub.name}
                  onClick={() => {
                    playClickSound();
                    setActiveLocationLabel(`${hub.name}, Bengaluru`);
                    setHeroLocationInput(`${hub.name}, Bengaluru (${hub.pin})`);
                    if (setSelectedAddress) {
                      setSelectedAddress({
                        id: hub.name.toLowerCase(),
                        title: hub.name,
                        area: hub.name,
                        pincode: hub.pin
                      });
                    }
                    setShowLocationModal(false);
                    showToast(`Active neighbourhood updated to ${hub.name}`);
                  }}
                  style={{
                    padding: '14px 16px',
                    borderRadius: '12px',
                    backgroundColor: '#F7F8F5',
                    border: '1px solid #E7EAE3',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '15px', fontWeight: 600, color: '#24452D' }}>{hub.name} · {hub.pin}</div>
                    <div style={{ fontSize: '12px', color: '#56634F', marginTop: '2px' }}>{hub.sub}</div>
                  </div>
                  <span style={{ fontSize: '12px', color: '#238636', fontWeight: 500 }}>{hub.stores.split('·')[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Enhanced Product / Dish / Grocery Modal */}
      {showProductModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowProductModal(null)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '680px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              display: 'flex',
              gap: '28px'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ width: '260px', height: '300px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#F7F8F5', position: 'relative' }}>
              <img src={showProductModal.img} alt={showProductModal.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              {showProductModal.discount && (
                <div style={{ position: 'absolute', top: 12, left: 12, backgroundColor: '#24452D', color: '#B7F34A', padding: '4px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 700 }}>
                  {showProductModal.discount}
                </div>
              )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <span style={{ fontSize: '12px', color: '#56634F', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {showProductModal.proximity}
                  </span>
                  <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#20251F', margin: '4px 0 0 0' }}>
                    {showProductModal.title}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowProductModal(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#56634F', padding: 0 }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Price & ETA */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '24px', fontWeight: 600, color: '#24452D' }}>
                  {showProductModal.price}
                </span>
                {showProductModal.originalPrice && (
                  <span style={{ fontSize: '14px', color: '#56634F', textDecoration: 'line-through' }}>
                    {showProductModal.originalPrice}
                  </span>
                )}
                <span style={{ fontSize: '12px', color: '#238636', fontWeight: 600, backgroundColor: '#EEF5E6', padding: '3px 8px', borderRadius: '6px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Timer size={12} /> {showProductModal.eta}
                </span>
              </div>

              {/* Description */}
              <p style={{ fontSize: '13px', color: '#56634F', lineHeight: '20px', margin: 0 }}>
                {showProductModal.description}
              </p>

              {/* Specific metadata for grocery / food / fashion */}
              {showProductModal.shelfLife && (
                <div style={{ fontSize: '12px', color: '#24452D', backgroundColor: '#F7F8F5', padding: '8px 12px', borderRadius: '8px' }}>
                  <strong>Origin:</strong> {showProductModal.origin} · <strong>Shelf Life:</strong> {showProductModal.shelfLife}
                </div>
              )}

              {showProductModal.hygiene && (
                <div style={{ fontSize: '12px', color: '#24452D', backgroundColor: '#F7F8F5', padding: '8px 12px', borderRadius: '8px' }}>
                  <strong>Kitchen Hygiene:</strong> {showProductModal.hygiene} · <strong>Rating:</strong> {showProductModal.rating} / 5
                </div>
              )}

              {/* Size selection for Fashion */}
              {showProductModal.sizes && (
                <div>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#24452D', display: 'block', marginBottom: '6px' }}>
                    Select Size / Variant
                  </span>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {showProductModal.sizes.map(size => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setModalPrimarySize(size)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: '8px',
                          border: modalPrimarySize === size ? '2px solid #24452D' : '1px solid #E7EAE3',
                          backgroundColor: modalPrimarySize === size ? '#EEF5E6' : '#FFFFFF',
                          color: '#24452D',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  className="figma-btn-primary"
                  style={{ flex: 1, justifyContent: 'center' }}
                  onClick={() => {
                    playAddSound();
                    if (addToCart) {
                      addToCart({
                        id: showProductModal.id,
                        name: showProductModal.title,
                        price: showProductModal.priceNum,
                        image: showProductModal.img,
                        size: showProductModal.sizes ? modalPrimarySize : (showProductModal.weight || 'Standard'),
                        quantity: 1
                      });
                    }
                    setShowProductModal(null);
                    showToast(`Added ${showProductModal.title} to bag!`);
                  }}
                >
                  <ShoppingBag size={18} />
                  <span>Add to Bag</span>
                </button>

                {/* Direct App Link for Food & Grocery */}
                {(showProductModal.pillar === 'grocery' || showProductModal.pillar === 'food') && (
                  <button
                    type="button"
                    className="figma-btn-outline"
                    onClick={() => {
                      playClickSound();
                      setShowProductModal(null);
                      if (showProductModal.pillar === 'grocery' && onNavigateGrocery) onNavigateGrocery();
                      else if (showProductModal.pillar === 'food' && onNavigateFood) onNavigateFood();
                      else if (onLaunchMobileSimulator) onLaunchMobileSimulator();
                    }}
                  >
                    <Smartphone size={16} />
                    <span>App Mode</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Professional Multi-Step Merchant Application Modal */}
      <ProfessionalSellerApplicationModal 
        isOpen={showMerchantModal}
        onClose={() => setShowMerchantModal(false)}
        onRegistered={(app) => {
          showToast(`Merchant application logged for ${app.shop_name}! Reference: ${app.application_id}`);
        }}
      />

      {/* 4. Delivery Partner App Modal */}
      {showDeliveryPartnerModal && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
          onClick={() => setShowDeliveryPartnerModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '24px',
              maxWidth: '460px',
              width: '100%',
              padding: '36px',
              boxShadow: '0 24px 60px rgba(0,0,0,0.25)',
              textAlign: 'center'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => setShowDeliveryPartnerModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#56634F', padding: 0 }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ width: '64px', height: '64px', borderRadius: '16px', backgroundColor: '#EEF5E6', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#24452D' }}>
              <Bike size={32} />
            </div>

            <span className="figma-eyebrow">MOBILE EXCLUSIVE FLEET</span>
            <h3 style={{ fontSize: '22px', fontWeight: 600, color: '#24452D', margin: '6px 0 10px 0' }}>
              Nivvo Rider Companion App
            </h3>

            <p style={{ fontSize: '14px', color: '#56634F', lineHeight: '22px', margin: '0 0 24px 0' }}>
              Delivery operations run exclusively on the mobile app. Scan the QR code or download the Android APK to register and start taking orders.
            </p>

            <div style={{ width: '160px', height: '160px', margin: '0 auto 20px', padding: '12px', border: '1px solid #E7EAE3', borderRadius: '16px', backgroundColor: '#F7F8F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <QrCode size={130} color="#24452D" />
            </div>

            <button
              type="button"
              className="figma-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
              onClick={() => {
                playClickSound();
                showToast('Downloading Nivvo_Fleet_v2.4.1.apk...');
                setShowDeliveryPartnerModal(false);
              }}
            >
              <Download size={18} />
              <span>Download Rider APK (v2.4.1)</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. Professional Help Center Modal */}
      {showHelpCenterModal && (
        <div className="nivvo-help-backdrop" onClick={() => setShowHelpCenterModal(false)}>
          <div className="nivvo-help-panel" onClick={e => e.stopPropagation()}>

            {/* Hero Header */}
            <div className="nivvo-help-hero">
              <button className="nivvo-help-hero-close" onClick={() => setShowHelpCenterModal(false)}>
                <X size={16} />
              </button>
              <div className="nivvo-help-status-dot">
                <div className="nivvo-help-status-pulse" />
                Support Team Online
              </div>
              <h2>Nivvo Help Centre</h2>
              <p>Our neighbourhood support team is here Mon–Sun, 9 AM–11 PM. We typically respond in under 4 minutes.</p>
              <div className="nivvo-help-hero-stats">
                <div className="nivvo-help-hero-stat">
                  <span className="nivvo-help-hero-stat-val">&lt; 4 min</span>
                  <span className="nivvo-help-hero-stat-lbl">Avg. response time</span>
                </div>
                <div className="nivvo-help-hero-stat">
                  <span className="nivvo-help-hero-stat-val">98.2%</span>
                  <span className="nivvo-help-hero-stat-lbl">Issues resolved same day</span>
                </div>
                <div className="nivvo-help-hero-stat">
                  <span className="nivvo-help-hero-stat-val">4.9 / 5</span>
                  <span className="nivvo-help-hero-stat-lbl">Support satisfaction</span>
                </div>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="nivvo-help-tabs">
              {[
                { id: 'contact', label: 'Contact Us', icon: <Smartphone size={14} /> },
                { id: 'ticket',  label: 'Raise a Ticket', icon: <ReceiptText size={14} /> },
                { id: 'hours',   label: 'Hours & Office', icon: <Timer size={14} /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  className={`nivvo-help-tab${helpCenterTab === tab.id ? ' active' : ''}`}
                  onClick={() => setHelpCenterTab(tab.id)}
                >
                  {tab.icon}{tab.label}
                </button>
              ))}
            </div>

            {/* Panel Body */}
            <div className="nivvo-help-body">

              {/* CONTACT TAB */}
              {helpCenterTab === 'contact' && (
                <>
                  <div className="nivvo-help-channels">
                    <div
                      className="nivvo-help-channel-card"
                      onClick={() => { playClickSound(); showToast('Calling +91 80 4912 8820 — Toll Free'); }}
                    >
                      <div className="nivvo-help-channel-icon urgent">
                        <Smartphone size={20} />
                      </div>
                      <div className="nivvo-help-channel-info">
                        <p className="nivvo-help-channel-name">Phone Support</p>
                        <p className="nivvo-help-channel-detail">+91 80 4912 8820 (Toll Free)</p>
                        <div className="nivvo-help-channel-meta">
                          <div className="nivvo-help-channel-online" />
                          Available now · 9 AM–11 PM
                        </div>
                      </div>
                    </div>

                    <div
                      className="nivvo-help-channel-card"
                      onClick={() => { playClickSound(); showToast('Opening email client — care@nivvo.in'); }}
                    >
                      <div className="nivvo-help-channel-icon email-icon">
                        <ArrowUpRight size={20} />
                      </div>
                      <div className="nivvo-help-channel-info">
                        <p className="nivvo-help-channel-name">Email Support</p>
                        <p className="nivvo-help-channel-detail">care@nivvo.in</p>
                        <div className="nivvo-help-channel-meta">
                          <div className="nivvo-help-channel-online" />
                          Replies within 2 hours
                        </div>
                      </div>
                    </div>

                    <div
                      className="nivvo-help-channel-card"
                      onClick={() => { playClickSound(); showToast('Opening WhatsApp Business — Nivvo Support'); }}
                    >
                      <div className="nivvo-help-channel-icon chat-icon">
                        <Sparkles size={20} />
                      </div>
                      <div className="nivvo-help-channel-info">
                        <p className="nivvo-help-channel-name">Live Chat</p>
                        <p className="nivvo-help-channel-detail">WhatsApp Business</p>
                        <div className="nivvo-help-channel-meta">
                          <div className="nivvo-help-channel-online" />
                          5 agents online now
                        </div>
                      </div>
                    </div>

                    <div
                      className="nivvo-help-channel-card"
                      onClick={() => { playClickSound(); showToast('Opening Nivvo Community Forum — 12,400+ members'); }}
                    >
                      <div className="nivvo-help-channel-icon">
                        <Star size={20} />
                      </div>
                      <div className="nivvo-help-channel-info">
                        <p className="nivvo-help-channel-name">Community Forum</p>
                        <p className="nivvo-help-channel-detail">Peer support &amp; FAQs</p>
                        <div className="nivvo-help-channel-meta busy">
                          <div className="nivvo-help-channel-online" />
                          12,400+ members
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="nivvo-help-address-row">
                    <div className="nivvo-help-address-card">
                      <div className="nivvo-help-address-label">Bengaluru Operations</div>
                      <p className="nivvo-help-address-val">
                        12th Main, HAL 2nd Stage,<br />
                        Indiranagar, Bengaluru – 560038
                      </p>
                    </div>
                    <div className="nivvo-help-address-card">
                      <div className="nivvo-help-address-label">Registered Office</div>
                      <p className="nivvo-help-address-val">
                        Nivvo Technologies Pvt. Ltd.<br />
                        MG Road, Bengaluru – 560001
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* TICKET TAB */}
              {helpCenterTab === 'ticket' && (
                <form
                  className="nivvo-help-ticket-form"
                  onSubmit={(e) => {
                    e.preventDefault();
                    showToast(`Ticket raised! Ref #NVV-${Math.floor(Math.random()*90000)+10000} — We'll reply to ${ticketForm.email || 'your inbox'} within 2 hours.`);
                    setTicketForm({ name: '', email: '', category: '', message: '' });
                    setShowHelpCenterModal(false);
                  }}
                >
                  <div className="nivvo-help-form-row">
                    <div className="nivvo-help-form-field">
                      <label className="nivvo-help-form-label">Your Name</label>
                      <input
                        className="nivvo-help-form-input"
                        placeholder="Full name"
                        value={ticketForm.name}
                        onChange={e => setTicketForm(p => ({ ...p, name: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="nivvo-help-form-field">
                      <label className="nivvo-help-form-label">Email Address</label>
                      <input
                        type="email"
                        className="nivvo-help-form-input"
                        placeholder="you@email.com"
                        value={ticketForm.email}
                        onChange={e => setTicketForm(p => ({ ...p, email: e.target.value }))}
                        required
                      />
                    </div>
                  </div>
                  <div className="nivvo-help-form-field">
                    <label className="nivvo-help-form-label">Issue Category</label>
                    <select
                      className="nivvo-help-form-select"
                      value={ticketForm.category}
                      onChange={e => setTicketForm(p => ({ ...p, category: e.target.value }))}
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="order">Order issue / Delay</option>
                      <option value="return">Return &amp; Refund</option>
                      <option value="payment">Payment problem</option>
                      <option value="product">Wrong / Damaged product</option>
                      <option value="account">Account &amp; Login</option>
                      <option value="shop">Shop / Partner inquiry</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="nivvo-help-form-field">
                    <label className="nivvo-help-form-label">Describe your issue</label>
                    <textarea
                      className="nivvo-help-form-textarea"
                      placeholder="Please provide as much detail as possible — order number, items, timeline..."
                      value={ticketForm.message}
                      onChange={e => setTicketForm(p => ({ ...p, message: e.target.value }))}
                      required
                    />
                  </div>
                  <button type="submit" className="nivvo-help-submit-btn">
                    <CheckCircle2 size={16} />
                    Submit Support Ticket
                  </button>
                </form>
              )}

              {/* HOURS TAB */}
              {helpCenterTab === 'hours' && (
                <div className="nivvo-help-address-row">
                  <div className="nivvo-help-address-card">
                    <div className="nivvo-help-address-label">Support Hours</div>
                    {[
                      { day: 'Monday – Friday', time: '9:00 AM – 11:00 PM' },
                      { day: 'Saturday', time: '10:00 AM – 10:00 PM' },
                      { day: 'Sunday &amp; Holidays', time: '11:00 AM – 9:00 PM' },
                    ].map((r, i) => (
                      <div key={i} className="nivvo-help-hours-row">
                        <span className="nivvo-help-hours-day" dangerouslySetInnerHTML={{ __html: r.day }} />
                        <span className="nivvo-help-hours-time">{r.time}</span>
                      </div>
                    ))}
                  </div>
                  <div className="nivvo-help-address-card">
                    <div className="nivvo-help-address-label">Contact Channels</div>
                    {[
                      { day: 'Phone (Toll Free)', time: '+91 80 4912 8820' },
                      { day: 'Email', time: 'care@nivvo.in' },
                      { day: 'WhatsApp', time: '+91 90 1234 5678' },
                      { day: 'Partner support', time: 'partners@nivvo.in' },
                    ].map((r, i) => (
                      <div key={i} className="nivvo-help-hours-row">
                        <span className="nivvo-help-hours-day">{r.day}</span>
                        <span className="nivvo-help-hours-time">{r.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>{/* end nivvo-help-body */}
          </div>
        </div>
      )}

    </div>
  );
}
