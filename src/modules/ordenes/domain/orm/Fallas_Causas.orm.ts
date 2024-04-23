import mongoose from "mongoose";
import { fallasCausasEntity } from "../entities/Fallas_Causas.entity";
import { LogError } from "../../../../utils/logger";
import { IFallas_Causas } from "../interfaces/IFallas_Causas.interface";

// CRUD

/**
 * Método para obtener todas las causas de fallas de la colección "Fallas_Causas" en el servidor Mongo con paginación.
 */
export const getAllFallasCausas = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const fallasCausasModel = fallasCausasEntity();
    let response: any = {};

    // Buscar todas las causas de fallas con paginación
    const fallasCausas: IFallas_Causas[] = await fallasCausasModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as IFallas_Causas[];

    response.fallasCausas = fallasCausas;

    // Contar documentos totales en la colección Fallas_Causas
    await fallasCausasModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Fallas Causas: ${error}`);
  }
};

/**
 * Método para obtener una causa de falla por ID de la colección "Fallas_Causas" en el servidor Mongo.
 */
export const getFallaCausaByID = async (id: string): Promise<IFallas_Causas | undefined> => {
  try {
    const fallasCausasModel = fallasCausasEntity();

    // Buscar causa de falla por ID
    return await fallasCausasModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Falla Causa By ID: ${error}`);
  }
};

/**
 * Método para eliminar una causa de falla por ID.
 */
export const deleteFallaCausaByID = async (id: string): Promise<any | undefined> => {
  try {
    const fallasCausasModel = fallasCausasEntity();

    // Eliminar causa de falla por ID
    return await fallasCausasModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Falla Causa By ID');
  }
};

/**
 * Método para actualizar una causa de falla por ID.
 */
export const updateFallaCausaByID = async (id: string, fallaCausa: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const fallasCausasModel = fallasCausasEntity();

    // Actualizar causa de falla por ID
    await fallasCausasModel.findByIdAndUpdate(id, fallaCausa);

    response.success = true;
    response.message = "Falla Causa actualizada correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Falla Causa ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar la Falla Causa",
    };
  }
};

/**
 * Método para crear una nueva causa de falla.
 */
export const createFallaCausa = async (fallaCausa: any): Promise<any | undefined> => {
  try {
    const fallasCausasModel = fallasCausasEntity();

    const newFallaCausa = new fallasCausasModel(fallaCausa);
    await newFallaCausa.save();

    return {
      success: true,
      message: "Falla Causa creada correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Falla Causa: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear la Falla Causa",
    };
  }
};
