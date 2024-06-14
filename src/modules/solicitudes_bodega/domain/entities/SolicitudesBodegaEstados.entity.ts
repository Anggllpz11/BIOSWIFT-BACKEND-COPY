// SolicitudesBodegaEstados.entity.ts
import mongoose, { Schema } from "mongoose";
import { ISolicitudesBodegaEstados } from "../interfaces/ISolicitudesBodegaEstados.interface";

let solicitudesBodegaEstadosModel: mongoose.Model<ISolicitudesBodegaEstados> | null = null;

export const SolicitudesBodegaEstadosEntity = () => {
  if (!solicitudesBodegaEstadosModel) {
    const solicitudesBodegaEstadosSchema = new mongoose.Schema<ISolicitudesBodegaEstados>(
      {
        estado: { type: String, required: true },
      },
      { versionKey: false, toJSON: { virtuals: true } }
    );

    solicitudesBodegaEstadosModel =
      mongoose.models.SolicitudesBodegaEstados ||
      mongoose.model<ISolicitudesBodegaEstados>("Solicitudes_Bodega_Estados", solicitudesBodegaEstadosSchema);
  }

  return solicitudesBodegaEstadosModel;
};
