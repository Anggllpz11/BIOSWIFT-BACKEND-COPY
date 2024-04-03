import express, { Request, Response } from "express";
import { HelloController } from "../controller/HelloController";
import { LogInfo } from "../../../utils/logger";
import { BasicResponse } from "../controller/types";


// Router from Express

let helloRouter = express.Router();

//http://localhost:8000/api/hello?name=Baned/

helloRouter.route('/')
// GET:
    .get(async (req: Request, res: Response) =>{
        // Obtain a Query Param
        let name: any = req?.query?.name;
        LogInfo(`Query param ${name}`);
        // Controller Instance to execute a method
        const controller: HelloController = new HelloController();
        // Get Response
        const response: BasicResponse = await controller.getMessage(name);
        // Send to the client the response
        return res.send(response);

    })

// Export HelloRouter

export default helloRouter;