import mongoose from "mongoose";
import { LogError } from "../../../../utils/logger";
import { IOrdenes_Sub_Estados } from "../interfaces/IOrdenes_sub_estados.interface";
import { ordenesSubEstadosEntity } from "../entities/Ordenes_sub_estados.entity";

// CRUD

/**
 * Método para obtener todos los sub estados de las órdenes de la colección "Ordenes_Sub_Estados" en el servidor Mongo con paginación.
 */
export const getAllOrdenesSubEstados = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const ordenesSubEstadosModel = ordenesSubEstadosEntity();
    let response: any = {};

    // Buscar todos los sub estados de las órdenes con paginación
    const ordenesSubEstados: IOrdenes_Sub_Estados[] = await ordenesSubEstadosModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as IOrdenes_Sub_Estados[];

    response.ordenesSubEstados = ordenesSubEstados;

    // Contar documentos totales en la colección Ordenes_Sub_Estados
    await ordenesSubEstadosModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Ordenes Sub Estados: ${error}`);
  }
};

/**
 * Método para obtener un sub estado de orden por ID de la colección "Ordenes_Sub_Estados" en el servidor Mongo.
 */
export const getOrdenSubEstadoByID = async (id: string): Promise<IOrdenes_Sub_Estados | undefined> => {
  try {
    const ordenesSubEstadosModel = ordenesSubEstadosEntity();

    // Buscar sub estado de orden por ID
    return await ordenesSubEstadosModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Orden Sub Estado By ID: ${error}`);
  }
};

/**
 * Método para eliminar un sub estado de orden por ID.
 */
export const deleteOrdenSubEstadoByID = async (id: string): Promise<any | undefined> => {
  try {
    const ordenesSubEstadosModel = ordenesSubEstadosEntity();

    // Eliminar sub estado de orden por ID
    return await ordenesSubEstadosModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Orden Sub Estado By ID');
  }
};

/**
 * Método para actualizar un sub estado de orden por ID.
 */
export const updateOrdenSubEstadoByID = async (id: string, ordenSubEstado: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const ordenesSubEstadosModel = ordenesSubEstadosEntity();

    // Actualizar sub estado de orden por ID
    await ordenesSubEstadosModel.findByIdAndUpdate(id, ordenSubEstado);

    response.success = true;
    response.message = "Orden Sub Estado actualizado correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Orden Sub Estado ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el Orden Sub Estado",
    };
  }
};

/**
 * Método para crear un nuevo sub estado de orden.
 */
export const createOrdenSubEstado = async (ordenSubEstado: any): Promise<any | undefined> => {
  try {
    const ordenesSubEstadosModel = ordenesSubEstadosEntity();

    const newOrdenSubEstado = new ordenesSubEstadosModel(ordenSubEstado);
    await newOrdenSubEstado.save();

    return {
      success: true,
      message: "Orden Sub Estado creado correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Orden Sub Estado: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear el Orden Sub Estado",
    };
  }
};
