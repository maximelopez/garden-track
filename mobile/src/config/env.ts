/**
 * Configuration de l'app.
 *
 * L'URL de l'API vient de la variable EXPO_PUBLIC_API_URL (fichier mobile/.env).
 * Sans .env, l'app utilise l'API de production sur Render.
 * Exemple pour utiliser l'API lancée sur ton PC :
 *   EXPO_PUBLIC_API_URL=http://192.168.1.42:3000   (adresse IPv4 du PC, pas "localhost")
 */
export const API_URL = (
  process.env.EXPO_PUBLIC_API_URL ?? 'https://garden-track-api.onrender.com'
).replace(/\/$/, ''); // retire un éventuel "/" final
