import { Global, Module, DynamicModule } from '@nestjs/common';
import {
  ResponseService,
  ResponseServiceImpl,
} from '../response/response.service';
import { ResponseServiceConfig } from './response.interface';

@Global()
@Module({})
export class AitResponseModule {
  static register(config: ResponseServiceConfig): DynamicModule {
    return {
      module: AitResponseModule,
      providers: [
        {
          provide: ResponseServiceConfig,
          useValue: config,
        },
        {
          provide: ResponseService,
          useClass: ResponseServiceImpl,
        },
      ],
      exports: [ResponseService],
      imports: [],
    };
  }
}
