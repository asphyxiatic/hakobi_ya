import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module.js';
import { AuthModule } from './auth/auth.module.js';
import { StreetsModule } from './streets/streets.module.js';

@Module({
  imports: [DatabaseModule, AuthModule, StreetsModule],
})
export class AppModule {}
