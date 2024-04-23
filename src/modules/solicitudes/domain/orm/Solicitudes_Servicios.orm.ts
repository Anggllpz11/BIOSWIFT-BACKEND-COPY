import mongoose from "mongoose";
import { solicitudesServiciosEntity } from "../entities/Solicitudes_Servicios.entity";
import { LogError, LogWarning } from "../../../../utils/logger";
import { ISolicitudServicio } from "../interfaces/Solicitudes_Servicios.interface";
import { userEntity } from "../../../users/domain/entities/User.entity";
import { serviciosEntity } from "../../../procesos_&_protocolos/domain/entities/Servicios.entity";
import { SolicitudesEstadosEntity } from "../../../procesos_&_protocolos/domain/entities/SolicitudesEstados.entity";
import { equipoEntity } from "../../../equipos/domain/entities/Equipo.entity";
import { modeloEquipoEntity } from "../../../equipos/domain/entities/ModeloEquipo.entity";
import { classDeviceEntity } from "../../../equipos/domain/entities/ClassDevice.entity";
import { sedeEntity } from "../../../users/domain/entities/Sede.entity";
import { clientEntity } from "../../../users/domain/entities/Client.entity";
import { marcaEquipoEntity } from "../../../equipos/domain/entities/MarcasEquipos.entity";
import { areaEquipoEntity } from "../../../equipos/domain/entities/AreaEquipo.entity";
import { tipoEquipoEntity } from "../../../equipos/domain/entities/TipoEquipo.entity";

// CRUD

// Método para obtener todas las Solicitudes de Servicios con paginación y población
export const getAllSolicitudesServicios = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let solicitudServicioModel = solicitudesServiciosEntity();
    let userModel = userEntity();
    let serviciosModel = serviciosEntity();
    let solicitudesEstadosModel = SolicitudesEstadosEntity();
    let equipoModel = equipoEntity();
    let equipoModeloModel = modeloEquipoEntity();
    let claseEquipoModel = classDeviceEntity();
    let sedeModel = sedeEntity();
    let clientModel = clientEntity();
    let response: any = {};

    // Buscar todas las solicitudes de servicios con paginación y poblar campos relacionados
    const solicitudesServicios: ISolicitudServicio[] = await solicitudServicioModel
      .find({}, { _id: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id id_creador id_servicio id_solicitud_estado id_equipo id_cambiador creacion aviso cambio_estado observacion observacion_estado')
      .populate({
        path: 'id_creador',
        model: userModel,
        select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
      })
      .populate({
        path: 'id_servicio',
        model: serviciosModel,
        select: 'servicio',
      })
      .populate({
        path: 'id_solicitud_estado',
        model: solicitudesEstadosModel,
        select: 'estado',
      })
      .populate({
        path: 'id_equipo',
        select: 'id_sede modelo_equipos id_area id_tipo serie ubicacion frecuencia activo_fijo mtto',
        populate: [{ // Aquí es donde realizas un populate anidado.
          path: 'modelo_equipos',
          select: '_id modelo precio id_clase id_preventivo',
          model: equipoModeloModel,
          populate: {
            path: 'id_clase',
            select: '_id clase id_preventivo',
            model: claseEquipoModel,
          }
        }, {
          path: 'id_sede',
          select: '_id sede_nombre sede_address sede_telefono sede_email id_client',
          model: sedeModel,
          populate: {
            path: 'id_client',
            select: '_id client_name client_nit client_address client_telefono client_email',
            model: clientModel,
          }
        }]
      })
      .populate({
        path: 'id_cambiador',
        model: userModel,
        select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
      })
      .exec() as unknown as ISolicitudServicio[];

    response.solicitudesServicios = solicitudesServicios;

    await solicitudServicioModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Solicitudes Servicios: ${error}`);
  }
};

// Método para obtener una Solicitud de Servicio por ID con población
export const getSolicitudServicioByID = async (id: string): Promise<ISolicitudServicio | null | undefined> => {
  try {
    let solicitudServicioModel = solicitudesServiciosEntity();
    let userModel = userEntity();
    let serviciosModel = serviciosEntity();
    let solicitudesEstadosModel = SolicitudesEstadosEntity();
    let equipoModel = equipoEntity();
    let equipoModeloModel = modeloEquipoEntity();
    let claseEquipoModel = classDeviceEntity();
    let sedeModel = sedeEntity();
    let clientModel = clientEntity();
    let marcaEquipoModel = marcaEquipoEntity();
    let areaEquipoModel = areaEquipoEntity();
    let tipoEquipoModel = tipoEquipoEntity();
    let response: any = {};

    // Buscar solicitud de servicio por ID y poblar campos relacionados
    return await solicitudServicioModel
      .findById(id, { _id: 0 })
      .select('_id id_creador id_servicio id_solicitud_estado id_equipo id_cambiador creacion aviso cambio_estado observacion observacion_estado')
      .populate({
        path: 'id_creador',
        model: userModel,
        select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
      })
      .populate({
        path: 'id_servicio',
        model: serviciosModel,
        select: 'servicio',
      })
      .populate({
        path: 'id_solicitud_estado',
        model: solicitudesEstadosModel,
        select: 'estado',
      })
      .populate({
        path: 'id_equipo',
        select: 'id_sede modelo_equipos id_area id_tipo serie ubicacion frecuencia activo_fijo mtto',
        populate: [{ // Aquí es donde realizas un populate anidado.
          path: 'modelo_equipos',
          select: '_id modelo precio id_clase id_preventivo id_marca id_preventivo',
          model: equipoModeloModel,
          populate: [{
            path: 'id_clase',
            select: '_id clase id_preventivo',
            model: claseEquipoModel,
          },
          {
            path: 'id_marca',
            select: '_id marca',
            model: marcaEquipoModel,
          }
        ]
        }, {
          path: 'id_sede',
          select: '_id sede_nombre sede_address sede_telefono sede_email id_client',
          model: sedeModel,
          populate: {
            path: 'id_client',
            select: '_id client_name client_nit client_address client_telefono client_email',
            model: clientModel,
          }
        },{
          path: 'id_area',
          select: '_id area',
          model: areaEquipoModel,
        },
        {
          path: 'id_tipo',
          select: '_id tipo',
          model: tipoEquipoModel,
        }

      ]
      })
      .populate({
        path: 'id_cambiador',
        model: userModel,
        select: '_id number username name cedula telefono email more_info roles type titulo reg_invima',
      })
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Solicitud Servicio By ID: ${error}`);
  }
};

