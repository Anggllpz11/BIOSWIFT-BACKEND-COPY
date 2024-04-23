// Cotizaciones.entity.ts
import mongoose, { Schema } from "mongoose";
import { ICotizacion } from "../interfaces/ICotizacion.interface";

const ItemAdicionalSchema = new Schema({
  descripcion: { type: String, required: false },
  cantidad: { type: Number, required: false },
  valor_unitario: { type: Number, required: false },
}, { _id: false });

const RepuestoSchema = new Schema({
  id_repuesto: { type: Schema.Types.ObjectId, ref: "Repuestos_Equipos", required: false },
  cantidad: { type: Number, required: false },
  valor_unitario: { type: Number, required: false },
}, { _id: false });

const CotizacionSchema = new Schema<ICotizacion>({
  id_cliente: { type: Schema.Types.ObjectId, ref: "Clients", required: false },
  id_orden: { type: Schema.Types.ObjectId, ref: "Ordenes", required: false },
  id_creador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  id_cambiador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  id_estado: { type: Schema.Types.ObjectId, ref: "Cotizaciones_Estados", required: false },
  ids_repuestos: [RepuestoSchema],
  items_adicionales: [ItemAdicionalSchema],
  fecha_creation: { type: String, required: false },
  cambio_estado: { type: String, required: false },
  mensaje: { type: String, required: false },
  observacion_estado: { type: String, required: false },
  condiciones: { type: String, required: false },
  firma: { type: String, required: false },
  firma_username: { type: String, required: false },
}, { versionKey: false });

export const cotizacionesEntity = () => {
  return mongoose.models.Cotizaciones || mongoose.model<ICotizacion>("Cotizaciones", CotizacionSchema);
};
