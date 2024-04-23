import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createFallaCausa,
  deleteFallaCausaByID,
  getAllFallasCausas,
  getFallaCausaByID,
  updateFallaCausaByID
} from "../domain/orm/Fallas_Causas.orm";

@Route("/api/fallas_causas")
@Tags("FallasCausasController")
export class FallasCausasController {
  @Get("/")
  public async getFallasCausas(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/fallas_causas] Get FallaCausa By ID: ${id}`);
      response = await getFallaCausaByID(id);
    } else {
      LogSuccess('[/api/fallas_causas] Get All FallasCausas Request');
      response = await getAllFallasCausas(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteFallasCausas(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteFallaCausaByID(id);
        response = {
          message: `FallaCausa with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting FallaCausa with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/fallas_causas] Delete FallaCausa Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateFallasCausas(@Query() id: string, @Body() fallaCausaData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/fallas_causas] Update FallaCausa Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing FallaCausa";
      return response;
    }

    // Actualizar la FallaCausa con los datos proporcionados
    await updateFallaCausaByID(id, fallaCausaData);

    response.success = true;
    response.message = `FallaCausa with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createFallasCausas(@Body() fallaCausaData: any): Promise<any> {
    try {
      // Crear la FallaCausa
      const response = await createFallaCausa(fallaCausaData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating FallaCausa: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating FallaCausa: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the FallaCausa",
      };
    }
  }
}
