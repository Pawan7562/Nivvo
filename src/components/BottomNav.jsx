import { Home, LayoutGrid, Sparkles, Package, User } from 'lucide-react';
import { playClickSound } from '../utils/audioEffects';

export default function BottomNav({ activeView, setActiveView, activeOrder, wishlistCount }) {
  const handleTabClick = (viewId) => {
    playClickSound();
    setActiveView(viewId);
  };

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home
    },
    {
      id: 'categories',
      label: 'Shops',
      icon: LayoutGrid
    },
    {
      id: 'ai-fit',
      label: 'AI Fit',
      icon: Sparkles,
      badge: 'Smart',
      badgeColor: '#24452D'
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: Package,
      hasPulse: !!activeOrder
    },
    {
      id: 'profile',
      label: 'You',
      icon: User
    }
  ];

  return (
    <nav className="mobile-bottom-nav">
      <div className="bottom-nav-inner">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id;

          return (
            <button
              key={item.id}
              className={`bottom-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
            >
              <div className="nav-icon-container">
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                {item.badge && (
                  <span 
                    className="nav-icon-badge"
                    style={{ backgroundColor: item.badgeColor }}
                  >
                    {item.badge}
                  </span>
                )}
                {item.hasPulse && (
                  <span className="nav-live-dot" />
                )}
              </div>
              <span className="bottom-nav-label">{item.label}</span>
            </button>
          );
        })}
      </div>
      {/* iOS Home Indicator Bar */}
      <div className="ios-home-indicator" />
    </nav>
  );
}
