import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import {
  createSolicitudesBodegaEstados,
  deleteSolicitudesBodegaEstadosByID,
  getAllSolicitudesBodegaEstados,
  getSolicitudesBodegaEstadosByID,
  updateSolicitudesBodegaEstadosByID
} from "../domain/orm/SolicitudesBodegaEstados.orm";
import { ISolicitudBodegaEstadosController } from "./interfaces";

@Route("/api/solicitudes-bodega-estados")
@Tags("SolicitudesBodegaEstadosController")
export class SolicitudesBodegaEstadosController implements ISolicitudBodegaEstadosController {
  @Get("/")
  public async getSolicitudBodegaEstados(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/solicitudes-bodega-estados] Get Estado By ID: ${id}`);
      response = await getSolicitudesBodegaEstadosByID(id);
    } else {
      LogSuccess('[/api/solicitudes-bodega-estados] Get All Estados Request');
      response = await getAllSolicitudesBodegaEstados(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteSolicitudBodegaEstados(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteSolicitudesBodegaEstadosByID(id);
        response = {
          message: `Estado with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting estado with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/solicitudes-bodega-estados] Delete Estado Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateSolicitudBodegaEstados(@Query() id: string, @Body() solicitudBodegaEstadosData: any): Promise<any> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };
  
      if (!id) {
        LogWarning('[/api/solicitudes-bodega-estados] Update Estado Request WITHOUT ID');
        response.message = "Please provide an Id to update an existing Estado";
        return response;
      }
  
      // Actualizar el estado con los datos proporcionados
      await updateSolicitudesBodegaEstadosByID(id, solicitudBodegaEstadosData);
  
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
  public async createSolicitudBodegaEstados(@Body() solicitudBodegaEstadosData: any): Promise<any> {
    try {
      // Crear el estado
      const response = await createSolicitudesBodegaEstados(solicitudBodegaEstadosData);

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
