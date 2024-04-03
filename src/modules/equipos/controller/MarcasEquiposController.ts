import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { IMarcaEquipoController } from "./interfaces";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";
import { marcaEquipoEntity } from "../domain/entities/MarcasEquipos.entity";
import { createMarcaEquipo, deleteMarcaEquipoByID, getAllMarcasEquipos, getMarcaEquipoByID, updateMarcaEquipoByID } from "../domain/orm/MarcasEquipos.orm";

@Route("/api/marcas-equipos")
@Tags("MarcasEquiposController")
export class MarcasEquiposController implements IMarcaEquipoController {
  @Get("/")
  public async getMarcasEquipos(@Query() page: number, @Query() limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/marcas-equipos] Get MarcaEquipo By ID: ${id}`);
      response = await getMarcaEquipoByID(id);
    } else {
      LogSuccess('[/api/marcas-equipos] Get All MarcasEquipos Request');
      response = await getAllMarcasEquipos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteMarcaEquipo(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteMarcaEquipoByID(id);
        response = {
          message: `MarcaEquipo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting marca equipo with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/marcas-equipos] Delete MarcaEquipo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateMarcaEquipo(@Query() id: string, @Body() marcaEquipo: any): Promise<{ success: boolean; message: string }> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };

      if (!id) {
        LogWarning('[/api/marcas-equipos] Update MarcaEquipo Request WITHOUT ID');
        response.message = "Please, provide an Id to update an existing MarcaEquipo";
        return response;
      }

      // Controller Instance to execute a method
      const existingMarcaEquipo = await getMarcaEquipoByID(id);

      if (!existingMarcaEquipo) {
        response.message = `MarcaEquipo with ID ${id} not found`;
        return response;
      }

      // Update MarcaEquipo
      await updateMarcaEquipoByID(id, marcaEquipo);

      response.success = true;
      response.message = `MarcaEquipo with ID ${id} updated successfully`;
      return response;
    } catch (error) {
      LogError(`[Controller ERROR]: Updating MarcaEquipo ${id}: ${error}`);
      return {
        success: false,
        message: "An error occurred while updating the marca equipo",
      };
    }
  }

  @Post("/")
  public async createMarcaEquipo(@Body() marcaEquipo: any): Promise<any> {
    try {
      const response = await createMarcaEquipo(marcaEquipo);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating MarcaEquipo: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating MarcaEquipo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the marca equipo",
      };
    }
  }
}
