import React, { useState } from 'react';

export interface EmojiVectorProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  isSelected?: boolean;
  animatedOnClick?: boolean;
}

// Interactive helper that triggers a single playful spring bounce on click or on view
const useClickAnimation = (externalSelected?: boolean) => {
  const [clicked, setClicked] = useState(false);

  const triggerClick = () => {
    setClicked(true);
    setTimeout(() => setClicked(false), 450);
  };

  return { clicked, triggerClick };
};

// 1. All Categories - Bottle & Glass Duo Emoji Vector
export const EmojiAll: React.FC<EmojiVectorProps> = ({
  size = 36,
  isSelected = false,
  onClick,
  ...rest
}) => {
  const { clicked, triggerClick } = useClickAnimation(isSelected);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        triggerClick();
        onClick?.(e);
      }}
      style={{
        transform: clicked ? 'scale(1.22) rotate(4deg)' : isSelected ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      <circle cx="24" cy="24" r="22" fill="#E8F5F5" />
      {/* Bottle */}
      <rect x="13" y="10" width="8" height="4" rx="1.5" fill="#4AB7B6" />
      <path d="M15 14v4l-3 4v16a2 2 0 002 2h6a2 2 0 002-2V22l-3-4v-4h-4z" fill="#4AB7B6" />
      <rect x="13" y="24" width="8" height="8" rx="1" fill="#FFFFFF" opacity="0.9" />
      {/* Glass */}
      <path d="M26 18h12l-2 9a4 4 0 01-4 3h0a4 4 0 01-4-3L26 18z" fill="#FDAA5D" />
      <path d="M32 30v8M28 38h8" stroke="#FDAA5D" strokeWidth="2" strokeLinecap="round" />
      <circle cx="36" cy="14" r="2" fill="#EA7173" />
    </svg>
  );
};

// 2. Spirits & Whiskey - Tumbler with Ice & Amber Glow
export const EmojiWhiskey: React.FC<EmojiVectorProps> = ({
  size = 36,
  isSelected = false,
  onClick,
  ...rest
}) => {
  const { clicked, triggerClick } = useClickAnimation(isSelected);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        triggerClick();
        onClick?.(e);
      }}
      style={{
        transform: clicked ? 'scale(1.25) rotate(-6deg)' : isSelected ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      <circle cx="24" cy="24" r="22" fill="#FEF3C7" />
      {/* Heavy crystal glass tumbler */}
      <path d="M12 12h24l-3 26a3 3 0 01-3 2.5H18A3 3 0 0115 38L12 12z" fill="#B45309" fillOpacity="0.25" stroke="#D97706" strokeWidth="2" />
      {/* Amber Whiskey Liquid */}
      <path d="M14 20h20l-2.2 18a2 2 0 01-2 1.8H18.2a2 2 0 01-2-1.8L14 20z" fill="#F59E0B" />
      {/* Floating Ice Cubes */}
      <rect x="18" y="18" width="7" height="7" rx="1.5" fill="#FFFFFF" fillOpacity="0.8" transform="rotate(12 18 18)" stroke="#FEF3C7" strokeWidth="1" />
      <rect x="25" y="22" width="6" height="6" rx="1.5" fill="#FFFFFF" fillOpacity="0.7" transform="rotate(-8 25 22)" stroke="#FEF3C7" strokeWidth="1" />
      {/* Specular Glint */}
      <path d="M15 15l2 18" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
};

// 3. Beers - Frosty Mug with Foamy Head
export const EmojiBeer: React.FC<EmojiVectorProps> = ({
  size = 36,
  isSelected = false,
  onClick,
  ...rest
}) => {
  const { clicked, triggerClick } = useClickAnimation(isSelected);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        triggerClick();
        onClick?.(e);
      }}
      style={{
        transform: clicked ? 'scale(1.25) rotate(6deg)' : isSelected ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      <circle cx="24" cy="24" r="22" fill="#EFF6FF" />
      {/* Handle */}
      <path d="M28 20h7a3 3 0 013 3v10a3 3 0 01-3 3h-7" stroke="#3B82F6" strokeWidth="3" strokeLinecap="round" />
      {/* Glass Body with golden beer */}
      <rect x="13" y="16" width="17" height="22" rx="3" fill="#FBBF24" stroke="#3B82F6" strokeWidth="2" />
      {/* Carbonation bubbles */}
      <circle cx="18" cy="25" r="1" fill="#FFFFFF" />
      <circle cx="23" cy="28" r="1.2" fill="#FFFFFF" />
      <circle cx="19" cy="33" r="1" fill="#FFFFFF" />
      {/* Creamy Foam Head */}
      <path d="M11 16c0-3 3-4 5-3 1.5-2.5 5-2.5 6.5 0 2-1.5 5 0 5 3H11z" fill="#FFFFFF" stroke="#DBEAFE" strokeWidth="1.5" />
    </svg>
  );
};

