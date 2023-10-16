import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Type,
  mixin,
} from '@nestjs/common';
import { Role } from '../enums/role.enum.js';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';
import { UsersService } from '../services/users.service.js';
import { FORBIDDEN } from '../../common/errors/errors.constants.js';
import { WsException } from '@nestjs/websockets';

export const WsRoleGuard = (
  include: Role[],
  exclude: Role[] = [],
): Type<CanActivate> => {
  @Injectable()
  class WsRoleGuardMixin implements CanActivate {
    constructor(private readonly usersService: UsersService) {}
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
      const client = ctx.switchToWs().getClient();

      const user = client['user'] as UserFromJwt;

      const userFromDB = await this.usersService.findById(user.userId);

      if (!userFromDB) {
        throw new WsException(FORBIDDEN);
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
  return mixin(WsRoleGuardMixin);
};
