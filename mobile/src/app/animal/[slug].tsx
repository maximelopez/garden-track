import { Image } from 'expo-image';
import { Link, Stack, useLocalSearchParams } from 'expo-router';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { useSpecies, useSpeciesPhotos } from '@/api/queries';
import { SpeciesIllustration } from '@/components/species-illustration';
import { ErrorView, LoadingView } from '@/components/state-view';
import { FontSize, Fonts, getSpeciesColor, Radius, Spacing } from '@/constants/theme';
import { useScheme, useTheme } from '@/hooks/use-theme';
import { formatRelative } from '@/utils/format';

const COLUMNS = 3;
const GAP = Spacing.xs;

/** Fiche d'une espèce : infos + galerie des photos prises par le capteur. */
export default function AnimalScreen() {
  const colors = useTheme();
  const scheme = useScheme();
  const { width } = useWindowDimensions();
  const { slug } = useLocalSearchParams<{ slug: string }>();

  const speciesQuery = useSpecies(slug);
  const photosQuery = useSpeciesPhotos(slug);

  const thumbSize = (width - Spacing.md * 2 - GAP * (COLUMNS - 1)) / COLUMNS;

  if (speciesQuery.isLoading) return <LoadingView />;
  if (speciesQuery.error || !speciesQuery.data) {
    return <ErrorView message="Impossible de charger cet animal." onRetry={speciesQuery.refetch} />;
  }

  const species = speciesQuery.data;

  return (
    <>
      {/* titre du header = nom de l'animal */}
      <Stack.Screen options={{ title: species.name }} />

      <FlatList
        data={photosQuery.data ?? []}
        keyExtractor={(item) => item.id}
        numColumns={COLUMNS}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.list}
        columnWrapperStyle={styles.row}
        style={{ backgroundColor: colors.background }}
        refreshing={photosQuery.isRefetching}
        onRefresh={photosQuery.refetch}
        renderItem={({ item }) => (
          <Link href={{ pathname: '/photo/[id]', params: { id: item.id } }} asChild>
            <Pressable style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}>
              <Image
                source={{ uri: item.thumbnailUrl }}
                style={[
                  styles.thumb,
                  { width: thumbSize, height: thumbSize, backgroundColor: colors.locked },
                ]}
                transition={200}
              />
            </Pressable>
          </Link>
        )}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* Illustration + nom */}
            <View
              style={[
                styles.illustration,
                {
                  backgroundColor:
                    species.photoCount > 0
                      ? getSpeciesColor(species.slug, scheme)
                      : colors.locked,
                },
              ]}
            >
              <SpeciesIllustration species={species} size={110} dimmed={species.photoCount === 0} />
            </View>
            <Text style={[styles.scientific, { color: colors.textMuted }]}>
              {species.scientificName}
            </Text>

            {/* Statistiques */}
            <View style={styles.stats}>
              <Stat label="Photos" value={String(species.photoCount)} />
              <Stat
                label="Dernière visite"
                value={species.lastSeenAt ? formatRelative(species.lastSeenAt) : '—'}
              />
            </View>

            <Text style={[styles.description, { color: colors.text }]}>
              {species.description}
            </Text>

            <Text style={[styles.sectionTitle, { color: colors.text }]}>Photos</Text>
          </View>
        }
        ListEmptyComponent={
          photosQuery.isLoading ? (
            <ActivityIndicator color={colors.accent} style={styles.empty} />
          ) : (
            <Text style={[styles.empty, { color: colors.textMuted }]}>
              {species.photoCount === 0
                ? "Cet animal n'a jamais été observé dans le jardin."
                : "Aucune photo pour l'instant."}
            </Text>
          )
        }
      />
    </>
  );
}

/** Petit bloc de statistique (valeur + libellé) */
function Stat({ label, value }: { label: string; value: string }) {
  const colors = useTheme();
  return (
    <View style={[styles.stat, { backgroundColor: colors.surface, boxShadow: colors.shadow }]}>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: Spacing.md,
    gap: GAP,
  },
  row: {
    gap: GAP,
  },
  header: {
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  illustration: {
    width: 160,
    height: 160,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scientific: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.body,
        marginTop: -Spacing.sm,
  },
  stats: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignSelf: 'stretch',
  },
  stat: {
    flex: 1,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  statValue: {
    fontFamily: Fonts.extrabold,
    fontSize: FontSize.title,
  },
  statLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.caption,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: FontSize.body,
    lineHeight: 22,
    alignSelf: 'stretch',
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.title,
    alignSelf: 'stretch',
    marginTop: Spacing.sm,
  },
  thumb: {
    borderRadius: Radius.sm,
  },
  empty: {
    fontFamily: Fonts.medium,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