// 4. Wines - Elegant Red Wine Goblet
export const EmojiWine: React.FC<EmojiVectorProps> = ({
  size = 36,
  isSelected = false,
  onClick,
  ...rest
}) => {
  const { clicked, triggerClick } = useClickAnimation(isSelected);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        triggerClick();
        onClick?.(e);
      }}
      style={{
        transform: clicked ? 'scale(1.24) rotate(-5deg)' : isSelected ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      <circle cx="24" cy="24" r="22" fill="#FDF2F8" />
      {/* Bowl */}
      <path d="M14 12h20c0 9-4.5 15-10 15s-10-6-10-15z" fill="#881337" stroke="#BE185D" strokeWidth="2" />
      {/* Rich Ruby Wine Fill */}
      <path d="M15 16h18c0 6-3.8 10-9 10s-9-4-9-10z" fill="#BE123C" />
      {/* Stem & Base */}
      <path d="M24 27v11M18 38h12" stroke="#BE185D" strokeWidth="2.5" strokeLinecap="round" />
      {/* Specular Highlight */}
      <path d="M17 14c0 4 2 8 5 9" stroke="#FDA4AF" strokeWidth="1.2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
};

// 5. Vodka - Frosty Crystal Bottle with Chill
export const EmojiVodka: React.FC<EmojiVectorProps> = ({
  size = 36,
  isSelected = false,
  onClick,
  ...rest
}) => {
  const { clicked, triggerClick } = useClickAnimation(isSelected);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        triggerClick();
        onClick?.(e);
      }}
      style={{
        transform: clicked ? 'scale(1.24) rotate(5deg)' : isSelected ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      <circle cx="24" cy="24" r="22" fill="#F3E8FF" />
      {/* Bottle Cap */}
      <rect x="21" y="8" width="6" height="3" rx="1" fill="#7C3AED" />
      {/* Tall Crystalline Bottle */}
      <path d="M22 11h4v4l3 3v19a2 2 0 01-2 2H21a2 2 0 01-2-2V18l3-3v-4z" fill="#DDD6FE" stroke="#8B5CF6" strokeWidth="2" />
      {/* Pure Frosty Vodka core */}
      <rect x="21" y="22" width="6" height="12" rx="1" fill="#FFFFFF" opacity="0.8" />
      {/* Snowflake glint */}
      <path d="M33 14l-2 2m0-2l2 2" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M13 32l-2 2m0-2l2 2" stroke="#8B5CF6" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

// 6. Rum - Oak Barrel & Golden Spiced Liquor
export const EmojiRum: React.FC<EmojiVectorProps> = ({
  size = 36,
  isSelected = false,
  onClick,
  ...rest
}) => {
  const { clicked, triggerClick } = useClickAnimation(isSelected);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        triggerClick();
        onClick?.(e);
      }}
      style={{
        transform: clicked ? 'scale(1.25) rotate(-6deg)' : isSelected ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      <circle cx="24" cy="24" r="22" fill="#FFEDD5" />
      {/* Rum Barrel Cask */}
      <ellipse cx="24" cy="24" rx="13" ry="15" fill="#9A3412" stroke="#EA580C" strokeWidth="2" />
      <path d="M12 17h24M12 31h24" stroke="#FDBA74" strokeWidth="2" />
      {/* Bung hole / Spigot */}
      <circle cx="24" cy="24" r="3" fill="#FED7AA" stroke="#7C2D12" strokeWidth="1.5" />
      <path d="M24 10v2M24 36v2" stroke="#EA580C" strokeWidth="2" />
    </svg>
  );
};

// 7. Gin - Botanical Copa Goblet with Juniper & Lime
export const EmojiGin: React.FC<EmojiVectorProps> = ({
  size = 36,
  isSelected = false,
  onClick,
  ...rest
}) => {
  const { clicked, triggerClick } = useClickAnimation(isSelected);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        triggerClick();
        onClick?.(e);
      }}
      style={{
        transform: clicked ? 'scale(1.24) rotate(5deg)' : isSelected ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      <circle cx="24" cy="24" r="22" fill="#ECFDF5" />
      {/* Copa balloon bowl */}
      <circle cx="24" cy="20" r="10" fill="#A7F3D0" fillOpacity="0.4" stroke="#059669" strokeWidth="2" />
      {/* Stem & foot */}
      <path d="M24 30v9M18 39h12" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" />
      {/* Cucumber & Botanical berry */}
      <ellipse cx="22" cy="18" rx="4" ry="2" fill="#34D399" transform="rotate(-20 22 18)" />
      <circle cx="27" cy="22" r="2" fill="#065F46" />
    </svg>
  );
};

