import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokensService } from './services/tokens.service.js';
import { TokenEntity } from './entities/token.entity.js';
import { EncryptionModule } from '../encryption/encryption.module.js';

@Module({
  imports: [TypeOrmModule.forFeature([TokenEntity]), EncryptionModule],
  providers: [TokensService],
  exports: [TokensService],
})
export class TokensModule {}
