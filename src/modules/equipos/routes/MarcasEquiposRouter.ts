import express, { Request, Response } from "express";
import { MarcasEquiposController } from "../controller/MarcasEquiposController";
import { verifyToken } from "../middlewares/verifyToken.middleware";
import bodyParser from "body-parser";
import { LogInfo } from "../../../utils/logger";

const jsonParser = bodyParser.json();
let marcasEquiposRouter = express.Router();

marcasEquiposRouter.route("/")
  .get(verifyToken, async (req: Request, res: Response) => {
    const controller: MarcasEquiposController = new MarcasEquiposController();
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;

    LogInfo(`Query Param: ${id}`);
    const response: any | undefined = await controller.getMarcasEquipos(page, limit, id);
    return res.status(200).send(response);
  })
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const marcaEquipoData: any = req.body;
    const controller: MarcasEquiposController = new MarcasEquiposController();
    const response = await controller.createMarcaEquipo(marcaEquipoData);
    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  })
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const marcaEquipo: any = req.body;
    const controller: MarcasEquiposController = new MarcasEquiposController();
    const response = await controller.updateMarcaEquipo(id, marcaEquipo);
    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })
  .delete(verifyToken, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const controller: MarcasEquiposController = new MarcasEquiposController();
    const response = await controller.deleteMarcaEquipo(id);
    return res.status(200).send(response);
  });

export default marcasEquiposRouter;
