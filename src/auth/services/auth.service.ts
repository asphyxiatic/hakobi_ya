import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from '../../users/services/users.service.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import config from '../../config/config.js';
import { JwtToolsService } from '../../jwt/services/jwt-tools.service.js';
import { TokensResponse } from '../interfaces/tokens-response.interface.js';
import { TokensService } from '../../tokens/services/tokens.service.js';
import { SignInResponse } from '../interfaces/sign-in-response.interface.js';
import passwordGenerator from 'generate-password-ts';
import { RegisterUserResponse } from '../interfaces/register-user.interface.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import {
  LOGIN_USER_CONFLICT,
  USER_NOT_FOUND,
} from '../../common/errors/errors.constants.js';
import { UserCredentials } from '../interfaces/user-credentials.interface.js';
import { Socket } from 'socket.io';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET_KEY;
  private readonly JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET_KEY;
  private readonly JWT_RECOVERY_SECRET = config.JWT_RECOVERY_SECRET_KEY;
  private readonly JWT_ACCESS_EXPIRES = '15m';
  private readonly JWT_RECOVERY_EXPIRES = '5m';
  private readonly JWT_REFRESH_EXPIRES = '60d';

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtToolsService: JwtToolsService,
    private readonly tokensService: TokensService,
  ) {}

  //-------------------------------------------------------------
  public async signIn(
    credentials: UserCredentials,
    fingerprint: string,
  ): Promise<SignInResponse> {
    const { login, password } = credentials;

    const user = await this.usersService.findUserForCredentials(
      login,
      password,
    );

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    const tokens = await this.createPairTokens({
      userId: user.id,
      login: user.login,
      roles: user.roles,
    });

    await this.tokensService.saveToken(
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
  public async getUserFromSocket(
    socket: Socket,
  ): Promise<UserFromJwt | undefined> {
    const token = socket.handshake.auth.token;

    if (!token) return undefined;

    const tokenPayload: JwtTokenPayload | undefined =
      await this.jwtToolsService.decodeToken(
        token,
        config.JWT_ACCESS_SECRET_KEY,
      );

    if (!tokenPayload) return undefined;

    const userFromJwt: UserFromJwt = {
      userId: tokenPayload.userId,
      login: tokenPayload.login,
      roles: tokenPayload.roles,
    };

    return userFromJwt;
  }

  //-------------------------------------------------------------
  public async registerUser(login: string): Promise<RegisterUserResponse> {
    const user = await this.usersService.findByLogin(login);

    if (user) throw new WsException(LOGIN_USER_CONFLICT);

    const password = passwordGenerator.generate({ length: 8, numbers: true });

    const registredUser = await this.usersService.create(login, password);

    return {
      id: registredUser.id,
      roles: registredUser.roles,
      credentials: {
        login: registredUser.login,
        password: password,
      },
    };
  }

  //-------------------------------------------------------------
  public async refreshTokens(
    user: UserFromJwt,
    fingerprint: string,
  ): Promise<TokensResponse> {
    const payload: JwtTokenPayload = {
      userId: user.userId,
      login: user.login,
      roles: user.roles,
    };

    const newTokens = await this.createPairTokens(payload);

    await this.tokensService.saveToken(
      user.userId,
      newTokens.refreshToken,
      fingerprint,
    );

    return {
      accessToken: newTokens.accessToken,
      refreshToken: newTokens.refreshToken,
    };
  }

  //-------------------------------------------------------------------------
  public async createRecoveryToken(payload: JwtTokenPayload): Promise<string> {
    const recoveryToken = await this.jwtToolsService.createToken(
      payload,
      this.JWT_RECOVERY_SECRET,
      this.JWT_RECOVERY_EXPIRES,
    );

    await this.usersService.setRecoveryToken(payload.userId, recoveryToken);

    return recoveryToken;
  }

  // -------------------------------------------------------------
  public async resetPassword(
    userId: string,
    password: string,
    fingerprint: string,
  ): Promise<SignInResponse> {
    const userWithUpdatedPassword = await this.usersService.updatePassword(
      userId,
      password,
    );

    await this.usersService.setRecoveryToken(userWithUpdatedPassword.id, null);

    const payload: JwtTokenPayload = {
      userId: userWithUpdatedPassword.id,
      login: userWithUpdatedPassword.login,
      roles: userWithUpdatedPassword.roles,
    };

    const tokens = await this.createPairTokens(payload);

    await this.tokensService.saveToken(
      userWithUpdatedPassword.id,
      tokens.refreshToken,
      fingerprint,
    );

    return this.signIn(
      { login: userWithUpdatedPassword.login, password: password },
      fingerprint,
    );
  }

  //-------------------------------------------------------------------------
  public async changePassword(userId: string, password: string): Promise<void> {
    await this.usersService.updatePassword(userId, password);
  }

  //-------------------------------------------------------------------------
  private async createPairTokens(
    payload: JwtTokenPayload,
  ): Promise<TokensResponse> {
    const accessToken = await this.jwtToolsService.createToken(
      payload,
      this.JWT_ACCESS_SECRET,
      this.JWT_ACCESS_EXPIRES,
    );

    const refreshToken = await this.jwtToolsService.createToken(
      payload,
      this.JWT_REFRESH_SECRET,
      this.JWT_REFRESH_EXPIRES,
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  // -------------------------------------------------------------
  public async validateRecoveryToken(
    userId: string,
    recoveryToken: string,
  ): Promise<boolean> {
    const isValidRecoveryToken = await this.usersService.findOne({
      id: userId,
      recoveryToken: recoveryToken,
    });
    return !!isValidRecoveryToken;
  }
}
