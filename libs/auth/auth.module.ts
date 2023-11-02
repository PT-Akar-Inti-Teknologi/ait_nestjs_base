import { Module, DynamicModule, Global } from '@nestjs/common';
import { AuthService } from './auth.service';
import { HttpModule } from '@nestjs/axios';
import { JwtModule } from '@nestjs/jwt';
import { AitAuthConfig } from './guard/interface/auth-config.interface';

@Global()
@Module({})
export class AitAuthModule {
  static register(config: AitAuthConfig): DynamicModule {
    return {
      module: AitAuthModule,
      imports: [
        HttpModule,
        JwtModule.register({
          secret: config.jwtSecretKey,
          signOptions: {
            expiresIn: config.jwtExpirationTime,
          },
        }),
      ],
      controllers: [],
      exports: [AuthService],
      providers: [
        {
          provide: AitAuthConfig,
          useValue: config,
        },
        AuthService,
      ],
    };
  }
}
