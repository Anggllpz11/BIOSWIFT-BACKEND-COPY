import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { IAreaEquipoController } from "./interfaces";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";
import { areaEquipoEntity } from "../domain/entities/AreaEquipo.entity";
import { createAreaEquipo, deleteAreaEquipoByID, getAllAreasEquipos, getAreaEquipoByID, updateAreaEquipoByID } from "../domain/orm/AreaEquipo.orm";

@Route("/api/areas-equipos")
@Tags("AreaEquipoController")
export class AreaEquipoController implements IAreaEquipoController {
  @Get("/")
  public async getAreasEquipos(@Query() page: number, @Query() limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/areas-equipos] Get AreaEquipo By ID: ${id}`);
      response = await getAreaEquipoByID(id);
    } else {
      LogSuccess('[/api/areas-equipos] Get All AreasEquipos Request');
      response = await getAllAreasEquipos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteAreaEquipo(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteAreaEquipoByID(id);
        response = {
          message: `AreaEquipo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting area equipo with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/areas-equipos] Delete AreaEquipo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateAreaEquipo(@Query() id: string, @Body() areaEquipo: any): Promise<{ success: boolean; message: string }> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };

      if (!id) {
        LogWarning('[/api/areas-equipos] Update AreaEquipo Request WITHOUT ID');
        response.message = "Please, provide an Id to update an existing AreaEquipo";
        return response;
      }

      const existingAreaEquipo = await getAreaEquipoByID(id);

      if (!existingAreaEquipo) {
        response.message = `AreaEquipo with ID ${id} not found`;
        return response;
      }

      await updateAreaEquipoByID(id, areaEquipo);

      response.success = true;
      response.message = `AreaEquipo with ID ${id} updated successfully`;
      return response;
    } catch (error) {
      LogError(`[Controller ERROR]: Updating AreaEquipo ${id}: ${error}`);
      return {
        success: false,
        message: "An error occurred while updating the area equipo",
      };
    }
  }

  @Post("/")
  public async createAreaEquipo(@Body() areaEquipo: any): Promise<any> {
    try {
      const response = await createAreaEquipo(areaEquipo);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating AreaEquipo: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating AreaEquipo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the area equipo",
      };
    }
  }
}
