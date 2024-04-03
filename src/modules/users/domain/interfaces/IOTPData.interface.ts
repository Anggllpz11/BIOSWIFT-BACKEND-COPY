export interface OTPData {
  otp: string;
  generationTime: Date;
}

export const otpMap: { [email: string]: OTPData } = {};
