import React, { useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { IconMinus, IconPlus } from '../icons/CustomIcons';

export interface QuantityStepperProps {
  quantity: number;
  min?: number;
  max?: number;
  onChange: (newQuantity: number) => void;
  size?: 'sm' | 'md';
}

export const QuantityStepper: React.FC<QuantityStepperProps> = ({
  quantity,
  min = 0,
  max = 99,
  onChange,
  size = 'md',
}) => {
  const [animating, setAnimating] = useState(false);

  const triggerHaptic = () => {
    try {
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
    } catch {}
    setAnimating(true);
    setTimeout(() => setAnimating(false), 150);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity > min) {
      triggerHaptic();
      onChange(quantity - 1);
    }
  };

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (quantity < max) {
      triggerHaptic();
      onChange(quantity + 1);
    }
  };

  const isSm = size === 'sm';
  const btnSize = isSm ? '26px' : '32px';

  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      backgroundColor: '#2A0510',
      borderRadius: '9999px',
      border: '1.5px solid #C9A329',
      padding: '2px',
      boxShadow: '0 4px 12px rgba(140, 20, 56, 0.35)',
    }}>
      <button
        onClick={handleDecrement}
        disabled={quantity <= min}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#6E0F2B',
          color: '#FCFAF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: quantity <= min ? 'not-allowed' : 'pointer',
          opacity: quantity <= min ? 0.35 : 1,
          transition: 'transform 100ms ease',
        }}
      >
        <IconMinus size={isSm ? 14 : 16} />
      </button>

      <span style={{
        minWidth: isSm ? '24px' : '32px',
        textAlign: 'center',
        fontWeight: 700,
        fontSize: isSm ? '13px' : '15px',
        color: '#FCEBA4',
        transform: animating ? 'scale(1.2)' : 'scale(1)',
        transition: 'transform 120ms cubic-bezier(0.2, 0, 0, 1)',
      }}>
        {quantity}
      </span>

      <button
        onClick={handleIncrement}
        disabled={quantity >= max}
        style={{
          width: btnSize,
          height: btnSize,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#8C1438',
          color: '#FCFAF8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: quantity >= max ? 'not-allowed' : 'pointer',
          opacity: quantity >= max ? 0.35 : 1,
          transition: 'transform 100ms ease',
        }}
      >
        <IconPlus size={isSm ? 14 : 16} />
      </button>
    </div>
  );
};
