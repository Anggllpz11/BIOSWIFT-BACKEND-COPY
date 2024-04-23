import { Document, ObjectId } from "mongoose";

export interface IServicios extends Document {
  servicio: string;
}
