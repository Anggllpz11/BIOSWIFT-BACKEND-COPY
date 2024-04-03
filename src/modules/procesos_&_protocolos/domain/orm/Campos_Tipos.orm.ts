import mongoose from "mongoose";
import { camposTiposEntity } from "../entities/Campos_Tipos.entity";
import { LogError, LogSuccess } from "../../../../utils/logger";
import { ICampos_Tipos } from "../interfaces/ICampos_Tipos.interface";

// CRUD

/**
 * Método para obtener todos los Campos_Tipos de la colección "Campos_Tipos" en el servidor Mongo
 */
export const getAllCamposTipos = async (page: number, limit: number): Promise<{ camposTipos: ICampos_Tipos[]; totalPages: number; currentPage: number } | undefined> => {
  try {
    const camposTiposModel = camposTiposEntity();
    let response: any = {};

    // Search all camposTipos (using pagination)
    const camposTipos: ICampos_Tipos[] = await camposTiposModel
      .find({})
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

    response.camposTipos = camposTipos;

    // Count total documents in Campos_Tipos collection
    await camposTiposModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Campos_Tipos: ${error}`);
  }
};
/**
 * Método para obtener un solo Campos_Tipos por ID de la colección "Campos_Tipos" en el servidor Mongo
 */
export const getCamposTiposByID = async (id: string): Promise<ICampos_Tipos | undefined> => {
  try {
    const camposTiposModel = camposTiposEntity();
    return await camposTiposModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Campos_Tipos By ID: ${error}`);
  }
};

/**
 * Método para eliminar Campos_Tipos por ID
 */
export const deleteCamposTiposByID = async (id: string): Promise<any | undefined> => {
  try {
    const camposTiposModel = camposTiposEntity();
    return await camposTiposModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Campos_Tipos By ID');
  }
};

/**
 * Método para actualizar Campos_Tipos por ID
 */
export const updateCamposTiposByID = async (id: string, camposTipos: any): Promise<{ success: boolean; message: string }> => {
  try {
    const response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const camposTiposModel = camposTiposEntity();

    // Actualizar Campos_Tipos por ID
    await camposTiposModel.findByIdAndUpdate(id, camposTipos);

    response.success = true;
    response.message = "Campos_Tipos updated successfully";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Campos_Tipos ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the Campos_Tipos",
    };
  }
};

/**
 * Método para crear Campos_Tipos
 */
export const createCamposTipos = async (camposTipos: any): Promise<any | undefined> => {
  try {
    const camposTiposModel = camposTiposEntity();
    const newCamposTipos = new camposTiposModel(camposTipos);
    await newCamposTipos.save();
    return {
      success: true,
      message: "Campos_Tipos created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Campos_Tipos: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the Campos_Tipos",
    };
  }
};
