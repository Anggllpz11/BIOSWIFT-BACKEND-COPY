// IFallo_Sistemas.interface.ts

import { Document } from "mongoose";

export interface IFallo_Sistemas extends Document {
  name: string;  // Cambiando 'title' a 'name' para coincidir con el modelo de Fallo_Sistemas
}
