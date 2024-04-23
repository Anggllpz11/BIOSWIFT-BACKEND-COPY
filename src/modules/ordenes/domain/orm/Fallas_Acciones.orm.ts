import mongoose from "mongoose";
import { fallasAccionesEntity } from "../entities/Fallas_Acciones.entity";
import { LogError } from "../../../../utils/logger";
import { IFallas_Acciones } from "../interfaces/IFallas_Acciones.interface";

// CRUD

/**
 * Método para obtener todas las acciones de fallas de la colección "Fallas_Acciones" en el servidor Mongo con paginación.
 */
export const getAllFallasAcciones = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const fallasAccionesModel = fallasAccionesEntity();
    let response: any = {};

    // Buscar todas las acciones de fallas con paginación
    const fallasAcciones: IFallas_Acciones[] = await fallasAccionesModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as IFallas_Acciones[];

    response.fallasAcciones = fallasAcciones;

    // Contar documentos totales en la colección Fallas_Acciones
    await fallasAccionesModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Fallas Acciones: ${error}`);
  }
};

/**
 * Método para obtener una acción de falla por ID de la colección "Fallas_Acciones" en el servidor Mongo.
 */
export const getFallaAccionByID = async (id: string): Promise<IFallas_Acciones | undefined> => {
  try {
    const fallasAccionesModel = fallasAccionesEntity();

    // Buscar acción de falla por ID
    return await fallasAccionesModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Falla Accion By ID: ${error}`);
  }
};

/**
 * Método para eliminar una acción de falla por ID.
 */
export const deleteFallaAccionByID = async (id: string): Promise<any | undefined> => {
  try {
    const fallasAccionesModel = fallasAccionesEntity();

    // Eliminar acción de falla por ID
    return await fallasAccionesModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Falla Accion By ID');
  }
};

/**
 * Método para actualizar una acción de falla por ID.
 */
export const updateFallaAccionByID = async (id: string, fallaAccion: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const fallasAccionesModel = fallasAccionesEntity();

    // Actualizar acción de falla por ID
    await fallasAccionesModel.findByIdAndUpdate(id, fallaAccion);

    response.success = true;
    response.message = "Falla Accion actualizada correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Falla Accion ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar la Falla Accion",
    };
  }
};

/**
 * Método para crear una nueva acción de falla.
 */
export const createFallaAccion = async (fallaAccion: any): Promise<any | undefined> => {
  try {
    const fallasAccionesModel = fallasAccionesEntity();

    const newFallaAccion = new fallasAccionesModel(fallaAccion);
    await newFallaAccion.save();

    return {
      success: true,
      message: "Falla Accion creada correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Falla Accion: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear la Falla Accion",
    };
  }
};
