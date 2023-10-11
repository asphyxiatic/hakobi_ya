import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import config from '../../config/config.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { UsersService } from '../../users/services/users.service.js';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { FORBIDDEN } from '../../common/errors/errors.constants.js';
import { Request } from 'express';
import { AuthService } from '../services/auth.service.js';

@Injectable()
export class RecoveryStrategy extends PassportStrategy(Strategy, 'recovery') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_RECOVERY_SECRET_KEY,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(
    request: Request,
    payload: JwtTokenPayload,
  ): Promise<UserFromJwt> {
    const isValidUser = await this.usersService.isValidUser(
      payload.userId,
      payload.roles,
    );

    if (!isValidUser) throw new ForbiddenException(FORBIDDEN);

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    const isValidRecoveryToken = await this.authService.validateRecoveryToken(
      payload.userId,
      token,
    );

    if (!isValidRecoveryToken) throw new ForbiddenException(FORBIDDEN);

    const userFromJwt: UserFromJwt = {
      userId: payload.userId,
      login: payload.login,
      roles: payload.roles,
    };

    return userFromJwt;
  }
}
