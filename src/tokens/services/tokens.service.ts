import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { TokenEntity } from '../entities/token.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { EncryptionService } from '../../encryption/services/encryption.service.js';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TokensService {
  private readonly saltRounds = 5;

  constructor(
    @InjectRepository(TokenEntity)
    private readonly tokensRepository: Repository<TokenEntity>,
    private readonly encryptionService: EncryptionService,
  ) {}

  //-------------------------------------------------------------
  public async saveRefreshToken(
    userId: string,
    refreshToken: string,
    fingerprint: string,
  ): Promise<void> {
    try {
      const encryptionRefreshToken = await this.encryptionService.encrypt(
        refreshToken,
      );

      const hashedEncryptionRefreshToken = bcrypt.hashSync(
        encryptionRefreshToken,
        this.saltRounds,
      );

      const saveTokenPayload: Partial<TokenEntity> = {
        userId: userId,
        value: hashedEncryptionRefreshToken,
        fingerprint: fingerprint,
      };

      const tokenInDB = await this.tokensRepository.findOne({
        where: {
          userId,
          fingerprint,
        },
      });

      if (!tokenInDB) {
        await this.tokensRepository.save(saveTokenPayload);
      } else {
        await this.tokensRepository.save({
          id: tokenInDB.id,
          value: hashedEncryptionRefreshToken,
        });
      }
    } catch (error: any) {
      throw new InternalServerErrorException(
        '🚨 ошибка сохранения токена в базу данных!',
      );
    }
  }

  //-------------------------------------------------------------
  public async validateRefreshToken(
    userId: string,
    refreshToken: string,
    fingerprint: string,
  ): Promise<boolean> {
    const tokens = await this.tokensRepository.find({ where: { userId } });

    const encryptRefreshToken = await this.encryptionService.encrypt(
      refreshToken,
    );

    const extractTokenFromDB = tokens.find((token) => {
      return (
        fingerprint === token.fingerprint &&
        bcrypt.compareSync(encryptRefreshToken, token.value)
      );
    });

    if (!extractTokenFromDB) {
      return false;
    }

    return true;
  }
}
