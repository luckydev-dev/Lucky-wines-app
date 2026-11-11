import React from 'react';

export interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  color?: string;
  strokeWidth?: number;
  glow?: boolean;
}

const defaultProps = {
  size: 24,
  strokeWidth: 2,
  color: 'currentColor',
};

// Base interactive SVG wrapper:
// - Plays smooth entrance animation on view (mount)
// - Plays tactile spring pop on click / tap (:active)
// - Plays subtle hover zoom (:hover)
const baseSvgStyle: React.CSSProperties = {
  cursor: 'pointer',
  userSelect: 'none',
  WebkitTapHighlightColor: 'transparent',
  transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// 1. Home - Single chimney puff & gentle entrance pop on view/click
export const IconHome: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Home"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-home { animation: homeEntrance 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes homeEntrance { 0% { transform: scale(0.85) translateY(2px); opacity: 0.7; } 100% { transform: scale(1) translateY(0); opacity: 1; } }
      .tap-anim-icon:active { transform: scale(0.86); }
    `}</style>
    <path d="M18 4v2" strokeWidth={strokeWidth * 0.8} />
    <g className="anim-on-view-home">
      <path d="M3 10.5L12 3l9 7.5" />
      <path d="M5 9v11a1 1 0 001 1h12a1 1 0 001-1V9" />
      <path d="M9 21V12h6v9" />
    </g>
  </svg>
);

// 2. Search - Lens glint & spring angle on click / view
export const IconSearch: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Search"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-search { animation: searchEntrance 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes searchEntrance { 0% { transform: rotate(-15deg) scale(0.88); } 100% { transform: rotate(0deg) scale(1); } }
      .tap-anim-icon:active { transform: scale(0.88) rotate(-8deg); }
    `}</style>
    <g className="anim-on-view-search" style={{ transformOrigin: '11px 11px' }}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" strokeWidth={strokeWidth * 1.1} />
      <path d="M8 8a4.5 4.5 0 0 1 4-1" strokeWidth={strokeWidth * 0.7} strokeOpacity="0.8" />
    </g>
  </svg>
);

// 3. Cart - Basket pop & single wheel turn on click / view
export const IconCart: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Cart"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-cart { animation: cartEntrance 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes cartEntrance { 0% { transform: translateX(-3px) scale(0.9); } 100% { transform: translateX(0) scale(1); } }
      .tap-anim-icon:active { transform: scale(0.88) translateY(1.5px); }
    `}</style>
    <g className="anim-on-view-cart">
      <path d="M2 3h3l2.4 11.2a1.5 1.5 0 001.5 1.2h8.8a1.5 1.5 0 001.5-1.2L21 6H6" />
      <circle cx="9" cy="20" r="1.5" fill={color} />
      <circle cx="17" cy="20" r="1.5" fill={color} />
    </g>
  </svg>
);

// 4. User - Head bob spring on view / click
export const IconUser: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="User"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-user { animation: userEntrance 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes userEntrance { 0% { transform: translateY(3px) scale(0.9); } 100% { transform: translateY(0) scale(1); } }
      .tap-anim-icon:active { transform: scale(0.88); }
    `}</style>
    <g className="anim-on-view-user">
      <circle cx="12" cy="7" r="4" />
      <path d="M5 21a7 7 0 0114 0" />
    </g>
  </svg>
);

// 5. Bag - Handle bounce on view / click
export const IconBag: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Bag"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-bag { animation: bagEntrance 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes bagEntrance { 0% { transform: scale(0.85); } 100% { transform: scale(1); } }
      .tap-anim-icon:active { transform: scale(0.88); }
    `}</style>
    <g className="anim-on-view-bag">
      <path d="M6 8h12l1.5 12a1.5 1.5 0 01-1.5 1.5H6a1.5 1.5 0 01-1.5-1.5L6 8z" />
      <path d="M9 8V6a3 3 0 016 0v2" />
    </g>
  </svg>
);

// 6. Bottle - Liquid fill with gentle tilt on view / click
export const IconBottle: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Bottle"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-bottle { animation: bottleEntrance 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: 12px 22px; }
      @keyframes bottleEntrance { 0% { transform: rotate(-8deg) scale(0.9); } 100% { transform: rotate(0deg) scale(1); } }
      .tap-anim-icon:active { transform: scale(0.88) rotate(5deg); }
    `}</style>
    <g className="anim-on-view-bottle">
      <path d="M10 2h4v3l2 3v13a1.5 1.5 0 01-1.5 1.5H9.5A1.5 1.5 0 018 21V8l2-3V2z" />
      <path d="M8 14h8v6a1 1 0 01-1 1H9a1 1 0 01-1-1v-6z" fill={color} fillOpacity="0.18" stroke="none" />
      <path d="M8 13h8" strokeWidth={strokeWidth * 0.9} />
      <path d="M10 2h4" strokeWidth={strokeWidth * 1.3} />
    </g>
  </svg>
);

