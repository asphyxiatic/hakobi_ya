import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteHousesDto {
  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
    houseIds!: string[];
}
