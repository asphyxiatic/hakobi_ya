import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import config from '../../config/config.js';
import { JwtToolsService } from '../../jwt/services/jwt-tools.service.js';
import { TokensResponse } from '../interfaces/tokens-response.interface.js';
import { TokensService } from '../../tokens/services/tokens.service.js';
import { SignInDto } from '../dto/sign-in.dto.js';
import { SignInResponse } from '../interfaces/sign-in-response.interface.js';
import passwordGenerator from 'generate-password-ts';
import { RegisterUserResponse } from '../interfaces/register-user.interface.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import {
  LOGIN_USER_CONFLICT,
  UNAUTHORIZED_RESOURCE,
  USER_NOT_FOUND,
} from '../../common/errors/errors.constants.js';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET_KEY;
  private readonly JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET_KEY;
  private readonly JWT_RECOVERY_SECRET = config.JWT_RECOVERY_SECRET_KEY;
  private readonly JWT_ACCESS_EXPIRES = '60d';
  private readonly JWT_RECOVERY_EXPIRES = '60d';
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
  public async registerUser(login: string): Promise<RegisterUserResponse> {
    const user = await this.usersService.findByLogin(login);

    if (user) throw new ConflictException(LOGIN_USER_CONFLICT);

    const password = passwordGenerator.generate({ length: 8, numbers: true });

    const registredUser = await this.usersService.create(login, password);

    return {
      id: registredUser.id,
      roles: registredUser.roles,
      online: registredUser.online,
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

  //-------------------------------------------------------------
  public async validateAccessToken(token: string): Promise<UserFromJwt> {
    const payload: JwtTokenPayload = await this.jwtToolsService.decodeToken(
      token,
      this.JWT_ACCESS_SECRET,
    );

    const isValidUser = await this.usersService.isValidUser(
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
    return !!this.usersService.findOne({
      id: userId,
      recoveryToken: recoveryToken,
    });
  }
}
