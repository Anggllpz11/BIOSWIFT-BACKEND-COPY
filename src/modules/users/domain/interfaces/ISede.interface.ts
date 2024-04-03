import { IClient } from "./IClient.interface";

export interface ISede {
    id_client?: IClient; // Campo que establece la relación con la entidad Clients
    sede_nombre: string;
    sede_address: string;
    sede_telefono: string;
    sede_email: string;
}
