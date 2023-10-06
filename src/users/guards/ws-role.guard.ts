import { CanActivate, ExecutionContext, Type, mixin } from '@nestjs/common';
import { Role } from '../enums/role.enum.js';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';

export const WsRoleGuard = (roles: Role[]): Type<CanActivate> => {
  class WsRoleGuardMixin implements CanActivate {
    canActivate(ctx: ExecutionContext): boolean {
      const client = ctx.switchToWs().getClient();

      const user = client.handshake['user'] as UserFromJwt;

      const access = user.roles
        .map((role) => roles.includes(role))
        .reduce((accumulator, currentValue) => accumulator || currentValue);

      return access;
    }
  }
  return mixin(WsRoleGuardMixin);
};
