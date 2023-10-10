import {
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AuthService } from './auth/services/auth.service';
import { UsersService } from './users/services/users.service';
import config from './config/config';
import { WsOutgoingEvent } from './common/enums/ws-events.enum';

@WebSocketGateway(config.WS_PORT, { cors: { origin: '*' } })
export class AppGateway
implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @WebSocketServer() server: Server;

  //-------------------------------------------------------------
  afterInit(server: Server) {
    console.log(server);
  }

  //-------------------------------------------------------------
  async handleDisconnect(client: Socket) {
    const token = client.handshake.query.token as string;

    const disconnectingUser = await this.authService.validateAtToken(token);

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
    try {
      const token = client.handshake.query.token as string;

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

      this.server.emit(WsOutgoingEvent.USER_ONLINE_STATUS, userOnlineStatus);
    } catch (error: any) {
      client.disconnect();
    }
  }
}
