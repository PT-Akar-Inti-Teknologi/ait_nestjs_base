import { IsNotEmpty, IsString, IsUUID } from '../../../i18n-class-validator';

export class DeleteAdminsUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  user_id: string;
}
