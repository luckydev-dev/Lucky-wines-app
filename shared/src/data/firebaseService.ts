import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getDatabase,
  ref,
  get,
  set,
  update,
  remove,
  onValue,
  query,
  orderByChild,
  equalTo,
} from 'firebase/database';
import {
  getAuth,
  signInAnonymously,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
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
// AUTH
// -------------------------------------------------------------

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

let customerAuthPromise: Promise<string> | null = null;

/**
 * Customer app: every device gets an anonymous Firebase user so database
 * rules can tie an order to its owner (auth.uid).
 * Requires "Anonymous" sign-in to be enabled in Firebase Console -> Authentication.
 */
export function ensureCustomerAuth(): Promise<string> {
  const auth = getFirebaseAuth();
  if (auth.currentUser) return Promise.resolve(auth.currentUser.uid);
  if (!customerAuthPromise) {
    customerAuthPromise = signInAnonymously(auth)
      .then((cred) => cred.user.uid)
      .finally(() => {
        customerAuthPromise = null;
      });
  }
  return customerAuthPromise;
}
export interface CustomerProfile {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  passwordSet?: boolean;
  createdAt: number;
}

export interface SavedAddress {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  landmark?: string;
  pincode: string;
  isDefault?: boolean;
}

/** Customer sign-in via Google */
export async function customerGoogleSignIn(): Promise<{ uid: string; name: string; email: string }> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: 'select_account' });
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  const db = getRTDB();
  
  // Check if profile exists, if not initialize
  const snap = await get(ref(db, `users/${user.uid}`));
  if (!snap.exists()) {
    await update(ref(db, `users/${user.uid}`), {
      name: user.displayName || 'Customer',
      email: user.email || '',
      createdAt: Date.now(),
    });
  }
  return {
    uid: user.uid,
    name: user.displayName || 'Customer',
    email: user.email || '',
  };
}

/** Update customer profile (e.g. mobile number, password, etc) */
export async function saveCustomerProfile(uid: string, profile: Partial<CustomerProfile>): Promise<void> {
  const db = getRTDB();
  await update(ref(db, `users/${uid}`), profile);
}

/** Fetch customer profile */
export async function fetchCustomerProfile(uid: string): Promise<CustomerProfile | null> {
  const db = getRTDB();
  const snap = await get(ref(db, `users/${uid}`));
  return snap.exists() ? (snap.val() as CustomerProfile) : null;
}

/** Subscribe to customer addresses */
export function subscribeToCustomerAddresses(uid: string, onUpdate: (addresses: SavedAddress[]) => void): () => void {
  const db = getRTDB();
  return onValue(
    ref(db, `users/${uid}/addresses`),
    (snap) => {
      if (snap.exists()) {
        const val = snap.val();
        onUpdate(Object.values(val));
      } else {
        onUpdate([]);
      }
    },
    () => onUpdate([])
  );
}

/** Save or update customer address */
export async function saveCustomerAddress(uid: string, address: SavedAddress): Promise<void> {
  const db = getRTDB();
  await set(ref(db, `users/${uid}/addresses/${address.id}`), address);
}

/** Delete customer address */
export async function deleteCustomerAddress(uid: string, addressId: string): Promise<void> {
  const db = getRTDB();
  await remove(ref(db, `users/${uid}/addresses/${addressId}`));
}

/** Admin app: email + password. Signs out again unless the uid exists under /admins. */
export async function adminSignIn(email: string, password: string): Promise<void> {
  const auth = getFirebaseAuth();
  const cred = await signInWithEmailAndPassword(auth, email.trim(), password);
  const snap = await get(ref(getRTDB(), `admins/${cred.user.uid}`));
  if (!snap.exists()) {
    await signOut(auth);
    throw new Error('NOT_ADMIN');
  }
  localStorage.setItem('lucky_admin_auth_cached', cred.user.uid);
}

/** Admin app: create new admin account and register under /admins in RTDB. */
export async function adminRegister(email: string, password: string, name?: string): Promise<void> {
  const auth = getFirebaseAuth();
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const db = getRTDB();
  await set(ref(db, `admins/${cred.user.uid}`), {
    email: email.trim(),
    name: name?.trim() || 'Store Manager',
    role: 'admin',
    createdAt: Date.now(),
  });
  localStorage.setItem('lucky_admin_auth_cached', cred.user.uid);
}

