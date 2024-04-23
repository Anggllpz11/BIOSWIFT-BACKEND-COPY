import mongoose from "mongoose";
import { camposEntity } from "../entities/Campos.entity";
import { LogError } from "../../../../utils/logger";
import { LogSuccess } from "../../../../utils/logger";
import { ICampos } from "../interfaces/ICampos.interface";
import { camposTiposEntity } from "../entities/Campos_Tipos.entity";

// CRUD

/**
 * Método para obtener todos los Campos de la colección "Campos" en el servidor Mongo
 */
export const getAllCampos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let camposModel = camposEntity();
    let camposTiposModel = camposTiposEntity(); // Importar la entidad Campos_Tipos
    let response: any = {};

    // Buscar todos los campos (usando paginación) y poblar 'id_tipo'
    const campos: ICampos[] = await camposModel
      .find({}, { _id: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id id_tipo title')
      .populate({
        path: 'id_tipo',
        model: camposTiposModel,
        select: '_id tipo nombre',
      })
      .exec() as unknown as ICampos[];

    response.campos = campos;

    // Contar documentos totales en la colección Campos
    await camposModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Campos: ${error}`);
  }
};

/**
 * Método para obtener un solo Campo por ID de la colección "Campos" en el servidor Mongo
 */
export const getCamposByID = async (id: string): Promise<ICampos | undefined> => {
  try {
    let camposModel = camposEntity();
    let camposTiposModel = camposTiposEntity();

    // Buscar Campo por ID y poblar 'id_tipo'
    return await camposModel
      .findById(id, { _id: 0 })
      .select('_id id_tipo title')
      .populate({
        path: 'id_tipo',
        model: camposTiposModel,
        select: '_id tipo nombre',
      })
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Campos By ID: ${error}`);
  }
};

/**
 * Método para eliminar Campo por ID
 */
export const deleteCamposByID = async (id: string): Promise<any | undefined> => {
  try {
    let camposModel = camposEntity();

    // Eliminar Campo por ID
    return await camposModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Campos By ID');
  }
};

/**
 * Método para actualizar Campo por ID
 */
export const updateCamposByID = async (id: string, campos: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const camposModel = camposEntity();

    // Actualizar Campo por ID
    await camposModel.findByIdAndUpdate(id, campos);

    response.success = true;
    response.message = "Campo updated successfully";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Campo ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the Campo",
    };
  }
};

/**
 * Método para crear Campo
 */
export const createCampos = async (campos: any): Promise<any | undefined> => {
  try {
    const camposModel = camposEntity();

    const newCampos = new camposModel(campos);
    await newCampos.save();

    return {
      success: true,
      message: "Campo created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Campo: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the Campo",
    };
  }
};
