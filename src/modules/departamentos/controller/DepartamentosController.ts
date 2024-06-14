import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createDepartamento,
  deleteDepartamentoByID,
  getAllDepartamentos,
  getDepartamentoByID,
  updateDepartamentoByID
} from "../domain/orm/Departamentos.orm";
import { IDepartamentosController } from "./interfaces";

@Route("/api/departamentos")
@Tags("DepartamentosController")
export class DepartamentosController implements IDepartamentosController {
  @Get("/")
  public async getDepartamentos(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/departamentos] Get Departamento By ID: ${id}`);
      response = await getDepartamentoByID(id);
    } else {
      LogSuccess('[/api/departamentos] Get All Departamentos Request');
      response = await getAllDepartamentos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteDepartamento(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteDepartamentoByID(id);
        response = {
          message: `Departamento with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting Departamento with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/departamentos] Delete Departamento Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateDepartamento(@Query() id: string, @Body() departamentoData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/departamentos] Update Departamento Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing Departamento";
      return response;
    }

    // Actualizar el Departamento con los datos proporcionados
    await updateDepartamentoByID(id, departamentoData);

    response.success = true;
    response.message = `Departamento with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createDepartamento(@Body() departamentoData: any): Promise<any> {
    try {
      // Crear el Departamento
      const response = await createDepartamento(departamentoData);

      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating Departamento: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Departamento: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the Departamento",
      };
    }
  }
}
