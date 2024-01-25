import {
  IsString,
  Length,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEmail,
  IsNumberString,
  IsDateString,
  IsOptional,
  IsIn,
  IsUUID,
} from 'class-validator';
import { EnumGender } from '../entities/member.entity';

export class CreateMemberDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  email: string;

  @IsNotEmpty()
  @IsNumberString()
  @Length(9, 14)
  phone: string;

  @IsNotEmpty()
  @IsIn(Object.values(EnumGender))
  gender: EnumGender;

  @IsNotEmpty()
  @IsDateString()
  dob: Date;

  @IsOptional()
  @IsString()
  photo: string;

  @IsOptional()
  @IsUUID()
  postal_code_id: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  address: string;

  @IsOptional()
  @IsString()
  password: string;
}
