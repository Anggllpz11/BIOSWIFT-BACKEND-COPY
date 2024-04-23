import { LogInfo } from '../../../utils/logger';
import { userEntity } from '../domain/entities/User.entity';
import { roleEntity } from '../domain/entities/Roles.entity';
import mongoose from 'mongoose';
import { ISearchController } from './interfaces';
import { sedeEntity } from '../domain/entities/Sede.entity';
import { clientEntity } from '../domain/entities/Client.entity';

class SearchController implements ISearchController {
  public async searchUsersByKeyword(keyword: string): Promise<any> {
    try {
      if (typeof keyword !== 'string') {
        throw new Error('El parámetro keyword es inválido.');
      }

      LogInfo(`Search for users with keyword: ${keyword}`);

      const userModel = userEntity();
      const rolesModel = roleEntity();

      // Primero, busca los roles por nombre en la colección Roles
      const roles = await rolesModel.find({ name: { $regex: keyword, $options: 'i' } }).select('_id');
      const roleIds = roles.map(role => role._id);

      // Luego, busca usuarios que tengan esos roles por ObjectId
      const users = await userModel
        .find({
          $or: [
            { username: { $regex: keyword, $options: 'i' } },
            { name: { $regex: keyword, $options: 'i' } },
            { telefono: { $regex: keyword, $options: 'i' } },
            { email: { $regex: keyword, $options: 'i' } },
            { more_info: { $regex: keyword, $options: 'i' } },
            { roles: { $in: roleIds } },
          ],
        })
        .select('_id number username name cedula telefono email more_info') // Excluye el campo 'cedula'
        .populate({
          path: 'roles',
          model: rolesModel, // Usa el modelo de Roles aquí
          select: 'name',
        }); // Agrega el nombre del rol a la respuesta

      return users;
    } catch (error) {
      console.error(error);
      throw new Error('Error en la búsqueda de usuarios.');
    }
  }

  public async searchSedesByKeyword(keyword: string): Promise<any> {
    try {
      if (typeof keyword !== 'string') {
        throw new Error('El parámetro keyword es inválido.');
      }

      LogInfo(`Buscar sedes con palabra clave: ${keyword}`);

      const sedeModel = sedeEntity();

      // Realiza la búsqueda de sedes por nombre o cualquier otro campo relevante
      const sedes = await sedeModel
        .find({
          $or: [
            { sede_nombre: { $regex: keyword, $options: 'i' } },
            { sede_address: { $regex: keyword, $options: 'i' } },
            { sede_telefono: { $regex: keyword, $options: 'i' } },
            { sede_email: { $regex: keyword, $options: 'i' } },
            // Agrega otros campos para buscar según sea necesario
          ],
        })
        .select('sede_nombre sede_address sede_telefono sede_email'); // Puedes seleccionar los campos que desees

      return sedes;
    } catch (error) {
      console.error(error);
      throw new Error('Error en la búsqueda de sedes.');
    }
  }

  public async searchClientByKeyword(keyword: string): Promise<any> {
    try {
      let searchCriteria: any = {};
  
      if (keyword) {
        // Intenta convertir el keyword a número, si es una cadena válida
        const numericKeyword = parseInt(keyword, 10);
  
        // Si la conversión es exitosa, busca en client_nit como número
        if (!isNaN(numericKeyword)) {
          searchCriteria.client_nit = numericKeyword;
        } else {
          // Si no se puede convertir a número, busca en otros campos como cadena
          searchCriteria = {
            $or: [
              { client_name: { $regex: keyword, $options: 'i' } },
              { client_address: { $regex: keyword, $options: 'i' } },
              { client_telefono: { $regex: keyword, $options: 'i' } },
              { client_email: { $regex: keyword, $options: 'i' } },
              // Agrega otros campos para buscar según sea necesario
            ],
          };
        }
      }
  
      const clientModel = clientEntity();
  
      const clients = await clientModel
        .find(searchCriteria)
        .select('client_name client_nit client_address client_telefono client_email');
  
      return clients;
    } catch (error) {
      console.error(error);
      throw new Error('Error en la búsqueda de clientes.');
    }
  }
  

}

export default new SearchController();
