import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { MainPagingDTO } from '@pt-akar-inti-teknologi/nestjs-base';

export class GetUserRolesDTO extends MainPagingDTO {
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  is_active: boolean;
}
