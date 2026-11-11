import React from 'react';

// Custom Animated HyperMart SVG Icons with embedded CSS keyframe animations

export const AnimatedBottle: React.FC<{ size?: number; color?: string; glow?: boolean }> = ({
  size = 28,
  color = '#4AB7B6',
  glow = false,
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 28 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      filter: glow ? `drop-shadow(0 0 8px ${color}80)` : 'none',
      transition: 'transform 200ms ease',
    }}
  >
    <style>{`
      @keyframes liquidSway {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-1.5px); }
      }
      .liquid-sway { animation: liquidSway 2s ease-in-out infinite; }
    `}</style>
    {/* Bottle Neck & Cap */}
    <rect x="11.5" y="2" width="5" height="3" rx="1" fill={color} />
    <path d="M12 5V8.5L9.5 11.5C9.5 11.5 9 12.5 9 14V23C9 24.1 9.9 25 11 25H17C18.1 25 19 24.1 19 23V14C19 12.5 18.5 11.5 18.5 11.5L16 8.5V5H12Z" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    {/* Liquid Fill Inside */}
    <path className="liquid-sway" d="M10.2 16C11.5 15.5 12.8 16.5 14 16C15.2 15.5 16.5 16.2 17.8 16V22C17.8 23.1 16.9 23.8 15.8 23.8H12.2C11.1 23.8 10.2 23.1 10.2 22V16Z" fill="#FDAA5D" opacity="0.85" />
    {/* Specular Highlight Line */}
    <path d="M12 11V21" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" opacity="0.6" />
  </svg>
);

export const AnimatedTruck: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#4AB7B6',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{`
      @keyframes wheelSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes truckVibe {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-0.8px); }
      }
      .truck-body { animation: truckVibe 1s ease-in-out infinite; }
      .wheel { transform-origin: center; animation: wheelSpin 1.2s linear infinite; }
    `}</style>
    <g className="truck-body">
      <rect x="2" y="5" width="13" height="11" rx="2" stroke={color} strokeWidth="1.8" />
      <path d="M15 9H18.5L21.5 12V16H15V9Z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <rect x="4" y="8" width="4" height="2" rx="0.5" fill="#FDAA5D" />
    </g>
    <circle cx="6.5" cy="17.5" r="2.5" stroke={color} strokeWidth="1.8" fill="#FFFFFF" className="wheel" />
    <circle cx="17.5" cy="17.5" r="2.5" stroke={color} strokeWidth="1.8" fill="#FFFFFF" className="wheel" />
  </svg>
);

export const AnimatedShield: React.FC<{ size?: number; color?: string }> = ({
  size = 22,
  color = '#10B981',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{`
      @keyframes shieldPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.08); }
      }
      .shield-pulse { transform-origin: center; animation: shieldPulse 2.5s ease-in-out infinite; }
    `}</style>
    <g className="shield-pulse">
      <path
        d="M12 2L4 5.5V11.5C4 16.5 7.4 21.2 12 22.5C16.6 21.2 20 16.5 20 11.5V5.5L12 2Z"
        fill="#ECFDF5"
        stroke={color}
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 12L11 14.5L15.5 9.5"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  </svg>
);

export const AnimatedSparkle: React.FC<{ size?: number; color?: string }> = ({
  size = 20,
  color = '#FDAA5D',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{`
      @keyframes sparkleSpin {
        0% { transform: rotate(0deg) scale(0.9); }
        50% { transform: rotate(90deg) scale(1.15); }
        100% { transform: rotate(180deg) scale(0.9); }
      }
      .sparkle-spin { transform-origin: center; animation: sparkleSpin 3s ease-in-out infinite; }
    `}</style>
    <path
      className="sparkle-spin"
      d="M12 2L14.2 8.8L21 11L14.2 13.2L12 20L9.8 13.2L3 11L9.8 8.8L12 2Z"
      fill={color}
    />
  </svg>
);

export const AnimatedCheckmark: React.FC<{ size?: number; color?: string }> = ({
  size = 24,
  color = '#10B981',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{`
      @keyframes checkRipple {
        0% { transform: scale(0.8); opacity: 0.5; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      .anim-check-pop { transform-origin: center; animation: checkRipple 1.8s ease-in-out infinite; }
    `}</style>
    <g className="anim-check-pop">
      <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" fill={`${color}15`} />
      <path d="M7.5 12l3 3 6-6" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export const AnimatedGlass: React.FC<{ size?: number; color?: string }> = ({
  size = 26,
  color = '#EA7173',
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <style>{`
      @keyframes glassTilt {
        0%, 100% { transform: rotate(0deg); }
        30% { transform: rotate(-4deg); }
        70% { transform: rotate(4deg); }
      }
      .anim-glass-swirl { transform-origin: 12px 20px; animation: glassTilt 2.8s ease-in-out infinite; }
    `}</style>
    <g className="anim-glass-swirl">
      <path d="M6 3h12l-2 9a4 4 0 0 1-4 3h0a4 4 0 0 1-4-3L6 3z" stroke={color} strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M12 15v6M8 21h8" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
      <path d="M8 8.5C9.5 8 11 9 12 8.5C13 8 14.5 9 16 8.5" stroke="#FDAA5D" strokeWidth="1.5" strokeLinecap="round" />
    </g>
  </svg>
);
