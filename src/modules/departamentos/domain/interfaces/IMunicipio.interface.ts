// IMunicipio.interface.ts

import { ObjectId, Document } from "mongoose";
import { IDepartamento } from "./IDepartamento.interface"; // Asegúrate de tener esta interfaz definida

export interface IMunicipio extends Document {
  id_departamento: IDepartamento; // Relación con Departamentos
  nombre: string;
}
