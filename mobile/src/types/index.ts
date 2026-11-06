/**
 * Types partagés de l'app. Ils correspondent à ce que renvoie l'API Express.
 */

/** Une espèce du jardin (chat, renard, mésange…) */
export type Species = {
  id: string;
  number: number; // ordre d'affichage : #001, #002…
  slug: string; // identifiant lisible utilisé dans les URL : "renard"
  name: string; // nom affiché : "Renard roux"
  scientificName: string; // "Vulpes vulpes"
  description: string;
  emoji: string; // utilisé si aucune illustration n'est disponible
  illustrationUrl: string | null;
  photoCount: number; // nombre de photos prises par le capteur
  lastSeenAt: string | null; // date ISO de la dernière photo — null = jamais observé
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

/** Réponse paginée de l'API (ex. photos d'une espèce) */
export type Paginated<T> = {
  data: T[];
  page: number;
  limit: number;
  total: number;
  hasMore: boolean;
};
