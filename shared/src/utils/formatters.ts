import { OrderStatus, PaymentStatus } from '../types';

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatOrderId(id: string): string {
  if (!id) return '';
  const clean = id.replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase();
  return `#LW-${clean}`;
}

export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) {
    return `+91 ${digits.slice(0, 5)} ${digits.slice(5)}`;
  }
  return phone;
}

export function getOrderStatusInfo(status: OrderStatus): { label: string; color: string; bg: string } {
  switch (status) {
    case 'placed':
      return { label: 'Order Placed', color: '#B45309', bg: '#FEF3C7' };
    case 'confirmed':
      return { label: 'Confirmed', color: '#1D4ED8', bg: '#DBEAFE' };
    case 'packed':
      return { label: 'Packed & Ready', color: '#6D28D9', bg: '#EDE9FE' };
    case 'out_for_delivery':
      return { label: 'Out for Delivery', color: '#0369A1', bg: '#E0F2FE' };
    case 'delivered':
      return { label: 'Delivered', color: '#15803D', bg: '#DCFCE7' };
    case 'cancelled':
      return { label: 'Cancelled', color: '#B91C1C', bg: '#FEE2E2' };
    default:
      return { label: status, color: '#4B5563', bg: '#F3F4F6' };
  }
}

export function getPaymentStatusInfo(status: PaymentStatus): { label: string; color: string; bg: string } {
  switch (status) {
    case 'pending':
      return { label: 'Pending (COD)', color: '#4B5563', bg: '#F3F4F6' };
    case 'awaiting_verification':
      return { label: 'Awaiting Payment', color: '#B45309', bg: '#FEF3C7' };
    case 'payment_submitted':
      return { label: 'Verifying UTR', color: '#1D4ED8', bg: '#DBEAFE' };
    case 'paid':
      return { label: 'Paid', color: '#15803D', bg: '#DCFCE7' };
    case 'failed':
      return { label: 'Payment Failed', color: '#B91C1C', bg: '#FEE2E2' };
    default:
      return { label: status, color: '#4B5563', bg: '#F3F4F6' };
  }
}
