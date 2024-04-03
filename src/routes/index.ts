import express, { Request, Response } from 'express';
import { LogInfo } from '../utils/logger';
import bodyParser from 'body-parser'; // Importa bodyParser

/**
 * @route  /api/users
 * @description Users Module Routes
 * @access Public
 */
import helloRouter from '../modules/users/routes/HelloRouter';
import usersRouter from '../modules/users/routes/UserRouter';
import authRouter from '../modules/users/routes/AuthRouter'
import tecnicosRouter from '../modules/users/routes/TecnicoRouter';
import rolesRouter from '../modules/users/routes/RolesRouter';
import sedesRouter from '../modules/users/routes/SedeRouter';
import searchRouter from '../modules/users/routes/SearchRouter';
import clientRouter from '../modules/users/routes/ClientRouter';


/**
 * @route  /api/equipos
 * @description Equipos Module Routes
 * @access Public
 */
import equiposRouter from '../modules/equipos/routes/EquipoRouter';
import modeloEquiposRouter from '../modules/equipos/routes/ModeloEquipoRouter';
import classDeviceRouter from '../modules/equipos/routes/ClassDeviceRouter';
import marcasEquiposRouter from '../modules/equipos/routes/MarcasEquiposRouter';
import tiposEquiposRouter from '../modules/equipos/routes/TipoEquipoRouter';
import areasEquiposRouter from '../modules/equipos/routes/AreaEquipoRouter';
import searchEquiposRouter from '../modules/equipos/routes/SearchEquiposRouter';
import repuestosEquiposRouter from '../modules/equipos/routes/RepuestosEquiposRouter';
import camposTiposRouter from '../modules/procesos_&_protocolos/routes/CamposTiposRouter';
import camposRouter from '../modules/procesos_&_protocolos/routes/CamposRouter';
import preventivosRouter from '../modules/procesos_&_protocolos/routes/PreventivosRouter';
import searchProcesosProtocolosRouter from '../modules/procesos_&_protocolos/routes/SearchProcesos&ProtocolosRouter';
import serviciosRouter from '../modules/procesos_&_protocolos/routes/ServiciosRouter';
import protocolosRouter from '../modules/procesos_&_protocolos/routes/ProtocolosRouter';
import solicitudesEstadosRouter from '../modules/procesos_&_protocolos/routes/SolicitudesEstadosRouter';
import solicitudesServiciosRouter from '../modules/solicitudes/routes/SolicitudesServiciosRouter';
import searchSolicitudesRouter from '../modules/solicitudes/routes/SearchSolicitudesRouter';
import visitasEstadosRouter from '../modules/visitas/routes/Visitas_EstadosRouter';
import ordenesEstadosRouter from '../modules/ordenes/routes/Ordenes_EstadosRouter';
import fallasAccionesRouter from '../modules/ordenes/routes/Fallas_AccionesRouter';
import ordenesSubEstadosRouter from '../modules/ordenes/routes/Ordenes_sub_estadosRouter';
import fallasCausasRouter from '../modules/ordenes/routes/Fallas_CausasRouter';
import fallasModosRouter from '../modules/ordenes/routes/Fallas_ModosRouter';
import falloSistemasRouter from '../modules/ordenes/routes/Fallo_SistemasRouter';
import modosFallosRouter from '../modules/ordenes/routes/Modos_FallosRouter';
import visitasRouter from '../modules/visitas/routes/VisitasRouter';
import ordenesRouter from '../modules/ordenes/routes/OrdenesRouter';


// * Server Instance
let server = express();

// * Configura body-parser antes de las rutas
server.use(bodyParser.json());

// * Router Instance
let rootRotuer = express.Router();

// * Activate request to http://localhost:8000/api
rootRotuer.get('/', (req: Request, res: Response) => {
    LogInfo('GET: http://localhost:8000/api')
    // Send Hello World
    res.send('Welcome to API Restful Express + Nodemon + Jest + TS + React + Swagger + Mongoose');
});

