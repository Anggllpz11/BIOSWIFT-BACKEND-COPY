
export interface ISolicitudesServiciosController {
    getSolicitudesServicios(page: number, limit: number, id?: string): Promise<any>;
    deleteSolicitudServicio(id?: string): Promise<any>;
    updateSolicitudServicio(id: string, solicitudServicioData: any): Promise<any>;
    createSolicitudServicio(solicitudServicioData: any): Promise<any>;
}
