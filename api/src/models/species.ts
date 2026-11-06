import { model, Schema, type InferSchemaType } from 'mongoose';

import { toJSONOptions } from '../utils/to-json.ts';

/** Une espèce du jardin (chat, renard, mésange…). */
const speciesSchema = new Schema(
  {
    number: { type: Number, required: true, unique: true }, // ordre d'affichage : #001, #002…
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true }, // "renard"
    name: { type: String, required: true, trim: true }, // "Renard roux"
    scientificName: { type: String, required: true, trim: true }, // "Vulpes vulpes"
    description: { type: String, default: '' },
    emoji: { type: String, default: '🐾' },
    illustrationUrl: { type: String, default: null },
  },
  { timestamps: true, toJSON: toJSONOptions },
);

export type SpeciesDoc = InferSchemaType<typeof speciesSchema>;

export const Species = model('Species', speciesSchema);
