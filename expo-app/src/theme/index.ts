// ============================================================================
// NIVVO DESIGN SYSTEM - THEME & TYPOGRAPHY
// ============================================================================

import { TextStyle, ViewStyle, Platform } from 'react-native';
import { lightColors, darkColors, ColorTheme } from './colors';

export const RADIUS = {
  sm: 8,
  md: 14,
  card: 20,
  pill: 999
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24
};

export const TOUCH_TARGET = 44; // Minimum 44px for one-handed outdoor usage

export const TYPOGRAPHY = {
  h1: {
    fontSize: 24,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.5,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' })
  },
  h2: {
    fontSize: 19,
    fontWeight: '800' as TextStyle['fontWeight'],
    letterSpacing: -0.3,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' })
  },
  h3: {
    fontSize: 16,
    fontWeight: '700' as TextStyle['fontWeight'],
    letterSpacing: -0.2,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' })
  },
  body: {
    fontSize: 14,
    fontWeight: '400' as TextStyle['fontWeight'],
    lineHeight: 20,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' })
  },
  bodyBold: {
    fontSize: 14,
    fontWeight: '700' as TextStyle['fontWeight'],
    lineHeight: 20,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' })
  },
  subtext: {
    fontSize: 12,
    fontWeight: '500' as TextStyle['fontWeight'],
    lineHeight: 16,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' })
  },
  caption: {
    fontSize: 11,
    fontWeight: '600' as TextStyle['fontWeight'],
    letterSpacing: 0.2,
    fontFamily: Platform.select({ ios: 'System', android: 'sans-serif' })
  },
  mono: {
    fontSize: 14,
    fontWeight: '700' as TextStyle['fontWeight'],
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' })
  }
};

export { lightColors, darkColors };
export type { ColorTheme };
