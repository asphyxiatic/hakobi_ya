import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Type,
  mixin,
} from '@nestjs/common';
import { Request } from 'express';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';
import { Role } from '../enums/role.enum.js';
import { UsersService } from '../services/users.service.js';
import { FORBIDDEN } from '../../common/errors/errors.constants.js';

export const HttpRoleGuard = (
  include: Role[],
  exclude: Role[] = [],
): Type<CanActivate> => {
  @Injectable()
  class HttpRoleGuardMixin implements CanActivate {
    constructor(private readonly usersService: UsersService) {}
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const request: Request = ctx.switchToHttp().getRequest();

      const user = request?.user as UserFromJwt;

      const userFromDB = await this.usersService.findById(user.userId);

      if (!userFromDB) {
        throw new ForbiddenException(FORBIDDEN);
      }

      const acessDenied = userFromDB.roles
        .map((role) => exclude.includes(role))
        .reduce((accumulator, currentValue) => accumulator || currentValue);

      if (acessDenied) {
        return false;
      }

      const access = userFromDB.roles
        .map((role) => include.includes(role))
        .reduce((accumulator, currentValue) => accumulator || currentValue);

      return access;
    }
  }
  return mixin(HttpRoleGuardMixin);
};
