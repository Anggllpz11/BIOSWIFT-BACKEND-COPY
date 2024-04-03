import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { PreventivosController } from "../controller/PreventivosController";  // Asegúrate de importar el controlador correcto

let jsonParser = bodyParser.json();

// Router from Express
let preventivosRouter = express.Router();

preventivosRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param (ID)
    let id: any = req?.query?.id;

    // Pagination
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;

    LogInfo(`Query Param: ${id}`);
    // Controller Instance to execute a method
    const controller: PreventivosController = new PreventivosController();
    // Get Response
    const response: any | undefined = await controller.getPreventivos(page, limit, id);
    // Send to the client the response
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Controller Instance to execute a method
    const controller: PreventivosController = new PreventivosController();
    // Get Response
    const response: any | undefined = await controller.deletePreventivos(id);
    // Send to the client the response
    return res.status(200).send(response);
  })

  // UPDATE
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const preventivosData: any = req.body; // Obtain the preventivos data from the body

    // Controller Instance to execute a method
    const controller: PreventivosController = new PreventivosController();

    const response: any = await controller.updatePreventivos(id, preventivosData);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const preventivosData: any = req.body;

    // Controller Instance to execute a method
    const controller: PreventivosController = new PreventivosController();
    const response: any | undefined = await controller.createPreventivos(preventivosData);

    if (response.success) {
      return res.status(201).send(response); // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

// Export preventivosRouter
export default preventivosRouter;
