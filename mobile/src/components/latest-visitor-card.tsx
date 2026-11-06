import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { SpeciesIllustration } from '@/components/species-illustration';
import { FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import type { Photo, Species } from '@/types';
import { formatRelative } from '@/utils/format';

type Props = {
  photo: Photo;
  species: Species | undefined;
};

/** Grande carte "Dernier visiteur" : la photo la plus récente du capteur. */
export function LatestVisitorCard({ photo, species }: Props) {
  const colors = useTheme();
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push({ pathname: '/photo/[id]', params: { id: photo.id } })}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.surface,
          boxShadow: colors.shadow,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        },
      ]}
    >
      <Image
        source={{ uri: photo.imageUrl }}
        placeholder={{ uri: photo.thumbnailUrl }}
        style={[styles.image, { backgroundColor: colors.locked }]}
        contentFit="cover"
        transition={300}
      />

      {/* Badge posé sur la photo */}
      <View style={styles.badge}>
        <View style={[styles.dot, { backgroundColor: '#4ADE80' }]} />
        <Text style={styles.badgeText}>Dernier visiteur</Text>
      </View>

      <View style={styles.info}>
        {species ? (
          <SpeciesIllustration species={species} size={36} />
        ) : (
          <Text style={styles.emoji}>🐾</Text>
        )}
        <View style={styles.texts}>
          <Text style={[styles.name, { color: colors.text }]}>{species?.name ?? 'Inconnu'}</Text>
          <Text style={[styles.time, { color: colors.textMuted }]}>
            {formatRelative(photo.takenAt)}
          </Text>
        </View>
        <Text style={[styles.arrow, { color: colors.textMuted }]}>›</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.lg,
    padding: Spacing.sm,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: Radius.md,
  },
  badge: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontFamily: Fonts.semibold,
    fontSize: FontSize.caption,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm + 2,
    paddingBottom: Spacing.xs,
  },
  emoji: {
    fontSize: 28,
  },
  texts: {
    flex: 1,
  },
  name: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.subtitle,
  },
  time: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.caption,
  },
  arrow: {
    fontSize: 28,
    fontFamily: Fonts.regular,
  },
});
