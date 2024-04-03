import express, { Request, Response } from "express";
import { SedeController } from "../controller/SedeController";
import { LogInfo } from "../../../utils/logger";
import bodyParser from 'body-parser';
import { verifyToken } from "../middlewares/verifyToken.middleware";

let jsonParser = bodyParser.json();
let sedesRouter = express.Router();

sedesRouter.route('/')

    // GET
    .get(verifyToken, async (req: Request, res: Response) => {
        let id: any = req?.query?.id;
        let page: any = req?.query?.page || 1;
        let limit: any = req?.query?.limit || 9;
        LogInfo(`Query Param: ${id}`)
        const controller: SedeController = new SedeController();
        const response: any | undefined = await controller.getSedes(page, limit, id);
        return res.status(200).send(response);
    })

    // POST
    .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
        const sedeData = req.body;
        const controller: SedeController = new SedeController();
        const response: any | undefined = await controller.createSede(sedeData);
        return res.status(201).send(response);
    })

    // DELETE
    .delete(verifyToken, async (req: Request, res: Response) => {
        let id: any = req?.query?.id;
        LogInfo(`Query Param: ${id}`);
        const controller: SedeController = new SedeController();
        const response: any | undefined = await controller.deleteSede(id);
        return res.status(200).send(response);
    })

    // PUT
    .put(verifyToken, jsonParser, async (req: Request, res: Response) => {
        let id: any = req?.query?.id;
        const sedeData = req.body;
        LogInfo(`Query Param: ${id}`);
        const controller: SedeController = new SedeController();
        const response: any = await controller.updateSede(id, sedeData);
        return res.status(200).send(response);
    });

export default sedesRouter;
