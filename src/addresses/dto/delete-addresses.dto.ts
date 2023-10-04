import { IsArray, IsDefined, IsUUID } from 'class-validator';

export class DeleteAddressesDto {
  @IsArray()
  @IsUUID('4', { each: true })
  @IsDefined()
  addressIds: string[];
}
