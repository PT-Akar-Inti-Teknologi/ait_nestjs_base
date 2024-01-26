import { Transform } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsISO8601,
} from 'class-validator';
import { MainPagingDTO } from '@ait/nestjs-base';

export class GetMemberPhotoDTO {
  @IsNotEmpty()
  @IsString()
  filename: string;
}

export class GetMemberDTO extends MainPagingDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_active: boolean;

  @IsOptional()
  @IsISO8601()
  start_date?: string;

  @IsOptional()
  @IsISO8601()
  end_date?: string;
}
