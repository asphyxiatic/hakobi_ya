import { JwtService } from '@nestjs/jwt';
import { DecodeTokenResponse } from '../interfaces/decode-token-result.interface.js';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtTokenPayload } from '../interfaces/token-payload.interface.js';
import { INVALID_JWT_TOKEN } from '../../common/errors/errors.constants.js';

@Injectable()
export class JwtToolsService {
  constructor(private readonly jwtService: JwtService) {}

  // -------------------------------------------------------------
  public async createToken(
    payload: JwtTokenPayload,
    secret: string,
    expires: string,
  ): Promise<string> {
    const token = await this.jwtService.signAsync(payload, {
      secret: secret,
      expiresIn: expires,
    });

    return token;
  }

  // -------------------------------------------------------------
  public async decodeToken(
    token: string,
    secret: string,
  ): Promise<DecodeTokenResponse> {
    const decodeToken: JwtTokenPayload = await this.jwtService
      .verifyAsync(token, { secret: secret })
      .catch((error: any) => {
        throw new InternalServerErrorException(INVALID_JWT_TOKEN);
      });

    return {
      id: decodeToken.userId,
      login: decodeToken.login,
      roles: decodeToken.roles,
    };
  }
}
