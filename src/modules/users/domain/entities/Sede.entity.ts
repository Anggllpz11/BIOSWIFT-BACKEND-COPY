import mongoose, { Schema, Document } from "mongoose";
import { ISede } from "../../domain/interfaces/ISede.interface";

export const sedeEntity = () => {
    let sedeSchema = new mongoose.Schema<ISede>(
        {
            id_client: { type: Schema.Types.ObjectId, ref: "Clients", required: false }, // Agrega la relación con la entidad Clients
            id_municipio: { type: Schema.Types.ObjectId, ref: "Municipios", required: false },
            id_responsable_ordenes: { type: Schema.Types.ObjectId, ref: "Users", required: false },
            id_responsable_preventivos: { type: Schema.Types.ObjectId, ref: "Users", required: false },
            id_responsable_correctivos: { type: Schema.Types.ObjectId, ref: "Users", required: false },
            sede_nombre: { type: String, required: true },
            sede_address: { type: String, required: true },
            sede_telefono: { type: String, required: true },
            sede_email: { type: String, required: true },
        },
        { versionKey: false }
    );

    return mongoose.models.Sedes || mongoose.model<ISede>('Sedes', sedeSchema);
}

