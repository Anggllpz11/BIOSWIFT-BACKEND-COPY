// VisitasController.ts

import { Get, Query, Route, Tags, Delete, Put, Body, Post, UploadedFile } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createVisita,
  deleteVisitaByID,
  getAllVisitas,
  getVisitaByID,
  updateVisitaByID
} from "../domain/orm/Visitas.orm";
import { uploadVisitaImageToS3 } from "../../../services/s3bucket"; 
import fs from 'fs';


@Route("/api/visitas")
@Tags("VisitasController")
export class VisitasController {
  @Get("/")
  public async getVisitas(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/visitas] Get Visita By ID: ${id}`);
      response = await getVisitaByID(id);
    } else {
      LogSuccess('[/api/visitas] Get All Visitas Request');
      response = await getAllVisitas(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteVisitas(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteVisitaByID(id);
        response = {
          message: `Visita with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting Visita with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/visitas] Delete Visita Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateVisitas(@Query() id: string, @Body() visitaData: any, @UploadedFile() file?: Express.Multer.File): Promise<any> {
    let response = { success: false, message: "" };

    if (!id) {
      return { success: false, message: "Please provide an Id to update an existing Visita" };
    }

    if (file) {
      try {
        const uploadResult = await uploadVisitaImageToS3(file);
        // Suponiendo que quieres añadir la imagen en el primer objeto de actividades
        if(visitaData.actividades && visitaData.actividades.length > 0) {
          visitaData.actividades[0].id_image = uploadResult.Key; // Actualiza la referencia a la imagen
        }

        // Elimina el archivo temporal después de la carga exitosa
        fs.unlink(file.path, err => {
          if (err) {
            console.error("Error al eliminar el archivo temporal:", err);
          } else {
            console.log(`Archivo temporal ${file.path} eliminado correctamente.`);
          }
        });
      } catch (error) {
        console.error("Error al subir el archivo a S3:", error);
        return { success: false, message: "Error uploading file to S3: " + error };
      }
    }

    // Continúa con la actualización de la visita
    await updateVisitaByID(id, visitaData);
    return { success: true, message: `Visita with ID ${id} updated successfully` };
  }

  @Post("/")
  public async createVisitas(@Body() visitaData: any): Promise<any> {
    try {
      // Crear la Visita
      const response = await createVisita(visitaData);

      if (response.success) {
        return { success: true, message: "Visita creada correctamente", visitaId: response.visitaId };
      } else {
        LogError(`[Controller ERROR]: Creating Visita: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Visita: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the Visita",
      };
    }
  }

}
