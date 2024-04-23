// Cotizaciones_Estados.orm.ts

import { cotizacionesEstadosEntity } from "../entities/Cotizaciones_Estados.entity";
import { LogError } from "../../../../utils/logger";
import { ICotizaciones_Estados } from "../interfaces/ICotizaciones_Estados.interface";

export const getAllCotizacionesEstados = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const cotizacionesEstadosModel = cotizacionesEstadosEntity();
    let response: any = {};

    const cotizacionesEstados: ICotizaciones_Estados[] = await cotizacionesEstadosModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();

    response.cotizacionesEstados = cotizacionesEstados;

    await cotizacionesEstadosModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Cotizaciones Estados: ${error}`);
  }
};

export const getCotizacionEstadoByID = async (id: string): Promise<ICotizaciones_Estados | undefined> => {
  try {
    const cotizacionesEstadosModel = cotizacionesEstadosEntity();
    return await cotizacionesEstadosModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Cotizacion Estado By ID: ${error}`);
  }
};

export const deleteCotizacionEstadoByID = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    const cotizacionesEstadosModel = cotizacionesEstadosEntity();
    await cotizacionesEstadosModel.deleteOne({ _id: id }).exec();
    return { success: true, message: "Cotizacion Estado deleted successfully" };
  } catch (error) {
    LogError(`[ORM ERROR]: Deleting Cotizacion Estado By ID: ${error}`);
    return { success: false, message: "Error deleting Cotizacion Estado" };
  }
};

export const updateCotizacionEstadoByID = async (id: string, cotizacionEstadoData: any): Promise<{ success: boolean; message: string }> => {
  try {
    const cotizacionesEstadosModel = cotizacionesEstadosEntity();
    await cotizacionesEstadosModel.findByIdAndUpdate(id, cotizacionEstadoData).exec();
    return { success: true, message: "Cotizacion Estado updated successfully" };
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Cotizacion Estado ${id}: ${error}`);
    return { success: false, message: "Error updating Cotizacion Estado" };
  }
};

export const createCotizacionEstado = async (cotizacionEstadoData: any): Promise<{ success: boolean; message: string }> => {
  try {
    const cotizacionesEstadosModel = cotizacionesEstadosEntity();
    const newCotizacionEstado = new cotizacionesEstadosModel(cotizacionEstadoData);
    await newCotizacionEstado.save();
    return { success: true, message: "Cotizacion Estado created successfully" };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Cotizacion Estado: ${error}`);
    return { success: false, message: "Error creating Cotizacion Estado" };
  }
};
