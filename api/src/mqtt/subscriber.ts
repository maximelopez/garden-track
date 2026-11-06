import mqtt from 'mqtt';
import { mongo } from 'mongoose';

import { env } from '../config/env.ts';
import { Photo } from '../models/photo.ts';

/**
 * Abonné MQTT : reçoit les captures du piège photo et les enregistre dans MongoDB.
 *
 * - Session persistante (clientId fixe + clean: false) : le broker garde les messages
 *   QoS 1 pendant que le serveur est arrêté et les livre à la reconnexion.
 * - Ne fait jamais planter le serveur : chaque message est traité dans un try/catch.
 */
export function startMqttSubscriber() {
  if (!env.MQTT_URL) {
    console.warn('⚠️  MQTT désactivé (MQTT_URL absent du .env) : aucune photo ne sera reçue.');
    return null;
  }

  const client = mqtt.connect(env.MQTT_URL, {
    clientId: env.MQTT_CLIENT_ID,
    clean: false, // session persistante
    username: env.MQTT_USERNAME,
    password: env.MQTT_PASSWORD,
    reconnectPeriod: 5000, // réessaie toutes les 5 s en cas de coupure
    connectTimeout: 30_000,
  });

  client.on('connect', (connack) => {
    console.log(
      `📡 MQTT connecté à ${new URL(env.MQTT_URL!).host}` +
        (connack.sessionPresent ? ' (session reprise)' : ' (nouvelle session)'),
    );
    client.subscribe(env.MQTT_TOPIC, { qos: 1 }, (err) => {
      if (err) console.error(`❌ MQTT : abonnement à "${env.MQTT_TOPIC}" impossible :`, err.message);
      else console.log(`📡 MQTT abonné à "${env.MQTT_TOPIC}" (QoS 1)`);
    });
  });

  client.on('reconnect', () => console.log('📡 MQTT : reconnexion…'));
  client.on('offline', () => console.warn('⚠️  MQTT hors ligne'));
  client.on('close', () => console.warn('⚠️  MQTT : connexion fermée'));
  client.on('error', (err) => console.error('❌ MQTT :', err.message));

  client.on('message', (topic, payload) => {
    void handleMessage(topic, payload);
  });

  return client;
}

/** Traite un message : JSON → Photo dans MongoDB. Ne lance jamais d'erreur. */
async function handleMessage(topic: string, payload: Buffer) {
  let message: unknown;
  try {
    message = JSON.parse(payload.toString('utf8'));
  } catch {
    console.error(`❌ MQTT [${topic}] : JSON invalide, message ignoré :`, payload.toString('utf8').slice(0, 200));
    return;
  }

  // un message doit être un objet JSON ({...}), pas un tableau ni une valeur seule
  if (typeof message !== 'object' || message === null || Array.isArray(message)) {
    console.error(`❌ MQTT [${topic}] : le message n'est pas un objet JSON, ignoré`);
    return;
  }

  try {
    const photo = await Photo.create(message as Record<string, unknown>);
    console.log(
      `📷 Photo enregistrée : ${photo.speciesSlug ?? 'animal non identifié'}` +
        (photo.confidence != null ? ` (${Math.round(photo.confidence * 100)} %)` : '') +
        ` — capteur ${photo.sensorId} — id ${photo.id}`,
    );
  } catch (err) {
    if (err instanceof mongo.MongoServerError && err.code === 11000) {
      console.warn(`↩️  MQTT [${topic}] : photo déjà enregistrée (doublon ignoré)`);
    } else if (err instanceof Error && err.name === 'ValidationError') {
      console.error(`❌ MQTT [${topic}] : message refusé (validation) : ${err.message}`);
    } else {
      console.error(`❌ MQTT [${topic}] : erreur à l'enregistrement :`, err);
    }
  }
}
