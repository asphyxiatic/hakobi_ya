import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateHouseDto {
  @IsUUID()
  @IsNotEmpty()
  houseId!: string;

  @IsString()
  @IsOptional()
  houseName?: string;

  @IsInt()
  @IsOptional()
  quantityEntrances?: number;
}
