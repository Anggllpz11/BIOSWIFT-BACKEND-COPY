import { Get, Query, Route, Tags, Delete, Post, Put, Body } from "tsoa";
import { ISedeController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import { deleteSedeByID, getAllSedes, getSedeByID, updateSedeByID, createSede, getClientByName } from "../domain/orm/Sede.orm";
import { BasicResponse } from "./types";
import { ISede } from "../domain/interfaces/ISede.interface";

@Route("/api/sedes")
@Tags("SedeController")
export class SedeController implements ISedeController {

    @Get("/")
    public async getSedes(page: number, limit: number, @Query() id?: string): Promise<any> {
        let response: any = '';
        if (id) {
            LogSuccess(`[/api/sedes] Get Sede By ID: ${id}`)
            response = await getSedeByID(id);
        } else {
            LogSuccess('[/api/sedes] Get All Sedes Request')
            response = await getAllSedes(page, limit);
        }
        return response;
    }

    @Post("/")
public async createSede(@Body() sedeData: any): Promise<any> {
  try {
    // Extraer el nombre del cliente de los datos de la sede
    const clientName: string = sedeData.id_client;

    // Buscar el cliente por nombre
    const client = await getClientByName(clientName);

    if (!client) {
      return {
        success: false,
        message: "El cliente no se encontró en la base de datos."
      };
    }

    // Asociar el cliente a la sede
    sedeData.id_client = client._id;

    // Crear la sede con las relaciones establecidas
    const response = await createSede(sedeData);

    if (response.success) {
      return {
        success: true,
        message: "Sede created successfully",
        sedeData: response // Devolver la sede recién creada
      };
    } else {
      LogError(`[Controller ERROR]: Creating Sede: ${response.message}`);
      return {
        success: false,
        message: "An error occurred while creating the sede"
      };
    }
  } catch (error) {
    LogError(`[Controller ERROR]: Creating Sede: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the sede"
    };
  }
}

    

    
    





    @Delete("/")
    public async deleteSede(@Query() id?: string): Promise<any> {
        let response: any = '';
        if (id) {
            try {
                await deleteSedeByID(id);
                response = {
                    message: `Sede with ID: ${id} deleted successfully`
                };
            } catch (error) {
                response = {
                    message: `Error deleting sede with ID: ${id}`
                };
            }
        } else {
            LogWarning('[/api/sedes] Delete Sede Request WITHOUT ID ');
            response = {
                message: 'Please, provide an ID to remove from DB'
            };
        }
        return response;
    }

    @Put("/")
public async updateSede(@Query() id: string, @Body() sedeData: any): Promise<any> {
    try {
        LogSuccess(`[/api/sedes] Update Sede By ID: ${id}`);

        // Extraer el nombre del cliente de los datos de la sede
        const clientName: string = sedeData.id_client;

        // Buscar el cliente por nombre
        const client = await getClientByName(clientName);

        if (!client) {
            return {
                success: false,
                message: "El cliente no se encontró en la base de datos."
            };
        }

        // Asociar el cliente a la sede
        sedeData.id_client = client._id;

        const response = await updateSedeByID(id, sedeData);

        if (response) {
            return {
                success: true,
                message: `Sede with ID ${id} updated successfully`
            };
        } else {
            LogError(`[Controller ERROR]: Updating Sede: ${id}`);
            return {
                success: false,
                message: `Error updating sede with ID: ${id}`
            };
        }
    } catch (error) {
        LogError(`[Controller ERROR]: Updating Sede: ${error}`);
        return {
            success: false,
            message: "An error occurred while updating the sede"
        };
    }
}

    


}




