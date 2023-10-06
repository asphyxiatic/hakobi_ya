import {
  ConnectedSocket,
  MessageBody,
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { AuthService } from '../services/auth.service.js';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsRoleGuard } from '../../users/guards/ws-role.guard.js';
import { Role } from '../../users/enums/role.enum.js';
import { WsGuard } from '../guards/ws.guard.js';
import { Server, Socket } from 'socket.io';
import { RegisterUserDto } from '../dto/create-user.dto.js';

@WebSocketGateway(80, {
  cors: { origin: '*' },
})
export class AuthGateway {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer() server: Server;

  @UsePipes(new ValidationPipe())
  @UseGuards(WsRoleGuard([Role.admin]))
  @UseGuards(WsGuard)
  @SubscribeMessage('register_user')
  async register(
    @MessageBody() { login }: RegisterUserDto,
    @ConnectedSocket() client: Socket,
  ): Promise<void> {
    const newUser = await this.authService.createUserWithGeneratedPassword(
      login,
    );

    client.emit('user_credentials', newUser);

    this.server.emit('user_listener', newUser.login);
  }
}
