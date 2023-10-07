import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { AdminsGateway } from './gateways/admins.gateway.js';
import { StreetsModule } from '../streets/streets.module.js';
import { HousesModule } from '../houses/houses.module.js';
import { UsersModule } from '../users/users.module.js';

@Module({
  imports: [AuthModule, StreetsModule, HousesModule, UsersModule],
  providers: [AdminsGateway],
})
export class AdminModule {}
