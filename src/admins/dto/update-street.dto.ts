import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateStreetsDto {
  @IsUUID()
  @IsNotEmpty()
  streetId!: string;

  @IsString()
  @IsNotEmpty()
  nameStreet!: string;
}
