import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";

import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { ServiciosController } from "../controller/ServiciosController";

let jsonParser = bodyParser.json();
let serviciosRouter = express.Router();

serviciosRouter.route('/')

  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;

    LogInfo(`Query Param: ${id}`);
    const controller: ServiciosController = new ServiciosController();
    const response = await controller.getServicios(page, limit, id);
    return res.status(200).send(response);
  })

  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const controller: ServiciosController = new ServiciosController();
    const response = await controller.deleteServicios(id);
    return res.status(200).send(response);
  })

  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const serviciosData: any = req.body;
    const controller: ServiciosController = new ServiciosController();
    const response = await controller.updateServicios(id, serviciosData);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const serviciosData: any = req.body;
    const controller: ServiciosController = new ServiciosController();
    const response = await controller.createServicios(serviciosData);

    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  });

export default serviciosRouter;
