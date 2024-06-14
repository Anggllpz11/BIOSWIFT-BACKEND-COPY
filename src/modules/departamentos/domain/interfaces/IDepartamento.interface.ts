// IDepartamento.interface.ts

import { ObjectId, Document } from "mongoose";

export interface IDepartamento extends Document {
  nombre: string;
}
