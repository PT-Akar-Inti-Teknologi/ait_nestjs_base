import { MainPagingDTO } from '@pt-akar-inti-teknologi/nestjs-base';
import { Type } from 'class-transformer';
import { IsOptional, IsISO8601, IsArray } from 'class-validator';

export class GetAuditTrailDTO extends MainPagingDTO {
  @IsOptional()
  @IsISO8601()
  start_date?: Date;

  @IsOptional()
  @IsISO8601()
  end_date?: Date;

  @IsOptional()
  @IsArray()
  user_ids: string[];
}
