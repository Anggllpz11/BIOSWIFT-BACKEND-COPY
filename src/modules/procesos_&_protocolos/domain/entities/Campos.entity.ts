import mongoose, { Schema, Document } from "mongoose";
import { ICampos } from "../../domain/interfaces/ICampos.interface";

export const camposEntity = () => {
  const camposSchema = new mongoose.Schema<ICampos>(
    {
      id_tipo: {
        type: Schema.Types.ObjectId,
        ref: "Campos_Tipos", // Asegúrate de que sea el nombre correcto de la entidad Campos_Tipos
        required: true,
      },
      title: { type: String, required: true },
      // Elimina la línea relacionada con 'valor'
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  // Define la relación virtual si es necesaria
  camposSchema.virtual("tipoCampo", {
    ref: "Campos_Tipos",
    localField: "id_tipo",
    foreignField: "_id",
  });

  return (
    mongoose.models.Campos ||
    mongoose.model<ICampos>("Campos", camposSchema)
  );
};
