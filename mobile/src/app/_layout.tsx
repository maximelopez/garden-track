import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/plus-jakarta-sans';
import { focusManager, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { AppState, Platform } from 'react-native';

import { Fonts } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

// On garde l'écran de démarrage affiché tant que la police n'est pas chargée
SplashScreen.preventAutoHideAsync();

// Un seul QueryClient pour toute l'app : c'est lui qui garde le cache des données.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // une donnée est considérée "fraîche" pendant 1 min
      retry: 1, // en cas d'erreur réseau, on réessaie une fois
    },
  },
});

// Quand l'app revient au premier plan, TanStack Query rafraîchit les données
// (pratique pour voir les nouvelles photos du capteur).
focusManager.setEventListener((handleFocus) => {
  if (Platform.OS === 'web') return undefined;
  const subscription = AppState.addEventListener('change', (state) => {
    handleFocus(state === 'active');
  });
  return () => subscription.remove();
});

export default function RootLayout() {
  const colors = useTheme();
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
          headerTitleStyle: { fontFamily: Fonts.bold },
          headerShadowVisible: false, // pas de ligne sous le header (minimaliste)
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Accueil : pas de barre native, on a notre propre en-tête */}
        <Stack.Screen name="index" options={{ headerShown: false, title: 'Mon jardin' }} />
        <Stack.Screen name="animal/[slug]" options={{ title: '', headerBackTitle: 'Retour' }} />
        <Stack.Screen name="photo/[id]" options={{ presentation: 'modal' }} />
      </Stack>
    </QueryClientProvider>
  );
}
