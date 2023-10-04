import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service.js';
import { GetFingerprints } from '../decorators/get-fingerprints.decorator.js';
import { SignInDto } from '../dto/sign-in.dto.js';
import { SignInResponseDto } from '../dto/sign-in-response.dto.js';
import { SkipAuth } from '../decorators/skip-auth.decorator.js';
import { RegisterUserDto } from '../dto/create-user.dto.js';
import { RegisterUserResponseDto } from '../dto/create-user-response.dto.js';
import { AdminGuard } from '../../users/guards/admin.guard.js';
import { RtGuard } from '../guards/rt.guard.js';
import { GetCurrentUser } from '../decorators/get-current-user.decorator.js';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface.js';
import { RefreshTokensResponseDto } from '../dto/refresh-tokens-response.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @UseGuards(AdminGuard)
  async register(
    @Body() { login, role }: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    return this.authService.createUserWithGeneratedPassword(login, role);
  }

  @Post('sign-in')
  @SkipAuth()
  async signIn(
    @Body() credentials: SignInDto,
    @GetFingerprints() fingerprint: string,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(credentials, fingerprint);
  }

  @Post('refresh')
  @SkipAuth()
  @UseGuards(RtGuard)
  async refreshTokens(
    @GetCurrentUser() user: UserFromJwt,
    @GetFingerprints() fingerprint: string,
  ): Promise<RefreshTokensResponseDto> {
    return this.authService.refreshTokens(user, fingerprint);
  }
}
