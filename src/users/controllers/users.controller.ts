import { Controller, Get, UseGuards } from '@nestjs/common';
import { HttpAtGuard } from '../../auth/guards/http-at.guard.js';
import { UsersService } from '../services/users.service.js';
import { UserEntity } from '../entities/user.entity.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(HttpAtGuard)
  @Get()
  async getAllUsers(): Promise<UserEntity[]> {
    return this.usersService.getAllUsers();
  }
}
