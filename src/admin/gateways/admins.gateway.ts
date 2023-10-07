import {
  ConnectedSocket,
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { AuthService } from '../../auth/services/auth.service.js';
import { Server, Socket } from 'socket.io';
import { RegisterUserDto } from '../dto/register-user.dto.js';
import { WsGuard } from '../../auth/guards/ws.guard.js';
import { WsRoleGuard } from '../../users/guards/ws-role.guard.js';
import {
  ForbiddenException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from '../../users/enums/role.enum.js';
import { GetCurrentWsUser } from '../../common/decorators/get-current-ws-user.decorator.js';
import { CreateStreetDto } from '../dto/create-street.dto.js';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';
import { StreetsService } from '../../streets/services/streets.service.js';
import {
  WsIncomingAdminEvent,
  WsOutgoingAdminEvent,
} from '../enums/ws-admin-events.enum.js';
import { DeleteStreetsDto } from '../dto/delete-streets.dto.js';
import { CreateHouseDto } from '../dto/create-house.dto.js';
import { HousesService } from '../../houses/services/houses.service.js';
import { DeleteHousesDto } from '../dto/delete-houses.dto.js';
import { UpdateHouseDto } from '../dto/update-house.dto.js';
import config from '../../config/config.js';
import { UsersService } from '../../users/services/users.service.js';
import { EnableActivityUserDto } from '../dto/enable-activity-user.dto.js';
import { DisableActivityUserDto } from '../dto/disable-activity-user.dto.js';
import { UpdateUserDto } from '../dto/update-user.dto.js';
import { DeleteUsersDto } from '../dto/delete-users.dto.js';

@UsePipes(new ValidationPipe())
@UseGuards(WsRoleGuard([Role.admin]))
@UseGuards(WsGuard)
@WebSocketGateway(config.WS_PORT, { cors: { origin: '*' } })
export class AdminsGateway {
  constructor(
    private readonly authService: AuthService,
    private readonly streetsService: StreetsService,
    private readonly housesService: HousesService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer() server: Server;

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.REGISTER_USER)
  async register(
    @MessageBody() { login }: RegisterUserDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const newUser = await this.authService.createUserWithGeneratedPassword(
      login,
    );

    client.emit(WsOutgoingAdminEvent.REGISTER_USER_CREDENTIALS, newUser);

    this.server.emit(WsOutgoingAdminEvent.REGISTER_USER, newUser.login);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.CREATE_STREET)
  async addStreet(
    @MessageBody() { nameStreet }: CreateStreetDto,
    @GetCurrentWsUser() user: UserFromJwt,
  ): Promise<void> {
    const newStreet = await this.streetsService.create({
      ownerId: user.id,
      nameStreet: nameStreet,
    });

    this.server.emit(WsOutgoingAdminEvent.CREATE_STREET, newStreet);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.DELETE_STREETS)
  async deleteStreets(
    @MessageBody() { streetIds }: DeleteStreetsDto,
  ): Promise<void> {
    await this.streetsService.delete({
      streetIds: streetIds,
    });

    this.server.emit(WsOutgoingAdminEvent.DELETE_STREETS, streetIds);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.CREATE_HOUSE)
  async createHouse(@MessageBody() dto: CreateHouseDto): Promise<void> {
    const newHouse = await this.housesService.create(dto);

    this.server.emit(WsOutgoingAdminEvent.CREATE_HOUSE, newHouse);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.DELETE_HOUSES)
  async deleteHouses(
    @MessageBody() { houseIds }: DeleteHousesDto,
  ): Promise<void> {
    await this.housesService.delete({ houseIds: houseIds });

    this.server.emit(WsOutgoingAdminEvent.DELETE_HOUSES, houseIds);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.UPDATE_HOUSE)
  async updateHouses(@MessageBody() dto: UpdateHouseDto): Promise<void> {
    const updatedHouse = await this.housesService.update(dto);

    this.server.emit(WsOutgoingAdminEvent.UPDATE_HOUSE, updatedHouse);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.ENABLE_ACTIVITY_USER)
  async enableActivityUser(
    @MessageBody() { userId }: EnableActivityUserDto,
    @GetCurrentWsUser() user: UserFromJwt,
  ): Promise<void> {
    if (userId === user.id) {
      throw new ForbiddenException();
    }

    await this.usersService.enableActivityUser(userId);

    this.server.emit(WsOutgoingAdminEvent.ENABLE_ACTIVITY_USER, userId);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.DISABLE_ACTIVITY_USER)
  async disableActivityUser(
    @MessageBody() { userId }: DisableActivityUserDto,
    @GetCurrentWsUser() user: UserFromJwt,
  ): Promise<void> {
    if (userId === user.id) {
      throw new ForbiddenException();
    }

    await this.usersService.disableActivityUser(userId);

    this.server.emit(WsOutgoingAdminEvent.DISABLE_ACTIVITY_USER, userId);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.UPDATE_USER)
  async updateUser(
    @MessageBody() dto: UpdateUserDto,
    @GetCurrentWsUser() user: UserFromJwt,
  ): Promise<void> {
    if (dto.userId === user.id) {
      throw new ForbiddenException();
    }

    const updatedUser = await this.usersService.update(dto);

    this.server.emit(WsOutgoingAdminEvent.UPDATE_USER, updatedUser);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.DELETE_USER)
  async deleteUsers(
    @MessageBody() { userIds }: DeleteUsersDto,
    @GetCurrentWsUser() user: UserFromJwt,
  ): Promise<void> {
    const userIdsForDelete = userIds.filter((userId) => userId !== user.id);

    await this.usersService.delete({ userIds: userIdsForDelete });

    this.server.emit(WsOutgoingAdminEvent.DELETE_USER, userIds);
  }
}
