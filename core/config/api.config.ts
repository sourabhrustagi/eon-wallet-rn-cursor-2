export const API_CONFIG = {
  BASE_URL: 'https://api.eonwallet.com',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
    },
    WELCOME: {
      SLIDES: '/welcome/slides',
    },
  },
} as const;

