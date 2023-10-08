import { Inject, InternalServerErrorException } from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer/index.js';
import { MailOptions } from '../interfaces/mail-options.interface.js';
import { FAILED_SEND_EMAIL } from '../../common/errors/errors.constants.js';

export class MailService {
  constructor(
    @Inject('MailTransporter')
    private readonly transporter: Mail,
  ) {}

  // -------------------------------------------------------------
  public async sendMail(options: Mail.Options & MailOptions): Promise<any> {
    try {
      return this.transporter.sendMail(options);
    } catch (error: any) {
      throw new InternalServerErrorException(FAILED_SEND_EMAIL);
    }
  }
}
