import { ObjectId, Document } from "mongoose";
import { IModeloEquipo } from "./IModeloEquipo.interface";
import { IAreaEquipo } from "./IAreaEquipo.interface"; // Agregado
import { ITipoEquipo } from "./ITipoEquipo.interface";
import { ISede } from "../../../users/domain/interfaces/ISede.interface";

export interface IEquipo extends Document {
  id_sede?: ISede;
  modelo_equipos?: IModeloEquipo;
  id_area?: IAreaEquipo; 
  id_tipo?: ITipoEquipo;
  serie?: string;
  ubicacion?: string;
  frecuencia?: number;
  activo_fijo?: string;
  mtto?: string;
}
