import { Document, ObjectId } from "mongoose";
import { IUser } from "../../../users/domain/interfaces/IUser.interface";
import { IOrdenes_Estados } from "./IOrdenes_Estados.interface";
import { IFallas_Acciones } from "./IFallas_Acciones.interface";
import { IFallas_Causas } from "./IFallas_Causas.interface";
import { IFallas_Modos } from "./IFallas_Modos.interface";
import { IModos_Fallos } from "./IModos_Fallos.interface";
import { IVisitas } from "../../../visitas/domain/interfaces/IVisitas.interface";
import { ISolicitudServicio } from "../../../solicitudes/domain/interfaces/Solicitudes_Servicios.interface";
import { IOrdenes_Sub_Estados } from "./IOrdenes_sub_estados.interface";

export interface IEntrega {
  id_entrega?: IUser | ObjectId;
  firma?: string;
}

export interface IRecibe {
  cedula_recibe?: string;
  nombre_recibe?: string;
  firma_recibe?: string;
}

export interface IOrden extends Document {
  id_solicitud_servicio?: ISolicitudServicio | ObjectId;
  id_orden_estado?: IOrdenes_Estados | ObjectId;
  ids_visitas?: IVisitas[] | ObjectId[];
  ids_orden_sub_estados?: IOrdenes_Sub_Estados[] | ObjectId[];
  id_creador?: IUser | ObjectId;
  id_cerrador?: IUser | ObjectId;
  ids_fallas_acciones?: IFallas_Acciones[] | ObjectId[];
  ids_fallas_causas?: IFallas_Causas[] | ObjectId[];
  ids_falla_modos?: IFallas_Modos[] | ObjectId[];
  modos_fallas_ids?: IModos_Fallos[] | ObjectId[];
  entrega?: IEntrega;
  recibe?: IRecibe;
  fecha_sub_estado?: string;
  creacion?: string;
  cierre?: string;
  observaciones_cierre?: string;
  total?: number;
  solicitar_dado_baja?: boolean;
}
