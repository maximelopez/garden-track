import { useState } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useLatestPhoto, useSpeciesList } from '@/api/queries';
import { FilterChips } from '@/components/filter-chips';
import { LatestVisitorCard } from '@/components/latest-visitor-card';
import { SpeciesCard } from '@/components/species-card';
import { ErrorView, LoadingView } from '@/components/state-view';
import { FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const COLUMNS = 2;

type Filter = 'all' | 'observed' | 'never';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tous' },
  { value: 'observed', label: 'Observés' },
  { value: 'never', label: 'Jamais observés' },
];

/** "Vendredi 6 novembre" */
function todayLabel() {
  const label = new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Écran d'accueil : en-tête, dernier visiteur, statistiques et grille des animaux. */
export default function HomeScreen() {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [filter, setFilter] = useState<Filter>('all');

  const speciesQuery = useSpeciesList();
  const latestQuery = useLatestPhoto();

  // largeur d'une carte = (largeur écran - marges - espaces entre colonnes) / nb colonnes
  const cardWidth = (width - Spacing.md * 2 - Spacing.md * (COLUMNS - 1)) / COLUMNS;

  if (speciesQuery.isLoading) return <LoadingView />;
  if (speciesQuery.error || !speciesQuery.data) {
    return <ErrorView message="Impossible de charger les animaux." onRetry={speciesQuery.refetch} />;
  }

  const species = speciesQuery.data;
  const observedCount = species.filter((s) => s.photoCount > 0).length;
  const totalPhotos = species.reduce((sum, s) => sum + s.photoCount, 0);

  const visibleSpecies = species.filter((s) => {
    if (filter === 'observed') return s.photoCount > 0;
    if (filter === 'never') return s.photoCount === 0;
    return true;
  });

  const latestPhoto = latestQuery.data;
  const latestSpecies = latestPhoto
    ? species.find((s) => s.slug === latestPhoto.speciesSlug)
    : undefined;

  const refresh = () => {
    speciesQuery.refetch();
    latestQuery.refetch();
  };

  return (
    <FlatList
      data={visibleSpecies}
      keyExtractor={(item) => item.id}
      numColumns={COLUMNS}
      renderItem={({ item }) => <SpeciesCard species={item} width={cardWidth} />}
      contentContainerStyle={[
        styles.list,
        { paddingTop: insets.top + Spacing.md, paddingBottom: insets.bottom + Spacing.xl },
      ]}
      columnWrapperStyle={styles.row}
      style={{ backgroundColor: colors.background }}
      // tirer vers le bas pour rafraîchir
      refreshing={speciesQuery.isRefetching}
      onRefresh={refresh}
      ListHeaderComponent={
        <View style={styles.header}>
          {/* En-tête */}
          <View style={styles.titleBlock}>
            <Text style={[styles.brand, { color: colors.accent }]}>🌿 GardenTrack</Text>
            <Text style={[styles.title, { color: colors.text }]}>Mon jardin</Text>
            <Text style={[styles.date, { color: colors.textMuted }]}>{todayLabel()}</Text>
          </View>

          {/* Dernier visiteur */}
          {latestPhoto && <LatestVisitorCard photo={latestPhoto} species={latestSpecies} />}

          {/* Statistiques du jardin */}
          <View style={[styles.statsCard, { backgroundColor: colors.surface, boxShadow: colors.shadow }]}>
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>{observedCount}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                espèce{observedCount > 1 ? 's' : ''} observée{observedCount > 1 ? 's' : ''}
              </Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statValue, { color: colors.text }]}>{totalPhotos}</Text>
              <Text style={[styles.statLabel, { color: colors.textMuted }]}>
                photo{totalPhotos > 1 ? 's' : ''} prise{totalPhotos > 1 ? 's' : ''}
              </Text>
            </View>
          </View>

          {/* Titre de section + filtres */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Animaux du jardin</Text>
          <FilterChips options={FILTERS} value={filter} onChange={setFilter} />
        </View>
      }
      ListEmptyComponent={
        <Text style={[styles.empty, { color: colors.textMuted }]}>
          Aucun animal dans cette catégorie.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  list: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.md,
  },
  row: {
    gap: Spacing.md,
  },
  header: {
    gap: Spacing.lg - 4,
    marginBottom: Spacing.xs,
  },
  titleBlock: {
    gap: 2,
    marginTop: Spacing.sm,
  },
  brand: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.caption + 1,
    letterSpacing: 0.3,
  },
  title: {
    fontFamily: Fonts.extrabold,
    fontSize: FontSize.hero,
    letterSpacing: -0.5,
  },
  date: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.body,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    alignSelf: 'stretch',
  },
  statValue: {
    fontFamily: Fonts.extrabold,
    fontSize: FontSize.hero - 4,
  },
  statLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.caption + 1,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSize.title,
    letterSpacing: -0.3,
    marginBottom: -Spacing.sm,
  },
  empty: {
    fontFamily: Fonts.medium,
    textAlign: 'center',
    marginTop: Spacing.lg,
  },
});
