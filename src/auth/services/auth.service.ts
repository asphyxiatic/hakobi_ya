import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import config from '../../config/config.js';
import { JwtToolsService } from '../../jwt/services/jwt-tools.service.js';
import { CreatePairTokens } from '../interfaces/create-pair-tokens.interface.js';
import { TokensService } from '../../tokens/services/tokens.service.js';
import { SignInDto } from '../dto/sign-in.dto.js';
import { SignInResponseDto } from '../dto/sign-in-response.dto.js';
import { UserRole } from '../../users/types/user-roles.js';
import generator from 'generate-password-ts';
import { RegisterUserResponseDto } from '../dto/create-user-response.dto.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { RefreshTokensResponseDto } from '../dto/refresh-tokens-response.dto.js';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET_KEY;
  private readonly JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET_KEY;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtToolsService: JwtToolsService,
    private readonly tokensService: TokensService,
  ) {}

  //-------------------------------------------------------------
  public async signIn(
    credentials: SignInDto,
    fingerprint: string,
  ): Promise<SignInResponseDto> {
    const user = await this.usersService.findUserForCredentials(credentials);

    if (!user) {
      throw new BadRequestException(
        '🚨 неверный адрес электронной почты или пароль!',
      );
    }

    const tokens = await this.createPairTokens(user.id, user.login);

    await this.tokensService.saveRefreshToken(
      user.id,
      tokens.refreshToken,
      fingerprint,
    );

    return {
      user: user,
      ...tokens,
    };
  }

  //-------------------------------------------------------------
  public async createUserWithGeneratedPassword(
    login: string,
    role: UserRole,
  ): Promise<RegisterUserResponseDto> {
    const user = await this.usersService.findByLogin(login);

    if (user) {
      throw new BadRequestException('🚨 логин занят!');
    }

    const password = generator.generate({ length: 8, numbers: true });

    await this.usersService.create({
      login: login,
      password: password,
      role: role,
    });

    return { login, password };
  }

  //-------------------------------------------------------------
  public async refreshTokens(
    user: UserFromJwt,
    fingerprint: string,
  ): Promise<RefreshTokensResponseDto> {
    const newTokens = await this.createPairTokens(user.id, user.login);

    await this.tokensService.saveRefreshToken(
      user.id,
      newTokens.refreshToken,
      fingerprint,
    );

    return newTokens;
  }

  //-------------------------------------------------------------------------
  private async createPairTokens(
    userId: string,
    login: string,
  ): Promise<CreatePairTokens> {
    const tokenPayload: JwtTokenPayload = {
      sub: userId,
      login: login,
    };

    const accessToken = await this.jwtToolsService.createToken(
      tokenPayload,
      this.JWT_ACCESS_SECRET,
      '5m',
    );

    const refreshToken = await this.jwtToolsService.createToken(
      tokenPayload,
      this.JWT_REFRESH_SECRET,
      '60d',
    );

    return { accessToken, refreshToken };
  }
}
