import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { OrdenesController } from "../controller/OrdenesController";  // Asegúrate de importar el controlador correcto para Ordenes

let jsonParser = bodyParser.json();

// Router de Express
let ordenesRouter = express.Router();

ordenesRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;

    // Paginación
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: OrdenesController = new OrdenesController();
    // Obtener respuesta
    const response: any | undefined = await controller.getOrdenes(page, limit, id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: OrdenesController = new OrdenesController();
    // Obtener respuesta
    const response: any | undefined = await controller.deleteOrden(id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // UPDATE:
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const ordenData: any = req.body;  // Asegurarse de referirse a los datos de Orden

    // Instancia del controlador para ejecutar un método
    const controller: OrdenesController = new OrdenesController();

    const response: any = await controller.updateOrden(id, ordenData);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  // POST:
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const ordenData: any = req.body;  // Asegurarse de referirse a los datos de Orden

    // Instancia del controlador para ejecutar un método
    const controller: OrdenesController = new OrdenesController();
    const response: any | undefined = await controller.createOrden(ordenData);

    if (response.success) {
      return res.status(201).send(response);  // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

// Exportar ordenesRouter
export default ordenesRouter;
