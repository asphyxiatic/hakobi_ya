import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import config from '../../config/config.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service.js';
import { Request } from 'express';
import { TokensService } from '../../tokens/services/tokens.service.js';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'rt') {
  constructor(
    private readonly userService: UsersService,
    private readonly tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_REFRESH_SECRET_KEY,
      passReqToCallback: true,
    } as StrategyOptions);
  }

  async validate(
    request: Request,
    payload: JwtTokenPayload,
  ): Promise<UserFromJwt> {
    const isUserExist = await this.userService.isUserExist(payload.sub);

    if (!isUserExist) {
      throw new UnauthorizedException();
    }

    const userFromJwt: UserFromJwt = {
      id: payload.sub,
      login: payload?.login,
      email: payload?.email,
      roles: payload.roles,
    };

    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
    const fingerprint = request['fingerprint'];

    const isValidRefreshToken = await this.tokensService.validateToken({
      userId: userFromJwt.id,
      value: token,
      fingerprint: fingerprint,
    });

    if (!isValidRefreshToken) {
      throw new UnauthorizedException();
    }

    return userFromJwt;
  }
}
