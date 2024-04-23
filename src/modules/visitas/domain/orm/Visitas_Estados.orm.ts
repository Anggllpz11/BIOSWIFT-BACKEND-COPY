import mongoose from "mongoose";
import { visitasEstadosEntity } from "../entities/Visitas_Estados.entity";
import { LogError } from "../../../../utils/logger";
import { IVisitas_Estados } from "../interfaces/IVisitas_Estados.interface";

// CRUD

/**
 * Método para obtener todos los estados de las visitas de la colección "Visitas_Estados" en el servidor Mongo con paginación.
 */
export const getAllVisitasEstados = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const visitasEstadosModel = visitasEstadosEntity();
    let response: any = {};

    // Buscar todos los estados de las visitas con paginación
    const visitasEstados: IVisitas_Estados[] = await visitasEstadosModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as IVisitas_Estados[];

    response.visitasEstados = visitasEstados;

    // Contar documentos totales en la colección Visitas_Estados
    await visitasEstadosModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Visitas Estados: ${error}`);
  }
};

/**
 * Método para obtener un estado de visita por ID de la colección "Visitas_Estados" en el servidor Mongo.
 */
export const getVisitaEstadoByID = async (id: string): Promise<IVisitas_Estados | undefined> => {
  try {
    const visitasEstadosModel = visitasEstadosEntity();

    // Buscar estado de visita por ID
    return await visitasEstadosModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Visita Estado By ID: ${error}`);
  }
};

/**
 * Método para eliminar un estado de visita por ID.
 */
export const deleteVisitaEstadoByID = async (id: string): Promise<any | undefined> => {
  try {
    const visitasEstadosModel = visitasEstadosEntity();

    // Eliminar estado de visita por ID
    return await visitasEstadosModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Visita Estado By ID');
  }
};

/**
 * Método para actualizar un estado de visita por ID.
 */
export const updateVisitaEstadoByID = async (id: string, visitaEstado: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const visitasEstadosModel = visitasEstadosEntity();

    // Actualizar estado de visita por ID
    await visitasEstadosModel.findByIdAndUpdate(id, visitaEstado);

    response.success = true;
    response.message = "Visita Estado actualizado correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Visita Estado ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el Visita Estado",
    };
  }
};

/**
 * Método para crear un nuevo estado de visita.
 */
export const createVisitaEstado = async (visitaEstado: any): Promise<any | undefined> => {
  try {
    const visitasEstadosModel = visitasEstadosEntity();

    const newVisitaEstado = new visitasEstadosModel(visitaEstado);
    await newVisitaEstado.save();

    return {
      success: true,
      message: "Visita Estado creado correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Visita Estado: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear el Visita Estado",
    };
  }
};
