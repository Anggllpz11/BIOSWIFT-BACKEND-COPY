// MunicipiosRouter.ts

import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { MunicipiosController } from "../controller/MunicipiosController";  // Importar el controlador correcto para Municipios

let jsonParser = bodyParser.json();

// Router de Express
let municipiosRouter = express.Router();

municipiosRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;

    // Paginación
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: MunicipiosController = new MunicipiosController();
    // Obtener respuesta
    const response: any | undefined = await controller.getMunicipios(page, limit, id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    // Obtener un parámetro de consulta (ID)
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    // Instancia del controlador para ejecutar un método
    const controller: MunicipiosController = new MunicipiosController();
    // Obtener respuesta
    const response: any | undefined = await controller.deleteMunicipio(id);
    // Enviar al cliente la respuesta
    return res.status(200).send(response);
  })

  // UPDATE:
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const municipioData: any = req.body;  // Referirse a los datos de Municipio

    // Instancia del controlador para ejecutar un método
    const controller: MunicipiosController = new MunicipiosController();

    const response: any = await controller.updateMunicipio(id, municipioData);

    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  // POST:
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const municipioData: any = req.body;  // Referirse a los datos de Municipio

    // Instancia del controlador para ejecutar un método
    const controller: MunicipiosController = new MunicipiosController();
    const response: any | undefined = await controller.createMunicipio(municipioData);

    if (response.success) {
      return res.status(201).send(response);  // Código 201 para indicar la creación exitosa
    } else {
      return res.status(500).send(response);
    }
  });

// Exportar municipiosRouter
export default municipiosRouter;
