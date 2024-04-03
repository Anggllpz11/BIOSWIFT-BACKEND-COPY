import mongoose from 'mongoose';
import { clientEntity } from '../entities/Client.entity';
import { IClient } from '../interfaces/IClient.interface';
import { LogError, LogSuccess } from '../../../../utils/logger';

// Obtener todos los clientes
export const getAllClients = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const clientModel = clientEntity();
    const response: any = {};

    // Buscar todos los clientes (con paginación)
    await clientModel.find({})
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id client_name client_nit client_address client_telefono client_email')
      .exec()
      .then((clients: any[]) => {
        response.clients = clients;
      });

    // Contar documentos totales en la colección de Clientes
    await clientModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    LogSuccess('Successfully retrieved all clients');
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All Clients: ${error}`);
  }
};

// Obtener cliente por ID
export const getClientByID = async (id: string): Promise<any | undefined> => {
  try {
    const clientModel = clientEntity();

    // Buscar cliente por ID
    return await clientModel.findById(id)
      .select('_id client_name client_nit client_address client_telefono client_email')
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Getting Client By ID: ${error}`);
  }
};

// Eliminar cliente por ID
export const deleteClientByID = async (id: string): Promise<any | undefined> => {
  try {
    const clientModel = clientEntity();

    // Eliminar cliente por ID
    return await clientModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Client By ID');
  }
};

// Actualizar cliente por ID
export const updateClientByID = async (id: string, client: IClient): Promise<any | undefined> => {
  try {
    const clientModel = clientEntity();

    // Actualizar el cliente por ID
    return await clientModel.findByIdAndUpdate(id, client, { new: true }).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Client By ID: ${error}`);
  }
};


// Crear un nuevo cliente
export const createClient = async (client: IClient): Promise<any | undefined> => {
  try {
    const clientModel = clientEntity();

    // Crear un nuevo cliente
    return await clientModel.create(client);
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Client: ${error}`);
  }
};
