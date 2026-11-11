import React from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { IconHome, IconGrid, IconHeart, IconUser, IconCart } from '../icons/CustomIcons';

export type NavTabId = 'home' | 'catalog' | 'wishlist' | 'profile';

export interface TabBarProps {
  activeTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  cartCount?: number;
  onCartClick?: () => void;
}

export const TabBar: React.FC<TabBarProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
  onCartClick,
}) => {
  const handleTabClick = (tab: NavTabId) => {
    try {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    } catch {}
    onTabChange(tab);
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      pointerEvents: 'none',
    }}>
      <div style={{
        position: 'relative',
        pointerEvents: 'auto',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: '24px',
        borderTopRightRadius: '24px',
        boxShadow: '0 -6px 24px rgba(74, 183, 182, 0.12)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        padding: '10px 16px calc(12px + env(safe-area-inset-bottom, 0px))',
      }}>
        {/* Tab 1: Home */}
        <button
          onClick={() => handleTabClick('home')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'home' ? '#4AB7B6' : '#94A3B8',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: activeTab === 'home' ? 'scale(1.18)' : 'scale(1)',
            transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), color 150ms ease',
          }}
        >
          <IconHome size={24} color={activeTab === 'home' ? '#4AB7B6' : '#94A3B8'} />
        </button>

        {/* Tab 2: Catalog / Grid */}
        <button
          onClick={() => handleTabClick('catalog')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'catalog' ? '#4AB7B6' : '#94A3B8',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginRight: '28px',
            transform: activeTab === 'catalog' ? 'scale(1.18)' : 'scale(1)',
            transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), color 150ms ease',
          }}
        >
          <IconGrid size={24} color={activeTab === 'catalog' ? '#4AB7B6' : '#94A3B8'} />
        </button>

        {/* Center Floating Cart Circle (HyperMart Orange Button) */}
        <div style={{
          position: 'absolute',
          top: '-24px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <button
            onClick={() => {
              try {
                Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
              } catch {}
              onCartClick?.();
            }}
            style={{
              width: '58px',
              height: '58px',
              borderRadius: '50%',
              backgroundColor: '#FDAA5D',
              border: '4px solid #FFFFFF',
              boxShadow: '0 8px 20px rgba(253, 170, 93, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              position: 'relative',
              transform: cartCount > 0 ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            <IconCart size={26} color="#FFFFFF" strokeWidth={2.5} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                backgroundColor: '#EA7173',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '2px 6px',
                fontSize: '11px',
                fontWeight: 800,
                boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                fontFamily: "'Poppins', sans-serif",
                animation: 'badgePop 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>

        {/* Tab 3: Wishlist / Heart */}
        <button
          onClick={() => handleTabClick('wishlist')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'wishlist' ? '#4AB7B6' : '#94A3B8',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            marginLeft: '28px',
            transform: activeTab === 'wishlist' ? 'scale(1.18)' : 'scale(1)',
            transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), color 150ms ease',
          }}
        >
          <IconHeart size={24} color={activeTab === 'wishlist' ? '#4AB7B6' : '#94A3B8'} />
        </button>

        {/* Tab 4: Profile / User */}
        <button
          onClick={() => handleTabClick('profile')}
          style={{
            background: 'none',
            border: 'none',
            color: activeTab === 'profile' ? '#4AB7B6' : '#94A3B8',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: activeTab === 'profile' ? 'scale(1.18)' : 'scale(1)',
            transition: 'transform 250ms cubic-bezier(0.34, 1.56, 0.64, 1), color 150ms ease',
          }}
        >
          <IconUser size={24} color={activeTab === 'profile' ? '#4AB7B6' : '#94A3B8'} />
        </button>
      </div>
    </div>
  );
};
