import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteHousesDto {
  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
    houseIds!: string[];
}
