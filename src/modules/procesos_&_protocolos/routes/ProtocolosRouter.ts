import express, { Request, Response } from "express";
import { LogInfo } from "../../../utils/logger";

// Body Parser to Read BODY from requests
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";
import { ProtocolosController } from "../controller/ProtocolosController";

let jsonParser = bodyParser.json();

// Router from Express
let protocolosRouter = express.Router();

protocolosRouter.route('/')

  // GET:
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 10;

    LogInfo(`Query Param: ${id}`);
    const controller: ProtocolosController = new ProtocolosController();
    const response: any | undefined = await controller.getProtocolos(page, limit, id);
    return res.status(200).send(response);
  })

  // DELETE:
  .delete(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const controller: ProtocolosController = new ProtocolosController();
    const response: any | undefined = await controller.deleteProtocolos(id);
    return res.status(200).send(response);
  })

  // UPDATE
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const protocolosData: any = req.body;
    const controller: ProtocolosController = new ProtocolosController();
    const response: any = await controller.updateProtocolos(id, protocolosData);
    if (response.success) {
      return res.status(200).send(response);
    } else {
      return res.status(500).send(response);
    }
  })

  // POST
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const protocolosData: any = req.body;
    const controller: ProtocolosController = new ProtocolosController();
    const response: any | undefined = await controller.createProtocolos(protocolosData);
    if (response.success) {
      return res.status(201).send(response);
    } else {
      return res.status(500).send(response);
    }
  });

// Export protocolosRouter
export default protocolosRouter;
