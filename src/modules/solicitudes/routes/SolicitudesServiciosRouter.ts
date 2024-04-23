
import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { SolicitudesServiciosController } from "../controller/SolicitudesServiciosController"; // Importar el controlador correcto
import { verifyToken } from "../../users/middlewares/verifyToken.middleware";

let jsonParser = bodyParser.json();

// Router from Express
let solicitudesServiciosRouter = express.Router();

solicitudesServiciosRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    const controller: SolicitudesServiciosController = new SolicitudesServiciosController();
    const response: any | undefined = await controller.getSolicitudesServicios(page, limit, id);
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const controller: SolicitudesServiciosController = new SolicitudesServiciosController();
    const response: any | undefined = await controller.deleteSolicitudServicio(id);
    return res.status(200).send(response);
  })

 // UPDATE:
.put(verifyToken, jsonParser, async (req: Request, res: Response) => {
  const id: any = req?.query?.id; // El ID de la solicitud de servicio a actualizar
  const solicitudServicioData: any = req.body; // Los datos de la solicitud de servicio a actualizar

  const controller: SolicitudesServiciosController = new SolicitudesServiciosController();
  const response: any = await controller.updateSolicitudServicio(id, solicitudServicioData);

  if (response.success) {
    return res.status(200).send(response);
  } else {
    return res.status(500).send(response);
  }
})


  // CREATE:
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const solicitudServicioData: any = req.body;
  
    const controller: SolicitudesServiciosController = new SolicitudesServiciosController();
    const response: any | undefined = await controller.createSolicitudServicio(solicitudServicioData);
  
    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  });
  

// Exportar solicitudesServiciosRouter
export default solicitudesServiciosRouter;
