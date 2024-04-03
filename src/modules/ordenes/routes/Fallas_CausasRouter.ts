import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { FallasCausasController } from "../controller/Fallas_CausasController";  // Importar el controlador correcto para FallasCausas

let jsonParser = bodyParser.json();

// Router de Express
let fallasCausasRouter = express.Router();

fallasCausasRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;

    // Paginación
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: FallasCausasController = new FallasCausasController();
    // Obtener respuesta
    const response: any | undefined = await controller.getFallasCausas(page, limit, id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: FallasCausasController = new FallasCausasController();
    // Obtener respuesta
    const response: any | undefined = await controller.deleteFallasCausas(id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // UPDATE:
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const fallaCausaData: any = req.body;  // Referirse a los datos de FallaCausa

    // Instancia del controlador para ejecutar un método
    const controller: FallasCausasController = new FallasCausasController();

    const response: any = await controller.updateFallasCausas(id, fallaCausaData);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  // POST:
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const fallaCausaData: any = req.body;  // Referirse a los datos de FallaCausa

    // Instancia del controlador para ejecutar un método
    const controller: FallasCausasController = new FallasCausasController();
    const response: any | undefined = await controller.createFallasCausas(fallaCausaData);

    if (response.success) {
      return res.status(201).send(response);  // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

// Exportar fallasCausasRouter
export default fallasCausasRouter;
