import { applyDecorators, UseFilters, UseInterceptors } from '@nestjs/common';
import { ResponseFilter } from './response.filter';
import { ResponseInterceptor } from './response.interceptor';
import { IApplyDecorator } from './response.interface';

export function ResponseStatusCode(): IApplyDecorator {
  return applyDecorators(
    UseInterceptors(ResponseInterceptor),
    UseFilters(ResponseFilter),
  );
}
