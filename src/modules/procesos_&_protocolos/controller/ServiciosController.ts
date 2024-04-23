import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { IServiciosController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import { createServicio, deleteServicioByID, getAllServicios, getServicioByID, updateServicioByID } from "../domain/orm/Servicios.orm";

@Route("/api/servicios")
@Tags("ServiciosController")
export class ServiciosController implements IServiciosController {
  @Get("/")
  public async getServicios(page: number, limit: number, @Query() id?: string): Promise<any> {
    if (id) {
      LogSuccess(`[/api/servicios] Get Servicio By ID: ${id}`);
      return await getServicioByID(id);
    } else {
      LogSuccess('[/api/servicios] Get All Servicios Request');
      return await getAllServicios(page, limit);
    }
  }

  @Delete("/")
  public async deleteServicios(@Query() id?: string): Promise<any> {
    if (id) {
      try {
        const response = await deleteServicioByID(id);
        return {
          message: `Servicio with ID: ${id} deleted successfully`
        };
      } catch (error) {
        LogError(`[Controller ERROR]: Deleting Servicio With ID: ${id}: ${error}`);
        return {
          message: `Error deleting servicio with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/servicios] Delete Servicio Request WITHOUT ID');
      return {
        message: 'Please, provide an ID to remove from DB'
      };
    }
  }

  @Put("/")
  public async updateServicios(@Query() id: string, @Body() serviciosData: any): Promise<any> {
    if (!id) {
      LogWarning('[/api/servicios] Update Servicio Request WITHOUT ID');
      return {
        success: false,
        message: "Please provide an Id to update an existing Servicio"
      };
    }
    try {
      const response = await updateServicioByID(id, serviciosData);
      return {
        success: true,
        message: `Servicio with ID ${id} updated successfully`
      };
    } catch (error) {
      LogError(`[Controller ERROR]: Updating Servicio ${id}: ${error}`);
      return {
        success: false,
        message: "An error occurred while updating the servicio"
      };
    }
  }

  @Post("/")
  public async createServicios(@Body() serviciosData: any): Promise<any> {
    try {
      const response = await createServicio(serviciosData);
      return response;
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Servicio: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the servicio"
      };
    }
  }
}
