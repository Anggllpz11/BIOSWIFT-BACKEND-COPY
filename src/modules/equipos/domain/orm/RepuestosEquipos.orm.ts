import mongoose from "mongoose";
import { repuestoEquipoEntity } from "../entities/RepuestoEquipo.entity";
import { LogError } from "../../../../utils/logger";
import { IRepuestoEquipo } from "../interfaces/IRepuestoEquipo.interface";
import { clientEntity } from "../../../users/domain/entities/Client.entity";

// CRUD

/**
 * Método para obtener todos los Repuestos_Equipos de la colección "RepuestoEquipos" en el servidor Mongo.
 */
export const getAllRepuestoEquipos = async (page: number, limit: number): Promise<any[] | undefined> => {
  try {
    let repuestoEquipoModel = repuestoEquipoEntity();
    let clientModel = clientEntity();
    let response: any = {};

    // Buscar todos los repuestos_equipos (usando paginación) y poblar 'id_cliente'
    const repuestoEquipos: IRepuestoEquipo[] = await repuestoEquipoModel
      .find({}, { _id: 0 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('_id id_cliente repuesto_name repuesto_cantidad repuesto_precio')
      .populate({
        path: 'id_cliente',
        model: clientModel,
        select: '_id client_name client_nit client_address client_telefono client_email',
      })
      .exec() as unknown as IRepuestoEquipo[];

    response.repuestoEquipos = repuestoEquipos;

    // Contar documentos totales en la colección de RepuestoEquipos
    await repuestoEquipoModel.countDocuments().then((total: number) => {
      response.totalPages = Math.ceil(total / limit);
      response.currentPage = page;
    });

    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Obteniendo todos los Repuestos_Equipos: ${error}`);
  }
};

/**
 * Método para obtener un solo Repuesto_Equipo por ID de la colección "RepuestoEquipos" en el servidor Mongo.
 */
export const getRepuestoEquipoByID = async (id: string): Promise<IRepuestoEquipo | undefined> => {
  try {
    let repuestoEquipoModel = repuestoEquipoEntity();
    let clientModel = clientEntity();

    // Buscar Repuesto_Equipo por ID y poblar 'id_cliente'
    return await repuestoEquipoModel
      .findById(id, { _id: 0 })
      .select('_id id_cliente repuesto_name repuesto_cantidad repuesto_precio')
      .populate({
        path: 'id_cliente',
        model: clientModel,
        select: '_id client_name client_nit client_address client_telefono client_email',
      })
      .exec();
  } catch (error) {
    LogError(`[ORM ERROR]: Obteniendo Repuesto_Equipo por ID: ${error}`);
  }
};

/**
 * Método para eliminar Repuesto_Equipo por ID
 */
export const deleteRepuestoEquipoByID = async (id: string): Promise<any | undefined> => {
  try {
    let repuestoEquipoModel = repuestoEquipoEntity();

    // Eliminar Repuesto_Equipo por ID
    return await repuestoEquipoModel.deleteOne({ _id: id });
  } catch (error) {
    LogError('[ORM ERROR]: Eliminando Repuesto_Equipo por ID');
  }
};

/**
 * Método para actualizar Repuesto_Equipo por ID
 */
export const updateRepuestoEquipoByID = async (id: string, repuestoEquipo: any): Promise<{ success: boolean; message: string }> => {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    const repuestoEquipoModel = repuestoEquipoEntity();

    // Buscar el cliente por nombre
    const client = await clientEntity().findOne({ client_name: repuestoEquipo.id_cliente });

    if (!client) {
      return {
        success: false,
        message: "El cliente no se encontró en la base de datos.",
      };
    }

    // Asociar el cliente al repuestoEquipo
    repuestoEquipo.id_cliente = client._id;

    // Actualizar Repuesto_Equipo por ID
    await repuestoEquipoModel.findByIdAndUpdate(id, repuestoEquipo);

    response.success = true;
    response.message = "Repuesto_Equipo actualizado exitosamente";
    return response;
  } catch (error) {
    LogError(`[ORM ERROR]: Actualizando Repuesto_Equipo ${id}: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al actualizar el repuesto_equipo",
    };
  }
};


/**
 * Método para crear Repuesto_Equipo
 */
export const createRepuestoEquipo = async (repuestoEquipo: any): Promise<any | undefined> => {
  try {
    const repuestoEquipoModel = repuestoEquipoEntity();

    // Buscar el cliente por nombre
    const client = await clientEntity().findOne({ client_name: repuestoEquipo.id_cliente });

    if (!client) {
      return {
        success: false,
        message: "El cliente no se encontró en la base de datos.",
      };
    }

    // Asociar el cliente al repuestoEquipo
    repuestoEquipo.id_cliente = client._id;

    const newRepuestoEquipo = new repuestoEquipoModel(repuestoEquipo);
    await newRepuestoEquipo.save();

    return {
      success: true,
      message: "Repuesto_Equipo creado exitosamente",
    };
  } catch (error) {
    LogError(`[ORM ERROR]: Creating Repuesto_Equipo: ${error}`);
    return {
      success: false,
      message: "Ocurrió un error al crear el repuesto_equipo",
    };
  }
};

