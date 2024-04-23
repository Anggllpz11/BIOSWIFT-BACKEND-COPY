import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { CotizacionesEstadosController } from "../controller/Cotizaciones_EstadosController"; // Importar el controlador correcto para Cotizaciones_Estados

let jsonParser = bodyParser.json();

// Router de Express para Cotizaciones_Estados
let cotizacionesEstadosRouter = express.Router();

cotizacionesEstadosRouter.route('/')

  // GET: Obtener estados de cotizaciones (con opción de paginación y filtrado por ID)
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id; // ID para obtener un estado específico
    let page: any = req?.query?.page || 1; // Página para paginación
    let limit: any = req?.query?.limit || 10; // Límite de estados por página

    LogInfo(`Query Param: ${id}`);
    const controller: CotizacionesEstadosController = new CotizacionesEstadosController(); // Usar la instancia correcta
    const response: any | undefined = await controller.getCotizacionesEstados(page, limit, id);

    return res.status(200).send(response);
  })

  // DELETE: Eliminar un estado de cotización específico por ID
  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;

    LogInfo(`Query Param: ${id}`);
    const controller: CotizacionesEstadosController = new CotizacionesEstadosController(); // Usar la instancia correcta
    const response: any | undefined = await controller.deleteCotizacionEstado(id);

    return res.status(200).send(response);
  })

  // PUT: Actualizar un estado de cotización específico por ID
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const cotizacionEstadoData: any = req.body; // Asegurarse de referirse a los datos de CotizacionEstado

    const controller: CotizacionesEstadosController = new CotizacionesEstadosController(); // Usar la instancia correcta
    const response: any = await controller.updateCotizacionEstado(id, cotizacionEstadoData);

    return response.success ? res.status(200).send(response) : res.status(500).send(response);
  })

  // POST: Crear un nuevo estado de cotización
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const cotizacionEstadoData: any = req.body; // Asegurarse de referirse a los datos de CotizacionEstado

    const controller: CotizacionesEstadosController = new CotizacionesEstadosController(); // Usar la instancia correcta
    const response: any | undefined = await controller.createCotizacionEstado(cotizacionEstadoData);

    return response.success ? res.status(201).send(response) : res.status(500).send(response);
  });

// Exportar cotizacionesEstadosRouter
export default cotizacionesEstadosRouter;
