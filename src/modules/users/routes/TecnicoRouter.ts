import express, { Request, Response } from "express";
import { TecnicosController } from "../controller/TecnicosController";
import { LogInfo } from "../../../utils/logger";

// Body Parser to Read  BODY from requests
import bodyParser from 'body-parser';

 // JWT Verifier Middleware
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { ITecnico } from "../domain/interfaces/ITecnico.interface";

let jsonParser = bodyParser.json();

// Router from Express

let tecnicosRouter = express.Router();

//http://localhost:8000/api/users?id=64e16f5e7b636b0679ca720c

tecnicosRouter.route('/')


// GET:
    .get(verifyToken, async (req: Request, res: Response) =>{
        // Obtein a Query Param (ID)
        let id: any = req?.query?.id;

        // Pagination
        let page: any = req?.query?.page || 1;
        let limit: any = req?.query?.limit || 9;

        LogInfo(`Query Param: ${id}`)
        // Controller Instance to execute a method
        const controller: TecnicosController = new TecnicosController();
        // Get Response
        const response: any | undefined = await controller.getTecnico(page, limit, id);
        // Send to the client the response
        return res.status(200).send(response);

    })


    // DELETE: 
    .delete(verifyToken, async (req: Request, res: Response)=> {
        // Obtein a Query Param (ID)
        let id: any = req?.query?.id;
        LogInfo(`Query Param: ${id}`);
        // Controller Instance to execute a method
        const controller: TecnicosController = new TecnicosController();
        // Get Response
        const response: any | undefined = await controller.deleteTecnico(id);
        // Send to the client the response
        return res.status(200).send(response);
    })




    // UPDATE
    .put(jsonParser, verifyToken, async (req: Request, res: Response)=>{

        // Obtein a Query Param (ID)
        let id: any = req?.query?.id;
       
        // Read from BODY 

        let user_id: string = req?.body?.user_id;
        let tipo: [] = req?.body?.tipo || [];
        let titulo: string = req?.body?.titulo || 'N/A';
        let reg_invima: string = req?.body?.reg_invima || 'N/A';
        let tarjeta_profesional: string = req?.body?.tarjeta_profesional || 'N/A';

        if(user_id && tipo && titulo && reg_invima && tarjeta_profesional){

            // Controller Instance to execute a method
            const controller: TecnicosController = new TecnicosController();

            let tecnico: ITecnico = {
                user_id: user_id,
                tipo: tipo,
                titulo: titulo,
                reg_invima: reg_invima,
                tarjeta_profesional: tarjeta_profesional
            }
            // Get Response
            const response: any = await controller.updateTecnico(id, tecnico);
    
            // Send to the user response
            return res.status(200).send(response);



        }else{
            return res.status(400).send({
                message: '[ERROR] Updating Tecnico. You need to send all attrs of tecnico to update it'
            });
                }

        

        
    })

    .post(jsonParser, verifyToken, async (req: Request, res: Response)=>{
       
        // Read from BODY 

        let user_id: string = req?.body?.user_id;
        let tipo: [] = req?.body?.tipo || [];
        let titulo: string = req?.body?.titulo || 'N/A';
        let reg_invima: string = req?.body?.reg_invima || 'N/A';
        let tarjeta_profesional: string = req?.body?.tarjeta_profesional || 'N/A';
        
        if(user_id && tipo && titulo && reg_invima && tarjeta_profesional){

            // Controller Instance to execute a method
            const controller: TecnicosController = new TecnicosController();

            let tecnico: ITecnico = {
                user_id: user_id,
                tipo: tipo,
                titulo: titulo,
                reg_invima: reg_invima,
                tarjeta_profesional: tarjeta_profesional
            }
            // Get Response
            const response: any = await controller.createTecnico(tecnico);
    
            // Send to the user response
            return res.status(200).send(response);



        }else{
            return res.status(400).send({
                message: '[ERROR] Creating Tecnico. You need to send all attrs of Tecnico to update it'
            });
                }
    })



    



// Export usersRouter

export default tecnicosRouter;

/**
 * Get / Read Documents => 200 OK
 * Post / Create Document => 201 OK
 * Delete Document => 200 (Entity) / 204 (No return)
 * Put / Update Documents => 200 (Entity) / 204 (No Return)
 * 
 */