import React, { useState } from 'react';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  onClick,
  style,
  ...rest
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;
    try {
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
    } catch {}
    onClick?.(e);
  };

  const getVariantStyles = (): React.CSSProperties => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(135deg, #9C1841 0%, #6D0C29 100%)',
          color: '#FAF3E3',
          border: '1px solid rgba(196, 158, 74, 0.45)',
          boxShadow: '0 6px 20px rgba(135, 23, 59, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
        };
      case 'gold':
        return {
          background: 'linear-gradient(135deg, #D4B26F 0%, #B88E3E 100%)',
          color: '#120F13',
          border: '1px solid #FAF3E3',
          fontWeight: 700,
          boxShadow: '0 6px 20px rgba(196, 158, 74, 0.35), inset 0 1px 1px rgba(255, 255, 255, 0.3)',
        };
      case 'secondary':
        return {
          backgroundColor: '#1E1920',
          color: '#FAF3E3',
          border: '1px solid rgba(196, 158, 74, 0.35)',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
        };
      case 'danger':
        return {
          background: 'linear-gradient(135deg, #DC2626 0%, #991B1B 100%)',
          color: '#FFFFFF',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 16px rgba(220, 38, 38, 0.35)',
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          color: '#FAF3E3',
          border: '1px solid transparent',
        };
    }
  };

  const getSizeStyles = (): React.CSSProperties => {
    switch (size) {
      case 'sm':
        return { padding: '7px 14px', fontSize: '12px', borderRadius: '10px' };
      case 'lg':
        return { padding: '16px 24px', fontSize: '15px', borderRadius: '16px' };
      case 'md':
      default:
        return { padding: '11px 18px', fontSize: '14px', borderRadius: '12px' };
    }
  };

  return (
    <button
      disabled={disabled || isLoading}
      onClick={handleClick}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontWeight: 600,
        fontFamily: 'inherit',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.45 : 1,
        width: fullWidth ? '100%' : 'auto',
        transition: 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1), opacity 150ms ease, box-shadow 150ms ease',
        transform: isPressed && !disabled ? 'scale(0.96)' : 'scale(1)',
        userSelect: 'none',
        letterSpacing: '0.2px',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...style,
      }}
      {...rest}
    >
      {isLoading ? (
        <span style={{
          display: 'inline-block',
          width: '16px',
          height: '16px',
          border: '2px solid rgba(255,255,255,0.3)',
          borderTopColor: '#FAF3E3',
          borderRadius: '50%',
          animation: 'spin 0.7s linear infinite',
        }} />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
};
