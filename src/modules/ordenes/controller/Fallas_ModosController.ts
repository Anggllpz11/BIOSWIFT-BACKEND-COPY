import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createFallaModo,
  deleteFallaModoByID,
  getAllFallasModos,
  getFallaModoByID,
  updateFallaModoByID
} from "../domain/orm/Fallas_Modos.orm";

@Route("/api/fallas_modos")
@Tags("FallasModosController")
export class FallasModosController {
  @Get("/")
  public async getFallasModos(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/fallas_modos] Get FallaModo By ID: ${id}`);
      response = await getFallaModoByID(id);
    } else {
      LogSuccess('[/api/fallas_modos] Get All FallasModos Request');
      response = await getAllFallasModos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteFallasModos(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteFallaModoByID(id);
        response = {
          message: `FallaModo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting FallaModo with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/fallas_modos] Delete FallaModo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateFallasModos(@Query() id: string, @Body() fallaModoData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/fallas_modos] Update FallaModo Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing FallaModo";
      return response;
    }

    // Actualizar la FallaModo con los datos proporcionados
    await updateFallaModoByID(id, fallaModoData);

    response.success = true;
    response.message = `FallaModo with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createFallasModos(@Body() fallaModoData: any): Promise<any> {
    try {
      // Crear la FallaModo
      const response = await createFallaModo(fallaModoData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating FallaModo: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating FallaModo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the FallaModo",
      };
    }
  }
}
