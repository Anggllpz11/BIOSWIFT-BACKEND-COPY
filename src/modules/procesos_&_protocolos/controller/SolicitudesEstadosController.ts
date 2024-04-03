import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import {
  createSolicitudesEstados,
  deleteSolicitudesEstadosByID,
  getAllSolicitudesEstados,
  getSolicitudesEstadosByID,
  updateSolicitudesEstadosByID
} from "../domain/orm/SolicitudesEstados.orm";

@Route("/api/solicitudes-estados")
@Tags("SolicitudesEstadosController")
export class SolicitudesEstadosController {
  @Get("/")
  public async getSolicitudesEstados(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/solicitudes-estados] Get Estado By ID: ${id}`);
      response = await getSolicitudesEstadosByID(id);
    } else {
      LogSuccess('[/api/solicitudes-estados] Get All Estados Request');
      response = await getAllSolicitudesEstados(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteSolicitudesEstados(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteSolicitudesEstadosByID(id);
        response = {
          message: `Estado with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting estado with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/solicitudes-estados] Delete Estado Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateSolicitudesEstados(@Query() id: string, @Body() estadoData: any): Promise<any> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };
  
      if (!id) {
        LogWarning('[/api/solicitudes-estados] Update Estado Request WITHOUT ID');
        response.message = "Please provide an Id to update an existing Estado";
        return response;
      }
  
      // Actualizar el estado con los datos proporcionados
      await updateSolicitudesEstadosByID(id, estadoData);
  
      response.success = true;
      response.message = `Estado with ID ${id} updated successfully`;
      return response;
    } catch (error) {
      LogError(`[Controller ERROR]: Updating Estado ${id}: ${error}`);
      return {
        success: false,
        message: "An error occurred while updating the estado",
      };
    }
  }

  @Post("/")
  public async createSolicitudesEstados(@Body() estadoData: any): Promise<any> {
    try {
      // Crear el estado
      const response = await createSolicitudesEstados(estadoData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating Estado: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Estado: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the estado",
      };
    }
  }
}
