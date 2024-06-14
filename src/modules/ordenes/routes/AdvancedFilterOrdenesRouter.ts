import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import AdvancedFilterOrdenesController from '../controller/AdvancedFilterOrdenesController';
import { verifyToken } from "../middlewares/verifyToken.middleware";

let jsonParser = bodyParser.json();

// Router de Express
let advancedFilterOrdenesRouter = express.Router();

advancedFilterOrdenesRouter.route('/')
  .post(verifyToken, jsonParser, async (req: Request, res: Response) => {
    const filtersArray: any[] = req.body; 
    const page: number = parseInt(req.query.page as string) || 1;
    const limit: number = parseInt(req.query.limit as string) || 10;

    if (!Array.isArray(filtersArray)) {
      return res.status(400).json({ error: 'Invalid filters array.' });
    }

    try {
      const results = await AdvancedFilterOrdenesController.filterOrdenes(filtersArray, page, limit);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error filtering ordenes.' });
    }
  });

export default advancedFilterOrdenesRouter;
