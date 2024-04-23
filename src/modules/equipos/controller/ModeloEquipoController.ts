import { Get, Query, Route, Tags, Delete, Put, Body, Post} from "tsoa";
import { IModeloEquipoController } from "./interfaces";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";
import { modeloEquipoEntity } from "../domain/entities/ModeloEquipo.entity";
import { createModeloEquipo, deleteModeloEquipoByID, getAllModeloEquipos, getModeloEquipoByID, updateModeloEquipoByID } from "../domain/orm/ModeloEquipo.orm";
import { getMarcaEquipoByID } from "../domain/orm/MarcasEquipos.orm";
import { getClaseEquipoByID } from "../domain/orm/DeviceClass.orm";

@Route("/api/modeloEquipos")
@Tags("ModeloEquipoController")
export class ModeloEquipoController implements IModeloEquipoController {
  @Get("/")
  public async getModeloEquipos(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/modeloEquipos] Get ModeloEquipo By ID: ${id}`);
      response = await getModeloEquipoByID(id);
    } else {
      LogSuccess('[/api/modeloEquipos] Get All ModeloEquipos Request');
      response = await getAllModeloEquipos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteModeloEquipo(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteModeloEquipoByID(id);
        response = {
          message: `ModeloEquipo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting ModeloEquipo with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/modeloEquipos] Delete ModeloEquipo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
    public async updateModeloEquipo(@Query() id: string, @Body() equipo: any): Promise<{ success: boolean; message: string }> {
      try {
        let response: { success: boolean; message: string } = {
          success: false,
          message: "",
        };

        if (!id) {
          LogWarning('[/api/modeloEquipos] Update ModeloEquipo Request WITHOUT ID');
          response.message = "Please, provide an ID to update an existing ModeloEquipo";
          return response;
        }

        const existingModeloEquipo = await getModeloEquipoByID(id);

        if (!existingModeloEquipo) {
          response.message = `ModeloEquipo with ID ${id} not found`;
          return response;
        }

        await updateModeloEquipoByID(id, equipo);

        response.success = true;
        response.message = `ModeloEquipo with ID ${id} updated successfully`;
        return response;
      } catch (error) {
        LogError(`[Controller ERROR]: Updating ModeloEquipo ${id}: ${error}`);
        return {
          success: false,
          message: "An error occurred while updating the ModeloEquipo",
        };
      }
   }

  @Post("/")
  public async createModeloEquipo(@Body() equipo: any): Promise<any> {
    try {
      const response = await createModeloEquipo(equipo);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating ModeloEquipo: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating ModeloEquipo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the ModeloEquipo",
      };
    }
  }

}
