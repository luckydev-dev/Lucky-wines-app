export type PaymentMethod = 'cod' | 'upi';
export type PaymentStatus = 'pending' | 'awaiting_verification' | 'payment_submitted' | 'paid' | 'failed';
export type OrderStatus = 'placed' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface CartItem {
  productId: string;
  name: string;
  brand: string;
  price: number;
  mrp: number;
  sizeMl: number;
  image: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categoryId: string;
  sizeMl: number;
  abv: number;
  price: number;
  mrp: number;
  stock: number;
  description: string;
  images: string[];
  tags: string[];
  visible: boolean;
  featured: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Category {
  id: string;
  name: string;
  order: number;
  icon: string;
  visible: boolean;
}

export interface Banner {
  id: string;
  image: string;
  target: string;
  order: number;
  active: boolean;
  title?: string;
  subtitle?: string;
}

export interface Address {
  id: string;
  label: string; // e.g., 'Home', 'Work'
  line1: string;
  line2?: string;
  landmark?: string;
  pincode: string;
  lat?: number;
  lng?: number;
}

export interface UserProfile {
  uid: string;
  name: string;
  phone: string;
  createdAt: number;
  addresses?: Record<string, Address>;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  items: CartItem[];
  address: Address;
  subtotal: number;
  deliveryFee: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  utr?: string;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}

export interface StoreSettings {
  shopName: string;
  isOpen: boolean;
  deliveryFee: number;
  freeDeliveryAbove: number;
  minOrder: number;
  upiId: string;
  upiPayeeName: string;
  phone: string;
  pincodes: string[];
  cutoffTime: string;
  minAgeNotice: string;
}

export interface AdminUser {
  uid: string;
  name: string;
  email: string;
  createdAt: number;
}

export interface AdminDevice {
  deviceId: string;
  fcmToken: string;
  deviceName: string;
  platform: 'android' | 'ios' | 'web';
  lastSeen: number;
}
