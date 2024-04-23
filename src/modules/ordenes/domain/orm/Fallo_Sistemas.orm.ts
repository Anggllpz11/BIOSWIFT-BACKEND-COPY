import mongoose from "mongoose";
import { falloSistemasEntity } from "../entities/Fallo_Sistemas.entity";
import { LogError } from "../../../../utils/logger";
import { IFallo_Sistemas } from "../interfaces/IFallo_Sistemas.interface";

// CRUD

/**
 * Método para obtener todos los sistemas de fallas de la colección "Fallo_Sistemas" en el servidor Mongo con paginación.
 */
export const getAllFalloSistemas = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const falloSistemasModel = falloSistemasEntity();
    let response: any = {};

    // Buscar todos los sistemas de fallas con paginación
    const falloSistemas: IFallo_Sistemas[] = await falloSistemasModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as IFallo_Sistemas[];

    response.falloSistemas = falloSistemas;

    // Contar documentos totales en la colección Fallo_Sistemas
    await falloSistemasModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Fallo Sistemas: ${error}`);
  }
};

/**
 * Método para obtener un sistema de falla por ID de la colección "Fallo_Sistemas" en el servidor Mongo.
 */
export const getFalloSistemaByID = async (id: string): Promise<IFallo_Sistemas | undefined> => {
  try {
    const falloSistemasModel = falloSistemasEntity();

    // Buscar sistema de falla por ID
    return await falloSistemasModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Fallo Sistema By ID: ${error}`);
  }
};

/**
 * Método para eliminar un sistema de falla por ID.
 */
export const deleteFalloSistemaByID = async (id: string): Promise<any | undefined> => {
  try {
    const falloSistemasModel = falloSistemasEntity();

    // Eliminar sistema de falla por ID
    return await falloSistemasModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Fallo Sistema By ID');
  }
};

/**
 * Método para actualizar un sistema de falla por ID.
 */
export const updateFalloSistemaByID = async (id: string, falloSistema: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const falloSistemasModel = falloSistemasEntity();

    // Actualizar sistema de falla por ID
    await falloSistemasModel.findByIdAndUpdate(id, falloSistema);

    response.success = true;
    response.message = "Fallo Sistema actualizado correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Fallo Sistema ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el Fallo Sistema",
    };
  }
};

/**
 * Método para crear un nuevo sistema de falla.
 */
export const createFalloSistema = async (falloSistema: any): Promise<any | undefined> => {
  try {
    const falloSistemasModel = falloSistemasEntity();

    const newFalloSistema = new falloSistemasModel(falloSistema);
    await newFalloSistema.save();

    return {
      success: true,
      message: "Fallo Sistema creado correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Fallo Sistema: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear el Fallo Sistema",
    };
  }
};
