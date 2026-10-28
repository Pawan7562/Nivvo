import React, { createContext, useContext, useState, useEffect } from 'react';

// Preset Themes inspired by Figma "Nivvo" design & Indian quick-commerce brands
export const THEME_PRESETS = {
  nivvo: {
    id: 'nivvo',
    name: 'Nivvo (Figma Official)',
    tagline: 'Nearby finds. Local possibilities.',
    primary: '#B7F34A',
    primaryHover: '#A4E532',
    forest: '#24452D',
    secondary: '#24452D',
    accentSoft: '#F7F8F5',
    accentBorder: '#E7EAE3',
    headerBg: '#24452D',
    headerText: '#FFFFFF',
    bgPage: '#F7F8F5',
    bgCard: '#FFFFFF',
    textMain: '#20251F',
    textMuted: '#73796F',
    badgeBg: '#B7F34A',
    defaultEta: '12–18 min',
    hubName: 'Home · Indiranagar, Bengaluru',
    brandIcon: 'arrow-up-right',
    isDark: false
  },
  blinkit: {
    id: 'blinkit',
    name: 'Classic Yellow & Green',
    tagline: '10-Minute Wardrobe & Essentials',
    primary: '#FFD200',
    primaryHover: '#E5BD00',
    secondary: '#0C831F',
    accentSoft: '#FFFBEB',
    accentBorder: '#FEF08A',
    headerBg: '#1E293B',
    headerText: '#FFFFFF',
    bgPage: '#F8F9FA',
    bgCard: '#FFFFFF',
    textMain: '#0F172A',
    textMuted: '#64748B',
    badgeBg: '#FFD200',
    defaultEta: '10 mins',
    hubName: 'Indiranagar Dark Store #14',
    brandIcon: 'zap',
    isDark: false
  },
  zepto: {
    id: 'zepto',
    name: 'Zepto Ultra Violet',
    tagline: 'Fast Fashion Delivered in Minutes',
    primary: '#7C3AED',
    primaryHover: '#6D28D9',
    secondary: '#EC4899',
    accentSoft: '#F5F3FF',
    accentBorder: '#DDD6FE',
    headerBg: '#4C1D95',
    headerText: '#FFFFFF',
    bgPage: '#FAFAFC',
    bgCard: '#FFFFFF',
    textMain: '#0F172A',
    textMuted: '#64748B',
    badgeBg: '#7C3AED',
    defaultEta: '9 mins',
    hubName: 'Zepto Hub - Koramangala',
    brandIcon: 'sparkles',
    isDark: false
  },
  instamart: {
    id: 'instamart',
    name: 'Instamart Electric Orange',
    tagline: 'Instant Hyperlocal Drops',
    primary: '#EA580C',
    primaryHover: '#C2410C',
    secondary: '#F97316',
    accentSoft: '#FFF7ED',
    accentBorder: '#FFEDD5',
    headerBg: '#9A3412',
    headerText: '#FFFFFF',
    bgPage: '#F9FAFB',
    bgCard: '#FFFFFF',
    textMain: '#111827',
    textMuted: '#6B7280',
    badgeBg: '#EA580C',
    defaultEta: '15 mins',
    hubName: 'Instamart Pod #22',
    brandIcon: 'shopping-bag',
    isDark: false
  },
  myntra: {
    id: 'myntra',
    name: 'Myntra Haute Pink',
    tagline: 'Runway Trends at Your Doorstep',
    primary: '#E11D48',
    primaryHover: '#BE185D',
    secondary: '#FB7185',
    accentSoft: '#FFF1F2',
    accentBorder: '#FECDD3',
    headerBg: '#881337',
    headerText: '#FFFFFF',
    bgPage: '#FFFBFB',
    bgCard: '#FFFFFF',
    textMain: '#18181B',
    textMuted: '#71717A',
    badgeBg: '#E11D48',
    defaultEta: '15-20 mins',
    hubName: 'Express Fashion Pod #09',
    brandIcon: 'heart',
    isDark: false
  },
  darkStealth: {
    id: 'darkStealth',
    name: 'Midnight Luxury Dark',
    tagline: 'Sleek Hyperlocal Commerce',
    primary: '#10B981',
    primaryHover: '#059669',
    secondary: '#6366F1',
    accentSoft: '#1E293B',
    accentBorder: '#334155',
    headerBg: '#090D16',
    headerText: '#F8FAFC',
    bgPage: '#0F172A',
    bgCard: '#1E293B',
    textMain: '#F8FAFC',
    textMuted: '#94A3B8',
    badgeBg: '#10B981',
    defaultEta: '12-15 mins',
    hubName: 'Downtown Dark Store 01',
    brandIcon: 'moon',
    isDark: true
  }
};

