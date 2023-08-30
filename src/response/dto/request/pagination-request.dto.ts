import { Type } from 'class-transformer';
import { Builder } from 'builder-pattern';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class PaginationRequestDTO {
  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public page = 0;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  public size = 10;

  @IsOptional()
  @IsString()
  public search = '';

  @IsOptional()
  @IsString()
  public sort: string;

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  public order: 'ASC' | 'DESC';

  public static Builder() {
    return Builder(this);
  }
}
