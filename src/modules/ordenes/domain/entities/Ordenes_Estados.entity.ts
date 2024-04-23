// Ordenes_Estados.entity.ts

import mongoose, { Schema } from "mongoose";
import { IOrdenes_Estados } from "../interfaces/IOrdenes_Estados.interface";

export const ordenesEstadosEntity = () => {
  const ordenesEstadosSchema = new mongoose.Schema<IOrdenes_Estados>(
    {
      estado: {
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  return mongoose.models.Ordenes_Estados || mongoose.model<IOrdenes_Estados>("Ordenes_Estados", ordenesEstadosSchema);
};
