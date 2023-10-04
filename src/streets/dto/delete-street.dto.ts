import { IsArray, IsDefined, IsUUID } from 'class-validator';

export class DeleteStreetsDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @IsDefined()
  streetIds: string[];
}
