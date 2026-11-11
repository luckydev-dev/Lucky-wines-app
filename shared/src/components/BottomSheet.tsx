import React, { useEffect } from 'react';
import { IconClose } from '../icons/CustomIcons';

export interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export const BottomSheet: React.FC<BottomSheetProps> = ({
  isOpen,
  onClose,
  title,
  children,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    }}>
      {/* Soft Dim Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          animation: 'fadeIn 180ms ease',
        }}
      />

      {/* Sheet Content Container - Pure HyperMart White & Mint */}
      <div style={{
        position: 'relative',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: '28px',
        borderTopRightRadius: '28px',
        border: '1px solid #E8F2F2',
        borderBottom: 'none',
        maxHeight: '88vh',
        overflowY: 'auto',
        boxShadow: '0 -10px 40px rgba(74, 183, 182, 0.12)',
        animation: 'slideUp 240ms cubic-bezier(0.16, 1, 0.3, 1)',
        padding: '20px 20px',
        paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 16px))',
        color: '#1E293B',
      }}>
        {/* Drag Handle */}
        <div style={{
          width: '42px',
          height: '5px',
          backgroundColor: '#CBD5E1',
          borderRadius: '9999px',
          margin: '0 auto 16px',
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: '1px solid #F1F5F9',
        }}>
          {title && (
            <h3 style={{
              fontSize: '18px',
              fontWeight: 800,
              color: '#1E293B',
              margin: 0,
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '-0.3px',
            }}>
              {title}
            </h3>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'none',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              backgroundColor: '#F4F9F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 120ms ease',
            }}
          >
            <IconClose size={20} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
};
