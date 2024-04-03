import { Get, Query, Route, Tags, Delete, Post, Put, Body, Middlewares, Request } from "tsoa";
import { IAuthController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import { IUser } from "../domain/interfaces/IUser.interface";
import { IAuth } from "../domain/interfaces/IAuth.interface";
import { getUserByID, loginUser, registerUser } from "../domain/orm/User.orm";
import { findUserByEmail, updatePassword } from "../domain/orm/Auth.orm";
import { AuthResponse, BasicResponse, ErrorResponse } from "./types";
import * as otpGenerator from 'otp-generator';
import { userEntity } from "../domain/entities/User.entity";
import { sendEmail } from "../services/emailService";
import { otpMap } from "../domain/interfaces/IOTPData.interface";
import { otpValidatorMiddleware } from "../middlewares/otpValidator";
import { roleEntity } from "../domain/entities/Roles.entity";
@Route("/api/auth")
@Tags("AuthController")



export class AuthController implements IAuthController {
    
  @Post("/register")
public async registerUser(@Body() user: IUser): Promise<BasicResponse | ErrorResponse> {
  try {
    if (user) {
      LogSuccess(`[/api/auth/register] Register New User: ${user.name}`);
      
      // Asegúrate de que los roles se manejen correctamente
      const roleNames: string[] = user.roles.map((role) => role.name) || ['user']; // Obtén los nombres de los roles
      
      // Llama a registerUser para registrar al usuario y asignar roles
      await registerUser(user, roleNames);

      LogSuccess(`[/api/auth/register] Registered User: ${user.username}`);

      // Devuelve una respuesta exitosa sin la propiedad 'user'
      return {
        message: `User Registered successfully: ${user.name}`,
      };
    } else {
      LogWarning(`[/api/auth/register] Register needs user Entity`);
      return {
        error: 'User not Registered',
        message: 'Please, provide a User Entity to create.',
      };
    }
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An error occurred while registering the user.';
    LogError(`[/api/auth/register] Error registering user: ${error}`);
    return {
      error: 'Error registering user',
      message: errorMessage
    };
  }
}

@Post("/login")
public async loginUser(@Body() auth: IAuth): Promise<AuthResponse | ErrorResponse> {
  try {
    if (!auth || !auth.username || !auth.password) {
      LogWarning(`[/api/auth/login] Login needs username and password`);
      return {
        error: '[AUTH ERROR]: Username and Password are Required',
        message: "Please, provide an username and password"
      } as ErrorResponse;
    }

    LogSuccess(`[/api/auth/login] User Login Attempt: ${auth.username}`);
    const data = await loginUser(auth);

    if (!data || !data.user) {
      LogError(`[/api/auth/login] User not found or Invalid Password`);
      return {
        error: '[AUTH ERROR]: Invalid Username or Password',
        message: "Invalid Username or Password"
      } as ErrorResponse;
    }

    LogSuccess(`[/api/auth/login] User Logged In: ${auth.username}`);

    // Obtén el nombre del rol desde la respuesta
    const roleName = data.roles && data.roles.length > 0 ? data.roles[0] : '';
    // Obten el ObjectId del usuario desde la base de datos
    const userId = data.user._id;

    return {
      token: data.token,
      message: `Welcome, ${data.user.name}`,
      roleName: roleName,
      userId: userId // Agrega el nombre del rol a la respuesta
    } as AuthResponse;
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'An error occurred while logging in';

    LogError(`[/api/auth/login] Error logging in: ${errorMessage}`);

    return {
      error: '[AUTH ERROR]: An error occurred while logging in',
      message: errorMessage
    } as ErrorResponse;
  }
}

    
    @Post("/logout")
    public async logoutUser(): Promise<any> {
        let response: any = '';
        // TODO: Close session of user
        throw new Error("Method not implemented.");
    }
    
    
    /**
     * Forgot Password Method
    */
    @Post("/forgot-password")
    public async generateAndSendOTP(email: string): Promise<any> {
      try {
        // Buscar el usuario en la base de datos por su dirección de correo electrónico
        const userModel = userEntity();
        const user: IUser | null = await userModel.findOne({ email });
    
        if (!user) {
          return { status: 404, message: 'Usuario no encontrado' };
        }
    
        // Generar un OTP
        const otp = otpGenerator.generate(6, {
          digits: true,
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
    
        // Almacenar el código OTP en el objeto temporal junto con la hora de generación
        otpMap[email] = {
          otp: otp,
          generationTime: new Date(),
        };
    
        console.log("OTP generado y almacenado:", otp); // Agregamos este mensaje
    
        // Enviar el OTP al correo electrónico del usuario
        const emailSubject = '<no-reply> Recuperación de Contraseña';
        const emailHtml = `
        <html>
              <head>
                <style>
                  /* Define tus estilos CSS aquí */
                  .box {
                    position: relative;
                    width: 380px;
                    height: 420px;
                    background: #1c1c1c;
                    border-radius: 8px;
                    overflow: hidden;
                  }
                  h1 {
                    color: #333333;
                  }
                  p {
                    color: #555555;
                  }

                  .form {
                    position: absolute;
                    inset: 2px;
                    border-radius: 8px;
                    background: #28292d;
                    z-index: 10;
                    padding: 50px 40px;
                    display: flex;
                    flex-direction:  column;    
                }
                .form {
                      color:#00ddfa;
                      font-weight: 500;
                      text-align: center;
                      letter-spacing: 0.1em;
                  }
                
                .inputBox {
                  position: relative;
                  width: 300px;
                  margin-top: 35px;
              
              }


                </style>
              </head>
              <body>
                <div class="box">
                  <div class="form">
                    <div class="inputBox">
                      <h1>Recuperación de Contraseña</h1>
                      <p>Su código de recuperación de contraseña es: ${otp}</p>
                    <div>
                </div>
              </body>
        </html>
        
        
        
        
        
        `;
        await sendEmail(user.email, emailSubject, emailHtml);
    
        return { status: 200, message: 'Se ha enviado un correo con el código de recuperación' };
      } catch (error) {
        console.error(error);
        return { status: 500, message: 'Error al generar el código de recuperación' };
      }
    }
    


    @Post("/otp-validator")
    @Middlewares([otpValidatorMiddleware])
    public async validateOTP(@Body() body: { email: string, otp: string }): Promise<any> {
      try {
        const { email, otp } = body;
  
        // EMAIL & OTP
        const otpData = otpMap[email];
        if (!otpData) {
          return { status: 400, message: 'Código OTP no encontrado' };
        }
  
        const expirationMinutes = 15;
        const currentTime = new Date();
        const timeDifference = currentTime.getTime() - otpData.generationTime.getTime();
        const timeDifferenceInMinutes = timeDifference / (1000 * 60); // CONVERS TO MINUTE
  
        if (timeDifferenceInMinutes > expirationMinutes) {
          return { status: 400, message: 'Código OTP ha expirado' };
        }
  
        if (otpData.otp !== otp) {
          return { status: 400, message: 'Código OTP incorrecto' };
        }
  
        return { status: 200, message: 'Código OTP válido' };
  
      } catch (error) {
        console.error(error);
        return { status: 500, message: 'Error al validar el código OTP' };
      }
    }

    @Put("/update-password")
    public async updatePassword(@Body() body: { email: string, newPassword: string }): Promise<any> {
        const { email, newPassword } = body;

        // Utiliza la función de Auth.orm para actualizar la contraseña
        const response = await updatePassword(email, newPassword);

        return response;
    }



/**
 * Endpoint to retreive the USers in the "Users" Collection from DB
 * Middleware: Validate JWT
 * In Headers the x-access-token must be added with a valid JWT
 * @param {string} id Id of user to retreive (optional)
 * @returns All users or user found by ID  
*/



    @Get("/me")
    public async userData(@Query()id: string): Promise<any> {
    
    let response: any = '';

    if(id){
        LogSuccess(`[/api/users] Get User Data By ID: ${id}`);
        response = await getUserByID(id);
        
    }
    return response;

} 
}