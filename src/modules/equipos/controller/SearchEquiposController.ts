import { LogInfo } from '../../../utils/logger';
import { equipoEntity } from '../domain/entities/Equipo.entity';
import mongoose from 'mongoose';
import { tipoEquipoEntity } from '../domain/entities/TipoEquipo.entity';
import { sedeEntity } from '../../../modules/users/domain/entities/Sede.entity';
import { clientEntity } from '../../../modules/users/domain/entities/Client.entity';
import { modeloEquipoEntity } from '../domain/entities/ModeloEquipo.entity';
import { areaEquipoEntity } from '../domain/entities/AreaEquipo.entity';
import { marcaEquipoEntity } from '../domain/entities/MarcasEquipos.entity';
import { classDeviceEntity } from '../domain/entities/ClassDevice.entity';
import { repuestoEquipoEntity } from '../domain/entities/RepuestoEquipo.entity';

class SearchEquiposController {
  public async searchEquiposByKeyword(keyword: string): Promise<any> {
    try {
      if (typeof keyword !== 'string') {
        throw new Error('El parámetro keyword es inválido.');
      }

      LogInfo(`Search for equipos with keyword: ${keyword}`);

      const equipoModel = equipoEntity();
      const equipoModeloModel = modeloEquipoEntity();
      const areaEquipoModel = areaEquipoEntity();
      const tipoEquipoModel = tipoEquipoEntity();
      const marcaEquipoModel = marcaEquipoEntity();
      const classEquipoModel = classDeviceEntity();
      const sedeModel = sedeEntity(); // Import the Sede entity
      const clientModel = clientEntity(); // Import the Client entity

      // Primero, busca el ID de la sede por palabra clave en campos relevantes
      const sedes = await sedeModel.find({ sede_nombre: { $regex: keyword, $options: 'i' } }).select('_id');
      const sedeIds = sedes.map(sede => sede._id);

      // Luego, busca el ID del modelo de equipo por palabra clave en campos relevantes
      const modelos = await equipoModeloModel.find({ modelo: { $regex: keyword, $options: 'i' } }).select('_id');
      const modeloIds = modelos.map(modelo => modelo._id);

      // Luego, busca el ID del área de equipo por palabra clave en campos relevantes
      const areas = await areaEquipoModel.find({ area: { $regex: keyword, $options: 'i' } }).select('_id');
      const areaIds = areas.map(area => area._id);

      // Luego, busca el ID del tipo de equipo por palabra clave en campos relevantes
      const tipos = await tipoEquipoModel.find({ tipo: { $regex: keyword, $options: 'i' } }).select('_id');
      const tipoIds = tipos.map(tipo => tipo._id);

      // Realiza la búsqueda de equipos por la palabra clave y las asociaciones
      const equipos = await equipoModel
        .find({
          $or: [
            { serie: { $regex: keyword, $options: 'i' } },
            { ubicacion: { $regex: keyword, $options: 'i' } },
            { activo_fijo: { $regex: keyword, $options: 'i' } }, // Nuevo campo de búsqueda
            { mtto: { $regex: keyword, $options: 'i' } }, // Nuevo campo de búsqueda
            { id_sede: { $in: sedeIds } },
            { modelo_equipos: { $in: modeloIds } },
            { id_area: { $in: areaIds } },
            { id_tipo: { $in: tipoIds } },
          ],
        })
        .select('serie ubicacion frecuencia id_sede modelo_equipos id_area id_tipo') // Puedes seleccionar los campos que desees

        .populate({
          path: 'modelo_equipos',
          model: equipoModeloModel, // Usa la función para obtener el modelo
          select: 'modelo precio', // Selecciona los campos que deseas mostrar
          populate: [
            {
              path: 'id_marca',
              model: marcaEquipoModel, // Si es necesario, también realiza populate de id_marca
              select: 'nombre',
            },
            {
              path: 'id_clase',
              model: classEquipoModel, // Si es necesario, también realiza populate de id_clase
              select: 'clase',
            },
            // Agrega más populate si es necesario
          ],
        })
        .populate({
          path: 'id_area',
          model: areaEquipoModel,
          select: 'area',
        })
        .populate({
          path: 'id_tipo',
          model: tipoEquipoModel,
          select: 'tipo',
        })
        .populate({
          path: 'id_sede',
          model: sedeModel, // Usa la función para obtener el modelo
          select: 'sede_nombre sede_address sede_telefono sede_email', // Selecciona los campos que deseas mostrar
          populate: [
            {
              path: 'id_client',
              model: clientModel, // Si es necesario, también realiza populate de id_client
              select: '_id client_name client_nit client_address client_telefono client_email', // Selecciona los campos que deseas mostrar
            },
          ],
        });
      return equipos;
    } catch (error) {
      console.error(error);
      throw new Error('Error en la búsqueda de equipos.');
    }
  }
    public async searchModelosEquiposByKeyword(keyword: string): Promise<any> {
      try {
        if (typeof keyword !== 'string') {
          throw new Error('El parámetro keyword es inválido.');
        }

        LogInfo(`Search for modelos de equipos with keyword: ${keyword}`);

        const modeloEquipoModel = modeloEquipoEntity();
        const marcaEquipoModel = marcaEquipoEntity();
        const claseEquipoModel = classDeviceEntity();

        // Primero, busca el ID de la marca de equipo por palabra clave en campos relevantes
        const marcas = await marcaEquipoModel.find({ marca: { $regex: keyword, $options: 'i' } }).select('_id');
        const marcaIds = marcas.map(marca => marca._id);

        // Luego, busca el ID de la clase de equipo por palabra clave en campos relevantes
        const clases = await claseEquipoModel.find({ clase: { $regex: keyword, $options: 'i' } }).select('_id');
        const claseIds = clases.map(clase => clase._id);

        // Realiza la búsqueda de modelos de equipos por la palabra clave y las asociaciones
        const modelosEquipos = await modeloEquipoModel
          .find({
            $or: [
              { modelo: { $regex: keyword, $options: 'i' } },
              { id_marca: { $in: marcaIds } },
              { id_clase: { $in: claseIds } },
            ],
          })
          .select('modelo precio id_marca id_clase') // Puedes seleccionar los campos que desees

        // Popula las relaciones virtuales, si es necesario
        .populate({
          path: 'id_marca',
          model: marcaEquipoModel,
          select: 'marca',
        })
        .populate({
          path: 'id_clase',
          model: claseEquipoModel,
          select: 'clase',
        });

        return modelosEquipos;
      } catch (error) {
        console.error(error);
        throw new Error('Error en la búsqueda de modelos de equipos.');
      }
    }
    public async searchAreasEquiposByKeyword(keyword: string): Promise<any> {
      try {
        if (typeof keyword !== 'string') {
          throw new Error('El parámetro keyword es inválido.');
        }
  
        LogInfo(`Search for áreas de equipos with keyword: ${keyword}`);
  
        const areaEquipoModel = areaEquipoEntity();
  
        // Realiza la búsqueda de áreas de equipos por la palabra clave
        const areasEquipos = await areaEquipoModel.find({ area: { $regex: keyword, $options: 'i' } });
  
        return areasEquipos;
      } catch (error) {
        console.error(error);
        throw new Error('Error en la búsqueda de áreas de equipos.');
      }
    }
    public async searchClasesEquiposByKeyword(keyword: string): Promise<any> {
      try {
        if (typeof keyword !== 'string') {
          throw new Error('El parámetro keyword es inválido.');
        }
    
        LogInfo(`Search for clases de equipos with keyword: ${keyword}`);
    
        const claseEquipoModel = classDeviceEntity();
    
        // Realiza la búsqueda de clases de equipos por la palabra clave
        const clasesEquipos = await claseEquipoModel.find({ clase: { $regex: keyword, $options: 'i' }});
    
        return clasesEquipos;
      } catch (error) {
        console.error(error);
        throw new Error('Error en la búsqueda de clases de equipos.');
      }
    }

