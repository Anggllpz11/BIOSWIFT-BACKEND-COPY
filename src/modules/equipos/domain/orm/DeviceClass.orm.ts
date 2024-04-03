import mongoose, { model } from "mongoose";
import { classDeviceEntity } from "../entities/ClassDevice.entity";
import { LogError } from "../../../../utils/logger";
import { IClassDevice } from "../interfaces/IClassDevice.interface";
import { preventivosEntity } from "../../../procesos_&_protocolos/domain/entities/Preventivos.entity";

// Método para obtener todos los ClasesEquipos de la colección "Modelo_ClasesEquipos" en el servidor Mongo
export const getAllClasesEquipos = async (page: number, limit: number): Promise<any | undefined> => {
  try {
    let claseEquipoModel = classDeviceEntity();
    let response: any = {};
    let preventivoModel = preventivosEntity();
    // Buscar todas las clases de equipos (usando paginación)
    const clasesEquipos = await claseEquipoModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: 'id_preventivo',
        model: preventivoModel,
        select: 'title codigo version fecha cualitativo mantenimiento cuantitativo otros'
      }
        )
      .exec();

    response.clasesEquipos = clasesEquipos;
    response.totalPages = Math.ceil(await claseEquipoModel.countDocuments() / limit);
    response.currentPage = page;

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All ClasesEquipos: ${error}`);
  }
};

// Obtener ClaseEquipo por ID
export const getClaseEquipoByID = async (id: string): Promise<IClassDevice | undefined> => {
  try {
    let claseEquipoModel = classDeviceEntity();
    let preventivoModel = preventivosEntity();
    return await claseEquipoModel.findById(id)
    .populate({
      path: 'id_preventivo',
      model: preventivoModel,
      select: 'title codigo version fecha cualitativo mantenimiento cuantitativo otros'
    }
      )
    .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining ClaseEquipo By ID: ${error}`);
  }
};

// Eliminar ClaseEquipo por ID
export const deleteClaseEquipoByID = async (id: string): Promise<any | undefined> => {
  try {
    let claseEquipoModel = classDeviceEntity();
    return await claseEquipoModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting ClaseEquipo By ID');
  }
};

// Actualizar ClaseEquipo por ID
export const updateClaseEquipoByID = async (id: string, claseEquipo: any): Promise<any | undefined> => {
  try {
    let claseEquipoModel = classDeviceEntity();
    let preventivoModel = preventivosEntity();

    // Buscar el preventivo por título si se proporciona
    if (claseEquipo.id_preventivo) {
      const preventivo = await preventivoModel.findOne({ title: claseEquipo.id_preventivo });
      if (preventivo) {
        claseEquipo.id_preventivo = preventivo._id;
      } else {
        throw new Error("Preventivo not found");
      }
    }

    return await claseEquipoModel.findByIdAndUpdate(id, claseEquipo);
  } catch (error) {
    LogError(`[ORM ERROR]: Updating ClaseEquipo ${id}: ${error}`);
  }
};

// Crear ClaseEquipo
export const createClaseEquipo = async (claseEquipo: any): Promise<any | undefined> => {
  try {
    const claseEquipoModel = classDeviceEntity();
    const preventivoModel = preventivosEntity();

    // Buscar el preventivo por título si se proporciona
    if (claseEquipo.id_preventivo) {
      const preventivo = await preventivoModel.findOne({ title: claseEquipo.id_preventivo });
      if (preventivo) {
        claseEquipo.id_preventivo = preventivo._id;
      } else {
        throw new Error("Preventivo not found");
      }
    }

    const newClaseEquipo = new claseEquipoModel(claseEquipo);
    await newClaseEquipo.save();

    return {
      success: true,
      message: "ClaseEquipo created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating ClaseEquipo: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the clase equipo",
    };
  }
};
