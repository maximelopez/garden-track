import { model, Schema, type InferSchemaType } from 'mongoose';

import { toJSONOptions } from '../utils/to-json.ts';

/** Une photo prise par le capteur. */
const photoSchema = new Schema(
  {
    speciesSlug: { type: String, required: true, lowercase: true, trim: true }, // "renard"
    imageUrl: { type: String, required: true }, // image complète (Cloudinary)
    thumbnailUrl: { type: String, required: true }, // miniature (Cloudinary)
    cloudinaryPublicId: { type: String, default: null }, // pour supprimer / transformer l'image
    takenAt: { type: Date, required: true }, // date de la prise de vue
    sensorId: { type: String, required: true }, // quel capteur a pris la photo
    confidence: { type: Number, min: 0, max: 1, default: null }, // confiance de la détection (IA)
  },
  { timestamps: true, toJSON: toJSONOptions },
);

// Accélère "les photos d'une espèce, de la plus récente à la plus ancienne"
photoSchema.index({ speciesSlug: 1, takenAt: -1 });
photoSchema.index({ takenAt: -1 });

export type PhotoDoc = InferSchemaType<typeof photoSchema>;

export const Photo = model('Photo', photoSchema);
