import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserCredentials } from '../interfaces/user-credentials.interface.js';
import { CreateUserOptions } from '../interfaces/create-user-options.interface.js';
import { UserEntity } from '../entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeleteUsersOptions } from '../interfaces/delete-user-options.interface.js';

@Injectable()
export class UsersService {
  private readonly saltRounds = 5;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  //-------------------------------------------------------------
  public async findOne(whereOptions: Partial<UserEntity>) {
    return this.usersRepository.findOne({ where: whereOptions });
  }

  //-------------------------------------------------------------
  public async findById(userId: UserEntity['id']) {
    return this.findOne({ id: userId });
  }

  //-------------------------------------------------------------
  public async findByLogin(login: UserEntity['id']): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { login: login } });
  }

  //-------------------------------------------------------------
  public async create(createOptions: CreateUserOptions): Promise<UserEntity> {
    try {
      const hashedPassword = bcrypt.hashSync(
        createOptions.password,
        this.saltRounds,
      );

      const newUser = await this.usersRepository.save({
        ...createOptions,
        password: hashedPassword,
      });

      return newUser;
    } catch (error: any) {
      throw new InternalServerErrorException(
        '🚨 ошибка сохранения пользователя в базу данных!',
      );
    }
  }

  // -------------------------------------------------------------
  public async delete({ userIds }: DeleteUsersOptions): Promise<void> {
    try {
      await this.usersRepository.delete(userIds);
    } catch (error: any) {
      throw new InternalServerErrorException(
        '🚨 не удалось удалить пользователей!',
      );
    }
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

  // -------------------------------------------------------------
  public async isUserExist(userId: UserEntity['id']): Promise<boolean> {
    return !!this.findById(userId);
  }

  // -------------------------------------------------------------
  public async enableActivityUser(userId: UserEntity['id']): Promise<void> {
    await this.usersRepository.save({ id: userId, active: true });
  }

  // -------------------------------------------------------------
  public async disableActivityUser(userId: UserEntity['id']): Promise<void> {
    await this.usersRepository.save({ id: userId, active: false });
  }
}
