import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { Request } from 'express';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';
import { Role } from '../enums/role.enum.js';

export const HttpRoleGuard = (
  roles: Role[],
  exclude: Role[] = [],
): Type<CanActivate> => {
  class HttpRoleGuardMixin implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
      const request: Request = ctx.switchToHttp().getRequest();

      const user = request?.user as UserFromJwt;

      const acessDenied = user.roles
        .map((role) => exclude.includes(role))
        .reduce((accumulator, currentValue) => accumulator || currentValue);

      if (acessDenied) {
        return false;
      }

      const access = user.roles
        .map((role) => roles.includes(role))
        .reduce((accumulator, currentValue) => accumulator || currentValue);

      return access;
    }
  }
  return mixin(HttpRoleGuardMixin);
};
