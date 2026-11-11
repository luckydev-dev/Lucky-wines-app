/**
 * UPI deep-link helpers (no payment gateway: money goes straight to the shop's UPI ID).
 *
 * IMPORTANT: a plain UPI deep link / QR code cannot tell our app whether the payment succeeded.
 * The customer taps "I have paid" and the shop owner confirms in the admin app - that
 * confirmation is the source of truth. Never mark an order paid automatically.
 */

export type UpiApp = 'generic' | 'gpay' | 'phonepe' | 'paytm';

export interface UpiPayParams {
  /** Shop UPI ID (VPA), e.g. shop@okhdfcbank */
  payeeVpa: string;
  /** Shop name shown in the UPI app */
  payeeName: string;
  /** Amount in rupees */
  amount: number;
  /** Order id, used as the transaction note and reference */
  orderId: string;
}

const SCHEME_PREFIX: Record<UpiApp, string> = {
  generic: 'upi://pay?',
  gpay: 'tez://upi/pay?',
  phonepe: 'phonepe://pay?',
  paytm: 'paytmmp://pay?',
};

export const UPI_APP_LABELS: Record<UpiApp, string> = {
  generic: 'Other UPI app',
  gpay: 'Google Pay',
  phonepe: 'PhonePe',
  paytm: 'Paytm',
};

/** Basic UPI ID check: name@bank */
export function isValidUpiId(vpa: string): boolean {
  return /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(vpa.trim());
}

/** Builds upi://pay?pa=...&pn=...&am=...&cu=INR&tn=...&tr=... with every value URL-encoded. */
export function buildUpiLink(params: UpiPayParams, app: UpiApp = 'generic'): string {
  const query = [
    ['pa', params.payeeVpa.trim()],
    ['pn', params.payeeName.trim().slice(0, 60)],
    ['am', Math.max(0, params.amount).toFixed(2)],
    ['cu', 'INR'],
    ['tn', `Order ${params.orderId}`.slice(0, 80)],
    ['tr', params.orderId],
  ]
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&');
  return SCHEME_PREFIX[app] + query;
}
