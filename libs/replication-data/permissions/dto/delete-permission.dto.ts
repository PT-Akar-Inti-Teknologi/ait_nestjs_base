import { IsNotEmpty, IsString } from '../../../i18n-class-validator';

export class DeletePermissionDTO {
  @IsNotEmpty()
  @IsString()
  role_id: string;
}
