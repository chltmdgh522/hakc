// 공통 스타일 상수들
export const COLORS = {
  primary: '#1e3a8a',
  secondary: '#5B93C6',
  secondaryDark: '#4a7bb8',
  background: '#f5faff',
  backgroundGradient: 'linear-gradient(135deg, #e9f8f8 0%, #e6f3ff 100%)',
  white: '#fff',
  text: '#222',
  textLight: '#1D1D1D',
  border: '#e6f3ff',
  shadow: 'rgba(91,147,198,0.10)',
  shadowDark: 'rgba(91,147,198,0.18)',
  success: '#4CAF50',
  warning: '#FFE89A',
} as const;

export const SHADOWS = {
  card: '0 8px 32px rgba(91,147,198,0.10)',
  button: '0 2px 8px rgba(91, 147, 198, 0.13)',
  buttonHover: '0 8px 24px rgba(91, 147, 198, 0.18)',
  item: '0 2px 8px rgba(91, 147, 198, 0.08)',
} as const;

export const BORDER_RADIUS = {
  card: 24,
  button: 14,
  item: 8,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
} as const;

// 공통 컴포넌트 스타일
export const COMMON_STYLES = {
  pageContainer: {
    minHeight: '100vh',
    width: '100%',
    background: COLORS.backgroundGradient,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: `${SPACING.xl}px 0`,
  },
  
  cardContainer: {
    width: 380,
    background: COLORS.white,
    borderRadius: BORDER_RADIUS.card,
    boxShadow: SHADOWS.card,
    padding: `${SPACING.xl}px 0`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    minHeight: 680,
    maxWidth: '95vw',
  },
  
  backButton: {
    position: 'absolute',
    left: SPACING.lg,
    top: SPACING.lg,
    zIndex: 2,
  },
  
  backButtonIcon: {
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  },
  
  title: {
    fontSize: 28,
    fontWeight: 900,
    color: COLORS.primary,
    letterSpacing: '-1px',
    marginBottom: 18,
    marginTop: 35,
    textShadow: '0 2px 8px #fff, 0 1px 0 #bcd',
  },
  
  divider: {
    width: '80%',
    height: 4,
    background: COLORS.border,
    borderRadius: 2,
    margin: '18px 0',
  },
  
  loadingContainer: {
    padding: 60,
    textAlign: 'center',
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  loadingText: {
    fontSize: 22,
    fontWeight: 700,
    color: COLORS.primary,
    textShadow: '0 1px 8px #fff',
  },
} as const;

// 애니메이션 설정
export const ANIMATIONS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.5 },
  },
  
  slideUp: {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6, ease: 'easeOut' },
  },
  
  slideInLeft: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.4, ease: 'easeOut' },
  },
  
  scaleHover: {
    whileHover: { scale: 1.08 },
    transition: { duration: 0.18 },
  },
  
  buttonHover: {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
  },
} as const;

// 반응형 브레이크포인트
export const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
} as const; 