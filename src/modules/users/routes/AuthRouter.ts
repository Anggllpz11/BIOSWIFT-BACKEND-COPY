import express, { Request, Response } from "express";
import { AuthController } from "../controller/AuthController";
import { LogInfo } from "../../../utils/logger";
import { IUser } from "../domain/interfaces/IUser.interface";
import { IAuth } from "../domain/interfaces/IAuth.interface";
import { isUser, isAdmin, isTecnico, isComercial, isAnalista, isCoordinador, isContabilidad, isAlmacen } from "../middlewares/authJwt";

// BCRYPT for passwords
import bcrypt from 'bcrypt';


// MiddleWare 
import { verifyToken } from "../middlewares/verifyToken.middleware";

// Body Parser (READ JSON from Body in Requests)

import bodyParser from 'body-parser';

// Middleware to read JSON in Body
let jsonParser = bodyParser.json()
// Router from Express

let authRouter = express.Router();

authRouter.route('/register')
    .post(jsonParser, async (req: express.Request, res: Response) => {

        let {
            number, username, password, name, cedula, telefono, email, more_info, roles, type, titulo, reg_invima
        } = req?.body;
        console.log('Roles received:', roles);
        let hashedPassword = '';

        if (number && username && password && name && cedula && telefono && email && more_info && roles) {

            // Obtain Password in Request and cypher
            let hashedPassword = bcrypt.hashSync(password, 8);

            let newUser: IUser = {
                number: number,
                username: username,
                password: hashedPassword,
                name: name,
                cedula: cedula,
                telefono: telefono,
                email: email,
                more_info: more_info,
                roles: roles,
            };

            // Optional fields
            if (type) {
                newUser.type = type;
            }
            if (titulo) {
                newUser.titulo = titulo;
            }
            if (reg_invima) {
                newUser.reg_invima = reg_invima;
            }

            // Controller Instance to execute a method
            const controller: AuthController = new AuthController();
            // Get Response
            const response: any = await controller.registerUser(newUser)
            // Send to the client the response
            return res.status(200).send(response);

        } else {
            // Send to the client the response
            return res.status(400).send({
                message: ' [Error User Data Missing] User cannot be registered'
            });
        }

    })


      

authRouter.route('/login')
    .post(jsonParser, async (req: express.Request, res: Response)=>{

        let { username, password} = req.body;
        

        if(username && password ){

            // Controller Instance to execute a method
            const controller: AuthController = new AuthController();
            
            
         

            let auth: IAuth = {
                username: username,
                password: password
            }

            // Get Response
            const response: any = await controller.loginUser(auth)
            // Send to the client the response whicho includes the JWT
            return res.status(200).send(response);
            
        }else{
            // Send to the client the response
            return res.status(400).send({
                message: ' [Error User Data Missing] User cannot be logged in'
            });
        }
        
    });
    // Route protected by VERIFY TOKEN Middleware
    authRouter.route('/me')
         .get(verifyToken, async (req: Request, res: Response) => {

            //Obtain User ID to check its data             
            let id: any = req?.query?.id;

            
            if(id){
                // Controller: Auth Controller
                const controller: AuthController = new AuthController();
                
                // Get Response from Controller
                let response: any = await controller.userData(id);

                // If user is authorized
                return res.status(200).send(response);
                
                

            }else{
                return res.status(401).send({
                    message: 'You are not authorized to perform this action'
                })
            }

        }); 
            
        authRouter.post('/forgot-password', jsonParser, async (req: express.Request, res: express.Response) => {
        const { email } = req.body;
        
        const controller: AuthController = new AuthController();

        let response:any = await controller.generateAndSendOTP(email);

        return res.status(200).json(response);
    });

    authRouter.route('/otp-validator')
           .post(jsonParser, async (req: express.Request, res: express.Response) => {
               const { email, otp } = req.body;
              
               const controller: AuthController = new AuthController();
              
               let response: any = await controller.validateOTP({ email, otp });
              
               return res.status(response.status).json({ message: response.message });
            });
              
    authRouter.route('/update-password')
        .put(jsonParser, async (req: express.Request, res: express.Response) => {
        const { email, newPassword } = req.body;
        
        const controller: AuthController = new AuthController();
        const response: any = await controller.updatePassword({ email, newPassword });
        
        return res.status(response.status).json({ message: response.message });
        
    });
    


    export default authRouter;