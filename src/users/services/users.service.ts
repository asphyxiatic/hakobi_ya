import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../entities/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Role } from '../enums/role.enum.js';
import {
  FAILED_REMOVE_USERS,
  USER_NOT_FOUND,
} from '../../common/errors/errors.constants.js';
import { UsersResponse } from '../interfaces/users-response.inteface.js';

@Injectable()
export class UsersService {
  private readonly saltRounds = 5;

  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  //-------------------------------------------------------------
  public async getAllUsers(): Promise<UsersResponse[]> {
    return this.usersRepository.find({
      select: ['id', 'login', 'online', 'roles'],
      order: {
        createdAt: 'DESC',
      },
    });
  }

  //-------------------------------------------------------------
  public async findOne(
    findOptions: FindOptionsWhere<UserEntity>,
  ): Promise<UsersResponse | undefined> {
    return this.usersRepository.findOne({
      where: findOptions,
      select: ['id', 'login', 'online', 'roles'],
    });
  }

  public async findOneWithPassword(
    findOptions: FindOptionsWhere<UserEntity>,
  ): Promise<(UsersResponse & { password: string }) | undefined> {
    return this.usersRepository.findOne({
      where: findOptions,
      select: ['id', 'login', 'online', 'roles', 'password'],
    });
  }

  //-------------------------------------------------------------
  public async saveAndSelect(
    saveOptions: Partial<UserEntity>,
  ): Promise<UsersResponse> {
    const savedUser = await this.usersRepository.save(saveOptions);

    return this.findOne({ id: savedUser.id });
  }

  //-------------------------------------------------------------
  public async findById(userId: string): Promise<UsersResponse | undefined> {
    return this.findOne({ id: userId });
  }

  //-------------------------------------------------------------
  public async findByLogin(login: string): Promise<UsersResponse | undefined> {
    return this.usersRepository.findOne({ where: { login: login } });
  }

  //-------------------------------------------------------------
  public async findAdminByLogin(
    login: string,
  ): Promise<UsersResponse | undefined> {
    const user = await this.findOne({ login: login });

    if (user?.roles.includes(Role.admin)) {
      return user;
    }

    return undefined;
  }

  //-------------------------------------------------------------
  public async create(login: string, password: string): Promise<UsersResponse> {
    const hashedPassword = bcrypt.hashSync(password, this.saltRounds);

    return await this.saveAndSelect({
      login: login,
      password: hashedPassword,
    });
  }

  // -------------------------------------------------------------
  public async updateLogin(
    userId: string,
    login: string,
  ): Promise<UsersResponse> {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    return await this.saveAndSelect({
      id: user.id,
      login: login,
    });
  }

  public async updatePassword(
    userId: string,
    password: string,
  ): Promise<UsersResponse> {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    const hashedPassword = bcrypt.hashSync(password, this.saltRounds);

    return this.saveAndSelect({ id: user.id, password: hashedPassword });
  }

  // -------------------------------------------------------------
  public async delete(userIds: string[]): Promise<void> {
    try {
      await this.usersRepository.delete(userIds);
    } catch (error: any) {
      throw new InternalServerErrorException(FAILED_REMOVE_USERS);
    }
  }

  // -------------------------------------------------------------
  public async findUserForCredentials(
    login: string,
    password: string,
  ): Promise<UsersResponse | undefined> {
    const user = await this.findOneWithPassword({ login: login });

    if (!user || !bcrypt.compareSync(password, user.password)) return undefined;

    return user;
  }

  // -------------------------------------------------------------
  public async setRecoveryToken(
    userId: string,
    recoveryToken: string,
  ): Promise<void> {
    await this.usersRepository.save({
      id: userId,
      recoveryToken: recoveryToken,
    });
  }

  // -------------------------------------------------------------
  public async isValidUser(userId: string, roles: Role[]): Promise<boolean> {
    const user = await this.findOne({ id: userId });

    const rolesMatch = user.roles.every((role) => roles.includes(role));

    if (user && rolesMatch) return true;

    return false;
  }

  // -------------------------------------------------------------
  public async setOnlineStatus(
    userId: string,
    onlineStatus: boolean,
  ): Promise<UsersResponse> {
    return await this.saveAndSelect({
      id: userId,
      online: onlineStatus,
    });
  }

  // -------------------------------------------------------------
  public async enableActivityUser(userId: string): Promise<UsersResponse> {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    let userRoles: Role[] = user.roles;

    if (userRoles.includes(Role.guest)) {
      userRoles = userRoles.filter(
        (role) => role !== Role.guest && role !== Role.user,
      );

      userRoles.push(Role.user);

      return this.saveAndSelect({
        id: userId,
        roles: userRoles,
      });
    }
  }

  // -------------------------------------------------------------
  public async disableActivityUser(userId: string): Promise<UsersResponse> {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    let userRoles = user.roles;

    if (!userRoles.includes(Role.guest)) {
      userRoles = userRoles.filter(
        (role) => role !== Role.user && role !== Role.guest,
      );

      userRoles.push(Role.guest);

      return this.saveAndSelect({
        id: userId,
        roles: userRoles,
      });
    }
  }
}
