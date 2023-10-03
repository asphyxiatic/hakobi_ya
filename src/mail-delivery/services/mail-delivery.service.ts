import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { join } from 'path';

enum TemplatesDiscriptionEnum {
  RECOVERY_PASSWORD = 'Восстановление пароля',
}

enum TemplatesPathEnum {
  RECOVERY_PASSWORD = 'recoveryPassword',
}

@Injectable()
export class MailDeliveryService {
  constructor(private readonly mailerService: MailerService) {}
  private readonly TEMPLATES_PATH = '../templates';

  public async sendEmail(
    to: string,
    template: keyof typeof TemplatesDiscriptionEnum,
    context: { [key: string]: any },
  ) {
    this.mailerService
      .sendMail({
        to: to,
        subject: TemplatesDiscriptionEnum[template],
        template: join(
          __dirname,
          this.TEMPLATES_PATH,
          TemplatesPathEnum[template],
        ),
        context: context,
      })
      .catch((error: any) => {
        throw new InternalServerErrorException(
          '🚨 не удалось отправить сообщение!',
        );
      });
  }
}
