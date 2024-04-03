// Fallo_Sistemas.entity.ts

import mongoose, { Schema } from "mongoose";
import { IFallo_Sistemas } from "../interfaces/IFallo_Sistemas.interface";

export const falloSistemasEntity = () => {
  const falloSistemasSchema = new mongoose.Schema<IFallo_Sistemas>(
    {
      name: {  // Usando 'name' en lugar de 'title'
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  return mongoose.models.Fallo_Sistemas || mongoose.model<IFallo_Sistemas>("Fallo_Sistemas", falloSistemasSchema);
};
