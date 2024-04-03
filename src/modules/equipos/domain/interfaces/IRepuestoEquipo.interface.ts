import { IClient } from "@/modules/users/domain/interfaces/IClient.interface";
import { ObjectId, Document } from "mongoose";

export interface IRepuestoEquipo extends Document {
  id_cliente: IClient;
  repuesto_name: string;
  repuesto_cantidad: number;
  repuesto_precio: number;
}
