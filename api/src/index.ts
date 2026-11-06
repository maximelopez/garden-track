import { app } from './app.ts';
import { connectDb } from './config/db.ts';
import { env } from './config/env.ts';
import { startMqttSubscriber } from './mqtt/subscriber.ts';

/** Point d'entrée : connexion à MongoDB, abonnement MQTT, puis démarrage du serveur. */
async function main() {
  await connectDb();
  startMqttSubscriber(); // après MongoDB : les photos reçues peuvent être enregistrées
  app.listen(env.PORT, () => {
    console.log(`🚀 API GardenTrack sur http://localhost:${env.PORT}`);
  });
}

main().catch((err) => {
  console.error('❌ Impossible de démarrer l\'API :', err);
  process.exit(1);
});
