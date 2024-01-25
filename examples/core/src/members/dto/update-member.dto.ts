import { PartialType } from '@nestjs/mapped-types';
import { CreateMemberDTO } from './create-member.dto';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateMemberDTO extends PartialType(CreateMemberDTO) {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  no_member: string;
}
