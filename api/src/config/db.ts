import dns from 'node:dns';

import mongoose from 'mongoose';

import { env } from './env.ts';

/** Connexion à MongoDB (Atlas). */
export async function connectDb() {
  // Certains réseaux refusent les requêtes DNS "SRV" utilisées par les URI mongodb+srv://.
  // On peut alors forcer des serveurs DNS publics via DNS_SERVERS dans le .env.
  if (env.DNS_SERVERS) {
    dns.setServers(env.DNS_SERVERS.split(',').map((server) => server.trim()));
  }

  await mongoose.connect(env.MONGODB_URI);
  console.log(`✅ MongoDB connecté (base : ${mongoose.connection.name})`);
}

export async function disconnectDb() {
  await mongoose.disconnect();
}
