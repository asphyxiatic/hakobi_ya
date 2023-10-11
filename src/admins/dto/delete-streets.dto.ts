import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteStreetsDto {
  @IsUUID('4', { each: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
    streetIds!: string[];
}
