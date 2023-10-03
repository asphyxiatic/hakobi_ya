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
  public async create(createOptions: Partial<UserEntity>): Promise<UserEntity> {
    const hashedPassword = bcrypt.hashSync(
      createOptions.password,
      this.saltRounds,
    );
    return this.usersRepository.save({
      ...createOptions,
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
  public async findUserForCredentials({
    email,
    password,
  }: UserCredentials): Promise<UserEntity> {
    const user = await this.findByEmail(email);

    if (!user) {
      return undefined;
    }

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) {
      return undefined;
    }

    return user;
  }
}
