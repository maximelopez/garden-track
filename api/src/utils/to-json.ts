/**
 * Options toJSON communes aux modèles :
 * transforme "_id" en "id" (string) et retire "__v",
 * pour renvoyer au mobile des objets propres.
 */
export const toJSONOptions = {
  virtuals: true,
  versionKey: false,
  transform: (_doc: unknown, ret: Record<string, unknown>) => {
    delete ret._id;
    return ret;
  },
};
