import mongoose from "mongoose";
import { LogError } from "../../../../utils/logger";
import { cotizacionesEntity } from "../entities/Cotizaciones.entity";
import { ICotizacion } from "../interfaces/ICotizacion.interface";
import { clientEntity } from "../../../users/domain/entities/Client.entity";
import { ordenesEntity } from "../entities/Ordenes.entity";
import { userEntity } from "../../../users/domain/entities/User.entity";
import { cotizacionesEstadosEntity } from "../entities/Cotizaciones_Estados.entity";
import { repuestoEquipoEntity } from "../../../equipos/domain/entities/RepuestoEquipo.entity";

// CRUD Operations

/**
 * Método para obtener todas las cotizaciones de la colección "Cotizaciones" en el servidor Mongo con paginación.
 */
export const getAllCotizaciones = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let response: any = {};

    const cotizacionesModel = cotizacionesEntity();
    const clientModel = clientEntity();
    const ordenModel = ordenesEntity();
    const userModel = userEntity();
    const cotizacionEstadoModel = cotizacionesEstadosEntity();
    const repuestosModel = repuestoEquipoEntity();
    // Buscar todas las cotizaciones con paginación
    const cotizaciones: ICotizacion[] = await cotizacionesModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: 'id_cliente',
        model: clientModel,
      })
      .populate({
        path: 'id_orden',
        model: ordenModel,
      })
      .populate({
        path: 'id_creador',
        model: userModel,
        select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
      })
      .populate({
        path: 'id_cambiador',
        model: userModel,
        select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
      })
      .populate({
        path: 'id_estado',
        model: cotizacionEstadoModel,
      })
      .populate({
        path: 'ids_repuestos.id_repuesto',
        model: repuestosModel,
      })
      .exec() as ICotizacion[];

    response.cotizaciones = cotizaciones;

    // Contar documentos totales en la colección Cotizaciones
    await cotizacionesModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Cotizaciones: ${error}`);
  }
};

/**
 * Método para obtener una cotización por ID de la colección "Cotizaciones" en el servidor Mongo.
 */
export const getCotizacionByID = async (id: string): Promise<ICotizacion | undefined> => {
  try {
    const cotizacionesModel = cotizacionesEntity();
    const clientModel = clientEntity();
    const ordenModel = ordenesEntity();
    const userModel = userEntity();
    const cotizacionEstadoModel = cotizacionesEstadosEntity();
    const repuestosModel = repuestoEquipoEntity();
    // Buscar cotización por ID
    return await cotizacionesModel.findById(id)
    .populate({
      path: 'id_cliente',
      model: clientModel,
    })
    .populate({
      path: 'id_orden',
      model: ordenModel,
    })
    .populate({
      path: 'id_creador',
      model: userModel,
      select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
    })
    .populate({
      path: 'id_cambiador',
      model: userModel,
      select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
    })
    .populate({
      path: 'id_estado',
      model: cotizacionEstadoModel,
    })
    .populate({
      path: 'ids_repuestos.id_repuesto',
      model: repuestosModel,
    })
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Cotizacion By ID: ${error}`);
  }
};

/**
 * Método para eliminar una cotización por ID.
 */
export const deleteCotizacionByID = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const cotizacionesModel = cotizacionesEntity();

    // Eliminar cotización por ID
    await cotizacionesModel.deleteOne({ _id: id }).exec();
    return { success: true, message: "Cotización eliminada correctamente" };
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Cotizacion By ID: ' + error);
    return { success: false, message: "Error al eliminar la cotización" };
  }
};

/**
 * Método para actualizar una cotización por ID.
 */
export const updateCotizacionByID = async (id: string, cotizacionData: any): Promise<{ success: boolean; message: string }> => {
  try {
    const cotizacionesModel = cotizacionesEntity();

    // Actualizar cotización por ID
    await cotizacionesModel.findByIdAndUpdate(id, cotizacionData).exec();
    return { success: true, message: "Cotización actualizada correctamente" };
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Cotizacion ${id}: ${error}`);
    return { success: false, message: "Error al actualizar la cotización" };
  }
};

/**
 * Método para crear una nueva cotización.
 */
export const createCotizacion = async (cotizacionData: any): Promise<{ success: boolean; message: string }> => {
  try {
    const cotizacionesModel = cotizacionesEntity();

    const newCotizacion = new cotizacionesModel(cotizacionData);
    await newCotizacion.save();

    return { success: true, message: "Cotización creada correctamente" };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Cotizacion: ${error}`);
    return { success: false, message: "Error al crear la cotización" };
  }
};
