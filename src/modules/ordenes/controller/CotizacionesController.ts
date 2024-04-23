// CotizacionesController.ts

import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { LogSuccess, LogError } from "../../../utils/logger";
import {
  createCotizacion,
  deleteCotizacionByID,
  getAllCotizaciones,
  getCotizacionByID,
  updateCotizacionByID
} from "../domain/orm/Cotizaciones.orm";
import { ICotizacionesController } from "./interfaces";
import { uploadFirmaCotizacionToS3 } from "../../../services/s3bucket";

@Route("/api/cotizaciones")
@Tags("CotizacionesController")
export class CotizacionesController implements ICotizacionesController {
  @Get("/")
  public async getCotizaciones(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/cotizaciones] Get Cotizacion By ID: ${id}`);
      response = await getCotizacionByID(id);
    } else {
      LogSuccess('[/api/cotizaciones] Get All Cotizaciones Request');
      response = await getAllCotizaciones(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deleteCotizacion(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deleteCotizacionByID(id);
        response = {
          message: `Cotizacion with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting Cotizacion with ID: ${id}`
        };
      }
    } else {
      LogError('[/api/cotizaciones] Delete Cotizacion Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
  public async updateCotizacion(@Query() id: string, @Body() cotizacionData: any): Promise<any> {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogError('[/api/cotizaciones] Update Cotizacion Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing Cotizacion";
      return response;
    }

    // Actualizar la Cotizacion con los datos proporcionados
    await updateCotizacionByID(id, cotizacionData);

    response.success = true;
    response.message = `Cotizacion with ID ${id} updated successfully`;
    return response;
  }

  @Post("/")
  public async createCotizacion(@Body() cotizacionData: any): Promise<any> {
    try {
      // Verificar si cotizacionData incluye la firma codificada en base64
      if (cotizacionData.firmaBase64) {
        // Convertir el string base64 a un buffer
        const firmaBuffer = Buffer.from(cotizacionData.firmaBase64, 'base64');
  
        // Crear un objeto que simule un archivo de Multer para pasarlo a uploadFirmaCotizacionToS3
        const firmaFile = {
          buffer: firmaBuffer,
          originalname: `firma-${Date.now()}.png`, // Asumiendo que la firma es una imagen PNG
        };
  
        // Subir la firma a S3 y obtener la URL o clave del objeto
        const uploadResult = await uploadFirmaCotizacionToS3(firmaBuffer, `firma-${Date.now()}.png`);
        const firmaUrl = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${uploadResult.Key}`;
  
        // Actualizar cotizacionData con la URL de la firma
        cotizacionData.firma = firmaUrl;
      }
  
      // Crear la Cotizacion con los datos actualizados
      const response = await createCotizacion(cotizacionData);
  
      if (response.success) {
        return response;
      } else {
        LogError(`[Controller ERROR]: Creating Cotizacion: ${response.message}`);
        return response;
      }
    } catch (error) {
      LogError(`[Controller ERROR]: Creating Cotizacion: ${error}`);
      return {
        success: false,
        message: "An error occurred while creating the Cotizacion",
      };
    }
  }
}
