import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { ICamposController } from "./interfaces";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";
import { createCampos, deleteCamposByID, getAllCampos, getCamposByID, updateCamposByID } from "../domain/orm/Campos.orm";
import { camposTiposEntity } from "../domain/entities/Campos_Tipos.entity";

@Route("/api/campos")
@Tags("CamposController")
export class CamposController implements ICamposController {
  @Get("/")
  public async getCampos(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/campos] Get Campo By ID: ${id}`);
      response = await getCamposByID(id);
    } else {
      LogSuccess('[/api/campos] Get All Campos Request');
      response = await getAllCampos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteCampos(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteCamposByID(id);
        response = {
          message: `Campo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting campo with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/campos] Delete Campo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateCampos(@Query() id: string, @Body() camposData: any): Promise<any> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };
  
      if (!id) {
        LogWarning('[/api/campos] Update Campo Request WITHOUT ID');
        response.message = "Please provide an Id to update an existing Campo";
        return response;
      }
  
      // Verificar si se proporciona un nuevo nombre de tipo
      if (camposData.id_tipo) {
        // Buscar el tipo de campo por nombre
        const tipoCampo = await camposTiposEntity().findOne({ nombre: camposData.id_tipo });
  
        if (!tipoCampo) {
          response.success = false;
          response.message = "El tipo de campo no se encontró en la base de datos.";
          return response;
        }
  
        // Asociar el tipo de campo actualizado al campo
        camposData.id_tipo = tipoCampo._id;
      }
  
      // Actualizar el campo con los datos proporcionados
      await updateCamposByID(id, camposData);
  
      response.success = true;
      response.message = `Campo with ID ${id} updated successfully`;
      return response;
    } catch (error) {
      LogError(`[Controller ERROR]: Updating Campo ${id}: ${error}`);
      return {
        success: false,
        message: "An error occurred while updating the campo",
      };
    }
  }

  @Post("/")
  public async createCampos(@Body() camposData: any): Promise<any> {
    try {
      // Extraer el nombre del tipo de campo de los datos del campo
      const tipoCampoNombre: string = camposData.id_tipo;

      // Buscar el tipo de campo por nombre
      const tipoCampo = await camposTiposEntity().findOne({ nombre: tipoCampoNombre });
      if (!tipoCampo) {
        return {
          success: false,
          message: "El tipo de campo no se encontró en la base de datos.",
        };
      }

      // Asociar el tipo de campo al campo
      camposData.id_tipo = tipoCampo._id;

      // Crear el campo
      const response = await createCampos(camposData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating Campo: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Campo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the campo",
      };
    }
  }
}
