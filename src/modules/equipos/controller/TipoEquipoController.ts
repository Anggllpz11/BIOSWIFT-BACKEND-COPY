import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { ITipoEquipoController } from "./interfaces";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";
import { tipoEquipoEntity } from "../domain/entities/TipoEquipo.entity";
import { createTipoEquipo, deleteTipoEquipoByID, getAllTiposEquipos, getTipoEquipoByID, updateTipoEquipoByID } from "../domain/orm/TipoEquipo.orm";

@Route("/api/tipos-equipos")
@Tags("TipoEquipoController")
export class TipoEquipoController implements ITipoEquipoController {
  @Get("/")
  public async getTiposEquipos(@Query() page: number, @Query() limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/tipos-equipos] Get TipoEquipo By ID: ${id}`);
      response = await getTipoEquipoByID(id);
    } else {
      LogSuccess('[/api/tipos-equipos] Get All TiposEquipos Request');
      response = await getAllTiposEquipos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteTipoEquipo(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteTipoEquipoByID(id);
        response = {
          message: `TipoEquipo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting tipo equipo with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/tipos-equipos] Delete TipoEquipo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateTipoEquipo(@Query() id: string, @Body() tipoEquipo: any): Promise<{ success: boolean; message: string }> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };

      if (!id) {
        LogWarning('[/api/tipos-equipos] Update TipoEquipo Request WITHOUT ID');
        response.message = "Please, provide an Id to update an existing TipoEquipo";
        return response;
      }

      const existingTipoEquipo = await getTipoEquipoByID(id);

      if (!existingTipoEquipo) {
        response.message = `TipoEquipo with ID ${id} not found`;
        return response;
      }

      await updateTipoEquipoByID(id, tipoEquipo);

      response.success = true;
      response.message = `TipoEquipo with ID ${id} updated successfully`;
      return response;
    } catch (error) {
      LogError(`[Controller ERROR]: Updating TipoEquipo ${id}: ${error}`);
      return {
        success: false,
        message: "An error occurred while updating the tipo equipo",
      };
    }
  }

  @Post("/")
  public async createTipoEquipo(@Body() tipoEquipo: any): Promise<any> {
    try {
      const response = await createTipoEquipo(tipoEquipo);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating TipoEquipo: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating TipoEquipo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the tipo equipo",
      };
    }
  }
}
