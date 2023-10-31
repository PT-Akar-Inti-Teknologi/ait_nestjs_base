import { IsNotEmpty, IsString } from '../../../i18n-class-validator';

export default class DeletePermissionDTO {
  @IsNotEmpty()
  @IsString()
  role_id: string;
}
