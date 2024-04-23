import mongoose, { Schema, Document } from "mongoose";
import { IAreaEquipo } from "../interfaces/IAreaEquipo.interface";

export const areaEquipoEntity = () => {
  const areaEquipoSchema = new mongoose.Schema<IAreaEquipo>(
    {
      area: { type: String, required: true },
    },
    { versionKey: false } // Disable the versionKey function
  );

  return mongoose.models.Areas_Equipos || mongoose.model<IAreaEquipo>("Areas_Equipos", areaEquipoSchema);
};
