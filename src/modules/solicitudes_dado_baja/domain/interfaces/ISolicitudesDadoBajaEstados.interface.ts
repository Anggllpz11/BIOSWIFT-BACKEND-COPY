// ISolicitudesDadoBajaEstados.interface.ts
import { Document } from "mongoose";

export interface ISolicitudesDadoBajaEstados extends Document {
  estado: string;
}
