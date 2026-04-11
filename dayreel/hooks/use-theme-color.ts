import { Colors } from '@/constants/colors';

// DayReel is always dark — this hook is kept for scaffold compatibility only.
// Use Colors directly from @/constants/colors in new code.
export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors
): string {
  const colorFromProps = props.dark;
  return colorFromProps ?? Colors[colorName];
}
