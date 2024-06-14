import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { SolicitudesBodegaEstadosController } from "../controller/SolicitudBodegaEstadosController";

let jsonParser = bodyParser.json();
let solicitudBodegaEstadosRouter = express.Router();

solicitudBodegaEstadosRouter.route('/')
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    const controller: SolicitudesBodegaEstadosController = new SolicitudesBodegaEstadosController();
    const response: any | undefined = await controller.getSolicitudBodegaEstados(page, limit, id);
    return res.status(200).send(response);
  })
  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const controller: SolicitudesBodegaEstadosController = new SolicitudesBodegaEstadosController();
    const response: any | undefined = await controller.deleteSolicitudBodegaEstados(id);
    return res.status(200).send(response);
  })
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const estadoData: any = req.body;
    const controller: SolicitudesBodegaEstadosController = new SolicitudesBodegaEstadosController();
    const response: any = await controller.updateSolicitudBodegaEstados(id, estadoData);
    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const estadoData: any = req.body;
    const controller: SolicitudesBodegaEstadosController = new SolicitudesBodegaEstadosController();
    const response: any | undefined = await controller.createSolicitudBodegaEstados(estadoData);
    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  });

export default solicitudBodegaEstadosRouter;
