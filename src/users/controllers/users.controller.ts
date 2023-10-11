import { Controller, Get, UseGuards } from '@nestjs/common';
import { HttpAtGuard } from '../../auth/guards/http-at.guard.js';
import { UsersService } from '../services/users.service.js';
import { UsersResponse } from '../interfaces/users-response.inteface.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(HttpAtGuard)
  @Get()
  async getAllUsers(): Promise<UsersResponse[]> {
    return this.usersService.getAllUsers();
  }
}
