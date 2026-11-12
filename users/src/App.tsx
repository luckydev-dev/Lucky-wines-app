import React, { useState, useEffect, useRef, useMemo } from 'react';
import { App as CapApp } from '@capacitor/app';
import {
  ToastProvider,
  useToast,
  TabBar,
  NavTabId,
  ProductCard,
  BottomSheet,
  Product,
  Category,
  Order,
  Banner,
  StoreSettings,
  fetchProductsList,
  subscribeToProducts,
  subscribeToStoreSettings,
  subscribeToBanners,
  subscribeToCategories,
  createOrderInRTDB,
  subscribeToSingleOrder,
  subscribeToMyOrders,
  ensureCustomerAuth,
  cancelMyOrder,
  customerGoogleSignIn,
  saveCustomerProfile,
  fetchCustomerProfile,
  subscribeToCustomerAddresses,
  saveCustomerAddress,
  deleteCustomerAddress,
  SavedAddress,
  CustomerProfile,
  IconMapPin,
  IconSearch,
  IconBell,
  IconClock,
  IconShield,
  IconUPI,
  IconCash,
  IconCopy,
  IconCheck,
  IconClose,
  IconChevronRight,
  IconChevronLeft,
  IconBottle,
  IconPhone,
  IconTruck,
  IconStar,
  IconHeart,
  IconUser,
  IconReceipt,
  AnimatedBottle,
  AnimatedTruck,
  AnimatedShield,
  AnimatedSparkle,
  getCategoryEmoji,
} from '@lucky/shared';
import { UpiPaymentSheet } from './UpiPaymentSheet';
import { LaunchGate, OfflineBanner } from './Launch';

