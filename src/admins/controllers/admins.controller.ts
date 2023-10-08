import { Body, Controller, Post } from '@nestjs/common';
import { AdminsService } from '../services/admins.service.js';
import { SendPasswordRecoveryEmailDto } from '../dto/send-password-recovery-email.dto.js';

@Controller('admins')
export class AdminsController {
  constructor(private readonly adminsService: AdminsService) {}

  @Post('send-password-recovery-email')
  async sendPasswordRecoveryEmail(
    @Body() { login }: SendPasswordRecoveryEmailDto,
  ) {
    return this.adminsService.sendPasswordRecoveryEmail(login);
  }
}
