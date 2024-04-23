import express, { Request, Response } from 'express';
import { verifyToken } from '../middlewares/verifyToken.middleware';
import SearchProcesosProtocolosController from '../controller/SearchProcesos&ProtocolosController';

let searchProcesosProtocolosRouter = express.Router();

searchProcesosProtocolosRouter.route('/preventivos')
  .post(verifyToken, async (req: Request, res: Response) => {
    const { keyword } = req.body;
    // Lógica para buscar preventivos por palabra clave 'keyword'
    try {
      const results = await SearchProcesosProtocolosController.searchPreventivosByKeyword(keyword); // Utiliza el controlador correcto
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda de preventivos.' });
    }
  });

  searchProcesosProtocolosRouter.route('/campos')
  .post(verifyToken, async (req: Request, res: Response) => {
    const { keyword } = req.body;
    try {
      const results = await SearchProcesosProtocolosController.searchCamposByKeyword(keyword);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda de campos.' });
    }
  });


// Puedes agregar rutas adicionales según sea necesario para otras entidades

export default searchProcesosProtocolosRouter;
