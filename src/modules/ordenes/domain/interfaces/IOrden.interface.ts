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
import { IFallo_Sistemas } from "./IFallo_Sistemas.interface";

export interface IEntrega {
  id_entrega?: IUser | ObjectId;
  firma?: string;
}

export interface IRecibe {
  cedula_recibe?: string;
  nombre_recibe?: string;
  firma_recibe?: string;
}

export interface IOrdenCambio {
  ids_orden_sub_estado: IOrdenes_Sub_Estados | ObjectId;
  id_creador: IUser | ObjectId;
  date_created: string;
  comentario: string;
}

export interface IResultadoOrden {
  id_fallo_sistema?: IFallo_Sistemas | ObjectId;
  ids_modos_fallos?: IModos_Fallos[] | ObjectId[];
  ids_causas_fallos?: IFallas_Causas[] | ObjectId[];
  comentarios_finales?: string;
  solicitud_dar_baja?: boolean;
  accion_ejecutada?: string;
}

export interface IOrden extends Document {
  id_solicitud_servicio?: ISolicitudServicio | ObjectId;
  id_orden_estado?: IOrdenes_Estados | ObjectId;
  ids_visitas?: IVisitas[] | ObjectId[];
  orden_cambios?: IOrdenCambio[];
  resultado_orden?: IResultadoOrden;
  id_creador?: IUser | ObjectId;
  id_cerrador?: IUser | ObjectId;
  id_anulador?: IUser | ObjectId;
  entrega?: IEntrega;
  recibe?: IRecibe;
  fecha_sub_estado?: string;
  creacion?: string;
  cierre?: string;
  observaciones_cierre?: string;
  anulacion_date?: string;
  observaciones_anulacion?: string;
  total?: number;
  solicitar_dado_baja?: boolean;
}
