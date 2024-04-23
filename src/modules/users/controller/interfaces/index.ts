import { ISede } from "../../domain/interfaces/ISede.interface";
import { ITecnico } from "../../domain/interfaces/ITecnico.interface";
import { IUser } from "../../domain/interfaces/IUser.interface";
import { BasicResponse, ErrorResponse } from "../types";
import { IClient } from "../../domain/interfaces/IClient.interface";


export interface IHelloController {
    getMessage(name?:string): Promise<BasicResponse>;
    // getMessage(name?:string): Promise<ErrorResponse>;
}

export interface IUserController{

    // Read all Users from DATABASE || Get User By ID
    getUsers(page: number, limit: number, id?: string): Promise<any>
    // Delet user by ID from DATABASE 
    deleteUser(id?:string): Promise<any>
    
    // Update User
    updateUser(id:string, user:any): Promise<any>
    // Search User
    // searchUsersByKeyword(keyword: string): Promise<any>
}



export interface IAuthController {
    // register users
    registerUser(user: IUser): Promise<any>
    // Login user
    loginUser(auth: any): Promise<any>
}


export interface ITecnicoController {
    // Read all Tecnicos from DATABASE || Get Tecnico By ID
    getTecnico(page: number, limit: number, id?: string): Promise<any>
    // Create Tecnico
    createTecnico(tecnico: ITecnico): Promise<any>
    // Delet Tecnico by ID from DATABASE 
    deleteTecnico(id?:string): Promise<any>
    
    // Update Tecnico
    updateTecnico(id:string, tecnico:ITecnico): Promise<any>

}


export interface ISedeController{
    // Rad all Sedes from DATABASE // GET Sede by ID
    getSedes(page: number, limit: number, id?: string): Promise<any>
    // CREATE Sede
    createSede(sedeData: ISede): Promise<any>
    // Update Sede
    updateSede(id:string, sedeData: ISede): Promise<any>
    // Delete Sede By ID from DATABASE
    deleteSede(id?: string): Promise<any>
    
}

export interface ISearchController {
    searchUsersByKeyword(keyword: string): Promise<any>;
    searchSedesByKeyword(keyword: string): Promise<any>;
    searchClientByKeyword(keyword: string): Promise<any>; 
  }


  export interface IClientController {
    getClients(page: number, limit: number, id?: string): Promise<any>;
    createClient(client: IClient): Promise<IClient>;
    updateClient(id: string, client: any): Promise<any>;
    deleteClient(id: string): Promise<void>;
  }
  
  