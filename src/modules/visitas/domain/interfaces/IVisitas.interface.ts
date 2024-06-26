// IVisitas.interface.ts

import { Document, ObjectId } from "mongoose";
import { IVisitas_Estados } from "./IVisitas_Estados.interface";
import { ICampos } from "../../../procesos_&_protocolos/domain/interfaces/ICampos.interface";
import { IProtocolos } from "../../../procesos_&_protocolos/domain/interfaces/IProtocolos.interface";
import { IUser } from "../../../users/domain/interfaces/IUser.interface";
import { IOrden } from "../../../ordenes/domain/interfaces/IOrden.interface";
import { IRepuestoEquipo } from "../../../equipos/domain/interfaces/IRepuestoEquipo.interface";

interface IPruebaElectrica {
  _id?: ObjectId;
  title?: string;
  resultado?: string;
  tipo?: string;
  minimo?: number;
  maximo?: number;
  unidad?: string;
  medida?: number;
}

interface ICampoPreventivo {
  _id?: ObjectId;
  id_campo?: ICampos | ObjectId;
  title?: string;
  resultado?: string;
  tipo?: string;
  minimo?: number;
  maximo?: number;
  unidad?: string;
  medida?: number;
}

interface IActividad {
  id_protocolo?: IProtocolos | ObjectId;
  ids_campos_preventivo?: ICampoPreventivo[];
  id_repuesto?: IRepuestoEquipo | ObjectId;
  prueba_electrica?: IPruebaElectrica[];
  id_image?: string;
  date_created?: string;
  observacion?: string;
  cantidad?: string;
  valor_unitario?: number;
  total?: number;
}

export interface IVisitas extends Document {
  id_visita_estado?: IVisitas_Estados | ObjectId;
  id_responsable?: IUser | ObjectId;
  id_creador?: IUser | ObjectId;
  id_aprobador?: IUser | ObjectId;
  id_cerrador?: IUser | ObjectId;
  ids_protocolos?: ObjectId[];
  actividades?: IActividad[];
  id_orden?: IOrden | ObjectId;
  fecha_inicio?: string;
  ejecutar_sede?: boolean;
  duracion?: string;
  fecha_creacion?: string;
  observacion_aprobacion?: string;
  fecha_cierre?: string;
}