server.use('/', rootRotuer); // http://localhost:8000/api/
// * Redirections to Routers & Controllers -- MODULE USERS
server.use('/hello', helloRouter); // http://localhost:8000/api/hello --> HelloRouter
// Add more routes to the app
server.use('/users', usersRouter) // http://localhost:8000/api/users  --> userRouter
// Auth routes
server.use('/auth', authRouter); // http://localhost:8000/api/auth  --> authRouter
// Tecnicos routes
server.use('/tecnicos', tecnicosRouter); // http://localhost:8000/api/tecnicos  --> tecnicosRouter
server.use('/sedes', sedesRouter);
server.use('/roles', rolesRouter); // http://localhost:8000/api/tecnicos  --> rolesRouter
server.use('/search', searchRouter);
server.use('/clients', clientRouter); // http://localhost:8000/api/clients --> clientRouter

// * Redirections to Routers & Controllers -- MODULE EQUIPOS

server.use('/equipos', equiposRouter) // http://localhost:8000/api/equipos --> equiposRouter
server.use('/equipos/modelo', modeloEquiposRouter) // http://localhost:8000/api/equipos/modelo --> modeloEquiposRouter
server.use('/equipos/clases', classDeviceRouter) // http://localhost:8000/api/equipos/clases --> classDeviceRouter
server.use ('/equipos/marcas', marcasEquiposRouter) // http://localhost:8000/api/equipos/marcas --> marcasEquiposRouter
server.use ('/equipos/tipos', tiposEquiposRouter) // http://localhost:8000/api/equipos/tipos --> tiposEquiposRouter
server.use ('/equipos/areas', areasEquiposRouter) // http://localhost:8000/api/equipos/areas --> areasEquiposRouter
server.use ('/equipos/repuestos', repuestosEquiposRouter) // http://localhost:8000/api/equipos/repuestos --> repuestosEquiposRouter
server.use('/search/equipos', searchEquiposRouter) // http://localhost:8000/api/equipos --> SearchEquiposRouter

// * Redirections to Routers & Controllers -- MODULE PROCESOS & PROTOCOLOS

server.use('/campos-tipos', camposTiposRouter) // http://localhost:8000/api/campos-tipos --> camposTiposRouter
server.use('/campos', camposRouter) // http://localhost:8000/api/campos --> camposRouter
server.use('/preventivos', preventivosRouter) // http://localhost:8000/api/preventivos --> preventivosRouter
server.use('/servicios', serviciosRouter) // http://localhost:8000/api/servicios --> serviciosRouter
server.use('/protocolos', protocolosRouter) // http://localhost:8000/api/protocolos --> protocolosRouter
server.use('/solicitudes-estados', solicitudesEstadosRouter) // http://localhost:8000/api/protocolos --> solicitudesEstadosRouter


server.use('/search/procesos&protocolos', searchProcesosProtocolosRouter) // http://localhost:8000/api/search/ --> searchProcesosProtocolosRouter

// * Redirections to Routers & Controllers -- MODULE SOLICITUDES 

server.use('/solicitudes-servicios', solicitudesServiciosRouter) // http://localhost:8000/api/solicitudes-servicios --> solicitudesServiciosRouter

server.use('/search/solicitudes', searchSolicitudesRouter) // http://localhost:8000/api/search/ --> searchSolicitudesRouter

// * Redirections to Routers & Controllers -- MODULE VISITAS

server.use('/visitas-estados', visitasEstadosRouter) // http://localhost:8000/api/visitas-estados --> visitasEstadosRouter
server.use('/visitas', visitasRouter) // http://localhost:8000/api/visitas --> visitasRouter


// * Redirections to Routers & Controllers -- MODULE ORDENES

server.use('/ordenes-estados', ordenesEstadosRouter) // http://localhost:8000/api/ordenes-estados --> ordenesEstadosRouter
server.use('/fallas-acciones', fallasAccionesRouter) // http://localhost:8000/api/fallas-acciones --> fallasAccionesRouter
server.use('/ordenes-sub-estados', ordenesSubEstadosRouter) // http://localhost:8000/api/ordenes-sub-estados --> ordenesSubEstadosRouter
server.use('/fallas-causas', fallasCausasRouter) // http://localhost:8000/api/fallas-causas --> fallasCausasRouter
server.use('/fallas-modos', fallasModosRouter) // http://localhost:8000/api/fallas-modos --> fallasModosRouter
server.use('/fallo-sistemas', falloSistemasRouter) // http://localhost:8000/api/fallo-sistemas --> falloSistemasRouter
server.use('/modos-fallos', modosFallosRouter) // http://localhost:8000/api/modos-fallos --> modosFallosRouter
server.use('/ordenes', ordenesRouter) // http://localhost:8000/api/ordenes --> ordenesRouter





export default server;
