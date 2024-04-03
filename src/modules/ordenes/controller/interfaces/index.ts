export interface IOrdenes_EstadosController {
    // Leer todos los OrdenesEstados de la BASE DE DATOS || Obtener OrdenEstado por ID
    getOrdenesEstados(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar orden_estado por ID de la BASE DE DATOS
    deleteOrdenEstado(id?: string): Promise<any>;
    // Actualizar OrdenEstado
    updateOrdenEstado(id: string, ordenEstado: any): Promise<any>;
    // Crear OrdenEstado
    createOrdenEstado(ordenEstado: any): Promise<any>;
}

export interface IFallas_AccionesController {
    // Leer todas las FallasAcciones de la BASE DE DATOS || Obtener FallaAccion por ID
    getFallasAcciones(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar falla_accion por ID de la BASE DE DATOS
    deleteFallaAccion(id?: string): Promise<any>;
    // Actualizar FallaAccion
    updateFallaAccion(id: string, fallaAccion: any): Promise<any>;
    // Crear FallaAccion
    createFallaAccion(fallaAccion: any): Promise<any>;
}

export interface IOrdenes_Sub_EstadosController {
    // Leer todos los OrdenesSubEstados de la BASE DE DATOS || Obtener OrdenSubEstado por ID
    getOrdenesSubEstados(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar orden_sub_estado por ID de la BASE DE DATOS
    deleteOrdenSubEstado(id?: string): Promise<any>;
    // Actualizar OrdenSubEstado
    updateOrdenSubEstado(id: string, ordenSubEstado: any): Promise<any>;
    // Crear OrdenSubEstado
    createOrdenSubEstado(ordenSubEstado: any): Promise<any>;
}

export interface IFallas_CausasController {
    // Leer todas las FallasCausas de la BASE DE DATOS || Obtener FallaCausa por ID
    getFallasCausas(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar falla_causa por ID de la BASE DE DATOS
    deleteFallaCausa(id?: string): Promise<any>;
    // Actualizar FallaCausa
    updateFallaCausa(id: string, fallaCausa: any): Promise<any>;
    // Crear FallaCausa
    createFallaCausa(fallaCausa: any): Promise<any>;
}

export interface IFallas_ModosController {
    // Leer todos los FallasModos de la BASE DE DATOS || Obtener FallaModo por ID
    getFallasModos(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar falla_modo por ID de la BASE DE DATOS
    deleteFallaModo(id?: string): Promise<any>;
    // Actualizar FallaModo
    updateFallaModo(id: string, fallaModo: any): Promise<any>;
    // Crear FallaModo
    createFallaModo(fallaModo: any): Promise<any>;
}

export interface IFallo_SistemasController {
    // Leer todos los FalloSistemas de la BASE DE DATOS || Obtener FalloSistema por ID
    getFalloSistemas(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar fallo_sistema por ID de la BASE DE DATOS
    deleteFalloSistema(id?: string): Promise<any>;
    // Actualizar FalloSistema
    updateFalloSistema(id: string, falloSistema: any): Promise<any>;
    // Crear FalloSistema
    createFalloSistema(falloSistema: any): Promise<any>;
}

export interface IModos_FallosController {
    // Leer todos los ModosFallos de la BASE DE DATOS || Obtener ModoFallo por ID
    getModosFallos(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar modo_fallo por ID de la BASE DE DATOS
    deleteModoFallo(id?: string): Promise<any>;
    // Actualizar ModoFallo
    updateModoFallo(id: string, modoFallo: any): Promise<any>;
    // Crear ModoFallo
    createModoFallo(modoFallo: any): Promise<any>;
}

export interface IOrdenesController {
    getOrdenes(page: number, limit: number, id?: string): Promise<any>;
    deleteOrden(id?: string): Promise<any>;
    updateOrden(id: string, orden: any): Promise<any>;
    createOrden(orden: any): Promise<any>;
}
