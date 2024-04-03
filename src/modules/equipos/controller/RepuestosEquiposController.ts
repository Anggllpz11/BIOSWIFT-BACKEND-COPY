import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { IRepuestoEquipoController } from "./interfaces";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";
import { repuestoEquipoEntity } from "../domain/entities/RepuestoEquipo.entity";
import {
  createRepuestoEquipo,
  deleteRepuestoEquipoByID,
  getAllRepuestoEquipos,
  getRepuestoEquipoByID,
  updateRepuestoEquipoByID,
} from "../domain/orm/RepuestosEquipos.orm";
import { clientEntity } from "../../users/domain/entities/Client.entity";

@Route("/api/repuestos_equipos")
@Tags("RepuestoEquipoController")
export class RepuestoEquipoController implements IRepuestoEquipoController {
  @Get("/")
  public async getRepuestoEquipos(
    page: number,
    limit: number,
    @Query() id?: string
  ): Promise<any> {
    let response: any = "";

    if (id) {
      LogSuccess(`/api/repuestos_equipos Get Repuesto_Equipo By ID: ${id}`);
      response = await getRepuestoEquipoByID(id);
    } else {
      LogSuccess("[/api/repuestos_equipos] Get All Repuestos_Equipos Request");
      response = await getAllRepuestoEquipos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteRepuestoEquipo(
    @Query() id?: string
  ): Promise<any> {
    let response: any = "";

    if (id) {
      try {
        await deleteRepuestoEquipoByID(id);
        response = {
          message: `Repuesto_Equipo with ID: ${id} deleted successfully`,
        };
      } catch (error) {
        response = {
          message: `Error deleting repuesto_equipo with ID: ${id}`,
        };
      }
    } else {
      LogWarning(
        "[/api/repuestos_equipos] Delete Repuesto_Equipo Request WITHOUT ID"
      );
      response = {
        message: "Please, provide an ID to remove from DB",
      };
    }
    return response;
  }

  @Put("/") 
  public async updateRepuestoEquipo(
    @Query() id: string,
    @Body() repuestoEquipoData: any
  ): Promise<any> {
    try {
      let response: { success: boolean; message: string } = {
        success: false,
        message: "",
      };

      if (!id) {
        LogWarning(
          "[/api/repuestos_equipos] Update Repuesto_Equipo Request WITHOUT ID"
        );
        response.message =
          "Please provide an Id to update an existing Repuesto_Equipo";
        return response;
      }

      // Update Repuesto_Equipo by ID
      await updateRepuestoEquipoByID(id, repuestoEquipoData);

      response.success = true;
      response.message = `Repuesto_Equipo with ID ${id} updated successfully`;
      return response;
    } catch (error) {
      LogError(
        `[Controller ERROR]: Updating Repuesto_Equipo ${id}: ${error}`
      );
      return {
        success: false,
        message: "An error occurred while updating the repuesto_equipo",
      };
    }
  }

  @Post("/")
  public async createRepuestoEquipo(
    @Body() repuestoEquipoData: any
  ): Promise<any> {
    try {
      const response = await createRepuestoEquipo(repuestoEquipoData);

      if (response.success) {
        return response;
      } else {
        LogError(
          `[Controller ERROR]: Creating Repuesto_Equipo: ${response.message}`
        );
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Repuesto_Equipo: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the repuesto_equipo",
      };
    }
  }
}
