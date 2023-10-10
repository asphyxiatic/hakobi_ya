import { IsNotEmpty, IsUUID } from 'class-validator';

export class DisableActivityUserDto {
  @IsUUID()
  @IsNotEmpty()
    userId!: string;
}
