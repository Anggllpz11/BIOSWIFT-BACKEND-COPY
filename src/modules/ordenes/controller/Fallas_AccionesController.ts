import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createFallaAccion,
  deleteFallaAccionByID,
  getAllFallasAcciones,
  getFallaAccionByID,
  updateFallaAccionByID
} from "../domain/orm/Fallas_Acciones.orm";

@Route("/api/fallas_acciones")
@Tags("FallasAccionesController")
export class FallasAccionesController {
  @Get("/")
  public async getFallasAcciones(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/fallas_acciones] Get FallaAccion By ID: ${id}`);
      response = await getFallaAccionByID(id);
    } else {
      LogSuccess('[/api/fallas_acciones] Get All FallasAcciones Request');
      response = await getAllFallasAcciones(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteFallasAcciones(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteFallaAccionByID(id);
        response = {
          message: `FallaAccion with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting FallaAccion with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/fallas_acciones] Delete FallaAccion Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateFallasAcciones(@Query() id: string, @Body() fallaAccionData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/fallas_acciones] Update FallaAccion Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing FallaAccion";
      return response;
    }

    // Actualizar la FallaAccion con los datos proporcionados
    await updateFallaAccionByID(id, fallaAccionData);

    response.success = true;
    response.message = `FallaAccion with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createFallasAcciones(@Body() fallaAccionData: any): Promise<any> {
    try {
      // Crear la FallaAccion
      const response = await createFallaAccion(fallaAccionData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating FallaAccion: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating FallaAccion: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the FallaAccion",
      };
    }
  }
}