// 7. Glass - Wine goblet with spring on view / click
export const IconGlass: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Glass"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-glass { animation: glassEntrance 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: 12px 21px; }
      @keyframes glassEntrance { 0% { transform: scale(0.85); } 100% { transform: scale(1); } }
      .tap-anim-icon:active { transform: scale(0.88) rotate(-4deg); }
    `}</style>
    <g className="anim-on-view-glass">
      <path d="M7 3h10l-2 8a3 3 0 01-3 2.5h0A3 3 0 019 11L7 3z" />
      <path d="M12 13.5V21" />
      <path d="M9 21h6" />
      <path d="M8.5 7h7" strokeWidth={strokeWidth * 0.7} strokeOpacity="0.5" />
    </g>
  </svg>
);

// 8. UPI - Digital card pulse on view / click
export const IconUPI: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="UPI"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-upi { animation: upiEntrance 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: center; }
      @keyframes upiEntrance { 0% { transform: scale(0.88); opacity: 0.7; } 100% { transform: scale(1); opacity: 1; } }
      .tap-anim-icon:active { transform: scale(0.9); }
    `}</style>
    <g className="anim-on-view-upi">
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="M8 9l4 6 4-6" />
      <path d="M12 12v3" />
    </g>
  </svg>
);

// 9. Cash - Banknote wave on view / click
export const IconCash: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Cash"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-cash { animation: cashEntrance 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: center; }
      @keyframes cashEntrance { 0% { transform: translateY(2px) scale(0.9); } 100% { transform: translateY(0) scale(1); } }
      .tap-anim-icon:active { transform: scale(0.9); }
    `}</style>
    <g className="anim-on-view-cash">
      <rect x="2" y="6" width="20" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="M6 10h.01M18 14h.01" />
    </g>
  </svg>
);

// 10. Bell - Single chime swing on view / click
export const IconBell: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Bell"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-bell { animation: bellEntrance 0.5s ease both; transform-origin: 12px 3px; }
      @keyframes bellEntrance {
        0% { transform: rotate(0deg); }
        25% { transform: rotate(14deg); }
        50% { transform: rotate(-12deg); }
        75% { transform: rotate(6deg); }
        100% { transform: rotate(0deg); }
      }
      .tap-anim-icon:active { transform: scale(0.88); }
    `}</style>
    <g className="anim-on-view-bell">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 01-3.46 0" />
    </g>
  </svg>
);

// 11. Edit - Pencil drawing on view / click
export const IconEdit: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Edit"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-pencil { animation: pencilEntrance 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes pencilEntrance { 0% { transform: translate(-2px, 2px); } 100% { transform: translate(0, 0); } }
      .tap-anim-icon:active { transform: scale(0.88); }
    `}</style>
    <path className="anim-on-view-pencil" d="M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" />
  </svg>
);

// 12. Delete - Trash lid pop on view / click
export const IconDelete: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Delete"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-trash { animation: trashEntrance 0.45s ease both; transform-origin: 3px 6px; }
      @keyframes trashEntrance { 0% { transform: rotate(-14deg); } 100% { transform: rotate(0deg); } }
      .tap-anim-icon:active { transform: scale(0.88); }
    `}</style>
    <g className="anim-on-view-trash">
      <path d="M3 6h18" />
      <path d="M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2" />
    </g>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
  </svg>
);

