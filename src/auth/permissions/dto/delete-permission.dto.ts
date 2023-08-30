import { IsNotEmpty, IsString } from 'class-validator';

export class DeletePermissionDTO {
  @IsNotEmpty()
  @IsString()
  role_id: string;
}
