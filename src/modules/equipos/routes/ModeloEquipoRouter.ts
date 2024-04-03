import express, { Request, Response } from "express";
import { ModeloEquipoController } from "../controller/ModeloEquipoController"; // Importa el controlador de ModeloEquipo
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser'; // Body Parser para leer el cuerpo de las solicitudes
import { verifyToken } from "../../equipos/middlewares/verifyToken.middleware"; // Middleware para verificar el token JWT

let jsonParser = bodyParser.json();
let modeloEquiposRouter = express.Router();

modeloEquiposRouter.route('/')
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;

    LogInfo(`Query Param: ${id}`);
    const controller: ModeloEquipoController = new ModeloEquipoController();
    const response: any | undefined = await controller.getModeloEquipos(page, limit, id);
    return res.status(200).send(response);
  })
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const equipoData: any = req.body;
    const controller: ModeloEquipoController = new ModeloEquipoController();
    const response: any | undefined = await controller.createModeloEquipo(equipoData);
    
    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  })
  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const controller: ModeloEquipoController = new ModeloEquipoController();
    const response: any | undefined = await controller.deleteModeloEquipo(id);
    return res.status(200).send(response);
  })
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const equipo: any = req.body;
    const controller: ModeloEquipoController = new ModeloEquipoController();
    const response: any = await controller.updateModeloEquipo(id, equipo);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  });

export default modeloEquiposRouter;
