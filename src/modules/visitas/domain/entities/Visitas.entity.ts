// Visitas.entity.ts

import mongoose, { Schema } from "mongoose";
import { IVisitas } from "../interfaces/IVisitas.interface";

const PruebaElectricaSchema = new Schema({
  title: { type: String, required: false },
  resultado: { type: String, required: false },
  tipo: { type: String, required: false },
  minimo: { type: Number, required: false },
  maximo: { type: Number, required: false },
  unidad: { type: String, required: false },
  medida: { type: Number, required: false },

}, { _id: true });

const CampoPreventivoSchema = new Schema({
  id_campo: { type: Schema.Types.ObjectId, ref: "Campos", required: false },
  title: { type: String, required: false },
  resultado: { type: String, required: false },
  tipo: { type: String, required: false },
  minimo: { type: Number, required: false },
  maximo: { type: Number, required: false },
  unidad: { type: String, required: false },
  medida: { type: Number, required: false },

}, { _id: true });

const ActividadSchema = new Schema({
  id_protocolo: { type: Schema.Types.ObjectId, ref: "Protocolos", required: false },
  ids_campos_preventivo: [CampoPreventivoSchema],
  id_repuesto: { type: Schema.Types.ObjectId, ref: "Repuestos_Equipos", required: false },
  prueba_electrica: [PruebaElectricaSchema],
  id_image: { type: String, required: false },
  date_created: { type: String, required: false },
  observacion: { type: String, required: false },
  cantidad: { type: String, required: false },
  valor_unitario: { type: String, required: false },
  total: { type: String, required: false },
}, { _id: true });

const VisitasSchema = new Schema<IVisitas>({
  id_visita_estado: { type: Schema.Types.ObjectId, ref: "Visitas_Estados", required: false },
  id_responsable: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  id_creador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  id_aprobador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  id_cerrador: { type: Schema.Types.ObjectId, ref: "Users", required: false },
  ids_protocolos: [{ type: Schema.Types.ObjectId, ref: "Protocolos", required: false }],
  actividades: [ActividadSchema],
  id_orden: [{ type: Schema.Types.ObjectId, ref: "Ordenes", required: false }],
  fecha_inicio: { type: String, required: false },
  ejecutar_sede: { type: Boolean, required: false },
  duracion: { type: String, required: false },
  fecha_creacion: { type: String, required: false },
  observacion_aprobacion: { type: String, required: false },
  fecha_cierre: { type: String, required: false },
}, { versionKey: false, toJSON: { virtuals: true } });

export const visitasEntity = () => {
  return mongoose.models.Visitas || mongoose.model<IVisitas>("Visitas", VisitasSchema);
};
