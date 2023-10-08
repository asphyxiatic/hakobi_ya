import { Module } from '@nestjs/common';
import nodemailer from 'nodemailer';
import config from '../config/config.js';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';
import { MailService } from './services/mail.service.js';

const providers = [
  {
    provide: 'MailTransporter',
    useFactory: async () => {
      const mailerTransporter = nodemailer.createTransport({
        url: config.MAIL_URL_TRANSPORT,
        from: `"${config.MAIL_FROM_NAME}" <${config.MAIL_FROM}>`,
      } as SMTPTransport.Options);

      return mailerTransporter;
    },
  },
  MailService,
];

@Module({
  providers: [...providers],
  exports: [...providers],
})
export class MailModule {}
