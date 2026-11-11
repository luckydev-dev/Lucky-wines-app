export const THEME_TOKENS = {
  colors: {
    // HyperMart Teal Primary
    teal: {
      900: '#1B4747',
      800: '#235D5D',
      700: '#2C7372',
      600: '#389594',
      500: '#4AB7B6', // Brand HyperMart Teal
      400: '#6CC5C4',
      300: '#94D5D4',
      200: '#BFE7E6',
      100: '#E4F6F5',
      50: '#F2FAF9',
    },
    // HyperMart Tangerine / Orange Accent
    orange: {
      900: '#6B3805',
      700: '#A85E14',
      500: '#FDAA5D', // Brand HyperMart Tangerine
      400: '#FEB978',
      300: '#FEC997',
      200: '#FFDDBB',
      100: '#FFF0E2',
      50: '#FFF8F1',
    },
    // HyperMart Coral / Discount Tag Red
    coral: {
      500: '#EA7173',
      400: '#EE8B8C',
      100: '#FDECEC',
    },
    // Surfaces & Backgrounds (HyperMart Clean White & Soft Mint)
    surface: {
      page: '#F4F9F9',
      card: '#FFFFFF',
      subtle: '#EEF7F7',
      border: '#E2ECEC',
    },
    // Typography
    text: {
      primary: '#1E293B',
      secondary: '#64748B',
      muted: '#94A3B8',
      teal: '#4AB7B6',
      orange: '#FDAA5D',
      coral: '#EA7173',
      white: '#FFFFFF',
    },
    // Status
    status: {
      delivered: '#10B981',
      deliveredBg: '#ECFDF5',
      processing: '#3B82F6',
      processingBg: '#EFF6FF',
      pending: '#F59E0B',
      pendingBg: '#FFFBEB',
      cancelled: '#EF4444',
      cancelledBg: '#FEF2F2',
    }
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
    card: '0 4px 18px rgba(74, 183, 182, 0.08)',
    float: '0 8px 26px rgba(253, 170, 93, 0.4)',
    elevated: '0 8px 24px rgba(0, 0, 0, 0.06)',
  }
} as const;
