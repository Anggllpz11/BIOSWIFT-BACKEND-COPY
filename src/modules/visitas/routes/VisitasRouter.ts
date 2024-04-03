import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { VisitasController } from "../controller/VisitasController";
import multer, { FileFilterCallback } from 'multer';
import path from "path";


let jsonParser = bodyParser.json();

// Configuración de Multer con validación de tipo de archivo de imagen
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (['.png', '.jpg', '.jpeg', '.gif'].includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'));
    }
  },
});

// Router de Express
let visitasRouter = express.Router();

visitasRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;

    // Paginación
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: VisitasController = new VisitasController();
    // Obtener respuesta
    const response: any | undefined = await controller.getVisitas(page, limit, id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: VisitasController = new VisitasController();
    // Obtener respuesta
    const response: any | undefined = await controller.deleteVisitas(id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // UPDATE:
  .put(verifyToken, jsonParser, upload.single('image'), async (req: Request, res: Response) => {
    const id: any = req.query.id;
    const visitaData: any = req.body;  // Datos de la visita
    const file = req.file;  // El archivo cargado, si existe

    LogInfo(`Update Visita with ID: ${id}`);
    const controller: VisitasController = new VisitasController();
    const response: any = await controller.updateVisitas(id, visitaData, file);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  // POST:
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const visitaData: any = req.body; // Obtener los datos de Visita del cuerpo

    // Instancia del controlador para ejecutar un método
    const controller: VisitasController = new VisitasController();
    const response: any | undefined = await controller.createVisitas(visitaData);

    if (response.success) {
      return res.status(201).send(response); // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

// Exportar visitasRouter
export default visitasRouter;
