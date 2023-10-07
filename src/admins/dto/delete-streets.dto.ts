import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteStreetsDto {
  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
  streetIds!: string[];
}
