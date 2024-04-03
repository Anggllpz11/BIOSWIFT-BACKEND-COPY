import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createFalloSistema,
  deleteFalloSistemaByID,
  getAllFalloSistemas,
  getFalloSistemaByID,
  updateFalloSistemaByID
} from "../domain/orm/Fallo_Sistemas.orm";

@Route("/api/fallo_sistemas")
@Tags("FalloSistemasController")
export class FalloSistemasController {
  @Get("/")
  public async getFalloSistemas(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/fallo_sistemas] Get FalloSistema By ID: ${id}`);
      response = await getFalloSistemaByID(id);
    } else {
      LogSuccess('[/api/fallo_sistemas] Get All FalloSistemas Request');
      response = await getAllFalloSistemas(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteFalloSistemas(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteFalloSistemaByID(id);
        response = {
          message: `FalloSistema with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting FalloSistema with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/fallo_sistemas] Delete FalloSistema Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateFalloSistemas(@Query() id: string, @Body() falloSistemaData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/fallo_sistemas] Update FalloSistema Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing FalloSistema";
      return response;
    }

    // Actualizar el FalloSistema con los datos proporcionados
    await updateFalloSistemaByID(id, falloSistemaData);

    response.success = true;
    response.message = `FalloSistema with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createFalloSistemas(@Body() falloSistemaData: any): Promise<any> {
    try {
      // Crear el FalloSistema
      const response = await createFalloSistema(falloSistemaData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating FalloSistema: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating FalloSistema: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the FalloSistema",
      };
    }
  }
}
