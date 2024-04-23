export interface IEquipoController {
    // Read all Equipos from DATABASE || Get Equipo By ID
    getEquipos(page: number, limit: number, id?: string): Promise<any>;
    // Delete equipo by ID from DATABASE
    deleteEquipo(id?: string): Promise<any>;
    // Update Equipo
    updateEquipo(id: string, equipo: any): Promise<any>;
    // Create Equipo
    createEquipo(equipo: any): Promise<any>;
  }
  

  export interface IModeloEquipoController {
    getModeloEquipos(page: number, limit: number, id?: string): Promise<any>;
    createModeloEquipo(equipo: any): Promise<any>;
    deleteModeloEquipo(id?: string): Promise<any>;
    updateModeloEquipo(id: string, equipo: any): Promise<any>;
  }
  
// IClassDeviceController.ts
export interface IClassDeviceController {
  getClasesEquipos(page: number, limit: number, id?:string): Promise<any>;
  createClaseEquipo(claseEquipo: any): Promise<any>;
  updateClaseEquipo(id: string, claseEquipo: any): Promise<any>;
  deleteClaseEquipo(id: string): Promise<any>;
}


export interface IMarcaEquipoController {
  getMarcasEquipos(page: number, limit: number, id?: string): Promise<any>;
  createMarcaEquipo(marcaEquipo: any): Promise<any>;
  updateMarcaEquipo(id: string, marcaEquipo: any): Promise<any>;
  deleteMarcaEquipo(id: string): Promise<any>;
}

export interface ITipoEquipoController {
  getTiposEquipos(page: number, limit: number, id?: string): Promise<any>;
  deleteTipoEquipo(id?: string): Promise<any>;
  updateTipoEquipo(id: string, tipoEquipo: any): Promise<any>;
  createTipoEquipo(tipoEquipo: any): Promise<any>;
}

export interface IAreaEquipoController {
  getAreasEquipos(page: number, limit: number, id?: string): Promise<any>;
  deleteAreaEquipo(id?: string): Promise<any>;
  updateAreaEquipo(id: string, areaEquipo: any): Promise<any>;
  createAreaEquipo(areaEquipo: any): Promise<any>;
}

export interface IRepuestoEquipoController {
  // Read all Repuestos_Equipos from DATABASE || Get Repuesto_Equipo By ID
  getRepuestoEquipos(page: number, limit: number, id?: string): Promise<any>;
  // Delete Repuesto_Equipo by ID from DATABASE
  deleteRepuestoEquipo(id?: string): Promise<any>;
  // Update Repuesto_Equipo
  updateRepuestoEquipo(id: string, repuestoEquipo: any): Promise<any>;
  // Create Repuesto_Equipo
  createRepuestoEquipo(repuestoEquipo: any): Promise<any>;
}

