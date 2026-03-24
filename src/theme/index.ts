export const colors = {
  primary: '#5B8DEF',
  primaryDark: '#3A6FD8',
  background: '#FFFFFF',
  backgroundTint: '#F5F7FA',
  text: '#111827',
  textMuted: '#6B7280',
  success: '#22C55E',
  danger: '#EF4444',
  warning: '#F59E0B',
  boardBg: '#DEB887',
  border: '#E5E7EB',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 18,
  xl: 24,
};

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  pill: 999,
};

export const typography = {
  h1: { fontSize: 22, fontWeight: '900' as const },
  h2: { fontSize: 16, fontWeight: '800' as const },
  body: { fontSize: 14, fontWeight: '600' as const },
  sub: { fontSize: 12, fontWeight: '700' as const },
};

export const shadow = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  button: {
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
};
