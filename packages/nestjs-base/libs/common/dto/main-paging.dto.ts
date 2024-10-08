import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class MainPagingDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  page = 0;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  size = 10;

  @IsOptional()
  @IsString()
  search = '';

  @IsOptional()
  @IsString()
  sort: string;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC';
}

export interface MainPagingDTOMapper<DTO extends MainPagingDTO> {
  page: keyof DTO;
  size: keyof DTO;
  search: keyof DTO;
  sort: keyof DTO;
  order: keyof DTO;
}
