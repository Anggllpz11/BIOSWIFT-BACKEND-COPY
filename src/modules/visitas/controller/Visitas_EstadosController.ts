import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createVisitaEstado,
  deleteVisitaEstadoByID,
  getAllVisitasEstados,
  getVisitaEstadoByID,
  updateVisitaEstadoByID
} from "../domain/orm/Visitas_Estados.orm";

@Route("/api/visitas_estados")
@Tags("VisitasEstadosController")
export class VisitasEstadosController {
  @Get("/")
  public async getVisitasEstados(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/visitas_estados] Get VisitaEstado By ID: ${id}`);
      response = await getVisitaEstadoByID(id);
    } else {
      LogSuccess('[/api/visitas_estados] Get All VisitasEstados Request');
      response = await getAllVisitasEstados(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteVisitasEstados(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteVisitaEstadoByID(id);
        response = {
          message: `VisitaEstado with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting VisitaEstado with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/visitas_estados] Delete VisitaEstado Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateVisitasEstados(@Query() id: string, @Body() visitaEstadoData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/visitas_estados] Update VisitaEstado Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing VisitaEstado";
      return response;
    }

    // Actualizar el VisitaEstado con los datos proporcionados
    await updateVisitaEstadoByID(id, visitaEstadoData);

    response.success = true;
    response.message = `VisitaEstado with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createVisitasEstados(@Body() visitaEstadoData: any): Promise<any> {
    try {
      // Crear el VisitaEstado
      const response = await createVisitaEstado(visitaEstadoData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating VisitaEstado: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating VisitaEstado: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the VisitaEstado",
      };
    }
  }
}
