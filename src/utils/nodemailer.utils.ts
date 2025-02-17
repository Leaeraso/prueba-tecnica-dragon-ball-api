import nodemailer from 'nodemailer';
import config from '../config/index';
import { InternalServerError } from '../config/errors';
import { ErrorMessage } from '../config/errors/messages.enum';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: config.EMAIL,
    pass: config.PASSWORD,
  },
});

const sendExcelByEmail = async (email: string, excelBuffer: Buffer) => {
  const mailOptions = {
    from: config.EMAIL,
    to: email,
    subject: 'Excel Character Report',
    html: `<p>You will find the character report attached in Excel format.</p>`,
    attachments: [
      {
        filename: 'characters.xlsx',
        content: excelBuffer,
        contentType:
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Mail sent successfully');
  } catch (error) {
    console.error('Error sending the mail: ', error);
    throw new InternalServerError(ErrorMessage.ErrorSendingEmail);
  }
};

export default sendExcelByEmail;
