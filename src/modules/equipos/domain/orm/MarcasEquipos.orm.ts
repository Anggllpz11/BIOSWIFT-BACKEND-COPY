import mongoose from "mongoose";
import { marcaEquipoEntity } from "../entities/MarcasEquipos.entity";
import { LogError } from "../../../../utils/logger";
import { IMarcaEquipo } from "../interfaces/IMarcaEquipo.interface";

export const getAllMarcasEquipos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let marcaEquipoModel = marcaEquipoEntity();
    let response: any = {};

    await marcaEquipoModel
      .find({}, { _id: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id marca')
      .exec()
      .then((marcasEquipos: IMarcaEquipo[]) => {
        response.marcasEquipos = marcasEquipos;
      });

    await marcaEquipoModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All MarcasEquipos: ${error}`);
  }
}

export const getMarcaEquipoByID = async (id: string): Promise<IMarcaEquipo | undefined> => {
  try {
    let marcaEquipoModel = marcaEquipoEntity();

    return await marcaEquipoModel.findById(id).select('_id marca').exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Getting MarcaEquipo By ID: ${error}`);
  }
}

export const deleteMarcaEquipoByID = async (id: string): Promise<any | undefined> => {
  try {
    let marcaEquipoModel = marcaEquipoEntity();

    return await marcaEquipoModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting MarcaEquipo By ID');
  }
}

export const updateMarcaEquipoByID = async (id: string, marcaEquipo: any): Promise<any | undefined> => {
  try {
    let marcaEquipoModel = marcaEquipoEntity();

    return await marcaEquipoModel.findByIdAndUpdate(id, marcaEquipo);
  } catch (error) {
    LogError(`[ORM ERROR]: Updating MarcaEquipo ${id}: ${error}`);
  }
}

export const createMarcaEquipo = async (marcaEquipo: any): Promise<any | undefined> => {
  try {
    const marcaEquipoModel = marcaEquipoEntity();

    const newMarcaEquipo = new marcaEquipoModel(marcaEquipo);
    await newMarcaEquipo.save();

    return {
      success: true,
      message: "MarcaEquipo created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating MarcaEquipo: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the marca equipo",
    };
  }
}
