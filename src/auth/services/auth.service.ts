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
import { Role } from '../../users/enums/role.enum.js';
import {
  EMAIL_USER_CONFLICT,
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

    const tokens = await this.createPairTokens(user.id, user.login, user.roles);

    await this.tokensService.saveToken(
      user.id,
      tokens.refreshToken,
      fingerprint,
    );

    return {
      user: {
        userId: user.id,
        login: user.login,
        roles: user.roles,
      },
      ...tokens,
    };
  }

  //-------------------------------------------------------------
  public async registerUser(login: string): Promise<RegisterUserResponse> {
    const user = await this.usersService.findByLogin(login);

    if (user) throw new ConflictException(EMAIL_USER_CONFLICT);

    const password = passwordGenerator.generate({ length: 8, numbers: true });

    await this.usersService.create(login, password);

    return { login: login, password: password };
  }

  //-------------------------------------------------------------
  public async refreshTokens(
    user: UserFromJwt,
    fingerprint: string,
  ): Promise<TokensResponse> {
    const newTokens = await this.createPairTokens(
      user.userId,
      user.login,
      user.roles,
    );

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
  public async createRecoveryToken(
    userId: string,
    login: string,
    roles: Role[],
  ): Promise<string> {
    const tokenPayload: JwtTokenPayload = {
      userId: userId,
      roles: roles,
      login: login,
    };

    const recoveryToken = await this.jwtToolsService.createToken(
      tokenPayload,
      this.JWT_RECOVERY_SECRET,
      this.JWT_RECOVERY_EXPIRES,
    );

    await this.usersService.setRecoveryToken(userId, recoveryToken);

    return recoveryToken;
  }

  //-------------------------------------------------------------
  public async validateAtToken(token: string): Promise<UserFromJwt> {
    const payload: JwtTokenPayload = await this.jwtToolsService.decodeToken(
      token,
      this.JWT_ACCESS_SECRET,
    );

    const isUserExist = await this.usersService.isUserExist(
      payload.userId,
      payload.roles,
    );

    if (!isUserExist) throw new UnauthorizedException(UNAUTHORIZED_RESOURCE);

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

    const tokens = await this.createPairTokens(
      userWithUpdatedPassword.id,
      userWithUpdatedPassword.login,
      userWithUpdatedPassword.roles,
    );

    await this.tokensService.saveToken(
      userWithUpdatedPassword.id,
      tokens.refreshToken,
      fingerprint,
    );

    return this.signIn(
      {
        login: userWithUpdatedPassword.login,
        password: password,
      },
      fingerprint,
    );
  }

  //-------------------------------------------------------------------------
  public async changePassword(userId: string, password: string): Promise<void> {
    await this.usersService.updatePassword(userId, password);
  }

  //-------------------------------------------------------------------------
  private async createPairTokens(
    userId: string,
    login: string,
    roles: Role[],
  ): Promise<TokensResponse> {
    const tokenPayload: JwtTokenPayload = {
      userId: userId,
      login: login,
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
