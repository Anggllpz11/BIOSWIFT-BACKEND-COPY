import { Document } from "mongoose";

export interface ICampos_Tipos extends Document {
  tipo: string;
  nombre: string;
}
