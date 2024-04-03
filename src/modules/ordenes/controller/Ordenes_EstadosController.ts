import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createOrdenEstado,
  deleteOrdenEstadoByID,
  getAllOrdenesEstados,
  getOrdenEstadoByID,
  updateOrdenEstadoByID
} from "../domain/orm/Ordenes_Estados.orm";

@Route("/api/ordenes_estados")
@Tags("OrdenesEstadosController")
export class OrdenesEstadosController {
  @Get("/")
  public async getOrdenesEstados(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/ordenes_estados] Get OrdenEstado By ID: ${id}`);
      response = await getOrdenEstadoByID(id);
    } else {
      LogSuccess('[/api/ordenes_estados] Get All OrdenesEstados Request');
      response = await getAllOrdenesEstados(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteOrdenesEstados(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteOrdenEstadoByID(id);
        response = {
          message: `OrdenEstado with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting OrdenEstado with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/ordenes_estados] Delete OrdenEstado Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateOrdenesEstados(@Query() id: string, @Body() ordenEstadoData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/ordenes_estados] Update OrdenEstado Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing OrdenEstado";
      return response;
    }

    // Actualizar el OrdenEstado con los datos proporcionados
    await updateOrdenEstadoByID(id, ordenEstadoData);

    response.success = true;
    response.message = `OrdenEstado with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createOrdenesEstados(@Body() ordenEstadoData: any): Promise<any> {
    try {
      // Crear el OrdenEstado
      const response = await createOrdenEstado(ordenEstadoData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating OrdenEstado: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating OrdenEstado: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the OrdenEstado",
      };
    }
  }
}
