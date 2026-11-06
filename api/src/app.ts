import cors from 'cors';
import express from 'express';

import { errorHandler, notFound } from './middlewares/errors.ts';
import { photosRouter } from './routes/photos.ts';
import { speciesRouter } from './routes/species.ts';

/** Application Express (séparée de index.ts pour pouvoir la tester facilement). */
export const app = express();

app.use(cors());
app.use(express.json());

// Vérifier que l'API répond (utile aussi pour Render)
app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/species', speciesRouter);
app.use('/photos', photosRouter);

app.use(notFound);
app.use(errorHandler);
