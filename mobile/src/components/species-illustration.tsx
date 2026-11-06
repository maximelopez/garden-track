import { Image } from 'expo-image';
import { Text } from 'react-native';

import { speciesIllustrations } from '@/constants/illustrations';
import type { Species } from '@/types';

type Props = {
  species: Pick<Species, 'slug' | 'emoji'>;
  size: number;
  dimmed?: boolean; // grisé pour un animal jamais observé
};

/** Illustration d'une espèce (image locale, ou emoji si aucune image). */
export function SpeciesIllustration({ species, size, dimmed = false }: Props) {
  const source = speciesIllustrations[species.slug];
  const opacity = dimmed ? 0.35 : 1;

  if (!source) {
    return <Text style={{ fontSize: size * 0.8, opacity }}>{species.emoji}</Text>;
  }

  return (
    <Image source={source} style={{ width: size, height: size, opacity }} contentFit="contain" />
  );
}
