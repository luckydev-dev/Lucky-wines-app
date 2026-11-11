/**
 * UPI payment links (no payment gateway - money goes straight to the shop's UPI ID).
 * A plain UPI link CANNOT confirm a payment automatically: the shop owner verifies it
 * in the admin app, so the customer submits the UTR after paying.
 */
export interface UpiLinkInput {
  upiId: string;
  payeeName: string;
  amount: number;
  orderId: string;
}

const enc = encodeURIComponent;

export function buildUpiQuery({ upiId, payeeName, amount, orderId }: UpiLinkInput): string {
  const pairs: Array<[string, string]> = [
    // '@' stays readable in the payee address; every other value is URL-encoded
    ['pa', enc(upiId.trim()).replace(/%40/g, '@')],
    ['pn', enc(payeeName.trim())],
    ['am', amount.toFixed(2)],
    ['cu', 'INR'],
    ['tn', enc(`Order ${orderId}`)],
    ['tr', enc(orderId)],
  ];
  return pairs.map(([k, v]) => `${k}=${v}`).join('&');
}

/** Generic link: Android shows its "Pay with" chooser. Also what the QR code encodes. */
export const upiLink = (input: UpiLinkInput) => `upi://pay?${buildUpiQuery(input)}`;
export const gpayLink = (input: UpiLinkInput) => `tez://upi/pay?${buildUpiQuery(input)}`;
export const phonePeLink = (input: UpiLinkInput) => `phonepe://pay?${buildUpiQuery(input)}`;
export const paytmLink = (input: UpiLinkInput) => `paytmmp://pay?${buildUpiQuery(input)}`;
