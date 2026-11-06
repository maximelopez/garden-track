/**
 * Liste officielle des espèces suivies par GardenTrack.
 * Utilisée par le seed et pour valider les corrections faites depuis l'appli (PATCH /photos/:id).
 * ⚠️ Le piège photo doit envoyer exactement ces slugs (voir CONTRAT.md).
 */
export const SPECIES_SLUGS = [
  // Mammifères
  'chat',
  'ecureuil',
  'herisson',
  'renard',
  'fouine',
  'lapin',
  'mulot',
  'blaireau',
  'chevreuil',
  // Oiseaux
  'merle',
  'mesange',
  'rouge-gorge',
  'moineau',
  'pie',
  'geai',
  'pic-vert',
  'pigeon-ramier',
  'tourterelle',
  'chouette',
  'canard',
  // Amphibiens et reptiles
  'grenouille',
  'lezard',
  'tortue',
] as const;

export type SpeciesSlug = (typeof SPECIES_SLUGS)[number];
