import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminsGateway } from './gateways/admins.gateway.js';
import { StreetsModule } from '../streets/streets.module.js';
import { HousesModule } from '../houses/houses.module.js';
import { UsersModule } from '../users/users.module.js';
import { AdminsController } from './controllers/admins.controller.js';
import { AdminsService } from './services/admins.service.js';
import { MailModule } from '../mail/mail.module.js';

@Module({
  imports: [AuthModule, StreetsModule, HousesModule, UsersModule, MailModule],
  controllers: [AdminsController],
  providers: [AdminsGateway, AdminsService],
})
export class AdminsModule {}
