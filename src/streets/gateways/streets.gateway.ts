import {
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { StreetsService } from '../services/streets.service.js';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsRoleGuard } from '../../users/guards/ws-role.guard.js';
import { Role } from '../../users/enums/role.enum.js';
import { WsGuard } from '../../auth/guards/ws.guard.js';
import { CreateStreetDto } from '../dto/create-street.dto.js';
import { UserFromJwt } from '../../auth/interfaces/user-from-jwt.interface.js';
import { GetCurrentWsUser } from '../../common/decorators/get-current-ws-user.decorator.js';
import { Server } from 'socket.io';

@WebSocketGateway(80, {
  cors: { origin: '*' },
})
export class StreetsGateway {
  constructor(private readonly streetsService: StreetsService) {}

  @WebSocketServer() server: Server;

  @UsePipes(new ValidationPipe())
  @UseGuards(WsRoleGuard([Role.admin]))
  @UseGuards(WsGuard)
  @SubscribeMessage('create_street')
  async addStreet(
    @MessageBody() dto: CreateStreetDto,
    @GetCurrentWsUser() user: UserFromJwt,
  ): Promise<void> {
    const newStreet = await this.streetsService.create({
      ownerId: user.id,
      ...dto,
    });

    this.server.emit('street_listener', newStreet);
  }
}
