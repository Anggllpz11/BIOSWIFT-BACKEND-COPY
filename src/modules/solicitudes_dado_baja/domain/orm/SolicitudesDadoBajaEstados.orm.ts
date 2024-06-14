// SolicitudesDadoBajaEstados.orm.ts
import mongoose from "mongoose";
import { SolicitudesDadoBajaEstadosEntity } from "../../domain/entities/SolicitudesDadoBajaEstados.entity";
import { LogError } from "../../../../utils/logger";
import { ISolicitudesDadoBajaEstados } from "../interfaces/ISolicitudesDadoBajaEstados.interface";

// CRUD Operations

/**
 * Método para obtener todos los estados de la colección "SolicitudesDadoBajaEstados" en el servidor Mongo
 */
export const getAllSolicitudesDadoBajaEstados = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let response: any = {};
    const SolicitudesDadoBajaEstados = SolicitudesDadoBajaEstadosEntity();
    const estados: ISolicitudesDadoBajaEstados[] = await SolicitudesDadoBajaEstados
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    response.estados = estados;
    const total = await SolicitudesDadoBajaEstados.countDocuments();
    response.totalPages = Math.ceil(total / limit);
    response.currentPage = page;

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All SolicitudesDadoBajaEstados: ${error}`);
  }
};

/**
 * Método para obtener un solo estado por ID de la colección "SolicitudesDadoBajaEstados" en el servidor Mongo
 */
export const getSolicitudesDadoBajaEstadosByID = async (id: string): Promise<ISolicitudesDadoBajaEstados | undefined> => {
  const SolicitudesDadoBajaEstados = SolicitudesDadoBajaEstadosEntity();

  try {
    const solicitudEstado = await SolicitudesDadoBajaEstados.findById(id).exec();
    return solicitudEstado || undefined;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining SolicitudesDadoBajaEstados By ID: ${error}`);
  }
};

/**
 * Método para eliminar estado por ID
 */
export const deleteSolicitudesDadoBajaEstadosByID = async (id: string): Promise<any | undefined> => {
  const SolicitudesDadoBajaEstados = SolicitudesDadoBajaEstadosEntity();

  try {
    return await SolicitudesDadoBajaEstados.deleteOne({ _id: id });
  } catch (error) {
    LogError(`[ORM ERROR]: Deleting SolicitudesDadoBajaEstados By ID: ${error}`);
  }
};

/**
 * Método para actualizar estado por ID
 */
export const updateSolicitudesDadoBajaEstadosByID = async (id: string, estadoData: any): Promise<{ success: boolean; message: string }> => {
  const SolicitudesDadoBajaEstados = SolicitudesDadoBajaEstadosEntity();

  try {
    await SolicitudesDadoBajaEstados.findByIdAndUpdate(id, estadoData);

    return {
      success: true,
      message: "SolicitudesDadoBajaEstados updated successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Updating SolicitudesDadoBajaEstados ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the SolicitudesDadoBajaEstados",
    };
  }
};

/**
 * Método para crear estado
 */
export const createSolicitudesDadoBajaEstados = async (estadoData: any): Promise<any | undefined> => {
  const SolicitudesDadoBajaEstados = SolicitudesDadoBajaEstadosEntity();

  try {
    const newEstado = new SolicitudesDadoBajaEstados(estadoData);
    await newEstado.save();

    return {
      success: true,
      message: "SolicitudesDadoBajaEstados created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating SolicitudesDadoBajaEstados: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the SolicitudesDadoBajaEstados",
    };
  }
};
