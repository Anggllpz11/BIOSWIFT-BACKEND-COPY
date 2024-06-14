import mongoose from 'mongoose';
import { LogInfo } from '../../../utils/logger';
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

class SearchOrdenesController {
  public async searchOrdenesByKeyword(keyword: string, page: number, limit: number): Promise<any> {
    try {
      if (typeof keyword !== 'string') {
        throw new Error('El parámetro keyword es inválido.');
      }

      LogInfo(`Search for ordenes with keyword: ${keyword}`);

      const userModel = userEntity();
      const ordenModel = ordenesEntity();
      const visitaModel = visitasEntity();
      const ordenSubEstadoModel = ordenesSubEstadosEntity();
      const solicitudServicioModel = solicitudesServiciosEntity();
      const ordenEstadoModel = ordenesEstadosEntity();
      const fallasAccionesModel = fallasAccionesEntity();
      const fallasCausasModel = fallasCausasEntity();
      const fallasModosModel = fallasModosEntity();
      const modosFallosModel = modosFallosEntity();
      const fallosSistemaModel = falloSistemasEntity();
      const servicioModel = serviciosEntity();
      const solicitudEstadoModel = SolicitudesEstadosEntity();
      const equipoModel = equipoEntity();
      const sedeModel = sedeEntity();
      const clientModel = clientEntity();
      const modeloEquiposModel = modeloEquipoEntity();
      const marcaEquipoModel = marcaEquipoEntity();
      const claseEquipoModel = classDeviceEntity();
      const areaEquipoModel = areaEquipoEntity();
      const tipoEquipoModel = tipoEquipoEntity();

      const visitaEstadoModel = visitasEstadosEntity();
      const protocolosModel = protocolosEntity();
      const camposModel = camposEntity();

      const query = {
        $or: [
          { _id: mongoose.Types.ObjectId.isValid(keyword) ? new mongoose.Types.ObjectId(keyword) : null },
          { 'id_solicitud_servicio._id': mongoose.Types.ObjectId.isValid(keyword) ? new mongoose.Types.ObjectId(keyword) : null },
          { 'id_orden_estado._id': mongoose.Types.ObjectId.isValid(keyword) ? new mongoose.Types.ObjectId(keyword) : null },
          { 'id_solicitud_servicio.id_servicio.servicio': { $regex: keyword, $options: 'i' } },
          { 'id_creador.name': { $regex: keyword, $options: 'i' } },
          { 'id_cerrador.name': { $regex: keyword, $options: 'i' } },
          { 'entrega.id_entrega.name': { $regex: keyword, $options: 'i' } },
          { 'recibe.nombre_recibe': { $regex: keyword, $options: 'i' } },
          { 'orden_cambios.comentario': { $regex: keyword, $options: 'i' } },
          { 'resultado_orden.comentarios_finales': { $regex: keyword, $options: 'i' } },
          { observaciones_cierre: { $regex: keyword, $options: 'i' } },
          { observaciones_anulacion: { $regex: keyword, $options: 'i' } },
        ],
      };

      const ordenes = await ordenModel
        .find(query)
        .limit(limit)
        .skip((page - 1) * limit)
        .populate({
          path: 'id_solicitud_servicio',
          model: solicitudServicioModel,
          populate: [
            {
              path: 'id_creador',
              model: userModel,
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'id_servicio',
              model: servicioModel,
            },
            {
              path: 'id_solicitud_estado',
              model: solicitudEstadoModel,
            },
            {
              path: 'id_equipo',
              model: equipoModel,
              populate: [
                {
                  path: 'id_sede',
                  model: sedeModel,
                  select: '_id sede_nombre sede_address sede_telefono sede_email id_client',
                  populate: {
                    path: 'id_client',
                    model: clientModel,
                  },
                },
                {
                  path: 'modelo_equipos',
                  model: modeloEquiposModel,
                  populate: [
                    {
                      path: 'id_marca',
                      model: marcaEquipoModel,
                    },
                    {
                      path: 'id_clase',
                      model: claseEquipoModel,
                    },
                  ],
                },
                {
                  path: 'id_area',
                  model: areaEquipoModel,
                },
                {
                  path: 'id_tipo',
                  model: tipoEquipoModel,
                },
              ],
            },
            {
              path: 'id_cambiador',
              model: userModel,
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
          ],
        })
        .populate({
          path: 'id_orden_estado',
          model: ordenEstadoModel,
        })
        .populate({
          path: 'ids_visitas',
          model: visitaModel,
          populate: [
            {
              path: 'id_visita_estado',
              model: visitaEstadoModel,
            },
            {
              path: 'id_responsable',
              model: userModel,
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'id_creador',
              model: userModel,
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'id_aprobador',
              model: userModel,
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'id_cerrador',
              model: userModel,
              select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
            },
            {
              path: 'ids_protocolos',
              model: protocolosModel,
            },
            {
              path: 'actividades.id_protocolo',
              model: protocolosModel,
            },
            {
              path: 'actividades.ids_campos_preventivo.id_campo',
              model: camposModel,
            },
          ],
        })
        .populate({
          path: 'id_creador',
          model: userModel,
          select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
        })
        .populate({
          path: 'id_cerrador',
          model: userModel,
          select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
        })
        .populate({
          path: 'entrega.id_entrega',
          model: userModel,
          select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
        })
        .populate({
          path: 'orden_cambios.id_creador',
          model: userModel,
          select: 'number username name cedula telefono email more_info roles type titulo reg_invima',
        })
        .populate({
          path: 'orden_cambios.ids_orden_sub_estado',
          model: ordenSubEstadoModel,
        })
        .populate({
          path: 'resultado_orden.id_fallo_sistema',
          model: fallosSistemaModel,
        })
        .populate({
          path: 'resultado_orden.ids_modos_fallos',
          model: modosFallosModel,
        })
        .populate({
          path: 'resultado_orden.ids_causas_fallos',
          model: fallasCausasModel,
        })
        .exec();

      const totalItems = await ordenModel.countDocuments(query);

      return {
        ordenes,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        totalItems
      };
    } catch (error) {
      console.error(error);
      throw new Error('Error en la búsqueda de órdenes.');
    }
  }
}

export default new SearchOrdenesController();