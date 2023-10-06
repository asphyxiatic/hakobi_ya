import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './services/auth.service.js';
import { AuthController } from './controllers/auth.controller.js';
import { JwtToolsModule } from '../jwt/jwt-tools.module.js';
import { UsersModule } from '../users/users.module.js';
import { TokensModule } from '../tokens/tokens.module.js';
import { FingerprintsMiddleware } from './middlewares/fingerprints.middleware.js';
import { EncryptionModule } from '../encryption/encryption.module.js';
import { AtStrategy } from './strategies/at.strategy.js';
import { RtStrategy } from './strategies/rt.strategy.js';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './guards/at.guard.js';
import { RtGuard } from './guards/rt.guard.js';
import { WsStrategy } from './strategies/ws.strategy.js';
import { WsGuard } from './guards/ws.guard.js';
import { AuthGateway } from './gateways/auth.gateway.js';

@Module({
  imports: [JwtToolsModule, UsersModule, TokensModule, EncryptionModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    AtStrategy,
    RtStrategy,
    WsStrategy,
    {
      provide: APP_GUARD,
      useClass: AtGuard,
    },
    RtGuard,
    WsGuard,
    AuthGateway,
  ],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FingerprintsMiddleware).forRoutes('*');
  }
}
