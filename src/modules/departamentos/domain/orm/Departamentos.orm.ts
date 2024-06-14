import mongoose from "mongoose";
import { LogError } from "../../../../utils/logger";
import { IDepartamento } from "../interfaces/IDepartamento.interface";
import { departamentosEntity } from "../entities/Departamento.entity";

// CRUD

/**
 * Método para obtener todos los departamentos con paginación.
 */
export const getAllDepartamentos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    const departamentosModel = departamentosEntity();
    let response: any = {};

    // Buscar todos los departamentos con paginación
    const departamentos: IDepartamento[] = await departamentosModel
      .find()
      .limit(limit)
      .skip((page - 1) * limit)
      .exec() as IDepartamento[];

    response.departamentos = departamentos;

    // Contar documentos totales en la colección Departamentos
    await departamentosModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining All Departamentos: ${error}`);
  }
};

/**
 * Método para obtener un departamento por ID.
 */
export const getDepartamentoByID = async (id: string): Promise<IDepartamento | undefined> => {
  try {
    const departamentosModel = departamentosEntity();

    // Buscar departamento por ID
    return await departamentosModel.findById(id).exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obtaining Departamento By ID: ${error}`);
  }
};

/**
 * Método para eliminar un departamento por ID.
 */
export const deleteDepartamentoByID = async (id: string): Promise<any | undefined> => {
  try {
    const departamentosModel = departamentosEntity();

    // Eliminar departamento por ID
    return await departamentosModel.deleteOne({ _id: id }).exec();
  } catch (error) {
    LogError('[ORM ERROR]: Deleting Departamento By ID');
  }
};

/**
 * Método para actualizar un departamento por ID.
 */
export const updateDepartamentoByID = async (id: string, departamento: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const departamentosModel = departamentosEntity();

    // Actualizar departamento por ID
    await departamentosModel.findByIdAndUpdate(id, departamento);

    response.success = true;
    response.message = "Departamento actualizado correctamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Updating Departamento ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el Departamento",
    };
  }
};

/**
 * Método para crear un nuevo departamento.
 */
export const createDepartamento = async (departamento: any): Promise<any | undefined> => {
  try {
    const departamentosModel = departamentosEntity();

    const newDepartamento = new departamentosModel(departamento);
    await newDepartamento.save();

    return {
      success: true,
      message: "Departamento creado correctamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Departamento: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear el Departamento",
    };
  }
};
