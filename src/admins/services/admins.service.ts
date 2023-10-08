import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthService } from '../../auth/services/auth.service.js';
import { MailService } from '../../mail/services/mail.service.js';
import { UsersService } from '../../users/services/users.service.js';
import { ADMIN_NOT_FOUND } from '../../common/errors/errors.constants.js';

@Injectable()
export class AdminsService {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
  ) {}

  //----------------------------------------------------------
  public async sendPasswordRecoveryEmail(login: string): Promise<void> {
    const admin = await this.usersService.findAdminByLogin(login);

    if (!admin) throw new NotFoundException(ADMIN_NOT_FOUND);

    const recoveryToken = await this.authService.createRecoveryToken(
      admin.id,
      admin.login,
      admin.roles,
    );

    await this.mailService.sendMail({
      to: login,
      subject: recoveryToken,
      template: 'шаблон',

      data: {
        recoveryToken: recoveryToken,
      },
    });
  }
}
