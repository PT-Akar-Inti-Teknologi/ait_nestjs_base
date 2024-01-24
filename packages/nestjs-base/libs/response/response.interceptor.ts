import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  InternalServerErrorException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MessageService } from '../message/message.service';

// This interceptor for restructure response success
@Injectable()
export class ResponseInterceptor
  implements NestInterceptor<Promise<any> | string>
{
  constructor(private readonly messageService: MessageService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<Promise<any> | string>> {
    return next.handle().pipe(
      map(async (response: Promise<Record<string, any> | string>) => {
        const data: Record<string, any> | string = await response;

        // response error must in object
        if (typeof data !== 'object') {
          throw new InternalServerErrorException(
            this.messageService.get('response.statusCode.mustInObject'),
          );
        }

        const { statusCode, ...others } = data;
        return {
          statusCode: statusCode,
          ...others,
        };
      }),
    );
  }
}
