import mongoose, { Schema, Document } from "mongoose";
import { IProtocolos } from "../../domain/interfaces/IProtocolos.interface";

export const protocolosEntity = () => {
  const protocolosSchema = new mongoose.Schema<IProtocolos>(
    {
      title: { type: String, required: true },
    },
    { versionKey: false, toJSON: { virtuals: true } }
  );

  return (
    mongoose.models.Protocolos ||
    mongoose.model<IProtocolos>("Protocolos", protocolosSchema)
  );
};
