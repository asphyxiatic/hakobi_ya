import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity.js';
import { UsersGateway } from './gateways/users.gateway.js';
import { EntrancesModule } from '../entrances/entrances.module.js';
import { UsersController } from './controllers/users.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), EntrancesModule],
  controllers: [UsersController],
  providers: [UsersService, UsersGateway],
  exports: [UsersService],
})
export class UsersModule {}
