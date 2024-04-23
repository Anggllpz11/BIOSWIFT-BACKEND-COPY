// SolicitudesServiciosController.ts

import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { ISolicitudesServiciosController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import {
  createSolicitudServicio,
  deleteSolicitudServicioByID,
  getAllSolicitudesServicios,
  getSolicitudServicioByID,
  updateSolicitudServicioByID
} from "../domain/orm/Solicitudes_Servicios.orm";

@Route("/api/solicitudes-servicios")
@Tags("SolicitudesServiciosController")
export class SolicitudesServiciosController implements ISolicitudesServiciosController {
  @Get("/")
  public async getSolicitudesServicios(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';
    if (id) {
      LogSuccess(`[/api/solicitudes-servicios] Get Solicitud Servicio By ID: ${id}`);
      response = getSolicitudServicioByID(id);
    } else {
      LogSuccess('[/api/solicitudes-servicios] Get All Solicitudes Servicios Request');
      response = getAllSolicitudesServicios(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteSolicitudServicio(@Query() id?: string): Promise<any> {
    let response: any = '';
  
    if (id) {
      try {
        await deleteSolicitudServicioByID(id);
        response = {
          message: `Solicitud Servicio with ID: ${id} deleted successfully`
        };
      } catch (error) {
        LogError(`[api/solicitudes-servicios] Error deleting Solicitud Servicio with ID: ${id}: ${error}`);
        response = {
          message: `Error deleting Solicitud Servicio with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/solicitudes-servicios] Delete Solicitud Servicio Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }
  

  @Put("/")
  public async updateSolicitudServicio(@Query() id: string, @Body() solicitudServicioData: any): Promise<any> {
    if (!solicitudServicioData.id_cambiador) {
      LogWarning('[/api/solicitudes-servicios] Update Solicitud Servicio Request WITHOUT ID or Cambiador ID');
      return { message: "Please provide an Id and Cambiador Id to update an existing Solicitud Servicio" };
    }

    return await updateSolicitudServicioByID(id, solicitudServicioData);
  }

  @Post("/")
  public async createSolicitudServicio(@Body() solicitudServicioData: any): Promise<any> {
    if (!solicitudServicioData.id_creador) {
      LogWarning('[/api/solicitudes-servicios] Create Solicitud Servicio Request WITHOUT Creador ID');
      return { message: "Please provide a Creador Id in the request body to create a new Solicitud Servicio" };
    }
  
    return await createSolicitudServicio(solicitudServicioData);
  }
  
}
