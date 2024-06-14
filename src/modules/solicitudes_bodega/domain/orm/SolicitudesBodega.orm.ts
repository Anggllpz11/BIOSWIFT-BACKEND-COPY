import mongoose from "mongoose";
import { LogError } from "../../../../utils/logger";
import { ISolicitudBodega } from "../interfaces/ISolicitudBodega.interface";
import { solicitudesBodegaEntity } from "../entities/SolicitudesBodega.entity";
import { userEntity } from "../../../users/domain/entities/User.entity";
import { clientEntity } from "../../../users/domain/entities/Client.entity";
import { SolicitudesBodegaEstadosEntity } from "../entities/SolicitudesBodegaEstados.entity";
import { ordenesEntity } from "../../../ordenes/domain/entities/Ordenes.entity";
import { repuestoEquipoEntity } from "../../../equipos/domain/entities/RepuestoEquipo.entity";

// CRUD

export const getAllSolicitudesBodega = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let response: any = {};
    const userModel = userEntity();
    const solicitudesBodegaModel = solicitudesBodegaEntity();
    const clientModel = clientEntity();
    const ordenModel = ordenesEntity();
    const solicitudBodegaEstadoModel = SolicitudesBodegaEstadosEntity();
    const repuestosModel = repuestoEquipoEntity();

    const solicitudesBodega: ISolicitudBodega[] = await solicitudesBodegaModel
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
        path: 'id_estado',
        model: solicitudBodegaEstadoModel,
      })
     .populate({
        path: 'id_creador',
        model: userModel,
      })
     .populate({
        path: 'id_aprobador',
        model: userModel,
      })
     .populate({
        path: 'id_rechazador',
        model: userModel,
      })
     .populate({
        path: 'id_despachador',
        model: userModel,
      })
     .populate({
        path: 'id_finalizador',
        model: userModel,
      })
      .populate({
        path: 'ids_repuestos.id_repuesto',
        model: repuestosModel,
      })
     .exec() as ISolicitudBodega[];

    response.solicitudesBodega = solicitudesBodega;

    // Count total documents in the SolicitudesBodega collection
    await solicitudesBodegaModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All SolicitudesBodega: ${error}`);
  }
};

export const getSolicitudBodegaByID = async (id: string): Promise<ISolicitudBodega | undefined> => {
    const userModel = userEntity();
    const solicitudesBodegaModel = solicitudesBodegaEntity();
    const clientModel = clientEntity();
    const ordenModel = ordenesEntity();
    const solicitudBodegaEstadoModel = SolicitudesBodegaEstadosEntity();
    const repuestosModel = repuestoEquipoEntity();

  try {
    return await solicitudesBodegaEntity()
     .findById(id)
     .populate({
        path: 'id_cliente',
        model: clientModel,
      })
     .populate({
        path: 'id_orden',
        model: ordenModel,
      })
     .populate({
        path: 'id_estado',
        model: solicitudBodegaEstadoModel,
      })
     .populate({
        path: 'id_creador',
        model: userModel,
      })
     .populate({
        path: 'id_aprobador',
        model: userModel,
      })
     .populate({
        path: 'id_rechazador',
        model: userModel,
      })
     .populate({
        path: 'id_despachador',
        model: userModel,
      })
     .populate({
        path: 'id_finalizador',
        model: userModel,
      })
      .populate({
        path: 'ids_repuestos.id_repuesto',
        model: repuestosModel,
      })
      .populate({
        path: 'novedades.id_user',
        model: userModel,
      })
     .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining SolicitudBodega By ID: ${error}`);
  }
};

export const deleteSolicitudBodegaByID = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    await solicitudesBodegaEntity().deleteOne({ _id: id }).exec();
    return { success: true, message: "SolicitudBodega eliminada correctamente" };
  } catch (error) {
    LogError('[ORM ERROR]: Deleting SolicitudBodega By ID: ' + error);
    return { success: false, message: "Error al eliminar la solicitud" };
  }
};

export const updateSolicitudBodegaByID = async (id: string, solicitudBodegaData: any): Promise<{ success: boolean; message: string }> => {
  try {
    await solicitudesBodegaEntity().findByIdAndUpdate(id, solicitudBodegaData).exec();
    return { success: true, message: "SolicitudBodega actualizada correctamente" };
  } catch (error) {
    LogError(`[ORM ERROR]: Updating SolicitudBodega ${id}: ${error}`);
    return { success: false, message: "Error al actualizar la solicitud" };
  }
};

export const createSolicitudBodega = async (solicitudBodegaData: any): Promise<{ success: boolean; message: string }> => {
  try {
    const newSolicitudBodega = new (solicitudesBodegaEntity())(solicitudBodegaData);
    await newSolicitudBodega.save();
    return { success: true, message: "SolicitudBodega creada correctamente" };
  } catch (error) {
    LogError('[ORM ERROR]: Creating SolicitudBodega: ' + error);
    return { success: false, message: "Error al crear la solicitud" };
  }
};