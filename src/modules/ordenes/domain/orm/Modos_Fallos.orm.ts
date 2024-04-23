import mongoose from "mongoose";
import { LogError } from "../../../../utils/logger";
import { IModos_Fallos } from "../interfaces/IModos_Fallos.interface";
import { modosFallosEntity } from "../entities/Modos_Fallos.entity";
import { falloSistemasEntity } from "../entities/Fallo_Sistemas.entity";

// CRUD

/**
 * Método para obtener todos los modos de fallos asociados a sistemas de fallos
 * de la colección "Modos_Fallos" en el servidor Mongo con paginación.
 */
export const getAllModosFallos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const modosFallosModel = modosFallosEntity();
    let response: any = {};
    let falloSistemaModel = falloSistemasEntity(); // Obtener el modelo de Fallo_Sistemas

    // Buscar todos los modos de fallos con paginación y poblar los detalles de Fallo_Sistemas
    const modosFallos: IModos_Fallos[] = await modosFallosModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: 'id_fallo_sistema', // Asegurarse de que este sea el nombre correcto del campo en el esquema Modos_Fallos
        model: falloSistemaModel, // Usar el modelo obtenido para el populate
        select: '_id name' // Seleccionar los campos que se quieren obtener de Fallo_Sistemas
      })
      .exec() as IModos_Fallos[];

    response.modosFallos = modosFallos;

    // Contar documentos totales en la colección Modos_Fallos
    await modosFallosModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Modos Fallos: ${error}`);
  }
};

/**
 * Método para obtener un modo de fallo por ID de la colección "Modos_Fallos" en el servidor Mongo.
 */
export const getModoFalloByID = async (id: string): Promise<IModos_Fallos | undefined> => {
  try {
    const modosFallosModel = modosFallosEntity();
    let falloSistemaModel = falloSistemasEntity(); // Obtener el modelo de Fallo_Sistemas

    // Buscar modo de fallo por ID y poblar los detalles de Fallo_Sistemas
    return await modosFallosModel
      .findById(id)
      .populate({
        path: 'id_fallo_sistema', // Asegurarse de que este sea el nombre correcto del campo en el esquema Modos_Fallos
        model: falloSistemaModel, // Usar el modelo obtenido para el populate
        select: '_id name' // Seleccionar los campos que se quieren obtener de Fallo_Sistemas
      })
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Modo Fallo By ID: ${error}`);
  }
};

/**
 * Método para eliminar un modo de fallo por ID.
 */
export const deleteModoFalloByID = async (id: string): Promise<any | undefined> => {
  try {
    const modosFallosModel = modosFallosEntity();

    // Eliminar modo de fallo por ID
    return await modosFallosModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Modo Fallo By ID');
  }
};

/**
 * Método para actualizar un modo de fallo por ID.
 */
export const updateModoFalloByID = async (id: string, modoFallo: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const modosFallosModel = modosFallosEntity();

    // Actualizar modo de fallo por ID
    await modosFallosModel.findByIdAndUpdate(id, modoFallo);

    response.success = true;
    response.message = "Modo Fallo actualizado correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Modo Fallo ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el Modo Fallo",
    };
  }
};

/**
 * Método para crear un nuevo modo de fallo.
 */
export const createModoFallo = async (modoFallo: any): Promise<any | undefined> => {
  try {
    const modosFallosModel = modosFallosEntity();

    const newModoFallo = new modosFallosModel(modoFallo);
    await newModoFallo.save();

    return {
      success: true,
      message: "Modo Fallo creado correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Modo Fallo: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear el Modo Fallo",
    };
  }
};
