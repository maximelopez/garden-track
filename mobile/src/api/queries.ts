/**
 * Accès aux données de l'app : hooks TanStack Query qui appellent l'API.
 * Les écrans n'utilisent que ces hooks (jamais fetch directement).
 */
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { apiGet } from '@/api/client';
import type { Paginated, Photo, Species } from '@/types';

const PHOTOS_PER_PAGE = 30;

/** Liste de toutes les espèces (écran d'accueil) */
export function useSpeciesList() {
  return useQuery({
    queryKey: ['species'],
    queryFn: () => apiGet<Species[]>('/species'),
  });
}

/** Une espèce (fiche animal) */
export function useSpecies(slug: string) {
  return useQuery({
    queryKey: ['species', slug],
    queryFn: () => apiGet<Species>(`/species/${slug}`),
  });
}

/**
 * Les photos d'une espèce, chargées page par page (pagination infinie) :
 * la page suivante est demandée quand on arrive en bas de la galerie.
 */
export function useSpeciesPhotos(slug: string) {
  return useInfiniteQuery({
    queryKey: ['species', slug, 'photos'],
    queryFn: ({ pageParam }) =>
      apiGet<Paginated<Photo>>(
        `/species/${slug}/photos?page=${pageParam}&limit=${PHOTOS_PER_PAGE}`,
      ),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
}

/** La dernière photo prise par le capteur, toutes espèces confondues (accueil) */
export function useLatestPhoto() {
  return useQuery({
    queryKey: ['photos', 'latest'],
    queryFn: () => apiGet<Photo | null>('/photos/latest'),
  });
}

/** Une photo (plein écran) */
export function usePhoto(id: string) {
  return useQuery({
    queryKey: ['photo', id],
    queryFn: () => apiGet<Photo>(`/photos/${id}`),
  });
}
