import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import config from '../../config/config.js';
import { EntrancesService } from '../../entrances/services/entrances.service.js';
import { SettingСompletionEntranceDto } from '../dto/setting-completion-entrance.dto.js';
import {
  WsIncomingUserEvent,
  WsOutgoingUserEvent,
} from '../enums/ws-user-events.enum.js';
import { WsAtGuard } from '../../auth/guards/ws-at.guard.js';
import { WsRoleGuard } from '../guards/ws-role.guard.js';
import { Role } from '../enums/role.enum.js';
import { AuthService } from '../../auth/services/auth.service.js';
import { UsersService } from '../services/users.service.js';
import { UNAUTHORIZED_RESOURCE } from '../../common/errors/errors.constants.js';

@UsePipes(new ValidationPipe())
@WebSocketGateway(config.WS_PORT, { cors: { origin: '*' } })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly entrancesService: EntrancesService,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer() server: Server;

  async handleDisconnect(client: Socket) {
    const token = client.handshake.query.bearerToken as string;

    const disconnectingUser = await this.authService.validateAtToken(token);

    const userOnlineStatus = await this.usersService.setOnlineStatus(
      disconnectingUser.userId,
      false,
    );

    console.log(
      `Disconnect ${userOnlineStatus.login}, online_status: ${userOnlineStatus.online}`,
    );

    this.server.emit(WsOutgoingUserEvent.USER_ONLINE_STATUS, userOnlineStatus);
  }

  async handleConnection(client: Socket) {
    try {
      const token = client.handshake.query.bearerToken as string;

      const joinedUser = await this.authService.validateAtToken(token);

      const userOnlineStatus = await this.usersService.setOnlineStatus(
        joinedUser.userId,
        true,
      );

      console.log(
        `Connection ${userOnlineStatus.login}, online_status: ${
          userOnlineStatus.online
        }, roles: ${userOnlineStatus.roles.join(', ')}`,
      );

      this.server.emit(
        WsOutgoingUserEvent.USER_ONLINE_STATUS,
        userOnlineStatus,
      );
    } catch (error: any) {
      client.disconnect();
    }
  }

  //----------------------------------------------------------
  @UseGuards(WsRoleGuard([Role.user, Role.admin], [Role.guest]))
  @UseGuards(WsAtGuard)
  @SubscribeMessage(WsIncomingUserEvent.SETTING_СOMPLETION_ENTRANCE)
  async settingСompletionEntrance(
    @MessageBody()
    { houseId, numberEntrance, complete }: SettingСompletionEntranceDto,
  ): Promise<void> {
    const entranceStatus =
      await this.entrancesService.settingСompletionEntrance(
        houseId,
        numberEntrance,
        complete,
      );

    this.server.emit(
      WsOutgoingUserEvent.SETTING_СOMPLETION_ENTRANCE,
      entranceStatus,
    );
  }
}
