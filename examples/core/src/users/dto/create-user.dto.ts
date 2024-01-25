import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 15)
  // @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)[\w\W][^\n]+/g, { // entah kenapa regex ini tidak bisa jalan dengan benar , kadang jalan kadang tidak
  //   message: 'At least 1 digit, 1 uppercase and 1 symbol',
  // })
  password: string;

  @IsNotEmpty()
  @IsString()
  role_id: string;

  @IsOptional()
  @IsBoolean()
  is_active: boolean;

  // @IsNotEmpty()
  // @IsString()
  // admin_password: string;
}
