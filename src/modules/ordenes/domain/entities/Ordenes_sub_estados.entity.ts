import mongoose, { Schema } from "mongoose";
import { IOrdenes_Sub_Estados } from "../interfaces/IOrdenes_sub_estados.interface";

export const ordenesSubEstadosEntity = () => {
  const ordenesSubEstadosSchema = new mongoose.Schema<IOrdenes_Sub_Estados>(
    {
      id_orden_estado: {
        type: Schema.Types.ObjectId,
        required: false,  
        ref: 'Ordenes_Estados'  
      },
      sub_estado: {
        type: String,
        required: true,
      },
    },
    { versionKey: false, toJSON: { virtuals: true }, toObject: { virtuals: true } } 
  );

  ordenesSubEstadosSchema.virtual('ordenEstado', {
    ref: 'Ordenes_Estados',  
    localField: 'id_orden_estado',  
    foreignField: '_id',  
    justOne: true  
  });

  return mongoose.models.Ordenes_Sub_Estados || mongoose.model<IOrdenes_Sub_Estados>("Ordenes_Sub_Estados", ordenesSubEstadosSchema);
};
