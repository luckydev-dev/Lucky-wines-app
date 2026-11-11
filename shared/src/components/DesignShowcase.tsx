import React, { useState } from 'react';
import { THEME_TOKENS } from '../theme/tokens';
import {
  IconHome, IconSearch, IconCart, IconUser, IconBag, IconBottle, IconGlass,
  IconUPI, IconCash, IconBell, IconEdit, IconDelete, IconPlus, IconMinus,
  IconFilter, IconClock, IconLocation, IconReceipt, IconCheck, IconClose,
  IconChevronLeft, IconChevronRight, IconChevronDown, IconChevronUp,
  IconStar, IconShield, IconLock, IconPhone, IconMapPin, IconShare,
  IconCopy, IconRefresh, IconHeart, IconAlertCircle, IconEye, IconEyeOff,
  IconGrid, IconTag, IconSliders, IconTruck, IconGift, IconLogOut,
  IconCheckCircle, IconInfo,
} from '../icons/CustomIcons';
import {
  IllustrateWhiskey, IllustrateBeer, IllustrateWine, IllustrateVodka,
  IllustrateRum, IllustrateGin, IllustrateTequila, IllustrateMixers, IllustrateSnacks
} from '../illustrations/CategoryIllustrations';
import { EmptyState } from '../illustrations/EmptyStates';
import { Button } from './Button';
import { Input } from './Input';
import { Chip } from './Chips';
import { Badge } from './Badge';
import { QuantityStepper } from './QuantityStepper';
import { ProductCard } from './ProductCard';
import { BottomSheet } from './BottomSheet';
import { CardSkeleton, BannerSkeleton } from './Skeleton';
import { useToast } from './Toast';
import { Product } from '../types';

