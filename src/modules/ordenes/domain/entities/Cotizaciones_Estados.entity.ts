// Cotizaciones_Estados.entity.ts

import mongoose, { Schema } from "mongoose";
import { ICotizaciones_Estados } from "../interfaces/ICotizaciones_Estados.interface";

const CotizacionesEstadosSchema = new Schema<ICotizaciones_Estados>({
  estado: {
    type: String,
    required: true,
  },
}, { versionKey: false });

export const cotizacionesEstadosEntity = () => {
  return mongoose.models.Cotizaciones_Estados || mongoose.model<ICotizaciones_Estados>("Cotizaciones_Estados", CotizacionesEstadosSchema);
};
