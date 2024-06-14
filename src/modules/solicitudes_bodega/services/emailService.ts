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

interface Attachment {
  filename?: string; // nombre del archivo como se verá en el correo
  content?: string | Buffer; // contenido en forma de Buffer o cadena
  path?: string; // ruta al archivo si se está enviando desde el sistema de archivos
  contentType?: string; // tipo MIME del archivo
  cid?: string; // Content ID del archivo para usarlo como contenido incrustado en el cuerpo del correo
}

// Usando esta definición en la función sendEmail
export const sendEmail = async (to: string, subject: string, html: string, attachments?: Attachment[]): Promise<void> => {
  const mailOptions = {
    from: 'ziriuzemail@gmail.com',
    to: to,
    subject: subject,
    html: html,
    attachments: attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email enviado con éxito');
  } catch (error) {
    console.error(`Error al enviar el correo electrónico: ${error}`);
    throw new Error(`Error al enviar el correo electrónico: ${error}`);
  }
};