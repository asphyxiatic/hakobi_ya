import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
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

@UsePipes(new ValidationPipe())
@UseGuards(WsAtGuard)
@WebSocketGateway(config.WS_PORT, { cors: { origin: '*' } })
export class UsersGateway {
  constructor(private readonly entrancesService: EntrancesService) {}

  @WebSocketServer() server: Server;

  //----------------------------------------------------------
  @UseGuards(WsRoleGuard([Role.user, Role.admin], [Role.guest]))
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
