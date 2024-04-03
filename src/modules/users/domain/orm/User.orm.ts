import mongoose from "mongoose";
import { userEntity } from "../entities/User.entity";
import { roleEntity } from "../entities/Roles.entity"; // Importa el modelo de Roles
import { LogError } from "../../../../utils/logger";
import { LogSuccess } from "../../../../utils/logger";
import { IUser } from "../interfaces/IUser.interface";
import { IAuth } from "../interfaces/IAuth.interface";
import { IRole } from "../interfaces/IRoles.interface";

// Environment variables

import dotenv from 'dotenv';

// BCRYPT For Passwords
import bcrypt from 'bcrypt';

// JWT

import jwt from 'jsonwebtoken';


// Environment variables Configuration

dotenv.config();

// Obtein Secret key to generate JWT

const secret = process.env.SECRETKEY || 'MYSECRETKEY';
// CRUD

/**
 * Method to obtain all Users from Collection "Users" in Mongo Server
 */

export const getAllUsers = async (page: number, limit: number): Promise<any[] | undefined>  =>{
    try{
        let userModel = userEntity();
        let roleModel = roleEntity(); // Agrega esta línea para obtener el modelo de Roles

        let response: any = {};
        // Search all users (using pagination)

        await userModel.find({}, { _id: 0, password: 0})
        .limit(limit)
        .skip((page - 1) * limit)
        .select('_id number username name cedula telefono email more_info')
        .populate({
            path: 'roles',
            model: roleModel, // Usa el modelo de Roles aquí
            select: 'name',
        })
        .exec().then((users: any[]) => { // Cambia IUser a any[] para evitar errores de tipado
            
            response.users = users;
        });

        // Count total documents in Users collection
        await userModel.countDocuments().then((total: number) => {
            response.totalPages = Math.ceil(total / limit);
            response.currentPage = page;
        });
        return response;
    }catch (error){
        LogError(`[ORM ERROR]: Getting All Users: ${error}`);
        // throw error;
    }
}
// - GET User by ID

export const getUserByID = async (id: string): Promise<any | undefined> => {
    try {
        let userModel = userEntity();
        let roleModel = roleEntity(); 

        // Search User by ID
        return await userModel.findById(id)
            .select('_id number username name cedula telefono email more_info roles type titulo reg_invima') 
            .populate({
                path: 'roles',
                model: roleModel, // Usa el modelo de Roles aquí
                select: 'name',
            }) // Realiza la operación de "populate" para traer el nombre del rol
            .exec();
    } catch (error) {
        LogError(`[ORM ERROR]: Getting User By ID: ${error}`);
    }
}
// - Delete User By ID

export const deleteUserByID = async (id: string): Promise <any | undefined> =>{
    try{
        let userModel = userEntity();
        // Delete User BY ID
        return await userModel.deleteOne({_id: id})
    }catch (error){
        LogError('[ORM ERROR]: Deleting User By ID')
    }
}

// - Update User BY ID

export const updateUserByID = async (id: string, user: any ): Promise <any | undefined> =>{
    try {
        let userModel = userEntity();
        //  Update User
        return await userModel.findByIdAndUpdate(id, user);
    }catch(error){
        LogError(`[ORM ERROR]: Updating User ${id}: ${error}`)
    }
}

// Register User


// ...

export const registerUser = async (user: IUser, roleNames: string[]): Promise<any | undefined> => {
    try {
      let userModel = userEntity();
  
      // Comprueba si se proporcionaron nombres de roles
      if (roleNames && roleNames.length > 0) {
        // Busca los ObjectIds de los roles basados en los nombres proporcionados
        const roles = await roleEntity().find({ name: { $in: roleNames } });
  
        // Extrae los ObjectIds y nombres de los roles encontrados
        const roleData = roles.map((role) => ({
          _id: role._id.toString(),
          name: role.name,
        }));
  
        // Asigna los roles al usuario
        user.roles = roleData;
      }
  
      // Crea / Inserta al nuevo usuario
      return await userModel.create(user);
    } catch (error) {
      LogError(`[ORM ERROR]: Registering User: ${error}`);
    }
  };
// Login User

export const loginUser = async (auth: IAuth): Promise<any | undefined> => {
    try {
      let userModel = userEntity();
  
      let userFound: IUser | null = null; // Cambiamos la inicialización a null
      let token = undefined;
  
      // Check if user exists by Username
      userFound = await userModel.findOne({ username: auth.username });
  
      if (!userFound) {
        console.error(`[AUTHENTICATION_ERROR in ORM]: User not found`);
        throw new Error(`[AUTHENTICATION_ERROR in ORM]: User not found`);
      }
  
      // Check if Password is valid (compare with bcrypt)
      let validPassword = bcrypt.compareSync(auth.password, userFound!.password);
  
      if (!validPassword) {
        console.error(`[AUTHENTICATION_ERROR in ORM]: Invalid Password`);
        throw new Error(`[AUTHENTICATION_ERROR in ORM]: Invalid Password`);
      }
  
      const userRoles = await roleEntity().find({ _id: { $in: userFound!.roles } });

      // Generate JWT
      token = jwt.sign({ username: userFound!.username }, secret, {
        expiresIn: "2h",
      });
  
      return {
        user: userFound,
        token: token,
        roles: userRoles.map(role => role.name)
      };
    } catch (error) {
      LogError(`[ORM ERROR]: Cannot Log User: ${error}`);
      throw error;
    }
  };
  
  
// Logout User

export const logoutUser = async (): Promise <any | undefined>=>{
    // TODO NOT IMPLEMENTED
}

// TODO