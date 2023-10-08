import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import config from './config.js';

export const mailConfig = {
  url: config.MAIL_URL_TRANSPORT,
  from: `"${config.MAIL_FROM_NAME}" <${config.MAIL_FROM}>`,
} as SMTPTransport.Options;
