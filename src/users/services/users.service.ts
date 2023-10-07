import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserCredentials } from '../interfaces/user-credentials.interface.js';
import { CreateUserOptions } from '../interfaces/create-user-options.interface.js';
import { UserEntity } from '../entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { DeleteUsersOptions } from '../interfaces/delete-user-options.interface.js';
import { Role } from '../enums/role.enum.js';
import { UpdateUserOptions } from '../interfaces/update-user-options.interface.js';

@Injectable()
export class UsersService {
  private readonly saltRounds = 5;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  //-------------------------------------------------------------
  public async getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  //-------------------------------------------------------------
  public async findOne(findOptions: FindOptionsWhere<UserEntity>) {
    return this.usersRepository.findOne({ where: findOptions });
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
  public async update({
    userId,
    login,
  }: UpdateUserOptions): Promise<UserEntity> {
    const user = await this.findById(userId);
    if (!user) {
      throw new NotFoundException('🚨 не удалось найти пользователя!');
    }

    return this.usersRepository.save({ id: user.id, login: login });
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
  public async isUserExist(
    userId: UserEntity['id'],
    roles: Role[],
  ): Promise<boolean> {
    const user = await this.findOne({ id: userId });

    if (!user) {
      return false;
    }

    const rolesMatch = user.roles.every((role) => roles.includes(role));

    return rolesMatch;
  }

  // -------------------------------------------------------------
  public async enableActivityUser(userId: UserEntity['id']): Promise<void> {
    const user = await this.findById(userId);

    if (user) {
      throw new NotFoundException('🚨 не удалось найти пользователя!');
    }

    let userRoles = user.roles;

    if (userRoles.includes(Role.guest)) {
      userRoles = userRoles.filter((role) => role !== Role.guest);

      await this.usersRepository.save({
        id: userId,
        roles: userRoles,
      });
    }
  }

  // -------------------------------------------------------------
  public async disableActivityUser(userId: UserEntity['id']): Promise<void> {
    const user = await this.findById(userId);

    if (user) {
      throw new NotFoundException('🚨 не удалось найти пользователя!');
    }

    const userRoles = user.roles;

    if (!userRoles.includes(Role.guest)) {
      userRoles.push(Role.guest);

      await this.usersRepository.save({
        id: userId,
        roles: userRoles,
      });
    }
  }
}
