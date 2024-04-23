import mongoose, { Schema } from "mongoose";
import { IModos_Fallos } from "../interfaces/IModos_Fallos.interface";

export const modosFallosEntity = () => {
  const modosFallosSchema = new mongoose.Schema<IModos_Fallos>(
    {
      id_fallo_sistema: {
        type: Schema.Types.ObjectId,
        ref: "Fallo_Sistemas", // Asegúrate de que "Fallo_Sistemas" es el nombre correcto de tu modelo
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  // Definir relaciones virtuales si es necesario
  // Por ejemplo, para cargar detalles de Fallo_Sistemas cuando se consulta Modos_Fallos
  modosFallosSchema.virtual("falloSistema", {
    ref: "Fallo_Sistemas",
    localField: "id_fallo_sistema",
    foreignField: "_id",
    justOne: true, // Retorna un solo documento en lugar de un array
  });

  return mongoose.models.Modos_Fallos || mongoose.model<IModos_Fallos>("Modos_Fallos", modosFallosSchema);
};
