import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserCredentials } from '../interfaces/user-credentials.interface.js';

@Injectable()
export class UsersService {
  private readonly saltRounds = 5;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  //-------------------------------------------------------------
  public async create(credentials: UserCredentials): Promise<UserEntity> {
    const hashedPassword = bcrypt.hashSync(
      credentials.password,
      this.saltRounds,
    );
    return this.usersRepository.save({
      ...credentials,
      password: hashedPassword,
    });
  }

  //-------------------------------------------------------------
  public async findOneUser(whereOptions: Partial<UserEntity>) {
    return this.usersRepository.findOne({ where: whereOptions });
  }

  //-------------------------------------------------------------
  public async findByEmail(email: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  //-------------------------------------------------------------
  public async findUserForCredentials(
    credentials: UserCredentials,
  ): Promise<UserEntity> {
    const user = await this.findByEmail(credentials.email);

    if (!user) {
      return undefined;
    }

    const passwordIsValid = bcrypt.compareSync(
      credentials.password,
      user.password,
    );

    if (!passwordIsValid) {
      return undefined;
    }

    return user;
  }
}
