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
import { WsAtGuard } from '../../auth/guards/ws-at.guard.js';
import { WsRoleGuard } from '../../users/guards/ws-role.guard.js';
import {
  ForbiddenException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Role } from '../../users/enums/role.enum.js';
import { GetCurrentWsClient } from '../../common/decorators/get-current-ws-client.decorator.js';
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
import { UpdateStreetsDto } from '../dto/update-street.dto.js';
import { FORBIDDEN } from '../../common/errors/errors.constants.js';
import { RegisterUserWsEventResponse } from '../interfaces/register-user-ws-event-response.interface.js';

@UsePipes(new ValidationPipe())
@UseGuards(WsRoleGuard([Role.admin]))
@UseGuards(WsAtGuard)
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
  @SubscribeMessage(WsIncomingAdminEvent.CREATE_STREET)
  async createStreet(
    @MessageBody() { nameStreet }: CreateStreetDto,
  ): Promise<void> {
    const newStreet = await this.streetsService.create(nameStreet);

    this.server.emit(WsOutgoingAdminEvent.CREATE_STREET, newStreet);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.UPDATE_STREET)
  async updateStreets(
    @MessageBody() { streetId, nameStreet }: UpdateStreetsDto,
  ): Promise<void> {
    const updatedStreet = await this.streetsService.update(
      streetId,
      nameStreet,
    );

    this.server.emit(WsOutgoingAdminEvent.UPDATE_STREET, updatedStreet);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.DELETE_STREETS)
  async deleteStreets(
    @MessageBody() { streetIds }: DeleteStreetsDto,
  ): Promise<void> {
    await this.streetsService.delete(streetIds);

    this.server.emit(WsOutgoingAdminEvent.DELETE_STREETS, streetIds);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.CREATE_HOUSE)
  async createHouse(
    @MessageBody() { streetId, houseName, quantityEntrances }: CreateHouseDto,
  ): Promise<void> {
    const newHouse = await this.housesService.create(
      streetId,
      houseName,
      quantityEntrances,
    );

    this.server.emit(WsOutgoingAdminEvent.CREATE_HOUSE, newHouse);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.UPDATE_HOUSE)
  async updateHouses(@MessageBody() dto: UpdateHouseDto): Promise<void> {
    const updatedHouse = await this.housesService.update(dto);

    this.server.emit(WsOutgoingAdminEvent.UPDATE_HOUSE, updatedHouse);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.DELETE_HOUSES)
  async deleteHouses(
    @MessageBody() { houseIds }: DeleteHousesDto,
  ): Promise<void> {
    await this.housesService.delete(houseIds);

    this.server.emit(WsOutgoingAdminEvent.DELETE_HOUSES, houseIds);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.REGISTER_USER)
  async register(
    @MessageBody() { login }: RegisterUserDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const newUser = await this.authService.registerUser(login);

    client.emit(
      WsOutgoingAdminEvent.REGISTER_USER_CREDENTIALS,
      newUser.credentials,
    );

    const registerUser: RegisterUserWsEventResponse = {
      id: newUser.id,
      login: newUser.credentials.login,
    };

    this.server.emit(WsOutgoingAdminEvent.REGISTER_USER, registerUser);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.ENABLE_ACTIVITY_USER)
  async enableActivityUser(
    @MessageBody() { userId }: EnableActivityUserDto,
    @GetCurrentWsClient() user: UserFromJwt,
  ): Promise<void> {
    if (userId === user.userId) {
      throw new ForbiddenException(FORBIDDEN);
    }

    await this.usersService.enableActivityUser(userId);

    this.server.emit(WsOutgoingAdminEvent.ENABLE_ACTIVITY_USER, userId);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.DISABLE_ACTIVITY_USER)
  async disableActivityUser(
    @MessageBody() { userId }: DisableActivityUserDto,
    @GetCurrentWsClient() user: UserFromJwt,
  ): Promise<void> {
    if (userId === user.userId) {
      throw new ForbiddenException(FORBIDDEN);
    }

    await this.usersService.disableActivityUser(userId);

    this.server.emit(WsOutgoingAdminEvent.DISABLE_ACTIVITY_USER, userId);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.UPDATE_USER)
  async updateUser(
    @MessageBody() { userId, login }: UpdateUserDto,
    @GetCurrentWsClient() user: UserFromJwt,
  ): Promise<void> {
    if (userId === user.userId) {
      throw new ForbiddenException(FORBIDDEN);
    }

    const updatedUser = await this.usersService.updateLogin(userId, login);

    this.server.emit(WsOutgoingAdminEvent.UPDATE_USER, updatedUser);
  }

  //----------------------------------------------------------
  @SubscribeMessage(WsIncomingAdminEvent.DELETE_USER)
  async deleteUsers(
    @MessageBody() { userIds }: DeleteUsersDto,
    @GetCurrentWsClient() user: UserFromJwt,
  ): Promise<void> {
    const userIdsForDelete = userIds.filter((userId) => userId !== user.userId);

    await this.usersService.delete(userIdsForDelete);

    this.server.emit(WsOutgoingAdminEvent.DELETE_USER, userIds);
  }
}
