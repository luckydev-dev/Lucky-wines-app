import React from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface ChipProps {
  label: string;
  count?: number;
  icon?: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  count,
  icon,
  isActive = false,
  onClick,
}) => {
  const handleClick = () => {
    try {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    } catch {}
    onClick?.();
  };

  return (
    <button
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 14px',
        borderRadius: '9999px',
        border: isActive ? '1.5px solid #C9A329' : '1px solid rgba(255, 255, 255, 0.12)',
        backgroundColor: isActive ? '#6E0F2B' : '#1E191C',
        color: isActive ? '#FCFAF8' : '#B5A697',
        fontSize: '13px',
        fontWeight: isActive ? 700 : 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        boxShadow: isActive ? '0 4px 12px rgba(140, 20, 56, 0.35)' : 'none',
        transition: 'all 180ms cubic-bezier(0.2, 0, 0, 1)',
      }}
    >
      {icon && <span style={{ display: 'flex' }}>{icon}</span>}
      <span>{label}</span>
      {typeof count === 'number' && (
        <span style={{
          backgroundColor: isActive ? '#C9A329' : 'rgba(255, 255, 255, 0.1)',
          color: isActive ? '#2A0510' : '#B5A697',
          padding: '1px 6px',
          borderRadius: '9999px',
          fontSize: '11px',
          fontWeight: 700,
        }}>
          {count}
        </span>
      )}
    </button>
  );
};
