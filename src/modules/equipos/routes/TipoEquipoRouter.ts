import express, { Request, Response } from "express";
import { TipoEquipoController } from "../controller/TipoEquipoController"; // Importa el controlador de tipos_equipos
import { LogInfo } from "../../../utils/logger";

import bodyParser from 'body-parser';
import { verifyToken } from "../../equipos/middlewares/verifyToken.middleware";

let jsonParser = bodyParser.json();

let tiposEquiposRouter = express.Router();

tiposEquiposRouter.route('/')
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;
    LogInfo(`Query Param: ${id}`);
    const controller: TipoEquipoController = new TipoEquipoController();
    const response: any | undefined = await controller.getTiposEquipos(page, limit, id);
    return res.status(200).send(response);
  })
  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const controller: TipoEquipoController = new TipoEquipoController();
    const response: any | undefined = await controller.deleteTipoEquipo(id);
    return res.status(200).send(response);
  })
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const tipoEquipo: any = req.body;
    const controller: TipoEquipoController = new TipoEquipoController();
    const response: any = await controller.updateTipoEquipo(id, tipoEquipo);
    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const tipoEquipoData: any = req.body;
    const controller: TipoEquipoController = new TipoEquipoController();
    const response: any | undefined = await controller.createTipoEquipo(tipoEquipoData);
    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  });

export default tiposEquiposRouter;
