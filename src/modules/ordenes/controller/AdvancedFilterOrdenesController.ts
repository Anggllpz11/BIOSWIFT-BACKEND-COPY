import { LogError } from "../../../utils/logger";
import { ordenesEntity } from '../domain/entities/Ordenes.entity';
import { visitasEntity } from '../../visitas/domain/entities/Visitas.entity';
import { userEntity } from '../../users/domain/entities/User.entity';
import { ordenesSubEstadosEntity } from '../domain/entities/Ordenes_sub_estados.entity';
import { solicitudesServiciosEntity } from '../../solicitudes/domain/entities/Solicitudes_Servicios.entity';
import { ordenesEstadosEntity } from '../domain/entities/Ordenes_Estados.entity';
import { fallasAccionesEntity } from '../domain/entities/Fallas_Acciones.entity';
import { fallasCausasEntity } from '../domain/entities/Fallas_Causas.entity';
import { fallasModosEntity } from '../domain/entities/Fallas_Modos.entity';
import { modosFallosEntity } from '../domain/entities/Modos_Fallos.entity';
import { serviciosEntity } from '../../procesos_&_protocolos/domain/entities/Servicios.entity';
import { SolicitudesEstadosEntity } from '../../procesos_&_protocolos/domain/entities/SolicitudesEstados.entity';
import { equipoEntity } from '../../equipos/domain/entities/Equipo.entity';
import { sedeEntity } from '../../users/domain/entities/Sede.entity';
import { clientEntity } from '../../users/domain/entities/Client.entity';
import { modeloEquipoEntity } from '../../equipos/domain/entities/ModeloEquipo.entity';
import { marcaEquipoEntity } from '../../equipos/domain/entities/MarcasEquipos.entity';
import { classDeviceEntity } from '../../equipos/domain/entities/ClassDevice.entity';
import { areaEquipoEntity } from '../../equipos/domain/entities/AreaEquipo.entity';
import { tipoEquipoEntity } from '../../equipos/domain/entities/TipoEquipo.entity';
import { visitasEstadosEntity } from '../../visitas/domain/entities/Visitas_Estados.entity';
import { protocolosEntity } from '../../procesos_&_protocolos/domain/entities/Protocolos.entity';
import { camposEntity } from '../../procesos_&_protocolos/domain/entities/Campos.entity';
import { falloSistemasEntity } from '../domain/entities/Fallo_Sistemas.entity';
import mongoose from "mongoose";

