export const THEME_TOKENS = {
  colors: {
    // Deep Burgundy / Wine Primary Palette
    wine: {
      950: '#1F040A',
      900: '#3D0717', // Rich velvet burgundy
      800: '#580A20',
      700: '#720D2B', // Classic bordeaux
      600: '#8C1438', // Brand Cabernet Red
      500: '#A81C45',
      400: '#C0345F',
      300: '#D95E83',
      200: '#EDA0B8',
      100: '#F8D5E1',
      50: '#FDF2F5',
    },
    // Warm Champagne Gold Accent Palette
    gold: {
      900: '#543806',
      800: '#7A520B',
      700: '#A16D11',
      600: '#C48615',
      500: '#D4AF37', // Brand Warm Gold
      400: '#E5C454',
      300: '#F0D87E',
      200: '#F8E8B2',
      100: '#FCF6DC',
      50: '#FEFBF2',
    },
    // Admin Store Manager Accent (Deep Bronze / Amber)
    adminAccent: {
      800: '#78350F',
      700: '#92400E',
      600: '#B45309',
      500: '#D97706',
      400: '#F59E0B',
      100: '#FEF3C7',
      50: '#FFFBEB',
    },
    // Backward-compatible aliases mapped to the wine & gold palette
    teal: {
      900: '#3D0717',
      800: '#580A20',
      700: '#720D2B',
      600: '#8C1438',
      500: '#720D2B', // Wine brand primary replaces teal
      400: '#8C1438',
      300: '#C0345F',
      200: '#EDA0B8',
      100: '#F8D5E1',
      50: '#FDF2F5',
    },
    orange: {
      900: '#543806',
      700: '#A16D11',
      500: '#D4AF37', // Gold accent replaces orange
      400: '#E5C454',
      300: '#F0D87E',
      200: '#F8E8B2',
      100: '#FCF6DC',
      50: '#FEFBF2',
    },
    coral: {
      500: '#A81C45',
      400: '#C0345F',
      100: '#FDF2F5',
    },
    // Surfaces & Backgrounds (Warm off-white and near-black dark surfaces)
    surface: {
      page: '#FDFBF9',        // Warm off-white parchment
      card: '#FFFFFF',
      subtle: '#F8F3EE',      // Soft warm cream
      border: '#EFE7E1',      // Delicate warm border
      darkPage: '#15080C',    // Near-black velvet burgundy
      darkCard: '#220D14',    // Deep burgundy card
      darkBorder: '#3B1723',  // Dark wine border
    },
    // High-contrast Typography (WCAG AA & AAA compliant)
    text: {
      primary: '#1A1114',     // Deep near-black contrast on warm white
      secondary: '#66555C',   // Refined charcoal slate
      muted: '#99858D',       // Soft muted mauve
      wine: '#720D2B',        // Burgundy link / title
      gold: '#C48615',        // Gold accent text
      white: '#FFFFFF',
      darkPrimary: '#FDF8F5',
      darkSecondary: '#D1BAC3',
      darkMuted: '#9E848F',
    },
    // Order & Payment Status
    status: {
      delivered: '#059669',
      deliveredBg: '#ECFDF5',
      processing: '#2563EB',
      processingBg: '#EFF6FF',
      pending: '#D97706',
      pendingBg: '#FEF3C7',
      cancelled: '#DC2626',
      cancelledBg: '#FEF2F2',
    },
  },
  radius: {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '22px',
    full: '9999px',
  },
  shadow: {
    card: '0 4px 18px rgba(61, 7, 23, 0.07)',
    float: '0 8px 24px rgba(212, 175, 55, 0.35)',
    elevated: '0 10px 28px rgba(31, 4, 10, 0.1)',
  },
  typography: {
    fontDisplay: "'Poppins', serif, -apple-system, BlinkMacSystemFont, sans-serif",
    fontBody: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
  },
} as const;
