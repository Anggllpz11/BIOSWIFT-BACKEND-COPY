import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { VisitasEstadosController } from "../controller/Visitas_EstadosController";

let jsonParser = bodyParser.json();

// Router de Express
let visitasEstadosRouter = express.Router();

visitasEstadosRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;

    // Paginación
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: VisitasEstadosController = new VisitasEstadosController();
    // Obtener respuesta
    const response: any | undefined = await controller.getVisitasEstados(page, limit, id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: VisitasEstadosController = new VisitasEstadosController();
    // Obtener respuesta
    const response: any | undefined = await controller.deleteVisitasEstados(id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // UPDATE:
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const visitaEstadoData: any = req.body; // Obtener los datos de visitaEstado del cuerpo

    // Instancia del controlador para ejecutar un método
    const controller: VisitasEstadosController = new VisitasEstadosController();

    const response: any = await controller.updateVisitasEstados(id, visitaEstadoData);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  // POST:
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const visitaEstadoData: any = req.body;

    // Instancia del controlador para ejecutar un método
    const controller: VisitasEstadosController = new VisitasEstadosController();
    const response: any | undefined = await controller.createVisitasEstados(visitaEstadoData);

    if (response.success) {
      return res.status(201).send(response); // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

// Exportar visitasEstadosRouter
export default visitasEstadosRouter;
