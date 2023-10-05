import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import config from '../../config/config.js';
import { JwtToolsService } from '../../jwt/services/jwt-tools.service.js';
import { CreatePairTokensResponse } from '../interfaces/create-pair-tokens-response.interface.js';
import { TokensService } from '../../tokens/services/tokens.service.js';
import { SignInDto } from '../dto/sign-in.dto.js';
import { SignInResponseDto } from '../dto/sign-in-response.dto.js';
import passwordGenerator from 'generate-password-ts';
import { RegisterUserResponseDto } from '../dto/create-user-response.dto.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { RefreshTokensResponseDto } from '../dto/refresh-tokens-response.dto.js';
import { Role } from '../../users/enums/role.enum.js';
import { use } from 'passport';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET_KEY;
  private readonly JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET_KEY;
  private readonly JWT_ACCESS_EXPIRES = '5m';
  private readonly JWT_REFRESH_EXPIRES = '60d';

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

    const userRoles = user.roles;

    let tokens;

    if (userRoles.includes(Role.admin)) {
      tokens = await this.createPairTokens(user.id, userRoles, user.email);
    } else {
      tokens = await this.createPairTokens(user.id, userRoles, user.login);
    }

    await this.tokensService.saveToken({
      userId: user.id,
      value: tokens.refreshToken,
      fingerprint: fingerprint,
    });

    return {
      user: user,
      ...tokens,
    };
  }

  //-------------------------------------------------------------
  public async createUserWithGeneratedPassword(
    login: string,
    roles: Role[],
  ): Promise<RegisterUserResponseDto> {
    const user = await this.usersService.findByLogin(login);

    if (user) {
      throw new BadRequestException('🚨 логин занят!');
    }

    const password = passwordGenerator.generate({ length: 8, numbers: true });

    await this.usersService.create({
      login: login,
      password: password,
      roles: roles,
    });

    return { login, password };
  }

  //-------------------------------------------------------------
  public async refreshTokens(
    user: UserFromJwt,
    fingerprint: string,
  ): Promise<RefreshTokensResponseDto> {
    let newTokens;

    if (user.roles.includes(Role.admin)) {
      newTokens = await this.createPairTokens(user.id, user.roles, user.email);
    } else {
      newTokens = await this.createPairTokens(user.id, user.roles, user.login);
    }

    await this.tokensService.saveToken({
      userId: user.id,
      value: newTokens.refreshToken,
      fingerprint: fingerprint,
    });

    return newTokens;
  }

  //-------------------------------------------------------------------------
  private async createPairTokens(
    userId: string,
    roles: Role[],
    login?: string,
    email?: string,
  ): Promise<CreatePairTokensResponse> {
    const tokenPayload: JwtTokenPayload = {
      sub: userId,
      login: login,
      email: email,
      roles: roles,
    };

    const accessToken = await this.jwtToolsService.createToken(
      tokenPayload,
      this.JWT_ACCESS_SECRET,
      this.JWT_ACCESS_EXPIRES,
    );

    const refreshToken = await this.jwtToolsService.createToken(
      tokenPayload,
      this.JWT_REFRESH_SECRET,
      this.JWT_REFRESH_EXPIRES,
    );

    return { accessToken, refreshToken };
  }
}
