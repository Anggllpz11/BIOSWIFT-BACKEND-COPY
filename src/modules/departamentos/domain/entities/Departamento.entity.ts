// Departamentos.entity.ts

import mongoose, { Schema } from "mongoose";
import { IDepartamento } from "../interfaces/IDepartamento.interface";

export const departamentosEntity = () => {
  const departamentosSchema = new mongoose.Schema<IDepartamento>(
    {
      nombre: {
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  return mongoose.models.Departamentos || mongoose.model<IDepartamento>("Departamentos", departamentosSchema);
};
