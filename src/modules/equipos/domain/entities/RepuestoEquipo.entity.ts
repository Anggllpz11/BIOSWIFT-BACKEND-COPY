import mongoose, { Schema, Document } from "mongoose";
import { IRepuestoEquipo } from "../interfaces/IRepuestoEquipo.interface";

export const repuestoEquipoEntity = () => {
  const repuestoEquipoSchema = new mongoose.Schema<IRepuestoEquipo>(
    {
      id_cliente: {
        type: Schema.Types.ObjectId,
        ref: "Clients", // Referencia al modelo de clientes
        required: true,
      },
      repuesto_name: { type: String, required: true },
      repuesto_cantidad: { type: Number, required: true },
      repuesto_precio: { type: Number, required: true },
    },
    { versionKey: false }
  );

  return (
    mongoose.models.Repuestos_Equipos ||
    mongoose.model<IRepuestoEquipo>("Repuestos_Equipos", repuestoEquipoSchema)
  );
};
