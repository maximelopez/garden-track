/**
 * Liste officielle des espèces suivies par GardenTrack.
 * Utilisée par le seed et pour valider les corrections faites depuis l'appli (PATCH /photos/:id).
 * ⚠️ Le piège photo doit envoyer exactement ces slugs (voir CONTRAT.md).
 */
export const SPECIES_SLUGS = [
  'chat',
  'chien',
  'ecureuil',
  'herisson',
  'renard',
  'lapin',
  'mulot',
  'blaireau',
  'chevreuil',
  'chauve-souris',
  'mesange',
  'rouge-gorge',
  'pigeon-ramier',
  'hibou',
  'canard',
  'grenouille',
  'lezard',
  'tortue',
  'merle',
  'pie',
] as const;

export type SpeciesSlug = (typeof SPECIES_SLUGS)[number];
