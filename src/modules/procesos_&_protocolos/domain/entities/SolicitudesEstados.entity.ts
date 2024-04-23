import mongoose, { Schema } from "mongoose";
import { ISolicitudesEstados } from "../../domain/interfaces/ISolicitudesEstados.interface";

let solicitudesEstadosModel: mongoose.Model<ISolicitudesEstados> | null = null;

export const SolicitudesEstadosEntity = () => {
  if (!solicitudesEstadosModel) {
    const solicitudesEstadosSchema = new mongoose.Schema<ISolicitudesEstados>(
      {
        estado: { type: String, required: true },
      },
      { versionKey: false, toJSON: { virtuals: true } }
    );

    solicitudesEstadosModel =
      mongoose.models.SolicitudesEstados ||
      mongoose.model<ISolicitudesEstados>("Solicitudes_Estados", solicitudesEstadosSchema);
  }

  return solicitudesEstadosModel;
};