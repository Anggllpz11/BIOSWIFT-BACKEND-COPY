import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { IUser } from "../domain/interfaces/IUser.interface";

dotenv.config();

const secret = process.env.SECRETKEY || 'MYSECRETKEY';

/**
 * Middleware para verificar si un usuario tiene el rol de usuario.
 */

export const isUser = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = res.locals.user;

  if (user && user.roles.some(role => role.name === "user")) {
    // Si el usuario tiene el rol de usuario, permite el acceso.
    next();
  } else {
    // Si el usuario no tiene el rol de usuario, devuelve un error.
    return res.status(403).json({
      error: "Acceso denegado",
      message: "No tienes permiso de usuario para acceder a esta ruta.",
    });
  }
};

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = res.locals.user;

  if (user && user.roles.some(role => role.name === "administrador")) {
    // Si el usuario tiene el rol de administrador, permite el acceso.
    next();
  } else {
    // Si el usuario no tiene el rol de administrador, devuelve un error.
    return res.status(403).json({
      error: "Acceso denegado",
      message: "No tienes permiso de administrador para acceder a esta ruta.",
    });
  }
};

export const isTecnico = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = res.locals.user;

  if (user && user.roles.some(role => role.name === "tecnico")) {
    // Si el usuario tiene el rol de administrador, permite el acceso.
    next();
  } else {
    // Si el usuario no tiene el rol de administrador, devuelve un error.
    return res.status(403).json({
      error: "Acceso denegado",
      message: "No tienes permiso de tecnico para acceder a esta ruta.",
    });
  }
};


export const isComercial = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = res.locals.user;

  if (user && user.roles.some(role => role.name === "comercial")) {
    // Si el usuario tiene el rol de administrador, permite el acceso.
    next();
  } else {
    // Si el usuario no tiene el rol de administrador, devuelve un error.
    return res.status(403).json({
      error: "Acceso denegado",
      message: "No tienes permiso de comercial para acceder a esta ruta.",
    });
  }
};



export const isAnalista = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = res.locals.user;

  if (user && user.roles.some(role => role.name === "analista")) {
    // Si el usuario tiene el rol de administrador, permite el acceso.
    next();
  } else {
    // Si el usuario no tiene el rol de administrador, devuelve un error.
    return res.status(403).json({
      error: "Acceso denegado",
      message: "No tienes permiso de analista para acceder a esta ruta.",
    });
  }
};




export const isCoordinador = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = res.locals.user;

  if (user && user.roles.some(role => role.name === "coordinador")) {
    // Si el usuario tiene el rol de administrador, permite el acceso.
    next();
  } else {
    // Si el usuario no tiene el rol de administrador, devuelve un error.
    return res.status(403).json({
      error: "Acceso denegado",
      message: "No tienes permiso de coordinador para acceder a esta ruta.",
    });
  }
};



export const isContabilidad = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = res.locals.user;

  if (user && user.roles.some(role => role.name === "contabilidad")) {
    // Si el usuario tiene el rol de administrador, permite el acceso.
    next();
  } else {
    // Si el usuario no tiene el rol de administrador, devuelve un error.
    return res.status(403).json({
      error: "Acceso denegado",
      message: "No tienes permiso de contabilidad para acceder a esta ruta.",
    });
  }
};


export const isAlmacen = (req: Request, res: Response, next: NextFunction) => {
  const user: IUser = res.locals.user;

  if (user && user.roles.some(role => role.name === "almacen")) {
    // Si el usuario tiene el rol de administrador, permite el acceso.
    next();
  } else {
    // Si el usuario no tiene el rol de administrador, devuelve un error.
    return res.status(403).json({
      error: "Acceso denegado",
      message: "No tienes permiso de almacen para acceder a esta ruta.",
    });
  }
};


