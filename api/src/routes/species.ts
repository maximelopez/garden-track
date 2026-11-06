import { Router } from 'express';
import { z } from 'zod';

import { HttpError } from '../middlewares/errors.ts';
import { Photo } from '../models/photo.ts';
import { Species } from '../models/species.ts';

export const speciesRouter = Router();

/**
 * GET /species
 * Toutes les espèces, triées par numéro, avec pour chacune :
 * photoCount (nombre de photos) et lastSeenAt (date de la dernière photo).
 */
speciesRouter.get('/', async (_req, res) => {
  const species = await Species.aggregate([
    { $sort: { number: 1 } },
    {
      $lookup: {
        from: Photo.collection.name,
        localField: 'slug',
        foreignField: 'speciesSlug',
        pipeline: [{ $group: { _id: null, count: { $sum: 1 }, last: { $max: '$takenAt' } } }],
        as: 'stats',
      },
    },
    {
      $project: {
        _id: 0,
        id: { $toString: '$_id' },
        number: 1,
        slug: 1,
        name: 1,
        scientificName: 1,
        description: 1,
        emoji: 1,
        illustrationUrl: 1,
        photoCount: { $ifNull: [{ $first: '$stats.count' }, 0] },
        lastSeenAt: { $ifNull: [{ $first: '$stats.last' }, null] },
      },
    },
  ]);

  res.json(species);
});

/** GET /species/:slug — une espèce, avec ses statistiques */
speciesRouter.get('/:slug', async (req, res) => {
  const species = await Species.findOne({ slug: req.params.slug });
  if (!species) throw new HttpError(404, 'Espèce introuvable');

  const [photoCount, lastPhoto] = await Promise.all([
    Photo.countDocuments({ speciesSlug: species.slug }),
    Photo.findOne({ speciesSlug: species.slug }).sort({ takenAt: -1 }).select('takenAt'),
  ]);

  res.json({ ...species.toJSON(), photoCount, lastSeenAt: lastPhoto?.takenAt ?? null });
});

const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(30),
});

/**
 * GET /species/:slug/photos?page=1&limit=30
 * Les photos d'une espèce, de la plus récente à la plus ancienne, paginées.
 */
speciesRouter.get('/:slug/photos', async (req, res) => {
  const query = paginationSchema.safeParse(req.query);
  if (!query.success) throw new HttpError(400, 'Paramètres de pagination invalides');
  const { page, limit } = query.data;

  const exists = await Species.exists({ slug: req.params.slug });
  if (!exists) throw new HttpError(404, 'Espèce introuvable');

  const filter = { speciesSlug: req.params.slug };
  const [photos, total] = await Promise.all([
    Photo.find(filter)
      .sort({ takenAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Photo.countDocuments(filter),
  ]);

  res.json({
    data: photos,
    page,
    limit,
    total,
    hasMore: page * limit < total,
  });
});
