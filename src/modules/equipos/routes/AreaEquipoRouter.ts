import express, { Request, Response } from "express";
import { AreaEquipoController } from "../controller/AreaEquipoController"; // Importa el controlador de areas_equipos
import { LogInfo } from "../../../utils/logger";

import bodyParser from 'body-parser';
import { verifyToken } from "../../equipos/middlewares/verifyToken.middleware";

let jsonParser = bodyParser.json();

let areasEquiposRouter = express.Router();

areasEquiposRouter.route('/')
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;
    LogInfo(`Query Param: ${id}`);
    const controller: AreaEquipoController = new AreaEquipoController();
    const response: any | undefined = await controller.getAreasEquipos(page, limit, id);
    return res.status(200).send(response);
  })
  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const controller: AreaEquipoController = new AreaEquipoController();
    const response: any | undefined = await controller.deleteAreaEquipo(id);
    return res.status(200).send(response);
  })
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const areaEquipo: any = req.body;
    const controller: AreaEquipoController = new AreaEquipoController();
    const response: any = await controller.updateAreaEquipo(id, areaEquipo);
    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const areaEquipoData: any = req.body;
    const controller: AreaEquipoController = new AreaEquipoController();
    const response: any | undefined = await controller.createAreaEquipo(areaEquipoData);
    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  });

export default areasEquiposRouter;
