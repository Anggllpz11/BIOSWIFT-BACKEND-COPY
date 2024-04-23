import { Get, Query, Route, Tags, Delete, Post, Put } from "tsoa";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import { ITecnicoController } from "./interfaces";

// ORM - Tecnicos Collection
import { deleteTecnicoByID, getAllTecnicos, getTecnicoByID, updateTecnicoByID, createTecnico } from "../domain/orm/Tecnico.orm";
import { BasicResponse } from "./types";
import { ITecnico } from "../domain/interfaces/ITecnico.interface";


@Route("/api/tecnicos")
@Tags("TecnicosController")

export class TecnicosController implements ITecnicoController {
    /**
     * Endpoint to retreive the Tecnicos in the "Tecnicos" Collection from DB
     * @param {string} id Id of Tecnico to retreive (optional)
     * @returns All Tecnicos or Tecnico found by ID  
    */
   @Get("/")
   public async getTecnico(page: number, limit: number, @Query()id?: string): Promise<any> {
       
       let response: any = '';
    
       if(id){
           LogSuccess(`[/api/tecnicos] Get Tecnico By ID: ${id}`)
           response = await getTecnicoByID(id);
           
           
        
    }else{
        LogSuccess('[/api/tecnicos] Get All Tecnicos Request')
        
        response = await getAllTecnicos(page, limit);
        
    }
    return response;
} 

@Post("/")
public async createTecnico(tecnico: ITecnico): Promise<any> {

    let response: any = '';

    if(tecnico){
        LogSuccess(`[/api/tecnico] Register New User: ${tecnico.user_id}`);
        await createTecnico(tecnico).then((r)=>{
            LogSuccess(`[/api/tecnico] Registered Tecnico: ${tecnico.user_id}`);
            response = {
                message: `Tecnico Registered successfully: ${tecnico.user_id}`
            }
        });
    }else {
        LogWarning(`[/api/tecnico] Register needs Tecnico Entity`)
        response = {
            message: 'Tecnico not Registered: Please, provide a Tecnico Entity to create.'
        }
    }

    return response;
}


    /**
 * Endpoint to delete the Tecnicos in the "Tecnicos" Collection from DB
 * @param {string} id Id of Tecnico to delete (optional)
 * @returns message confirming Tecnico was deleted
*/
@Delete("/")
public async deleteTecnico(@Query()id?: string): Promise<any> {
    
    let response: any = '';
    
     if(id){
         try {
             await deleteTecnicoByID(id);
             response = {
             
                message: `Tecnico with ID: ${id} deleted successfully`
            };
        } catch (error) {
            response = {
          
                message: `Error deleting Tecnico with ID: ${id}`
            };
        }
    } else {
        LogWarning('[/api/tecnicos] Delete Tecnico Request WITHOUT ID ');
        
        response = {
            
            message: 'Please, provide an ID to remove from DB'
        };
    }
    return response;
}


/**
 * Endpoint to update the Tecnicos in the "Tecnicos" Collection from DB
 * @param {string} id Id of Tecnico to update (optional)
 * @returns message confirming Tecnico was Updated
*/
@Put("/")

public async updateTecnico(@Query()id: string, tecnico: ITecnico): Promise<any> {

    let response: any = '';
    
       if(id){
           LogSuccess(`[/api/tecnicos] Update Tecnico By ID: ${id}`)
            await updateTecnicoByID(id, tecnico).then((r)=>{
            response= {
               
                message: `Tecnico with ID ${id} updated successfully`
            }
           })
           
        
    }else{
        LogWarning('[/api/tecnicos] Update Tecnico Request WITHOUD ID')
        
        response = {
           
            message: 'Please, provide an Id to update an existing Tecnico'
        }
    }
    return response;
}

    
}
