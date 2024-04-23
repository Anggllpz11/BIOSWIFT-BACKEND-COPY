import express, { Request, Response } from "express";
import { UserController } from "../controller/UsersController";
import { LogInfo } from "../../../utils/logger";

// Body Parser to Read  BODY from requests
import bodyParser from 'body-parser';

 // JWT Verifier Middleware
import { verifyToken } from "../middlewares/verifyToken.middleware";

let jsonParser = bodyParser.json();

// Router from Express

let usersRouter = express.Router();

//http://localhost:8000/api/users?id=64e16f5e7b636b0679ca720c

usersRouter.route('/')


// GET:
    .get(verifyToken, async (req: Request, res: Response) =>{
        // Obtein a Query Param (ID)
        let id: any = req?.query?.id;

        // Pagination
        let page: any = req?.query?.page || 1;
        let limit: any = req?.query?.limit || 9;

        LogInfo(`Query Param: ${id}`)
        // Controller Instance to execute a method
        const controller: UserController = new UserController();
        // Get Response
        const response: any | undefined = await controller.getUsers(page, limit, id);
        // Send to the client the response
        return res.status(200).send(response);

    })


    // DELETE: 
    .delete(verifyToken, async (req: Request, res: Response)=> {
        // Obtein a Query Param (ID)
        let id: any = req?.query?.id;
        LogInfo(`Query Param: ${id}`);
        // Controller Instance to execute a method
        const controller: UserController = new UserController();
        // Get Response
        const response: any | undefined = await controller.deleteUser(id);
        // Send to the client the response
        return res.status(200).send(response);
    })




    // UPDATE
    .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
        const id: any = req?.query?.id;
        const user: any = req.body; // Obtén los datos del usuario del cuerpo (body)
    
        // Controller Instance to execute a method
        const controller: UserController = new UserController();
    
        const response: any = await controller.updateUser(id, user);
    
        if (response.success) {
            return res.status(200).send(response);
        } else {
            return res.status(500).send(response);
        }
    })
    



    



// Export usersRouter

export default usersRouter;

/**
 * Get / Read Documents => 200 OK
 * Post / Create Document => 201 OK
 * Delete Document => 200 (Entity) / 204 (No return)
 * Put / Update Documents => 200 (Entity) / 204 (No Return)
 * 
 */