/**
 * Basic JSON Response for controllers
 */

export type BasicResponse = {
    message: string,

}

/***
 * Error Response for controllers
 */
export type ErrorResponse = {
    error: string,
    message: string
}

/***
 * Auth JSON Response for controllers
 */
export type AuthResponse = {
    message: string,
    token: string
}