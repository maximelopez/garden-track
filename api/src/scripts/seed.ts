/**
 * Remplit la base avec les espèces et des photos de démonstration.
 * Lancer avec : npm run seed
 *
 * ⚠️ Vide d'abord les collections "species" et "photos" !
 */
import { connectDb, disconnectDb } from '../config/db.ts';
import { Photo } from '../models/photo.ts';
import { Species } from '../models/species.ts';
import { demoPhotos, speciesSeed } from './seed-data.ts';

const NINE_HOURS = 9 * 60 * 60 * 1000;

async function seed() {
  await connectDb();

  await Promise.all([Species.deleteMany({}), Photo.deleteMany({})]);
  await Species.insertMany(speciesSeed);
  console.log(`🌱 ${speciesSeed.length} espèces insérées`);

  // une photo toutes les ~9 h en remontant dans le temps, pour chaque espèce
  const photos = demoPhotos.flatMap(([speciesSlug, count, lastTakenAt]) =>
    Array.from({ length: count }, (_, i) => {
      const seed = `${speciesSlug}-${i}`;
      return {
        speciesSlug,
        imageUrl: `https://picsum.photos/seed/${seed}/1200/900`,
        thumbnailUrl: `https://picsum.photos/seed/${seed}/300/300`,
        takenAt: new Date(new Date(lastTakenAt).getTime() - i * NINE_HOURS),
        sensorId: 'capteur-jardin-01',
      };
    }),
  );
  await Photo.insertMany(photos);
  console.log(`📷 ${photos.length} photos de démonstration insérées`);

  await disconnectDb();
}

seed().catch(async (err) => {
  console.error('❌ Échec du seed :', err);
  await disconnectDb();
  process.exit(1);
});
