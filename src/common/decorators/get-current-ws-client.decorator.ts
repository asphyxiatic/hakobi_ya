import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';

export const GetCurrentWsClient = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserFromJwt => {
    const client = ctx.switchToWs().getClient();

    return client.handshake['user'];
  },
);
