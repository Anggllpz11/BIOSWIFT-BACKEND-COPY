// Cotizaciones_EstadosController.ts

import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createCotizacionEstado,
  deleteCotizacionEstadoByID,
  getAllCotizacionesEstados,
  getCotizacionEstadoByID,
  updateCotizacionEstadoByID
} from "../domain/orm/Cotizaciones_Estados.orm";
import { ICotizacionesEstadosController } from "./interfaces";

@Route("/api/cotizaciones-estados")
@Tags("CotizacionesEstadosController")
export class CotizacionesEstadosController implements ICotizacionesEstadosController {
  @Get("/")
  public async getCotizacionesEstados(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/cotizaciones-estados] Get CotizacionEstado By ID: ${id}`);
      response = await getCotizacionEstadoByID(id);
    } else {
      LogSuccess('[/api/cotizaciones-estados] Get All CotizacionesEstados Request');
      response = await getAllCotizacionesEstados(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteCotizacionEstado(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteCotizacionEstadoByID(id);
        response = {
          message: `CotizacionEstado with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting CotizacionEstado with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/cotizaciones-estados] Delete CotizacionEstado Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateCotizacionEstado(@Query() id: string, @Body() cotizacionEstadoData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/cotizaciones-estados] Update CotizacionEstado Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing CotizacionEstado";
      return response;
    }

    await updateCotizacionEstadoByID(id, cotizacionEstadoData);

    response.success = true;
    response.message = `CotizacionEstado with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createCotizacionEstado(@Body() cotizacionEstadoData: any): Promise<any> {
    try {
      const response = await createCotizacionEstado(cotizacionEstadoData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating CotizacionEstado: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating CotizacionEstado: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the CotizacionEstado",
      };
    }
  }
}
