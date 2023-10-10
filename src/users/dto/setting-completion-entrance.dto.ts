import { IsBoolean, IsInt, IsNotEmpty, IsUUID } from 'class-validator';

export class SettingСompletionEntranceDto {
  @IsUUID()
  @IsNotEmpty()
    houseId: string;

  @IsInt()
  @IsNotEmpty()
    numberEntrance: number;

  @IsBoolean()
  @IsNotEmpty()
    complete: boolean;
}