// 13. Plus - Spring pop on view / click
export const IconPlus: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Plus"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-plus { animation: plusEntrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: center; }
      @keyframes plusEntrance { 0% { transform: scale(0.75) rotate(-45deg); } 100% { transform: scale(1) rotate(0deg); } }
      .tap-anim-icon:active { transform: scale(0.85); }
    `}</style>
    <g className="anim-on-view-plus">
      <path d="M12 5v14M5 12h14" />
    </g>
  </svg>
);

// 14. Minus - Slide spring on view / click
export const IconMinus: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Minus"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-minus { animation: minusEntrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: center; }
      @keyframes minusEntrance { 0% { transform: scaleX(0.7); } 100% { transform: scaleX(1); } }
      .tap-anim-icon:active { transform: scale(0.85); }
    `}</style>
    <path className="anim-on-view-minus" d="M5 12h14" />
  </svg>
);

// 15. Filter - Funnel on view / click
export const IconFilter: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Filter"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M4 4h16l-6 7.5V18l-4 2v-8.5L4 4z" />
  </svg>
);

// 16. Clock - Minute hand on view / click
export const IconClock: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Clock"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-clock { animation: clockEntrance 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: 12px 12px; }
      @keyframes clockEntrance { 0% { transform: rotate(-45deg); } 100% { transform: rotate(0deg); } }
      .tap-anim-icon:active { transform: scale(0.9); }
    `}</style>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5" />
    <path className="anim-on-view-clock" d="M12 12l3.5 2" />
  </svg>
);

// 17. Location / MapPin - Pin bounce on view / click
export const IconLocation: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Location"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-pin { animation: pinDrop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      @keyframes pinDrop { 0% { transform: translateY(-5px) scale(0.88); } 100% { transform: translateY(0) scale(1); } }
      .tap-anim-icon:active { transform: scale(0.88); }
    `}</style>
    <g className="anim-on-view-pin">
      <path d="M12 21s-7-6.5-7-11.5a7 7 0 0114 0C19 14.5 12 21 12 21z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </g>
  </svg>
);

export const IconMapPin = IconLocation;

// 18. Receipt - Paper sliding print on view / click
export const IconReceipt: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Receipt"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <g>
      <path d="M4 3v18l3-1.5 3 1.5 3-1.5 3 1.5 4-2V3l-4 2-3-1.5-3 1.5-3-1.5L4 3z" />
      <path d="M8 8h8M8 12h8M8 16h5" />
    </g>
  </svg>
);

// 19. Check - Checkmark energetic bounce pop on view / click
export const IconCheck: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Check"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-check { animation: checkPop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: center; }
      @keyframes checkPop { 0% { transform: scale(0.6); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
      .tap-anim-icon:active { transform: scale(0.85); }
    `}</style>
    <path className="anim-on-view-check" d="M5 13l4 4L19 7" strokeWidth={strokeWidth * 1.1} />
  </svg>
);

// 20. Close - Rebound on view / click
export const IconClose: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Close"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-close { animation: closeEntrance 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: center; }
      @keyframes closeEntrance { 0% { transform: rotate(45deg) scale(0.8); } 100% { transform: rotate(0deg) scale(1); } }
      .tap-anim-icon:active { transform: scale(0.85); }
    `}</style>
    <g className="anim-on-view-close">
      <path d="M18 6L6 18M6 6l12 12" />
    </g>
  </svg>
);

// 21. ChevronLeft
export const IconChevronLeft: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="ChevronLeft"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M15 19l-7-7 7-7" />
  </svg>
);

// 22. ChevronRight
export const IconChevronRight: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="ChevronRight"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M9 5l7 7-7 7" />
  </svg>
);

// 23. ChevronDown
export const IconChevronDown: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="ChevronDown"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// 24. ChevronUp
export const IconChevronUp: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="ChevronUp"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M18 15l-6-6-6 6" />
  </svg>
);

// 25. Star - Twinkle on view / click
export const IconStar: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Star"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-star { animation: starPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: center; }
      @keyframes starPop { 0% { transform: scale(0.6) rotate(-20deg); } 100% { transform: scale(1) rotate(0deg); } }
      .tap-anim-icon:active { transform: scale(0.85); }
    `}</style>
    <path
      className="anim-on-view-star"
      d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
    />
  </svg>
);

// 26. Shield - Protection pulse on view / click
export const IconShield: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Shield"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M12 3s8 3 8 9c0 6-8 9-8 9s-8-3-8-9c0-6 8-9 8-9z" />
  </svg>
);

// 27. Lock - Shackle on view / click
export const IconLock: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Lock"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M8 11V7a4 4 0 018 0v4" />
    <rect x="5" y="11" width="14" height="10" rx="2" />
  </svg>
);

// 28. Phone - Ringing wobble on view / click
export const IconPhone: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Phone"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path
      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"
    />
  </svg>
);

// 29. Share
export const IconShare: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Share"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
  </svg>
);

// 30. Copy
export const IconCopy: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Copy"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
    <rect x="9" y="9" width="13" height="13" rx="2" />
  </svg>
);

// 31. Refresh - Spin on view / click
export const IconRefresh: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Refresh"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .tap-anim-icon:active g { transform: rotate(180deg); transition: transform 0.4s ease; }
    `}</style>
    <g style={{ transformOrigin: 'center' }}>
      <path d="M23 4v6h-6" />
      <path d="M1 20v-6h6" />
      <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
    </g>
  </svg>
);

