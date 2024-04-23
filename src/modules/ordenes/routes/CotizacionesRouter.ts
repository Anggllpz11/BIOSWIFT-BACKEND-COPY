import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { CotizacionesController } from "../controller/CotizacionesController"; 
import { upload } from "../middlewares/multer.middleware";
import { generateGetPresignedUrl, generatePresignedUrlForCotizacionFirma } from "../../../services/s3bucket";
import { sendEmail } from "../../../services/emailService";

let jsonParser = bodyParser.json();

// Router de Express para Cotizaciones
let cotizacionesRouter = express.Router();

cotizacionesRouter.route('/')

  // GET: Obtener cotizaciones (con opción de paginación y filtrado por ID)
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;  // ID para obtener una cotización específica
    let page: any = req?.query?.page || 1;  // Página para paginación
    let limit: any = req?.query?.limit || 10;  // Límite de cotizaciones por página

    LogInfo(`Query Param: ${id}`);
    const controller: CotizacionesController = new CotizacionesController();
    const response: any | undefined = await controller.getCotizaciones(page, limit, id);

    return res.status(200).send(response);
  })

  // DELETE: Eliminar una cotización específica por ID
  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;

    LogInfo(`Query Param: ${id}`);
    const controller: CotizacionesController = new CotizacionesController();
    const response: any | undefined = await controller.deleteCotizacion(id);

    return res.status(200).send(response);
  })

  // PUT: Actualizar una cotización específica por ID
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const cotizacionData: any = req.body;

    const controller: CotizacionesController = new CotizacionesController();
    const response: any = await controller.updateCotizacion(id, cotizacionData);

    return response.success ? res.status(200).send(response) : res.status(500).send(response);
  })

  // POST: Crear una nueva cotización
.post(verifyToken, upload.single('firma'), jsonParser, async (req: Request, res: Response) => {
  const cotizacionData: any = req.body;

  // Si hay un archivo, req.file estará definido
  if (req.file) {
    cotizacionData.firmaFile = req.file; // Añadir el archivo al objeto de datos de cotización para manejarlo en el controlador
  }

  const controller: CotizacionesController = new CotizacionesController();
  const response: any | undefined = await controller.createCotizacion(cotizacionData);

  return response.success ? res.status(201).send(response) : res.status(500).send(response);
});

cotizacionesRouter.route('/generate-presigned-url-for-firma')
  .get(verifyToken, async (req: Request, res: Response) => {
    // Aquí podrías permitir que el frontend especifique un nombre de archivo o usar un valor predeterminado
    const fileName = req.query.fileName || 'default-firma-name.png';
    
    try {
      const presignedUrl = await generatePresignedUrlForCotizacionFirma(fileName.toString());
      return res.status(200).json({ url: presignedUrl });
    } catch (error) {
      console.error(`[ERROR]: Generating presigned URL for firma: ${error}`);
      return res.status(500).json({ message: "Error generating presigned URL for firma" });
    }
  });

  cotizacionesRouter.route('/generate-presigned-url-get')
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

// Endpoint para enviar PDF por correo electrónico
cotizacionesRouter.post('/email-pdf', verifyToken, upload.single('file'), async (req: Request, res: Response) => {
  const { emails, subject } = req.body;
  const file = req.file;

  if (!file || !emails) {
    return res.status(400).send("Archivo o destinatarios no proporcionados.");
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      body { font-family: 'Arial', sans-serif; }
      .header { background-color: #f3f3f3; padding: 10px; text-align: center; }
      .content { margin: 20px; font-size: 16px; }
      .footer { margin-top: 20px; padding: 10px; background-color: #f3f3f3; text-align: center; }
    </style>
  </head>
  <body>
    <div class="header">
      <h1>Documento PDF Adjunto</h1>
    </div>
    <div class="content">
      <p>Estimado usuario,</p>
      <p>Adjunto en este correo, encontrará el documento PDF que ha solicitado.</p>
    </div>
    <div class="footer">
      <p>Gracias por usar nuestro servicio.</p>
    </div>
  </body>
  </html>
  `;

  try {
    await sendEmail(
      emails, 
      subject || "Envío de PDF", 
      htmlContent, 
      [{   // Array de objetos 'Attachment'
        filename: file.originalname,
        content: file.buffer
      }]
    );
    res.status(200).send({ message: "Email enviado correctamente." });
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send({ error: "Error al enviar el correo electrónico" });
  }
});

// Exportar cotizacionesRouter
export default cotizacionesRouter;
