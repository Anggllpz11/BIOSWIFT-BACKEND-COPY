import { ObjectId, Document, Schema } from "mongoose";
import { ICampos } from "./ICampos.interface";

export interface IPreventivo extends Document {
  title: string;
  codigo: string;
  version: number;
  fecha: string;
  cualitativo: ICampos[];
  mantenimiento: ICampos[];
  cuantitativo?: {
    campo?: Schema.Types.ObjectId;
    minimo?: number;
    maximo?: number;
    unidad?: string;
  }[];
  otros?: ICampos[];
}
