import nodemailer from 'nodemailer';

// Configuración del servicio de envío de correos
const transporter = nodemailer.createTransport({
  // host: 'smtp.gmail.com',
  // port: 465,
  // secure: true, // true for 465, false for other ports
  service: 'gmail',
  auth: {
    user: 'ziriuzemail@gmail.com', // User email
    pass: 'lqrhxrmterexeprh' // User email password
  }
});

// Función para enviar correos electrónicos
export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const mailOptions = {
    from: 'ziriuzemail@gmail.com', // Cambia esto por tu dirección de correo electrónico
    to,
    subject,
    html
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`
    
    
    
    `);
  } catch (error) {
    console.error(`Error al enviar el correo electrónico: ${error}`);
    throw new Error(`Error al enviar el correo electrónico: ${error}`);
  }
};
