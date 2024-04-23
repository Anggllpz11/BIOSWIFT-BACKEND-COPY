// Visitas.orm.ts

import mongoose from "mongoose";
import { LogError } from "../../../../utils/logger";
import { IVisitas } from "../interfaces/IVisitas.interface";
import { visitasEntity } from "../entities/Visitas.entity";
import { visitasEstadosEntity } from "../entities/Visitas_Estados.entity";
import { userEntity } from "../../../users/domain/entities/User.entity";
import { protocolosEntity } from "../../../procesos_&_protocolos/domain/entities/Protocolos.entity";
import { camposEntity } from "../../../procesos_&_protocolos/domain/entities/Campos.entity";
import { ordenesEntity } from "../../../ordenes/domain/entities/Ordenes.entity";
import { solicitudesServiciosEntity } from "../../../solicitudes/domain/entities/Solicitudes_Servicios.entity";
import { equipoEntity } from "../../../equipos/domain/entities/Equipo.entity";
import { sedeEntity } from "../../../users/domain/entities/Sede.entity";
import { clientEntity } from "../../../users/domain/entities/Client.entity";
import { repuestoEquipoEntity } from "../../../equipos/domain/entities/RepuestoEquipo.entity";
import { modeloEquipoEntity } from "../../../equipos/domain/entities/ModeloEquipo.entity";
import { preventivosEntity } from "../../../procesos_&_protocolos/domain/entities/Preventivos.entity";
import { camposTiposEntity } from "../../../procesos_&_protocolos/domain/entities/Campos_Tipos.entity";

// CRUD

/**
 * Método para obtener todas las visitas con paginación y poblar todas las relaciones
 */
export const getAllVisitas = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let response: any = {};
    const visitaModel = visitasEntity();
    const visitaEstadoModel = visitasEstadosEntity();
    const userModel = userEntity();
    const protocoloModel = protocolosEntity();
    const campoModel = camposEntity();
    const ordenModel = ordenesEntity();
    const solicitudServicioModel = solicitudesServiciosEntity();
    const equipoModel = equipoEntity();
    const sedeModel = sedeEntity();
    const clienteModel = clientEntity();
    const repuestoModel = repuestoEquipoEntity();
    const visitas: IVisitas[] = await visitaModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: 'id_visita_estado',
        model: visitaEstadoModel
      })
      .populate({
        path: 'id_responsable',
        model: userModel
      })
      .populate({
        path: 'id_creador',
        model: userModel
      })
      .populate({
        path: 'id_aprobador',
        model: userModel
      })
      .populate({
        path: 'id_cerrador',
        model: userModel
      })
      .populate({
        path: 'ids_protocolos',
        model: protocoloModel
      })
      .populate({
        path: 'id_orden',
        model: ordenModel,
        populate: {
          path: 'id_solicitud_servicio',
          model: solicitudServicioModel,
          populate: {
            path: 'id_equipo',
            model: equipoModel,
            populate: {
              path: 'id_sede',
              model: sedeModel,
              populate: {
                path: 'id_client',
                model: clienteModel,
                
              }
            }
          }
        }
      })
      .populate({
        path: 'actividades.id_protocolo',
        model: protocoloModel
      })
      .populate({
        path: 'actividades.id_repuesto',
        model: repuestoModel
      })
      .populate({
        path: 'actividades.ids_campos_preventivo.id_campo',
        model: campoModel
      })
      
      .exec() as IVisitas[];

    response.visitas = visitas;

    // Contar documentos totales en la colección Visitas
    await visitaModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Visitas: ${error}`);
  }
};

/**
 * Método para obtener una visita por ID y poblar todas las relaciones
 */
export const getVisitaByID = async (id: string): Promise<IVisitas | undefined> => {
  try {
    const visitaModel = visitasEntity();
    const visitaEstadoModel = visitasEstadosEntity();
    const userModel = userEntity();
    const protocoloModel = protocolosEntity();
    const campoModel = camposEntity();
    const ordenModel = ordenesEntity();
    const solicitudServicioModel = solicitudesServiciosEntity();
    const equipoModel = equipoEntity();
    const sedeModel = sedeEntity();
    const clienteModel = clientEntity();
    const repuestoModel = repuestoEquipoEntity();
    const modeloEquipoModel = modeloEquipoEntity();
    const preventivoModel = preventivosEntity();
    const camposModel = camposEntity(); // Importar la entidad Campos
    const camposTipoModel = camposTiposEntity();
    return await visitaModel
      .findById(id)
      .populate({
        path: 'id_visita_estado',
        model: visitaEstadoModel
      })
      .populate({
        path: 'id_responsable',
        model: userModel
      })
      .populate({
        path: 'id_creador',
        model: userModel
      })
      .populate({
        path: 'id_aprobador',
        model: userModel
      })
      .populate({
        path: 'id_cerrador',
        model: userModel
      })
      .populate({
        path: 'ids_protocolos',
        model: protocoloModel
      })
      .populate({
        path: 'id_orden',
        model: ordenModel,
        populate: {
          path: 'id_solicitud_servicio',
          model: solicitudServicioModel,
          populate: {
            path: 'id_equipo',
            model: equipoModel,
            populate: [{
              path: 'id_sede',
              model: sedeModel,
              populate: {
                path: 'id_client',
                model: clienteModel,
                
              }
            },
          {
            path: 'modelo_equipos',
            model: modeloEquipoModel,
            populate: {
              path: 'id_preventivo',
              model: preventivoModel,
              populate: {
                path: 'cualitativo mantenimiento cuantitativo.campo otros',
                model: camposModel,
                populate: {
                  path: 'id_tipo',
                  model: camposTipoModel,
                }
             }
              
            }
          }
          ]
          }
        }
      })
      .populate({
        path: 'actividades.id_protocolo',
        model: protocoloModel
      })
      .populate({
        path: 'actividades.id_repuesto',
        model: repuestoModel
      })
      .populate({
        path: 'actividades.ids_campos_preventivo.id_campo',
        model: campoModel
      })
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Visita By ID: ${error}`);
  }
};

// Métodos para eliminar, actualizar y crear visitas siguiendo la misma lógica de población de relaciones

/**
 * Método para eliminar una visita por ID.
 */
export const deleteVisitaByID = async (id: string): Promise<{ success: boolean; message: string }> => {
  try {
    await visitasEntity().deleteOne({ _id: id }).exec();
    return { success: true, message: "Visita eliminada correctamente" };
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Visita By ID: ' + error);
    return { success: false, message: "Error al eliminar la visita" };
  }
};

/**
 * Método para actualizar una visita por ID.
 */
export const updateVisitaByID = async (id: string, visitaData: any): Promise<{ success: boolean; message: string }> => {
  try {
    await visitasEntity().findByIdAndUpdate(id, visitaData).exec();
    return { success: true, message: "Visita actualizada correctamente" };
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Visita ${id}: ${error}`);
    return { success: false, message: "Error al actualizar la visita" };
  }
};

/**
 * Método para crear una nueva visita.
 */
export const createVisita = async (visitaData: any): Promise<{ success: boolean; message: string; visitaId?: string }> => {
  try {
    const newVisita = new (visitasEntity())(visitaData);
    const savedVisita = await newVisita.save();
    return { success: true, message: "Visita creada correctamente", visitaId: savedVisita._id };
  } catch (error) {
    LogError('[ORM ERROR]: Creating Visita: ' + error);
    return { success: false, message: "Error al crear la visita" };
  }
};
