import { IsNotEmpty, IsUUID } from 'class-validator';

export class EnableActivityUserDto {
  @IsUUID()
  @IsNotEmpty()
  userId!: string;
}
