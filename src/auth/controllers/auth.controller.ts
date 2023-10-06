import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service.js';
import { GetFingerprints } from '../decorators/get-fingerprints.decorator.js';
import { SignInDto } from '../dto/sign-in.dto.js';
import { SignInResponseDto } from '../dto/sign-in-response.dto.js';
import { RtGuard } from '../guards/rt.guard.js';
import { GetCurrentHttpUser } from '../../common/decorators/get-current-http-user.decorator.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { RefreshTokensResponseDto } from '../dto/refresh-tokens-response.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-in')
  async signIn(
    @Body() credentials: SignInDto,
    @GetFingerprints() fingerprint: string,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(credentials, fingerprint);
  }

  @Post('refresh')
  @UseGuards(RtGuard)
  async refreshTokens(
    @GetCurrentHttpUser() user: UserFromJwt,
    @GetFingerprints() fingerprint: string,
  ): Promise<RefreshTokensResponseDto> {
    return this.authService.refreshTokens(user, fingerprint);
  }
}
