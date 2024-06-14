// Municipios.entity.ts

import mongoose, { Schema } from "mongoose";
import { IMunicipio } from "../interfaces/IMunicipio.interface";

export const municipiosEntity = () => {
  const municipiosSchema = new mongoose.Schema<IMunicipio>(
    {
      id_departamento: {
        type: Schema.Types.ObjectId,
        ref: "Departamentos", // Asegúrate de que "Departamentos" es el nombre correcto de tu modelo
        required: true,
      },
      nombre: {
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  // Definir relaciones virtuales si es necesario
  // Por ejemplo, para cargar detalles de Departamentos cuando se consulta Municipios
  municipiosSchema.virtual("departamento", {
    ref: "Departamentos",
    localField: "id_departamento",
    foreignField: "_id",
    justOne: true, // Retorna un solo documento en lugar de un array
  });

  return mongoose.models.Municipios || mongoose.model<IMunicipio>("Municipios", municipiosSchema);
};
