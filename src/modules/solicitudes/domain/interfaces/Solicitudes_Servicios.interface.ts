import { Document, ObjectId } from "mongoose";

import { ISolicitudesEstados } from "../../../procesos_&_protocolos/domain/interfaces/ISolicitudesEstados.interface";
import { IServicios } from "../../../procesos_&_protocolos/domain/interfaces/IServicios.interface";
import { IUser } from "../../../users/domain/interfaces/IUser.interface";
import { IEquipo } from "../../../equipos/domain/interfaces/IEquipo.interface";

export interface ISolicitudServicio extends Document {
  id_creador: IUser; 
  id_servicio: IServicios; 
  id_solicitud_estado: ISolicitudesEstados; 
  id_equipo: IEquipo; 
  id_cambiador: IUser; 
  creacion: string;
  aviso: string; 
  cambio_estado: string;
  observacion: string; 
  observacion_estado: string; 
}
