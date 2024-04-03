import express, { Request, Response } from 'express';
import SearchController from '../controller/SearchController'; // Asegúrate de importar el controlador correcto
import { verifyToken } from '../middlewares/verifyToken.middleware';

let searchRouter = express.Router();

searchRouter.route('/')
  .post(verifyToken, async (req: Request, res: Response) => {
    const { keyword } = req.body;
    // Lógica para buscar usuarios por palabra clave 'keyword'
    try {
      const results = await SearchController.searchUsersByKeyword(keyword); // Utiliza el controlador correcto
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda de usuarios.' });
    }
  });

searchRouter.route('/sedes')
  .post(verifyToken, async (req: Request, res: Response) => {
    const { keyword } = req.body;
    // Lógica para buscar sedes por palabra clave 'keyword'
    try {
      const results = await SearchController.searchSedesByKeyword(keyword); // Utiliza el controlador correcto
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda de sedes.' });
    }
  });

  searchRouter.route('/clients')
  .post(verifyToken, async (req: Request, res: Response) => {
    const { keyword } = req.body;
    // Lógica para buscar clientes por palabra clave 'keyword'
    try {
      const results = await SearchController.searchClientByKeyword(keyword); // Utiliza el controlador correcto
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda de clientes.' });
    }
  });

export default searchRouter;
