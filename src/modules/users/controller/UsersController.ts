import { Get, Query, Route, Tags, Delete, Post, Put, Body } from "tsoa";
import { IUserController } from "./interfaces";
import { LogSuccess, LogError, LogWarning, LogInfo } from "../../../utils/logger";


// ORM - Users Collection
import { deleteUserByID, getAllUsers, getUserByID, updateUserByID } from "../domain/orm/User.orm";
import { BasicResponse } from "./types";
import { userEntity} from "../domain/entities/User.entity";
import { roleEntity } from "../domain/entities/Roles.entity";
import mongoose from "mongoose";



@Route("/api/users")
@Tags("UserController")

export class UserController implements IUserController {
    
    
    /**
     * Endpoint to retreive the USers in the "Users" Collection from DB
     * @param {string} id Id of user to retreive (optional)
     * @returns All users or user found by ID  
    */
   @Get("/")
   public async getUsers(page: number, limit: number, @Query()id?: string): Promise<any> {
       
       let response: any = '';
    
       if(id){
           LogSuccess(`[/api/users] Get User By ID: ${id}`)
           response = await getUserByID(id);
           
           
        
    }else{
        LogSuccess('[/api/users] Get All Users Request')
        
        response = await getAllUsers(page, limit);
        
    }
    return response;
} 

/**
 * Endpoint to delete the USers in the "Users" Collection from DB
 * @param {string} id Id of user to retreive (optional)
 * @returns message confirming user was deleted
*/
@Delete("/")
public async deleteUser(@Query()id?: string): Promise<any> {
    
    let response: any = '';
    
     if(id){
         try {
             await deleteUserByID(id);
             response = {
             
                message: `User with ID: ${id} deleted successfully`
            };
        } catch (error) {
            response = {
          
                message: `Error deleting user with ID: ${id}`
            };
        }
    } else {
        LogWarning('[/api/users] Delete User Request WITHOUT ID ');
        
        response = {
            
            message: 'Please, provide an ID to remove from DB'
        };
    }
    return response;
}

/**
 * Endpoint to create new user in the "Users" Collection from DB
 * @param {string} id Id of user to retreive (optional)
 * @returns message confirming user was deleted
*/



@Put("/")
public async updateUser(@Query() id: string, @Body() user: any): Promise<{ success: boolean; message: string }> {
    try {
        let response: { success: boolean; message: string } = {
            success: false,
            message: "",
        };

        if (!id) {
            LogWarning('[/api/users] Update User Request WITHOUT ID');
            response.message = "Please, provide an Id to update an existing User";
            return response;
        }

        // Controller Instance to execute a method
        const existingUser = await getUserByID(id);

        if (!existingUser) {
            response.message = `User with ID ${id} not found`;
            return response;
        }

        // Update User
        await updateUserByID(id, user);

        response.success = true;
        response.message = `User with ID ${id} updated successfully`;
        return response;
    } catch (error) {
        LogError(`[Controller ERROR]: Updating User ${id}: ${error}`);
        return {
            success: false,
            message: "An error occurred while updating the user",
        };
    }
}




}



