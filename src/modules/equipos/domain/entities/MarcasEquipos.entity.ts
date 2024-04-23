import mongoose, { Schema, Document } from "mongoose";
import { IMarcaEquipo } from "../interfaces/IMarcaEquipo.interface";

export const marcaEquipoEntity = () => {
  const marcaEquipoSchema = new mongoose.Schema<IMarcaEquipo>(
    {
      marca: { type: String, required: true },
    },
    { versionKey: false }
  );

  return mongoose.models.Marcas_Equipos || mongoose.model<IMarcaEquipo>("Marcas_Equipos", marcaEquipoSchema);
};
