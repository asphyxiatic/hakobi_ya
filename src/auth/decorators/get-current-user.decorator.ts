import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';

export const GetCurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserFromJwt => {
    const request = ctx.switchToHttp().getRequest();

    return request.user;
  },
);
