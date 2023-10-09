import { Body, Controller, Post } from '@nestjs/common';
import { AdminsService } from '../services/admins.service.js';
import { SendPasswordResetEmailDto } from '../dto/send-password-reset-email.dto.js';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('send-password-reset-email')
  async sendPasswordResetEmail(@Body() { login }: SendPasswordResetEmailDto) {
    return this.adminsService.sendPasswordResetEmail(login);
  }
}
