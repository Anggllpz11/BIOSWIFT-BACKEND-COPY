export interface ISolicitudDadoBajaEstadoController {
    getSolicitudDadoBajaEstados(page: number, limit: number, id?: string): Promise<any>;
    deleteSolicitudDadoBajaEstados(id?: string): Promise<any>;
    updateSolicitudDadoBajaEstados(id: string, solicitudDadoBajaEstadosData: any): Promise<any>;
    createSolicitudDadoBajaEstados(solicitudDadoBajaEstadosData: any): Promise<any>;
}

export interface ISolicitudDadoBajaController {
    getSolicitudDadoBaja(page: number, limit: number, id?: string): Promise<any>;
    deleteSolicitudDadoBaja(id?: string): Promise<any>;
    updateSolicitudDadoBaja(id: string, solicitudDadoBajaData: any): Promise<any>;
    createSolicitudDadoBaja(solicitudDadoBajaData: any): Promise<any>;
}
