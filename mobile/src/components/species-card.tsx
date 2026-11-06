import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SpeciesIllustration } from '@/components/species-illustration';
import { FontSize, Fonts, getSpeciesColor, Radius, Spacing } from '@/constants/theme';
import { useScheme, useTheme } from '@/hooks/use-theme';
import type { Species } from '@/types';
import { formatRelative } from '@/utils/format';

type Props = {
  species: Species;
  width: number;
};

/**
 * Carte d'une espèce dans la grille des animaux.
 * - Espèce déjà photographiée : en couleur, nombre de photos + date de dernière visite.
 * - Espèce jamais observée : grisée, avec "Jamais observé".
 */
export function SpeciesCard({ species, width }: Props) {
  const colors = useTheme();
  const scheme = useScheme();
  const router = useRouter();
  const discovered = species.photoCount > 0;

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/animal/[slug]', params: { slug: species.slug } })}
      style={({ pressed }) => [
        styles.card,
        {
          width,
          backgroundColor: colors.surface,
          boxShadow: colors.shadow,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
      ]}
    >
      <View
        style={[
          styles.illustration,
          {
            backgroundColor: discovered
              ? getSpeciesColor(species.slug, scheme)
              : colors.locked,
          },
        ]}
      >
        <Text style={[styles.number, { color: colors.textMuted }]}>
          #{String(species.number).padStart(3, '0')}
        </Text>
        {/* nombre de photos (seulement si l'animal a déjà été observé) */}
        {discovered && (
          <View style={[styles.countBadge, { backgroundColor: colors.surface }]}>
            <Text style={[styles.countText, { color: colors.text }]}>📷 {species.photoCount}</Text>
          </View>
        )}
        {/* illustration grisée si l'animal n'a jamais été observé */}
        <SpeciesIllustration species={species} size={width * 0.55} dimmed={!discovered} />
      </View>

      <View style={styles.info}>
        <Text
          style={[styles.name, { color: discovered ? colors.text : colors.textMuted }]}
          numberOfLines={1}
        >
          {species.name}
        </Text>
        <Text style={[styles.meta, { color: discovered ? colors.accent : colors.textMuted }]}>
          {discovered && species.lastSeenAt
            ? lastSeenLabel(species.lastSeenAt)
            : 'Jamais observé'}
        </Text>
      </View>
    </Pressable>
  );
}

/** "Vu il y a 2 h", "Vu hier", ou "Vu le 6 octobre 2026" si c'est ancien */
function lastSeenLabel(iso: string) {
  const relative = formatRelative(iso);
  return /^\d/.test(relative) ? `Vu le ${relative}` : `Vu ${relative}`;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.sm,
  },
  illustration: {
    aspectRatio: 1,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  number: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm + 2,
    fontFamily: Fonts.semibold,
    fontSize: FontSize.caption,
    fontVariant: ['tabular-nums'],
  },
  countBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  countText: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.caption - 1,
    fontVariant: ['tabular-nums'],
  },
  info: {
    paddingHorizontal: Spacing.xs,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.xs,
    gap: 2,
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.subtitle,
  },
  meta: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.caption,
  },
});
