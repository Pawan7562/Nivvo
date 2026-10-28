import React from 'react';
import { playClickSound } from '../utils/audioEffects';
import chhathBannerImg from '../assets/chath_puja_banner.jpg';

const MENS_WARDROBE = [
  {
    name: 'Oversized T-Shirts',
    category: 'casual',
    bg: '#E0F2FE',
    img: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Formal Shirts',
    category: 'formal',
    bg: '#FEF3C7',
    img: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Chinos & Trousers',
    category: 'bottoms',
    bg: '#FFEDD5',
    img: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Polos & Collars',
    category: 'casual',
    bg: '#ECFDF5',
    img: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Jeans & Denims',
    category: 'bottoms',
    bg: '#FEF9C3',
    img: 'https://images.unsplash.com/photo-1542272604-780c96856592?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Trunks & Innerwear',
    category: 'innerwear',
    bg: '#F5F5F4',
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Activewear & Gym',
    category: 'active',
    bg: '#FEE2E2',
    img: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Jackets & Hoodies',
    category: 'casual',
    bg: '#EEF2FF',
    img: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=200&auto=format&fit=crop&q=80'
  }
];

const WOMENS_TRENDS = [
  {
    name: 'Kurtis & Anarkalis',
    category: 'festive',
    bg: '#FCE7F3',
    img: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Western Dresses',
    category: 'women',
    bg: '#E0F2FE',
    img: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Crop Tops & Tees',
    category: 'women',
    bg: '#FEF3C7',
    img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Palazzos & Pants',
    category: 'women',
    bg: '#EDE9FE',
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Co-ord Sets',
    category: 'women',
    bg: '#DCFCE7',
    img: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Heels & Party Flats',
    category: 'footwear',
    bg: '#FFEDD5',
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Handbags & Totes',
    category: 'accessories',
    bg: '#FEE2E2',
    img: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Ethnic Sarees',
    category: 'festive',
    bg: '#FEF9C3',
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=200&auto=format&fit=crop&q=80'
  }
];

const FOOTWEAR_SLIPPERS = [
  {
    name: 'EVA Cloud Slides',
    category: 'footwear',
    bg: '#FEF3C7',
    img: 'https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Retro Sneakers',
    category: 'footwear',
    bg: '#E0F2FE',
    img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Running & Sports',
    category: 'footwear',
    bg: '#DCFCE7',
    img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Formal Oxfords',
    category: 'formal',
    bg: '#FFEDD5',
    img: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Slip-on Loafers',
    category: 'footwear',
    bg: '#FCE7F3',
    img: 'https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Comfort Slippers',
    category: 'footwear',
    bg: '#EDE9FE',
    img: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Casual Flip Flops',
    category: 'footwear',
    bg: '#FEE2E2',
    img: 'https://images.unsplash.com/photo-1562273138-f46be4ebdf33?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Cushioned Socks',
    category: 'innerwear',
    bg: '#F5F5F4',
    img: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=200&auto=format&fit=crop&q=80'
  }
];

const ELECTRONICS_GADGETS = [
  {
    name: 'TWS ANC Earbuds',
    category: 'electronics',
    bg: '#E0F2FE',
    img: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Smartwatches',
    category: 'accessories',
    bg: '#FEF3C7',
    img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: '65W Fast Chargers',
    category: 'electronics',
    bg: '#F1F5F9',
    img: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Bluetooth Speakers',
    category: 'electronics',
    bg: '#EDE9FE',
    img: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Power Banks',
    category: 'electronics',
    bg: '#FFEDD5',
    img: 'https://images.unsplash.com/photo-1609592424075-84226d97a59a?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Grooming Trimmers',
    category: 'electronics',
    bg: '#FEE2E2',
    img: 'https://images.unsplash.com/photo-1621607512214-68297480165e?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Studio Headphones',
    category: 'electronics',
    bg: '#DCFCE7',
    img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&auto=format&fit=crop&q=80'
  },
  {
    name: 'Braided Cables',
    category: 'electronics',
    bg: '#F5F5F4',
    img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=200&auto=format&fit=crop&q=80'
  }
];

const SPOTLIGHT_STORES = [
  {
    name: 'Sneaker Hub',
    sub: 'Retro & Air Drops',
    bg: '#E0F2FE',
    border: '#BAE6FD',
    category: 'footwear',
    emoji: '👟'
  },
  {
    name: 'Formals Express',
    sub: 'Wrinkle-Free in 10 Mins',
    bg: '#FEF3C7',
    border: '#FDE68A',
    category: 'formal',
    emoji: '👔'
  },
  {
    name: 'Doorstep Trial Store',
    sub: 'Try 2 Sizes, Keep 1',
    bg: '#EDE9FE',
    border: '#DDD6FE',
    category: 'all',
    emoji: '📦'
  },
  {
    name: 'Audio Dark Store',
    sub: 'Instant Beat Delivery',
    bg: '#DCFCE7',
    border: '#BBF7D0',
    category: 'electronics',
    emoji: '🎧'
  }
];

