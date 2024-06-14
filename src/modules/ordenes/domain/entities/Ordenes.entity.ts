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

const OrdenCambioSchema = new Schema({
  ids_orden_sub_estado: { type: Schema.Types.ObjectId, ref: "Ordenes_Sub_Estados", required: true },
  id_creador: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date_created: { type: String, required: true },
  comentario: { type: String, required: true },
}, { _id: false });

const ResultadoOrdenSchema = new Schema({
  id_fallo_sistema: { type: Schema.Types.ObjectId, ref: "Fallo_Sistemas", required: false },
  ids_modos_fallos: [{ type: Schema.Types.ObjectId, ref: "Modos_Fallos", required: false }],
  ids_causas_fallos: [{ type: Schema.Types.ObjectId, ref: "Fallas_Causas", required: false }],
  comentarios_finales: { type: String, required: false },
  solicitud_dar_baja: { type: Boolean, required: false },
  accion_ejecutada: { type: String, required: false },
}, { _id: false });

const OrdenSchema = new Schema<IOrden>({
  id_solicitud_servicio: { type: Schema.Types.ObjectId, ref: "SolicitudServicio", required: false },
  id_orden_estado: { type: Schema.Types.ObjectId, ref: "OrdenEstado", required: false },
  ids_visitas: [{ type: Schema.Types.ObjectId, ref: "Visita", required: false }],
  orden_cambios: [OrdenCambioSchema],
  resultado_orden: ResultadoOrdenSchema, 
  id_creador: { type: Schema.Types.ObjectId, ref: "User", required: false },
  id_cerrador: { type: Schema.Types.ObjectId, ref: "User", required: false },
  id_anulador: { type: Schema.Types.ObjectId, ref: "User", required: false },
  entrega: EntregaSchema,
  recibe: RecibeSchema,
  fecha_sub_estado: { type: String, required: false },
  creacion: { type: String, required: false },
  cierre: { type: String, required: false },
  observaciones_cierre: { type: String, required: false },
  anulacion_date: { type: String, required: false },
  observaciones_anulacion: { type: String, required: false },
  total: { type: Number, required: false },
  solicitar_dado_baja: { type: Boolean, required: false },
}, { versionKey: false });

export const ordenesEntity = () => {
  return mongoose.models.Ordenes || mongoose.model<IOrden>("Ordenes", OrdenSchema);
};
