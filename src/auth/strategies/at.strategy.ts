import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import config from '../../config/config.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service.js';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'at') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_ACCESS_SECRET_KEY,
    } as StrategyOptions);
  }

  async validate(payload: JwtTokenPayload): Promise<UserFromJwt> {
    const isUserExist = await this.userService.isUserExist(
      payload.sub,
      payload.roles,
    );

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
