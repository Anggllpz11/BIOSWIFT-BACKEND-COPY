import mongoose from "mongoose";
import { tipoEquipoEntity } from "../entities/TipoEquipo.entity";
import { LogError } from "../../../../utils/logger";
import { LogSuccess } from "../../../../utils/logger";
import { ITipoEquipo } from "../interfaces/ITipoEquipo.interface";

export const getAllTiposEquipos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let tipoEquipoModel = tipoEquipoEntity();
    let response: any = {};

    await tipoEquipoModel
      .find({}, { _id: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id tipo')
      .exec()
      .then((tiposEquipos: ITipoEquipo[]) => {
        response.tiposEquipos = tiposEquipos;
      });

    await tipoEquipoModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All TiposEquipos: ${error}`);
  }
};

export const getTipoEquipoByID = async (id: string): Promise<ITipoEquipo | undefined> => {
  try {
    let tipoEquipoModel = tipoEquipoEntity();

    return await tipoEquipoModel.findById(id).select('_id tipo').exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Getting TipoEquipo By ID: ${error}`);
  }
};

export const deleteTipoEquipoByID = async (id: string): Promise<any | undefined> => {
  try {
    let tipoEquipoModel = tipoEquipoEntity();

    return await tipoEquipoModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting TipoEquipo By ID');
  }
};

export const updateTipoEquipoByID = async (id: string, tipoEquipo: any): Promise<any | undefined> => {
  try {
    let tipoEquipoModel = tipoEquipoEntity();

    return await tipoEquipoModel.findByIdAndUpdate(id, tipoEquipo);
  } catch (error) {
    LogError(`[ORM ERROR]: Updating TipoEquipo ${id}: ${error}`);
  }
};

export const createTipoEquipo = async (tipoEquipo: any): Promise<any | undefined> => {
  try {
    const tipoEquipoModel = tipoEquipoEntity();

    const newTipoEquipo = new tipoEquipoModel(tipoEquipo);
    await newTipoEquipo.save();

    return {
      success: true,
      message: "TipoEquipo created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating TipoEquipo: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the tipo equipo",
    };
  }
};
