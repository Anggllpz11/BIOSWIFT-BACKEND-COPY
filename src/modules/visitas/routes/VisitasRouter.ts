import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { VisitasController } from "../controller/VisitasController";
import multer, { FileFilterCallback } from 'multer';
import path from "path";
import { generateGetPresignedUrl, generatePresignedUrl } from "../../../services/s3bucket";


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

  // Endpoint para generar una URL firmada
    visitasRouter.route('/generate-presigned-url')
    .get(verifyToken, async (req: Request, res: Response) => {
      const fileName = req.query.fileName as string; // Asegúrate de validar y sanitizar la entrada del usuario

      if (!fileName) {
        return res.status(400).send('Nombre de archivo no proporcionado');
      }

      try {
        const url = await generatePresignedUrl(fileName);
        return res.json({ presignedUrl: url });
      } catch (err) {
        return res.status(500).send('No se pudo generar la URL firmada');
      }
    });

    // Endpoint para generar una URL firmada de acceso GET para un objeto en S3
    visitasRouter.route('/generate-presigned-url-get')
    .get(verifyToken, async (req: Request, res: Response) => {
      const key = req.query.key as string; // Asegúrate de validar y sanitizar la entrada del usuario

      if (!key) {
        return res.status(400).send('Clave del objeto no proporcionada');
      }

      try {
        const presignedUrl = await generateGetPresignedUrl(key);
        return res.json({ presignedUrl: presignedUrl });
      } catch (err) {
        console.error(`Error al generar la URL firmada de GET: ${err}`);
        return res.status(500).send('No se pudo generar la URL firmada de GET');
      }
    });

// Exportar visitasRouter
export default visitasRouter;
