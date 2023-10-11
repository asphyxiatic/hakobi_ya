import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import config from '../../config/config.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service.js';
import { UNAUTHORIZED_RESOURCE } from '../../common/errors/errors.constants.js';

@Injectable()
export class HttpAtStrategy extends PassportStrategy(Strategy, 'at') {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_ACCESS_SECRET_KEY,
    } as StrategyOptions);
  }

  async validate(payload: JwtTokenPayload): Promise<UserFromJwt> {
    const isValidUser = await this.userService.isValidUser(
      payload.userId,
      payload.roles,
    );

    if (!isValidUser) throw new UnauthorizedException(UNAUTHORIZED_RESOURCE);

    const userFromJwt: UserFromJwt = {
      userId: payload.userId,
      login: payload.login,
      roles: payload.roles,
    };

    return userFromJwt;
  }
}
