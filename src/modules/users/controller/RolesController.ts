import { Request, Response } from 'express';
import { insertRole } from '../domain/orm/Roles.orm';

export class RolesController {
    public async createRole(name: string): Promise<any> {
        try {
            const newRole = await insertRole(name);
            return {
                message: 'Role created successfully',
                role: newRole,
            };
        } catch (error) {
            console.error('[RolesController]: Error creating role:', error);
            return {
                error: 'Error creating role',
                message: 'An error occurred while creating the role',
            };
        }
    }
}
