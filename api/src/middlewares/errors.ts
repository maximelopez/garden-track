import type { ErrorRequestHandler, RequestHandler } from 'express';

/** Erreur "propre" avec un code HTTP (404, 400…). */
export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/** Route inconnue → 404 */
export const notFound: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Route introuvable : ${req.method} ${req.originalUrl}`));
};

/** Gestionnaire d'erreurs global : renvoie toujours du JSON { error: "..." } */
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  const status = err instanceof HttpError ? err.status : 500;
  if (status === 500) console.error(err);
  res.status(status).json({
    error: status === 500 ? 'Erreur interne du serveur' : err.message,
  });
};
