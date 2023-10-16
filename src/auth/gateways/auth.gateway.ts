import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import config from '../../config/config';
import { WsOutgoingEvent } from '../enums/ws-events.enum';
import { UserFromJwt } from '../interfaces/user-from-jwt.interface';
import { AuthService } from '../services/auth.service';

interface UserSocket extends Socket {
  user: UserFromJwt;
}

@WebSocketGateway(config.WS_PORT, { cors: { origin: config.WS_CORS_ORIGIN } })
export class AuthGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer() server: Server;

  //-------------------------------------------------------------
  async handleConnection(socket: UserSocket) {
    const joinedUser = await this.authService.getUserFromSocket(socket);

    if (!joinedUser) {
      socket.disconnect(true);
      return;
    }

    socket.user = joinedUser;

    console.log(
      `Connection ${joinedUser.login}, roles: ${joinedUser.roles.join(', ')}`,
    );

    this.server.emit(WsOutgoingEvent.USER_ONLINE_STATUS, joinedUser.userId);
  }

  //-------------------------------------------------------------
  async handleDisconnect(socket: UserSocket) {
    socket.disconnect();

    const disconnectingUser = socket.user;

    if (!disconnectingUser) return;

    console.log(`Disconnect ${disconnectingUser.login}`);

    this.server.emit(
      WsOutgoingEvent.USER_OFFLINE_STATUS,
      disconnectingUser.userId,
    );
  }
}
