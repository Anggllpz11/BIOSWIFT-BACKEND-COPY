import { Get, Query, Route, Tags, Delete, Put, Body, Post} from "tsoa";
import { IEquipoController } from "./interfaces";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";
import { createEquipo, deleteEquipoByID, getAllEquipos, getAreaEquipoByName, getEquipoByID, getModeloEquipoByName, getSedeByName, getTipoEquipoByName, updateEquipoByID } from "../domain/orm/Equipo.orm";

@Route("/api/equipos")
@Tags("EquipoController")
export class EquipoController implements IEquipoController {
  @Get("/")
  public async getEquipos(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/equipos] Get Equipo By ID: ${id}`);
      response = await getEquipoByID(id);
    } else {
      LogSuccess('[/api/equipos] Get All Equipos Request');
      response = await getAllEquipos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteEquipo(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteEquipoByID(id);
        response = {
          message: `Equipo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting equipo with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/equipos] Delete Equipo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/") // Cambiamos la anotación @Put para que el ID sea parte de la consulta
public async updateEquipo(@Query() id: string, @Body() equipoData: any): Promise<any> {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogWarning('[/api/equipos] Update Equipo Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing Equipo";
      return response;
    }

    // Obtener el equipo existente por ID
    const existingEquipo = await getEquipoByID(id);

    if (!existingEquipo) {
      response.message = `Equipo with ID ${id} not found`;
      return response;
    }

    // Comprobar si se proporciona un nuevo nombre de modelo
    if (equipoData.modelo_equipos) {
      // Buscar el modelo de equipo por nombre
      const modeloEquipo = await getModeloEquipoByName(equipoData.modelo_equipos);

      if (!modeloEquipo) {
        response.success = false;
        response.message = "El modelo de equipo no se encontró en la base de datos.";
        return response;
      }

      // Asociar el modelo de equipo actualizado al equipo
      equipoData.modelo_equipos = modeloEquipo._id;
    }

    // Comprobar si se proporciona un nuevo nombre de área
    if (equipoData.id_area) {
      // Buscar el área de equipo por nombre
      const areaEquipo = await getAreaEquipoByName(equipoData.id_area);

      if (!areaEquipo) {
        response.success = false;
        response.message = "El área de equipo no se encontró en la base de datos.";
        return response;
      }

      // Asociar el área de equipo actualizada al equipo
      equipoData.id_area = areaEquipo._id;
    }

    // Comprobar si se proporciona un nuevo nombre de tipo
    if (equipoData.id_tipo) {
      // Buscar el tipo de equipo por nombre
      const tipoEquipo = await getTipoEquipoByName(equipoData.id_tipo);

      if (!tipoEquipo) {
        response.success = false;
        response.message = "El tipo de equipo no se encontró en la base de datos.";
        return response;
      }

      // Asociar el tipo de equipo actualizado al equipo
      equipoData.id_tipo = tipoEquipo._id;
    }

    // Comprobar si se proporciona un nuevo nombre de sede
    if (equipoData.id_sede) {
      // Buscar la sede por nombre
      const sede = await getSedeByName(equipoData.id_sede);

      if (!sede) {
        response.success = false;
        response.message = "La sede no se encontró en la base de datos."; // Devolvemos el mensaje de error
        return response;
      }

      // Asociar la sede actualizada al equipo
      equipoData.id_sede = sede._id;
    }

    // Actualizar el equipo con los datos proporcionados
    await updateEquipoByID(id, equipoData);

    response.success = true;
    response.message = `Equipo with ID ${id} updated successfully`;
    return response;
  } catch (error) {
    LogError(`[Controller ERROR]: Updating Equipo ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the equipo",
    };
  }
}


@Post("/")
public async createEquipo(@Body() equipoData: any): Promise<any> {
  try {
    // Extrae el nombre del modelo de equipo, área de equipo, tipo de equipo y sede de los datos del equipo
    const modeloEquipoNombre: string = equipoData.modelo_equipos;
    const areaEquipoNombre: string = equipoData.id_area;
    const tipoEquipoNombre: string = equipoData.id_tipo;
    const sedeNombre: string = equipoData.id_sede; 

    // Busca el modelo de equipo por nombre
    const modeloEquipo = await getModeloEquipoByName(modeloEquipoNombre);
    if (!modeloEquipo) {
      return {
        success: false,
        message: "El modelo de equipo no se encontró en la base de datos.",
      };
    }

    // Asocia el modelo de equipo al equipo
    equipoData.modelo_equipos = modeloEquipo._id;

    // Busca el área de equipo por nombre
    const areaEquipo = await getAreaEquipoByName(areaEquipoNombre);
    if (!areaEquipo) {
      return {
        success: false,
        message: "El área de equipo no se encontró en la base de datos.",
      };
    }

    // Asocia el área de equipo al equipo
    equipoData.id_area = areaEquipo._id;

    // Busca el tipo de equipo por nombre
    const tipoEquipo = await getTipoEquipoByName(tipoEquipoNombre);
    if (!tipoEquipo) {
      return {
        success: false,
        message: "El tipo de equipo no se encontró en la base de datos.",
      };
    }

    // Asocia el tipo de equipo al equipo
    equipoData.id_tipo = tipoEquipo._id;

    // Busca la sede por nombre
    const sede = await getSedeByName(sedeNombre);
    if (!sede) {
      return {
        success: false,
        message: "La sede perteneciente a el equipo no se encontró en la base de datos", 
      };
    }

    // Asocia la sede al equipo
    equipoData.id_sede = sede._id;

    // Crea el equipo con las relaciones establecidas
    const response = await createEquipo(equipoData);

    if (response.success) {
      return response;
    } else {
      LogError(`[Controller ERROR]: Creating Equipo: ${response.message}`);
      return response;
    }
  } catch (error) {
    LogError(`[Controller ERROR]: Creating Equipo: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the equipo",
    };
  }
}



}

// Add the CRUD functions for equipment below (e.g., getAllEquipos, getEquipoByID, deleteEquipoByID, updateEquipoByID)

