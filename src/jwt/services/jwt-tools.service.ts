import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { JwtTokenPayload } from '../interfaces/token-payload.interface.js';

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
  ): Promise<JwtTokenPayload | undefined> {
    try {
      const decodeToken: JwtTokenPayload = await this.jwtService.verifyAsync(
        token,
        { secret: secret },
      );

      return {
        userId: decodeToken.userId,
        login: decodeToken.login,
        roles: decodeToken.roles,
      };
    } catch (error: any) {
      return undefined;
    }
  }
}
