// IOrdenes_Sub_Estados.interface.ts

import { ObjectId, Document } from "mongoose";
import { IOrdenes_Estados } from "./IOrdenes_Estados.interface";

export interface IOrdenes_Sub_Estados extends Document {
  id_orden_estado?: IOrdenes_Estados;
  sub_estado: string;
}
