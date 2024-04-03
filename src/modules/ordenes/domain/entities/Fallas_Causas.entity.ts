// Fallas_Causas.entity.ts

import mongoose, { Schema } from "mongoose";
import { IFallas_Causas } from "../interfaces/IFallas_Causas.interface";

export const fallasCausasEntity = () => {
  const fallasCausasSchema = new mongoose.Schema<IFallas_Causas>(
    {
      title: {
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  return mongoose.models.Fallas_Causas || mongoose.model<IFallas_Causas>("Fallas_Causas", fallasCausasSchema);
};
