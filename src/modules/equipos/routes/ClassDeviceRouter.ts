import express, { Request, Response } from "express";
import { ClassDeviceController } from "../controller/ClassDeviceController";
import { verifyToken } from "../../equipos/middlewares/verifyToken.middleware";
import bodyParser from "body-parser";
import { LogInfo } from "../../../utils/logger";

const jsonParser = bodyParser.json();
let classDeviceRouter = express.Router();

classDeviceRouter.route('/')
  .get(verifyToken, async (req: Request, res: Response) => {
    const controller: ClassDeviceController = new ClassDeviceController();
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;

    LogInfo(`Query Param: ${id}`);
    const response: any | undefined = await controller.getClasesEquipos(page, limit, id);
    return res.status(200).send(response);
  })
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const claseEquipoData: any = req.body;
    const controller: ClassDeviceController = new ClassDeviceController();
    const response = await controller.createClaseEquipo(claseEquipoData);
    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  })
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const claseEquipo: any = req.body;
    const controller: ClassDeviceController = new ClassDeviceController();
    const response = await controller.updateClaseEquipo(id, claseEquipo);
    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })
  .delete(verifyToken, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const controller: ClassDeviceController = new ClassDeviceController();
    const response = await controller.deleteClaseEquipo(id);
    return res.status(200).send(response);
  });

export default classDeviceRouter;
