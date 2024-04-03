// index.ts

export interface IVisitasEstadosController {
    // Read all VisitasEstados from DATABASE || Get VisitaEstado By ID
    getVisitasEstados(page: number, limit: number, id?: string): Promise<any>;
    // Delete visita_estado by ID from DATABASE
    deleteVisitaEstado(id?: string): Promise<any>;
    // Update VisitaEstado
    updateVisitaEstado(id: string, visitaEstado: any): Promise<any>;
    // Create VisitaEstado
    createVisitaEstado(visitaEstado: any): Promise<any>;
}

export interface IVisitasController {
    // Leer todas las Visitas de la BASE DE DATOS || Obtener Visita por ID
    getVisitas(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar visita por ID de la BASE DE DATOS
    deleteVisita(id?: string): Promise<any>;
    // Actualizar Visita
    updateVisita(id: string, visitaData: any): Promise<any>;
    // Crear Visita
    createVisita(visitaData: any): Promise<any>;
}
