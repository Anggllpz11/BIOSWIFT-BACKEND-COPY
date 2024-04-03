import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createOrden,
  deleteOrdenByID,
  getAllOrdenes,
  getOrdenByID,
  updateOrdenByID
} from "../domain/orm/Ordenes.orm";

@Route("/api/ordenes")
@Tags("OrdenesController")
export class OrdenesController {
  @Get("/")
  public async getOrdenes(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/ordenes] Get Orden By ID: ${id}`);
      response = await getOrdenByID(id);
    } else {
      LogSuccess('[/api/ordenes] Get All Ordenes Request');
      response = await getAllOrdenes(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteOrden(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteOrdenByID(id);
        response = {
          message: `Orden with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting Orden with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/ordenes] Delete Orden Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateOrden(@Query() id: string, @Body() ordenData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/ordenes] Update Orden Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing Orden";
      return response;
    }

    // Actualizar la Orden con los datos proporcionados
    await updateOrdenByID(id, ordenData);

    response.success = true;
    response.message = `Orden with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createOrden(@Body() ordenData: any): Promise<any> {
    try {
      // Crear la Orden
      const response = await createOrden(ordenData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating Orden: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Orden: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the Orden",
      };
    }
  }
}
