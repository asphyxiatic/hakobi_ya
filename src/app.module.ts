import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { StreetsModule } from './streets/streets.module.js';
import { AdminsModule } from './admins/admins.module.js';
import { UsersModule } from './users/users.module.js';
import { AppGateway } from './app.gateway.js';

@Module({
  imports: [
    DatabaseModule,
    AdminsModule,
    AuthModule,
    StreetsModule,
    UsersModule,
  ],
  providers: [AppGateway],
})
export class AppModule {}
