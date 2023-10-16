import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './services/auth.service.js';
import { AuthController } from './controllers/auth.controller.js';
import { JwtToolsModule } from '../jwt/jwt-tools.module.js';
import { UsersModule } from '../users/users.module.js';
import { TokensModule } from '../tokens/tokens.module.js';
import { FingerprintsMiddleware } from './middlewares/fingerprints.middleware.js';
import { EncryptionModule } from '../encryption/encryption.module.js';
import { HttpAtStrategy } from './strategies/http-at.strategy.js';
import { RtStrategy } from './strategies/rt.strategy.js';
import { RecoveryStrategy } from './strategies/recovery.strategy.js';
import { AuthGateway } from './gateways/auth.gateway.js';
// import { WsAtStrategy } from './strategies/ws-at.strategy.js';

@Module({
  imports: [JwtToolsModule, UsersModule, TokensModule, EncryptionModule],
  controllers: [AuthController],
  providers: [
    AuthService,
    HttpAtStrategy,
    RtStrategy,
    RecoveryStrategy,
    AuthGateway,
    // WsAtStrategy,
  ],
  exports: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FingerprintsMiddleware).forRoutes('*');
  }
}
