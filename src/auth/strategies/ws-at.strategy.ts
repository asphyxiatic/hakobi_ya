import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import config from '../../config/config.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import { UsersService } from '../../users/services/users.service.js';
import { UNAUTHORIZED_RESOURCE } from '../../common/errors/errors.constants.js';

@Injectable()
export class WsAtStrategy extends PassportStrategy(Strategy, 'ws') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('bearerToken'),
      ignoreExpiration: false,
      secretOrKey: config.JWT_ACCESS_SECRET_KEY,
    } as StrategyOptions);
  }

  async validate(payload: JwtTokenPayload) {
    const isUserExist = await this.userService.isUserExist(
      payload.userId,
      payload.roles,
    );

    const userFromJwt: UserFromJwt = {
      userId: payload.userId,
      login: payload.login,
      roles: payload.roles,
    };

    if (!isUserExist) throw new UnauthorizedException(UNAUTHORIZED_RESOURCE);

    return userFromJwt;
  }
}
