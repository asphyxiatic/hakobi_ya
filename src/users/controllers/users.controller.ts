import { Controller, Get, UseGuards } from '@nestjs/common';
import { AtGuard } from '../../auth/guards/at.guard.js';
import { UsersService } from '../services/users.service.js';
import { UserEntity } from '../entities/user.entity.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AtGuard)
  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }
}
