// IOrdenes_Estados.interface.ts

import { ObjectId, Document } from "mongoose";

export interface IOrdenes_Estados extends Document {
  estado: string;
}
