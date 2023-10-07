import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import config from '../../config/config.js';
import { EntrancesService } from '../../entrances/services/entrances.service.js';
import { SettingСompletionEntranceDto } from '../dto/setting-completion-entrance.dto.js';
import {
  WsIncomingUserEvent,
  WsOutgoingUserEvent,
} from '../enums/ws-user-events.enum.js';
import { WsGuard } from '../../auth/guards/ws.guard.js';
import { WsRoleGuard } from '../guards/ws-role.guard.js';
import { Role } from '../enums/role.enum.js';

@UsePipes(new ValidationPipe())
@WebSocketGateway(config.WS_PORT, { cors: { origin: '*' } })
export class UsersGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly entrancesService: EntrancesService) {}

  @WebSocketServer() server: Server;

  handleDisconnect(client: Socket) {
    console.log(`Disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Connected ${client.id}`);
  }

  //----------------------------------------------------------
  @UseGuards(WsRoleGuard([Role.user, Role.admin], [Role.guest]))
  @UseGuards(WsGuard)
  @SubscribeMessage(WsIncomingUserEvent.SETTING_СOMPLETION_ENTRANCE)
  async settingСompletionEntrance(
    @MessageBody() dto: SettingСompletionEntranceDto,
  ): Promise<void> {
    const entranceStatus =
      await this.entrancesService.settingСompletionEntrance(dto);

    this.server.emit(
      WsOutgoingUserEvent.SETTING_СOMPLETION_ENTRANCE,
      entranceStatus,
    );
  }
}
