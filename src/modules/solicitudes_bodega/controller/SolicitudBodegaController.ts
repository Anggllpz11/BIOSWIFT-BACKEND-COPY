import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createSolicitudBodega,
  deleteSolicitudBodegaByID,
  getAllSolicitudesBodega,
  getSolicitudBodegaByID,
  updateSolicitudBodegaByID
} from "../domain/orm/SolicitudesBodega.orm";
import { ISolicitudBodegaController } from "./interfaces";

@Route("/api/solicitudes_bodega")
@Tags("SolicitudBodegaController")
export class SolicitudBodegaController implements ISolicitudBodegaController {
  @Get("/")
  public async getSolicitudBodega(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/solicitudes_bodega] Get SolicitudBodega By ID: ${id}`);
      response = await getSolicitudBodegaByID(id);
    } else {
      LogSuccess('[/api/solicitudes_bodega] Get All SolicitudesBodega Request');
      response = await getAllSolicitudesBodega(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteSolicitudBodega(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteSolicitudBodegaByID(id);
        response = {
          message: `SolicitudBodega with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting SolicitudBodega with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/solicitudes_bodega] Delete SolicitudBodega Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateSolicitudBodega(@Query() id: string, @Body() solicitudBodegaData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/solicitudes_bodega] Update SolicitudBodega Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing SolicitudBodega";
      return response;
    }

    // Actualizar la SolicitudBodega con los datos proporcionados
    await updateSolicitudBodegaByID(id, solicitudBodegaData);

    response.success = true;
    response.message = `SolicitudBodega with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createSolicitudBodega(@Body() solicitudBodegaData: any): Promise<any> {
    try {
      // Crear la SolicitudBodega
      const response = await createSolicitudBodega(solicitudBodegaData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating SolicitudBodega: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating SolicitudBodega: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the SolicitudBodega",
      };
    }
  }
}