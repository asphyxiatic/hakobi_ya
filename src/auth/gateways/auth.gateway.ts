import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from '../services/auth.service';
import { UsersService } from '../../users/services/users.service';
import config from '../../config/config';
import { WsOutgoingEvent } from '../enums/ws-events.enum';
import { UNAUTHORIZED_RESOURCE } from '../../common/errors/errors.constants';

@WebSocketGateway(config.WS_PORT, { cors: { origin: '*' } })
export class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer() server: Server;

  //-------------------------------------------------------------
  async handleDisconnect(client: Socket) {
    const token = client.handshake.query.token as string;

    const disconnectingUser = await this.authService.validateAccessToken(token);

    if (!disconnectingUser) {
      return;
    }

    const userOnlineStatus = await this.usersService.setOnlineStatus(
      disconnectingUser.userId,
      false,
    );

    console.log(
      `Disconnect ${userOnlineStatus.login}, online_status: ${userOnlineStatus.online}`,
    );

    this.server.emit(WsOutgoingEvent.USER_ONLINE_STATUS, userOnlineStatus);
  }

  //-------------------------------------------------------------
  async handleConnection(client: Socket) {
    const token = client.handshake.query.token as string;

    const joinedUser = await this.authService.validateAccessToken(token);

    if (!joinedUser) {
      client.emit('error', { status: 401, message: UNAUTHORIZED_RESOURCE });
      client.disconnect(true);
      return;
    }

    const userOnlineStatus = await this.usersService.setOnlineStatus(
      joinedUser.userId,
      true,
    );

    console.log(
      `Connection ${userOnlineStatus.login}, online_status: ${
        userOnlineStatus.online
      }, roles: ${userOnlineStatus.roles.join(', ')}`,
    );

    this.server.emit(WsOutgoingEvent.USER_ONLINE_STATUS, userOnlineStatus);
  }
}
