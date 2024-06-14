// SolicitudesDadoBaja.entity.ts
import mongoose, { Schema } from "mongoose";
import { ISolicitudesDadoBaja } from "../interfaces/ISolicitudesDadoBaja.interface";

const SolicitudesDadoBajaSchema = new Schema<ISolicitudesDadoBaja>({
  id_solicitud_baja_estado: { type: Schema.Types.ObjectId, ref: "Solicitudes_Dado_Baja_Estados", required: true },
  id_cliente: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  id_orden: { type: Schema.Types.ObjectId, ref: "Ordenes", required: true },
  id_creador: { type: Schema.Types.ObjectId, ref: "Users", required: true },
  date_created: { type: String, required: true },
  id_cambiador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  date_cambio_estado: { type: String, required: false },
  observacion_estado: { type: String, required: false },
}, { versionKey: false });

export const SolicitudesDadoBajaModel = mongoose.models.SolicitudesDadoBaja || mongoose.model<ISolicitudesDadoBaja>("Solicitudes_Dado_Baja", SolicitudesDadoBajaSchema);
