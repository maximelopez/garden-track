import { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { FontSize, Fonts, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

/**
 * Écran de chargement (rond qui tourne au centre).
 * Si le chargement dure, on explique que le serveur se réveille
 * (l'API gratuite sur Render se met en veille après 15 min sans requête).
 */
export function LoadingView() {
  const colors = useTheme();
  const [slow, setSlow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <ActivityIndicator color={colors.accent} />
      {slow && (
        <Text style={[styles.message, { color: colors.textMuted }]}>
          Réveil du serveur…{'\n'}Cela peut prendre jusqu'à une minute.
        </Text>
      )}
    </View>
  );
}

/** Écran d'erreur avec bouton "Réessayer" */
export function ErrorView({ message, onRetry }: { message: string; onRetry?: () => void }) {
  const colors = useTheme();
  return (
    <View style={[styles.center, { backgroundColor: colors.background }]}>
      <Text style={[styles.message, { color: colors.textMuted }]}>{message}</Text>
      {onRetry && (
        <Pressable
          onPress={onRetry}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 },
          ]}
        >
          <Text style={styles.buttonText}>Réessayer</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  message: {
    fontFamily: Fonts.medium,
    fontSize: FontSize.body,
    textAlign: 'center',
  },
  button: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.full,
  },
  buttonText: {
    color: '#FFFFFF',
    fontFamily: Fonts.semibold,
    fontSize: FontSize.body,
  },
});
