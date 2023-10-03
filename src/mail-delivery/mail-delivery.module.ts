import { Module } from '@nestjs/common';
import { MailDeliveryService } from './services/mail-delivery.service.js';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailerConfigService } from '../config/mailer.config.js';

@Module({
  imports: [
    MailerModule.forRootAsync({
      useClass: MailerConfigService,
    }),
  ],
  providers: [MailDeliveryService],
  exports: [MailDeliveryService],
})
export class MailDeliveryModule {}
