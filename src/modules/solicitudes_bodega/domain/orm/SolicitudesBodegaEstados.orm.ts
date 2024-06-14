// SolicitudesBodegaEstados.orm.ts
import mongoose from "mongoose";
import { SolicitudesBodegaEstadosEntity } from "../../domain/entities/SolicitudesBodegaEstados.entity";
import { LogError } from "../../../../utils/logger";
import { ISolicitudesBodegaEstados } from "../interfaces/ISolicitudesBodegaEstados.interface";

// CRUD

/**
 * Método para obtener todos los estados de la colección "SolicitudesBodegaEstados" en el servidor Mongo
 */
export const getAllSolicitudesBodegaEstados = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let response: any = {};
    const SolicitudesBodegaEstados = SolicitudesBodegaEstadosEntity();
    // Buscar todos los estados (usando paginación)
    const estados: ISolicitudesBodegaEstados[] = await SolicitudesBodegaEstados
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as unknown as ISolicitudesBodegaEstados[];

    response.estados = estados;

    // Contar documentos totales en la colección SolicitudesBodegaEstados
    const total = await SolicitudesBodegaEstados.countDocuments();
    response.totalPages = Math.ceil(total / limit);
    response.currentPage = page;

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All SolicitudesBodegaEstados: ${error}`);
  }
};

/**
 * Método para obtener un solo estado por ID de la colección "SolicitudesBodegaEstados" en el servidor Mongo
 */
export const getSolicitudesBodegaEstadosByID = async (id: string): Promise<ISolicitudesBodegaEstados | undefined> => {
  const SolicitudesBodegaEstados = SolicitudesBodegaEstadosEntity();

  try {
    const solicitudEstado = await SolicitudesBodegaEstados.findById(id).exec();
    return solicitudEstado ? solicitudEstado : undefined;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining SolicitudesBodegaEstados By ID: ${error}`);
  }
};

/**
 * Método para eliminar estado por ID
 */
export const deleteSolicitudesBodegaEstadosByID = async (id: string): Promise<any | undefined> => {
  const SolicitudesBodegaEstados = SolicitudesBodegaEstadosEntity();

  try {
    return await SolicitudesBodegaEstados.deleteOne({ _id: id });
  } catch (error) {
    LogError(`[ORM ERROR]: Deleting SolicitudesBodegaEstados By ID: ${error}`);
  }
};

/**
 * Método para actualizar estado por ID
 */
export const updateSolicitudesBodegaEstadosByID = async (id: string, estadoData: any): Promise<{ success: boolean; message: string }> => {
  const SolicitudesBodegaEstados = SolicitudesBodegaEstadosEntity();

  try {
    await SolicitudesBodegaEstados.findByIdAndUpdate(id, estadoData);

    return {
      success: true,
      message: "SolicitudesBodegaEstados updated successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Updating SolicitudesBodegaEstados ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the SolicitudesBodegaEstados",
    };
  }
};

/**
 * Método para crear estado
 */
export const createSolicitudesBodegaEstados = async (estadoData: any): Promise<any | undefined> => {
  const SolicitudesBodegaEstados = SolicitudesBodegaEstadosEntity();

  try {
    const newEstado = new SolicitudesBodegaEstados(estadoData);
    await newEstado.save();

    return {
      success: true,
      message: "SolicitudesBodegaEstados created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating SolicitudesBodegaEstados: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the SolicitudesBodegaEstados",
    };
  }
};
