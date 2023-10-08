import { Inject } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer/index.js';
import { MailOptions } from '../interfaces/mail-options.interface.js';

export class MailService {
  constructor(
    @Inject('MailTransporter')
    private readonly transporter: Mail,
  ) {}

  // -------------------------------------------------------------
  public async sendMail(options: Mail.Options & MailOptions): Promise<any> {
    return this.transporter.sendMail(options);
  }
}
