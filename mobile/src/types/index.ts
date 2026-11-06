/**
 * Types partagés de l'app. Ils correspondent à ce que renverra l'API Express.
 */

/** Une espèce du "pokédex" (chat, renard, hibou…) */
export type Species = {
  id: string;
  slug: string; // identifiant lisible utilisé dans les URL : "chat", "renard"
  name: string; // nom affiché : "Chat"
  scientificName: string; // "Felis catus"
  description: string;
  emoji: string; // illustration provisoire, en attendant de vraies illustrations
  illustrationUrl: string | null; // illustration (Cloudinary) — null tant qu'on n'en a pas
  photoCount: number; // nombre de photos prises par le capteur
  lastSeenAt: string | null; // date ISO de la dernière photo — null = jamais vu
};

/** Une photo prise par le capteur */
export type Photo = {
  id: string;
  speciesSlug: string; // à quelle espèce appartient la photo
  imageUrl: string; // image complète (Cloudinary)
  thumbnailUrl: string; // miniature pour les grilles (Cloudinary)
  takenAt: string; // date ISO de la prise de vue
  sensorId: string; // quel capteur a pris la photo
};
