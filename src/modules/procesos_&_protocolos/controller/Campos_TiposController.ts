// Campos_TiposController.ts

import { Get, Route, Tags, Delete, Put, Body, Post, Query } from "tsoa";
import { ICampos_TiposController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import { createCamposTipos, deleteCamposTiposByID, getAllCamposTipos, getCamposTiposByID, updateCamposTiposByID } from "../domain/orm/Campos_Tipos.orm";

@Route("/api/campos_tipos")
@Tags("Campos_TiposController")
export class Campos_TiposController implements ICampos_TiposController {
  @Get("/")
  public async getCamposTipos(@Query() page: number, @Query() limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/campos_tipos] Get Campos_Tipos By ID: ${id}`);
      response = await getCamposTiposByID(id);
    } else {
      LogSuccess('[/api/campos_tipos] Get All Campos_Tipos Request');
      response = await getAllCamposTipos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteCamposTipos(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteCamposTiposByID(id);
        response = {
          message: `Campos_Tipos with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting Campos_Tipos with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/campos_tipos] Delete Campos_Tipos Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateCamposTipos(@Query() id: string, @Body() camposTiposData: any): Promise<any> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };

      if (!id) {
        LogWarning('[/api/campos_tipos] Update Campos_Tipos Request WITHOUT ID');
        response.message = "Please provide an Id to update an existing Campos_Tipos";
        return response;
      }

      // Actualizar Campos_Tipos por ID
      await updateCamposTiposByID(id, camposTiposData);

      response.success = true;
      response.message = `Campos_Tipos with ID ${id} updated successfully`;
      return response;
    } catch (error) {
      LogError(`[Controller ERROR]: Updating Campos_Tipos ${id}: ${error}`);
      return {
        success: false,
        message: "An error occurred while updating the Campos_Tipos",
      };
    }
  }

  @Post("/")
  public async createCamposTipos(@Body() camposTiposData: any): Promise<any> {
    try {
      // Crear Campos_Tipos con los datos proporcionados
      const response = await createCamposTipos(camposTiposData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating Campos_Tipos: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Campos_Tipos: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the Campos_Tipos",
      };
    }
  }
}
