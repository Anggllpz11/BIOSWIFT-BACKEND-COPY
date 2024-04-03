// IVisitas_Estados.interface.ts

import { ObjectId, Document } from "mongoose";

export interface IVisitas_Estados extends Document {
  estado: string;
}
