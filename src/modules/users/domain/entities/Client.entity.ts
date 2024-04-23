import mongoose, { Schema, Document } from 'mongoose';
import { IClient } from '../../domain/interfaces/IClient.interface';

export const clientEntity = () => {
  const clientSchema = new mongoose.Schema<IClient>({
    client_name: { type: String, required: true },
    client_nit: { type: Number, required: true },
    client_address: { type: String, required: true },
    client_telefono: { type: String, required: true },
    client_email: { type: String, required: true },
    
  },
  { versionKey: false } // Disable the versionKey function
  );

  return mongoose.models.Clients || mongoose.model<IClient>('Clients', clientSchema);
};
