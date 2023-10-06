import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { StreetsModule } from './streets/streets.module.js';
import { AppGateway } from './app.gateway.js';
import { HousesModule } from './houses/houses.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, StreetsModule, HousesModule],
  providers: [AppGateway],
})
export class AppModule {}
