import { Document } from "mongoose";
import { IMarcaEquipo } from "./IMarcaEquipo.interface"; 
import { IClassDevice } from "./IClassDevice.interface"; 
import { IPreventivo } from "../../../procesos_&_protocolos/domain/interfaces/IPreventivo.interface";

export interface IModeloEquipo extends Document {
  modelo: string;
  precio: number;
  id_marca?: IMarcaEquipo; 
  id_clase?: IClassDevice; 
  id_preventivo?: IPreventivo; 
}
