import { otpMap } from '../domain/interfaces/IOTPData.interface';
import { Request, Response, NextFunction } from 'express';

export const otpValidatorMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const { email, otp } = req.body; 

  const otpData = otpMap[email];
  if (!otpData) {
    console.log("Código OTP no encontrado");
    return res.status(400).json({ message: 'Código OTP no encontrado' });
  }

  const expirationMinutes = 15;
  const currentTime = new Date();
  const timeDifference = currentTime.getTime() - otpData.generationTime.getTime();
  const timeDifferenceInMinutes = timeDifference / (1000 * 60); // converts to min

  if (timeDifferenceInMinutes > expirationMinutes) {
    console.log("Código OTP ha expirado");
    return res.status(400).json({ message: 'Código OTP ha expirado' });
  }

  console.log("otpData.otp:", otpData.otp);
  console.log("otp:", otp);

  if (otpData.otp !== otp) {
    console.log("Código OTP incorrecto");
    return res.status(400).json({ message: 'Código OTP incorrecto' });
  }

  // Si todo está bien, llama a next para continuar con el flujo de Express
  next();
};
