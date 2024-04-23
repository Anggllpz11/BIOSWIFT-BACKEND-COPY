import { ObjectId, Document } from "mongoose";
import { ICampos_Tipos } from "./ICampos_Tipos.interface";

export interface ICampos extends Document {
  id_tipo: ICampos_Tipos;
  title: string;
}
