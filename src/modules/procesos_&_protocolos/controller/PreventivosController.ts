import { Get, Query, Route, Tags, Delete, Put, Body, Post } from "tsoa";
import { IPreventivosController } from "./interfaces";
import { LogSuccess, LogError, LogWarning } from "../../../utils/logger";
import { createPreventivo, deletePreventivoByID, getAllPreventivos, getPreventivoByID, updatePreventivoByID } from "../domain/orm/Preventivos.orm";
import { camposEntity } from "../domain/entities/Campos.entity";

@Route("/api/preventivos")
@Tags("PreventivosController")
export class PreventivosController implements IPreventivosController {
  @Get("/")
  public async getPreventivos(page: number, limit: number, @Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      LogSuccess(`[/api/preventivos] Get Preventivo By ID: ${id}`);
      response = await getPreventivoByID(id);
    } else {
      LogSuccess('[/api/preventivos] Get All Preventivos Request');
      response = await getAllPreventivos(page, limit);
    }
    return response;
  }

  @Delete("/")
  public async deletePreventivos(@Query() id?: string): Promise<any> {
    let response: any = '';

    if (id) {
      try {
        await deletePreventivoByID(id);
        response = {
          message: `Preventivo with ID: ${id} deleted successfully`
        };
      } catch (error) {
        response = {
          message: `Error deleting preventivo with ID: ${id}`
        };
      }
    } else {
      LogWarning('[/api/preventivos] Delete Preventivo Request WITHOUT ID');
      response = {
        message: 'Please, provide an ID to remove from DB'
      };
    }
    return response;
  }

  @Put("/")
public async updatePreventivos(@Query() id: string, @Body() preventivosData: any): Promise<any> {
  try {
    let response: { success: boolean; message: string } = {
      success: false,
      message: "",
    };

    if (!id) {
      LogWarning('[/api/preventivos] Update Preventivo Request WITHOUT ID');
      response.message = "Please provide an Id to update an existing Preventivo";
      return response;
    }

    // Verificar si se proporciona un nuevo nombre de tipo para campos cualitativos
    if (preventivosData.cualitativo) {
      preventivosData.cualitativo = await asociarCampos(preventivosData.cualitativo, "cualitativo");
    }

    // Verificar si se proporciona un nuevo nombre de tipo para campos de mantenimiento
    if (preventivosData.mantenimiento) {
      preventivosData.mantenimiento = await asociarCampos(preventivosData.mantenimiento, "mantenimiento");
    }

    // Verificar si se proporciona un nuevo nombre de tipo para campos cuantitativos
    if (preventivosData.cuantitativo) {
      preventivosData.cuantitativo = await asociarCamposCuantitativos(preventivosData.cuantitativo);
    }

    // Verificar si se proporciona un nuevo nombre de tipo para campos otros
    if (preventivosData.otros) {
      preventivosData.otros = await asociarCampos(preventivosData.otros, "otros");
    }

    // Actualizar el preventivo con los datos proporcionados
    await updatePreventivoByID(id, preventivosData);

    response.success = true;
    response.message = `Preventivo with ID ${id} updated successfully`;
    return response;
  } catch (error) {
    LogError(`[Controller ERROR]: Updating Preventivo ${id}: ${error}`);
    return {
      success: false,
      message: "An error occurred while updating the preventivo",
    };
  }

  async function asociarCampos(nombres: string[], tipoCampo: string) {
    const camposIds = [];
    for (const nombre of nombres) {
      const tipoCampoDocument = await camposEntity().findOne({ title: nombre });
      if (!tipoCampoDocument) {
        throw new Error(`El tipo de campo '${nombre}' para '${tipoCampo}' no se encontró en la base de datos.`);
      }
      camposIds.push(tipoCampoDocument._id);
    }
    return camposIds;
  }

  async function asociarCamposCuantitativos(cuantitativos: any[]) {
    return await Promise.all(cuantitativos.map(async (campo: any) => ({
      campo: (await asociarCampos([campo.title], "cuantitativo"))[0],
      minimo: campo.minimo,
      maximo: campo.maximo,
      unidad: campo.unidad,
    })));
  }
}


@Post("/")
public async createPreventivos(@Body() preventivosData: any): Promise<any> {
  try {
    // Extraer los nombres de los tipos de campo cualitativo, de mantenimiento, cuantitativo y otros
    const tipoCampoCualitativoNombre: string[] = preventivosData.cualitativo || [];
    const tipoCampoMantenimientoNombre: string[] = preventivosData.mantenimiento || [];
    const tipoCampoCuantitativo: any[] = preventivosData.cuantitativo || [];
    const tipoCampoOtrosNombre: string[] = preventivosData.otros || [];

    // Función asíncrona para asociar campos
    const asociarCampos = async (nombres: string[]): Promise<any> => {
      const camposIds = [];
      for (const nombre of nombres) {
        const tipoCampo = await camposEntity().findOne({ title: nombre });
        if (!tipoCampo) {
          return {
            success: false,
            message: `El tipo de campo '${nombre}' no se encontró en la base de datos.`,
          };
        }
        camposIds.push(tipoCampo._id);
      }
      return camposIds;
    };

    // Asociar los campos cualitativos, de mantenimiento y otros
    preventivosData.cualitativo = await asociarCampos(tipoCampoCualitativoNombre);
    preventivosData.mantenimiento = await asociarCampos(tipoCampoMantenimientoNombre);
    preventivosData.otros = await asociarCampos(tipoCampoOtrosNombre);

    // Asociar los campos cuantitativos usando Promise.all
    preventivosData.cuantitativo = await Promise.all(tipoCampoCuantitativo.map(async (campo: any) => ({
      campo: (await asociarCampos([campo.title]))[0],  // Asociar el campo cuantitativo
      minimo: campo.minimo,
      maximo: campo.maximo,
      unidad: campo.unidad,
    })));

    // Crear el preventivo
    const response = await createPreventivo(preventivosData);

    if (response.success) {
      return response;
    } else {
      LogError(`[Controller ERROR]: Creating Preventivo: ${response.message}`);
      return response;
    }
  } catch (error) {
    LogError(`[Controller ERROR]: Creating Preventivo: ${error}`);
    return {
      success: false,
      message: "An error occurred while creating the preventivo",
    };
  }
}


  
}
