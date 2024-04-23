import mongoose, { Schema, Document } from "mongoose";
import { IUser } from "../../domain/interfaces/IUser.interface";
import { roleEntity } from "./Roles.entity";

export const userEntity = () => {
    let userSchema = new mongoose.Schema<IUser>(
        {
            number: { type: Number, required: true },
            username: { type: String, required: true },
            password: { type: String, required: true },
            name: { type: String, required: true },
            cedula: { type: Number, required: true },
            telefono: { type: String, required: true },
            email: { type: String, required: true },
            more_info: { type: String, required: true },
            // New spaces related to Collection Roles
            roles: [{ type: Schema.Types.ObjectId, ref: "Roles" }],
            type: { type: String, required: false }, // Technician type
            titulo: { type: String, required: false }, // Technician title
            reg_invima: { type: String, required: false } // INVIMA Register
        },
        { versionKey: false } // Disable the versionKey function
    );

    // Define a virtual populate field for user roles
    userSchema.virtual('userRoles', {
        ref: 'Roles',
        localField: 'roles',
        foreignField: '_id',
    });

    // Apply the virtual populate to the schema
    userSchema.set('toObject', { virtuals: true });
    userSchema.set('toJSON', { virtuals: true });

    return mongoose.models.Users || mongoose.model<IUser>('Users', userSchema);
}
