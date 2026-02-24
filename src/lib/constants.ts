export const BOOKING_CONFIG = {
  ORIGINS: {
    AIRBNB: 'airbnb_ical',
    DIRECT: 'direct',
  },
  COLORS: {
    AIRBNB: {
      BACKGROUND: '#FBCFE8', // pink-200
      TEXT: '#111827', // gray-900
    },
    DIRECT: {
      BACKGROUND: '#BBF7D0', // green-200
      TEXT: '#111827', // gray-900
    },
  },
  STATUS_LABELS: {
    AIRBNB: 'Airbnb',
    DIRECT: 'Direct',
  },
} as const;
