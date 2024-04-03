import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { IProtocolosController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import { createProtocolos, deleteProtocolosByID, getAllProtocolos, getProtocolosByID, updateProtocolosByID } from "../domain/orm/Protocolos.orm";

@Route("/api/protocolos")
@Tags("ProtocolosController")
export class ProtocolosController implements IProtocolosController {
  @Get("/")
  public async getProtocolos(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/protocolos] Get Protocolo By ID: ${id}`);
      response = await getProtocolosByID(id);
    } else {
      LogSuccess('[/api/protocolos] Get All Protocolos Request');
      response = await getAllProtocolos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteProtocolos(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteProtocolosByID(id);
        response = {
          message: `Protocolo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting protocolo with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/protocolos] Delete Protocolo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateProtocolos(@Query() id: string, @Body() protocolosData: any): Promise<any> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };
  
      if (!id) {
        LogWarning('[/api/protocolos] Update Protocolo Request WITHOUT ID');
        response.message = "Please provide an Id to update an existing Protocolo";
        return response;
      }
  
      // Actualizar el protocolo con los datos proporcionados
      await updateProtocolosByID(id, protocolosData);
  
      response.success = true;
      response.message = `Protocolo with ID ${id} updated successfully`;
      return response;
    } catch (error) {
      LogError(`[Controller ERROR]: Updating Protocolo ${id}: ${error}`);
      return {
        success: false,
        message: "An error occurred while updating the protocolo",
      };
    }
  }

  @Post("/")
  public async createProtocolos(@Body() protocolosData: any): Promise<any> {
    try {
      // Crear el protocolo
      const response = await createProtocolos(protocolosData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating Protocolo: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Protocolo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the protocolo",
      };
    }
  }
}
