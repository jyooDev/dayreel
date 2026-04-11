export const Colors = {
  bg: '#0A0A0C',
  surface: '#16161A',
  surfaceHover: '#1E1E24',
  accent: '#E8C547',
  accentDim: 'rgba(232, 197, 71, 0.15)',
  text: '#F2F0E8',
  textMuted: '#8A8880',
  textDim: '#5A5950',
  border: 'rgba(242, 240, 232, 0.08)',
  danger: '#E85454',
  success: '#4ADE80',
} as const;

export type ColorKey = keyof typeof Colors;
