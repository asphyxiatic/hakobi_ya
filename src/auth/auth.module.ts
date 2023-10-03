import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './services/auth.service.js';
import { AuthController } from './controllers/auth.controller.js';
import { JwtToolsModule } from '../jwt/jwt-tools.module.js';
import { UsersModule } from '../users/users.module.js';
import { TokensModule } from '../tokens/tokens.module.js';
import { FingerprintsMiddleware } from './middlewares/fingerprints.middleware.js';
import { EncryptionModule } from '../encryption/encryption.module.js';

@Module({
  imports: [JwtToolsModule, UsersModule, TokensModule, EncryptionModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(FingerprintsMiddleware).forRoutes('*');
  }
}