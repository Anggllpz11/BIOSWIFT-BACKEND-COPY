// ISolicitudesDadoBaja.interface.ts
import { Document, ObjectId } from "mongoose";
import { ISolicitudesDadoBajaEstados } from "./ISolicitudesDadoBajaEstados.interface";
import { IUser } from "../../../users/domain/interfaces/IUser.interface";
import { IOrden } from "../../../ordenes/domain/interfaces/IOrden.interface";

export interface ISolicitudesDadoBaja extends Document {
  id_solicitud_baja_estado: ISolicitudesDadoBajaEstados | ObjectId;
  id_cliente: IUser | ObjectId;
  id_orden: IOrden | ObjectId;
  id_creador: IUser | ObjectId;
  date_created: string;
  id_cambiador: IUser | ObjectId;
  date_cambio_estado: string;
  observacion_estado: string;
}
