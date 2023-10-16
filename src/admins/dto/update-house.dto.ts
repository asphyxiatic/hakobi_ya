import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';

export class UpdateHouseDto {
  @IsUUID()
  @IsNotEmpty()
    houseId!: string;

  @IsString()
  @IsOptional()
    houseName?: string;

  @IsInt()
  @Min(1)
  @IsPositive()
  @Max(40)
  @IsOptional()
    quantityEntrances?: number;
}
