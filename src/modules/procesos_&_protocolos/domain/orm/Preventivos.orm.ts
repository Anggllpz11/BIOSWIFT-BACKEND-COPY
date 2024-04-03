import mongoose from "mongoose";
import { preventivosEntity } from "../entities/Preventivos.entity";
import { LogError } from "../../../../utils/logger";
import { LogSuccess } from "../../../../utils/logger";
import { IPreventivo } from "../interfaces/IPreventivo.interface";
import { camposEntity } from "../entities/Campos.entity";

// CRUD

/**
 * Método para obtener todos los Preventivos de la colección "Preventivos" en el servidor Mongo
 */
export const getAllPreventivos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let preventivosModel = preventivosEntity();
    let camposModel = camposEntity(); // Importar la entidad Campos

    let response: any = {};

    // Buscar todos los preventivos (usando paginación) y poblar campos cualitativos, de mantenimiento, cuantitativos y otros
    const preventivos: IPreventivo[] = await preventivosModel
      .find({}, { _id: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id title codigo version fecha cualitativo mantenimiento cuantitativo otros')
      .populate({
        path: 'cualitativo mantenimiento cuantitativo.campo otros',
        model: camposModel,
        select: '_id id_tipo title valor',
      })
      .exec() as unknown as IPreventivo[];

    response.preventivos = preventivos;

    // Contar documentos totales en la colección Preventivos
    await preventivosModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Preventivos: ${error}`);
  }
};

/**
 * Método para obtener un solo Preventivo por ID de la colección "Preventivos" en el servidor Mongo
 */
export const getPreventivoByID = async (id: string): Promise<IPreventivo | undefined> => {
  try {
    let preventivosModel = preventivosEntity();
    let camposModel = camposEntity(); // Importar la entidad Campos

    // Buscar Preventivo por ID y poblar campos cualitativos, de mantenimiento, cuantitativos y otros
    return await preventivosModel
      .findById(id, { _id: 0 })
      .select('_id title codigo version fecha cualitativo mantenimiento cuantitativo otros')
      .populate({
        path: 'cualitativo mantenimiento cuantitativo.campo otros',
        model: camposModel,
        select: '_id id_tipo title valor',
      })
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Preventivo By ID: ${error}`);
  }
};
/**
 * Método para eliminar Preventivo por ID
 */
export const deletePreventivoByID = async (id: string): Promise<any | undefined> => {
  try {
    let preventivosModel = preventivosEntity();

    // Eliminar Preventivo por ID
    return await preventivosModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Preventivo By ID');
  }
};

/**
 * Método para actualizar Preventivo por ID
 */
export const updatePreventivoByID = async (id: string, preventivo: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const preventivosModel = preventivosEntity();

    // Actualizar Preventivo por ID
    await preventivosModel.findByIdAndUpdate(id, preventivo);

    response.success = true;
    response.message = "Preventivo updated successfully";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Preventivo ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the Preventivo",
    };
  }
};

/**
 * Método para crear Preventivo
 */
export const createPreventivo = async (preventivo: any): Promise<any | undefined> => {
  try {
    const preventivosModel = preventivosEntity();

    const newPreventivo = new preventivosModel(preventivo);
    await newPreventivo.save();

    return {
      success: true,
      message: "Preventivo created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Preventivo: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the Preventivo",
    };
  }
};
