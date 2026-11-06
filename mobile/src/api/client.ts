import { API_URL } from '@/config/env';

/**
 * Délai max d'une requête. Il est long exprès : sur l'offre gratuite de Render,
 * l'API se met en veille et la première requête peut prendre ~1 minute.
 */
const TIMEOUT_MS = 70_000;

/** Erreur renvoyée par l'API (404, 500…) ou problème réseau. */
export class ApiError extends Error {
  status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.status = status;
  }
}

/** Appelle l'API en GET et renvoie le JSON typé. */
export async function apiGet<T>(path: string): Promise<T> {
  // annule la requête si elle dépasse TIMEOUT_MS
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let response: Response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch {
    throw new ApiError('Impossible de joindre le serveur. Vérifie ta connexion.');
  } finally {
    clearTimeout(timer);
  }

  if (!response.ok) {
    // l'API renvoie toujours { error: "..." } en cas d'erreur
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new ApiError(body?.error ?? `Erreur ${response.status}`, response.status);
  }

  return (await response.json()) as T;
}
