import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createModoFallo,
  deleteModoFalloByID,
  getAllModosFallos,
  getModoFalloByID,
  updateModoFalloByID
} from "../domain/orm/Modos_Fallos.orm";

@Route("/api/modos_fallos")
@Tags("ModosFallosController")
export class ModosFallosController {
  @Get("/")
  public async getModosFallos(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/modos_fallos] Get ModoFallo By ID: ${id}`);
      response = await getModoFalloByID(id);
    } else {
      LogSuccess('[/api/modos_fallos] Get All ModosFallos Request');
      response = await getAllModosFallos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteModosFallos(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteModoFalloByID(id);
        response = {
          message: `ModoFallo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting ModoFallo with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/modos_fallos] Delete ModoFallo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateModosFallos(@Query() id: string, @Body() modoFalloData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/modos_fallos] Update ModoFallo Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing ModoFallo";
      return response;
    }

    // Actualizar el ModoFallo con los datos proporcionados
    await updateModoFalloByID(id, modoFalloData);

    response.success = true;
    response.message = `ModoFallo with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createModosFallos(@Body() modoFalloData: any): Promise<any> {
    try {
      // Crear el ModoFallo
      const response = await createModoFallo(modoFalloData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating ModoFallo: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating ModoFallo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the ModoFallo",
      };
    }
  }
}
