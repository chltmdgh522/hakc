// 환경 설정 관리

interface Config {
  api: {
    baseUrl: string;
    timeout: number;
    retryAttempts: number;
  };
  game: {
    maxQuestions: number;
    timeLimit: number;
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  ui: {
    animationDuration: number;
    transitionDuration: number;
    maxWidth: number;
    mobileBreakpoint: number;
  };
  analytics: {
    enabled: boolean;
    trackingId?: string;
  };
}

// 개발 환경 설정
const developmentConfig: Config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://flow.madras.p-e.kr/api',
    timeout: 5000,
    retryAttempts: 3,
  },
  game: {
    maxQuestions: 10,
    timeLimit: 300, // 5분
    soundEnabled: true,
    vibrationEnabled: true,
  },
  ui: {
    animationDuration: 300,
    transitionDuration: 200,
    maxWidth: 375,
    mobileBreakpoint: 768,
  },
  analytics: {
    enabled: false,
  },
};

// 프로덕션 환경 설정
const productionConfig: Config = {
  api: {
    baseUrl: import.meta.env.VITE_API_URL || 'https://flow.madras.p-e.kr/api',
    timeout: 10000,
    retryAttempts: 5,
  },
  game: {
    maxQuestions: 15,
    timeLimit: 600, // 10분
    soundEnabled: true,
    vibrationEnabled: true,
  },
  ui: {
    animationDuration: 300,
    transitionDuration: 200,
    maxWidth: 375,
    mobileBreakpoint: 768,
  },
  analytics: {
    enabled: true,
    trackingId: import.meta.env.VITE_ANALYTICS_ID,
  },
};

// 환경에 따른 설정 선택
const config: Config = import.meta.env.PROD ? productionConfig : developmentConfig;

export default config;

// 설정 유틸리티 함수들
export const getApiConfig = () => config.api;
export const getGameConfig = () => config.game;
export const getUIConfig = () => config.ui;
export const getAnalyticsConfig = () => config.analytics;

// 환경 확인 함수들
export const isDevelopment = () => import.meta.env.DEV;
export const isProduction = () => import.meta.env.PROD;
export const isTest = () => import.meta.env.MODE === 'test'; 