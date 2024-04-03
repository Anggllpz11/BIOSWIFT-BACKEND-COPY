import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";

// Body Parser to Read BODY from requests
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { SolicitudesEstadosController } from "../controller/SolicitudesEstadosController";

let jsonParser = bodyParser.json();

// Router from Express
let solicitudesEstadosRouter = express.Router();

solicitudesEstadosRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    const controller: SolicitudesEstadosController = new SolicitudesEstadosController();
    const response: any | undefined = await controller.getSolicitudesEstados(page, limit, id);
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const controller: SolicitudesEstadosController = new SolicitudesEstadosController();
    const response: any | undefined = await controller.deleteSolicitudesEstados(id);
    return res.status(200).send(response);
  })

  // UPDATE
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const estadoData: any = req.body;
    const controller: SolicitudesEstadosController = new SolicitudesEstadosController();
    const response: any = await controller.updateSolicitudesEstados(id, estadoData);
    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  // POST
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const estadoData: any = req.body;
    const controller: SolicitudesEstadosController = new SolicitudesEstadosController();
    const response: any | undefined = await controller.createSolicitudesEstados(estadoData);
    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  });

// Export solicitudesEstadosRouter
export default solicitudesEstadosRouter;
