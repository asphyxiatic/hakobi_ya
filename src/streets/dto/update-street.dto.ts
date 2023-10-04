import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateStreetDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}
