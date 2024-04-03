import mongoose from "mongoose";
import { areaEquipoEntity } from "../entities/AreaEquipo.entity";
import { LogError } from "../../../../utils/logger";
import { LogSuccess } from "../../../../utils/logger";
import { IAreaEquipo } from "../interfaces/IAreaEquipo.interface";

export const getAllAreasEquipos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let areaEquipoModel = areaEquipoEntity();
    let response: any = {};

    await areaEquipoModel
      .find({}, { _id: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id area')
      .exec()
      .then((areasEquipos: IAreaEquipo[]) => {
        response.areasEquipos = areasEquipos;
      });

    await areaEquipoModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Getting All AreasEquipos: ${error}`);
  }
};

export const getAreaEquipoByID = async (id: string): Promise<IAreaEquipo | undefined> => {
  try {
    let areaEquipoModel = areaEquipoEntity();

    return await areaEquipoModel.findById(id).select('_id area').exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Getting AreaEquipo By ID: ${error}`);
  }
};

export const deleteAreaEquipoByID = async (id: string): Promise<any | undefined> => {
  try {
    let areaEquipoModel = areaEquipoEntity();

    return await areaEquipoModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Deleting AreaEquipo By ID');
  }
};

export const updateAreaEquipoByID = async (id: string, areaEquipo: any): Promise<any | undefined> => {
  try {
    let areaEquipoModel = areaEquipoEntity();

    return await areaEquipoModel.findByIdAndUpdate(id, areaEquipo);
  } catch (error) {
    LogError(`[ORM ERROR]: Updating AreaEquipo ${id}: ${error}`);
  }
};

export const createAreaEquipo = async (areaEquipo: any): Promise<any | undefined> => {
  try {
    const areaEquipoModel = areaEquipoEntity();

    const newAreaEquipo = new areaEquipoModel(areaEquipo);
    await newAreaEquipo.save();

    return {
      success: true,
      message: "AreaEquipo created successfully",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating AreaEquipo: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the area equipo",
    };
  }
};
