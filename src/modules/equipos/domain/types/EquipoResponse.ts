import { IEquipo } from "../interfaces/IEquipo.interface"

export type UserResponse = {
    equipos: IEquipo[],
    totalPages: number,
    currentPage: number
}