const SEED_DRINKS: Product[] = [
  {
    id: 'prod_1',
    name: 'Glenfiddich 12Y Single Malt',
    brand: 'Glenfiddich',
    categoryId: 'cat_whiskey',
    sizeMl: 750,
    abv: 40.0,
    price: 5400,
    mrp: 5900,
    stock: 14,
    description: 'Distinctive fresh pear and subtle oak flavours matured in American and European oak casks.',
    images: ['https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&auto=format&fit=crop&q=80'],
    tags: ['Single Malt', 'Scotch', 'Popular'],
    visible: true,
    featured: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'prod_2',
    name: 'Corona Extra Mexican Lager (6-Pack)',
    brand: 'Corona',
    categoryId: 'cat_beer',
    sizeMl: 330,
    abv: 4.5,
    price: 1250,
    mrp: 1380,
    stock: 48,
    description: 'Crisp and refreshing imported Mexican lager, best served ice-cold with fresh lime.',
    images: ['https://images.unsplash.com/photo-1608270546103-97992762b1b3?w=600&auto=format&fit=crop&q=80'],
    tags: ['Lager', 'Beer', 'Chilled'],
    visible: true,
    featured: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'prod_3',
    name: 'Jacob\'s Creek Shiraz Cabernet',
    brand: 'Jacob\'s Creek',
    categoryId: 'cat_wine',
    sizeMl: 750,
    abv: 13.5,
    price: 1450,
    mrp: 1600,
    stock: 18,
    description: 'Rich plum and berry fruit flavours with silky tannins and a hint of warm vanilla oak.',
    images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=600&auto=format&fit=crop&q=80'],
    tags: ['Red Wine', 'Wine'],
    visible: true,
    featured: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'prod_4',
    name: 'Absolut Blue Pure Vodka',
    brand: 'Absolut',
    categoryId: 'cat_vodka',
    sizeMl: 750,
    abv: 40.0,
    price: 1950,
    mrp: 2200,
    stock: 35,
    description: 'Distilled from winter wheat with a distinct character of grain, smooth and mellow.',
    images: ['https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80'],
    tags: ['Vodka', 'Smooth'],
    visible: true,
    featured: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'prod_5',
    name: 'Bombay Sapphire Distilled Dry Gin',
    brand: 'Bombay Sapphire',
    categoryId: 'cat_gin',
    sizeMl: 750,
    abv: 40.0,
    price: 2600,
    mrp: 2900,
    stock: 20,
    description: 'Vapour-infused with 10 exotic hand-selected botanicals for a bright, fresh taste.',
    images: ['https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?w=600&auto=format&fit=crop&q=80'],
    tags: ['Gin', 'Botanical'],
    visible: true,
    featured: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'prod_6',
    name: 'Bira 91 White Craft Beer (Can)',
    brand: 'Bira 91',
    categoryId: 'cat_beer',
    sizeMl: 500,
    abv: 4.9,
    price: 190,
    mrp: 210,
    stock: 65,
    description: 'Wheat beer with low bitterness, aromatic citrus notes and a refreshing crisp finish.',
    images: ['https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=600&auto=format&fit=crop&q=80'],
    tags: ['Craft Beer', 'Wheat'],
    visible: true,
    featured: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'prod_7',
    name: 'Johnnie Walker Black Label 12Y',
    brand: 'Johnnie Walker',
    categoryId: 'cat_whiskey',
    sizeMl: 750,
    abv: 42.8,
    price: 3200,
    mrp: 3600,
    stock: 25,
    description: 'Rich, complex and incredibly well-balanced, full of dark fruits, sweet vanilla and signature smokiness.',
    images: ['https://images.unsplash.com/photo-1569529465841-dfecdab7503b?w=600&auto=format&fit=crop&q=80'],
    tags: ['Blended Scotch', 'Popular'],
    visible: true,
    featured: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
  {
    id: 'prod_8',
    name: 'Bacardi Carta Blanca Superior White Rum',
    brand: 'Bacardi',
    categoryId: 'cat_rum',
    sizeMl: 750,
    abv: 42.8,
    price: 1400,
    mrp: 1600,
    stock: 22,
    description: 'Classic light white rum aged in white oak barrels, ideal for Mojitos and Daiquiris.',
    images: ['https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80'],
    tags: ['White Rum', 'Cocktail'],
    visible: true,
    featured: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

const DEFAULT_CATEGORY_ITEMS = [
  { id: 'cat_whiskey', name: 'Spirits', code: 'WH', color: '#4AB7B6' },
  { id: 'cat_beer', name: 'Beers', code: 'BR', color: '#4B90E2' },
  { id: 'cat_wine', name: 'Wines', code: 'WN', color: '#E056A0' },
  { id: 'cat_vodka', name: 'Vodka', code: 'VK', color: '#9B51E0' },
  { id: 'cat_rum', name: 'Rum', code: 'RM', color: '#E67E22' },
  { id: 'cat_gin', name: 'Gin', code: 'GN', color: '#27AE60' },
  { id: 'cat_mixers', name: 'Mixers', code: 'MX', color: '#FDAA5D' },
];

const CATEGORY_COLORS = ['#4AB7B6', '#4B90E2', '#E056A0', '#9B51E0', '#E67E22', '#27AE60', '#FDAA5D', '#EF4444'];

type SortOption = 'popular' | 'price_asc' | 'price_desc' | 'abv';

function HyperMartStorefront() {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState<NavTabId>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  // Categories come live from the admin app; the built-in list is the fallback
  const [categoryItems, setCategoryItems] = useState(DEFAULT_CATEGORY_ITEMS);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [products, setProducts] = useState<Product[]>(SEED_DRINKS);
  const [myOrders, setMyOrders] = useState<Order[]>([]);
  
  // Store Settings (Live from RTDB, editable by Admin)
  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    shopName: 'Lucky Wine & Liquor',
    isOpen: true,
    deliveryFee: 49,
    freeDeliveryAbove: 999,
    minOrder: 299,
    upiId: 'luckywine@upi',
    upiPayeeName: 'Lucky Wine Store',
    phone: '+91 98765 43210',
    pincodes: ['560001', '560002', '560025', '560034', '560038'],
    cutoffTime: '22:30',
    minAgeNotice: 'You must be 21+ years of age to purchase alcoholic beverages.',
  });

  // Promo Banners (Live from RTDB, editable by Admin)
  const [banners, setBanners] = useState<Banner[]>([
    {
      id: 'b1',
      title: 'Happy Weekend',
      subtitle: '25% OFF',
      image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=800',
      target: 'all',
      order: 1,
      active: true,
    },
  ]);
  const [activeBannerIdx, setActiveBannerIdx] = useState(0);

  // Cart State
  const [cart, setCart] = useState<Record<string, number>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Selected Drink for Detail Modal
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Dedicated Fullscreen Checkout View (Removed delivery option as requested)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cod'>('upi');
  const [paymentOrder, setPaymentOrder] = useState<Order | null>(null);
  const [ageConsent, setAgeConsent] = useState(false);
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);

  // Active Tracked Order
  const [activeTrackingOrderId, setActiveTrackingOrderId] = useState<string | null>(null);
  const [trackedOrder, setTrackedOrder] = useState<Order | null>(null);

  // Customer Profile & Address Book (Step 3 / Google Auth + Step 2)
  const [customerUid, setCustomerUid] = useState<string | null>(null);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useCustomAddress, setUseCustomAddress] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [loginStep, setLoginStep] = useState<1 | 2>(1);
  const [step2Phone, setStep2Phone] = useState('');
  const [step2Password, setStep2Password] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isAddAddressOpen, setIsAddAddressOpen] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [newAddrLine1, setNewAddrLine1] = useState('');
  const [newAddrLine2, setNewAddrLine2] = useState('');
  const [newAddrLandmark, setNewAddrLandmark] = useState('');
  const [newAddrPincode, setNewAddrPincode] = useState('560038');
  const [newAddrDefault, setNewAddrDefault] = useState(true);

  // Android back button: close the topmost screen first, go Home next, and only then leave the app.
  const backHandlerRef = useRef<() => boolean>(() => false);
  backHandlerRef.current = () => {
    if (isAddAddressOpen) {
      setIsAddAddressOpen(false);
      return true;
    }
    if (isLoginModalOpen) {
      setIsLoginModalOpen(false);
      return true;
    }
    if (paymentOrder) {
      setActiveTrackingOrderId(paymentOrder.id);
      setPaymentOrder(null);
      return true;
    }
    if (activeTrackingOrderId) {
      setActiveTrackingOrderId(null);
      return true;
    }
    if (isCheckoutOpen) {
      setIsCheckoutOpen(false);
      return true;
    }
    if (selectedProduct) {
      setSelectedProduct(null);
      return true;
    }
    if (isCartOpen) {
      setIsCartOpen(false);
      return true;
    }
    if (activeTab !== 'home') {
      setActiveTab('home');
      return true;
    }
    return false;
  };
  useEffect(() => {
    let handle: { remove: () => Promise<void> } | undefined;
    let disposed = false;
    CapApp.addListener('backButton', () => {
      if (!backHandlerRef.current()) {
        CapApp.exitApp().catch(() => {});
      }
    })
      .then((h) => {
        if (disposed) h.remove();
        else handle = h;
      })
      .catch(() => {});
    return () => {
      disposed = true;
      handle?.remove().catch(() => {});
    };
  }, []);

  // Live Realtime Database Subscriptions (Instantly syncs edits from Admin)
  useEffect(() => {
    const unsubProds = subscribeToProducts((liveProds) => {
      if (liveProds && liveProds.length > 0) {
        setProducts(liveProds);
      }
    });

    const unsubSettings = subscribeToStoreSettings((liveSettings) => {
      if (liveSettings) {
        setStoreSettings(liveSettings);
      }
    });

    const unsubCategories = subscribeToCategories((cats) => {
      const visible = cats.filter((c) => c.visible !== false);
      if (visible.length === 0) return;
      setCategoryItems(
        visible.map((c, i) => ({
          id: c.id,
          name: c.name,
          code: c.name.slice(0, 2).toUpperCase(),
          color: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
        }))
      );
    });

    const unsubBanners = subscribeToBanners((liveBanners) => {
      if (liveBanners && liveBanners.length > 0) {
        setBanners(liveBanners);
      }
    });

    return () => {
      unsubProds();
      unsubSettings();
      unsubBanners();
      unsubCategories();
    };
  }, []);

  // This customer's auth, profile, and orders
  useEffect(() => {
    let cancelled = false;
    let unsubOrders: () => void = () => {};
    ensureCustomerAuth()
      .then(async (uid) => {
        if (cancelled) return;
        setCustomerUid(uid);
        unsubOrders = subscribeToMyOrders(uid, setMyOrders);
        try {
          const profile = await fetchCustomerProfile(uid);
          if (profile && !cancelled) {
            setCustomerProfile(profile);
            if (profile.name) setCustomerName(profile.name);
            if (profile.phone) setContactPhone(profile.phone);
          }
        } catch (e) {
          console.warn('Profile fetch warning:', e);
        }
      })
      .catch((err) => console.warn('Customer sign-in failed:', err));
    return () => {
      cancelled = true;
      unsubOrders();
    };
  }, []);

  // Subscribe to live saved addresses
  useEffect(() => {
    if (!customerUid) return;
    const unsub = subscribeToCustomerAddresses(customerUid, (addrs) => {
      setSavedAddresses(addrs);
      if (addrs.length > 0) {
        const def = addrs.find((a) => a.isDefault) || addrs[0];
        setSelectedAddressId((prev) => prev || def.id);
        if (!deliveryAddress) {
          setDeliveryAddress(`${def.line1}${def.line2 ? `, ${def.line2}` : ''}${def.landmark ? ` (Near ${def.landmark})` : ''}`);
          setPincode(def.pincode);
        }
      }
    });
    return () => unsub();
  }, [customerUid]);

  // Single order tracking subscriber
  useEffect(() => {
    if (!activeTrackingOrderId) return;
    const unsub = subscribeToSingleOrder(activeTrackingOrderId, (liveOrder) => {
      if (liveOrder) {
        setTrackedOrder(liveOrder);
      }
    });
    return () => unsub();
  }, [activeTrackingOrderId]);

  // Filter banners: must be active and within start/end dates
  const todayStr = new Date().toISOString().slice(0, 10);
  const activeBanners = useMemo(() => {
    return banners.filter((b) => {
      if (!b.active) return false;
      if (b.startDate && b.startDate > todayStr) return false;
      if (b.endDate && b.endDate < todayStr) return false;
      return true;
    }).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [banners, todayStr]);

  // Auto-scroll banners carousel every 4.5 seconds
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBannerIdx((prev) => (prev + 1) % activeBanners.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const cartCount = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const cartSubtotal = Object.entries(cart).reduce((sum, [id, q]) => {
    const p = products.find((x) => x.id === id);
    return sum + (p ? p.price * q : 0);
  }, 0);
  const rawDeliveryFee = Number(storeSettings?.deliveryFee) >= 0 ? Number(storeSettings.deliveryFee) : 49;
  const rawFreeAbove = Number(storeSettings?.freeDeliveryAbove) > 0 ? Number(storeSettings.freeDeliveryAbove) : 999;
  const deliveryFee = (cartSubtotal >= rawFreeAbove || cartSubtotal === 0) ? 0 : rawDeliveryFee;
  const cartGrandTotal = Math.max(0, (Number(cartSubtotal) || 0) + (Number(deliveryFee) || 0));

  // Google Login & Step 2 Profile Handlers
  const handleGoogleSignIn = async () => {
    setAuthLoading(true);
    setAuthError('');
    try {
      const user = await customerGoogleSignIn();
      setCustomerUid(user.uid);
      const profile = await fetchCustomerProfile(user.uid);
      if (profile && (profile.phone || profile.passwordSet)) {
        setCustomerProfile(profile);
        if (profile.name) setCustomerName(profile.name);
        if (profile.phone) setContactPhone(profile.phone);
        setIsLoginModalOpen(false);
        showToast(`Welcome back, ${profile.name}!`, 'success');
      } else {
        // Step 2: Prompt for Phone & Password (NO OTP)
        setCustomerProfile(profile || { name: user.name, email: user.email, createdAt: Date.now() });
        setCustomerName(user.name);
        setLoginStep(2);
      }
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      setAuthError(err?.message || 'Google sign-in could not be completed. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleStep2Save = async () => {
    if (!customerUid) return;
    const cleanPhone = step2Phone.trim().replace(/[^0-9]/g, '');
    if (cleanPhone.length < 10) {
      setAuthError('Please enter a valid 10-digit mobile number.');
      return;
    }
    if (step2Password.length < 6) {
      setAuthError('Please set a password with at least 6 characters.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await saveCustomerProfile(customerUid, {
        phone: cleanPhone,
        password: step2Password,
        passwordSet: true,
        name: customerProfile?.name || customerName || 'Customer',
        email: customerProfile?.email || '',
      });
      setContactPhone(cleanPhone);
      setCustomerProfile((prev) => ({
        name: prev?.name || customerName || 'Customer',
        email: prev?.email || '',
        phone: cleanPhone,
        password: step2Password,
        passwordSet: true,
        createdAt: prev?.createdAt || Date.now(),
      }));
      setIsLoginModalOpen(false);
      showToast('Account setup complete! 1-tap checkout enabled.', 'success');
    } catch (err: any) {
      setAuthError('Failed to save profile. Please try again.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Address Book Handlers
  const handleSaveNewAddress = async () => {
    if (!customerUid) return;
    if (!newAddrLine1.trim()) {
      showToast('Please enter Flat / House details', 'warning');
      return;
    }
    if (!/^[0-9]{6}$/.test(newAddrPincode.trim())) {
      showToast('Please enter a valid 6-digit pincode', 'warning');
      return;
    }
    const newAddr: SavedAddress = {
      id: `addr_${Date.now()}`,
      label: newAddrLabel,
      line1: newAddrLine1.trim(),
      line2: newAddrLine2.trim() || undefined,
      landmark: newAddrLandmark.trim() || undefined,
      pincode: newAddrPincode.trim(),
      isDefault: newAddrDefault || savedAddresses.length === 0,
    };
    try {
      await saveCustomerAddress(customerUid, newAddr);
      if (newAddr.isDefault) {
        for (const existing of savedAddresses) {
          if (existing.isDefault) {
            await saveCustomerAddress(customerUid, { ...existing, isDefault: false });
          }
        }
      }
      setSelectedAddressId(newAddr.id);
      setDeliveryAddress(`${newAddr.line1}${newAddr.line2 ? `, ${newAddr.line2}` : ''}${newAddr.landmark ? ` (Near ${newAddr.landmark})` : ''}`);
      setPincode(newAddr.pincode);
      setUseCustomAddress(false);
      setIsAddAddressOpen(false);
      setNewAddrLine1('');
      setNewAddrLine2('');
      setNewAddrLandmark('');
      showToast('Address saved successfully!', 'success');
    } catch (err) {
      showToast('Failed to save address', 'error');
    }
  };

  const handleDeleteAddress = async (addrId: string) => {
    if (!customerUid) return;
    try {
      await deleteCustomerAddress(customerUid, addrId);
      if (selectedAddressId === addrId) {
        setSelectedAddressId(null);
      }
      showToast('Address removed', 'info');
    } catch (err) {
      showToast('Failed to delete address', 'error');
    }
  };

  const handleSetDefaultAddress = async (addr: SavedAddress) => {
    if (!customerUid) return;
    try {
      for (const a of savedAddresses) {
        await saveCustomerAddress(customerUid, { ...a, isDefault: a.id === addr.id });
      }
      setSelectedAddressId(addr.id);
      setDeliveryAddress(`${addr.line1}${addr.line2 ? `, ${addr.line2}` : ''}${addr.landmark ? ` (Near ${addr.landmark})` : ''}`);
      setPincode(addr.pincode);
      showToast(`Set "${addr.label}" as default address`, 'success');
    } catch (err) {
      showToast('Failed to update default address', 'error');
    }
  };

  const handleQtyChange = (productId: string, qty: number) => {
    setCart((prev) => {
      const copy = { ...prev };
      if (qty <= 0) {
        delete copy[productId];
        showToast('Item removed from cart', 'info');
      } else {
        copy[productId] = qty;
        showToast('Cart updated', 'success');
      }
      return copy;
    });
  };

  const filteredProducts = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.categoryId === selectedCategory;
    const query = searchQuery.trim().toLowerCase();
    const matchSearch =
      query === '' ||
      p.name.toLowerCase().includes(query) ||
      p.brand.toLowerCase().includes(query) ||
      (p.tags && p.tags.some((t) => t.toLowerCase().includes(query))) ||
      p.description.toLowerCase().includes(query);
    return matchCat && matchSearch;
  }).sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'abv') return (b.abv || 0) - (a.abv || 0);
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  });

  const handlePlaceOrder = async () => {
    if (isSubmittingOrder) return;
    if (!storeSettings.isOpen) {
      showToast('Store is currently paused. Please try again later.', 'warning');
      return;
    }
    if (!ageConsent) {
      showToast('Please confirm age verification (21+)', 'warning');
      return;
    }
    if (cartCount === 0) {
      showToast('Your cart is empty', 'warning');
      return;
    }
    if (cartSubtotal < storeSettings.minOrder) {
      showToast(`Minimum order is ₹${storeSettings.minOrder}`, 'warning');
      return;
    }
    const name = customerName.trim();
    const address = deliveryAddress.trim();
    const pin = pincode.trim();
    const phone = contactPhone.trim();
    if (!name) {
      showToast('Please enter your name', 'warning');
      return;
    }
    if (!address) {
      showToast('Please enter your delivery address', 'warning');
      return;
    }
    if (!/^[0-9]{6}$/.test(pin)) {
      showToast('Please enter a valid 6-digit pincode', 'warning');
      return;
    }
    if (storeSettings.pincodes && storeSettings.pincodes.length > 0 && !storeSettings.pincodes.includes(pin)) {
      showToast('Sorry, we do not deliver to this pincode yet', 'warning');
      return;
    }
    if (phone.replace(/[^0-9]/g, '').length < 10) {
      showToast('Please enter a valid phone number', 'warning');
      return;
    }

    const orderItems = Object.entries(cart).flatMap(([pId, qty]) => {
      const item = products.find((x) => x.id === pId);
      return item
        ? [{
            productId: pId,
            name: item.name,
            brand: item.brand,
            price: item.price,
            mrp: item.mrp,
            sizeMl: item.sizeMl,
            image: item.images?.[0] ?? '',
            quantity: qty,
          }]
        : [];
    });
    if (orderItems.length !== Object.keys(cart).length) {
      showToast('Some items in your cart are no longer available. Please review your cart.', 'warning');
      return;
    }

    setIsSubmittingOrder(true);
    // Collision-resistant id (time + random) so two customers can never overwrite each other's order
    const orderId = `LW-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 1296).toString(36).toUpperCase().padStart(2, '0')}`;
    const newOrder: Order = {
      id: orderId,
      userId: '', // replaced with the signed-in customer's uid when the order is saved
      userName: name,
      userPhone: phone,
      address: {
        id: 'addr_1',
        label: 'Home',
        line1: address,
        pincode: pin,
      },
      items: orderItems,
      subtotal: cartSubtotal,
      deliveryFee: deliveryFee,
      total: cartGrandTotal,
      paymentMethod: paymentMethod,
      paymentStatus: paymentMethod === 'upi' ? 'awaiting_verification' : 'pending',
      status: 'placed',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      await createOrderInRTDB(newOrder);
      setCart({});
      setIsCheckoutOpen(false);
      setIsCartOpen(false);
      setTrackedOrder({ ...newOrder, userId: newOrder.userId });
      if (paymentMethod === 'upi') {
        // Order is already saved (awaiting verification) - now let the customer pay
        setPaymentOrder({ ...newOrder });
        showToast(`Order #${orderId} saved. Complete your UPI payment.`, 'success');
      } else {
        setActiveTrackingOrderId(orderId);
        showToast(`Order #${orderId} placed successfully!`, 'success');
      }
    } catch (err) {
      // Never tell the customer the order is placed when it was not saved.
      console.error('Order placement failed:', err);
      showToast('Could not place your order. Check your connection and try again.', 'error');
    } finally {
      setIsSubmittingOrder(false);
    }
  };

  // Dedicated Fullscreen Checkout Page (Compact Top Padding, Delivery option removed)
  if (isCheckoutOpen) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#F4F9F9',
        color: '#1E293B',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* Compact Top Header (10px padding) */}
        <header
          className="app-header-safe"
          style={{
            backgroundColor: '#FFFFFF',
            paddingTop: 'max(env(safe-area-inset-top, 8px), 10px)',
            paddingBottom: '12px',
            paddingLeft: '20px',
            paddingRight: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #E8F2F2',
            position: 'sticky',
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsCheckoutOpen(false)}
              aria-label="Back"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#F4F9F9',
                border: '1px solid #E2ECEC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1E293B',
                cursor: 'pointer',
              }}
            >
              <IconChevronLeft size={18} color="#1E293B" />
            </button>
            <div>
              <h2 style={{
                fontSize: '17px',
                fontWeight: 800,
                color: '#1E293B',
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}>
                Checkout
              </h2>
              <span style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>
                {storeSettings.shopName}
              </span>
            </div>
          </div>

          <div style={{
            backgroundColor: '#E8F5F5',
            color: '#2C7372',
            padding: '4px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 700,
          }}>
            Step 2 of 2
          </div>
        </header>

        {/* Content Container */}
        <main style={{
          padding: '14px 20px 120px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}>
          {/* 1. Customer & Address Information with Saved Address Selector */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px',
            border: '1px solid #E8F2F2',
            boxShadow: '0 4px 14px rgba(74, 183, 182, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '10px',
                  backgroundColor: '#E8F5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#4AB7B6',
                }}>
                  <IconMapPin size={16} color="#4AB7B6" />
                </div>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                  Delivery Address
                </span>
              </div>
              <span style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#4AB7B6',
                backgroundColor: '#F0FBFB',
                padding: '2px 8px',
                borderRadius: '6px',
              }}>
                Bengaluru
              </span>
            </div>

            {/* If Customer has saved addresses, show fast selector */}
            {savedAddresses.length > 0 && !useCustomAddress ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>
                  Select Saved Address:
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {savedAddresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setDeliveryAddress(`${addr.line1}${addr.line2 ? `, ${addr.line2}` : ''}${addr.landmark ? ` (Near ${addr.landmark})` : ''}`);
                          setPincode(addr.pincode);
                        }}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          border: isSelected ? '2px solid #4AB7B6' : '1px solid #E2ECEC',
                          backgroundColor: isSelected ? '#F0FBFB' : '#FFFFFF',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          transition: 'all 150ms ease',
                        }}
                      >
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{
                              fontSize: '11px',
                              fontWeight: 800,
                              textTransform: 'uppercase',
                              backgroundColor: '#E8F5F5',
                              color: '#4AB7B6',
                              padding: '2px 6px',
                              borderRadius: '4px',
                            }}>
                              {addr.label}
                            </span>
                            {addr.isDefault && (
                              <span style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                color: '#10B981',
                                backgroundColor: '#ECFDF5',
                                padding: '2px 6px',
                                borderRadius: '4px',
                              }}>
                                Default
                              </span>
                            )}
                          </div>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                            {addr.line1}
                          </div>
                          <div style={{ fontSize: '11px', color: '#64748B' }}>
                            {addr.line2 ? `${addr.line2}, ` : ''}{addr.landmark ? `Near ${addr.landmark}, ` : ''}PIN: {addr.pincode}
                          </div>
                        </div>
                        <div style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          border: isSelected ? '5px solid #4AB7B6' : '2px solid #CBD5E1',
                          backgroundColor: '#FFFFFF',
                          marginTop: '2px',
                        }} />
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setIsAddAddressOpen(true)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px dashed #4AB7B6',
                      backgroundColor: 'transparent',
                      color: '#4AB7B6',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    + Add New Address
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUseCustomAddress(true);
                      setSelectedAddressId(null);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      backgroundColor: '#F8FAFC',
                      color: '#64748B',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Different Address
                  </button>
                </div>
              </div>
            ) : (
              <>
                {savedAddresses.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setUseCustomAddress(false)}
                    style={{
                      padding: '6px 10px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: '#E8F5F5',
                      color: '#4AB7B6',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      alignSelf: 'flex-start',
                    }}
                  >
                    ← Pick from saved addresses
                  </button>
                )}

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    House / Street Address
                  </label>
                  <input
                    type="text"
                    autoComplete="street-address"
                    placeholder="Flat / house no., street, area"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      fontSize: '13px',
                      color: '#1E293B',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Pincode
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="6-digit pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value.replace(/[^0-9]/g, ''))}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        color: '#1E293B',
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      autoComplete="tel"
                      placeholder="10-digit mobile"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '10px',
                        border: '1px solid #CBD5E1',
                        fontSize: '13px',
                        color: '#1E293B',
                        backgroundColor: '#FFFFFF',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                    Your Name
                  </label>
                  <input
                    type="text"
                    autoComplete="name"
                    placeholder="Full name"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      border: '1px solid #CBD5E1',
                      backgroundColor: '#FFFFFF',
                      fontSize: '13px',
                      color: '#1E293B',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
              </>
            )}

            {/* Pincode Serviceability Info Badge */}
            {pincode.length === 6 && (
              <div style={{
                fontSize: '11px',
                padding: '8px 10px',
                borderRadius: '8px',
                backgroundColor: storeSettings.pincodes.includes(pincode) ? '#F0FDF4' : '#FEF3C7',
                color: storeSettings.pincodes.includes(pincode) ? '#166534' : '#92400E',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
              }}>
                {storeSettings.pincodes.includes(pincode) ? (
                  <><span>✓</span> Serviceable area. Express 30-45 min delivery available.</>
                ) : (
                  <><span>⚠️</span> We currently serve {storeSettings.pincodes.join(', ')}. Delivery to {pincode} may require telephone confirmation.</>
                )}
              </div>
            )}
          </div>

          {/* 2. Payment Method Card */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px',
            border: '1px solid #E8F2F2',
            boxShadow: '0 4px 14px rgba(74, 183, 182, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '10px',
                backgroundColor: '#E8F5F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4AB7B6',
              }}>
                <IconUPI size={16} color="#4AB7B6" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                Payment Method
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div
                onClick={() => setPaymentMethod('upi')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${paymentMethod === 'upi' ? '#FDAA5D' : '#E2E8F0'}`,
                  backgroundColor: paymentMethod === 'upi' ? '#FFF9F2' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <IconUPI size={20} color={paymentMethod === 'upi' ? '#FDAA5D' : '#64748B'} />
                  {paymentMethod === 'upi' && <span style={{ color: '#FDAA5D', fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Instant UPI</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>GPay / PhonePe / Paytm</div>
              </div>

              <div
                onClick={() => setPaymentMethod('cod')}
                style={{
                  padding: '12px',
                  borderRadius: '12px',
                  border: `2px solid ${paymentMethod === 'cod' ? '#FDAA5D' : '#E2E8F0'}`,
                  backgroundColor: paymentMethod === 'cod' ? '#FFF9F2' : '#FFFFFF',
                  cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <IconCash size={20} color={paymentMethod === 'cod' ? '#FDAA5D' : '#64748B'} />
                  {paymentMethod === 'cod' && <span style={{ color: '#FDAA5D', fontWeight: 800 }}>✓</span>}
                </div>
                <div style={{ fontSize: '13px', fontWeight: 800, color: '#1E293B' }}>Cash on Delivery</div>
                <div style={{ fontSize: '10px', color: '#64748B' }}>Pay upon receipt</div>
              </div>
            </div>

            {/* UPI info - the actual payment happens right after the order is saved */}
            {paymentMethod === 'upi' && (
              <div style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1.5px dashed #4AB7B6',
                padding: '12px',
                fontSize: '11px',
                color: '#475569',
                lineHeight: 1.5,
              }}>
                After you tap <strong>Place Order</strong> you can pay <strong>₹{cartGrandTotal.toLocaleString('en-IN')}</strong> with
                Google Pay, PhonePe, Paytm or any UPI app - or scan a QR code. The store confirms your payment before packing.
              </div>
            )}
          </div>

          {/* 3. Mandatory 21+ Age Declaration Card with Animated Shield */}
          <div style={{
            backgroundColor: '#F0FDF4',
            borderRadius: '16px',
            border: '1px solid #BBF7D0',
            padding: '14px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
          }}>
            <input
              type="checkbox"
              id="ageConsentCheck"
              checked={ageConsent}
              onChange={(e) => setAgeConsent(e.target.checked)}
              style={{
                width: '20px',
                height: '20px',
                marginTop: '2px',
                accentColor: '#10B981',
                cursor: 'pointer',
              }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AnimatedShield size={18} color="#10B981" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#166534' }}>
                  Age Verification Declaration (21+)
                </span>
              </div>
              <label htmlFor="ageConsentCheck" style={{ fontSize: '11px', color: '#166534', lineHeight: 1.4, cursor: 'pointer', display: 'block', marginTop: '2px' }}>
                I confirm that I am at least 21 years of age as per Karnataka Excise Regulations and agree to present government photo ID upon delivery.
              </label>
            </div>
          </div>

          {/* 4. Bill Details */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px',
            border: '1px solid #E8F2F2',
            boxShadow: '0 4px 14px rgba(74, 183, 182, 0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
              Bill Breakdown
            </span>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B' }}>
              <span>Items Total ({cartCount} bottles)</span>
              <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#64748B' }}>
              <span>Delivery Fee</span>
              <span style={{ color: deliveryFee === 0 ? '#10B981' : '#1E293B', fontWeight: 700 }}>
                {deliveryFee === 0 ? 'FREE' : `₹${(deliveryFee || 0).toLocaleString('en-IN')}`}
              </span>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '10px',
              marginTop: '4px',
            }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                Total Amount
              </span>
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#4AB7B6', fontFamily: "'Poppins', sans-serif" }}>
                ₹{(cartGrandTotal || 0).toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </main>

        {/* Fixed Bottom Action Bar */}
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #E8F2F2',
          padding: '12px 20px',
          paddingBottom: 'calc(12px + env(safe-area-inset-bottom, 12px))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 60,
          boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
        }}>
          <div>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>Total Payable</span>
            <div style={{ fontSize: '18px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
              ₹{(cartGrandTotal || 0).toLocaleString('en-IN')}
            </div>
          </div>

          <button
            disabled={isSubmittingOrder}
            onClick={handlePlaceOrder}
            style={{
              backgroundColor: '#FDAA5D',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: 800,
              fontFamily: "'Poppins', sans-serif",
              cursor: isSubmittingOrder ? 'not-allowed' : 'pointer',
              boxShadow: '0 4px 16px rgba(253, 170, 93, 0.45)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span>{isSubmittingOrder ? 'Placing...' : 'Place Order'}</span>
            <IconChevronRight size={18} color="#FFFFFF" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F4F9F9',
      color: '#1E293B',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '100px',
      boxSizing: 'border-box',
    }}>
      {/* 1. Top Header with Minimal Spacing (10px) */}
      <header
        className="app-header-safe"
        style={{
          backgroundColor: '#FFFFFF',
          paddingTop: 'max(env(safe-area-inset-top, 8px), 10px)',
          paddingBottom: '12px',
          paddingLeft: '20px',
          paddingRight: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #E8F2F2',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AnimatedBottle size={26} color="#4AB7B6" glow />
          <h1 style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#4AB7B6',
            margin: 0,
            fontFamily: "'Poppins', sans-serif",
            letterSpacing: '-0.4px',
          }}>
            Lucky<span style={{ color: '#FDAA5D' }}>Wine</span>
          </h1>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {activeTrackingOrderId && (
            <button
              onClick={() => {}}
              style={{
                backgroundColor: '#E8F5F5',
                color: '#2C7372',
                border: '1px solid #4AB7B6',
                borderRadius: '20px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#4AB7B6' }} />
              Live Order #{activeTrackingOrderId}
            </button>
          )}

          <div
            onClick={() => showToast('No new notifications', 'info')}
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#F4F9F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748B',
            }}
          >
            <IconBell size={18} color="#64748B" />
          </div>
        </div>
      </header>

      {/* 2. TAB 1: HOME STOREFRONT */}
      {activeTab === 'home' && (
        <>
          {/* Location Selector Card */}
          <section style={{ padding: '8px 20px 10px' }}>
            <div
              onClick={() => showToast('Delivery location set to BTM Layout', 'info')}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                border: '1px solid #E8F2F2',
                boxShadow: '0 2px 10px rgba(74, 183, 182, 0.05)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '12px',
                  backgroundColor: '#4AB7B6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  boxShadow: '0 4px 10px rgba(74, 183, 182, 0.35)',
                }}>
                  <IconMapPin size={18} color="#FFFFFF" />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>
                    Delivering to
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                    BTM Layout, 560038
                  </div>
                </div>
              </div>

              <IconChevronRight size={18} color="#94A3B8" />
            </div>
          </section>

          {/* Search Bar */}
          <section style={{ padding: '0 20px 12px' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '10px 16px',
              border: '1px solid #E2ECEC',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}>
              <span style={{ marginRight: '10px', display: 'flex', alignItems: 'center' }}>
                <IconSearch size={18} color="#94A3B8" />
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search single malts, craft beers, wines..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  fontSize: '14px',
                  color: '#1E293B',
                  backgroundColor: 'transparent',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              {searchQuery && (
                <span
                  onClick={() => setSearchQuery('')}
                  style={{ cursor: 'pointer', marginRight: '8px', display: 'flex', alignItems: 'center' }}
                >
                  <IconClose size={16} color="#94A3B8" />
                </span>
              )}
            </div>
          </section>

          {/* Hero Promo Banners Carousel (Live from RTDB, auto-scrolls in order with dots & target action) */}
          {selectedCategory === 'all' && !searchQuery && activeBanners.length > 0 && (() => {
            const currentBanner = activeBanners[activeBannerIdx % activeBanners.length] || activeBanners[0];
            return (
              <section style={{ padding: '0 20px 14px' }}>
                <div
                  onClick={() => {
                    if (currentBanner.target && currentBanner.target !== 'all') {
                      setSelectedCategory(currentBanner.target);
                    }
                  }}
                  style={{
                    backgroundColor: '#2A0B14',
                    borderRadius: '22px',
                    padding: '18px 20px',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(212, 175, 55, 0.35)',
                    boxShadow: '0 8px 24px rgba(61, 7, 23, 0.25)',
                    cursor: currentBanner.target && currentBanner.target !== 'all' ? 'pointer' : 'default',
                    minHeight: '110px',
                  }}
                >
                  <div style={{ zIndex: 2, maxWidth: '60%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '4px' }}>
                      <AnimatedSparkle size={14} color="#D4AF37" />
                      <span style={{ fontSize: '10px', fontWeight: 800, color: '#D4AF37', letterSpacing: '1.2px', textTransform: 'uppercase' }}>
                        {currentBanner.target === 'all' ? 'FEATURED OFFER' : 'SPECIAL DEAL'}
                      </span>
                    </div>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#FDFBF9',
                      fontFamily: "'Poppins', sans-serif",
                    }}>
                      {currentBanner.title || 'Curated Selection'}
                    </div>
                    <div style={{
                      fontSize: '24px',
                      fontWeight: 800,
                      color: '#E5C454',
                      fontFamily: "'Poppins', sans-serif",
                      lineHeight: 1.2,
                      margin: '2px 0',
                    }}>
                      {currentBanner.subtitle || 'Shop Now'}
                    </div>
                    {currentBanner.target && currentBanner.target !== 'all' && (
                      <div style={{ fontSize: '10px', color: '#D4AF37', fontWeight: 700, marginTop: '2px', display: 'flex', alignItems: 'center', gap: '3px' }}>
                        Tap to view collection →
                      </div>
                    )}
                  </div>

                  <div style={{
                    position: 'absolute',
                    right: '-10px',
                    top: 0,
                    bottom: 0,
                    width: '180px',
                    backgroundImage: `url(${currentBanner.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderTopRightRadius: '22px',
                    borderBottomRightRadius: '22px',
                    maskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 40%)',
                  }} />
                </div>

                {/* Carousel Pagination Dots */}
                {activeBanners.length > 1 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    marginTop: '8px',
                  }}>
                    {activeBanners.map((b: Banner, idx: number) => {
                      const isActive = idx === (activeBannerIdx % activeBanners.length);
                      return (
                        <button
                          key={b.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveBannerIdx(idx);
                          }}
                          style={{
                            width: isActive ? '20px' : '6px',
                            height: '6px',
                            borderRadius: '9999px',
                            backgroundColor: isActive ? '#720D2B' : '#EFE7E1',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            transition: 'all 250ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                          }}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })()}

          {/* Categories Squircles Carousel */}
          <section style={{ padding: '0 20px 14px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '10px',
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}>
                Categories
              </h3>
              <span
                onClick={() => setSelectedCategory('all')}
                style={{ fontSize: '12px', color: '#4AB7B6', fontWeight: 700, cursor: 'pointer' }}
              >
                View All
              </span>
            </div>

            <div style={{
              display: 'flex',
              gap: '14px',
              overflowX: 'auto',
              paddingBottom: '4px',
              scrollbarWidth: 'none',
            }}>
              <div
                onClick={() => setSelectedCategory('all')}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  minWidth: '64px',
                }}
              >
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '20px',
                  backgroundColor: selectedCategory === 'all' ? '#E8F5F5' : '#FFFFFF',
                  border: selectedCategory === 'all' ? '2px solid #4AB7B6' : '1px solid #E2ECEC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: selectedCategory === 'all' ? '0 6px 16px rgba(74, 183, 182, 0.25)' : '0 4px 10px rgba(0,0,0,0.04)',
                  transform: selectedCategory === 'all' ? 'scale(1.08)' : 'scale(1)',
                  transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                }}>
                  {getCategoryEmoji('all', selectedCategory === 'all')}
                </div>
                <span style={{
                  fontSize: '12px',
                  fontWeight: selectedCategory === 'all' ? 700 : 500,
                  color: selectedCategory === 'all' ? '#4AB7B6' : '#64748B',
                }}>
                  All
                </span>
              </div>

              {categoryItems.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      minWidth: '64px',
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '20px',
                      backgroundColor: isSelected ? '#FFFFFF' : '#FAFAFA',
                      border: isSelected ? `2px solid ${cat.color}` : '1px solid #E2ECEC',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: isSelected ? `0 6px 16px ${cat.color}35` : '0 4px 10px rgba(0,0,0,0.03)',
                      transform: isSelected ? 'scale(1.08)' : 'scale(1)',
                      transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}>
                      {getCategoryEmoji(cat.id, isSelected)}
                    </div>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: isSelected ? 700 : 500,
                      color: isSelected ? '#1E293B' : '#64748B',
                    }}>
                      {cat.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Popular Deals Grid */}
          <section style={{ padding: '0 20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
            }}>
              <h3 style={{
                fontSize: '16px',
                fontWeight: 700,
                color: '#1E293B',
                margin: 0,
                fontFamily: "'Poppins', sans-serif",
              }}>
                {selectedCategory === 'all'
                  ? 'Popular Deals'
                  : `${categoryItems.find((c) => c.id === selectedCategory)?.name || 'Filtered'} (${filteredProducts.length})`}
              </h3>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 600 }}>
                {filteredProducts.length} items
              </span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '14px',
            }}>
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  quantity={cart[p.id] || 0}
                  onQuantityChange={(q) => handleQtyChange(p.id, q)}
                  onClick={() => setSelectedProduct(p)}
                />
              ))}
            </div>
          </section>
        </>
      )}

      {/* 3. TAB 2: EXPLORE CATALOG */}
      {activeTab === 'catalog' && (
        <main style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
            Explore Drinks ({products.length})
          </h2>

          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: '4px' }}>
            <button
              onClick={() => setSelectedCategory('all')}
              style={{
                backgroundColor: selectedCategory === 'all' ? '#4AB7B6' : '#FFFFFF',
                color: selectedCategory === 'all' ? '#FFFFFF' : '#64748B',
                border: '1px solid #E2ECEC',
                borderRadius: '12px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              All Bottles
            </button>
            {categoryItems.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                style={{
                  backgroundColor: selectedCategory === c.id ? '#4AB7B6' : '#FFFFFF',
                  color: selectedCategory === c.id ? '#FFFFFF' : '#64748B',
                  border: '1px solid #E2ECEC',
                  borderRadius: '12px',
                  padding: '8px 14px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                {c.name}
              </button>
            ))}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '14px',
          }}>
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                quantity={cart[p.id] || 0}
                onQuantityChange={(q) => handleQtyChange(p.id, q)}
                onClick={() => setSelectedProduct(p)}
              />
            ))}
          </div>
        </main>
      )}

      {/* 4. TAB 3: MY ORDERS */}
      {activeTab === 'wishlist' && (
        <main style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, margin: 0, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
            My Orders &amp; Live Tracking
          </h2>

          {myOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748B' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#E8F5F5', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
                <IconReceipt size={28} color="#4AB7B6" />
              </div>
              <h4 style={{ margin: 0, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>No Orders Placed Yet</h4>
              <p style={{ fontSize: '12px', margin: '6px 0 0' }}>Place an order and track its dispatch status in real-time.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {myOrders.map((ord) => (
                <div
                  key={ord.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '16px',
                    border: '1px solid #E8F2F2',
                    padding: '16px',
                    boxShadow: '0 4px 14px rgba(74, 183, 182, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: 800, color: '#1E293B' }}>
                      #{ord.id}
                    </span>
                    <span style={{
                      backgroundColor: ord.status === 'delivered' ? '#DCFCE7' : '#E8F5F5',
                      color: ord.status === 'delivered' ? '#166534' : '#2C7372',
                      padding: '4px 10px',
                      borderRadius: '10px',
                      fontSize: '11px',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                    }}>
                      {ord.status.replace(/_/g, ' ')}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', color: '#475569' }}>
                    {ord.items.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #F1F5F9',
                    paddingTop: '8px',
                  }}>
                    <span style={{ fontSize: '15px', fontWeight: 800, color: '#1E293B' }}>
                      ₹{ord.total.toLocaleString('en-IN')}
                    </span>

                    <button
                      onClick={() => {
                        setActiveTrackingOrderId(ord.id);
                        setTrackedOrder(ord);
                      }}
                      style={{
                        backgroundColor: '#4AB7B6',
                        color: '#FFFFFF',
                        border: 'none',
                        borderRadius: '10px',
                        padding: '6px 14px',
                        fontSize: '12px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <IconClock size={14} color="#FFFFFF" />
                      <span>Track Status</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      )}

      {/* 5. TAB 4: PROFILE & ADDRESS BOOK (Step 3 / Section B) */}
      {activeTab === 'profile' && (
        <main style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* User Account Card */}
          {customerProfile?.email ? (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '18px',
              border: '1px solid #E8F2F2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              boxShadow: '0 4px 16px rgba(74, 183, 182, 0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  backgroundColor: '#4AB7B6',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  fontWeight: 800,
                  fontFamily: "'Poppins', sans-serif",
                }}>
                  {customerProfile.name ? customerProfile.name.slice(0, 2).toUpperCase() : 'LW'}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '16px', color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                    {customerProfile.name}
                  </h3>
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                    {customerProfile.email}
                  </div>
                  {customerProfile.phone && (
                    <div style={{ fontSize: '11px', color: '#64748B', marginTop: '1px', fontWeight: 600 }}>
                      📱 +91 {customerProfile.phone}
                    </div>
                  )}
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', backgroundColor: '#F0FDF4', color: '#166534', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 800, marginTop: '4px' }}>
                    <AnimatedShield size={12} color="#166534" />
                    <span>21+ Age Verified Account</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCustomerProfile(null);
                  showToast('Signed out of account', 'info');
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: '1px solid #CBD5E1',
                  color: '#64748B',
                  borderRadius: '8px',
                  padding: '6px 10px',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              padding: '18px',
              border: '1.5px solid #E8F2F2',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              boxShadow: '0 4px 16px rgba(74, 183, 182, 0.08)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  backgroundColor: '#E8F5F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <IconUser size={20} color="#4AB7B6" />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '15px', color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                    Sign in with Google
                  </h3>
                  <span style={{ fontSize: '12px', color: '#64748B' }}>
                    Save addresses, auto-fill checkout &amp; view all past orders
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setLoginStep(1);
                  setIsLoginModalOpen(true);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '10px',
                  padding: '12px',
                  borderRadius: '12px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  color: '#1E293B',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Saved Addresses Book (Step 3 / Section B) */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px',
            border: '1px solid #E8F2F2',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconMapPin size={18} color="#4AB7B6" />
                <h4 style={{ margin: 0, fontSize: '15px', color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                  Saved Addresses ({savedAddresses.length})
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsAddAddressOpen(true)}
                style={{
                  backgroundColor: '#E8F5F5',
                  color: '#4AB7B6',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '6px 12px',
                  fontSize: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                + Add Address
              </button>
            </div>

            {savedAddresses.length === 0 ? (
              <div style={{
                padding: '24px 16px',
                textAlign: 'center',
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                border: '1px dashed #CBD5E1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
              }}>
                <IconMapPin size={28} color="#94A3B8" />
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569' }}>
                  No saved addresses yet
                </span>
                <span style={{ fontSize: '11px', color: '#64748B', maxWidth: '240px' }}>
                  Add your home or office address for seamless 1-tap checkout.
                </span>
                <button
                  type="button"
                  onClick={() => setIsAddAddressOpen(true)}
                  style={{
                    marginTop: '4px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    backgroundColor: '#4AB7B6',
                    color: '#FFFFFF',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  + Add Your Address
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    style={{
                      padding: '12px',
                      borderRadius: '12px',
                      border: addr.isDefault ? '2px solid #4AB7B6' : '1px solid #E2E8F0',
                      backgroundColor: addr.isDefault ? '#F0FBFB' : '#FFFFFF',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          textTransform: 'uppercase',
                          backgroundColor: '#E8F5F5',
                          color: '#4AB7B6',
                          padding: '2px 6px',
                          borderRadius: '4px',
                        }}>
                          {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span style={{
                            fontSize: '10px',
                            fontWeight: 700,
                            color: '#10B981',
                            backgroundColor: '#ECFDF5',
                            padding: '2px 6px',
                            borderRadius: '4px',
                          }}>
                            Default Delivery Address
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        {!addr.isDefault && (
                          <button
                            type="button"
                            onClick={() => handleSetDefaultAddress(addr)}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              color: '#4AB7B6',
                              fontSize: '11px',
                              fontWeight: 700,
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            Set Default
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr.id)}
                          style={{
                            backgroundColor: 'transparent',
                            border: 'none',
                            color: '#EF4444',
                            fontSize: '11px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1E293B' }}>
                      {addr.line1}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748B' }}>
                      {addr.line2 ? `${addr.line2}, ` : ''}{addr.landmark ? `Near ${addr.landmark}, ` : ''}PIN: {addr.pincode}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Store & Legal Compliance Notice */}
          <div style={{
            backgroundColor: '#FFFFFF',
            borderRadius: '18px',
            padding: '16px',
            border: '1px solid #E8F2F2',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}>
            <h4 style={{ margin: 0, fontSize: '14px', color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
              Store Contact &amp; License
            </h4>
            <div style={{ fontSize: '12px', color: '#64748B' }}>
              Operated by {storeSettings.shopName}. Licensed under Karnataka Excise regulations. 21+ adults only.
            </div>
            <a
              href={`tel:${storeSettings.phone}`}
              style={{
                backgroundColor: '#F4F9F9',
                color: '#4AB7B6',
                border: '1px solid #E2ECEC',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '13px',
                fontWeight: 700,
                textAlign: 'center',
                textDecoration: 'none',
              }}
            >
              📞 Call Support: {storeSettings.phone}
            </a>
          </div>
        </main>
      )}

      {/* 6. HyperMart TabBar with Center Floating Cart */}
      <TabBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
      />

      {/* 7. Drink Detail Bottom Sheet */}
      <BottomSheet
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title={selectedProduct?.brand || 'Drink Details'}
      >
        {selectedProduct && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative', width: '100%', height: '190px', borderRadius: '18px', overflow: 'hidden' }}>
              <img
                src={selectedProduct.images[0]}
                alt={selectedProduct.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                backgroundColor: 'rgba(0,0,0,0.65)',
                backdropFilter: 'blur(8px)',
                color: '#FFFFFF',
                borderRadius: '9999px',
                padding: '4px 10px',
                fontSize: '11px',
                fontWeight: 700,
              }}>
                {selectedProduct.sizeMl}ml &bull; {selectedProduct.abv}% ABV
              </div>
            </div>

            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 800, margin: '0 0 4px', color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                {selectedProduct.name}
              </h3>
              <p style={{ fontSize: '13px', color: '#64748B', margin: '0 0 10px', lineHeight: 1.4 }}>
                {selectedProduct.description}
              </p>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {selectedProduct.tags.map((t) => (
                  <span
                    key={t}
                    style={{
                      backgroundColor: '#E8F5F5',
                      color: '#2C7372',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '8px',
                    }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid #E8F2F2',
              paddingTop: '14px',
            }}>
              <div>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>Price</span>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                    ₹{selectedProduct.price.toLocaleString('en-IN')}
                  </span>
                  {selectedProduct.mrp > selectedProduct.price && (
                    <span style={{ fontSize: '12px', color: '#94A3B8', textDecoration: 'line-through' }}>
                      ₹{selectedProduct.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => {
                  handleQtyChange(selectedProduct.id, (cart[selectedProduct.id] || 0) + 1);
                  setSelectedProduct(null);
                  setIsCartOpen(true);
                }}
                style={{
                  backgroundColor: '#FDAA5D',
                  color: '#FFFFFF',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 20px',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(253, 170, 93, 0.4)',
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
        )}
      </BottomSheet>

      {/* 8. HyperMart Cart Drawer */}
      <BottomSheet
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        title="My Shopping Cart"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {cartCount === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 0', color: '#64748B' }}>
              <AnimatedBottle size={40} color="#4AB7B6" />
              <h4 style={{ margin: '8px 0 0', color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>Your Cart is Empty</h4>
              <p style={{ fontSize: '12px', margin: '4px 0 0' }}>Add some drinks from the storefront.</p>
            </div>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '240px', overflowY: 'auto' }}>
                {Object.entries(cart).map(([id, qty]) => {
                  const item = products.find((x) => x.id === id);
                  if (!item) return null;
                  return (
                    <div
                      key={id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '10px 12px',
                        borderRadius: '14px',
                        backgroundColor: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          style={{ width: '42px', height: '42px', borderRadius: '10px', objectFit: 'cover' }}
                        />
                        <div>
                          <h5 style={{ fontSize: '13px', margin: 0, color: '#1E293B' }}>{item.name}</h5>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>
                            ₹{item.price.toLocaleString('en-IN')} &times; {qty}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => handleQtyChange(id, qty - 1)}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            border: '1px solid #CBD5E1',
                            backgroundColor: '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: '13px', fontWeight: 700, minWidth: '16px', textAlign: 'center' }}>
                          {qty}
                        </span>
                        <button
                          onClick={() => handleQtyChange(id, qty + 1)}
                          style={{
                            width: '26px',
                            height: '26px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: '#4AB7B6',
                            color: '#FFFFFF',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 700,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pricing Breakdown */}
              <div style={{
                padding: '12px',
                borderRadius: '14px',
                backgroundColor: '#F0FBFB',
                border: '1px solid #D1EBEB',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
                fontSize: '13px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Subtotal</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#10B981', fontWeight: 600 }}>
                  <span>Delivery Charges</span>
                  <span>{deliveryFee === 0 ? 'FREE' : `₹${(deliveryFee || 0).toLocaleString('en-IN')}`}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '16px',
                  color: '#1E293B',
                  borderTop: '1px solid #D1EBEB',
                  paddingTop: '6px',
                }}>
                  <span>Total</span>
                  <span style={{ color: '#4AB7B6' }}>₹{(cartGrandTotal || 0).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setIsCheckoutOpen(true);
                }}
                style={{
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  backgroundColor: '#FDAA5D',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: 800,
                  fontFamily: "'Poppins', sans-serif",
                  cursor: 'pointer',
                  boxShadow: '0 6px 18px rgba(253, 170, 93, 0.45)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                <span>Proceed to Checkout</span>
                <span>&bull;</span>
                <span>₹{cartGrandTotal.toLocaleString('en-IN')}</span>
              </button>
            </>
          )}
        </div>
      </BottomSheet>

      {/* 9. Live Order Tracking Modal */}
      <BottomSheet
        isOpen={!!activeTrackingOrderId && !!trackedOrder}
        onClose={() => setActiveTrackingOrderId(null)}
        title={`Order #${trackedOrder?.id}`}
      >
        {trackedOrder && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              padding: '16px',
              border: '1px solid #E8F2F2',
              boxShadow: '0 2px 10px rgba(74, 183, 182, 0.08)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Status</span>
                <span style={{
                  fontSize: '12px',
                  fontWeight: 800,
                  color: trackedOrder.status === 'delivered' ? '#10B981' : '#4AB7B6',
                  textTransform: 'uppercase',
                }}>
                  {trackedOrder.status.replace(/_/g, ' ')}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                {[
                  { key: 'placed', label: 'Received' },
                  { key: 'confirmed', label: 'Verified' },
                  { key: 'packed', label: 'Packed' },
                  { key: 'out_for_delivery', label: 'Dispatched' },
                  { key: 'delivered', label: 'Delivered' },
                ].map((step, idx) => {
                  const stepIndex = ['placed', 'confirmed', 'packed', 'out_for_delivery', 'delivered'].indexOf(trackedOrder.status);
                  const isDone = idx <= stepIndex;
                  return (
                    <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                      <div style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '50%',
                        backgroundColor: isDone ? '#4AB7B6' : '#E2E8F0',
                        color: '#FFFFFF',
                        fontSize: '11px',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                        {isDone ? '✓' : idx + 1}
                      </div>
                      <span style={{ fontSize: '9px', color: isDone ? '#1E293B' : '#94A3B8', marginTop: '4px', fontWeight: isDone ? 700 : 500 }}>
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment */}
            <div style={{
              backgroundColor: '#F8FAFC',
              borderRadius: '14px',
              padding: '12px 14px',
              border: '1px solid #E2E8F0',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                <span style={{ color: '#64748B' }}>Payment</span>
                <span style={{ fontWeight: 800, color: '#1E293B' }}>
                  {trackedOrder.paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'} · ₹{trackedOrder.total.toLocaleString('en-IN')}
                </span>
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color:
                trackedOrder.paymentStatus === 'paid' ? '#10B981' :
                trackedOrder.paymentStatus === 'failed' ? '#EF4444' : '#B45309' }}>
                {trackedOrder.paymentStatus === 'paid' && 'Payment received'}
                {trackedOrder.paymentStatus === 'pending' && 'Pay the delivery partner on delivery'}
                {trackedOrder.paymentStatus === 'awaiting_verification' && 'Payment not completed yet'}
                {trackedOrder.paymentStatus === 'payment_submitted' && 'Waiting for the store to verify your payment'}
                {trackedOrder.paymentStatus === 'failed' && 'The store could not find your payment'}
              </div>
              {trackedOrder.paymentMethod === 'upi' &&
                (trackedOrder.paymentStatus === 'awaiting_verification' || trackedOrder.paymentStatus === 'failed') &&
                trackedOrder.status !== 'cancelled' && (
                <button
                  onClick={() => setPaymentOrder(trackedOrder)}
                  style={{
                    padding: '10px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#4AB7B6',
                    color: '#FFFFFF',
                    fontSize: '13px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {trackedOrder.paymentStatus === 'failed' ? 'Pay again' : 'Complete payment'}
                </button>
              )}
            </div>

            {storeSettings.phone && (
              <a
                href={`tel:${storeSettings.phone.replace(/[^+0-9]/g, '')}`}
                style={{
                  backgroundColor: '#4AB7B6',
                  color: '#FFFFFF',
                  borderRadius: '12px',
                  padding: '11px',
                  fontSize: '13px',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                }}
              >
                <IconPhone size={14} color="#FFFFFF" />
                <span>Call the store</span>
              </a>
            )}

            {trackedOrder.status === 'placed' && (
              <button
                onClick={async () => {
                  try {
                    await cancelMyOrder(trackedOrder.id);
                    showToast('Order cancelled', 'info');
                  } catch (err) {
                    console.error('Cancel failed:', err);
                    showToast('Could not cancel. Please call the store.', 'error');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '11px',
                  borderRadius: '12px',
                  backgroundColor: '#FFFFFF',
                  color: '#B91C1C',
                  border: '1.5px solid #FECACA',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Cancel order
              </button>
            )}

            <button
              onClick={() => setActiveTrackingOrderId(null)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#1E293B',
                color: '#FFFFFF',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        )}
      </BottomSheet>

      {/* 10. UPI payment (opens right after a UPI order is saved, or from the order tracker) */}
      <UpiPaymentSheet
        order={paymentOrder}
        settings={storeSettings}
        showToast={showToast}
        onClose={() => {
          // Pay later: keep the order and show it in the tracker
          if (paymentOrder) setActiveTrackingOrderId(paymentOrder.id);
          setPaymentOrder(null);
        }}
        onSubmitted={(orderId) => {
          setPaymentOrder(null);
          setActiveTrackingOrderId(orderId);
        }}
      />
      {/* 11. Customer Google Login + Step 2 Profile Modal (Google Only -> Step 2 Phone & Password, NO OTP) */}
      <BottomSheet
        isOpen={isLoginModalOpen}
        onClose={() => {
          setIsLoginModalOpen(false);
          setAuthError('');
        }}
        title={loginStep === 1 ? 'Customer Sign In' : 'Step 2: Phone & Password'}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '10px' }}>
          {loginStep === 1 ? (
            <>
              <div style={{ textAlign: 'center', padding: '10px 0' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '16px',
                  backgroundColor: '#E8F5F5',
                  color: '#4AB7B6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                }}>
                  <AnimatedBottle size={32} color="#4AB7B6" glow />
                </div>
                <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                  Sign in to LuckyWine
                </h3>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748B', lineHeight: 1.4 }}>
                  Connect your Google account to save delivery addresses, view order history, and unlock fast 1-tap checkout.
                </p>
              </div>

              {authError && (
                <div style={{ fontSize: '12px', color: '#EF4444', backgroundColor: '#FEF2F2', padding: '10px 12px', borderRadius: '10px', border: '1px solid #FEE2E2' }}>
                  {authError}
                </div>
              )}

              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                  width: '100%',
                  padding: '14px',
                  borderRadius: '14px',
                  border: '1.5px solid #CBD5E1',
                  backgroundColor: '#FFFFFF',
                  fontSize: '15px',
                  fontWeight: 700,
                  color: '#1E293B',
                  cursor: authLoading ? 'default' : 'pointer',
                  opacity: authLoading ? 0.7 : 1,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                  transition: 'all 150ms ease',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>{authLoading ? 'Connecting Google Account…' : 'Continue with Google'}</span>
              </button>

              <div style={{ textAlign: 'center', fontSize: '11px', color: '#94A3B8' }}>
                State Excise Law: 21+ adults only. We do not share your private data.
              </div>
            </>
          ) : (
            <>
              <div>
                <div style={{
                  display: 'inline-block',
                  backgroundColor: '#E8F5F5',
                  color: '#4AB7B6',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '3px 8px',
                  borderRadius: '6px',
                  marginBottom: '6px',
                  textTransform: 'uppercase',
                }}>
                  Step 2 of 2
                </div>
                <h3 style={{ margin: '0 0 4px', fontSize: '17px', fontWeight: 800, color: '#1E293B', fontFamily: "'Poppins', sans-serif" }}>
                  Set Mobile Number &amp; Password
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748B' }}>
                  No OTP required. Complete your profile to secure your account for instant order updates.
                </p>
              </div>

              {authError && (
                <div style={{ fontSize: '12px', color: '#EF4444', backgroundColor: '#FEF2F2', padding: '10px 12px', borderRadius: '10px', border: '1px solid #FEE2E2' }}>
                  {authError}
                </div>
              )}

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  10-Digit Mobile Number
                </label>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #CBD5E1', borderRadius: '10px', overflow: 'hidden' }}>
                  <span style={{ padding: '11px 12px', backgroundColor: '#F8FAFC', color: '#64748B', fontSize: '13px', fontWeight: 700, borderRight: '1px solid #E2E8F0' }}>
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={step2Phone}
                    onChange={(e) => setStep2Phone(e.target.value.replace(/[^0-9]/g, ''))}
                    style={{
                      flex: 1,
                      padding: '11px 12px',
                      border: 'none',
                      fontSize: '14px',
                      color: '#1E293B',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
                  Set Account Password
                </label>
                <input
                  type="password"
                  placeholder="Min 6 characters"
                  value={step2Password}
                  onChange={(e) => setStep2Password(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 12px',
                    borderRadius: '10px',
                    border: '1px solid #CBD5E1',
                    fontSize: '14px',
                    color: '#1E293B',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <button
                type="button"
                onClick={handleStep2Save}
                disabled={authLoading}
                style={{
                  marginTop: '6px',
                  width: '100%',
                  padding: '13px',
                  borderRadius: '12px',
                  backgroundColor: '#4AB7B6',
                  color: '#FFFFFF',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 800,
                  cursor: authLoading ? 'default' : 'pointer',
                  opacity: authLoading ? 0.7 : 1,
                  boxShadow: '0 4px 14px rgba(74, 183, 182, 0.35)',
                }}
              >
                {authLoading ? 'Saving Profile…' : 'Complete Setup & Save'}
              </button>
            </>
          )}
        </div>
      </BottomSheet>

      {/* 12. Add Delivery Address BottomSheet (Step 3 / Section B) */}
      <BottomSheet
        isOpen={isAddAddressOpen}
        onClose={() => setIsAddAddressOpen(false)}
        title="Add Delivery Address"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingBottom: '10px' }}>
          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '6px' }}>
              Address Label
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {(['Home', 'Work', 'Other'] as const).map((lbl) => (
                <button
                  key={lbl}
                  type="button"
                  onClick={() => setNewAddrLabel(lbl)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: newAddrLabel === lbl ? '2px solid #4AB7B6' : '1px solid #CBD5E1',
                    backgroundColor: newAddrLabel === lbl ? '#E8F5F5' : '#FFFFFF',
                    color: newAddrLabel === lbl ? '#4AB7B6' : '#64748B',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {lbl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Flat / House No. / Building / Floor *
            </label>
            <input
              type="text"
              placeholder="e.g. Flat 302, Green Glen Apartments"
              value={newAddrLine1}
              onChange={(e) => setNewAddrLine1(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                color: '#1E293B',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Street / Road / Area
            </label>
            <input
              type="text"
              placeholder="e.g. 10th Main, BTM Layout 2nd Stage"
              value={newAddrLine2}
              onChange={(e) => setNewAddrLine2(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                color: '#1E293B',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              Nearby Landmark (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Near Silk Board Junction / Metro Pillar 42"
              value={newAddrLandmark}
              onChange={(e) => setNewAddrLandmark(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                color: '#1E293B',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', display: 'block', marginBottom: '4px' }}>
              6-Digit Pincode *
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="560038"
              value={newAddrPincode}
              onChange={(e) => setNewAddrPincode(e.target.value.replace(/[^0-9]/g, ''))}
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: '10px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                color: '#1E293B',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            {newAddrPincode.length === 6 && (
              <div style={{
                fontSize: '11px',
                marginTop: '4px',
                color: storeSettings.pincodes.includes(newAddrPincode) ? '#166534' : '#92400E',
                fontWeight: 600,
              }}>
                {storeSettings.pincodes.includes(newAddrPincode)
                  ? '✓ Standard delivery available in this pincode'
                  : `⚠️ Notice: Store primarily serves ${storeSettings.pincodes.join(', ')}`}
              </div>
            )}
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', marginTop: '2px' }}>
            <input
              type="checkbox"
              checked={newAddrDefault}
              onChange={(e) => setNewAddrDefault(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#4AB7B6' }}
            />
            <span style={{ fontSize: '12px', color: '#1E293B', fontWeight: 600 }}>
              Set as my default delivery address
            </span>
          </label>

          <button
            type="button"
            onClick={handleSaveNewAddress}
            style={{
              marginTop: '8px',
              padding: '13px',
              borderRadius: '12px',
              backgroundColor: '#4AB7B6',
              color: '#FFFFFF',
              border: 'none',
              fontSize: '14px',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(74, 183, 182, 0.35)',
            }}
          >
            Save Address
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <HyperMartStorefront />
      <OfflineBanner />
      <LaunchGate />
    </ToastProvider>
  );
}
