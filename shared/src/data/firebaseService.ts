import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  remove,
  push,
  onValue,
} from 'firebase/database';
import { FIREBASE_CONFIG, DEFAULT_SETTINGS } from '../config/firebase.config';
import { Product, Category, Banner, StoreSettings, Order } from '../types';

// Initialize Firebase App singleton
export function getFirebaseApp() {
  if (getApps().length > 0) {
    return getApp();
  }
  return initializeApp(FIREBASE_CONFIG);
}

export function getRTDB() {
  const app = getFirebaseApp();
  return getDatabase(app);
}

// -------------------------------------------------------------
// LIVE STOREFRONT DATA WITH REALTIME LISTENERS
// -------------------------------------------------------------

export function subscribeToStoreSettings(onUpdate: (settings: StoreSettings) => void): () => void {
  try {
    const db = getRTDB();
    const settingsRef = ref(db, 'settings');
    return onValue(settingsRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.val() as StoreSettings);
      } else {
        onUpdate(DEFAULT_SETTINGS as StoreSettings);
      }
    });
  } catch (err) {
    console.warn('Settings subscription fallback:', err);
    onUpdate(DEFAULT_SETTINGS as StoreSettings);
    return () => {};
  }
}

export async function fetchStoreSettings(): Promise<StoreSettings> {
  try {
    const db = getRTDB();
    const snapshot = await get(ref(db, 'settings'));
    if (snapshot.exists()) {
      return snapshot.val() as StoreSettings;
    }
  } catch (err) {
    console.warn('Using local default settings due to network/rules:', err);
  }
  return DEFAULT_SETTINGS as StoreSettings;
}

export function subscribeToProducts(onUpdate: (products: Product[]) => void): () => void {
  try {
    const db = getRTDB();
    const prodsRef = ref(db, 'products');
    return onValue(prodsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        onUpdate(Object.values(val));
      } else {
        onUpdate([]);
      }
    });
  } catch (err) {
    console.warn('Products subscription fallback:', err);
    return () => {};
  }
}

export async function fetchProductsList(): Promise<Product[]> {
  try {
    const db = getRTDB();
    const snapshot = await get(ref(db, 'products'));
    if (snapshot.exists()) {
      const val = snapshot.val();
      return Object.values(val);
    }
  } catch (err) {
    console.warn('Products RTDB fetch fallback:', err);
  }
  return [];
}

export function subscribeToBanners(onUpdate: (banners: Banner[]) => void): () => void {
  try {
    const db = getRTDB();
    const bannersRef = ref(db, 'banners');
    return onValue(bannersRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        onUpdate(Object.values(val));
      } else {
        onUpdate([]);
      }
    });
  } catch (err) {
    console.warn('Banners subscription fallback:', err);
    return () => {};
  }
}

export async function fetchCategoriesList(): Promise<Category[]> {
  try {
    const db = getRTDB();
    const snapshot = await get(ref(db, 'categories'));
    if (snapshot.exists()) {
      const val = snapshot.val();
      const list: Category[] = Object.values(val);
      return list.sort((a, b) => a.order - b.order);
    }
  } catch (err) {
    console.warn('Categories RTDB fetch fallback:', err);
  }
  return [
    { id: 'cat_whiskey', name: 'Spirits & Whiskey', order: 1, icon: 'whiskey', visible: true },
    { id: 'cat_beer', name: 'Beers & Ciders', order: 2, icon: 'beer', visible: true },
    { id: 'cat_wine', name: 'Fine Wines', order: 3, icon: 'wine', visible: true },
    { id: 'cat_vodka', name: 'Vodka & Gin', order: 4, icon: 'vodka', visible: true },
    { id: 'cat_mixers', name: 'Mixers & Snacks', order: 5, icon: 'mixers', visible: true },
  ];
}

export function subscribeToOrders(onUpdate: (orders: Order[]) => void): () => void {
  try {
    const db = getRTDB();
    const ordersRef = ref(db, 'orders');
    return onValue(ordersRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list: Order[] = Object.values(val);
        list.sort((a, b) => b.createdAt - a.createdAt);
        onUpdate(list);
      } else {
        onUpdate([]);
      }
    });
  } catch (e) {
    console.warn('Orders subscription error:', e);
    return () => {};
  }
}

export async function createOrderInRTDB(order: Order): Promise<string> {
  const db = getRTDB();
  const orderRef = ref(db, `orders/${order.id}`);
  await set(orderRef, order);
  return order.id;
}

export function subscribeToSingleOrder(orderId: string, onUpdate: (order: Order | null) => void): () => void {
  try {
    const db = getRTDB();
    const orderRef = ref(db, `orders/${orderId}`);
    return onValue(orderRef, (snapshot) => {
      if (snapshot.exists()) {
        onUpdate(snapshot.val() as Order);
      } else {
        onUpdate(null);
      }
    });
  } catch (e) {
    console.warn('Single order subscription error:', e);
    return () => {};
  }
}

export async function addProductToRTDB(product: Product): Promise<void> {
  const db = getRTDB();
  await set(ref(db, `products/${product.id}`), product);
}

export async function updateProductInRTDB(productId: string, updates: Partial<Product>): Promise<void> {
  const db = getRTDB();
  await update(ref(db, `products/${productId}`), {
    ...updates,
    updatedAt: Date.now(),
  });
}

export async function deleteProductFromRTDB(productId: string): Promise<void> {
  const db = getRTDB();
  await remove(ref(db, `products/${productId}`));
}

export async function updateBannerInRTDB(bannerId: string, updates: Partial<Banner>): Promise<void> {
  const db = getRTDB();
  await update(ref(db, `banners/${bannerId}`), updates);
}

export async function updateStoreSettingsInRTDB(settings: Partial<StoreSettings>): Promise<void> {
  const db = getRTDB();
  await update(ref(db, 'settings'), settings);
}

export async function updateOrderStatusInRTDB(orderId: string, status: Order['status']) {
  const db = getRTDB();
  await update(ref(db, `orders/${orderId}`), {
    status,
    updatedAt: Date.now(),
  });
}

export async function updateOrderPaymentStatusInRTDB(orderId: string, paymentStatus: Order['paymentStatus']) {
  const db = getRTDB();
  await update(ref(db, `orders/${orderId}`), {
    paymentStatus,
    updatedAt: Date.now(),
  });
}

export async function seedRealtimeDatabase(seedData: any): Promise<boolean> {
  try {
    const db = getRTDB();
    if (seedData.settings) {
      await set(ref(db, 'settings'), seedData.settings);
    }
    if (seedData.categories) {
      await set(ref(db, 'categories'), seedData.categories);
    }
    if (seedData.products) {
      await set(ref(db, 'products'), seedData.products);
    }
    if (seedData.banners) {
      await set(ref(db, 'banners'), seedData.banners);
    }
    return true;
  } catch (err) {
    console.error('Failed to seed Realtime Database:', err);
    throw err;
  }
}
