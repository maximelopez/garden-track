import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

/** Renvoie les couleurs du thème clair ou sombre selon le réglage du téléphone. */
export function useTheme() {
  const scheme = useColorScheme();
  return Colors[scheme === 'dark' ? 'dark' : 'light'];
}

/** Renvoie "light" ou "dark" selon le réglage du téléphone. */
export function useScheme(): 'light' | 'dark' {
  return useColorScheme() === 'dark' ? 'dark' : 'light';
}
