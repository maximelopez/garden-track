/**
 * Accès aux données de l'app.
 *
 * Pour l'instant, les fonctions "fetch…" renvoient les données fictives (mock)
 * avec un petit délai pour simuler le réseau.
 * À l'étape 5, on remplacera uniquement leur contenu par de vrais appels à l'API :
 * les hooks et les écrans ne changeront pas.
 */
import { useQuery } from '@tanstack/react-query';

import { mockPhotos, mockSpecies } from '@/data/mock';
import type { Photo, Species } from '@/types';

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ---------- Fonctions d'accès aux données (à remplacer par l'API à l'étape 5) ----------

async function fetchSpeciesList(): Promise<Species[]> {
  await wait(400);
  return mockSpecies;
}

async function fetchSpecies(slug: string): Promise<Species> {
  await wait(300);
  const species = mockSpecies.find((s) => s.slug === slug);
  if (!species) throw new Error('Espèce introuvable');
  return species;
}

async function fetchSpeciesPhotos(slug: string): Promise<Photo[]> {
  await wait(400);
  return mockPhotos
    .filter((p) => p.speciesSlug === slug)
    .sort((a, b) => b.takenAt.localeCompare(a.takenAt)); // plus récentes d'abord
}

async function fetchLatestPhoto(): Promise<Photo | null> {
  await wait(300);
  const sorted = [...mockPhotos].sort((a, b) => b.takenAt.localeCompare(a.takenAt));
  return sorted[0] ?? null;
}

async function fetchPhoto(id: string): Promise<Photo> {
  await wait(200);
  const photo = mockPhotos.find((p) => p.id === id);
  if (!photo) throw new Error('Photo introuvable');
  return photo;
}

// ---------- Hooks utilisés par les écrans ----------

/** Liste de toutes les espèces (écran d'accueil) */
export function useSpeciesList() {
  return useQuery({ queryKey: ['species'], queryFn: fetchSpeciesList });
}

/** Une espèce (fiche animal) */
export function useSpecies(slug: string) {
  return useQuery({ queryKey: ['species', slug], queryFn: () => fetchSpecies(slug) });
}

/** Les photos d'une espèce (galerie de la fiche animal) */
export function useSpeciesPhotos(slug: string) {
  return useQuery({
    queryKey: ['species', slug, 'photos'],
    queryFn: () => fetchSpeciesPhotos(slug),
  });
}

/** La dernière photo prise par le capteur, toutes espèces confondues (accueil) */
export function useLatestPhoto() {
  return useQuery({ queryKey: ['photos', 'latest'], queryFn: fetchLatestPhoto });
}

/** Une photo (plein écran) */
export function usePhoto(id: string) {
  return useQuery({ queryKey: ['photo', id], queryFn: () => fetchPhoto(id) });
}
