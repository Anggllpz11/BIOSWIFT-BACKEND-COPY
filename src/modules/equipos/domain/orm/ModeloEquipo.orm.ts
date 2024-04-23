import mongoose from "mongoose";
import { modeloEquipoEntity } from "../entities/ModeloEquipo.entity";
import { LogError } from "../../../../utils/logger";
import { LogSuccess } from "../../../../utils/logger";
import { IModeloEquipo } from "../interfaces/IModeloEquipo.interface";
import { marcaEquipoEntity } from "../entities/MarcasEquipos.entity";
import { classDeviceEntity } from "../entities/ClassDevice.entity";
import { preventivosEntity } from "../../../procesos_&_protocolos/domain/entities/Preventivos.entity";

// CRUD

export const getAllModeloEquipos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let modeloEquipoModel = modeloEquipoEntity();
    let response: any = {};
    const marcaEquipo = marcaEquipoEntity();
    const claseEquipo = classDeviceEntity();
    const preventivoModel = preventivosEntity();
    const modeloEquipos: IModeloEquipo[] = await modeloEquipoModel
      .find({}, { _id: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id modelo precio id_marca id_clase')
      .populate({
        path: 'id_marca',
        model: marcaEquipo,
        select: 'marca',
      }) // Populate de la relación con Marcas_Equipos
      .populate({
        path: 'id_clase',
        model: claseEquipo,
        select: '_id clase id_preventivo', 
      }) // Populate de la relación con Clases_Equipos
      .populate({
        path: 'id_preventivo',
        model: preventivoModel,
        select: 'title codigo version fecha cualitativo mantenimiento cuantitativo otros',
      }) // Populate de la relación con Preventivos
      .exec() as IModeloEquipo[];

    response.modeloEquipos = modeloEquipos;

    const total = await modeloEquipoModel.countDocuments();
    response.totalPages = Math.ceil(total / limit);
    response.currentPage = page;

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All ModeloEquipos: ${error}`);
  }
};


export const getModeloEquipoByID = async (id: string): Promise<IModeloEquipo | undefined> => {
  try {
    let modeloEquipoModel = modeloEquipoEntity();
    const marcaEquipo = marcaEquipoEntity();
    const claseEquipo = classDeviceEntity();
    const preventivoModel = preventivosEntity();

    return await modeloEquipoModel.findById(id, { _id: 0 })
      .select('_id modelo precio id_marca id_clase') // Include id_marca y id_clase
      .populate({
        path: 'id_marca',
        model: marcaEquipo,
        select: '_id marca',
      }) // Populate de la relación con Marcas_Equipos
      .populate({
        path: 'id_clase',
        model: claseEquipo,
        select: '_id clase id_preventivo',
      }) // Populate de la relación con Clases_Equipos
      .populate({
        path: 'id_preventivo',
        model: preventivoModel,
        select: '_id title codigo version fecha cualitativo mantenimiento cuantitativo otros',
      }) // Populate de la relación con Preventivos
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Getting ModeloEquipo By ID: ${error}`);
  }
};

export const deleteModeloEquipoByID = async (id: string): Promise<any | undefined> => {
  try {
    let modeloEquipoModel = modeloEquipoEntity();

    return await modeloEquipoModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting ModeloEquipo By ID');
  }
};

export const createModeloEquipo = async (equipo: any): Promise<any | undefined> => {
  try {
    const modeloEquipoModel = modeloEquipoEntity();

    const newModeloEquipo = new modeloEquipoModel(equipo);
    await newModeloEquipo.save();

    return {
      success: true,
      message: "ModeloEquipo created successfully",
    };
  } catch (error) {
    LogError('[ORM ERROR]: Creating ModeloEquipo');
    return {
      success: false,
      message: "An error occurred while creating the ModeloEquipo",
    };
  }
};

export const updateModeloEquipoByID = async (id: string, equipo: any): Promise<any | undefined> => {
  try {
    const modeloEquipoModel = modeloEquipoEntity();

    return await modeloEquipoModel.findByIdAndUpdate(id, equipo, { new: true });
  } catch (error) {
    LogError(`[ORM ERROR]: Updating ModeloEquipo ${id}: ${error}`);
  }
};

