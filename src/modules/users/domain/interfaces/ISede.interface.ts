import { IMunicipio } from "@/modules/departamentos/domain/interfaces/IMunicipio.interface";
import { IClient } from "./IClient.interface";
import { IUser } from "./IUser.interface";

export interface ISede {
    id_client?: IClient; 
    id_municipio?: IMunicipio; 
    id_responsable_ordenes?: IUser;
    id_responsable_preventivos?: IUser;
    id_responsable_correctivos?: IUser;
    sede_nombre: string;
    sede_address: string;
    sede_telefono: string;
    sede_email: string;
}