const PICKS_FOR_LIFESTYLE = [
  { name: 'Luxury Watches', sub: 'Steel & Chronograph', bg: '#FEF3C7', category: 'accessories' },
  { name: 'Designer Shades', sub: 'UV400 Polarized', bg: '#FFEDD5', category: 'accessories' },
  { name: 'Leather Belts', sub: 'Reversible Genuine', bg: '#DBEAFE', category: 'accessories' },
  { name: 'RFID Wallets', sub: 'Slim MagSafe Wallets', bg: '#FCE7F3', category: 'accessories' },
  { name: 'Perfumes & Deos', sub: 'Long-Lasting EDP', bg: '#E0F2FE', category: 'accessories' },
  { name: 'Crossbody Bags', sub: 'Urban Sling Bags', bg: '#DCFCE7', category: 'accessories' },
  { name: 'Caps & Snapbacks', sub: 'Streetwear Fits', bg: '#FEE2E2', category: 'casual' },
  { name: 'SOS Emergency Outfits', sub: 'Delivered in 7 Mins', bg: '#FEF9C3', category: 'sos' }
];

export default function BlinkitMultiCategorySections({ onSelectCategory }) {
  const renderCategoryGrid = (title, items) => (
    <div className="blinkit-cat-section-block">
      <h3 className="blinkit-cat-section-heading">{title}</h3>
      <div className="blinkit-4col-grid">
        {items.map((item, idx) => (
          <div 
            key={idx} 
            className="blinkit-4col-card"
            onClick={() => {
              playClickSound();
              onSelectCategory(item.category);
            }}
          >
            <div className="cat-thumb-box" style={{ backgroundColor: item.bg }}>
              <img 
                src={item.img} 
                alt={item.name} 
                className="cat-thumb-img" 
                loading="lazy" 
              />
            </div>
            <span className="cat-card-label">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="blinkit-multi-category-container">
      {/* 1. Men's Wardrobe */}
      {renderCategoryGrid("Men's Wardrobe in 10 Mins", MENS_WARDROBE)}

      {/* 2. Women's Trends */}
      {renderCategoryGrid("Women's Fashion Trends", WOMENS_TRENDS)}

      {/* 3. Footwear & Slippers Store */}
      {renderCategoryGrid("Footwear, Slides & Slippers", FOOTWEAR_SLIPPERS)}

      {/* 4. Electronics & Audio Gadgets */}
      {renderCategoryGrid("Electronics & Audio Gadgets", ELECTRONICS_GADGETS)}

      {/* Shubh Chhath Puja Festive Feature Banner */}
      <div 
        className="blinkit-chhath-puja-banner" 
        onClick={() => { playClickSound(); onSelectCategory('festive'); }}
      >
        <img 
          src={chhathBannerImg || "/chath_puja_banner.jpg"} 
          alt="Shubh Chhath Puja Festive Outfits & Puja Wear in 10 Mins" 
          className="chhath-banner-img"
        />
        <div className="chhath-banner-badge">
          <span>⚡ 10-MIN EXPRESS</span>
        </div>
      </div>

      {/* 5. Stores in spotlight */}
      <div className="blinkit-cat-section-block">
        <h3 className="blinkit-cat-section-heading">Stores in spotlight</h3>
        <div className="spotlight-stores-row">
          {SPOTLIGHT_STORES.map((st, idx) => (
            <div 
              key={idx} 
              className="spotlight-store-card"
              style={{ backgroundColor: st.bg, borderColor: st.border }}
              onClick={() => {
                playClickSound();
                onSelectCategory(st.category);
              }}
            >
              <span className="spotlight-emoji">{st.emoji}</span>
              <strong className="spotlight-name">{st.name}</strong>
              <span className="spotlight-sub">{st.sub}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 6. Picks for your lifestyle */}
      <div className="blinkit-cat-section-block">
        <h3 className="blinkit-cat-section-heading">Picks for your lifestyle</h3>
        <div className="lifestyle-picks-grid">
          {PICKS_FOR_LIFESTYLE.map((p, idx) => (
            <div 
              key={idx} 
              className="lifestyle-pick-card"
              style={{ backgroundColor: p.bg }}
              onClick={() => {
                playClickSound();
                onSelectCategory(p.category);
              }}
            >
              <strong className="lifestyle-title">{p.name}</strong>
              <span className="lifestyle-sub">{p.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
