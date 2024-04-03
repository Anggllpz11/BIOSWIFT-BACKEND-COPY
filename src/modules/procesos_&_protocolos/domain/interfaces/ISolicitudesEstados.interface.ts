import { Document } from "mongoose";

export interface ISolicitudesEstados extends Document {
  estado: string;
}