// Método para eliminar una Solicitud de Servicio por ID
export const deleteSolicitudServicioByID = async (id: string): Promise<any | undefined> => {
  try {
    const solicitudServicioModel = solicitudesServiciosEntity();

    // Eliminar la Solicitud de Servicio por ID
    return await solicitudServicioModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Solicitud Servicio By ID');
  }
};


// Método para actualizar una Solicitud de Servicio por ID
export const updateSolicitudServicioByID = async (id: string, solicitudServicioData: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const solicitudServicioModel = solicitudesServiciosEntity();
    const userModel = userEntity();
    const serviciosModel = serviciosEntity();
    const solicitudesEstadosModel = SolicitudesEstadosEntity();
    const equipoModel = equipoEntity();

    // Verificar si los ObjectIds existen en sus respectivas colecciones
    if (!await userModel.findById(solicitudServicioData.id_creador)) {
      return { success: false, message: "Creador not found" };
    }
    if (!await serviciosModel.findById(solicitudServicioData.id_servicio)) {
      return { success: false, message: "Servicio not found" };
    }
    if (!await solicitudesEstadosModel.findById(solicitudServicioData.id_solicitud_estado)) {
      return { success: false, message: "Solicitud Estado not found" };
    }
    if (!await equipoModel.findById(solicitudServicioData.id_equipo)) {
      return { success: false, message: "Equipo not found" };
    }

    // Actualizar la Solicitud de Servicio por ID
    const updatedSolicitudServicio = await solicitudServicioModel.findByIdAndUpdate(id, solicitudServicioData, { new: true });

    if (!updatedSolicitudServicio) {
      return { success: false, message: `Solicitud Servicio with ID ${id} not found` };
    }

    response.success = true;
    response.message = "Solicitud de Servicio updated successfully";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Solicitud Servicio ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the Solicitud de Servicio",
    };
  }
};


// Método para crear una Solicitud de Servicio
export const createSolicitudServicio = async (solicitudServicioData: any): Promise<{ success: boolean; message: string }> => {
  try {
      let response: { success: boolean; message: string } = {
          success: false,
          message: "",
      };

      const solicitudServicioModel = solicitudesServiciosEntity();
      const userModel = userEntity();
      const serviciosModel = serviciosEntity();
      const solicitudesEstadosModel = SolicitudesEstadosEntity();
      const equipoModel = equipoEntity();

      // Verificar si el creador existe
      if (!await userModel.findById(solicitudServicioData.id_creador)) {
          return { success: false, message: "Creador not found" };
      }

      // Verificar si el servicio existe
      if (!await serviciosModel.findById(solicitudServicioData.id_servicio)) {
          return { success: false, message: "Servicio not found" };
      }

      // Verificar si el estado de solicitud existe
      if (!await solicitudesEstadosModel.findById(solicitudServicioData.id_solicitud_estado)) {
          return { success: false, message: "Solicitud Estado not found" };
      }

      // Verificar si el equipo existe
      if (!await equipoModel.findById(solicitudServicioData.id_equipo)) {
          return { success: false, message: "Equipo not found" };
      }

      // Verificar si el cambiador existe
      if (solicitudServicioData.id_cambiador && !await userModel.findById(solicitudServicioData.id_cambiador)) {
          return { success: false, message: "Cambiador not found" };
      }

      // Crear la Solicitud de Servicio
      const newSolicitudServicio = new solicitudServicioModel(solicitudServicioData);
      await newSolicitudServicio.save();

      response.success = true;
      response.message = "Solicitud de Servicio created successfully";
      return response;
  } catch (error) {
      LogError(`[ORM ERROR]: Creating Solicitud Servicio: ${error}`);
      return {
          success: false,
          message: "An error occurred while creating the Solicitud de Servicio",
      };
  }
};
