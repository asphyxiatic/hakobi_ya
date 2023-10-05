import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { Request } from 'express';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';
import { Role } from '../enums/role.enum.js';

export const RoleGuard = (role: Role): Type<CanActivate> => {
  class RoleGuardMixin implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
      const request: Request = ctx.switchToHttp().getRequest();

      const user = request?.user as UserFromJwt;

      return user.roles.includes(role);
    }
  }
  return mixin(RoleGuardMixin);
};
