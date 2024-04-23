// SearchSolicitudesRouter.ts
import express, { Request, Response } from 'express';
import SearchSolicitudesController from '../controller/SearchSolicitudesController'; // Asegúrate de importar el controlador correcto
import { verifyToken } from '../../users/middlewares/verifyToken.middleware'; // Ajusta la ruta de importación según la estructura de tu proyecto

let searchSolicitudesRouter = express.Router();

searchSolicitudesRouter.route('/solicitudes-servicios')
  .post(verifyToken, async (req: Request, res: Response) => {
    const { keyword } = req.body;
    // Lógica para buscar solicitudes de servicios por palabra clave 'keyword'
    try {
      const results = await SearchSolicitudesController.searchSolicitudesServiciosByKeyword(keyword); // Utiliza el controlador correcto
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda de solicitudes de servicios.' });
    }
  });

export default searchSolicitudesRouter;
