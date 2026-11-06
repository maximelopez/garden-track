import { z } from 'zod';

/**
 * Variables d'environnement, vérifiées au démarrage.
 * Si une variable manque, le serveur s'arrête avec un message clair
 * au lieu de planter plus tard de façon incompréhensible.
 */
const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  MONGODB_URI: z.string().startsWith('mongodb', 'MONGODB_URI doit commencer par "mongodb"'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  // Optionnel : serveurs DNS à utiliser (ex. "1.1.1.1,8.8.8.8") si la connexion
  // à Atlas échoue avec "querySrv ECONNREFUSED" (DNS de la box / du réseau qui bloque)
  DNS_SERVERS: z.string().optional(),

  // Broker MQTT (réception des photos du piège). Si MQTT_URL est absent, MQTT est désactivé.
  MQTT_URL: z.string().startsWith('mqtt', 'MQTT_URL doit commencer par "mqtt://" ou "mqtts://"').optional(),
  MQTT_USERNAME: z.string().optional(),
  MQTT_PASSWORD: z.string().optional(),
  MQTT_TOPIC: z.string().default('trackgarden/captures'),
  MQTT_CLIENT_ID: z.string().default('trackgarden-api'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variables d\'environnement invalides :');
  console.error(z.prettifyError(parsed.error));
  console.error('👉 Vérifie ton fichier api/.env (modèle : api/.env.example)');
  process.exit(1);
}

export const env = parsed.data;
