import { IPreventivo } from "@/modules/procesos_&_protocolos/domain/interfaces/IPreventivo.interface";

export interface IClassDevice {
    clase: string;
    id_preventivo?: IPreventivo;
  }
  