import {
  BadGatewayException,
  BadRequestException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from '../../users/services/users.service.js';
import { RegisterDto } from '../dto/register.dto.js';
import { RegisterResponseDto } from '../dto/register-response.dto.js';
import { JwtTokenPayload } from '../../jwt/interfaces/token-payload.interface.js';
import config from '../../config/config.js';
import { JwtToolsService } from '../../jwt/services/jwt-tools.service.js';
import { CreatePairTokens } from '../interfaces/create-pair-tokens.interface.js';
import { TokensService } from '../../tokens/services/tokens.service.js';
import { SignInDto } from '../dto/sign-in.dto.js';
import { SignInResponseDto } from '../dto/sign-in-response.dto.js';

@Injectable()
export class AuthService {
  private readonly JWT_ACCESS_SECRET = config.JWT_ACCESS_SECRET_KEY;
  private readonly JWT_REFRESH_SECRET = config.JWT_REFRESH_SECRET_KEY;

  constructor(
    private readonly usersService: UsersService,
    private readonly jwtToolsService: JwtToolsService,
    private readonly tokensService: TokensService,
  ) {}

  //-------------------------------------------------------------------------
  public async register(
    credentials: RegisterDto,
    fingerprint: string,
  ): Promise<RegisterResponseDto> {
    const user = await this.usersService.findByEmail(credentials.email);

    if (user) {
      throw new BadGatewayException('🚨 email уже занят!!!');
    }

    const newUser = await this.usersService.create(credentials);

    const tokens = await this.createPairTokens(newUser.id, newUser.email);

    await this.tokensService.saveRefreshToken(
      newUser.id,
      tokens.refreshToken,
      fingerprint,
    );

    return {
      user: newUser,
      ...tokens,
    };
  }

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

    const tokens = await this.createPairTokens(user.id, user.email);

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

  //-------------------------------------------------------------------------
  private async createPairTokens(
    userId: string,
    email: string,
  ): Promise<CreatePairTokens> {
    const tokenPayload: JwtTokenPayload = {
      sub: userId,
      email: email,
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
