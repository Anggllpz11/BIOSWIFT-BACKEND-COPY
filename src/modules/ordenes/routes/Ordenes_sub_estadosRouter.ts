import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { OrdenesSubEstadosController } from "../controller/Ordenes_sub_estadosController";  // Importar el controlador correcto

let jsonParser = bodyParser.json();

// Router de Express
let ordenesSubEstadosRouter = express.Router();

ordenesSubEstadosRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;

    // Paginación
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: OrdenesSubEstadosController = new OrdenesSubEstadosController();
    // Obtener respuesta
    const response: any | undefined = await controller.getOrdenesSubEstados(page, limit, id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: OrdenesSubEstadosController = new OrdenesSubEstadosController();
    // Obtener respuesta
    const response: any | undefined = await controller.deleteOrdenesSubEstados(id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // UPDATE:
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const ordenSubEstadoData: any = req.body;  // Referirse a los datos de OrdenSubEstado

    // Instancia del controlador para ejecutar un método
    const controller: OrdenesSubEstadosController = new OrdenesSubEstadosController();

    const response: any = await controller.updateOrdenesSubEstados(id, ordenSubEstadoData);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  // POST:
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const ordenSubEstadoData: any = req.body;  // Referirse a los datos de OrdenSubEstado

    // Instancia del controlador para ejecutar un método
    const controller: OrdenesSubEstadosController = new OrdenesSubEstadosController();
    const response: any | undefined = await controller.createOrdenesSubEstados(ordenSubEstadoData);

    if (response.success) {
      return res.status(201).send(response);  // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

// Exportar ordenesSubEstadosRouter
export default ordenesSubEstadosRouter;
