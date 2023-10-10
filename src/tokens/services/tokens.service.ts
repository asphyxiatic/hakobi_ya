import { Injectable } from '@nestjs/common';
import { FindOptionsWhere, Repository } from 'typeorm';
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

  //-----------------------------------------------------------
  public async findOne(
    findOptions: FindOptionsWhere<TokenEntity>,
  ): Promise<TokenEntity> {
    return this.tokensRepository.findOne({ where: findOptions });
  }

  //-----------------------------------------------------------
  public async find(
    findOptions: FindOptionsWhere<TokenEntity>,
  ): Promise<TokenEntity[]> {
    return this.tokensRepository.find({ where: findOptions });
  }

  //-----------------------------------------------------------
  public async getTokenForUserDevice(
    userId: string,
    fingerprint: string,
  ): Promise<TokenEntity> {
    return this.findOne({ userId, fingerprint });
  }

  //-----------------------------------------------------------
  public async getManyTokensForUserDevice(
    userId: string,
    fingerprint: string,
  ): Promise<TokenEntity[]> {
    return this.find({ userId, fingerprint });
  }

  //-------------------------------------------------------------
  public async saveToken(
    userId: string,
    value: string,
    fingerprint: string,
  ): Promise<void> {
    const encryptionToken = await this.encryptionService.encrypt(value);

    const hashedEncryptionToken = bcrypt.hashSync(
      encryptionToken,
      this.saltRounds,
    );

    const userDeviceToken = await this.getTokenForUserDevice(
      userId,
      fingerprint,
    );

    if (!userDeviceToken) {
      await this.tokensRepository.save({
        userId: userId,
        value: value,
        fingerprint,
      });
    } else {
      await this.tokensRepository.save({
        id: userDeviceToken.id,
        value: hashedEncryptionToken,
      });
    }
  }

  //-------------------------------------------------------------
  public async validateToken(
    userId: string,
    value: string,
    fingerprint: string,
  ): Promise<boolean> {
    const userDeviceTokens = await this.getManyTokensForUserDevice(
      userId,
      fingerprint,
    );

    const encryptToken = await this.encryptionService.encrypt(value);

    const validToken = userDeviceTokens.find((token) => {
      return bcrypt.compareSync(encryptToken, token.value);
    });

    if (!validToken) {
      return false;
    }

    return true;
  }
}
