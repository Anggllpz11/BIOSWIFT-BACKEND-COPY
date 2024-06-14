import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import {
  createSolicitudesDadoBaja,
  deleteSolicitudesDadoBajaByID,
  getAllSolicitudesDadoBaja,
  getSolicitudesDadoBajaByID,
  updateSolicitudesDadoBajaByID
} from "../domain/orm/SolicitudesDadoBaja.orm";
import { ISolicitudDadoBajaController } from "./interfaces";

@Route("/api/solicitudes_dado_baja")
@Tags("SolicitudDadoBajaController")
export class SolicitudDadoBajaController implements ISolicitudDadoBajaController {
  @Get("/")
  public async getSolicitudDadoBaja(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/solicitudes_dado_baja] Get SolicitudDadoBaja By ID: ${id}`);
      response = await getSolicitudesDadoBajaByID(id);
    } else {
      LogSuccess('[/api/solicitudes_dado_baja] Get All SolicitudesDadoBaja Request');
      response = await getAllSolicitudesDadoBaja(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteSolicitudDadoBaja(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteSolicitudesDadoBajaByID(id);
        response = {
          message: `SolicitudDadoBaja with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting SolicitudDadoBaja with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/solicitudes_dado_baja] Delete SolicitudDadoBaja Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateSolicitudDadoBaja(@Query() id: string, @Body() solicitudDadoBajaData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/solicitudes_dado_baja] Update SolicitudDadoBaja Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing SolicitudDadoBaja";
      return response;
    }

    // Actualizar la SolicitudDadoBaja con los datos proporcionados
    await updateSolicitudesDadoBajaByID(id, solicitudDadoBajaData);

    response.success = true;
    response.message = `SolicitudDadoBaja with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createSolicitudDadoBaja(@Body() solicitudDadoBajaData: any): Promise<any> {
    try {
      // Crear la SolicitudDadoBaja
      const response = await createSolicitudesDadoBaja(solicitudDadoBajaData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating SolicitudDadoBaja: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating SolicitudDadoBaja: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the SolicitudDadoBaja",
      };
    }
  }
}
