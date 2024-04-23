import mongoose, { Schema, Document } from "mongoose";
import { ITipoEquipo } from "../interfaces/ITipoEquipo.interface";

export const tipoEquipoEntity = () => {
  const tipoEquipoSchema = new mongoose.Schema<ITipoEquipo>(
    {
      tipo: { type: String, required: true },
    },
    { versionKey: false } // Disable the versionKey function
  );

  return mongoose.models.Tipos_Equipos || mongoose.model<ITipoEquipo>("Tipos_Equipos", tipoEquipoSchema);
};
