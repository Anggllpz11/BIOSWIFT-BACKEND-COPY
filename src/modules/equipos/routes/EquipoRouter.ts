import express, { Request, Response } from "express";
import { EquipoController } from "../../equipos/controller/EquiposController";
import { LogInfo } from "../../../utils/logger";

// Body Parser to Read BODY from requests
import bodyParser from 'body-parser';

// JWT Verifier Middleware
import { verifyToken } from "../../equipos/middlewares/verifyToken.middleware";

let jsonParser = bodyParser.json();

// Router from Express
let equiposRouter = express.Router();

equiposRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param (ID)
    let id: any = req?.query?.id;

    // Pagination
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;

    LogInfo(`Query Param: ${id}`);
    // Controller Instance to execute a method
    const controller: EquipoController = new EquipoController();
    // Get Response
    const response: any | undefined = await controller.getEquipos(page, limit, id);
    // Send to the client the response
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtain a Query Param (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Controller Instance to execute a method
    const controller: EquipoController = new EquipoController();
    // Get Response
    const response: any | undefined = await controller.deleteEquipo(id);
    // Send to the client the response
    return res.status(200).send(response);
  })

  // UPDATE
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const equipo: any = req.body; // Obtain the equipo data from the body

    // Controller Instance to execute a method
    const controller: EquipoController = new EquipoController();

    const response: any = await controller.updateEquipo(id, equipo);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const equipoData: any = req.body;

    // Controller Instance to execute a method
    const controller: EquipoController = new EquipoController();
    const response: any | undefined = await controller.createEquipo(equipoData);

    if (response.success) {
      return res.status(201).send(response); // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

  
// Export equiposRouter
export default equiposRouter;
