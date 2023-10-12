import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { WsException } from '@nestjs/websockets';

@Catch(HttpException, WsException)
export class WebSocketExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException | WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const response = exception.getResponse() as { message: string };
      client.emit('error', { status, message: response.message });
    } else if (exception instanceof WsException) {
      client.emit('error', { message: exception.message });
    }
  }
}
