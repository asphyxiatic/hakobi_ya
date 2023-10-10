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
  FAILED_SAVE_USER,
  USER_NOT_FOUND,
} from '../../common/errors/errors.constants.js';
import { UpdateLoginResponse } from '../interfaces/update-login-response.interface.js';
import { SetOnlineStatusResponse } from '../interfaces/set-online-status-response.interface.js';

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
  public async findOne(
    findOptions: FindOptionsWhere<UserEntity>,
  ): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: findOptions });
  }

  //-------------------------------------------------------------
  public async saveAndGet(
    saveOptions: Partial<UserEntity>,
  ): Promise<UserEntity> {
    const savedUser = await this.usersRepository.save(saveOptions);

    return this.findOne({ id: savedUser.id });
  }

  //-------------------------------------------------------------
  public async findById(userId: string): Promise<UserEntity> {
    return this.findOne({ id: userId });
  }

  //-------------------------------------------------------------
  public async findByLogin(login: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { login: login } });
  }

  //-------------------------------------------------------------
  public async findAdminByLogin(login: string): Promise<UserEntity> {
    const user = await this.findOne({ login: login });

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    const isAdmin = user.roles.includes(Role.admin);

    if (!isAdmin) return undefined;

    return user;
  }

  //-------------------------------------------------------------
  public async create(login: string, password: string): Promise<UserEntity> {
    try {
      const hashedPassword = bcrypt.hashSync(password, this.saltRounds);

      const newUser = await this.saveAndGet({
        login: login,
        password: hashedPassword,
      });

      return newUser;
    } catch (error: any) {
      throw new InternalServerErrorException(FAILED_SAVE_USER);
    }
  }

  // -------------------------------------------------------------
  public async updateLogin(
    userId: string,
    login: string,
  ): Promise<UpdateLoginResponse> {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    const updatedUser = await this.usersRepository.save({
      id: user.id,
      login: login,
    });

    return {
      id: updatedUser.id,
      login: updatedUser.login,
    };
  }

  public async updatePassword(
    userId: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    const hashedPassword = bcrypt.hashSync(password, this.saltRounds);

    return this.usersRepository.save({ id: user.id, password: hashedPassword });
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
  ): Promise<UserEntity> {
    const user = await this.findByLogin(login);

    if (!user) return undefined;

    const passwordIsValid = bcrypt.compareSync(password, user.password);

    if (!passwordIsValid) return undefined;

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
  public async isUserExist(userId: string, roles: Role[]): Promise<boolean> {
    const user = await this.findOne({ id: userId });

    if (!user) return false;

    const rolesMatch = user.roles.every((role) => roles.includes(role));

    const isUserExist = user && rolesMatch;

    return isUserExist;
  }

  // -------------------------------------------------------------
  public async setOnlineStatus(
    userId: string,
    onlineStatus: boolean,
  ): Promise<SetOnlineStatusResponse> {
    const updatedUser = await this.saveAndGet({
      id: userId,
      online: onlineStatus,
    });

    return {
      id: updatedUser.id,
      login: updatedUser.login,
      online: updatedUser.online,
      roles: updatedUser.roles,
    };
  }

  // -------------------------------------------------------------
  public async enableActivityUser(userId: string): Promise<void> {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    let userRoles = user.roles;

    if (userRoles.includes(Role.guest)) {
      userRoles = userRoles.filter((role) => role !== Role.guest);

      userRoles.push(Role.user);

      await this.usersRepository.save({
        id: userId,
        roles: userRoles,
      });
    }
  }

  // -------------------------------------------------------------
  public async disableActivityUser(userId: string): Promise<void> {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    let userRoles = user.roles;

    if (!userRoles.includes(Role.guest)) {
      userRoles = userRoles.filter((role) => role !== Role.user);

      userRoles.push(Role.guest);

      await this.usersRepository.save({
        id: userId,
        roles: userRoles,
      });
    }
  }
}
