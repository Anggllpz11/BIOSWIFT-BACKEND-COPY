import mongoose from "mongoose";
import { protocolosEntity } from "../entities/Protocolos.entity";
import { LogError } from "../../../../utils/logger";
import { IProtocolos } from "../interfaces/IProtocolos.interface";

// CRUD

/**
 * Método para obtener todos los Protocolos de la colección "Protocolos" en el servidor Mongo
 */
export const getAllProtocolos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const protocolosModel = protocolosEntity();
    let response: any = {};

    // Buscar todos los protocolos (usando paginación)
    const protocolos: IProtocolos[] = await protocolosModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as unknown as IProtocolos[];

    response.protocolos = protocolos;

    // Contar documentos totales en la colección Protocolos
    const total = await protocolosModel.countDocuments();
    response.totalPages = Math.ceil(total / limit);
    response.currentPage = page;

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Protocolos: ${error}`);
  }
};

/**
 * Método para obtener un solo Protocolo por ID de la colección "Protocolos" en el servidor Mongo
 */
export const getProtocolosByID = async (id: string): Promise<IProtocolos | undefined> => {
  try {
    const protocolosModel = protocolosEntity();
    return await protocolosModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Protocolo By ID: ${error}`);
  }
};

/**
 * Método para eliminar Protocolo por ID
 */
export const deleteProtocolosByID = async (id: string): Promise<any | undefined> => {
  try {
    const protocolosModel = protocolosEntity();
    return await protocolosModel.deleteOne({ _id: id });
  } catch (error) {
    LogError(`[ORM ERROR]: Deleting Protocolo By ID: ${error}`);
  }
};

/**
 * Método para actualizar Protocolo por ID
 */
export const updateProtocolosByID = async (id: string, protocolo: any): Promise<{ success: boolean; message: string }> => {
  try {
    const protocolosModel = protocolosEntity();
    await protocolosModel.findByIdAndUpdate(id, protocolo);

    return {
      success: true,
      message: "Protocolo updated successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Protocolo ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the Protocolo",
    };
  }
};

/**
 * Método para crear Protocolo
 */
export const createProtocolos = async (protocolo: any): Promise<any | undefined> => {
  try {
    const protocolosModel = protocolosEntity();
    const newProtocolo = new protocolosModel(protocolo);
    await newProtocolo.save();

    return {
      success: true,
      message: "Protocolo created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Protocolo: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the Protocolo",
    };
  }
};
