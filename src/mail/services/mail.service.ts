import {
  Inject,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import Mail from 'nodemailer/lib/mailer/index.js';
import { MailOptions } from '../interfaces/mail-options.interface.js';
import { FAILED_SEND_EMAIL } from '../../common/errors/errors.constants.js';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class MailService {
  private readonly TEMPLATES_PATH = join(__dirname, '../templates');

  constructor(
    @Inject('MailTransporter')
    private readonly transporter: Mail,
  ) {}

  // -------------------------------------------------------------
  public async sendMail(options: Mail.Options & MailOptions): Promise<any> {
    try {
      const htmlContent = fs.readFileSync(
        `${this.TEMPLATES_PATH}/${options.template}.html`,
        'utf8',
      );

      const template = Handlebars.compile(htmlContent);

      options.html = template(options.data);

      return this.transporter.sendMail(options);
    } catch (error: any) {
      throw new InternalServerErrorException(FAILED_SEND_EMAIL);
    }
  }
}
