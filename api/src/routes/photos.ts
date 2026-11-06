import { Router } from 'express';
import { isValidObjectId } from 'mongoose';

import { HttpError } from '../middlewares/errors.ts';
import { Photo } from '../models/photo.ts';

export const photosRouter = Router();

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