// 8. Mixers & Sodas - Fizzing Can with Carbonation
export const EmojiMixers: React.FC<EmojiVectorProps> = ({
  size = 36,
  isSelected = false,
  onClick,
  ...rest
}) => {
  const { clicked, triggerClick } = useClickAnimation(isSelected);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={(e) => {
        triggerClick();
        onClick?.(e);
      }}
      style={{
        transform: clicked ? 'scale(1.24) rotate(-4deg)' : isSelected ? 'scale(1.08)' : 'scale(1)',
        transition: 'transform 300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
        cursor: 'pointer',
      }}
      {...rest}
    >
      <circle cx="24" cy="24" r="22" fill="#FFF7ED" />
      {/* Beverage Can */}
      <rect x="16" y="14" width="16" height="24" rx="3" fill="#FDAA5D" stroke="#EA580C" strokeWidth="2" />
      <ellipse cx="24" cy="14" rx="8" ry="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
      <path d="M16 22h16M16 30h16" stroke="#FFFFFF" strokeWidth="1.5" strokeDasharray="2 2" />
      {/* Effervescence Bubbles popping up */}
      <circle cx="21" cy="9" r="1.5" fill="#FDAA5D" />
      <circle cx="26" cy="7" r="1" fill="#FDAA5D" />
      <circle cx="29" cy="10" r="1.8" fill="#FDAA5D" />
    </svg>
  );
};

// Map each category ID to its dedicated animated Emoji Vector
export const getCategoryEmoji = (categoryId: string, isSelected: boolean = false, onClick?: () => void) => {
  switch (categoryId) {
    case 'all':
      return <EmojiAll size={32} isSelected={isSelected} onClick={onClick} />;
    case 'cat_whiskey':
      return <EmojiWhiskey size={32} isSelected={isSelected} onClick={onClick} />;
    case 'cat_beer':
      return <EmojiBeer size={32} isSelected={isSelected} onClick={onClick} />;
    case 'cat_wine':
      return <EmojiWine size={32} isSelected={isSelected} onClick={onClick} />;
    case 'cat_vodka':
      return <EmojiVodka size={32} isSelected={isSelected} onClick={onClick} />;
    case 'cat_rum':
      return <EmojiRum size={32} isSelected={isSelected} onClick={onClick} />;
    case 'cat_gin':
      return <EmojiGin size={32} isSelected={isSelected} onClick={onClick} />;
    case 'cat_mixers':
      return <EmojiMixers size={32} isSelected={isSelected} onClick={onClick} />;
    default:
      return <EmojiWhiskey size={32} isSelected={isSelected} onClick={onClick} />;
  }
};

// Aliases for compatibility
export const IllustrateWhiskey = EmojiWhiskey;
export const IllustrateBeer = EmojiBeer;
export const IllustrateWine = EmojiWine;
export const IllustrateVodka = EmojiVodka;
export const IllustrateRum = EmojiRum;
export const IllustrateGin = EmojiGin;
export const IllustrateTequila = EmojiWhiskey;
export const IllustrateMixers = EmojiMixers;
export const IllustrateSnacks = EmojiMixers;

