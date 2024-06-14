// MunicipiosController.ts

import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createMultipleMunicipios,
  createMunicipio,
  deleteMunicipioByID,
  getAllMunicipios,
  getMunicipioByID,
  updateMunicipioByID
} from "../domain/orm/Municipios.orm";
import { IMunicipiosController } from "./interfaces";

@Route("/api/municipios")
@Tags("MunicipiosController")
export class MunicipiosController implements IMunicipiosController {
  @Get("/")
  public async getMunicipios(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/municipios] Get Municipio By ID: ${id}`);
      response = await getMunicipioByID(id);
    } else {
      LogSuccess('[/api/municipios] Get All Municipios Request');
      response = await getAllMunicipios(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteMunicipio(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteMunicipioByID(id);
        response = {
          message: `Municipio with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting Municipio with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/municipios] Delete Municipio Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateMunicipio(@Query() id: string, @Body() municipioData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/municipios] Update Municipio Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing Municipio";
      return response;
    }

    // Actualizar el Municipio con los datos proporcionados
    await updateMunicipioByID(id, municipioData);

    response.success = true;
    response.message = `Municipio with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createMunicipio(@Body() municipioData: any): Promise<any> {
    try {
      // Verificar si municipioData es un array
      if (Array.isArray(municipioData)) {
        // Crear múltiples municipios
        const response = await createMultipleMunicipios(municipioData);
        return response;
      } else {
        // Crear un único municipio
        const response = await createMunicipio(municipioData);
        if (response.success) {
          return response;
        } else {
          LogError(`[Controller ERROR]: Creating Municipio: ${response.message}`);
          return response;
        }
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Municipio: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the Municipio",
      };
    }
  }
}
