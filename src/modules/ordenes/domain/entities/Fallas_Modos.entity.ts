// Fallas_Modos.entity.ts

import mongoose, { Schema } from "mongoose";
import { IFallas_Modos } from "../interfaces/IFallas_Modos.interface";

export const fallasModosEntity = () => {
  const fallasModosSchema = new mongoose.Schema<IFallas_Modos>(
    {
      title: {
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  return mongoose.models.Fallas_Modos || mongoose.model<IFallas_Modos>("Fallas_Modos", fallasModosSchema);
};
