import express, { Request, Response } from 'express';
import SearchOrdenesController from '../controller/SearchOrdenesController';
import { verifyToken } from '../middlewares/verifyToken.middleware';

let searchOrdenesRouter = express.Router();

searchOrdenesRouter.route('/')
  .post(verifyToken, async (req: Request, res: Response) => {
    const { keyword } = req.body;
    const page: number = req.body.page ? parseInt(req.body.page) : 1;
    const limit: number = req.body.limit ? parseInt(req.body.limit) : 10;

    try {
      const results = await SearchOrdenesController.searchOrdenesByKeyword(keyword, page, limit);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda de órdenes.' });
    }
  });

export default searchOrdenesRouter;
