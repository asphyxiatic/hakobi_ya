import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStreetDto {
  @IsString()
  @IsNotEmpty()
  nameStreet!: string;
}
