/**
 * FIREBASE CONFIGURATION (LUCKY WINE & LIQUOR)
 * Connected to project: lucky-wines
 */

export interface FirebaseAppConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export const FIREBASE_CONFIG: FirebaseAppConfig = {
  apiKey: "AIzaSyCR7i2T_6uYoGoQOYZwoQFT-ssJT6mGksE",
  authDomain: "lucky-wines.firebaseapp.com",
  databaseURL: "https://lucky-wines-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "lucky-wines",
  storageBucket: "lucky-wines.firebasestorage.app",
  messagingSenderId: "1056102157974",
  appId: "1:1056102157974:android:18aebf7d21bac50198bcb7"
};

export const ADMIN_FIREBASE_CONFIG: FirebaseAppConfig = {
  ...FIREBASE_CONFIG,
  appId: "1:1056102157974:android:31213ed540b3683f98bcb7"
};

export const DEFAULT_SETTINGS = {
  shopName: "Lucky Wine & Liquor",
  isOpen: true,
  deliveryFee: 49,
  freeDeliveryAbove: 999,
  minOrder: 299,
  upiId: "luckywine@upi",
  upiPayeeName: "Lucky Wine Store",
  phone: "+91 98765 43210",
  pincodes: ["560001", "560002", "560025", "560034", "560038"],
  cutoffTime: "22:30",
  minAgeNotice: "You must be 21+ years of age to purchase alcoholic beverages as per state regulations."
};
