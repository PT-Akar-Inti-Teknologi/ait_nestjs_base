import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsOptional()
  @Length(8, 15)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  new_password: string;
}
