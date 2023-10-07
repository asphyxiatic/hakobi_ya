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
  public async findById(userId: string): Promise<UserEntity> {
    return this.findOne({ id: userId });
  }

  //-------------------------------------------------------------
  public async findByLogin(login: string): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: { login: login } });
  }

  //-------------------------------------------------------------
  public async create(login: string, password: string): Promise<UserEntity> {
    try {
      const hashedPassword = bcrypt.hashSync(password, this.saltRounds);

      const newUser = await this.usersRepository.save({
        login: login,
        password: hashedPassword,
      });

      return newUser;
    } catch (error: any) {
      throw new InternalServerErrorException(FAILED_SAVE_USER);
    }
  }

  // -------------------------------------------------------------
  public async update(userId: string, login: string): Promise<UserEntity> {
    const user = await this.findById(userId);

    if (!user) throw new NotFoundException(USER_NOT_FOUND);

    return this.usersRepository.save({ id: user.id, login: login });
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
  public async isUserExist(userId: string, roles: Role[]): Promise<boolean> {
    const user = await this.findOne({ id: userId });

    if (!user) return false;

    const rolesMatch = user.roles.every((role) => roles.includes(role));

    const isUserExist = user && rolesMatch;

    return isUserExist;
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
