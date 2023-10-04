import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from '../services/users.service.js';
import { Request } from 'express';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly userService: UsersService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: Request = ctx.switchToHttp().getRequest();

    const userFromRequest = request.user as UserFromJwt;

    const isAdmin = await this.userService.isAdmin(userFromRequest.id);

    if (!isAdmin) {
      throw new ForbiddenException('🚨 нет доступа!');
    }

    return true;
  }
}
