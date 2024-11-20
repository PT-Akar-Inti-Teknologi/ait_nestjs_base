import { Transform } from 'class-transformer';
import { IsArray, IsBoolean, IsOptional } from 'class-validator';
import { MainPagingDTO } from '@pt-akar-inti-teknologi/nestjs-base';

export class GetUserDTO extends MainPagingDTO {
  @IsOptional()
  @IsArray()
  role_ids: string[];

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_active: boolean;
}
