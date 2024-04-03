import { Get, Query, Route, Tags, Delete, Post, Put, Body } from "tsoa";
import { IClientController } from "./interfaces";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";

// ORM - Clients Collection
import { deleteClientByID, getAllClients, getClientByID, updateClientByID } from "../domain/orm/Client.orm";
import { BasicResponse } from "./types";
import { clientEntity } from "../domain/entities/Client.entity";
import mongoose from "mongoose";
import { IClient } from "../domain/interfaces/IClient.interface";

@Route("/api/clients")
@Tags("ClientController")
export class ClientController implements IClientController {
    
    /**
     * Endpoint to retrieve the clients in the "Clients" Collection from DB
     * @param {number} page Page for pagination
     * @param {number} limit Limit of clients per page
     * @param {string} id ID of client to retrieve (optional)
     * @returns All clients or client found by ID
     */
    @Get("/")
    public async getClients(@Query() page: number, @Query() limit: number, @Query() id?: string): Promise<any> {
        let response: any = '';
        if (id) {
            LogSuccess(`[/api/clients] Get Client By ID: ${id}`);
            response = await getClientByID(id);
        } else {
            LogSuccess('[/api/clients] Get All Clients Request');
            response = await getAllClients(page, limit);
        }
        return response;
    }
    

    /**
     * Endpoint to delete the clients in the "Clients" Collection from DB
     * @param {string} id ID of client to delete
     * @returns Message confirming client was deleted
     */
    @Delete("/")
    public async deleteClient(@Query() id?: string): Promise<any> {
        let response: any = '';
        if (id) {
            try {
                await deleteClientByID(id);
                response = {
                    message: `Client with ID: ${id} deleted successfully`
                };
            } catch (error) {
                response = {
                    message: `Error deleting client with ID: ${id}`
                };
            }
        } else {
            LogWarning('[/api/clients] Delete Client Request WITHOUT ID ');
            response = {
                message: 'Please provide an ID to remove from the DB'
            };
        }
        return response;
    }

    /**
     * Endpoint to create a new client in the "Clients" Collection from DB
     * @param {string} id ID of client to retrieve (optional)
     * @returns Message confirming client was created
     */
        @Post("/")
    public async createClient(@Body() client: any): Promise<IClient> {
        try {
            const createdClient = await clientEntity().create(client);
            return createdClient;
        } catch (error) {
            LogError('[Controller ERROR]: Creating Client');
            throw error;
        }
    }

    @Put("/")
    public async updateClient(@Query() id: string, @Body() client: any): Promise<{ success: boolean; message: string }> {
    try {
        let response: { success: boolean; message: string } = {
            success: false,
            message: "",
        };

        if (!id) {
            LogWarning('[/api/clients] Update Client Request WITHOUT ID');
            response.message = "Please, provide an ID to update an existing Client";
            return response;
        }

        // Controller Instance to execute a method
        const existingClient = await getClientByID(id);

        if (!existingClient) {
            response.message = `Client with ID ${id} not found`;
            return response;
        }

        // Update Client
        await updateClientByID(id, client);

        response.success = true;
        response.message = `Client with ID ${id} updated successfully`;
        return response;
    } catch (error) {
        LogError(`[Controller ERROR]: Updating Client ${id}: ${error}`);
        return {
            success: false,
            message: "An error occurred while updating the client",
        };
    }
}

      

}
