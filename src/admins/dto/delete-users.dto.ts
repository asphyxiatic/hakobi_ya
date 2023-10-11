import { ArrayMinSize, IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteUsersDto {
  @IsUUID('4', { each: true })
  @IsArray({})
  @ArrayMinSize(1)
  @IsNotEmpty()
    userIds!: string[];
}
