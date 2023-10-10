import { IsInt, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateHouseDto {
  @IsUUID()
  @IsNotEmpty()
    streetId!: string;

  @IsString()
  @IsNotEmpty()
    houseName!: string;

  @IsInt()
  @IsNotEmpty()
    quantityEntrances!: number;
}
