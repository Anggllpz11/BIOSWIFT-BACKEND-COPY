// Visitas_Estados.entity.ts

import mongoose, { Schema, Document } from "mongoose";
import { IVisitas_Estados } from "../interfaces/IVisitas_Estados.interface";

export const visitasEstadosEntity = () => {
  const visitasEstadosSchema = new mongoose.Schema<IVisitas_Estados>(
    {
      estado: {
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  return mongoose.models.Visitas_Estados || mongoose.model<IVisitas_Estados>("Visitas_Estados", visitasEstadosSchema);
};
