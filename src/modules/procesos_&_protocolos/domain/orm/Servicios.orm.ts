import mongoose from "mongoose";
import { serviciosEntity } from "../entities/Servicios.entity";
import { LogError } from "../../../../utils/logger";
import { LogSuccess } from "../../../../utils/logger";
import { IServicios } from "../interfaces/IServicios.interface";

// CRUD

/**
 * Método para obtener todos los Servicios de la colección "Servicios" en el servidor Mongo
 */
export const getAllServicios = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let serviciosModel = serviciosEntity();
    let response: any = {};

    // Buscar todos los servicios (usando paginación)
    const servicios: IServicios[] = await serviciosModel
      .find({})
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as unknown as IServicios[];

    response.servicios = servicios;

    // Contar documentos totales en la colección Servicios
    const total = await serviciosModel.countDocuments();
    response.totalPages = Math.ceil(total / limit);
    response.currentPage = page;

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Servicios: ${error}`);
  }
};

/**
 * Método para obtener un solo Servicio por ID de la colección "Servicios" en el servidor Mongo
 */
export const getServicioByID = async (id: string): Promise<IServicios | undefined> => {
  try {
    let serviciosModel = serviciosEntity();

    // Buscar Servicio por ID
    return await serviciosModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Servicio By ID: ${error}`);
  }
};

/**
 * Método para eliminar Servicio por ID
 */
export const deleteServicioByID = async (id: string): Promise<any | undefined> => {
  try {
    let serviciosModel = serviciosEntity();

    // Eliminar Servicio por ID
    return await serviciosModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Servicio By ID');
  }
};

/**
 * Método para actualizar Servicio por ID
 */
export const updateServicioByID = async (id: string, servicioData: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const serviciosModel = serviciosEntity();

    // Actualizar Servicio por ID
    await serviciosModel.findByIdAndUpdate(id, servicioData);

    response.success = true;
    response.message = "Servicio updated successfully";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Servicio ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the Servicio",
    };
  }
};

/**
 * Método para crear Servicio
 */
export const createServicio = async (servicioData: any): Promise<{ success: boolean; message: string }> => {
  try {
    const serviciosModel = serviciosEntity();

    const newServicio = new serviciosModel(servicioData);
    await newServicio.save();

    return {
      success: true,
      message: "Servicio created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Servicio: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the Servicio",
    };
  }
};
