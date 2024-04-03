// Fallas_Acciones.entity.ts

import mongoose, { Schema } from "mongoose";
import { IFallas_Acciones } from "../interfaces/IFallas_Acciones.interface";

export const fallasAccionesEntity = () => {
  const fallasAccionesSchema = new mongoose.Schema<IFallas_Acciones>(
    {
      title: {
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  return mongoose.models.Fallas_Acciones || mongoose.model<IFallas_Acciones>("Fallas_Acciones", fallasAccionesSchema);
};
