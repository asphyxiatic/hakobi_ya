import { IsArray, IsNotEmpty, IsUUID } from 'class-validator';

export class DeleteUsersDto {
  @IsUUID('4', { each: true })
  @IsArray()
  @IsNotEmpty()
  userIds: string[];
}