export async function adminSignOut(): Promise<void> {
  await signOut(getFirebaseAuth());
}

/** Reports 'in' only for a signed-in (non-anonymous) user whose uid exists under /admins. */
export function subscribeToAdminSession(onChange: (state: 'in' | 'out') => void): () => void {
  const auth = getFirebaseAuth();
  return onAuthStateChanged(auth, async (user) => {
    if (!user || user.isAnonymous) {
      localStorage.removeItem('lucky_admin_auth_cached');
      onChange('out');
      return;
    }
    // Check if this UID was already verified as admin on this device
    const cachedAdminUid = localStorage.getItem('lucky_admin_auth_cached');
    if (cachedAdminUid === user.uid) {
      onChange('in');
    }
    try {
      const snap = await get(ref(getRTDB(), `admins/${user.uid}`));
      if (snap.exists()) {
        localStorage.setItem('lucky_admin_auth_cached', user.uid);
        onChange('in');
      } else {
        // If not listed as admin, clear cache and sign out
        localStorage.removeItem('lucky_admin_auth_cached');
        await signOut(auth);
        onChange('out');
      }
    } catch (err) {
      console.warn('Admin check transient error:', err);
      // If we already cached this UID as admin, keep the session open rather than kicking out
      if (localStorage.getItem('lucky_admin_auth_cached') === user.uid) {
        onChange('in');
      } else {
        onChange('out');
      }
    }
  });
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
        const val = snapshot.val();
        onUpdate({
          ...DEFAULT_SETTINGS,
          ...val,
          deliveryFee: typeof val.deliveryFee === 'number' ? val.deliveryFee : DEFAULT_SETTINGS.deliveryFee,
          freeDeliveryAbove: typeof val.freeDeliveryAbove === 'number' ? val.freeDeliveryAbove : DEFAULT_SETTINGS.freeDeliveryAbove,
          minOrder: typeof val.minOrder === 'number' ? val.minOrder : DEFAULT_SETTINGS.minOrder,
        } as StoreSettings);
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
      const val = snapshot.val();
      return {
        ...DEFAULT_SETTINGS,
        ...val,
        deliveryFee: typeof val.deliveryFee === 'number' ? val.deliveryFee : DEFAULT_SETTINGS.deliveryFee,
        freeDeliveryAbove: typeof val.freeDeliveryAbove === 'number' ? val.freeDeliveryAbove : DEFAULT_SETTINGS.freeDeliveryAbove,
        minOrder: typeof val.minOrder === 'number' ? val.minOrder : DEFAULT_SETTINGS.minOrder,
      } as StoreSettings;
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
        const list: Banner[] = Object.values(val);
        list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        onUpdate(list);
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

export function subscribeToCategories(onUpdate: (categories: Category[]) => void): () => void {
  try {
    return onValue(
      ref(getRTDB(), 'categories'),
      (snap) => {
        const list: Category[] = snap.exists() ? Object.values(snap.val()) : [];
        onUpdate(list.sort((a, b) => a.order - b.order));
      },
      () => {}
    );
  } catch (err) {
    console.warn('Categories subscription fallback:', err);
    return () => {};
  }
}

export async function saveCategoryInRTDB(category: Category): Promise<void> {
  await set(ref(getRTDB(), `categories/${category.id}`), category);
}

export async function deleteCategoryFromRTDB(categoryId: string): Promise<void> {
  await remove(ref(getRTDB(), `categories/${categoryId}`));
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

/** Customer app: only the signed-in customer's own orders (the full list is admin-only). */
export function subscribeToMyOrders(uid: string, onUpdate: (orders: Order[]) => void): () => void {
  const db = getRTDB();
  const myOrdersQuery = query(ref(db, 'orders'), orderByChild('userId'), equalTo(uid));
  return onValue(
    myOrdersQuery,
    (snapshot) => {
      const list: Order[] = snapshot.exists() ? Object.values(snapshot.val()) : [];
      list.sort((a, b) => b.createdAt - a.createdAt);
      onUpdate(list);
    },
    (err) => {
      console.warn('My orders subscription error:', err);
      onUpdate([]);
    }
  );
}

/**
 * Saves a new order owned by the current (anonymous) customer.
 * Throws if the write is rejected, so the caller must NOT show the order as placed on failure.
 */
export async function createOrderInRTDB(order: Order): Promise<string> {
  const uid = await ensureCustomerAuth();
  const db = getRTDB();
  // RTDB rejects `undefined`, so drop any undefined fields before writing.
  const clean = JSON.parse(JSON.stringify({ ...order, userId: uid })) as Order;
  await set(ref(db, `orders/${order.id}`), clean);
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

export async function saveBannerInRTDB(banner: Banner): Promise<void> {
  const db = getRTDB();
  await set(ref(db, `banners/${banner.id}`), banner);
}

export async function updateBannerInRTDB(bannerId: string, updates: Partial<Banner>): Promise<void> {
  const db = getRTDB();
  await update(ref(db, `banners/${bannerId}`), updates);
}

export async function deleteBannerFromRTDB(bannerId: string): Promise<void> {
  const db = getRTDB();
  await remove(ref(db, `banners/${bannerId}`));
}

export async function updateStoreSettingsInRTDB(settings: Partial<StoreSettings>): Promise<void> {
  const db = getRTDB();
  await update(ref(db, 'settings'), settings);
}

export async function updateOrderStatusInRTDB(
  orderId: string,
  status: Order['status'],
  extra: { paymentStatus?: Order['paymentStatus'] } = {}
) {
  const db = getRTDB();
  await update(ref(db, `orders/${orderId}`), {
    status,
    ...extra,
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

/**
 * Customer taps "I have paid" after paying by UPI. This only records that the customer says they paid
 * (paymentStatus = payment_submitted); the shop owner verifies it in the admin app.
 * Uses a root multi-path update so each field is checked against its own database rule.
 */
export async function submitUpiPayment(orderId: string, utr?: string): Promise<void> {
  await ensureCustomerAuth();
  const updates: Record<string, unknown> = {
    [`orders/${orderId}/paymentStatus`]: 'payment_submitted',
    [`orders/${orderId}/updatedAt`]: Date.now(),
  };
  const cleanUtr = utr?.trim();
  if (cleanUtr) updates[`orders/${orderId}/utr`] = cleanUtr;
  await update(ref(getRTDB()), updates);
}

/** Customer cancels their own order. The database only allows this while the order is still "placed". */
export async function cancelMyOrder(orderId: string): Promise<void> {
  await ensureCustomerAuth();
  await update(ref(getRTDB()), {
    [`orders/${orderId}/status`]: 'cancelled',
    [`orders/${orderId}/updatedAt`]: Date.now(),
  });
}

// -------------------------------------------------------------
// ADMIN DEVICES (which phones get new-order alerts)
// -------------------------------------------------------------

export interface AdminDeviceEntry {
  id: string;
  fcmToken?: string;
  deviceName: string;
  platform: string;
  lastSeen: number;
}

/** Saves/refreshes this phone under admins/{uid}/devices/{deviceId}. */
export async function registerAdminDevice(
  deviceId: string,
  info: { deviceName: string; platform: string; fcmToken?: string }
): Promise<void> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) throw new Error('NOT_SIGNED_IN');
  const data: Record<string, unknown> = {
    deviceName: info.deviceName,
    platform: info.platform,
    lastSeen: Date.now(),
  };
  if (info.fcmToken) data.fcmToken = info.fcmToken;
  await update(ref(getRTDB(), `admins/${uid}/devices/${deviceId}`), data);
}

export async function removeAdminDevice(deviceId: string): Promise<void> {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return;
  await remove(ref(getRTDB(), `admins/${uid}/devices/${deviceId}`));
}

export function subscribeToAdminDevices(onUpdate: (devices: AdminDeviceEntry[]) => void): () => void {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) {
    onUpdate([]);
    return () => {};
  }
  return onValue(
    ref(getRTDB(), `admins/${uid}/devices`),
    (snap) => {
      const val = snap.exists() ? (snap.val() as Record<string, Omit<AdminDeviceEntry, 'id'>>) : {};
      onUpdate(Object.entries(val).map(([id, d]) => ({ id, ...d })).sort((a, b) => b.lastSeen - a.lastSeen));
    },
    () => onUpdate([])
  );
}

/** Fires with false when this device's entry has been removed (so the app can sign out). */
export function subscribeToMyDevice(deviceId: string, onExists: (exists: boolean) => void): () => void {
  const uid = getFirebaseAuth().currentUser?.uid;
  if (!uid) return () => {};
  return onValue(ref(getRTDB(), `admins/${uid}/devices/${deviceId}`), (snap) => onExists(snap.exists()), () => {});
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
