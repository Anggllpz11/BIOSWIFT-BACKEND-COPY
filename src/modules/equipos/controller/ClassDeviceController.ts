import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { IClassDeviceController } from "../controller/interfaces/index";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";
import { classDeviceEntity } from "../domain/entities/ClassDevice.entity";
import { createClaseEquipo, deleteClaseEquipoByID, getAllClasesEquipos, getClaseEquipoByID, updateClaseEquipoByID } from "../domain/orm/DeviceClass.orm";

@Route("/api/device-classes")
@Tags("ClassDeviceController")
export class ClassDeviceController implements IClassDeviceController {
    public async getClasesEquipos(@Query() page: number, @Query() limit: number, @Query() id?: string): Promise<any> {
        let response: any = '';
    
        if (id) {
          LogSuccess(`[/api/equipos/clases] Get ClaseEquipo By ID: ${id}`);
          response = await getClaseEquipoByID(id);
        } else {
          LogSuccess('[/api/equipos/clases] Get All ClaseEquipos Request');
          response = await getAllClasesEquipos(page, limit);
        }
        return response;
      }

  @Post("/")
  public async createClaseEquipo(@Body() claseEquipo: any): Promise<any> {
    try {
      const response = await createClaseEquipo(claseEquipo);
      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating ClaseEquipo: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating ClaseEquipo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the clase equipo",
      };
    }
  }

  @Put("/")
  public async updateClaseEquipo(@Query() id: string, @Body() claseEquipo: any): Promise<{ success: boolean; message: string }> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };

      if (!id) {
        LogWarning('[/api/equipos/clases] Update ClaseEquipo Request WITHOUT ID');
        response.message = "Please, provide an Id to update an existing ClaseEquipo";
        return response;
      }

      // Controller Instance to execute a method
      const existingClaseEquipo = await getClaseEquipoByID(id);

      if (!existingClaseEquipo) {
        response.message = `ClaseEquipo with ID ${id} not found`;
        return response;
      }

      // Update ClaseEquipo
      await updateClaseEquipoByID(id, claseEquipo);

      response.success = true;
      response.message = `ClaseEquipo with ID ${id} updated successfully`;
      return response;
    } catch (error) {
      LogError(`[Controller ERROR]: Updating ClaseEquipo ${id}: ${error}`);
      return {
        success: false,
        message: "An error occurred while updating the clase equipo",
      };
    }
  }

  @Delete("/")
  public async deleteClaseEquipo(@Query() id: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteClaseEquipoByID(id);
        response = {
          message: `ClaseEquipo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting clase equipo with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/equipos/clases] Delete ClaseEquipo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }
}