class AdvancedFilterOrdenesController {
  public async filterOrdenes(filtersArray: any[], page: number, limit: number): Promise<any> {
    if (!filtersArray) {
      throw new Error("filtersArray is undefined");
    }
    try {
      const ordenModel = ordenesEntity();
      const solicitudServicioModel = solicitudesServiciosEntity();

     // Primero, buscar en SolicitudServicio
     const solicitudServicioQueries = filtersArray
     .filter(filters => Object.keys(filters).some(key => key.startsWith('id_solicitud_servicio.')))
     .map(filters => {
       const query: { [key: string]: any } = {};
       for (const [key, value] of Object.entries(filters)) {
         if (key.startsWith('id_solicitud_servicio.') && value) {
           const subKey = key.split('.').slice(1).join('.');
           query[subKey] = value;
         }
       }
       return query;
     });

   let solicitudServicioIds: mongoose.Types.ObjectId[] = [];
   if (solicitudServicioQueries.length > 0) {
     solicitudServicioIds = await solicitudServicioModel.find({
       $or: solicitudServicioQueries
     }).distinct('_id');
   }

   // Construir el array de queries dinámicamente basado en los filtros recibidos
   const queries = filtersArray.map(filters => {
     const query: { [key: string]: any } = {};
     for (const [key, value] of Object.entries(filters)) {
       if (value !== undefined && value !== null && value !== "") {
         if (Array.isArray(value)) {
           query[key] = { $in: value };
         } else if (typeof value === 'object' && !mongoose.Types.ObjectId.isValid(value.toString())) {
           query[key] = value;
         } else if (typeof value === 'string' && mongoose.Types.ObjectId.isValid(value)) {
           query[key] = new mongoose.Types.ObjectId(value);
         } else if (typeof value === 'object' && mongoose.Types.ObjectId.isValid(value.toString())) {
           query[key] = new mongoose.Types.ObjectId(value.toString());
         } else if (typeof value === 'string') {
           query[key] = { $regex: value, $options: "i" }; // Búsqueda insensible a mayúsculas/minúsculas
         } else {
           query[key] = value;
         }
       }
     }
     return query;
   });

   // Agregar los ids de solicitudServicio a la consulta combinada
   if (solicitudServicioIds.length > 0) {
     queries.push({ id_solicitud_servicio: { $in: solicitudServicioIds } });
   }

   // Combinar las queries en una sola usando $or
   const combinedQuery = queries.length > 0 ? { $or: queries } : {};

   const ordenes = await ordenModel.find(combinedQuery)
        .populate({
          path: 'id_solicitud_servicio',
          populate: [
            { path: 'id_creador' },
            { path: 'id_servicio' },
            { path: 'id_solicitud_estado' },
            {
              path: 'id_equipo',
              populate: [
                { path: 'id_sede', populate: { path: 'id_client' } },
                { path: 'modelo_equipos', populate: [{ path: 'id_marca' }, { path: 'id_clase' }] },
                { path: 'id_area' },
                { path: 'id_tipo' }
              ]
            },
            { path: 'id_cambiador' }
          ]
        })
        .populate({
          path: 'id_solicitud_servicio',
          model: solicitudServicioModel,
          populate: [
            {
              path: 'id_creador',
              model: userEntity(),
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'id_servicio',
              model: serviciosEntity(),
            },
            {
              path: 'id_solicitud_estado',
              model: SolicitudesEstadosEntity(),
            },
            {
              path: 'id_equipo',
              model: equipoEntity(),
              populate: [
                {
                  path: 'id_sede',
                  model: sedeEntity(),
                  select: '_id sede_nombre sede_address sede_telefono sede_email id_client',
                  populate: {
                    path: 'id_client',
                    model: clientEntity(),
                  },
                },
                {
                  path: 'modelo_equipos',
                  model: modeloEquipoEntity(),
                  populate: [
                    {
                      path: 'id_marca',
                      model: marcaEquipoEntity(),
                    },
                    {
                      path: 'id_clase',
                      model: classDeviceEntity(),
                    },
                  ],
                },
                {
                  path: 'id_area',
                  model: areaEquipoEntity(),
                },
                {
                  path: 'id_tipo',
                  model: tipoEquipoEntity(),
                },
              ],
            },
            {
              path: 'id_cambiador',
              model: userEntity(),
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
          ],
        })
        .populate({
          path: 'id_orden_estado',
          model: ordenesEstadosEntity(),
        })
        .populate({
          path: 'ids_visitas',
          model: visitasEntity(),
          populate: [
            {
              path: 'id_visita_estado',
              model: visitasEstadosEntity(),
            },
            {
              path: 'id_responsable',
              model: userEntity(),
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'id_creador',
              model: userEntity(),
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'id_aprobador',
              model: userEntity(),
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'id_cerrador',
              model: userEntity(),
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'ids_protocolos',
              model: protocolosEntity(),
            },
            {
              path: 'actividades.id_protocolo',
              model: protocolosEntity(),
            },
            {
              path: 'actividades.ids_campos_preventivo.id_campo',
              model: camposEntity(),
            },
          ],
        })
        .populate({
          path: 'id_creador',
          model: userEntity(),
          select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
        })
        .populate({
          path: 'id_cerrador',
          model: userEntity(),
          select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
        })
        .populate({
          path: 'entrega.id_entrega',
          model: userEntity(),
          select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
        })
        .populate({
          path: 'orden_cambios.id_creador',
          model: userEntity(),
          select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
        })
        .populate({
          path: 'orden_cambios.ids_orden_sub_estado',
          model: ordenesSubEstadosEntity(),
        })
        .populate({
          path: 'resultado_orden.id_fallo_sistema',
          model: falloSistemasEntity(),
        })
        .populate({
          path: 'resultado_orden.ids_modos_fallos',
          model: modosFallosEntity(),
        })
        .populate({
          path: 'resultado_orden.ids_causas_fallos',
          model: fallasCausasEntity(),
        })
        .limit(limit)
        .skip((page - 1) * limit)
        .exec();

      const totalItems = await ordenModel.countDocuments(combinedQuery);

      return {
        ordenes,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
      };
    } catch (error) {
      LogError(`[Controller ERROR]: Filtering Ordenes: ${error}`);
      throw new Error("Error filtering ordenes");
    }
  }
}

export default new AdvancedFilterOrdenesController();
