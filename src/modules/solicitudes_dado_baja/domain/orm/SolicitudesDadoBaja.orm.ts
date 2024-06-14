// SolicitudesDadoBaja.orm.ts
import mongoose from "mongoose";
import { LogError } from "../../../../utils/logger";
import { ISolicitudesDadoBaja } from "../interfaces/ISolicitudesDadoBaja.interface";
import { SolicitudesDadoBajaModel } from "../entities/SolicitudesDadoBaja.entity";
import { userEntity } from "../../../users/domain/entities/User.entity";
import { clientEntity } from "../../../users/domain/entities/Client.entity";
import { ordenesEntity } from "../../../ordenes/domain/entities/Ordenes.entity";
import { SolicitudesDadoBajaEstadosEntity } from "../entities/SolicitudesDadoBajaEstados.entity";

// CRUD

export const getAllSolicitudesDadoBaja = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let response: any = {};
    const userModel = userEntity();
    const clientModel = clientEntity();
    const ordenModel = ordenesEntity();
    const solicitudBajaEstadoModel = SolicitudesDadoBajaEstadosEntity();
    const solicitudesDadoBaja: ISolicitudesDadoBaja[] = await SolicitudesDadoBajaModel
     .find()
     .limit(limit)
     .skip((page - 1) * limit)
     .populate({
        path: 'id_solicitud_baja_estado',
        model: solicitudBajaEstadoModel,
      })
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
      })
      .populate({
        path: 'id_cambiador',
        model: userModel,
      })
     .exec() as ISolicitudesDadoBaja[];

    response.solicitudesDadoBaja = solicitudesDadoBaja;

    // Count total documents in the SolicitudesDadoBaja collection
    const total = await SolicitudesDadoBajaModel.countDocuments();
    response.totalPages = Math.ceil(total / limit);
    response.currentPage = page;

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All SolicitudesDadoBaja: ${error}`);
  }
};

export const getSolicitudesDadoBajaByID = async (id: string): Promise<ISolicitudesDadoBaja | undefined> => {
    const userModel = userEntity();
    const clientModel = clientEntity();
    const ordenModel = ordenesEntity();
    const solicitudBajaEstadoModel = SolicitudesDadoBajaEstadosEntity();
    try {
    return await SolicitudesDadoBajaModel
     .findById(id)
     .populate({
        path: 'id_solicitud_baja_estado',
        model: solicitudBajaEstadoModel,
      })
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
      })
      .populate({
        path: 'id_cambiador',
        model: userModel,
      })
     .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining SolicitudesDadoBaja By ID: ${error}`);
  }
};

export const deleteSolicitudesDadoBajaByID = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    await SolicitudesDadoBajaModel.deleteOne({ _id: id }).exec();
    return { success: true, message: "SolicitudesDadoBaja eliminada correctamente" };
  } catch (error) {
    LogError('[ORM ERROR]: Deleting SolicitudesDadoBaja By ID: ' + error);
    return { success: false, message: "Error al eliminar la solicitud" };
  }
};

export const updateSolicitudesDadoBajaByID = async (id: string, solicitudDadoBajaData: any): Promise<{ success: boolean; message: string }> => {
  try {
    await SolicitudesDadoBajaModel.findByIdAndUpdate(id, solicitudDadoBajaData).exec();
    return { success: true, message: "SolicitudesDadoBaja actualizada correctamente" };
  } catch (error) {
    LogError(`[ORM ERROR]: Updating SolicitudesDadoBaja ${id}: ${error}`);
    return { success: false, message: "Error al actualizar la solicitud" };
  }
};

export const createSolicitudesDadoBaja = async (solicitudDadoBajaData: any): Promise<{ success: boolean; message: string }> => {
  try {
    const newSolicitudesDadoBaja = new SolicitudesDadoBajaModel(solicitudDadoBajaData);
    await newSolicitudesDadoBaja.save();
    return { success: true, message: "SolicitudesDadoBaja creada correctamente" };
  } catch (error) {
    LogError('[ORM ERROR]: Creating SolicitudesDadoBaja: ' + error);
    return { success: false, message: "Error al crear la solicitud" };
  }
};
