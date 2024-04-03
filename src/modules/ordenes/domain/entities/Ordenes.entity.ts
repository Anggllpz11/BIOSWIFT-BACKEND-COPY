import mongoose, { Schema } from "mongoose";
import { IOrden } from "../interfaces/IOrden.interface";

const EntregaSchema = new Schema({
  id_entrega: { type: Schema.Types.ObjectId, ref: "User", required: false },
  firma: { type: String, required: false },
}, { _id: false });

const RecibeSchema = new Schema({
  cedula_recibe: { type: String, required: false },
  nombre_recibe: { type: String, required: false },
  firma_recibe: { type: String, required: false },

}, { _id: false });

const OrdenSchema = new Schema<IOrden>({
  id_solicitud_servicio: { type: Schema.Types.ObjectId, ref: "SolicitudServicio", required: false },
  id_orden_estado: { type: Schema.Types.ObjectId, ref: "OrdenEstado", required: false },
  ids_visitas: [{ type: Schema.Types.ObjectId, ref: "Visita", required: false }],
  ids_orden_sub_estados: [{ type: Schema.Types.ObjectId, ref: "OrdenSubEstado", required: false }],
  id_creador: { type: Schema.Types.ObjectId, ref: "User", required: false },
  id_cerrador: { type: Schema.Types.ObjectId, ref: "User", required: false },
  ids_fallas_acciones: [{ type: Schema.Types.ObjectId, ref: "FallaAccion", required: false }],
  ids_fallas_causas: [{ type: Schema.Types.ObjectId, ref: "FallaCausa", required: false }],
  ids_falla_modos: [{ type: Schema.Types.ObjectId, ref: "FallaModo", required: false }],
  modos_fallas_ids: [{ type: Schema.Types.ObjectId, ref: "ModoFallos", required: false }],
  entrega: EntregaSchema,
  recibe: RecibeSchema,
  fecha_sub_estado: { type: String, required: false },
  creacion: { type: String, required: false },
  cierre: { type: String, required: false },
  observaciones_cierre: { type: String, required: false },
  total: { type: Number, required: false },
  solicitar_dado_baja: { type: Boolean, required: false },
}, { versionKey: false });

export const ordenesEntity = () => {
  return mongoose.models.Ordenes || mongoose.model<IOrden>("Ordenes", OrdenSchema);
};
