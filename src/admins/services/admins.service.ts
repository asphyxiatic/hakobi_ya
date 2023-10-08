import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service.js';
import { MailService } from '../../mail/services/mail.service.js';
import { UsersService } from '../../users/services/users.service.js';
import { ADMIN_NOT_FOUND } from '../../common/errors/errors.constants.js';
import { join } from 'path';
import { MailTemplates } from '../../mail/enums/mail-templates.enums.js';

@Injectable()
export class AdminsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  //----------------------------------------------------------
  public async sendPasswordResetEmail(login: string): Promise<void> {
    const admin = await this.usersService.findAdminByLogin(login);

    if (!admin) throw new NotFoundException(ADMIN_NOT_FOUND);

    const recoveryToken = await this.authService.createRecoveryToken(
      admin.id,
      admin.login,
      admin.roles,
    );

    await this.mailService.sendMail({
      to: login,
      subject: 'Восстановление пароля',
      template: MailTemplates.RESET_PASSWORD,
      data: {
        login: admin.login,
        recoveryToken: recoveryToken,
      },
    });
  }
}
