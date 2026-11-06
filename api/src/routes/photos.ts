import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod';

import { SPECIES_SLUGS } from '../constants/species.ts';
import { HttpError } from '../middlewares/errors.ts';
import { Photo } from '../models/photo.ts';

export const photosRouter = Router();

const listQuerySchema = z.object({
  // "renard", ou "null" pour les animaux non identifiés
  speciesSlug: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

/**
 * GET /photos?speciesSlug=renard&page=1&limit=30
 * Historique des photos, de la plus récente à la plus ancienne.
 * speciesSlug=null → uniquement les animaux non identifiés.
 */
photosRouter.get('/', async (req, res) => {
  const query = listQuerySchema.safeParse(req.query);
  if (!query.success) throw new HttpError(400, 'Paramètres invalides');
  const { speciesSlug, page, limit } = query.data;

  const filter =
    speciesSlug === undefined ? {} : { speciesSlug: speciesSlug === 'null' ? null : speciesSlug };

  const [photos, total] = await Promise.all([
    Photo.find(filter)
      .sort({ takenAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Photo.countDocuments(filter),
  ]);

  res.json({ data: photos, page, limit, total, hasMore: page * limit < total });
});

/** GET /photos/latest — la dernière photo prise, toutes espèces confondues */
photosRouter.get('/latest', async (_req, res) => {
  const photo = await Photo.findOne().sort({ takenAt: -1 });
  res.json(photo); // null s'il n'y a encore aucune photo
});

/** GET /photos/:id — une photo */
photosRouter.get('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new HttpError(404, 'Photo introuvable');
  const photo = await Photo.findById(req.params.id);
  if (!photo) throw new HttpError(404, 'Photo introuvable');
  res.json(photo);
});

const patchBodySchema = z.object({
  speciesSlug: z.enum(SPECIES_SLUGS, {
    error: `speciesSlug doit être l'une de ces valeurs : ${SPECIES_SLUGS.join(', ')}`,
  }),
});

/**
 * PATCH /photos/:id  { "speciesSlug": "chat" }
 * Permet à l'appli d'identifier (ou corriger) l'espèce d'une photo.
 */
photosRouter.patch('/:id', async (req, res) => {
  if (!isValidObjectId(req.params.id)) throw new HttpError(404, 'Photo introuvable');

  const body = patchBodySchema.safeParse(req.body ?? {});
  if (!body.success) throw new HttpError(400, body.error.issues[0]?.message ?? 'Corps invalide');

  const photo = await Photo.findByIdAndUpdate(
    req.params.id,
    { speciesSlug: body.data.speciesSlug },
    { new: true, runValidators: true },
  );
  if (!photo) throw new HttpError(404, 'Photo introuvable');
  res.json(photo);
});
