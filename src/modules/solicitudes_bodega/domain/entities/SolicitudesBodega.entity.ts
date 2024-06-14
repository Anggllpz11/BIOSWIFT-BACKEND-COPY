import mongoose, { Schema } from "mongoose";
import { ISolicitudBodega } from "../interfaces/ISolicitudBodega.interface";

const NovedadSchema = new Schema({
  id_user: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  novedad: { type: String, required: false },
  date_novedad: { type: String, required: false },
}, { _id: false });
const ItemAdicionalSchema = new Schema({
  descripcion: { type: String, required: false },
  cantidad: { type: Number, required: false },
  valor_unitario: { type: Number, required: false },
  sum_client: { type: Boolean, required: false },
}, { _id: false });

const RepuestoSchema = new Schema({
  id_repuesto: { type: Schema.Types.ObjectId, ref: "Repuestos_Equipos", required: false },
  cantidad: { type: Number, required: false },
  valor_unitario: { type: Number, required: false },
  sum_client: { type: Boolean, required: false },
}, { _id: false });


const SolicitudesBodegaSchema = new Schema<ISolicitudBodega>({
  id_cliente: { type: Schema.Types.ObjectId, ref: "Clients", required: false },
  id_orden: { type: Schema.Types.ObjectId, ref: "Orden", required: false },
  id_estado: { type: Schema.Types.ObjectId, ref: "Solicitudes_Bodega_Estados", required: false },
  id_creador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  date_created: { type: String, required: false },
  ids_repuestos: [RepuestoSchema],
  items_adicionales: [ItemAdicionalSchema],
  id_aprobador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  date_aprobacion: { type: String, required: false },
  observacion_aprobacion: { type: String, required: false },
  id_rechazador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  date_rechazo: { type: String, required: false },
  observacion_rechazo: { type: String, required: false },
  id_despachador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  date_despacho: { type: String, required: false },
  observacion_despacho: { type: String, required: false },
  id_finalizador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  date_finalizacion: { type: String, required: false },
  observacion_finalizacion: { type: String, required: false },
  novedades: [NovedadSchema],
}, { versionKey: false });

export const solicitudesBodegaEntity = () => {
  return mongoose.models.SolicitudesBodega || mongoose.model<ISolicitudBodega>("Solicitudes_Bodega", SolicitudesBodegaSchema);
};