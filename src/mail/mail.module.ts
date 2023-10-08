import { Module } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailService } from './services/mail.service.js';
import { mailConfig } from '../config/mail.config.js';

const providers = [
  {
    provide: 'MailTransporter',
    useFactory: async () => {
      const mailerTransporter = nodemailer.createTransport(mailConfig);
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
