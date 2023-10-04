import { JwtService } from '@nestjs/jwt';
import { IDecodeTokenResult } from '../interfaces/decode-token-result.interface.js';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtTokenPayload } from '../interfaces/token-payload.interface.js';

@Injectable()
export class JwtToolsService {
  constructor(private readonly jwtService: JwtService) {}

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
  ): Promise<IDecodeTokenResult> {
    const decodeToken: JwtTokenPayload = await this.jwtService
      .verifyAsync(token, { secret: secret })
      .catch((error: any) => {
        throw new InternalServerErrorException('🚨 token is invalid!');
      });

    return {
      userId: decodeToken.sub,
      login: decodeToken.login,
    };
  }
}
