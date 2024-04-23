import express, { Express, Request, Response, Router } from "express";



// Swagger

import swaggerUi from 'swagger-ui-express';


// Security

import cors from 'cors';
import helmet from 'helmet';



// Routes
import rootRouter from '../routes';





// * Create Express APP

const server: Express = express();

// * Swagger Config and route
server.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
        swaggerOptions: {
            url: "/swagger.json",
            explorer: true
        }
    })
);

// Define SERVER to use "/api" and use rootRouter from 'index.ts' in routes
// From this point onover: http://logalhost:8000/api/...
server.use(
    '/api',
    rootRouter
    );

// Static Server
server.use(express.static('public'))


// * MONGOOSE CONNECTION 
import mongoose from "mongoose";


mongoose.connect('mongodb+srv://ziriuz:memcodev900454322@generalsziriuz.vpq2tyf.mongodb.net/usersZiriuz?retryWrites=true&w=majority')



// * Security Connection

server.use(helmet())
server.use(cors())

// * Content Type Config
server.use(express.urlencoded(({ extended: true, limit: '50mb'})))
server.use(express.json(({ limit: '50mb' })));

// * Redirections Config

//  http://localhost:8000/ --> http://localhost:8000/api/
server.get('/', (req: Request, res: Response) =>{
    res.redirect('/api');
});

export default server;

