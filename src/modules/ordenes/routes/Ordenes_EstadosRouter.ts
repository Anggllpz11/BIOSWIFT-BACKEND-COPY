import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { OrdenesEstadosController } from "../controller/Ordenes_EstadosController";  // Importar el controlador correcto

let jsonParser = bodyParser.json();

// Router de Express
let ordenesEstadosRouter = express.Router();

ordenesEstadosRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;

    // Paginación
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: OrdenesEstadosController = new OrdenesEstadosController();  // Usar la instancia correcta
    // Obtener respuesta
    const response: any | undefined = await controller.getOrdenesEstados(page, limit, id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: OrdenesEstadosController = new OrdenesEstadosController();  // Usar la instancia correcta
    // Obtener respuesta
    const response: any | undefined = await controller.deleteOrdenesEstados(id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // UPDATE:
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const ordenEstadoData: any = req.body;  // Asegurarse de referirse a los datos de OrdenEstado

    // Instancia del controlador para ejecutar un método
    const controller: OrdenesEstadosController = new OrdenesEstadosController();  // Usar la instancia correcta

    const response: any = await controller.updateOrdenesEstados(id, ordenEstadoData);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  // POST:
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const ordenEstadoData: any = req.body;  // Asegurarse de referirse a los datos de OrdenEstado

    // Instancia del controlador para ejecutar un método
    const controller: OrdenesEstadosController = new OrdenesEstadosController();  // Usar la instancia correcta
    const response: any | undefined = await controller.createOrdenesEstados(ordenEstadoData);

    if (response.success) {
      return res.status(201).send(response);  // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

// Exportar ordenesEstadosRouter
export default ordenesEstadosRouter;
