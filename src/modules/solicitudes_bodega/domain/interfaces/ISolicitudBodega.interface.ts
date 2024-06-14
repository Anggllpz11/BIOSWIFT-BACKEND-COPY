import { Document, ObjectId } from "mongoose";
import { IUser } from "../../../users/domain/interfaces/IUser.interface";
import { IOrden } from "../../../ordenes/domain/interfaces/IOrden.interface";
import { IClient } from "../../../users/domain/interfaces/IClient.interface";
import { ISolicitudesBodegaEstados } from "./ISolicitudesBodegaEstados.interface";
import { IRepuestoEquipo } from "../../../equipos/domain/interfaces/IRepuestoEquipo.interface";

export interface INovedad {
  id_user: IUser | ObjectId;
  novedad: string;
  date_novedad: string;
}


interface IItemAdicional {
  descripcion?: string;
  cantidad?: number;
  valor_unitario?: number;
  sum_client?: boolean;
}

interface IRepuesto {
  id_repuesto?: IRepuestoEquipo | ObjectId;
  cantidad?: number;
  valor_unitario?: number;
  sum_client?: boolean;
}


export interface ISolicitudBodega extends Document {
  id: ObjectId;
  id_cliente: IClient | ObjectId;
  id_orden: IOrden | ObjectId;
  id_estado: ISolicitudesBodegaEstados | ObjectId;
  id_creador: IUser | ObjectId;
  date_created: string;
  ids_repuestos?: IRepuesto[];
  items_adicionales?: IItemAdicional[];
  id_aprobador: IUser | ObjectId;
  date_aprobacion: string;
  observacion_aprobacion: string;
  id_rechazador: IUser | ObjectId;
  date_rechazo: string;
  observacion_rechazo: string;
  id_despachador: IUser | ObjectId;
  date_despacho: string;
  observacion_despacho: string;
  id_finalizador: IUser | ObjectId;
  date_finalizacion: string;
  observacion_finalizacion: string;
  novedades: INovedad[];
}