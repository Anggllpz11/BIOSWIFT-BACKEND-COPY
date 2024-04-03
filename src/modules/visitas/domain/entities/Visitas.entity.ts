// Visitas.entity.ts

import mongoose, { Schema } from "mongoose";
import { IVisitas } from "../interfaces/IVisitas.interface";

const CampoPreventivoSchema = new Schema({
  id_campo: { type: Schema.Types.ObjectId, ref: "Campos", required: false },
  resultado: { type: String, required: false },
}, { _id: true });

const ActividadSchema = new Schema({
  id_protocolo: { type: Schema.Types.ObjectId, ref: "Protocolos", required: false },
  ids_campos_preventivo: [CampoPreventivoSchema],
  id_image: { type: String, required: false },
  date_created: { type: String, required: false },
  observacion: { type: String, required: false },
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
