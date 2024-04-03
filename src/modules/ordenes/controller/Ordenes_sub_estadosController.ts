import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createOrdenSubEstado,
  deleteOrdenSubEstadoByID,
  getAllOrdenesSubEstados,
  getOrdenSubEstadoByID,
  updateOrdenSubEstadoByID
} from "../domain/orm/Ordenes_sub_estados.orm";

@Route("/api/ordenes_sub_estados")
@Tags("OrdenesSubEstadosController")
export class OrdenesSubEstadosController {
  @Get("/")
  public async getOrdenesSubEstados(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/ordenes_sub_estados] Get OrdenSubEstado By ID: ${id}`);
      response = await getOrdenSubEstadoByID(id);
    } else {
      LogSuccess('[/api/ordenes_sub_estados] Get All OrdenesSubEstados Request');
      response = await getAllOrdenesSubEstados(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteOrdenesSubEstados(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteOrdenSubEstadoByID(id);
        response = {
          message: `OrdenSubEstado with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting OrdenSubEstado with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/ordenes_sub_estados] Delete OrdenSubEstado Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateOrdenesSubEstados(@Query() id: string, @Body() ordenSubEstadoData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/ordenes_sub_estados] Update OrdenSubEstado Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing OrdenSubEstado";
      return response;
    }

    // Actualizar el OrdenSubEstado con los datos proporcionados
    await updateOrdenSubEstadoByID(id, ordenSubEstadoData);

    response.success = true;
    response.message = `OrdenSubEstado with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createOrdenesSubEstados(@Body() ordenSubEstadoData: any): Promise<any> {
    try {
      // Crear el OrdenSubEstado
      const response = await createOrdenSubEstado(ordenSubEstadoData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating OrdenSubEstado: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating OrdenSubEstado: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the OrdenSubEstado",
      };
    }
  }
}
