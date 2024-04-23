import mongoose from "mongoose";
import { fallasModosEntity } from "../entities/Fallas_Modos.entity";
import { LogError } from "../../../../utils/logger";
import { IFallas_Modos } from "../interfaces/IFallas_Modos.interface";

// CRUD

/**
 * Método para obtener todos los modos de fallas de la colección "Fallas_Modos" en el servidor Mongo con paginación.
 */
export const getAllFallasModos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const fallasModosModel = fallasModosEntity();
    let response: any = {};

    // Buscar todos los modos de fallas con paginación
    const fallasModos: IFallas_Modos[] = await fallasModosModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as IFallas_Modos[];

    response.fallasModos = fallasModos;

    // Contar documentos totales en la colección Fallas_Modos
    await fallasModosModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Fallas Modos: ${error}`);
  }
};

/**
 * Método para obtener un modo de falla por ID de la colección "Fallas_Modos" en el servidor Mongo.
 */
export const getFallaModoByID = async (id: string): Promise<IFallas_Modos | undefined> => {
  try {
    const fallasModosModel = fallasModosEntity();

    // Buscar modo de falla por ID
    return await fallasModosModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Falla Modo By ID: ${error}`);
  }
};

/**
 * Método para eliminar un modo de falla por ID.
 */
export const deleteFallaModoByID = async (id: string): Promise<any | undefined> => {
  try {
    const fallasModosModel = fallasModosEntity();

    // Eliminar modo de falla por ID
    return await fallasModosModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Falla Modo By ID');
  }
};

/**
 * Método para actualizar un modo de falla por ID.
 */
export const updateFallaModoByID = async (id: string, fallaModo: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const fallasModosModel = fallasModosEntity();

    // Actualizar modo de falla por ID
    await fallasModosModel.findByIdAndUpdate(id, fallaModo);

    response.success = true;
    response.message = "Falla Modo actualizado correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Falla Modo ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el Falla Modo",
    };
  }
};

/**
 * Método para crear un nuevo modo de falla.
 */
export const createFallaModo = async (fallaModo: any): Promise<any | undefined> => {
  try {
    const fallasModosModel = fallasModosEntity();

    const newFallaModo = new fallasModosModel(fallaModo);
    await newFallaModo.save();

    return {
      success: true,
      message: "Falla Modo creado correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Falla Modo: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear el Falla Modo",
    };
  }
};
