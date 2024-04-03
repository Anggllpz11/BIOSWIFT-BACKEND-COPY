import { roleEntity } from '../entities/Roles.entity';
import { IRole } from '../interfaces/IRoles.interface';

export const insertRole = async (name: string): Promise<IRole> => {
    try {
        const rolesModel = roleEntity();
        const newRole = new rolesModel({
            name,
        });
        await newRole.save();
        return newRole;
    } catch (error) {
        console.error('[Roles ORM]: Error inserting role:', error);
        throw new Error('[Roles ORM]: Error inserting role');
    }
};