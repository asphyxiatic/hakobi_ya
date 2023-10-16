import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import config from '../../config/config.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';

@Injectable()
export class WsAtStrategy extends PassportStrategy(Strategy, 'ws') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter('token'),
      ignoreExpiration: false,
      secretOrKey: config.JWT_ACCESS_SECRET_KEY,
    } as StrategyOptions);
  }

  async validate(payload: JwtTokenPayload) {
    const userFromJwt: UserFromJwt = {
      userId: payload.userId,
      login: payload.login,
      roles: payload.roles,
    };

    return userFromJwt;
  }
}
