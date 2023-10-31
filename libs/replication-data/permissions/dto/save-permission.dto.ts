import { IsArray, IsNotEmpty, IsString } from '../../../i18n-class-validator';

export default class SavePermissionDTO {
  @IsNotEmpty()
  @IsString()
  role_id: string;

  @IsNotEmpty()
  @IsArray()
  permissions: string[];
}
