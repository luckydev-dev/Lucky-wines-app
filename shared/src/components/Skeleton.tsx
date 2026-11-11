import React from 'react';

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  borderRadius = '8px',
  style,
}) => {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #1E191C 25%, #2A2428 50%, #1E191C 75%)',
        backgroundSize: '200% 100%',
        animation: 'skeletonPulse 1.5s infinite',
        ...style,
      }}
    />
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div style={{
      backgroundColor: '#1E191C',
      borderRadius: '16px',
      border: '1px solid rgba(255, 255, 255, 0.05)',
      overflow: 'hidden',
      padding: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
    }}>
      <Skeleton height="140px" borderRadius="12px" />
      <Skeleton width="40%" height="12px" />
      <Skeleton width="90%" height="16px" />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
        <Skeleton width="50%" height="20px" />
        <Skeleton width="60px" height="32px" borderRadius="10px" />
      </div>
    </div>
  );
};

export const BannerSkeleton: React.FC = () => {
  return (
    <div style={{
      width: '100%',
      height: '160px',
      borderRadius: '18px',
      overflow: 'hidden',
      position: 'relative',
    }}>
      <Skeleton height="100%" borderRadius="18px" />
    </div>
  );
};
