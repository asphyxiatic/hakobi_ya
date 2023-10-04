import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { UserCredentials } from '../interfaces/user-credentials.interface.js';
import { UserRole } from '../types/user-roles.js';

@Injectable()
export class UsersService {
  private readonly saltRounds = 5;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  //-------------------------------------------------------------
  public async create(
    createOptions: UserCredentials & { role: UserRole },
  ): Promise<UserEntity> {
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
  public async isAdmin(userId: string): Promise<boolean> {
    const user = await this.findById(userId);

    if (!user || user.role != 'admin') {
      return false;
    }

    return true;
  }

  //-------------------------------------------------------------
  public async findById(userId: string) {
    return this.findOneUser({ id: userId });
  }

  // //-------------------------------------------------------------
  public async findByLogin(login: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { login: login } });
  }

  // -------------------------------------------------------------
  public async findUserForCredentials(
    credentials: UserCredentials,
  ): Promise<UserEntity> {
    const user = await this.findByLogin(credentials.login);

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
