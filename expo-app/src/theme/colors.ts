// ============================================================================
// NIVVO DESIGN SYSTEM - COLOR PALETTE & TOKENS
// ============================================================================

export interface ColorTheme {
  primary: string;         // Forest green #1F4230
  accent: string;          // Lime #C6F432
  background: string;      // #F4F5EE (light) / #0F1712 (dark)
  card: string;            // #FFFFFF (light) / #1A261F (dark)
  cardBorder: string;      // #E2E6DA (light) / #29382E (dark)
  textPrimary: string;     // #14281C (light) / #F0F5F1 (dark)
  textSecondary: string;   // #65756B (light) / #9EB0A4 (dark)
  textMuted: string;       // #8B9C91 (light) / #728478 (dark)
  surfaceSubtle: string;   // #EBF0E6 (light) / #223228 (dark)
  surfaceElevated: string; // #F9FAF6 (light) / #202D24 (dark)
  success: string;         // #16A34A
  successLight: string;    // #E8F5E9 (light) / #1C3322 (dark)
  warning: string;         // #D97706
  warningLight: string;    // #FEF3C7 (light) / #362912 (dark)
  danger: string;          // #DC2626
  dangerLight: string;     // #FEE2E2 (light) / #3B1B1B (dark)
  overlay: string;         // rgba(15, 23, 18, 0.6)
  divider: string;         // #E7ECE1 (light) / #28372D (dark)
  isDark: boolean;
}

export const lightColors: ColorTheme = {
  primary: '#1F4230',
  accent: '#C6F432',
  background: '#F4F5EE',
  card: '#FFFFFF',
  cardBorder: '#E2E6DA',
  textPrimary: '#14281C',
  textSecondary: '#65756B',
  textMuted: '#8B9C91',
  surfaceSubtle: '#EBF0E6',
  surfaceElevated: '#F9FAF6',
  success: '#16A34A',
  successLight: '#E8F5E9',
  warning: '#D97706',
  warningLight: '#FEF3C7',
  danger: '#DC2626',
  dangerLight: '#FEE2E2',
  overlay: 'rgba(20, 40, 28, 0.65)',
  divider: '#E7ECE1',
  isDark: false
};

export const darkColors: ColorTheme = {
  primary: '#C6F432',
  accent: '#1F4230',
  background: '#0D1510',
  card: '#16231B',
  cardBorder: '#25352A',
  textPrimary: '#F2F7F4',
  textSecondary: '#9CB0A3',
  textMuted: '#6E8174',
  surfaceSubtle: '#1F2E24',
  surfaceElevated: '#1A2920',
  success: '#22C55E',
  successLight: '#142E1C',
  warning: '#F59E0B',
  warningLight: '#32230D',
  danger: '#EF4444',
  dangerLight: '#3A1818',
  overlay: 'rgba(0, 0, 0, 0.8)',
  divider: '#25352A',
  isDark: true
};