    public async searchMarcasEquiposByKeyword(keyword: string): Promise<any> {
      try {
        if (typeof keyword !== 'string') {
          throw new Error('El parámetro keyword es inválido.');
        }
    
        LogInfo(`Search for marcas de equipos with keyword: ${keyword}`);
    
        const marcaEquipoModel = marcaEquipoEntity();
    
        // Realiza la búsqueda de marcas de equipos por la palabra clave en el campo 'marca'
        const marcasEquipos = await marcaEquipoModel.find({ marca: { $regex: keyword, $options: 'i' }});
    
        return marcasEquipos;
      } catch (error) {
        console.error(error);
        throw new Error('Error en la búsqueda de marcas de equipos.');
      }
    }
    
    public async searchTiposEquiposByKeyword(keyword: string): Promise<any> {
      try {
        if (typeof keyword !== 'string') {
          throw new Error('El parámetro keyword es inválido.');
        }
    
        LogInfo(`Search for tipos de equipos with keyword: ${keyword}`);
    
        const tipoEquipoModel = tipoEquipoEntity();
    
        // Realiza la búsqueda de tipos de equipos por la palabra clave en el campo 'tipo'
        const tiposEquipos = await tipoEquipoModel.find({ tipo: { $regex: keyword, $options: 'i' }});
    
        return tiposEquipos;
      } catch (error) {
        console.error(error);
        throw new Error('Error en la búsqueda de tipos de equipos.');
      }
    }
    

    public async searchRepuestosEquiposByKeyword(keyword: string): Promise<any> {
      try {
        if (typeof keyword !== 'string') {
          throw new Error('El parámetro keyword es inválido.');
        }
  
        LogInfo(`Search for Repuestos_Equipos with keyword: ${keyword}`);
  
        const repuestoEquipoModel = repuestoEquipoEntity();
        const clientModel = clientEntity(); // Import the Client entity
  
        // Busca el ID del cliente por palabra clave en campos relevantes
        const clientes = await clientModel.find({ client_name: { $regex: keyword, $options: 'i' } }).select('_id');
        const clienteIds = clientes.map(cliente => cliente._id);
  
        // Realiza la búsqueda de Repuestos_Equipos por la palabra clave y las asociaciones
        const repuestosEquipos = await repuestoEquipoModel
          .find({
            $or: [
              { repuesto_name: { $regex: keyword, $options: 'i' } },
              { id_cliente: { $in: clienteIds } },
            ],
          })
          .select('repuesto_name repuesto_cantidad repuesto_precio') // Puedes seleccionar los campos que desees
  
        // Popula las relaciones virtuales, si es necesario
        .populate({
          path: 'id_cliente',
          model: clientModel,
          select: 'client_name',
        });
  
        return repuestosEquipos;
      } catch (error) {
        console.error(error);
        throw new Error('Error en la búsqueda de Repuestos_Equipos.');
      }
    }
  }
  

export default new SearchEquiposController();
