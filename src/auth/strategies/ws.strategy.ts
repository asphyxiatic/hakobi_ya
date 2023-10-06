import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import config from '../../config/config.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import { UsersService } from '../../users/services/users.service.js';

@Injectable()
export class WsStrategy extends PassportStrategy(Strategy, 'ws') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('bearerToken'),
      ignoreExpiration: false,
      secretOrKey: config.JWT_ACCESS_SECRET_KEY,
    } as StrategyOptions);
  }

  async validate(payload: JwtTokenPayload) {
    const isUserExist = await this.userService.isUserExist(payload.sub);

    const userFromJwt: UserFromJwt = {
      id: payload.sub,
      login: payload.login,
      roles: payload.roles,
    };

    if (!isUserExist) {
      throw new UnauthorizedException();
    }

    return userFromJwt;
  }
}