export const DesignShowcase: React.FC<{ appName: string; onBack?: () => void }> = ({
  appName,
  onBack,
}) => {
  const { showToast } = useToast();
  const [selectedChip, setSelectedChip] = useState('All');
  const [stepperQty, setStepperQty] = useState(2);
  const [cardQty, setCardQty] = useState(1);
  const [inputText, setInputText] = useState('Single Malt 750ml');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [activeTabSection, setActiveTabSection] = useState<'components' | 'icons' | 'illustrations' | 'palette'>('components');

  const demoProduct: Product = {
    id: 'demo_1',
    name: 'Glenfiddich 12 Year Old Reserve Scotch',
    brand: 'Glenfiddich',
    categoryId: 'cat_whiskey',
    sizeMl: 750,
    abv: 40,
    price: 5400,
    mrp: 5900,
    stock: 15,
    description: 'Aged in the finest Oloroso sherry and bourbon casks.',
    images: ['https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600'],
    tags: ['Single Malt', 'Aged 12Y'],
    visible: true,
    featured: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  const iconsList = [
    { name: 'Home', icon: <IconHome size={22} /> },
    { name: 'Search', icon: <IconSearch size={22} /> },
    { name: 'Cart', icon: <IconCart size={22} /> },
    { name: 'User', icon: <IconUser size={22} /> },
    { name: 'Bag', icon: <IconBag size={22} /> },
    { name: 'Bottle', icon: <IconBottle size={22} /> },
    { name: 'Glass', icon: <IconGlass size={22} /> },
    { name: 'UPI', icon: <IconUPI size={22} /> },
    { name: 'Cash', icon: <IconCash size={22} /> },
    { name: 'Bell', icon: <IconBell size={22} /> },
    { name: 'Edit', icon: <IconEdit size={22} /> },
    { name: 'Delete', icon: <IconDelete size={22} /> },
    { name: 'Plus', icon: <IconPlus size={22} /> },
    { name: 'Minus', icon: <IconMinus size={22} /> },
    { name: 'Filter', icon: <IconFilter size={22} /> },
    { name: 'Clock', icon: <IconClock size={22} /> },
    { name: 'Location', icon: <IconLocation size={22} /> },
    { name: 'Receipt', icon: <IconReceipt size={22} /> },
    { name: 'Check', icon: <IconCheck size={22} /> },
    { name: 'Close', icon: <IconClose size={22} /> },
    { name: 'Prev', icon: <IconChevronLeft size={22} /> },
    { name: 'Next', icon: <IconChevronRight size={22} /> },
    { name: 'Down', icon: <IconChevronDown size={22} /> },
    { name: 'Up', icon: <IconChevronUp size={22} /> },
    { name: 'Star', icon: <IconStar size={22} /> },
    { name: 'Shield', icon: <IconShield size={22} /> },
    { name: 'Lock', icon: <IconLock size={22} /> },
    { name: 'Phone', icon: <IconPhone size={22} /> },
    { name: 'MapPin', icon: <IconMapPin size={22} /> },
    { name: 'Share', icon: <IconShare size={22} /> },
    { name: 'Copy', icon: <IconCopy size={22} /> },
    { name: 'Refresh', icon: <IconRefresh size={22} /> },
    { name: 'Heart', icon: <IconHeart size={22} /> },
    { name: 'Alert', icon: <IconAlertCircle size={22} /> },
    { name: 'Eye', icon: <IconEye size={22} /> },
    { name: 'EyeOff', icon: <IconEyeOff size={22} /> },
    { name: 'Grid', icon: <IconGrid size={22} /> },
    { name: 'Tag', icon: <IconTag size={22} /> },
    { name: 'Sliders', icon: <IconSliders size={22} /> },
    { name: 'Truck', icon: <IconTruck size={22} /> },
    { name: 'Gift', icon: <IconGift size={22} /> },
    { name: 'LogOut', icon: <IconLogOut size={22} /> },
    { name: 'CheckCircle', icon: <IconCheckCircle size={22} /> },
    { name: 'Info', icon: <IconInfo size={22} /> },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#151113',
      color: '#FCFAF8',
      padding: '20px',
      paddingBottom: '80px',
      boxSizing: 'border-box',
    }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingBottom: '16px',
        borderBottom: '1px solid rgba(201, 163, 41, 0.25)',
        marginBottom: '20px',
      }}>
        <div>
          <span style={{ fontSize: '11px', color: '#C9A329', fontWeight: 700, letterSpacing: '1px' }}>
            DESIGN SYSTEM &bull; STEP 2
          </span>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '2px 0 0', color: '#FCEBA4' }}>
            {appName} Showcase
          </h2>
        </div>
        {onBack && (
          <Button variant="secondary" size="sm" onClick={onBack}>
            Exit
          </Button>
        )}
      </div>

      {/* Nav Pills for Showcase */}
      <div style={{
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '14px',
        marginBottom: '16px',
      }}>
        {(['components', 'icons', 'illustrations', 'palette'] as const).map((tab) => (
          <Chip
            key={tab}
            label={tab.toUpperCase()}
            isActive={activeTabSection === tab}
            onClick={() => setActiveTabSection(tab)}
          />
        ))}
      </div>

      {/* Tab: COMPONENTS */}
      {activeTabSection === 'components' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          {/* Section: Buttons */}
          <div>
            <h4 style={{ fontSize: '14px', color: '#C9A329', margin: '0 0 12px', fontWeight: 700 }}>
              1. BUTTON SYSTEM (SPRING + HAPTICS)
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <Button variant="primary" onClick={() => showToast('Primary wine button tapped', 'success')}>
                Primary Wine
              </Button>
              <Button variant="gold" onClick={() => showToast('Gold accent tapped', 'info')}>
                Gold Accent
              </Button>
              <Button variant="secondary" onClick={() => showToast('Secondary outlined tapped', 'warning')}>
                Secondary
              </Button>
              <Button variant="danger" size="sm" onClick={() => showToast('Destructive action', 'error')}>
                Danger
              </Button>
              <Button variant="ghost" size="sm">
                Ghost
              </Button>
              <Button variant="primary" isLoading>
                Loading
              </Button>
            </div>
          </div>

          {/* Section: Toast Notification Triggers */}
          <div style={{
            backgroundColor: '#1E191C',
            padding: '16px',
            borderRadius: '16px',
            border: '1px solid rgba(201, 163, 41, 0.2)',
          }}>
            <h4 style={{ fontSize: '14px', color: '#FCEBA4', margin: '0 0 10px', fontWeight: 700 }}>
              2. TOAST SYSTEM
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Button size="sm" variant="secondary" onClick={() => showToast('Order #LW-9421 Confirmed!', 'success')}>
                Success Toast
              </Button>
              <Button size="sm" variant="secondary" onClick={() => showToast('Awaiting payment verification', 'warning')}>
                Warning Toast
              </Button>
              <Button size="sm" variant="secondary" onClick={() => showToast('Item out of stock', 'error')}>
                Error Toast
              </Button>
            </div>
          </div>

          {/* Section: Inputs */}
          <div>
            <h4 style={{ fontSize: '14px', color: '#C9A329', margin: '0 0 12px', fontWeight: 700 }}>
              3. TEXT INPUTS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <Input
                label="Product Search"
                leftIcon={<IconSearch size={18} />}
                allowClear
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onClear={() => setInputText('')}
                placeholder="Search single malts, vodka, beer..."
              />
              <Input
                label="UPI Payee Reference"
                error="Invalid UTR number format"
                defaultValue="1234"
              />
            </div>
          </div>

          {/* Section: Chips & Status Badges */}
          <div>
            <h4 style={{ fontSize: '14px', color: '#C9A329', margin: '0 0 12px', fontWeight: 700 }}>
              4. CHIPS &amp; STATUS BADGES
            </h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
              {['All', 'Single Malt', 'Craft Beer', 'Gin & Tonic'].map((chip) => (
                <Chip
                  key={chip}
                  label={chip}
                  count={chip === 'All' ? 30 : 8}
                  isActive={selectedChip === chip}
                  onClick={() => setSelectedChip(chip)}
                />
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <Badge status="placed" />
              <Badge status="confirmed" />
              <Badge status="packed" />
              <Badge status="out_for_delivery" />
              <Badge status="delivered" />
              <Badge status="cancelled" />
              <Badge paymentStatus="awaiting_verification" />
              <Badge paymentStatus="paid" />
            </div>
          </div>

          {/* Section: Stepper & Product Card */}
          <div>
            <h4 style={{ fontSize: '14px', color: '#C9A329', margin: '0 0 12px', fontWeight: 700 }}>
              5. QUANTITY STEPPER &amp; PRODUCT CARD
            </h4>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
              <span style={{ fontSize: '13px', color: '#B5A697' }}>Standalone Stepper:</span>
              <QuantityStepper quantity={stepperQty} onChange={setStepperQty} />
            </div>

            <div style={{ maxWidth: '240px' }}>
              <ProductCard
                product={demoProduct}
                quantity={cardQty}
                onQuantityChange={setCardQty}
                onClick={() => showToast('Opening product detail view', 'info')}
              />
            </div>
          </div>

          {/* Section: Bottom Sheet Modal */}
          <div>
            <h4 style={{ fontSize: '14px', color: '#C9A329', margin: '0 0 12px', fontWeight: 700 }}>
              6. DRAGGABLE BOTTOM SHEET
            </h4>
            <Button variant="gold" fullWidth onClick={() => setSheetOpen(true)}>
              Open Interactive Bottom Sheet
            </Button>
          </div>

          {/* Section: Skeleton Loaders */}
          <div>
            <h4 style={{ fontSize: '14px', color: '#C9A329', margin: '0 0 12px', fontWeight: 700 }}>
              7. SHIMMER SKELETON LOADERS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <BannerSkeleton />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <CardSkeleton />
                <CardSkeleton />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: ICONS */}
      {activeTabSection === 'icons' && (
        <div>
          <p style={{ fontSize: '12px', color: '#B5A697', margin: '0 0 16px' }}>
            Complete 40+ custom SVG icon set built with 2px stroke, rounded terminals, and zero third-party iconography:
          </p>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '12px',
          }}>
            {iconsList.map((item) => (
              <div
                key={item.name}
                onClick={() => showToast(`Icon: ${item.name}`, 'info')}
                style={{
                  backgroundColor: '#1E191C',
                  borderRadius: '12px',
                  padding: '14px 8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '8px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  cursor: 'pointer',
                }}
              >
                <div style={{ color: '#FCEBA4' }}>{item.icon}</div>
                <span style={{ fontSize: '10px', color: '#B5A697', textAlign: 'center' }}>
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: ILLUSTRATIONS */}
      {activeTabSection === 'illustrations' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div>
            <h4 style={{ fontSize: '14px', color: '#C9A329', margin: '0 0 12px', fontWeight: 700 }}>
              CATEGORY ILLUSTRATIONS
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div style={{ textAlign: 'center' }}><IllustrateWhiskey size={68} /><p style={{ fontSize: '11px', color: '#B5A697', margin: '6px 0 0' }}>Whiskey</p></div>
              <div style={{ textAlign: 'center' }}><IllustrateBeer size={68} /><p style={{ fontSize: '11px', color: '#B5A697', margin: '6px 0 0' }}>Beer</p></div>
              <div style={{ textAlign: 'center' }}><IllustrateWine size={68} /><p style={{ fontSize: '11px', color: '#B5A697', margin: '6px 0 0' }}>Wine</p></div>
              <div style={{ textAlign: 'center' }}><IllustrateVodka size={68} /><p style={{ fontSize: '11px', color: '#B5A697', margin: '6px 0 0' }}>Vodka</p></div>
              <div style={{ textAlign: 'center' }}><IllustrateRum size={68} /><p style={{ fontSize: '11px', color: '#B5A697', margin: '6px 0 0' }}>Rum</p></div>
              <div style={{ textAlign: 'center' }}><IllustrateGin size={68} /><p style={{ fontSize: '11px', color: '#B5A697', margin: '6px 0 0' }}>Gin</p></div>
              <div style={{ textAlign: 'center' }}><IllustrateTequila size={68} /><p style={{ fontSize: '11px', color: '#B5A697', margin: '6px 0 0' }}>Tequila</p></div>
              <div style={{ textAlign: 'center' }}><IllustrateMixers size={68} /><p style={{ fontSize: '11px', color: '#B5A697', margin: '6px 0 0' }}>Mixers</p></div>
              <div style={{ textAlign: 'center' }}><IllustrateSnacks size={68} /><p style={{ fontSize: '11px', color: '#B5A697', margin: '6px 0 0' }}>Snacks</p></div>
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', color: '#C9A329', margin: '0 0 12px', fontWeight: 700 }}>
              EMPTY-STATE ILLUSTRATIONS
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ backgroundColor: '#1E191C', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <EmptyState
                  type="cart"
                  title="Your bar cart is empty"
                  subtitle="Explore chilled beers, aged single malts, and fine wines."
                  actionText="Start Shopping"
                  onAction={() => showToast('Opening catalog', 'info')}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab: PALETTE */}
      {activeTabSection === 'palette' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <h4 style={{ fontSize: '14px', color: '#FCEBA4', margin: '0 0 10px', fontWeight: 700 }}>
              PRIMARY WINE PALETTE
            </h4>
            <div style={{ display: 'flex', height: '40px', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.wine[900] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.wine[800] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.wine[600] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.wine[500] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.wine[400] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.wine[200] }} />
            </div>
          </div>

          <div>
            <h4 style={{ fontSize: '14px', color: '#FCEBA4', margin: '0 0 10px', fontWeight: 700 }}>
              WARM GOLD ACCENT
            </h4>
            <div style={{ display: 'flex', height: '40px', borderRadius: '10px', overflow: 'hidden' }}>
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.gold[900] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.gold[700] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.gold[500] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.gold[400] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.gold[300] }} />
              <div style={{ flex: 1, backgroundColor: THEME_TOKENS.colors.gold[100] }} />
            </div>
          </div>
        </div>
      )}

      {/* Interactive Bottom Sheet */}
      <BottomSheet
        isOpen={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Delivery Address Selection"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <p style={{ fontSize: '13px', color: '#B5A697', lineHeight: 1.5, margin: 0 }}>
            Spring-loaded physics with blur backdrop. Safe insets and Android hardware back button are supported natively.
          </p>
          <Input label="Street Address" placeholder="Apartment / Flat, Street name" />
          <Button
            variant="primary"
            fullWidth
            onClick={() => {
              setSheetOpen(false);
              showToast('Address saved successfully', 'success');
            }}
          >
            Confirm Address
          </Button>
        </div>
      </BottomSheet>
    </div>
  );
};
