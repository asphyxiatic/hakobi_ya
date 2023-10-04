import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { AddressesModule } from './addresses/addresses.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, UsersModule, AddressesModule],
})
export class AppModule {}
