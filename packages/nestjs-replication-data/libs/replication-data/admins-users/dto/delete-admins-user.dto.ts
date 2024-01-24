import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class DeleteAdminsUserDTO {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  user_id: string;
}
