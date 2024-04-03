import mongoose from "mongoose";
import { ordenesEstadosEntity } from "../entities/Ordenes_Estados.entity";
import { LogError } from "../../../../utils/logger";
import { IOrdenes_Estados } from "../interfaces/IOrdenes_Estados.interface";

// CRUD

/**
 * Método para obtener todos los estados de las órdenes de la colección "Ordenes_Estados" en el servidor Mongo con paginación.
 */
export const getAllOrdenesEstados = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const ordenesEstadosModel = ordenesEstadosEntity();
    let response: any = {};

    // Buscar todos los estados de las órdenes con paginación
    const ordenesEstados: IOrdenes_Estados[] = await ordenesEstadosModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as IOrdenes_Estados[];

    response.ordenesEstados = ordenesEstados;

    // Contar documentos totales en la colección Ordenes_Estados
    await ordenesEstadosModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Ordenes Estados: ${error}`);
  }
};

/**
 * Método para obtener un estado de orden por ID de la colección "Ordenes_Estados" en el servidor Mongo.
 */
export const getOrdenEstadoByID = async (id: string): Promise<IOrdenes_Estados | undefined> => {
  try {
    const ordenesEstadosModel = ordenesEstadosEntity();

    // Buscar estado de orden por ID
    return await ordenesEstadosModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Orden Estado By ID: ${error}`);
  }
};

/**
 * Método para eliminar un estado de orden por ID.
 */
export const deleteOrdenEstadoByID = async (id: string): Promise<any | undefined> => {
  try {
    const ordenesEstadosModel = ordenesEstadosEntity();

    // Eliminar estado de orden por ID
    return await ordenesEstadosModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Orden Estado By ID');
  }
};

/**
 * Método para actualizar un estado de orden por ID.
 */
export const updateOrdenEstadoByID = async (id: string, ordenEstado: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const ordenesEstadosModel = ordenesEstadosEntity();

    // Actualizar estado de orden por ID
    await ordenesEstadosModel.findByIdAndUpdate(id, ordenEstado);

    response.success = true;
    response.message = "Orden Estado actualizado correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Orden Estado ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el Orden Estado",
    };
  }
};

/**
 * Método para crear un nuevo estado de orden.
 */
export const createOrdenEstado = async (ordenEstado: any): Promise<any | undefined> => {
  try {
    const ordenesEstadosModel = ordenesEstadosEntity();

    const newOrdenEstado = new ordenesEstadosModel(ordenEstado);
    await newOrdenEstado.save();

    return {
      success: true,
      message: "Orden Estado creado correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Orden Estado: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear el Orden Estado",
    };
  }
};
