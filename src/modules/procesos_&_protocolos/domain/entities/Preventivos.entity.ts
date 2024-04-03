import mongoose, { Schema } from "mongoose";
import { IPreventivo } from "../../domain/interfaces/IPreventivo.interface";
import { camposEntity } from "./Campos.entity";

export const preventivosEntity = () => {
  const preventivosSchema = new mongoose.Schema<IPreventivo>(
    {
      title: { type: String, required: true },
      codigo: { type: String, required: true },
      version: { type: Number, required: true },
      fecha: { type: String, required: true },
      cualitativo: [
        {
          type: Schema.Types.ObjectId,
          ref: "Campos",
        },
      ],
      mantenimiento: [
        {
          type: Schema.Types.ObjectId,
          ref: "Campos",
        },
      ],
      cuantitativo: [
        {
          campo: {
            type: Schema.Types.ObjectId,
            ref: "Campos",
          },
          minimo: { type: Number},
          maximo: { type: Number},
          unidad: { type: String},
        },
      ],
      otros: [
        {
          type: Schema.Types.ObjectId,
          ref: "Campos",
        },
      ],
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  // Define las relaciones virtuales si son necesarias
  preventivosSchema.virtual("camposCualitativos", {
    ref: "Campos",
    localField: "cualitativo",
    foreignField: "_id",
  });

  preventivosSchema.virtual("camposMantenimiento", {
    ref: "Campos",
    localField: "mantenimiento",
    foreignField: "_id",
  });

  preventivosSchema.virtual("camposCuantitativos", {
    ref: "Campos",
    localField: "cuantitativo.campo",
    foreignField: "_id",
  });

  preventivosSchema.virtual("camposOtros", {
    ref: "Campos",
    localField: "otros",
    foreignField: "_id",
  });

  return (
    mongoose.models.Preventivos ||
    mongoose.model<IPreventivo>("Preventivos", preventivosSchema)
  );
};
