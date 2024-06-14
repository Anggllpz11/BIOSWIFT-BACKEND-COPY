// SolicitudesDadoBajaEstados.entity.ts
import mongoose, { Schema } from "mongoose";
import { ISolicitudesDadoBajaEstados } from "../interfaces/ISolicitudesDadoBajaEstados.interface";

let solicitudesDadoBajaEstadosModel: mongoose.Model<ISolicitudesDadoBajaEstados> | null = null;

export const SolicitudesDadoBajaEstadosEntity = () => {
  if (!solicitudesDadoBajaEstadosModel) {
    const solicitudesDadoBajaEstadosSchema = new mongoose.Schema<ISolicitudesDadoBajaEstados>(
      {
        estado: { type: String, required: true },
      },
      { versionKey: false, toJSON: { virtuals: true } }
    );

    solicitudesDadoBajaEstadosModel =
      mongoose.models.SolicitudesDadoBajaEstados ||
      mongoose.model<ISolicitudesDadoBajaEstados>("Solicitudes_Dado_Baja_Estados", solicitudesDadoBajaEstadosSchema);
  }

  return solicitudesDadoBajaEstadosModel;
};
