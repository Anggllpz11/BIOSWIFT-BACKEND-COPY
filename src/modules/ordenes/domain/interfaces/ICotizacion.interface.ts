// ICotizacion.interface.ts
import { Document, ObjectId } from "mongoose";
import { IOrden } from "./IOrden.interface";
import { IClient } from "../../../users/domain/interfaces/IClient.interface";
import { IUser } from "../../../users/domain/interfaces/IUser.interface";
import { IRepuestoEquipo } from "../../../equipos/domain/interfaces/IRepuestoEquipo.interface";
import { ICotizaciones_Estados } from "./ICotizaciones_Estados.interface";

interface IItemAdicional {
  descripcion?: string;
  cantidad?: number;
  valor_unitario?: number;
}

interface IRepuesto {
  id_repuesto?: IRepuestoEquipo | ObjectId;
  cantidad?: number;
  valor_unitario?: number;
}

export interface ICotizacion extends Document {
  id_cliente?: IClient | ObjectId;
  id_orden?: IOrden | ObjectId;
  id_creador?: IUser | ObjectId;
  id_cambiador?: IUser | ObjectId;
  id_estado?: ICotizaciones_Estados | ObjectId;
  ids_repuestos?: IRepuesto[];
  items_adicionales?: IItemAdicional[];
  fecha_creation?: string;
  cambio_estado?: string;
  mensaje?: string;
  observacion_estado?: string;
  condiciones?: string;
  firma?: string;
  firma_username?: string;
}
