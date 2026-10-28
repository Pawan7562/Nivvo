import React, { useState } from 'react';
import { 
  X, 
  Palette, 
  Sparkles, 
  Layers, 
  RotateCcw, 
  Download, 
  Upload, 
  Check, 
  Sliders, 
  Clock, 
  MapPin, 
  ShieldCheck, 
  FileCode, 
  ExternalLink,
  ChevronRight,
  Eye,
  Settings
} from 'lucide-react';
import { useCustomization } from '../context/CustomizationContext';
import { playClickSound } from '../utils/audioEffects';

export default function LiveCustomizerDrawer({ onNavigateToAdminStudio }) {
  const {
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
    presets
  } = useCustomization();

  const [activeTab, setActiveTab] = useState('presets'); // 'presets', 'branding', 'colors', 'layout', 'figma'
  const [copySuccess, setCopySuccess] = useState(false);
  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState('');

  if (!isCustomizerOpen) return null;

  const handleCopyJson = () => {
    playClickSound();
    const json = exportConfigJson();
    navigator.clipboard.writeText(json).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const handleApplyImport = () => {
    playClickSound();
    if (!importText.trim()) return;
    const ok = importConfigJson(importText);
    if (ok) {
      setImportStatus('success');
      setTimeout(() => setImportStatus(''), 2500);
      setImportText('');
    } else {
      setImportStatus('error');
    }
  };

  const currentColors = config.colors || presets.nivvo;

  return (
    <div className="customizer-drawer-overlay" onClick={() => setIsCustomizerOpen(false)}>
      <div 
        className="customizer-drawer-panel" 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="customizer-drawer-header">
          <div className="customizer-title-group">
            <div className="customizer-icon-badge">
              <Palette size={18} color="#FFFFFF" />
            </div>
            <div>
              <div className="customizer-headline">Nivvo App Studio & Customizer</div>
              <div className="customizer-subline">Live Theme, Branding & Layout Controls</div>
            </div>
          </div>
          <button 
            className="customizer-close-btn"
            onClick={() => { playClickSound(); setIsCustomizerOpen(false); }}
            aria-label="Close Customizer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="customizer-tabs-bar">
          <button 
            className={`customizer-tab-btn ${activeTab === 'presets' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('presets'); }}
          >
            <Sparkles size={14} />
            <span>Presets</span>
          </button>
          <button 
            className={`customizer-tab-btn ${activeTab === 'branding' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('branding'); }}
          >
            <Sliders size={14} />
            <span>Branding & ETA</span>
          </button>
          <button 
            className={`customizer-tab-btn ${activeTab === 'colors' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('colors'); }}
          >
            <Palette size={14} />
            <span>Colors</span>
          </button>
          <button 
            className={`customizer-tab-btn ${activeTab === 'layout' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('layout'); }}
          >
            <Layers size={14} />
            <span>Sections</span>
          </button>
          <button 
            className={`customizer-tab-btn ${activeTab === 'figma' ? 'active' : ''}`}
            onClick={() => { playClickSound(); setActiveTab('figma'); }}
          >
            <FileCode size={14} />
            <span>Figma / JSON</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="customizer-drawer-body">
          {/* TAB 1: PRESETS */}
          {activeTab === 'presets' && (
            <div className="customizer-section-content">
              <div className="customizer-info-card">
                <span className="info-pill">Figma Design System</span>
                <p>Choose an instant marketplace preset or customize individual colors and branding below.</p>
              </div>

              <div className="customizer-presets-grid">
                {Object.values(presets).map((p) => {
                  const isSelected = config.presetId === p.id;
                  return (
                    <button
                      key={p.id}
                      className={`preset-card-item ${isSelected ? 'selected' : ''}`}
                      onClick={() => { playClickSound(); applyPreset(p.id); }}
                    >
                      <div className="preset-card-colors">
                        <span className="preset-swatch" style={{ backgroundColor: p.primary }} />
                        <span className="preset-swatch" style={{ backgroundColor: p.secondary }} />
                        <span className="preset-swatch" style={{ backgroundColor: p.headerBg }} />
                      </div>
                      <div className="preset-meta">
                        <span className="preset-name">{p.name}</span>
                        <span className="preset-tagline">{p.tagline}</span>
                      </div>
                      {isSelected && (
                        <div className="preset-check-badge">
                          <Check size={12} strokeWidth={3} />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Jump to Full Brand Board */}
              <div className="customizer-admin-banner">
                <div className="admin-banner-text">
                  <div className="admin-banner-title">Need 16-Screen System View?</div>
                  <div className="admin-banner-desc">Inspect all 16 coordinated screens & Dark Store network in the Platform Admin Studio.</div>
                </div>
                <button 
                  className="admin-banner-btn"
                  onClick={() => {
                    playClickSound();
                    setIsCustomizerOpen(false);
                    if (onNavigateToAdminStudio) onNavigateToAdminStudio();
                  }}
                >
                  <span>Open Studio</span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: BRANDING & ETA */}
          {activeTab === 'branding' && (
            <div className="customizer-section-content">
              <div className="input-control-group">
                <label className="customizer-label">Marketplace Brand Name</label>
                <input 
                  type="text" 
                  className="customizer-text-input"
                  value={config.appName}
                  onChange={(e) => updateConfig('appName', e.target.value)}
                  placeholder="e.g. Nivvo, Nivvo Express, Nivvo Prime"
                />
                <span className="input-hint">Displayed on header, splash, app icons and invoices</span>
              </div>

              <div className="input-control-group">
                <label className="customizer-label">Brand Tagline / Slogan</label>
                <input 
                  type="text" 
                  className="customizer-text-input"
                  value={config.tagline}
                  onChange={(e) => updateConfig('tagline', e.target.value)}
                  placeholder="e.g. Hyperlocal Fashion & Essentials"
                />
              </div>

              <div className="input-control-group">
                <label className="customizer-label">Contextual Delivery Estimate (ETA)</label>
                <div className="quick-eta-chips">
                  {['8-12 mins', '12-18 mins', '15-20 mins', '25 mins (Hyperlocal)'].map((eta) => (
                    <button
                      key={eta}
                      className={`eta-chip-btn ${config.etaText === eta ? 'active' : ''}`}
                      onClick={() => { playClickSound(); updateConfig('etaText', eta); }}
                    >
                      <Clock size={11} />
                      <span>{eta}</span>
                    </button>
                  ))}
                </div>
                <input 
                  type="text" 
                  className="customizer-text-input"
                  style={{ marginTop: '8px' }}
                  value={config.etaText}
                  onChange={(e) => updateConfig('etaText', e.target.value)}
                  placeholder="Custom ETA text"
                />
              </div>

              <div className="input-control-group">
                <label className="customizer-label">Hyperlocal Dark Store Hub</label>
                <input 
                  type="text" 
                  className="customizer-text-input"
                  value={config.hubName}
                  onChange={(e) => updateConfig('hubName', e.target.value)}
                  placeholder="e.g. Indiranagar Hub #14 (400m away)"
                />
              </div>

              <div className="input-control-row">
                <div className="control-half">
                  <label className="customizer-label">Currency Symbol</label>
                  <select 
                    className="customizer-select"
                    value={config.currencySymbol}
                    onChange={(e) => updateConfig('currencySymbol', e.target.value)}
                  >
                    <option value="₹">₹ (Indian Rupee - INR)</option>
                    <option value="$">$ (USD)</option>
                    <option value="€">€ (Euro)</option>
                    <option value="£">£ (Pound)</option>
                    <option value="AED">AED (Dirham)</option>
                  </select>
                </div>
                <div className="control-half">
                  <label className="customizer-label">Border Radius</label>
                  <input 
                    type="range" 
                    min="4" 
                    max="24" 
                    value={config.borderRadius || 12}
                    onChange={(e) => updateConfig('borderRadius', parseInt(e.target.value, 10))}
                    className="customizer-slider"
                  />
                  <span className="slider-value-display">{config.borderRadius || 12}px</span>
                </div>
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <div className="toggle-title">Free Doorstep 2-Size Trial</div>
                  <div className="toggle-desc">Allow customers to order 2 adjacent sizes for ₹0 try-on</div>
                </div>
                <input 
                  type="checkbox"
                  className="customizer-checkbox"
                  checked={config.doorstepTrialEnabled}
                  onChange={(e) => updateConfig('doorstepTrialEnabled', e.target.checked)}
                />
              </div>

              <div className="toggle-switch-row">
                <div className="toggle-info">
                  <div className="toggle-title">Show Real-time Local Stock</div>
                  <div className="toggle-desc">Display remaining inventory tags from the nearest dark store</div>
                </div>
                <input 
                  type="checkbox"
                  className="customizer-checkbox"
                  checked={config.localStockDisplay}
                  onChange={(e) => updateConfig('localStockDisplay', e.target.checked)}
                />
              </div>
            </div>
          )}

          {/* TAB 3: COLORS */}
          {activeTab === 'colors' && (
            <div className="customizer-section-content">
              <div className="colors-customizer-list">
                {/* Primary */}
                <div className="color-row-item">
                  <div className="color-info">
                    <span className="color-name">Primary Brand Color</span>
                    <span className="color-desc">Main CTA buttons, active highlights & icons</span>
                  </div>
                  <div className="color-picker-wrapper">
                    <input 
                      type="color" 
                      value={currentColors.primary} 
                      onChange={(e) => updateColor('primary', e.target.value)}
                      className="native-color-picker"
                    />
                    <span className="color-hex-tag">{currentColors.primary}</span>
                  </div>
                </div>

                {/* Primary Hover */}
                <div className="color-row-item">
                  <div className="color-info">
                    <span className="color-name">Primary Dark / Hover</span>
                    <span className="color-desc">Button press states & deep contrast badges</span>
                  </div>
                  <div className="color-picker-wrapper">
                    <input 
                      type="color" 
                      value={currentColors.primaryHover || currentColors.primary} 
                      onChange={(e) => updateColor('primaryHover', e.target.value)}
                      className="native-color-picker"
                    />
                    <span className="color-hex-tag">{currentColors.primaryHover || currentColors.primary}</span>
                  </div>
                </div>

                {/* Secondary */}
                <div className="color-row-item">
                  <div className="color-info">
                    <span className="color-name">Secondary Accent (Mint)</span>
                    <span className="color-desc">Speed badges, stock indicators & tags</span>
                  </div>
                  <div className="color-picker-wrapper">
                    <input 
                      type="color" 
                      value={currentColors.secondary} 
                      onChange={(e) => updateColor('secondary', e.target.value)}
                      className="native-color-picker"
                    />
                    <span className="color-hex-tag">{currentColors.secondary}</span>
                  </div>
                </div>

                {/* Soft Accent / Background */}
                <div className="color-row-item">
                  <div className="color-info">
                    <span className="color-name">Soft Tint Surface</span>
                    <span className="color-desc">Subtle card backgrounds & highlight badges</span>
                  </div>
                  <div className="color-picker-wrapper">
                    <input 
                      type="color" 
                      value={currentColors.accentSoft} 
                      onChange={(e) => updateColor('accentSoft', e.target.value)}
                      className="native-color-picker"
                    />
                    <span className="color-hex-tag">{currentColors.accentSoft}</span>
                  </div>
                </div>

                {/* Header Background */}
                <div className="color-row-item">
                  <div className="color-info">
                    <span className="color-name">Mobile Header Background</span>
                    <span className="color-desc">Top application bar & brand canvas</span>
                  </div>
                  <div className="color-picker-wrapper">
                    <input 
                      type="color" 
                      value={currentColors.headerBg} 
                      onChange={(e) => updateColor('headerBg', e.target.value)}
                      className="native-color-picker"
                    />
                    <span className="color-hex-tag">{currentColors.headerBg}</span>
                  </div>
                </div>

                {/* Page Background */}
                <div className="color-row-item">
                  <div className="color-info">
                    <span className="color-name">Page Canvas Background</span>
                    <span className="color-desc">Base backdrop color of the app shell</span>
                  </div>
                  <div className="color-picker-wrapper">
                    <input 
                      type="color" 
                      value={currentColors.bgPage} 
                      onChange={(e) => updateColor('bgPage', e.target.value)}
                      className="native-color-picker"
                    />
                    <span className="color-hex-tag">{currentColors.bgPage}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LAYOUT & SECTIONS */}
          {activeTab === 'layout' && (
            <div className="customizer-section-content">
              <div className="customizer-info-card">
                <span className="info-pill">Storefront Architecture</span>
                <p>Toggle individual sections on or off to tailor the customer storefront layout.</p>
              </div>

              <div className="sections-toggle-list">
                {[
                  { key: 'heroSlider', label: 'Top Hero Announcement Slider', desc: 'Featured marketing campaigns & flash offers' },
                  { key: 'contextualDeliveryBanner', label: 'Contextual ETA Notice Bar', desc: 'Local dark store speed & live dispatch status' },
                  { key: 'visualCategoryGrid', label: 'Visual Department Categories Grid', desc: 'Image-based fashion categories with badges' },
                  { key: 'festiveShowcase', label: 'Festive & Seasonal Drop Spotlight', desc: 'Curated ethnic and seasonal showcases' },
                  { key: 'sosEmergency', label: '10-Min SOS Ready-to-Wear Kits', desc: 'Emergency wardrobe rescue packages' },
                  { key: 'doorstepTrialBanner', label: 'Doorstep 2-Size Trial Showcase', desc: 'Try 2 adjacent sizes for ₹0 promotion' },
                  { key: 'bestsellers', label: 'Hyperlocal Bestsellers Shelf', desc: 'Most ordered outfits in this neighborhood' },
                  { key: 'multiCategoryShelves', label: 'Multi-Department Product Shelves', desc: 'Shirts, denims, footwear, watches and accessories' }
                ].map((sec) => (
                  <div key={sec.key} className="toggle-switch-row">
                    <div className="toggle-info">
                      <div className="toggle-title">{sec.label}</div>
                      <div className="toggle-desc">{sec.desc}</div>
                    </div>
                    <input 
                      type="checkbox"
                      className="customizer-checkbox"
                      checked={config.sectionsVisibility?.[sec.key] !== false}
                      onChange={() => { playClickSound(); toggleSection(sec.key); }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FIGMA & EXPORT / IMPORT */}
          {activeTab === 'figma' && (
            <div className="customizer-section-content">
              {/* Figma MCP Card */}
              <div className="figma-mcp-status-card">
                <div className="figma-card-top">
                  <div className="figma-badge">
                    <span className="figma-dot" />
                    <span>Figma MCP Protocol</span>
                  </div>
                  <span className="figma-endpoint">https://mcp.figma.com/mcp</span>
                </div>
                <div className="figma-file-info">
                  <div className="figma-file-title">File Key: fShSo1L9nwNqrOgz7GPN4D</div>
                  <div className="figma-file-sub">Nivvo: 16 Coordinated Screens & Brand System Board</div>
                </div>
                <div className="figma-features-tags">
                  <span className="figma-tag">8 Customer Screens</span>
                  <span className="figma-tag">3 Shop-Owner Dashboards</span>
                  <span className="figma-tag">3 Delivery-Partner Screens</span>
                  <span className="figma-tag">2 Platform-Admin Boards</span>
                  <span className="figma-tag">Indian Rupee Pricing</span>
                  <span className="figma-tag">Contextual ETA</span>
                </div>
              </div>

              {/* Export JSON */}
              <div className="export-import-box">
                <div className="box-title-row">
                  <span className="box-heading">Export Configuration</span>
                  <button className="box-action-btn" onClick={handleCopyJson}>
                    {copySuccess ? <Check size={13} color="#10B981" /> : <Download size={13} />}
                    <span>{copySuccess ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
                  </button>
                </div>
                <textarea 
                  className="json-code-box"
                  readOnly
                  value={exportConfigJson()}
                  rows={6}
                />
              </div>

              {/* Import JSON */}
              <div className="export-import-box">
                <div className="box-title-row">
                  <span className="box-heading">Import Configuration</span>
                  <button className="box-action-btn" onClick={handleApplyImport}>
                    <Upload size={13} />
                    <span>Apply JSON</span>
                  </button>
                </div>
                <textarea 
                  className="json-code-box editable"
                  placeholder="Paste exported Nivvo theme JSON here..."
                  value={importText}
                  onChange={(e) => setImportText(e.target.value)}
                  rows={4}
                />
                {importStatus === 'success' && (
                  <span className="status-badge-success">Theme imported successfully!</span>
                )}
                {importStatus === 'error' && (
                  <span className="status-badge-error">Invalid JSON format. Please verify and retry.</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="customizer-drawer-footer">
          <button 
            className="drawer-reset-btn"
            onClick={() => { playClickSound(); resetToNivvo(); }}
            title="Reset to Nivvo Green (Figma Original)"
          >
            <RotateCcw size={14} />
            <span>Reset to Nivvo</span>
          </button>
          <button 
            className="drawer-done-btn"
            onClick={() => { playClickSound(); setIsCustomizerOpen(false); }}
          >
            <Check size={15} />
            <span>Apply & Close</span>
          </button>
        </div>
      </div>
    </div>
  );
}
