import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class CreateHouseDto {
  @IsUUID()
  @IsNotEmpty()
    streetId!: string;

  @IsString()
  @IsNotEmpty()
    houseName!: string;

  @IsInt()
  @Min(1)
  @IsPositive()
  @Max(40)
  @IsNotEmpty()
    quantityEntrances!: number;
}
