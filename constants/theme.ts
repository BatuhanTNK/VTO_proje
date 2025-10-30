export const Colors = {
  primary: '#8B5CF6',
  primaryDark: '#7C3AED',
  primaryLight: '#A78BFA',

  secondary: '#EC4899',
  secondaryDark: '#DB2777',
  secondaryLight: '#F472B6',

  background: '#0F172A',
  surface: '#1E293B',
  surfaceLight: '#334155',

  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textMuted: '#94A3B8',

  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',

  border: '#334155',
  borderLight: '#475569',

  white: '#FFFFFF',
  black: '#000000',

  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
};

export const Gradients = {
  primary: [Colors.primary, Colors.secondary] as const,
  primaryVertical: [Colors.primaryDark, Colors.primary] as const,
  background: ['#0F172A', '#1E293B'] as const,
  surface: ['#1E293B', '#334155'] as const,
  button: [Colors.primary, Colors.primaryDark] as const,
  overlay: ['transparent', 'rgba(0, 0, 0, 0.8)'] as const,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
  xxxl: 40,
};

export const FontWeights = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
};

export const Layout = {
  screenPadding: Spacing.lg,
  cardPadding: Spacing.md,
  buttonHeight: 56,
  inputHeight: 48,
  thumbnailSize: 150,
  iconSize: 24,
  iconSizeLarge: 48,
};
