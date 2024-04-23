import mongoose, { Schema } from "mongoose";
import { IModeloEquipo } from "../interfaces/IModeloEquipo.interface";

export const modeloEquipoEntity = () => {
  const modeloEquipoSchema = new mongoose.Schema<IModeloEquipo>(
    {
      modelo: {
        type: String,
        required: true
      },
      precio: { type: Number, required: true },
      id_marca: {
        type: Schema.Types.ObjectId,
        ref: "Marcas_Equipos", 
        required: false,
      },
      id_clase: {
        type: Schema.Types.ObjectId,
        ref: "Clases_Equipos", 
        required: false,
      },
      id_preventivo: { // Añade el campo id_preventivo
        type: Schema.Types.ObjectId,
        ref: "Preventivos", 
        required: false,
      }
    },
    { versionKey: false }
  );

  modeloEquipoSchema.virtual("marcaEquipo", {
    ref: "Marcas_Equipos",
    localField: "id_marca",
    foreignField: "_id",
  });

  modeloEquipoSchema.virtual("claseEquipo", {
    ref: "Clases_Equipos",
    localField: "id_clase",
    foreignField: "_id",
  });

  // Añade la relación virtual para id_preventivo si es necesaria
  modeloEquipoSchema.virtual("preventivoEquipo", {
    ref: "Preventivos",
    localField: "id_preventivo",
    foreignField: "_id",
  });

  return mongoose.models.Modelo_Equipos || mongoose.model<IModeloEquipo>("Modelo_Equipos", modeloEquipoSchema);
};
