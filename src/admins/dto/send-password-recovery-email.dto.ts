import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendPasswordRecoveryEmailDto {
  @IsEmail()
  @IsNotEmpty()
  login!: string;
}
