import React from 'react';

export interface EmptyStateProps {
  size?: number;
  title: string;
  subtitle?: string;
  actionText?: string;
  onAction?: () => void;
}

export const EmptyCartIllustration: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="54" fill="#1E191C" stroke="rgba(201, 163, 41, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M30 40h12l8 40h42l6-28H48" stroke="#B5A697" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="54" cy="90" r="5" fill="#C9A329" />
    <circle cx="86" cy="90" r="5" fill="#C9A329" />
    {/* Sparkling dust / floating bubbles */}
    <circle cx="70" cy="46" r="3" fill="#8C1438" />
    <circle cx="62" cy="56" r="2" fill="#FCEBA4" />
    <path d="M78 32l2 4 4 2-4 2-2 4-2-4-4-2 4-2 2-4z" fill="#C9A329" />
  </svg>
);

export const EmptyOrdersIllustration: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="54" fill="#1E191C" stroke="rgba(201, 163, 41, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
    <rect x="40" y="32" width="40" height="56" rx="4" fill="#151113" stroke="#C9A329" strokeWidth="2" />
    <path d="M50 46h20M50 56h20M50 66h12" stroke="#B5A697" strokeWidth="2" strokeLinecap="round" />
    <circle cx="72" cy="74" r="14" fill="#8C1438" stroke="#FCEBA4" strokeWidth="2" />
    <path d="M68 74l3 3 6-6" stroke="#FCFAF8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const EmptySearchIllustration: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="54" fill="#1E191C" stroke="rgba(201, 163, 41, 0.25)" strokeWidth="2" strokeDasharray="4 4" />
    <circle cx="54" cy="54" r="20" stroke="#C9A329" strokeWidth="3" fill="#151113" />
    <path d="M68 68l18 18" stroke="#C9A329" strokeWidth="4" strokeLinecap="round" />
    <path d="M48 50a6 6 0 016-6" stroke="#FCEBA4" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const OfflineIllustration: React.FC<{ size?: number }> = ({ size = 120 }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="54" fill="#1E191C" stroke="rgba(220, 38, 38, 0.3)" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M36 46a36 36 0 0148 0M44 56a22 22 0 0132 0M52 68a10 10 0 0116 0" stroke="#DC2626" strokeWidth="3" strokeLinecap="round" />
    <circle cx="60" cy="78" r="3" fill="#DC2626" />
    <path d="M32 32l56 56" stroke="#FCFAF8" strokeWidth="3" strokeLinecap="round" />
  </svg>
);

export const EmptyState: React.FC<EmptyStateProps & { type: 'cart' | 'orders' | 'search' | 'offline' }> = ({
  type,
  size = 120,
  title,
  subtitle,
  actionText,
  onAction,
}) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 24px',
      textAlign: 'center',
    }}>
      <div style={{ marginBottom: '20px' }}>
        {type === 'cart' && <EmptyCartIllustration size={size} />}
        {type === 'orders' && <EmptyOrdersIllustration size={size} />}
        {type === 'search' && <EmptySearchIllustration size={size} />}
        {type === 'offline' && <OfflineIllustration size={size} />}
      </div>
      <h3 style={{
        fontSize: '18px',
        fontWeight: 700,
        color: '#FCFAF8',
        margin: '0 0 8px',
      }}>
        {title}
      </h3>
      {subtitle && (
        <p style={{
          fontSize: '13px',
          color: '#B5A697',
          lineHeight: 1.5,
          maxWidth: '280px',
          margin: '0 0 20px',
        }}>
          {subtitle}
        </p>
      )}
      {actionText && onAction && (
        <button
          onClick={onAction}
          style={{
            padding: '12px 24px',
            backgroundColor: '#8C1438',
            color: '#FCFAF8',
            border: '1.5px solid #C9A329',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(140, 20, 56, 0.4)',
          }}
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
