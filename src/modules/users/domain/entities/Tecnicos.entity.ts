import mongoose from "mongoose";
import { ITecnico } from "../../domain/interfaces/ITecnico.interface";

export const tecnicoEntity = () => {

    let tecnicoSchema = new mongoose.Schema<ITecnico>(
        {
            user_id: {type: String, required: true}, // Object ID from users
            tipo: {type: [], required: false},
            titulo: {type: String, required: true},
            reg_invima: {type: String, required: false},
            tarjeta_profesional: {type: String, required: false},
        },
        { versionKey: false } // Deshabilitar la función versionKey
    );


    return mongoose.models.Tecnicos || mongoose.model<ITecnico>('Tecnicos', tecnicoSchema);
}

