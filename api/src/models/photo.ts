import { model, Schema, type InferSchemaType } from 'mongoose';

import { toJSONOptions } from '../utils/to-json.ts';

/** Une photo prise par le piège photo (reçue via MQTT). */
const photoSchema = new Schema(
  {
    // espèce détectée par l'IA ("renard"…) — null si l'animal n'a pas été identifié
    speciesSlug: { type: String, default: null, lowercase: true, trim: true },
    imageUrl: { type: String, required: true }, // image complète (Cloudinary)
    thumbnailUrl: { type: String, required: true }, // miniature (Cloudinary)
    cloudinaryPublicId: { type: String, default: null }, // identifiant de l'image sur Cloudinary
    takenAt: { type: Date, required: true }, // date de la prise de vue
    sensorId: { type: String, required: true }, // quel capteur a pris la photo
    confidence: { type: Number, min: 0, max: 1, default: null }, // confiance de la détection (IA)
  },
  { timestamps: true, toJSON: toJSONOptions },
);

// Accélère "les photos d'une espèce, de la plus récente à la plus ancienne"
photoSchema.index({ speciesSlug: 1, takenAt: -1 });
photoSchema.index({ takenAt: -1 });

// Une même image Cloudinary ne peut être enregistrée qu'une fois.
// MQTT en QoS 1 peut livrer un message en double : le doublon est alors refusé.
photoSchema.index(
  { cloudinaryPublicId: 1 },
  { unique: true, partialFilterExpression: { cloudinaryPublicId: { $type: 'string' } } },
);

export type PhotoDoc = InferSchemaType<typeof photoSchema>;

export const Photo = model('Photo', photoSchema);
