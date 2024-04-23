import mongoose, { Schema, Document } from "mongoose";
import { ICampos_Tipos } from "../../domain/interfaces/ICampos_Tipos.interface";

export const camposTiposEntity = () => {
  const camposTiposSchema = new mongoose.Schema<ICampos_Tipos>(
    {
      tipo: { type: String, required: true },
      nombre: { type: String, required: true },
    },
    { versionKey: false }
  );

  return (
    mongoose.models.Campos_Tipos ||
    mongoose.model<ICampos_Tipos>("Campos_Tipos", camposTiposSchema)
  );
};
