import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";

// Body Parser to Read BODY from requests
import bodyParser from 'body-parser';

// JWT Verifier Middleware
import { Campos_TiposController } from "../controller/Campos_TiposController";
import { verifyToken } from "../middlewares/verifyToken.middleware";

let jsonParser = bodyParser.json();

// Router from Express
let camposTiposRouter = express.Router();

camposTiposRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param (ID)
    let id: any = req?.query?.id;

    // Pagination
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;

    LogInfo(`Query Param: ${id}`);
    // Controller Instance to execute a method
    const controller: Campos_TiposController = new Campos_TiposController();
    // Get Response
    const response: any | undefined = await controller.getCamposTipos(page, limit, id);
    // Send to the client the response
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Controller Instance to execute a method
    const controller: Campos_TiposController = new Campos_TiposController();
    // Get Response
    const response: any | undefined = await controller.deleteCamposTipos(id);
    // Send to the client the response
    return res.status(200).send(response);
  })

  // UPDATE
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const camposTiposData: any = req.body; // Obtain the camposTipos data from the body

    // Controller Instance to execute a method
    const controller: Campos_TiposController = new Campos_TiposController();

    const response: any = await controller.updateCamposTipos(id, camposTiposData);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const camposTiposData: any = req.body;

    // Controller Instance to execute a method
    const controller: Campos_TiposController = new Campos_TiposController();
    const response: any | undefined = await controller.createCamposTipos(camposTiposData);

    if (response.success) {
      return res.status(201).send(response); // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

  
// Export camposTiposRouter
export default camposTiposRouter;
