import { ObjectId, Document } from "mongoose";
import { IFallo_Sistemas } from "./IFallo_Sistemas.interface"; // Asegúrate de tener esta interfaz definida

export interface IModos_Fallos extends Document {
  id_fallo_sistema: IFallo_Sistemas; // Relación con Fallo_Sistemas
  name: string;
}
