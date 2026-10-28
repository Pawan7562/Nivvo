import React, { useState, useRef } from 'react';
import { useNivvo } from '../../context/NivvoAppContext';
import { 
  Search, ChevronDown, ChevronLeft, ChevronRight, X, ArrowUpRight, Plus, RefreshCw, Check, AlertTriangle, Layers, Tag, Download,
  Lock, Clock, ShieldCheck, UploadCloud, Image as ImageIcon, Trash2, Star, CheckCircle2, Sparkles, HelpCircle,
  Eye, ShoppingBag, ArrowRight
} from 'lucide-react';
import { playClickSound, playTrialSound, playAddSound } from '../../utils/audioEffects';
import SellerLayout from '../../components/nivvo/SellerLayout';

export default function NivvoSellerProductsView({ onBack }) {
  const { 
    showToast, 
    updateProductStockCount,
    addMerchantProduct,
    deleteMerchantProduct,
    sellerProducts,
    shopProfile
  } = useNivvo();

  const isApproved = (shopProfile?.verification_status || '').toLowerCase() === 'approved';

  const [selectedProductSku, setSelectedProductSku] = useState('SS-COURT-01');
  const [selectedSize, setSelectedSize] = useState('UK 8');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'live' | 'low_stock' | 'unavailable'
  const [categoryFilter, setCategoryFilter] = useState('all'); // 'all' | 'Sneakers' | 'Sandals' | 'Slides' | 'Loafers'
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showAddSizeModal, setShowAddSizeModal] = useState(false);
  const [showThresholdMenu, setShowThresholdMenu] = useState(false);
  const [lowStockThreshold, setLowStockThreshold] = useState(2);
  const [showVariantPanel, setShowVariantPanel] = useState(true);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdSku, setNewProdSku] = useState('');
  const [newProdSubtitle, setNewProdSubtitle] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('Sneakers');
  const [newProdPrice, setNewProdPrice] = useState('1499');
  const [newProdMrp, setNewProdMrp] = useState('2499');
  const [newProdStock, setNewProdStock] = useState('25');
  const [newProdDescription, setNewProdDescription] = useState('Crafted from premium full-grain materials with cushioned ergonomics. Engineered for 10-minute doorstep try-on delivery with guaranteed local store origin.');
  const [newProdDoorstepTryOn, setNewProdDoorstepTryOn] = useState(true);
  const [newProdSizes, setNewProdSizes] = useState(['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10']);
  const [uploadedImages, setUploadedImages] = useState([
    { id: 'img-seed-1', url: '/assets/figma/product_court_sneaker.png', name: 'front_angle.png', isPrimary: true }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // New size form state
  const [newSizeName, setNewSizeName] = useState('UK 11');
  const [newSizeAvailable, setNewSizeAvailable] = useState('4');

  // Mutable products state
  const [products, setProducts] = useState([
    {
      sku: 'SS-DEMO-100',
      name: 'Pocket Kraft Notebook & Pen',
      subtitle: 'Kraft / Black Set',
      category: 'Stationery',
      variants: '1 size',
      price: '₹100',
      stock: 50,
      status: 'Live',
      statusArrow: true,
      statusColor: '#14281C',
      image: '/assets/figma/cat_lifestyle.png'
    },
    {
      sku: 'SS-COURT-01',
      name: 'Everyday court sneaker',
      subtitle: 'Sage / Ivory',
      category: 'Sneakers',
      variants: '5 sizes',
      price: '₹1,299',
      stock: 23,
      status: 'Live',
      statusArrow: true,
      statusColor: '#14281C',
      image: '/assets/figma/product_court_sneaker.png'
    },
    {
      sku: 'SS-CANVAS-02',
      name: 'Canvas weekend sneaker',
      subtitle: 'Ivory / Gum',
      category: 'Sneakers',
      variants: '5 sizes',
      price: '₹999',
      stock: 34,
      status: 'Live',
      statusArrow: true,
      statusColor: '#14281C',
      image: '/assets/figma/product_weekend_sneaker.png'
    },
    {
      sku: 'SS-SANDAL-03',
      name: 'Two-strap leather sandal',
      subtitle: 'Tan Leather',
      category: 'Sandals',
      variants: '5 sizes',
      price: '₹899',
      stock: 28,
      status: 'Live',
      statusArrow: true,
      statusColor: '#14281C',
      image: '/assets/figma/product_sandals.png'
    },
    {
      sku: 'SS-SLIDE-04',
      name: 'Cloud slide slipper',
      subtitle: 'Charcoal Foam',
      category: 'Slides',
      variants: '4 sizes',
      price: '₹599',
      stock: 2,
      status: 'Low stock',
      statusArrow: false,
      statusColor: '#855700',
      image: '/assets/figma/cat_footwear.png'
    },
    {
      sku: 'SS-KNIT-05',
      name: 'City knit trainer',
      subtitle: 'Triple Black',
      category: 'Sneakers',
      variants: '5 sizes',
      price: '₹1,899',
      stock: 18,
      status: 'Live',
      statusArrow: true,
      statusColor: '#14281C',
      image: '/assets/figma/product_lowtop_sneaker.png'
    },
    {
      sku: 'SS-LOAFER-06',
      name: 'Classic leather loafer',
      subtitle: 'Oxblood Leather',
      category: 'Loafers',
      variants: '4 sizes',
      price: '₹1,499',
      stock: 0,
      status: 'Out of stock',
      statusArrow: false,
      statusColor: '#C92A2A',
      image: '/assets/figma/product_comfort_trainer.png'
    }
  ]);

  // Inventory state mapped per SKU
  const [productInventories, setProductInventories] = useState({
    'SS-DEMO-100': {
      'Standard': { available: 50, held: 0 }
    },
    'SS-COURT-01': {
      'UK 6': { available: 8, held: 1 },
      'UK 7': { available: 6, held: 0 },
      'UK 8': { available: 3, held: 0 },
      'UK 9': { available: 4, held: 1 },
      'UK 10': { available: 2, held: 0 }
    },
    'SS-CANVAS-02': {
      'UK 6': { available: 8, held: 0 },
      'UK 7': { available: 10, held: 1 },
      'UK 8': { available: 7, held: 0 },
      'UK 9': { available: 5, held: 0 },
      'UK 10': { available: 4, held: 0 }
    },
    'SS-SANDAL-03': {
      'UK 6': { available: 6, held: 0 },
      'UK 7': { available: 8, held: 1 },
      'UK 8': { available: 5, held: 0 },
      'UK 9': { available: 5, held: 0 },
      'UK 10': { available: 4, held: 0 }
    },
    'SS-SLIDE-04': {
      'UK 6': { available: 1, held: 0 },
      'UK 7': { available: 1, held: 0 },
      'UK 8': { available: 0, held: 0 },
      'UK 9': { available: 0, held: 0 }
    },
    'SS-KNIT-05': {
      'UK 6': { available: 4, held: 0 },
      'UK 7': { available: 5, held: 1 },
      'UK 8': { available: 4, held: 0 },
      'UK 9': { available: 3, held: 0 },
      'UK 10': { available: 2, held: 0 }
    },
    'SS-LOAFER-06': {
      'UK 6': { available: 0, held: 0 },
      'UK 7': { available: 0, held: 0 },
      'UK 8': { available: 0, held: 0 },
      'UK 9': { available: 0, held: 0 }
    }
  });

  const activeProduct = products.find(p => p.sku === selectedProductSku) || products[0];
  const activeSizes = productInventories[activeProduct?.sku] || {
    'UK 7': { available: 5, held: 0 },
    'UK 8': { available: 5, held: 0 }
  };

  // Adjust stock handler for stepper
  const handleAdjustStock = (delta) => {
    playClickSound();
    const currSku = activeProduct.sku;
    setProductInventories(prev => {
      const currentSkuInventory = prev[currSku] || {};
      const currentSizeVal = currentSkuInventory[selectedSize] || { available: 0, held: 0 };
      const nextVal = Math.max(0, currentSizeVal.available + delta);
      return {
        ...prev,
        [currSku]: {
          ...currentSkuInventory,
          [selectedSize]: { ...currentSizeVal, available: nextVal }
        }
      };
    });
  };

  // Save stock changes and update product table & status
  const handleSaveStockChanges = () => {
    playTrialSound();
    const currSku = activeProduct.sku;
    const currentSizes = productInventories[currSku] || {};
    const totalAvail = Object.values(currentSizes).reduce((acc, curr) => acc + (curr.available || 0), 0);
    
    // Determine status based on lowStockThreshold
    let newStatus = 'Live';
    let newStatusColor = '#14281C';
    let newStatusArrow = true;
    if (totalAvail === 0) {
      newStatus = 'Out of stock';
      newStatusColor = '#C92A2A';
      newStatusArrow = false;
    } else if (totalAvail <= lowStockThreshold) {
      newStatus = 'Low stock';
      newStatusColor = '#855700';
      newStatusArrow = false;
    }

    setProducts(prev => prev.map(p => {
      if (p.sku === currSku) {
        return {
          ...p,
          stock: totalAvail,
          status: newStatus,
          statusColor: newStatusColor,
          statusArrow: newStatusArrow
        };
      }
      return p;
    }));

    updateProductStockCount(currSku, totalAvail);
    showToast(`Saved stock for ${activeProduct.name} · ${selectedSize} (Total: ${totalAvail} units).`);
  };

  // Preset catalog photos that merchants can click to quickly add/test
  const CATALOG_PHOTO_PRESETS = [
    { label: 'Court Sneaker', url: '/assets/figma/product_court_sneaker.png', category: 'Sneakers' },
    { label: 'Weekend Canvas', url: '/assets/figma/product_weekend_sneaker.png', category: 'Sneakers' },
    { label: 'Comfort Trainer', url: '/assets/figma/product_comfort_trainer.png', category: 'Sneakers' },
    { label: 'Two-Strap Sandal', url: '/assets/figma/product_sandals.png', category: 'Sandals' },
    { label: 'Cloud Slides', url: '/assets/figma/cat_footwear.png', category: 'Slides' },
    { label: 'Apparel / Cotton', url: '/assets/figma/cat_apparel.png', category: 'Clothes' },
    { label: 'Silk Handloom', url: '/assets/figma/cat_handloom.png', category: 'Sarees' },
    { label: 'Tech Gadget', url: '/assets/figma/cat_electronics.png', category: 'Accessories' }
  ];

  // Process uploaded files (via file input or drag-and-drop)
  const handleProcessFiles = (files) => {
    if (!files || files.length === 0) return;
    const fileList = Array.from(files);
    const validImageFiles = fileList.filter(f => f.type.startsWith('image/'));

    if (validImageFiles.length === 0) {
      showToast('Please select valid image files (PNG, JPG, WEBP, AVIF).');
      return;
    }

    if (uploadedImages.length + validImageFiles.length > 8) {
      showToast('Maximum 8 images permitted per product listing.');
      return;
    }

    playAddSound();
    let readCount = 0;
    const newItems = [];

    validImageFiles.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target.result;
        newItems.push({
          id: `img-${Date.now()}-${Math.random().toString(36).substr(2, 6)}-${idx}`,
          url: dataUrl,
          name: file.name,
          size: `${(file.size / 1024).toFixed(0)} KB`,
          isPrimary: uploadedImages.length === 0 && newItems.length === 0
        });

        readCount++;
        if (readCount === validImageFiles.length) {
          setUploadedImages(prev => {
            const hasPrimary = prev.some(img => img.isPrimary);
            if (!hasPrimary && newItems.length > 0) {
              newItems[0].isPrimary = true;
            }
            return [...prev, ...newItems];
          });
          showToast(`Added ${validImageFiles.length} product image(s).`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer && e.dataTransfer.files) {
      handleProcessFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files) {
      handleProcessFiles(e.target.files);
    }
  };

  const handleRemoveImage = (id) => {
    playClickSound();
    setUploadedImages(prev => {
      const filtered = prev.filter(img => img.id !== id);
      if (filtered.length > 0 && !filtered.some(img => img.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  const handleSetPrimaryImage = (id) => {
    playClickSound();
    setUploadedImages(prev => prev.map(img => ({
      ...img,
      isPrimary: img.id === id
    })));
    showToast('Updated primary cover image.');
  };

  const handleAddPresetImage = (preset) => {
    playClickSound();
    const alreadyExists = uploadedImages.some(img => img.url === preset.url);
    if (alreadyExists) {
      showToast('This preset image is already in your gallery.');
      return;
    }
    setUploadedImages(prev => [
      ...prev,
      {
        id: `img-preset-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        url: preset.url,
        name: `${preset.label.toLowerCase().replace(/\s+/g, '_')}.png`,
        size: 'Catalog Asset',
        isPrimary: prev.length === 0
      }
    ]);
    showToast(`Added ${preset.label} image to gallery.`);
  };

  const getCategorySizeOptions = (cat) => {
    if (['Sneakers', 'Sandals', 'Slides', 'Loafers'].includes(cat)) {
      return ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'];
    }
    if (['Clothes', 'Sarees'].includes(cat)) {
      return ['XS', 'S', 'M', 'L', 'XL', '2XL', 'Free Size'];
    }
    return ['Standard', '128 GB', '256 GB', '512 GB', 'One Size'];
  };

  const handleCategoryChange = (cat) => {
    setNewProdCategory(cat);
    const newSizes = getCategorySizeOptions(cat);
    setNewProdSizes(newSizes.slice(0, Math.min(5, newSizes.length)));
  };

  const handleToggleSize = (sz) => {
    playClickSound();
    setNewProdSizes(prev => 
      prev.includes(sz) ? prev.filter(s => s !== sz) : [...prev, sz]
    );
  };

  const handleAutoGenerateSku = () => {
    playClickSound();
    const prefix = newProdCategory === 'Sneakers' ? 'SS-SNK' :
                   newProdCategory === 'Sandals' ? 'SS-SND' :
                   newProdCategory === 'Slides' ? 'SS-SLD' :
                   newProdCategory === 'Loafers' ? 'SS-LFR' :
                   newProdCategory === 'Clothes' ? 'SS-APP' :
                   newProdCategory === 'Sarees' ? 'SS-SRI' : 'SS-CAT';
    const cleanWord = (newProdName.trim().replace(/[^a-zA-Z0-9]/g, '').slice(0, 4) || 'ITEM').toUpperCase();
    const rand = Math.floor(100 + Math.random() * 900);
    setNewProdSku(`${prefix}-${cleanWord}-${rand}`);
    showToast('Generated unique SKU code.');
  };

  // Add new product handler
  const handleCreateProduct = (e) => {
    e.preventDefault();
    if (!newProdName.trim()) {
      showToast('Please enter a product title');
      return;
    }

    const cleanPrice = Number(newProdPrice.toString().replace(/[^0-9]/g, '')) || 999;
    const cleanMrp = Number(newProdMrp.toString().replace(/[^0-9]/g, '')) || Math.round(cleanPrice * 1.4);
    const initialUnits = parseInt(newProdStock) || 20;

    if (cleanPrice <= 0) {
      showToast('Please specify a valid listing price.');
      return;
    }

    playAddSound();
    const generatedSku = newProdSku.trim() || `SS-${(newProdName.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 5) || 'PROD')}-0${products.length + 1}`;
    
    // Determine active sizes and distribute initial stock
    const activeSizesList = newProdSizes.length > 0 ? newProdSizes : ['Standard'];
    const perSize = Math.floor(initialUnits / activeSizesList.length);
    const remainder = initialUnits % activeSizesList.length;

    // Primary image & image gallery
    const primaryImgObj = uploadedImages.find(img => img.isPrimary) || uploadedImages[0] || {
      url: newProdCategory === 'Sandals' ? '/assets/figma/product_sandals.png' : 
           newProdCategory === 'Slides' ? '/assets/figma/cat_footwear.png' : 
           newProdCategory === 'Loafers' ? '/assets/figma/product_comfort_trainer.png' :
           '/assets/figma/product_court_sneaker.png'
    };

    const allImageUrls = uploadedImages.length > 0 
      ? uploadedImages.map(img => img.url) 
      : [primaryImgObj.url];

    const newProductObj = {
      sku: generatedSku,
      name: newProdName.trim(),
      subtitle: newProdSubtitle.trim() || 'Core Collection',
      category: newProdCategory,
      variants: `${activeSizesList.length} sizes`,
      price: `₹${cleanPrice.toLocaleString('en-IN')}`,
      stock: initialUnits,
      status: initialUnits <= lowStockThreshold ? (initialUnits === 0 ? 'Out of stock' : 'Low stock') : 'Live',
      statusArrow: initialUnits > lowStockThreshold,
      statusColor: initialUnits === 0 ? '#C92A2A' : (initialUnits <= lowStockThreshold ? '#855700' : '#14281C'),
      image: primaryImgObj.url,
      images: allImageUrls,
      description: newProdDescription.trim(),
      mrp: cleanMrp,
      trial_supported: newProdDoorstepTryOn
    };

    setProducts(prev => [newProductObj, ...prev]);

    const sizeInventoryMap = {};
    activeSizesList.forEach((sz, idx) => {
      sizeInventoryMap[sz] = {
        available: perSize + (idx === 0 ? remainder : 0),
        held: 0
      };
    });

    setProductInventories(prev => ({
      ...prev,
      [generatedSku]: sizeInventoryMap
    }));

    setSelectedProductSku(generatedSku);
    setSelectedSize(activeSizesList[0]);
    setShowAddProductModal(false);

    // Reset form fields
    setNewProdName('');
    setNewProdSku('');
    setNewProdSubtitle('');
    setNewProdPrice('1499');
    setNewProdMrp('2499');
    setNewProdStock('25');
    setNewProdDescription('Crafted from premium full-grain materials with cushioned ergonomics. Engineered for 10-minute doorstep try-on delivery with guaranteed local store origin.');
    setUploadedImages([
      { id: 'img-seed-1', url: '/assets/figma/product_court_sneaker.png', name: 'front_angle.png', isPrimary: true }
    ]);

    if (addMerchantProduct) {
      addMerchantProduct({
        name: newProductObj.name,
        category: newProductObj.category,
        price: cleanPrice,
        mrp: cleanMrp,
        stock: newProductObj.stock,
        sku: newProductObj.sku,
        image: newProductObj.image,
        images: newProductObj.images,
        sizes: activeSizesList,
        subtitle: newProductObj.subtitle,
        description: newProductObj.description,
        trial_supported: newProdDoorstepTryOn
      });
    } else {
      showToast(`Product "${newProductObj.name}" added to live catalog.`);
    }
  };

  // Add size handler
  const handleAddSizeVariant = (e) => {
    e.preventDefault();
    if (!newSizeName.trim()) return;
    playAddSound();
    const currSku = activeProduct.sku;
    const addedCount = parseInt(newSizeAvailable) || 0;

    setProductInventories(prev => ({
      ...prev,
      [currSku]: {
        ...(prev[currSku] || {}),
        [newSizeName.trim()]: { available: addedCount, held: 0 }
      }
    }));

    setSelectedSize(newSizeName.trim());
    setShowAddSizeModal(false);
    
    // Update product variant count
    setProducts(prev => prev.map(p => {
      if (p.sku === currSku) {
        const szCount = Object.keys(productInventories[currSku] || {}).length + 1;
        return {
          ...p,
          variants: `${szCount} sizes`,
          stock: p.stock + addedCount
        };
      }
      return p;
    }));

    showToast(`Added variant ${newSizeName.trim()} with ${addedCount} units`);
  };

  const downloadCatalogCSV = () => {
    playTrialSound();
    const headers = ['SKU,Product Name,Category,Subtitle,Price,Available Stock,Status'];
    const rows = products.map(p => 
      `"${p.sku}","${p.name}","${p.category}","${p.subtitle}","${p.price}","${p.stock}","${p.status}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Sole_Street_Catalog_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Catalog inventory exported to CSV file successfully.');
  };

  // Filtered products list
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    
    if (categoryFilter !== 'all' && p.category !== categoryFilter) {
      return false;
    }

    if (activeFilter === 'live') return p.status === 'Live';
    if (activeFilter === 'low_stock') return p.status === 'Low stock';
    if (activeFilter === 'unavailable') return p.status === 'Out of stock';
    return true;
  });

  // Calculate live KPI card metrics
  const totalProductsCount = products.length;
  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const lowStockCount = products.filter(p => p.status === 'Low stock').length;
  const unavailableCount = products.filter(p => p.status === 'Out of stock').length;
  const liveCount = products.filter(p => p.status === 'Live').length;
  const dynamicCategories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  return (
    <SellerLayout currentTab="products" breadcrumb="Products & stock" onBack={onBack}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', position: 'relative' }}>
        
        {/* 1. Header Title & Actions matching Figma */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h1 style={{
              margin: '0 0 6px 0',
              fontSize: '32px',
              fontWeight: 800,
              letterSpacing: '-0.03em',
              color: '#14281C'
            }}>
              Products & stock
            </h1>
            <p style={{ margin: 0, fontSize: '15px', color: '#687163', lineHeight: 1.5 }}>
              Manage product catalog, prices, and available size-level stock.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {!showVariantPanel && (
              <button
                onClick={() => { playClickSound(); setShowVariantPanel(true); }}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E5DC',
                  borderRadius: '10px',
                  padding: '10px 16px',
                  fontSize: '14px',
                  fontWeight: 700,
                  color: '#14281C',
                  cursor: 'pointer'
                }}
              >
                Show variant panel
              </button>
            )}

            <button
              onClick={downloadCatalogCSV}
              title="Download entire store catalog as CSV"
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D4DEC8',
                borderRadius: '10px',
                padding: '10px 18px',
                fontSize: '14px',
                fontWeight: 700,
                color: '#14281C',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => {
                if (!isApproved) {
                  playClickSound();
                  showToast('Product listing is locked while your store registration is under review by Nivvo Administration.');
                  return;
                }
                playClickSound();
                setShowAddProductModal(true);
              }}
              style={{
                backgroundColor: isApproved ? '#1E3827' : '#EFF1EC',
                border: isApproved ? 'none' : '1px solid #D8DCD1',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '14px',
                fontWeight: 700,
                color: isApproved ? '#FFFFFF' : '#6B7265',
                cursor: isApproved ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: isApproved ? '0 2px 6px rgba(30, 56, 39, 0.2)' : 'none'
              }}
              title={!isApproved ? 'Admin approval required to list products' : 'Add new product'}
            >
              {!isApproved ? <Lock size={15} /> : <Plus size={15} />}
              <span>{isApproved ? 'Add product' : 'Listing Locked'}</span>
            </button>
          </div>
        </div>

        {/* Store Verification Status Banner */}
        {!isApproved && (
          <div style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Clock size={18} color="#D97706" />
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#92400E' }}>
                Store application under review · Catalog publishing will unlock upon approval.
              </span>
            </div>
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 10px',
              backgroundColor: '#FEF3C7',
              borderRadius: '999px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#B45309'
            }}>
              <Lock size={12} />
              Pending Approval
            </span>
          </div>
        )}

        {/* 2. Top 4 Metric Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px'
        }}>
          <div 
            onClick={() => { playClickSound(); setActiveFilter('all'); setCategoryFilter('all'); }}
            style={{
              backgroundColor: '#FFFFFF',
              border: activeFilter === 'all' && categoryFilter === 'all' ? '2px solid #14281C' : '1px solid #ECEEE7',
              borderRadius: '16px',
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#14281C', letterSpacing: '-0.02em' }}>{totalProductsCount}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#687163' }}>Total products</span>
          </div>

          <div 
            onClick={() => { playClickSound(); showToast(`Total inventory: ${totalStockUnits} available units`); }}
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECEEE7',
              borderRadius: '16px',
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#14281C', letterSpacing: '-0.02em' }}>{totalStockUnits}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#687163' }}>Total units</span>
          </div>

          <div 
            onClick={() => { playClickSound(); setActiveFilter('low_stock'); }}
            style={{
              backgroundColor: '#FFFFFF',
              border: activeFilter === 'low_stock' ? '2px solid #855700' : '1px solid #ECEEE7',
              borderRadius: '16px',
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#855700', letterSpacing: '-0.02em' }}>{lowStockCount}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#687163' }}>Low stock</span>
          </div>

          <div 
            onClick={() => { playClickSound(); setActiveFilter('unavailable'); }}
            style={{
              backgroundColor: '#FFFFFF',
              border: activeFilter === 'unavailable' ? '2px solid #C92A2A' : '1px solid #ECEEE7',
              borderRadius: '16px',
              padding: '22px 24px',
              display: 'flex',
              alignItems: 'baseline',
              gap: '12px',
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
            }}
          >
            <span style={{ fontSize: '32px', fontWeight: 800, color: '#C92A2A', letterSpacing: '-0.02em' }}>{unavailableCount}</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#687163' }}>Out of stock</span>
          </div>
        </div>

        {/* 3. Search Bar & Category Dropdown */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', position: 'relative' }}>
          <div style={{
            flex: 1,
            minWidth: '280px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            backgroundColor: '#FFFFFF',
            border: '1px solid #E5E7DE',
            borderRadius: '12px',
            padding: '10px 14px'
          }}>
            <Search size={16} color="#73796F" />
            <input
              type="text"
              placeholder="Search product, SKU or variant"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                border: 'none',
                outline: 'none',
                width: '100%',
                fontSize: '13px',
                color: '#14281C',
                backgroundColor: 'transparent'
              }}
            />
            {searchTerm && (
              <X 
                size={14} 
                color="#73796F" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setSearchTerm('')} 
              />
            )}
          </div>

          <div style={{ position: 'relative' }}>
            <div 
              onClick={() => { playClickSound(); setShowCategoryMenu(prev => !prev); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: categoryFilter !== 'all' ? '#EFF5EE' : '#FFFFFF',
                border: categoryFilter !== 'all' ? '1.5px solid #1E3827' : '1px solid #E5E7DE',
                padding: '10px 16px',
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 600,
                color: categoryFilter !== 'all' ? '#1E3827' : '#14281C',
                cursor: 'pointer'
              }}
            >
              <span>{categoryFilter === 'all' ? 'All categories' : categoryFilter}</span>
              <ChevronDown size={14} color="#73796F" />
            </div>

            {showCategoryMenu && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 6px)',
                right: 0,
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E5DC',
                borderRadius: '12px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                minWidth: '180px',
                zIndex: 40,
                padding: '6px'
              }}>
                {dynamicCategories.map((cat) => (
                  <div
                    key={cat}
                    onClick={() => {
                      playClickSound();
                      setCategoryFilter(cat);
                      setShowCategoryMenu(false);
                      showToast(cat === 'all' ? 'Showing all categories' : `Filtered by ${cat}`);
                    }}
                    style={{
                      padding: '8px 12px',
                      fontSize: '12px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: categoryFilter === cat ? '#EFF5EE' : 'transparent',
                      color: categoryFilter === cat ? '#1E3827' : '#14281C',
                      fontWeight: categoryFilter === cat ? 600 : 400
                    }}
                  >
                    <span>{cat === 'all' ? 'All categories' : cat}</span>
                    {categoryFilter === cat && <Check size={14} color="#1E3827" />}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* 4. Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          <button
            onClick={() => { playClickSound(); setActiveFilter('all'); }}
            style={{
              backgroundColor: activeFilter === 'all' ? '#1E3827' : '#FFFFFF',
              color: activeFilter === 'all' ? '#FFFFFF' : '#14281C',
              border: activeFilter === 'all' ? 'none' : '1px solid #E5E7DE',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            All ({products.length})
          </button>

          <button
            onClick={() => { playClickSound(); setActiveFilter('live'); }}
            style={{
              backgroundColor: activeFilter === 'live' ? '#1E3827' : '#FFFFFF',
              color: activeFilter === 'live' ? '#FFFFFF' : '#14281C',
              border: activeFilter === 'live' ? 'none' : '1px solid #E5E7DE',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Live ({liveCount})
          </button>

          <button
            onClick={() => { playClickSound(); setActiveFilter('low_stock'); }}
            style={{
              backgroundColor: activeFilter === 'low_stock' ? '#1E3827' : '#FFFFFF',
              color: activeFilter === 'low_stock' ? '#FFFFFF' : '#14281C',
              border: activeFilter === 'low_stock' ? 'none' : '1px solid #E5E7DE',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Low stock ({lowStockCount})
          </button>

          <button
            onClick={() => { playClickSound(); setActiveFilter('unavailable'); }}
            style={{
              backgroundColor: activeFilter === 'unavailable' ? '#1E3827' : '#FFFFFF',
              color: activeFilter === 'unavailable' ? '#FFFFFF' : '#14281C',
              border: activeFilter === 'unavailable' ? 'none' : '1px solid #E5E7DE',
              padding: '6px 14px',
              borderRadius: '999px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Out of stock ({unavailableCount})
          </button>
        </div>

        {/* 5. Split View: Products Table (Left) + Manage Variants Panel (Right) */}
        <div className="nivvo-seller-products-split">
          {/* Left Table */}
          <div>
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #ECEEE7',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)'
            }}>
              <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
                <table style={{ width: '100%', minWidth: '560px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #ECEEE7', color: '#73796F', fontSize: '12px', fontWeight: 500, backgroundColor: '#FAFBF8' }}>
                    <th style={{ padding: '12px 18px', fontWeight: 500 }}>Product / SKU</th>
                    <th style={{ padding: '12px 14px', fontWeight: 500 }}>Variants</th>
                    <th style={{ padding: '12px 14px', fontWeight: 500 }}>Price</th>
                    <th style={{ padding: '12px 14px', fontWeight: 500 }}>Stock</th>
                    <th style={{ padding: '12px 18px', fontWeight: 500 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProducts.map((p, idx) => {
                    const isSelected = selectedProductSku === p.sku;
                    return (
                      <tr 
                        key={p.sku}
                        onClick={() => {
                          playClickSound();
                          setSelectedProductSku(p.sku);
                          setShowVariantPanel(true);
                          const firstSz = Object.keys(productInventories[p.sku] || {})[0] || 'UK 8';
                          setSelectedSize(firstSz);
                        }}
                        style={{
                          borderBottom: idx === filteredProducts.length - 1 ? 'none' : '1px solid #F0F2ED',
                          backgroundColor: isSelected ? '#FAFBF8' : '#FFFFFF',
                          cursor: 'pointer',
                          transition: 'background-color 0.1s ease'
                        }}
                      >
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{
                              width: '36px',
                              height: '36px',
                              borderRadius: '8px',
                              backgroundColor: '#F3F0E6',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              overflow: 'hidden',
                              flexShrink: 0
                            }}>
                              <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                            </div>
                            <div>
                              <div style={{ fontWeight: 600, color: '#14281C' }}>
                                {p.name}
                              </div>
                              <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px' }}>
                                {p.sku} · {p.subtitle}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 14px', color: '#14281C' }}>
                          {p.variants}
                        </td>
                        <td style={{ padding: '14px 14px', color: '#14281C' }}>
                          <div style={{ fontWeight: 700, color: '#14281C', fontSize: '14px' }}>{p.price}</div>
                        </td>
                        <td style={{ padding: '14px 14px', color: '#14281C', fontWeight: 600 }}>
                          {p.stock}
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span style={{
                            color: p.status === 'Live' ? '#15803D' : (p.status === 'Low stock' ? '#B45309' : '#DC2626'),
                            backgroundColor: p.status === 'Live' ? '#EDFDF0' : (p.status === 'Low stock' ? '#FFFBEB' : '#FEF2F2'),
                            border: `1px solid ${p.status === 'Live' ? '#BBF7D0' : (p.status === 'Low stock' ? '#FDE68A' : '#FECACA')}`,
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontWeight: 700,
                            fontSize: '12px',
                            display: 'inline-block'
                          }}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              </div>

              {/* Pagination */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 18px',
                borderTop: '1px solid #ECEEE7',
                fontSize: '12px',
                color: '#73796F',
                backgroundColor: '#FAFBF8'
              }}>
                <span>Showing {filteredProducts.length} of {filteredProducts.length} products</span>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontWeight: 700, color: '#14281C', padding: '2px 8px', borderRadius: '6px', backgroundColor: '#EFF1EC' }}>Page 1 of 1</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: '#73796F', marginTop: '12px', paddingLeft: '4px' }}>
              Stock updates automatically on order confirmation. Held units indicate items in customer try-on.
            </div>
          </div>

          {/* Right Panel: Manage Variants Card (Figma 1:1) */}
          {showVariantPanel && (
            <div style={{
              backgroundColor: '#FFFFFF',
              border: '1.5px solid #14281C',
              borderRadius: '16px',
              padding: '22px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#14281C' }}>
                  Manage variants
                </h3>
                <button 
                  onClick={() => { playClickSound(); setShowVariantPanel(false); }}
                  style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer', padding: '2px' }}
                >
                  <X size={16} />
                </button>
              </div>

              {/* Product Thumbnail Lockup */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '10px',
                  backgroundColor: '#EBE5D8',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0
                }}>
                  <img 
                    src={activeProduct.image} 
                    alt={activeProduct.name} 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
                  />
                </div>

                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#14281C' }}>
                    {activeProduct.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#73796F', marginTop: '2px' }}>
                    {activeProduct.sku} · {activeProduct.subtitle}
                  </div>
                  <div style={{
                    display: 'inline-block',
                    backgroundColor: activeProduct.stock > 0 ? '#EDFDF0' : '#FEF2F2',
                    color: activeProduct.stock > 0 ? '#15803D' : '#DC2626',
                    border: `1px solid ${activeProduct.stock > 0 ? '#BBF7D0' : '#FECACA'}`,
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '999px',
                    marginTop: '6px'
                  }}>
                    {activeProduct.stock > 0 ? 'Active on Storefront' : 'Out of Stock'}
                  </div>
                </div>
              </div>

              {/* Size-level stock Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #F0F2ED',
                paddingTop: '14px',
                marginBottom: '10px'
              }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#14281C' }}>
                  Size-level stock
                </span>
                <button 
                  onClick={() => { playClickSound(); setShowAddSizeModal(true); }}
                  style={{ background: 'none', border: 'none', color: '#14281C', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                >
                  + Add size
                </button>
              </div>

              {/* Size Stock Table */}
              <div style={{ border: '1px solid #ECEEE7', borderRadius: '10px', overflow: 'hidden', marginBottom: '12px' }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1.2fr 1fr 1fr',
                  backgroundColor: '#FAFBF8',
                  padding: '8px 14px',
                  fontSize: '11px',
                  color: '#73796F',
                  fontWeight: 500,
                  borderBottom: '1px solid #ECEEE7'
                }}>
                  <span>Size</span>
                  <span>Available</span>
                  <span>Held</span>
                </div>

                {Object.entries(activeSizes).map(([sz, val]) => {
                  const isSzSelected = selectedSize === sz;
                  return (
                    <div
                      key={sz}
                      onClick={() => { playClickSound(); setSelectedSize(sz); }}
                      style={{
                        display: 'grid',
                        gridTemplateColumns: '1.2fr 1fr 1fr',
                        padding: '10px 14px',
                        fontSize: '12px',
                        color: '#14281C',
                        backgroundColor: isSzSelected ? '#FAFBF8' : '#FFFFFF',
                        cursor: 'pointer',
                        borderBottom: '1px solid #F0F2ED',
                        fontWeight: isSzSelected ? 600 : 400
                      }}
                    >
                      <span>{sz}</span>
                      <span>{val.available}</span>
                      <span>{val.held}</span>
                    </div>
                  );
                })}
              </div>

              {/* Edit size available stepper */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid #F0F2ED',
                paddingTop: '14px',
                marginBottom: '14px'
              }}>
                <span style={{ fontSize: '13px', color: '#14281C' }}>
                  Edit {selectedSize} available
                </span>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  border: '1px solid #E2E5DC',
                  borderRadius: '8px',
                  backgroundColor: '#FFFFFF',
                  overflow: 'hidden'
                }}>
                  <button
                    onClick={() => handleAdjustStock(-1)}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: '6px 12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#14281C'
                    }}
                  >
                    -
                  </button>
                  <span style={{ fontSize: '13px', fontWeight: 600, color: '#14281C', minWidth: '28px', textAlign: 'center' }}>
                    {activeSizes[selectedSize]?.available || 0}
                  </span>
                  <button
                    onClick={() => handleAdjustStock(1)}
                    style={{
                      border: 'none',
                      background: 'none',
                      padding: '6px 12px',
                      fontSize: '14px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      color: '#14281C'
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Selling price */}
              <div style={{
                borderTop: '1px solid #F0F2ED',
                paddingTop: '14px',
                marginBottom: '14px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '13px', color: '#14281C', fontWeight: 600 }}>
                    Listing Price
                  </span>
                  <strong style={{ fontSize: '15px', color: '#14281C' }}>
                    {activeProduct.price}
                  </strong>
                </div>
                {(() => {
                  const raw = Number(activeProduct.price?.toString().replace(/[^0-9]/g, '')) || 0;
                  const comm = Math.round(raw * 0.10);
                  const custPrice = raw + comm;
                  return (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '12px' }}>
                      <span style={{ color: '#73796F' }}>
                        Buyer price (incl. platform fee):
                      </span>
                      <span style={{ fontWeight: 700, color: '#15803D' }}>
                        ₹{custPrice.toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })()}
              </div>

              {/* Low-stock alert threshold row */}
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <div 
                  onClick={() => { playClickSound(); setShowThresholdMenu(prev => !prev); }}
                  style={{
                    backgroundColor: '#F7F8F5',
                    borderRadius: '10px',
                    padding: '10px 14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontSize: '12px', color: '#73796F' }}>Low-stock alert at</span>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#14281C'
                  }}>
                    <span>{lowStockThreshold} {lowStockThreshold === 1 ? 'unit' : 'units'}</span>
                    <ChevronDown size={14} />
                  </div>
                </div>

                {showThresholdMenu && (
                  <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 4px)',
                    right: 0,
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E5DC',
                    borderRadius: '10px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                    zIndex: 30,
                    padding: '4px',
                    minWidth: '130px'
                  }}>
                    {[1, 2, 3, 5].map((u) => (
                      <div
                        key={u}
                        onClick={() => {
                          playClickSound();
                          setLowStockThreshold(u);
                          setShowThresholdMenu(false);
                          showToast(`Low-stock threshold set to ${u} units`);
                        }}
                        style={{
                          padding: '6px 10px',
                          fontSize: '12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          backgroundColor: lowStockThreshold === u ? '#EFF5EE' : 'transparent',
                          color: lowStockThreshold === u ? '#1E3827' : '#14281C',
                          fontWeight: lowStockThreshold === u ? 600 : 400
                        }}
                      >
                        <span>{u} {u === 1 ? 'unit' : 'units'}</span>
                        {lowStockThreshold === u && <Check size={12} color="#1E3827" />}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Primary Action Button (Lime Green in Figma) */}
              <button
                onClick={handleSaveStockChanges}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: '#B8F135',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  color: '#14281C',
                  cursor: 'pointer',
                  transition: 'opacity 0.15s ease'
                }}
              >
                Save stock changes
              </button>
            </div>
          )}
        </div>

        {/* Footer Meta Note */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '12px',
          color: '#73796F',
          padding: '0 4px',
          marginTop: '8px'
        }}>
          <span>Catalog and stock levels are synced in real time.</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={() => showToast('Catalog telemetry updated')}>
            Synced just now <RefreshCw size={12} />
          </span>
        </div>

      </div>

      {/* =========================================================================
          MODAL: ADD PRODUCT TO CATALOG
          ========================================================================= */}
      {showAddProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(14, 28, 19, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '22px',
            width: '100%',
            maxWidth: '860px',
            maxHeight: '92vh',
            border: '1px solid #DCE0D5',
            boxShadow: '0 25px 60px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(20,40,28,0.06)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '20px 28px',
              borderBottom: '1px solid #ECEEE7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FAFBF8'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    backgroundColor: '#14281C',
                    color: '#B8F135',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>
                    Store Inventory
                  </span>
                  <span style={{ fontSize: '11px', color: '#73796F' }}>Verified Sole Street Catalog</span>
                </div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#14281C', letterSpacing: '-0.02em' }}>
                  Add New Product
                </h3>
              </div>
              <button 
                type="button"
                onClick={() => setShowAddProductModal(false)}
                style={{
                  background: '#EFF1EC',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#495045',
                  cursor: 'pointer',
                  transition: 'background 0.15s ease'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Body - Scrollable Form */}
            <form onSubmit={handleCreateProduct} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '26px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>

                {/* 1. MEDIA & PRODUCT IMAGERY SECTION */}
                <div style={{
                  backgroundColor: '#FAFBF8',
                  border: '1px solid #E2E5DC',
                  borderRadius: '16px',
                  padding: '20px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <ImageIcon size={18} color="#1E3827" />
                      <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 700, color: '#14281C' }}>
                        Product Imagery & Media Gallery
                      </h4>
                    </div>
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: uploadedImages.length > 0 ? '#EDFDF0' : '#EFF1EC',
                      color: uploadedImages.length > 0 ? '#15803D' : '#6B7265',
                      border: `1px solid ${uploadedImages.length > 0 ? '#BBF7D0' : '#DCE0D5'}`,
                      padding: '3px 9px',
                      borderRadius: '999px'
                    }}>
                      {uploadedImages.length} of 8 images uploaded
                    </span>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: `2px dashed ${isDragging ? '#1E3827' : '#CAD0C3'}`,
                      backgroundColor: isDragging ? '#EEF6EB' : '#FFFFFF',
                      borderRadius: '14px',
                      padding: '24px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.18s ease'
                    }}
                  >
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      multiple 
                      accept="image/*"
                      onChange={handleFileInputChange}
                      style={{ display: 'none' }}
                    />
                    <div style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '50%',
                      backgroundColor: isDragging ? '#1E3827' : '#F1F4ED',
                      color: isDragging ? '#B8F135' : '#1E3827',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 10px auto',
                      transition: 'all 0.18s ease'
                    }}>
                      <UploadCloud size={24} />
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C', marginBottom: '4px' }}>
                      Drag & drop product images here, or <span style={{ color: '#1E3827', textDecoration: 'underline' }}>browse from computer</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#73796F' }}>
                      Supports PNG, JPG, WEBP, or AVIF (Max 10MB per image) · Multiple uploads supported
                    </div>
                  </div>

                  {/* Image Preview Gallery Grid */}
                  {uploadedImages.length > 0 && (
                    <div style={{ marginTop: '16px' }}>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#687163', marginBottom: '8px' }}>
                        Uploaded Images (Click ⭐ to designate primary store listing photo):
                      </div>
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
                        gap: '12px'
                      }}>
                        {uploadedImages.map((img) => (
                          <div
                            key={img.id}
                            style={{
                              position: 'relative',
                              backgroundColor: '#FFFFFF',
                              borderRadius: '12px',
                              border: img.isPrimary ? '2px solid #14281C' : '1px solid #DCE0D5',
                              boxShadow: img.isPrimary ? '0 4px 12px rgba(20,40,28,0.12)' : '0 1px 3px rgba(0,0,0,0.02)',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            {/* Primary Cover Badge */}
                            {img.isPrimary && (
                              <div style={{
                                position: 'absolute',
                                top: '6px',
                                left: '6px',
                                backgroundColor: '#14281C',
                                color: '#B8F135',
                                fontSize: '10px',
                                fontWeight: 800,
                                padding: '2px 6px',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '3px',
                                zIndex: 2
                              }}>
                                <Star size={9} fill="#B8F135" /> Cover
                              </div>
                            )}

                            {/* Image Thumbnail Container */}
                            <div style={{
                              height: '100px',
                              backgroundColor: '#F7F8F4',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '6px'
                            }}>
                              <img
                                src={img.url}
                                alt={img.name}
                                style={{
                                  maxWidth: '100%',
                                  maxHeight: '100%',
                                  objectFit: 'contain'
                                }}
                              />
                            </div>

                            {/* Image Info & Actions Strip */}
                            <div style={{ padding: '6px 8px', borderTop: '1px solid #F0F2ED', backgroundColor: '#FFFFFF' }}>
                              <div style={{
                                fontSize: '11px',
                                fontWeight: 600,
                                color: '#14281C',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                              }}>
                                {img.name}
                              </div>
                              <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: '4px'
                              }}>
                                {!img.isPrimary ? (
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleSetPrimaryImage(img.id); }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#1E3827',
                                      fontSize: '10px',
                                      fontWeight: 700,
                                      cursor: 'pointer',
                                      padding: '0',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '2px'
                                    }}
                                  >
                                    <Star size={10} /> Set Cover
                                  </button>
                                ) : (
                                  <span style={{ fontSize: '10px', color: '#15803D', fontWeight: 700 }}>
                                    Primary
                                  </span>
                                )}
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); handleRemoveImage(img.id); }}
                                  title="Remove image"
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#DC2626',
                                    cursor: 'pointer',
                                    padding: '2px',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                >
                                  <Trash2 size={12} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Preset Photos Quick-Add Tray */}
                  <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #ECEEE7' }}>
                    <div style={{ fontSize: '11px', fontWeight: 600, color: '#73796F', marginBottom: '8px' }}>
                      Or click verified sample photos to test catalog display:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                      {CATALOG_PHOTO_PRESETS.map((preset, pIdx) => (
                        <button
                          key={pIdx}
                          type="button"
                          onClick={() => handleAddPresetImage(preset)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            padding: '4px 10px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid #DCE0D5',
                            borderRadius: '8px',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: '#14281C',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <img src={preset.url} alt={preset.label} style={{ width: '16px', height: '16px', objectFit: 'contain' }} />
                          <span>+ {preset.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 2. GENERAL PRODUCT DETAILS */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px' }}>
                  {/* Left Column: Name, Category, Colorway */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                        Product Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Vintage Leather Court Trainer"
                        value={newProdName}
                        onChange={(e) => setNewProdName(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '11px 14px',
                          borderRadius: '10px',
                          border: '1px solid #DCE0D5',
                          fontSize: '13px',
                          color: '#14281C',
                          outline: 'none',
                          backgroundColor: '#FFFFFF'
                        }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                          Category *
                        </label>
                        <select
                          value={newProdCategory}
                          onChange={(e) => handleCategoryChange(e.target.value)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '11px 12px',
                            borderRadius: '10px',
                            border: '1px solid #DCE0D5',
                            fontSize: '13px',
                            color: '#14281C',
                            backgroundColor: '#FFFFFF',
                            outline: 'none'
                          }}
                        >
                          <option value="Sneakers">Footwear & Sneakers</option>
                          <option value="Sandals">Sandals & Slides</option>
                          <option value="Loafers">Loafers & Formals</option>
                          <option value="Clothes">Clothes & Apparel</option>
                          <option value="Sarees">Sarees & Handloom</option>
                          <option value="Laptops">Laptops & Computing</option>
                          <option value="Mobiles">Smartphones & Mobiles</option>
                          <option value="Accessories">Fast Chargers & Tech</option>
                          <option value="Bags">Bags & Backpacks</option>
                          <option value="Stationery">Books, Pens & Notebooks</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                          Colorway / Edition
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Sage / Forest White"
                          value={newProdSubtitle}
                          onChange={(e) => setNewProdSubtitle(e.target.value)}
                          style={{
                            width: '100%',
                            boxSizing: 'border-box',
                            padding: '11px 14px',
                            borderRadius: '10px',
                            border: '1px solid #DCE0D5',
                            fontSize: '13px',
                            color: '#14281C',
                            outline: 'none',
                            backgroundColor: '#FFFFFF'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: SKU Generator & Doorstep Try-on Toggle */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                        SKU Identifier
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="e.g. SS-COURT-08"
                          value={newProdSku}
                          onChange={(e) => setNewProdSku(e.target.value)}
                          style={{
                            flex: 1,
                            boxSizing: 'border-box',
                            padding: '11px 12px',
                            borderRadius: '10px',
                            border: '1px solid #DCE0D5',
                            fontSize: '13px',
                            color: '#14281C',
                            outline: 'none',
                            backgroundColor: '#FFFFFF'
                          }}
                        />
                        <button
                          type="button"
                          onClick={handleAutoGenerateSku}
                          style={{
                            padding: '0 12px',
                            borderRadius: '10px',
                            border: '1px solid #DCE0D5',
                            backgroundColor: '#FAFBF8',
                            fontSize: '11px',
                            fontWeight: 700,
                            color: '#1E3827',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap'
                          }}
                        >
                          Auto SKU
                        </button>
                      </div>
                    </div>

                    {/* Doorstep Try-On Service Toggle Card */}
                    <div 
                      onClick={() => setNewProdDoorstepTryOn(prev => !prev)}
                      style={{
                        padding: '12px 14px',
                        backgroundColor: newProdDoorstepTryOn ? '#FAFBF8' : '#FFFFFF',
                        border: `1.5px solid ${newProdDoorstepTryOn ? '#1E3827' : '#E2E5DC'}`,
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#14281C' }}>
                            10-Min Doorstep Try-On
                          </span>
                          <span style={{
                            fontSize: '9px',
                            fontWeight: 800,
                            backgroundColor: '#B8F135',
                            color: '#14281C',
                            padding: '1px 5px',
                            borderRadius: '3px'
                          }}>
                            NIVVO SIGNATURE
                          </span>
                        </div>
                        <div style={{ fontSize: '11px', color: '#73796F', lineHeight: '1.3' }}>
                          Riders carry adjacent sizes for instant fitting at customer door.
                        </div>
                      </div>
                      <div style={{
                        width: '38px',
                        height: '22px',
                        borderRadius: '11px',
                        backgroundColor: newProdDoorstepTryOn ? '#1E3827' : '#DCE0D5',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '2px',
                        transition: 'all 0.15s ease',
                        flexShrink: 0
                      }}>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          backgroundColor: '#FFFFFF',
                          transform: newProdDoorstepTryOn ? 'translateX(16px)' : 'translateX(0)',
                          transition: 'transform 0.15s ease'
                        }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. PRICING & INVENTORY CALCULATION */}
                <div style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E5DC',
                  borderRadius: '16px',
                  padding: '20px'
                }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#14281C', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Tag size={15} color="#1E3827" />
                    <span>Pricing, Inventory & Revenue Breakdown</span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                        Selling Price (₹) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="1499"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value.replace(/[^0-9]/g, ''))}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #DCE0D5',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#14281C',
                          outline: 'none'
                        }}
                      />
                      <span style={{ fontSize: '11px', color: '#73796F', marginTop: '4px', display: 'block' }}>
                        Your direct net payout per unit
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                        Original MRP (₹)
                      </label>
                      <input
                        type="text"
                        placeholder="2499"
                        value={newProdMrp}
                        onChange={(e) => setNewProdMrp(e.target.value.replace(/[^0-9]/g, ''))}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #DCE0D5',
                          fontSize: '14px',
                          color: '#687163',
                          outline: 'none'
                        }}
                      />
                      <span style={{ fontSize: '11px', color: '#73796F', marginTop: '4px', display: 'block' }}>
                        Display strikethrough price
                      </span>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                        Initial Stock (Units) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        placeholder="25"
                        value={newProdStock}
                        onChange={(e) => setNewProdStock(e.target.value)}
                        style={{
                          width: '100%',
                          boxSizing: 'border-box',
                          padding: '10px 14px',
                          borderRadius: '10px',
                          border: '1px solid #DCE0D5',
                          fontSize: '14px',
                          fontWeight: 700,
                          color: '#14281C',
                          outline: 'none'
                        }}
                      />
                      <span style={{ fontSize: '11px', color: '#73796F', marginTop: '4px', display: 'block' }}>
                        Distributed across sizes
                      </span>
                    </div>
                  </div>

                  {/* Financial Settlement Bar */}
                  {(() => {
                    const cleanP = Number(newProdPrice.toString().replace(/[^0-9]/g, '')) || 0;
                    const cleanM = Number(newProdMrp.toString().replace(/[^0-9]/g, '')) || Math.round(cleanP * 1.4);
                    const commission = Math.round(cleanP * 0.10);
                    const custPrice = cleanP + commission;
                    const discount = Math.max(0, cleanM - custPrice);
                    const discPercent = cleanM > 0 ? Math.round((discount / cleanM) * 100) : 0;

                    return (
                      <div style={{
                        marginTop: '16px',
                        backgroundColor: '#FAFBF8',
                        border: '1px solid #E2E5DC',
                        borderRadius: '12px',
                        padding: '12px 16px',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, 1fr)',
                        gap: '12px'
                      }}>
                        <div>
                          <div style={{ fontSize: '11px', color: '#73796F' }}>Seller Net Payout:</div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#14281C' }}>₹{cleanP.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: '10px', color: '#15803D', fontWeight: 600 }}>100% credited</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: '#73796F' }}>Nivvo Fee (10%):</div>
                          <div style={{ fontSize: '14px', fontWeight: 700, color: '#495045' }}>+₹{commission.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: '10px', color: '#73796F' }}>Try-on logistics</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: '#73796F' }}>Customer App Price:</div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#1E3827' }}>₹{custPrice.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: '10px', color: '#1E3827', fontWeight: 600 }}>Shown to buyers</div>
                        </div>

                        <div>
                          <div style={{ fontSize: '11px', color: '#73796F' }}>Buyer Savings:</div>
                          <div style={{ fontSize: '14px', fontWeight: 800, color: '#855700' }}>Save ₹{discount.toLocaleString('en-IN')}</div>
                          <div style={{ fontSize: '10px', color: '#855700', fontWeight: 600 }}>{discPercent}% OFF MRP</div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* 4. SIZES & VARIANT STOCK ALLOCATION */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: 700, color: '#14281C' }}>
                      Active Sizes ({newProdSizes.length} enabled)
                    </label>
                    <span style={{ fontSize: '11px', color: '#73796F' }}>
                      Click sizes to toggle availability
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    {getCategorySizeOptions(newProdCategory).map((sz) => {
                      const isSelected = newProdSizes.includes(sz);
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => handleToggleSize(sz)}
                          style={{
                            padding: '8px 14px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            backgroundColor: isSelected ? '#1E3827' : '#FFFFFF',
                            color: isSelected ? '#FFFFFF' : '#495045',
                            border: `1.5px solid ${isSelected ? '#1E3827' : '#DCE0D5'}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.12s ease'
                          }}
                        >
                          {isSelected && <Check size={12} color="#B8F135" />}
                          <span>{sz}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div style={{ fontSize: '11px', color: '#73796F' }}>
                    Initial stock of {parseInt(newProdStock) || 0} units will be automatically divided evenly across the {newProdSizes.length || 1} selected size variants.
                  </div>
                </div>

                {/* 5. DESCRIPTION & MATERIALS */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 700, color: '#14281C', marginBottom: '6px' }}>
                    Product Description & Craftsmanship Details
                  </label>
                  <textarea
                    rows="3"
                    value={newProdDescription}
                    onChange={(e) => setNewProdDescription(e.target.value)}
                    placeholder="Describe upper materials, fit guidance, sole cushioning, and care instructions..."
                    style={{
                      width: '100%',
                      boxSizing: 'border-box',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #DCE0D5',
                      fontSize: '13px',
                      color: '#14281C',
                      outline: 'none',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                  />
                </div>

              </div>

              {/* Modal Sticky Footer */}
              <div style={{
                padding: '16px 28px',
                borderTop: '1px solid #ECEEE7',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#FAFBF8'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#687163' }}>
                  <CheckCircle2 size={15} color="#15803D" />
                  <span>
                    <strong>{uploadedImages.length}</strong> photo(s) · <strong>{newProdSizes.length}</strong> sizes · <strong>₹{Number(newProdPrice.toString().replace(/[^0-9]/g, '') || 0).toLocaleString('en-IN')}</strong> listing price
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setShowAddProductModal(false)}
                    style={{
                      padding: '11px 20px',
                      borderRadius: '10px',
                      border: '1px solid #DCE0D5',
                      backgroundColor: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#73796F',
                      cursor: 'pointer'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!newProdName.trim() || uploadedImages.length === 0}
                    style={{
                      padding: '11px 24px',
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: (!newProdName.trim() || uploadedImages.length === 0) ? '#D8DCD1' : '#B8F135',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: '#14281C',
                      cursor: (!newProdName.trim() || uploadedImages.length === 0) ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background 0.15s ease'
                    }}
                  >
                    <Plus size={16} />
                    <span>Publish product to catalog</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          MODAL: ADD SIZE VARIANT
          ========================================================================= */}
      {showAddSizeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(20, 40, 28, 0.45)',
          backdropFilter: 'blur(3px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            width: '100%',
            maxWidth: '380px',
            border: '1px solid #E2E5DC',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid #ECEEE7',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#FAFBF8'
            }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#14281C' }}>
                Add size for {activeProduct.name}
              </h3>
              <button 
                onClick={() => setShowAddSizeModal(false)}
                style={{ background: 'none', border: 'none', color: '#73796F', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleAddSizeVariant} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#14281C', marginBottom: '6px' }}>
                  Size Label
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. UK 11 or UK 5"
                  value={newSizeName}
                  onChange={(e) => setNewSizeName(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #DCE0D5',
                    fontSize: '13px',
                    color: '#14281C',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#14281C', marginBottom: '6px' }}>
                  Initial Available Stock
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={newSizeAvailable}
                  onChange={(e) => setNewSizeAvailable(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid #DCE0D5',
                    fontSize: '13px',
                    color: '#14281C',
                    outline: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddSizeModal(false)}
                  style={{
                    flex: 1,
                    padding: '9px',
                    borderRadius: '8px',
                    border: '1px solid #DCE0D5',
                    backgroundColor: '#FFFFFF',
                    fontSize: '12px',
                    fontWeight: 600,
                    color: '#73796F',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 2,
                    padding: '9px',
                    borderRadius: '8px',
                    border: 'none',
                    backgroundColor: '#B8F135',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: '#14281C',
                    cursor: 'pointer'
                  }}
                >
                  Confirm size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}
