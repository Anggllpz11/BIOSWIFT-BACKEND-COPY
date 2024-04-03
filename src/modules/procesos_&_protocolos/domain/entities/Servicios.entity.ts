import mongoose, { Schema } from "mongoose";
import { IServicios } from "../../domain/interfaces/IServicios.interface";

export const serviciosEntity = () => {
  const serviciosSchema = new mongoose.Schema<IServicios>(
    {
    servicio: { type: String, required: true },
  },
   { versionKey: false });

  return (
    mongoose.models.Servicios || mongoose.model<IServicios>("Servicios", serviciosSchema)
  );
};