const DEFAULT_CONFIG = {
  appName: 'nivvo',
  tagline: 'Nearby finds. Local possibilities.',
  presetId: 'nivvo',
  colors: { ...THEME_PRESETS.nivvo },
  etaText: '12–18 min',
  deliveryMode: 'contextual', // 'contextual', 'fixed10', 'express15', 'sameDay'
  currencySymbol: '₹',
  hubName: 'Home · Indiranagar, Bengaluru',
  doorstepTrialEnabled: true,
  localStockDisplay: true,
  borderRadius: 12, // in px
  fontFamily: "'Outfit', 'Plus Jakarta Sans', sans-serif",
  sectionsVisibility: {
    heroSlider: true,
    contextualDeliveryBanner: true,
    visualCategoryGrid: true,
    festiveShowcase: true,
    sosEmergency: true,
    doorstepTrialBanner: true,
    bestsellers: true,
    multiCategoryShelves: true
  }
};

const CustomizationContext = createContext(null);

export function CustomizationProvider({ children }) {
  const [config, setConfig] = useState(() => {
    try {
      const saved = localStorage.getItem('nivvo_app_customization');
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load customizations:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);

  // Apply CSS Custom Properties dynamically to :root whenever colors or config change
  useEffect(() => {
    const root = document.documentElement;
    const c = config.colors || THEME_PRESETS.nivvo;

    root.style.setProperty('--brand-primary', c.primary);
    root.style.setProperty('--brand-primary-hover', c.primaryHover);
    root.style.setProperty('--brand-secondary', c.secondary);
    root.style.setProperty('--brand-accent-soft', c.accentSoft);
    root.style.setProperty('--brand-accent-border', c.accentBorder);
    root.style.setProperty('--brand-header-bg', c.headerBg);
    root.style.setProperty('--brand-header-text', c.headerText);
    root.style.setProperty('--brand-badge-bg', c.badgeBg);

    // Backward-compatibility mapping with existing classes
    root.style.setProperty('--brand-green', c.primary);
    root.style.setProperty('--brand-green-hover', c.primaryHover);
    root.style.setProperty('--brand-green-soft', c.accentSoft);
    root.style.setProperty('--brand-green-border', c.accentBorder);

    if (c.primary === '#FFD200') {
      root.style.setProperty('--brand-yellow', '#FFD200');
    }

    root.style.setProperty('--bg-page', c.bgPage);
    root.style.setProperty('--bg-card', c.bgCard);
    root.style.setProperty('--text-main', c.textMain);
    root.style.setProperty('--text-muted', c.textMuted);
    root.style.setProperty('--radius-md', `${config.borderRadius || 12}px`);
    root.style.setProperty('--radius-lg', `${(config.borderRadius || 12) + 4}px`);

    if (c.isDark) {
      document.body.classList.add('dark-theme-active');
    } else {
      document.body.classList.remove('dark-theme-active');
    }

    try {
      localStorage.setItem('nivvo_app_customization', JSON.stringify(config));
    } catch (e) {
      console.warn('Failed to save customization config:', e);
    }
  }, [config]);

  // Actions
  const applyPreset = (presetId) => {
    const preset = THEME_PRESETS[presetId];
    if (!preset) return;
    setConfig(prev => ({
      ...prev,
      presetId,
      colors: { ...preset },
      appName: 'Nivvo',
      etaText: preset.defaultEta || prev.etaText,
      hubName: preset.hubName || prev.hubName
    }));
  };

  const updateColor = (key, value) => {
    setConfig(prev => ({
      ...prev,
      presetId: 'custom',
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const toggleSection = (sectionKey) => {
    setConfig(prev => ({
      ...prev,
      sectionsVisibility: {
        ...prev.sectionsVisibility,
        [sectionKey]: !prev.sectionsVisibility[sectionKey]
      }
    }));
  };

  const resetToNivvo = () => {
    setConfig(DEFAULT_CONFIG);
  };

  const exportConfigJson = () => {
    return JSON.stringify(config, null, 2);
  };

  const importConfigJson = (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      setConfig({ ...DEFAULT_CONFIG, ...parsed });
      return true;
    } catch (e) {
      console.error('Invalid JSON configuration', e);
      return false;
    }
  };

  return (
    <CustomizationContext.Provider
      value={{
        config,
        isCustomizerOpen,
        setIsCustomizerOpen,
        applyPreset,
        updateColor,
        updateConfig,
        toggleSection,
        resetToNivvo,
        exportConfigJson,
        importConfigJson,
        presets: THEME_PRESETS
      }}
    >
      {children}
    </CustomizationContext.Provider>
  );
}

export function useCustomization() {
  const context = useContext(CustomizationContext);
  if (!context) {
    throw new Error('useCustomization must be used within a CustomizationProvider');
  }
  return context;
}