// 32. Heart - Heartbeat spring on view / click
export const IconHeart: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Heart"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .anim-on-view-heart { animation: heartPop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) both; transform-origin: 12px 12px; }
      @keyframes heartPop { 0% { transform: scale(0.7); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
      .tap-anim-icon:active { transform: scale(0.85); }
    `}</style>
    <path
      className="anim-on-view-heart"
      d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
    />
  </svg>
);

// 33. AlertCircle
export const IconAlertCircle: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Alert"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v4M12 16h.01" />
  </svg>
);

// 34. Eye
export const IconEye: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Eye"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

// 35. EyeOff
export const IconEyeOff: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="EyeOff"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
    <path d="M1 1l22 22" />
  </svg>
);

// 36. Grid
export const IconGrid: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Grid"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <rect x="3" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="3" width="7" height="7" rx="1.5" />
    <rect x="14" y="14" width="7" height="7" rx="1.5" />
    <rect x="3" y="14" width="7" height="7" rx="1.5" />
  </svg>
);

// 37. Tag
export const IconTag: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Tag"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <circle cx="7" cy="7" r="1.5" fill={color} />
  </svg>
);

// 38. Sliders
export const IconSliders: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Sliders"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3" />
    <path d="M1 14h6M9 8h6M17 16h6" />
  </svg>
);

// 39. Truck
export const IconTruck: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Truck"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <rect x="1" y="3" width="15" height="13" rx="2" />
    <path d="M16 8h4l3 3v5h-7V8z" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);

// 40. Gift
export const IconGift: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Gift"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <polyline points="20 12 20 22 4 22 4 12" />
    <line x1="12" y1="22" x2="12" y2="7" />
    <rect x="2" y="7" width="20" height="5" rx="1" />
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
  </svg>
);

// 41. LogOut
export const IconLogOut: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="LogOut"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// 42. CheckCircle
export const IconCheckCircle: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="CheckCircle"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8.5 12.5l2.5 2.5 5-5" />
  </svg>
);

// 43. Info
export const IconInfo: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Info"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <circle cx="12" cy="12" r="9" />
    <line x1="12" y1="16" x2="12" y2="12" />
    <line x1="12" y1="8" x2="12.01" y2="8" strokeWidth={strokeWidth * 1.3} />
  </svg>
);

// 44. Menu
export const IconMenu: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Menu"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <line x1="3" y1="6" x2="21" y2="6" strokeWidth={strokeWidth * 1.1} />
    <line x1="3" y1="12" x2="21" y2="12" strokeWidth={strokeWidth * 1.1} />
    <line x1="3" y1="18" x2="21" y2="18" strokeWidth={strokeWidth * 1.1} />
  </svg>
);

// 45. Settings - Cog gear with smooth tap rotation
export const IconSettings: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Settings"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <style>{`
      .tap-anim-icon:active g { transform: rotate(90deg); transition: transform 0.3s ease; }
    `}</style>
    <g style={{ transformOrigin: '12px 12px' }}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </g>
  </svg>
);

// 46. Trending
export const IconTrending: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Trending"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

// 47. Sparkle
export const IconSparkle: React.FC<IconProps> = ({
  size = defaultProps.size,
  color = defaultProps.color,
  strokeWidth = defaultProps.strokeWidth,
  style,
  ...rest
}) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-label="Sparkle"
    style={{ ...baseSvgStyle, ...style }}
    className="tap-anim-icon"
    {...rest}
  >
    <path d="M12 2l2.4 7.2L22 12l-7.6 2.8L12 22l-2.4-7.2L2 12l7.6-2.8L12 2z" />
  </svg>
);
