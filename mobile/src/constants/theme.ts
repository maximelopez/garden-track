/**
 * Thème GardenTrack : design minimaliste, une seule couleur d'accent (vert "jardin").
 * Toutes les couleurs / tailles de l'app viennent d'ici : on ne met jamais
 * de valeur "en dur" dans les écrans.
 */

export const Colors = {
  light: {
    background: '#F6F5F1', // fond de l'app (blanc cassé chaud)
    surface: '#FFFFFF', // cartes
    text: '#171A17', // texte principal
    textMuted: '#767A74', // texte secondaire (dates, compteurs)
    border: '#E7E6E0',
    accent: '#2F7D4F', // vert jardin
    accentSoft: '#E3F1E8', // fond léger vert (badges)
    locked: '#ECEBE6', // fond d'un animal pas encore vu
    shadow: '0px 4px 16px rgba(23, 26, 23, 0.06)', // ombre douce des cartes
  },
  dark: {
    background: '#0F110F',
    surface: '#1A1D1A',
    text: '#F2F2EF',
    textMuted: '#959A94',
    border: '#272B27',
    accent: '#5BBF82',
    accentSoft: '#1D3326',
    locked: '#232623',
    shadow: '0px 4px 16px rgba(0, 0, 0, 0.4)',
  },
};

export type ThemeColors = typeof Colors.light;

/**
 * Police Plus Jakarta Sans (chargée dans app/_layout.tsx).
 * Avec une police personnalisée, on choisit la graisse via la famille
 * (et pas avec fontWeight, qui ne marche pas bien sur Android).
 */
export const Fonts = {
  regular: 'PlusJakartaSans_400Regular',
  medium: 'PlusJakartaSans_500Medium',
  semibold: 'PlusJakartaSans_600SemiBold',
  bold: 'PlusJakartaSans_700Bold',
  extrabold: 'PlusJakartaSans_800ExtraBold',
};

/** Espacements (multiples de 4) */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

/** Arrondis */
export const Radius = {
  sm: 10,
  md: 18,
  lg: 24,
  full: 999,
};

/** Tailles de texte */
export const FontSize = {
  caption: 12,
  body: 15,
  subtitle: 17,
  title: 22,
  hero: 32,
};

/**
 * Couleur pastel propre à chaque espèce (fond de l'illustration).
 * En mode sombre, on l'utilise en transparence pour ne pas éblouir.
 */
const speciesColors: Record<string, string> = {
  chat: '#F7E6CC',
  chien: '#F3E4D3',
  ecureuil: '#F6DCC8',
  herisson: '#EDE0CF',
  renard: '#F9D8C4',
  lapin: '#E9E6F2',
  mulot: '#E7E7EC',
  blaireau: '#E2E3E5',
  chevreuil: '#F1E3CF',
  'chauve-souris': '#EBDDD8',
  mesange: '#FAF0C8',
  'rouge-gorge': '#F8DCE3',
  merle: '#E6E2DA',
  pie: '#E1E6EC',
  'pigeon-ramier': '#E3EAF1',
  hibou: '#EDE0D2',
  canard: '#DDEBE2',
  grenouille: '#DDF0D8',
  lezard: '#D8EFE6',
  tortue: '#DCEDDB',
};

export function getSpeciesColor(slug: string, scheme: 'light' | 'dark'): string {
  const color = speciesColors[slug] ?? '#E3F1E8';
  return scheme === 'dark' ? `${color}26` : color; // "26" = ~15 % d'opacité
}
