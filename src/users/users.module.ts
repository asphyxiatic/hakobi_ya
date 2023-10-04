import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';
import { AdminGuard } from './guards/admin.guard.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [UsersService, AdminGuard],
  exports: [UsersService, AdminGuard],
})
export class UsersModule {}
