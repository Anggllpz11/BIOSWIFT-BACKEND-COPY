// Solicitudes_Servicios.entity.ts
import mongoose, { Schema } from "mongoose";
import { ISolicitudServicio } from "../interfaces/Solicitudes_Servicios.interface";

class SolicitudesServiciosEntity {
  private static _instance: mongoose.Model<ISolicitudServicio>;

  private constructor() {}

  static getInstance(): mongoose.Model<ISolicitudServicio> {
    if (!SolicitudesServiciosEntity._instance) {
      const solicitudServicioSchema = new mongoose.Schema<ISolicitudServicio>(
    {
    id_creador: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    id_servicio: {
      type: Schema.Types.ObjectId,
      ref: "Servicios",
      required: true,
    },
    id_solicitud_estado: {
      type: Schema.Types.ObjectId,
      ref: "Solicitudes_Estados",
      required: true,
    },
    id_equipo: {
      type: Schema.Types.ObjectId,
      ref: "Equipos",
      required: true,
    },
    id_cambiador: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    creacion: {
      type: String,
      required: true,
    },
    aviso: {
      type: String,
      required: true,
    },
    cambio_estado: {
      type: String,
      required: true,
    },
    observacion: {
      type: String,
      required: true,
    },
    observacion_estado: {
      type: String,
      required: true,
    },
  }, {
    versionKey: false,
    toJSON: { virtuals: true },
  });
  
  // Relaciones virtuales
  solicitudServicioSchema.virtual("creador", {
    ref: "Users",
    localField: "id_creador",
    foreignField: "_id",
  });
  
  solicitudServicioSchema.virtual("servicio", {
    ref: "Servicios",
    localField: "id_servicio",
    foreignField: "_id",
  });
  
  solicitudServicioSchema.virtual("solicitudEstado", {
    ref: "Solicitudes_Estados",
    localField: "id_solicitud_estado",
    foreignField: "_id",
  });
  
  solicitudServicioSchema.virtual("equipo", {
    ref: "Equipos",
    localField: "id_equipo",
    foreignField: "_id",
  });
  
  solicitudServicioSchema.virtual("cambiador", {
    ref: "Users",
    localField: "id_cambiador",
    foreignField: "_id",
  });
  
  SolicitudesServiciosEntity._instance = mongoose.models.Solicitudes_Servicios || mongoose.model<ISolicitudServicio>(
    "Solicitudes_Servicios",
    solicitudServicioSchema
  );
}

return SolicitudesServiciosEntity._instance;
}
}

export const solicitudesServiciosEntity = () => SolicitudesServiciosEntity.getInstance();