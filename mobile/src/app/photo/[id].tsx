import { Image } from 'expo-image';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { usePhoto } from '@/api/queries';
import { ErrorView, LoadingView } from '@/components/state-view';
import { FontSize, Fonts, Spacing } from '@/constants/theme';
import { formatDateTime } from '@/utils/format';

/** Photo en plein écran (ouverte en modale depuis la galerie). */
export default function PhotoScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: photo, isLoading, error, refetch } = usePhoto(id);

  if (isLoading) return <LoadingView />;
  if (error || !photo) {
    return <ErrorView message="Impossible de charger la photo." onRetry={refetch} />;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Photo' }} />

      <Image
        source={{ uri: photo.imageUrl }}
        placeholder={{ uri: photo.thumbnailUrl }} // la miniature (déjà en cache) s'affiche en attendant
        style={styles.image}
        contentFit="contain"
        transition={200}
      />

      <View style={[styles.info, { paddingBottom: insets.bottom + Spacing.md }]}>
        <Text style={styles.date}>{formatDateTime(photo.takenAt)}</Text>
        <Text style={styles.sensor}>{photo.sensorId}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // fond noir pour mettre la photo en valeur
  },
  image: {
    flex: 1,
  },
  info: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    gap: Spacing.xs,
  },
  date: {
    color: '#FFFFFF',
    fontFamily: Fonts.semibold,
    fontSize: FontSize.body,
  },
  sensor: {
    fontFamily: Fonts.regular,
    color: '#9A9E9A',
    fontSize: FontSize.caption,
  },
});
