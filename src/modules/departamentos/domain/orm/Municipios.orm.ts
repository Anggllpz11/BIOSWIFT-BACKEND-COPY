// Municipios.orm.ts

import mongoose from "mongoose";
import { LogError } from "../../../../utils/logger";
import { IMunicipio } from "../interfaces/IMunicipio.interface";
import { municipiosEntity } from "../entities/Municipios.entity";
import { departamentosEntity } from "../entities/Departamento.entity";

// CRUD

/**
 * Método para obtener todos los municipios asociados a departamentos
 * de la colección "Municipios" en el servidor Mongo con paginación.
 */
export const getAllMunicipios = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const municipiosModel = municipiosEntity();
    let response: any = {};
    let departamentoModel = departamentosEntity(); // Obtener el modelo de Departamentos

    // Buscar todos los municipios con paginación y poblar los detalles de Departamentos
    const municipios: IMunicipio[] = await municipiosModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .populate({
        path: 'id_departamento', // Asegurarse de que este sea el nombre correcto del campo en el esquema Municipios
        model: departamentoModel, // Usar el modelo obtenido para el populate
        select: '_id nombre' // Seleccionar los campos que se quieren obtener de Departamentos
      })
      .exec() as IMunicipio[];

    response.municipios = municipios;

    // Contar documentos totales en la colección Municipios
    await municipiosModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Municipios: ${error}`);
  }
};

/**
 * Método para obtener un municipio por ID de la colección "Municipios" en el servidor Mongo.
 */
export const getMunicipioByID = async (id: string): Promise<IMunicipio | undefined> => {
  try {
    const municipiosModel = municipiosEntity();
    let departamentoModel = departamentosEntity(); // Obtener el modelo de Departamentos

    // Buscar municipio por ID y poblar los detalles de Departamentos
    return await municipiosModel
      .findById(id)
      .populate({
        path: 'id_departamento', // Asegurarse de que este sea el nombre correcto del campo en el esquema Municipios
        model: departamentoModel, // Usar el modelo obtenido para el populate
        select: '_id nombre' // Seleccionar los campos que se quieren obtener de Departamentos
      })
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Municipio By ID: ${error}`);
  }
};

/**
 * Método para eliminar un municipio por ID.
 */
export const deleteMunicipioByID = async (id: string): Promise<any | undefined> => {
  try {
    const municipiosModel = municipiosEntity();

    // Eliminar municipio por ID
    return await municipiosModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Municipio By ID');
  }
};

/**
 * Método para actualizar un municipio por ID.
 */
export const updateMunicipioByID = async (id: string, municipio: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const municipiosModel = municipiosEntity();

    // Actualizar municipio por ID
    await municipiosModel.findByIdAndUpdate(id, municipio);

    response.success = true;
    response.message = "Municipio actualizado correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Municipio ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el Municipio",
    };
  }
};

/**
 * Método para crear un nuevo municipio.
 */
export const createMunicipio = async (municipio: any): Promise<any | undefined> => {
  try {
    const municipiosModel = municipiosEntity();

    const newMunicipio = new municipiosModel(municipio);
    await newMunicipio.save();

    return {
      success: true,
      message: "Municipio creado correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Municipio: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear el Municipio",
    };
  }
};

export const createMultipleMunicipios = async (municipios: any[]): Promise<any | undefined> => {
  try {
    const municipiosModel = municipiosEntity();
    
    const result = await municipiosModel.insertMany(municipios);

    return {
      success: true,
      message: "Municipios creados correctamente",
      data: result
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Multiple Municipios: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear los Municipios",
    };
  }
};
