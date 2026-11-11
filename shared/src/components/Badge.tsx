import React from 'react';
import { OrderStatus, PaymentStatus } from '../types';
import { getOrderStatusInfo, getPaymentStatusInfo } from '../utils/formatters';

export interface BadgeProps {
  label?: string;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  variant?: 'wine' | 'gold' | 'success' | 'warning' | 'danger' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  status,
  paymentStatus,
  variant,
  size = 'md',
}) => {
  let displayLabel = label || '';
  let color = '#FCFAF8';
  let bg = '#2A2428';
  let border = 'rgba(255, 255, 255, 0.15)';

  if (status) {
    const info = getOrderStatusInfo(status);
    displayLabel = info.label;
    color = info.color;
    bg = info.bg;
    border = `${info.color}40`;
  } else if (paymentStatus) {
    const info = getPaymentStatusInfo(paymentStatus);
    displayLabel = info.label;
    color = info.color;
    bg = info.bg;
    border = `${info.color}40`;
  } else if (variant) {
    switch (variant) {
      case 'wine':
        color = '#FCEBA4';
        bg = '#6E0F2B';
        border = '#C9A329';
        break;
      case 'gold':
        color = '#2A0510';
        bg = '#C9A329';
        border = '#FCEBA4';
        break;
      case 'success':
        color = '#15803D';
        bg = '#DCFCE7';
        border = '#86EFAC';
        break;
      case 'warning':
        color = '#B45309';
        bg = '#FEF3C7';
        border = '#FDE68A';
        break;
      case 'danger':
        color = '#B91C1C';
        bg = '#FEE2E2';
        border = '#FCA5A5';
        break;
      case 'neutral':
      default:
        color = '#B5A697';
        bg = '#1E191C';
        border = 'rgba(201, 163, 41, 0.25)';
        break;
    }
  }

  const isSm = size === 'sm';

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: isSm ? '2px 8px' : '4px 10px',
      borderRadius: '9999px',
      fontSize: isSm ? '11px' : '12px',
      fontWeight: 600,
      color,
      backgroundColor: bg,
      border: `1px solid ${border}`,
      letterSpacing: '0.3px',
      whiteSpace: 'nowrap',
    }}>
      {displayLabel}
    </span>
  );
};
