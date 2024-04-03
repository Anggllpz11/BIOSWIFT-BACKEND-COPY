import { tecnicoEntity } from "../entities/Tecnicos.entity";
import mongoose from "mongoose";
import { LogError } from "../../../../utils/logger";
import { LogSuccess } from "../../../../utils/logger";
import { ITecnico } from "../interfaces/ITecnico.interface";
import { IAuth } from "../interfaces/IAuth.interface";

// Environment variables

import dotenv from 'dotenv';



// Environment variables Configuration

dotenv.config();


// CRUD

/**
 * Method to obtain all Tecnicos from Collection "tecnicos" in Mongo Server
 */

export const getAllTecnicos = async (page: number, limit: number): Promise<any[] | undefined>  =>{
    try{
        let tecnicoModel = tecnicoEntity();

        let response: any = {};
        // Search all Tecnicos (using pagination)

        await tecnicoModel.find()
        .limit(limit)
        .skip((page - 1) * limit)
        .exec().then((tecnicos: ITecnico[]) =>{
            response.tecnicos = tecnicos;
        });

        // Count total documents in Tecnicos collection
        await tecnicoModel.countDocuments().then((total: number) => {
            response.totalPages = Math.ceil(total / limit);
            response.currentPage = page;
        });
        return response;


    
    }catch (error){
        LogError(`[ORM ERROR]: Getting All Tecnicos: ${error}`);
        // throw error;
    }
}

// - GET Tecnico by ID

export const getTecnicoByID = async (id: string) : Promise <any | undefined> =>{
    try {
        let tecnicoModel = tecnicoEntity();

        // Search Tecnicos by ID
        return await tecnicoModel.findById(id);

    } catch(error){
        LogError(`[ORM ERROR]: Getting Tecnico By ID: ${error}`);
    }
}

// - Delete Tecnico By ID

export const deleteTecnicoByID = async (id: string): Promise <any | undefined> =>{
    try{
        let tecnicoModel = tecnicoEntity();
        // Delete Tecnicos BY ID
        return await tecnicoModel.deleteOne({_id: id})
    }catch (error){
        LogError('[ORM ERROR]: Deleting Tecnico By ID')
    }
}

// - Create New Tecnico

export const createTecnico = async (tecnico: ITecnico): Promise <any | undefined> =>{
    try {
        let tecnicoModel = tecnicoEntity();
        // Create / Insert New Tecnicos
        return await tecnicoModel.create(tecnico);
    }catch(error){
        LogError(`[ORM ERROR]: Creating Tecnico: ${error}`)
    }
}





// - Update Tecnicos BY ID

export const updateTecnicoByID = async (id: string, tecnico: ITecnico ): Promise <any | undefined> =>{
    try {
        let tecnicoModel = tecnicoEntity();
        //  Update Tecnicos
        return await tecnicoModel.findByIdAndUpdate(id, tecnico);
    }catch(error){
        LogError(`[ORM ERROR]: Updating Tecnico ${id}: ${error}`)
    }
}

// Register Tecnico

export const registerTecnico = async (tecnico: ITecnico): Promise <any | undefined>=>{
    try {
        let tecnicoModel = tecnicoEntity();
        // Create / Insert New Tecnico
        return await tecnicoModel.create(tecnico);
    }catch(error){
        LogError(`[ORM ERROR]: Registering Tecnico: ${error}`)
    }
}
