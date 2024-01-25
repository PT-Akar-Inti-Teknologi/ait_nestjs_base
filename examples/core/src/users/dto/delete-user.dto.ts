import { IsNotEmpty, IsString } from 'class-validator';

export class DeleteUserDTO {
  @IsNotEmpty()
  @IsString()
  admin_password: string;
}
