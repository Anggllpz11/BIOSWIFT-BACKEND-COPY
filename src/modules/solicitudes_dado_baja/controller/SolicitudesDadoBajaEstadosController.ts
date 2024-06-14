// SolicitudesDadoBajaEstadosController.ts
import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import {
  createSolicitudesDadoBajaEstados,
  deleteSolicitudesDadoBajaEstadosByID,
  getAllSolicitudesDadoBajaEstados,
  getSolicitudesDadoBajaEstadosByID,
  updateSolicitudesDadoBajaEstadosByID
} from "../domain/orm/SolicitudesDadoBajaEstados.orm";
import { ISolicitudDadoBajaEstadoController } from "./interfaces";

@Route("/api/solicitudes-dado-baja-estados")
@Tags("SolicitudesDadoBajaEstadosController")
export class SolicitudesDadoBajaEstadosController implements ISolicitudDadoBajaEstadoController {
  @Get("/")
  public async getSolicitudDadoBajaEstados(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/solicitudes-dado-baja-estados] Get Estado By ID: ${id}`);
      response = await getSolicitudesDadoBajaEstadosByID(id);
    } else {
      LogSuccess('[/api/solicitudes-dado-baja-estados] Get All Estados Request');
      response = await getAllSolicitudesDadoBajaEstados(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteSolicitudDadoBajaEstados(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteSolicitudesDadoBajaEstadosByID(id);
        response = {
          message: `Estado with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting estado with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/solicitudes-dado-baja-estados] Delete Estado Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateSolicitudDadoBajaEstados(@Query() id: string, @Body() solicitudDadoBajaEstadosData: any): Promise<any> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };
  
      if (!id) {
        LogWarning('[/api/solicitudes-dado-baja-estados] Update Estado Request WITHOUT ID');
        response.message = "Please provide an Id to update an existing Estado";
        return response;
      }
  
      // Actualizar el estado con los datos proporcionados
      await updateSolicitudesDadoBajaEstadosByID(id, solicitudDadoBajaEstadosData);
  
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
  public async createSolicitudDadoBajaEstados(@Body() solicitudDadoBajaEstadosData: any): Promise<any> {
    try {
      // Crear el estado
      const response = await createSolicitudesDadoBajaEstados(solicitudDadoBajaEstadosData);

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
