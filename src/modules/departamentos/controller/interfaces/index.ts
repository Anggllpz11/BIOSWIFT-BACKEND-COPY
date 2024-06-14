export interface IDepartamentosController {
    // Leer todos los Departamentos de la BASE DE DATOS || Obtener Departamento por ID
    getDepartamentos(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar Departamento por ID de la BASE DE DATOS
    deleteDepartamento(id?: string): Promise<any>;
    // Actualizar Departamento
    updateDepartamento(id: string, departamento: any): Promise<any>;
    // Crear Departamento
    createDepartamento(departamento: any): Promise<any>;
}

export interface IMunicipiosController {
    // Leer todos los Municipios de la BASE DE DATOS || Obtener Municipio por ID
    getMunicipios(page: number, limit: number, id?: string): Promise<any>;
    // Eliminar municipio por ID de la BASE DE DATOS
    deleteMunicipio(id?: string): Promise<any>;
    // Actualizar Municipio
    updateMunicipio(id: string, municipio: any): Promise<any>;
    // Crear Municipio
    createMunicipio(municipio: any): Promise<any>;
  }