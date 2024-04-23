import express, { Request, Response } from 'express';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import { ClientController } from '../controller/ClientController';
import { LogInfo } from '../../../utils/logger';

import bodyParser from 'body-parser';

const jsonParser = bodyParser.json();

let clientRouter = express.Router();
const controller = new ClientController();

clientRouter.route('/')
  .get(verifyToken, async (req: Request, res: Response) => {
    let id: any = req?.query?.id;
    let page: any = req?.query?.page || 1;
    let limit: any = req?.query?.limit || 9;

    LogInfo(`Query Param: ${id}`);
    const response: any | undefined = await controller.getClients(page, limit, id);
    res.status(200).send(response);
  })
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    LogInfo('POST: /api/client');
    const newClient = req.body;
    const createdClient = await controller.createClient(newClient);
    res.status(201).json(createdClient);
  })
  .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    const client: any = req.body;

    const response: any = await controller.updateClient(id, client);

    if (response.success) {
      res.status(200).send(response);
    } else {
      res.status(500).send(response);
    }
  })
  .delete(verifyToken, async (req: Request, res: Response) => {
    const id: any = req?.query?.id;
    LogInfo(`Query Param: ${id}`);
    const response: any | undefined = await controller.deleteClient(id);
    res.status(200).send(response);
  });

export default clientRouter;
