import mongoose, { Schema, Document } from "mongoose";
import { ISede } from "../../domain/interfaces/ISede.interface";

export const sedeEntity = () => {
    let sedeSchema = new mongoose.Schema<ISede>(
        {
            sede_nombre: { type: String, required: true },
            sede_address: { type: String, required: true },
            sede_telefono: { type: String, required: true },
            sede_email: { type: String, required: true },
            id_client: { type: Schema.Types.ObjectId, ref: "Clients", required: false }, // Agrega la relación con la entidad Clients
        },
        { versionKey: false }
    );

    return mongoose.models.Sedes || mongoose.model<ISede>('Sedes', sedeSchema);
}

