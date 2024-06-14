export interface ISolicitudBodegaEstadosController {
    getSolicitudBodegaEstados(page: number, limit: number, id?: string): Promise<any>;
    deleteSolicitudBodegaEstados(id?: string): Promise<any>;
    updateSolicitudBodegaEstados(id: string, solicitudBodegaEstadosData: any): Promise<any>;
    createSolicitudBodegaEstados(solicitudBodegaEstadosData: any): Promise<any>;
}

export interface ISolicitudBodegaController {
    getSolicitudBodega(page: number, limit: number, id?: string): Promise<any>;
    deleteSolicitudBodega(id?: string): Promise<any>;
    updateSolicitudBodega(id: string, solicitudBodegaData: any): Promise<any>;
    createSolicitudBodega(solicitudBodegaData: any): Promise<any>;
}

