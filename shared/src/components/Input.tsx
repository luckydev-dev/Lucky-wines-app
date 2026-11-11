import React, { useState } from 'react';
import { IconClose } from '../icons/CustomIcons';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  allowClear?: boolean;
  onClear?: () => void;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  allowClear = false,
  onClear,
  value,
  disabled,
  style,
  ...rest
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', width: '100%' }}>
      {label && (
        <label style={{
          fontSize: '13px',
          fontWeight: 600,
          color: error ? '#EF4444' : isFocused ? '#FCEBA4' : '#EAE2D9',
          transition: 'color 150ms ease',
        }}>
          {label}
        </label>
      )}

      <div style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#1E191C',
        borderRadius: '12px',
        border: `1.5px solid ${error ? '#EF4444' : isFocused ? '#C9A329' : 'rgba(201, 163, 41, 0.25)'}`,
        boxShadow: isFocused ? '0 0 0 3px rgba(201, 163, 41, 0.2)' : 'none',
        transition: 'border-color 150ms ease, box-shadow 150ms ease',
      }}>
        {leftIcon && (
          <div style={{ paddingLeft: '14px', color: isFocused ? '#C9A329' : '#B5A697', display: 'flex' }}>
            {leftIcon}
          </div>
        )}

        <input
          disabled={disabled}
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={{
            flex: 1,
            padding: '12px 14px',
            backgroundColor: 'transparent',
            border: 'none',
            color: '#FCFAF8',
            fontSize: '14px',
            fontFamily: 'inherit',
            outline: 'none',
            opacity: disabled ? 0.5 : 1,
            ...style,
          }}
          {...rest}
        />

        {allowClear && value && !disabled && (
          <button
            type="button"
            onClick={onClear}
            style={{
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              color: '#B5A697',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <IconClose size={16} />
          </button>
        )}
      </div>

      {(error || helperText) && (
        <span style={{
          fontSize: '11px',
          color: error ? '#EF4444' : '#B5A697',
          paddingLeft: '4px',
        }}>
          {error || helperText}
        </span>
      )}
    </div>
  );
};
