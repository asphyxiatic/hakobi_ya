import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserFromJwt => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
