import express, { Request, Response } from 'express';
import SearchEquiposController from '../controller/SearchEquiposController'; // Asegúrate de importar el controlador correcto
import { verifyToken } from '../middlewares/verifyToken.middleware';

let searchEquiposRouter = express.Router();

searchEquiposRouter.route('/')
  .post(verifyToken, async (req: Request, res: Response) => {
    const { keyword } = req.body;
    // Lógica para buscar equipos por palabra clave 'keyword'
    try {
      const results = await SearchEquiposController.searchEquiposByKeyword(keyword); // Utiliza el controlador correcto
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda de equipos.' });
    }
  });

searchEquiposRouter.route('/modelos')
.post(verifyToken, async (req: Request, res: Response) => {
  const { keyword } = req.body;
  try {
    const results = await SearchEquiposController.searchModelosEquiposByKeyword(keyword); // Utiliza el controlador correcto
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda de Modelos de Equipos.' });
  }
});

searchEquiposRouter.route('/areas')
.post(verifyToken, async (req: Request, res: Response) => {
  const { keyword } = req.body;
  try {
    const results = await SearchEquiposController.searchAreasEquiposByKeyword(keyword); // Utiliza el controlador correcto
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda de áreas de Equipos.' });
  }
});

searchEquiposRouter.route('/clases')
.post(verifyToken, async (req: Request, res: Response) => {
  const { keyword } = req.body;
  try {
    const results = await SearchEquiposController.searchClasesEquiposByKeyword(keyword); // Utiliza el controlador correcto
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda de clases de Equipos.' });
  }
});

searchEquiposRouter.route('/marcas')
.post(verifyToken, async (req: Request, res: Response) => {
  const { keyword } = req.body;
  try {
    const results = await SearchEquiposController.searchMarcasEquiposByKeyword(keyword); // Utiliza el controlador correcto
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda de Marcas de Equipos.' });
  }
});

searchEquiposRouter.route('/tipos')
.post(verifyToken, async (req: Request, res: Response) => {
  const { keyword } = req.body;
  try {
    const results = await SearchEquiposController.searchTiposEquiposByKeyword(keyword); // Utiliza el controlador correcto
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: 'Error en la búsqueda de Tipos de Equipos.' });
  }
});

searchEquiposRouter.route('/repuestos')
  .post(verifyToken, async (req: Request, res: Response) => {
    const { keyword } = req.body;
    try {
      const results = await SearchEquiposController.searchRepuestosEquiposByKeyword(keyword);
      res.status(200).json(results);
    } catch (error) {
      res.status(500).json({ error: 'Error en la búsqueda de Repuestos_Equipos.' });
    }
  });

export default searchEquiposRouter;
